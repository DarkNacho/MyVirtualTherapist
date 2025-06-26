import { ClinicalImpression, DocumentReference } from "fhir/r4";
import dayjs, { Dayjs } from "dayjs";
import { ClinicalImpressionFormData } from "../../Models/Forms/ClinicalImpressionForm";
import FileManager from "../FileManager";

export default class ClinicalImpressionUtils {
  /**
   * Uploads supportingInfo files as DocumentReferences.
   * @param supportingInfo The FileList containing the files to upload.
   * @returns An array of DocumentReference resources.
   */
  public static async uploadSupportingInfoFiles(
    supportingInfo?: FileList
  ): Promise<DocumentReference[]> {
    if (!supportingInfo) return [];

    return await Promise.all(
      Array.from(supportingInfo).map((file) =>
        FileManager.uploadFileAsDocumentReference(file)
      )
    );
  }

  public static ClinicalImpressionFormDataToClinicalImpression(
    data: ClinicalImpressionFormData,
    supportingInfoReferences: DocumentReference[]
  ): ClinicalImpression {
    // Step 2: Map DocumentReferences to supportingInfo references
    const supportingInfo = supportingInfoReferences.map((docRef) => ({
      reference: `DocumentReference/${docRef.id}`,
      display: docRef.content?.[0]?.attachment?.title || "Unnamed Document",
    }));

    // Step 3: Build the ClinicalImpression resource
    return {
      resourceType: "ClinicalImpression",
      subject: {
        reference: `Patient/${data.subject.id}`,
        display: data.subject.display,
      },
      encounter: {
        reference: `Encounter/${data.encounter.id}`,
        display: data.encounter.display,
      },
      assessor: {
        reference: `Practitioner/${data.assessor.id}`,
        display: data.assessor.display,
      },
      date: data.date.toISOString(),
      previous: data.previous ? { reference: data.previous } : undefined,
      description: data.description,
      summary: data.summary,
      note: data.note ? [{ text: data.note }] : undefined,
      supportingInfo: supportingInfo.length > 0 ? supportingInfo : undefined,
    } as ClinicalImpression;
  }

  public static async ClinicalImpressionToClinicalImpressionFormData(
    clinicalImpression: ClinicalImpression
  ): Promise<ClinicalImpressionFormData> {
    // Step 1: Retrieve DocumentReferences from supportingInfo
    const documentReferences = clinicalImpression.supportingInfo
      ? await Promise.all(
          clinicalImpression.supportingInfo.map((info) =>
            FileManager.getDocumentReference(
              info.reference?.split("/")[1] || ""
            )
          )
        )
      : [];

    // Step 2: Map DocumentReferences to File objects (mocked, as original files are not retrievable)
    const supportingInfoFiles: File[] = documentReferences
      .map((docRef) => {
        const title =
          docRef.content?.[0]?.attachment?.title || "Unnamed Document";
        const data = docRef.content?.[0]?.attachment?.data;
        if (data) {
          // Decode base64 to binary
          const byteString = atob(data);
          const ab = new ArrayBuffer(byteString.length);
          const ia = new Uint8Array(ab);
          for (let i = 0; i < byteString.length; i++) {
            ia[i] = byteString.charCodeAt(i);
          }
          const blob = new Blob([ab], {
            type:
              docRef.content?.[0]?.attachment?.contentType ||
              "application/octet-stream",
          });
          return new File([blob], title);
        }
        return undefined;
      })
      .filter((file): file is File => !!file);

    // Helper to convert File[] to FileList
    function fileArrayToFileList(files: File[]): FileList {
      const dataTransfer = new DataTransfer();
      files.forEach((file) => dataTransfer.items.add(file));
      return dataTransfer.files;
    }

    // Step 3: Build the ClinicalImpressionFormData object
    return {
      subject: {
        id: clinicalImpression.subject?.reference?.split("/")[1] || "",
        display: clinicalImpression.subject?.display || "",
      },
      encounter: {
        id: clinicalImpression.encounter?.reference?.split("/")[1] || "",
        display: clinicalImpression.encounter?.display || "",
      },
      assessor: {
        id: clinicalImpression.assessor?.reference?.split("/")[1] || "",
        display: clinicalImpression.assessor?.display || "",
      },
      date: (dayjs(clinicalImpression.date) as Dayjs) || dayjs(),
      previous: clinicalImpression.previous?.reference || undefined,
      description: clinicalImpression.description || undefined,
      summary: clinicalImpression.summary || "",
      note: clinicalImpression.note?.[0]?.text || undefined,
      supportingInfo:
        supportingInfoFiles.length > 0
          ? fileArrayToFileList(supportingInfoFiles)
          : undefined,
    };
  }
}
