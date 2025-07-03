import { ClinicalImpression, DocumentReference } from "fhir/r4";
import dayjs, { Dayjs } from "dayjs";
import { ClinicalImpressionFormData } from "../../Models/Forms/ClinicalImpressionForm";
import FileManager from "../FileManager";
import FhirResourceService from "../FhirService";

export default class ClinicalImpressionUtils {
  public static ClinicalImpressionFormDataToClinicalImpression(
    data: ClinicalImpressionFormData,
    supportingInfoDocument?: DocumentReference
  ): ClinicalImpression {
    return {
      resourceType: "ClinicalImpression",
      status: "completed",
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
      supportingInfo: supportingInfoDocument
        ? [{ reference: `DocumentReference/${supportingInfoDocument.id}` }]
        : undefined,
    } as ClinicalImpression;
  }

  public static async ClinicalImpressionToClinicalImpressionFormData(
    clinicalImpression: ClinicalImpression,
    loadFiles: boolean = false
  ): Promise<ClinicalImpressionFormData> {
    let dataFiles: FileList | undefined = undefined;

    if (loadFiles && !clinicalImpression.supportingInfo?.length) {
      const fhirResourceService =
        FhirResourceService.getInstance<DocumentReference>("DocumentReference");
      const resultFiles = await fhirResourceService.getById(
        clinicalImpression.supportingInfo?.[0]?.reference?.split("/")[1] || ""
      );
      const supportingInfoFiles: DocumentReference[] = resultFiles.success
        ? [resultFiles.data]
        : [];

      dataFiles = await FileManager.documentReferenceToFiles(
        supportingInfoFiles[0]
      );
    }

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
      supportingInfo: dataFiles,
    };
  }
}
