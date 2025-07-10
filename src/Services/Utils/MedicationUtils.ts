import { Coding, DocumentReference, MedicationStatement } from "fhir/r4";
import { MedicationFormData } from "../../Models/Forms/MedicationForm";
import dayjs from "dayjs";
import FhirResourceService from "../FhirService";
import FileManager from "../FileManager";

export default class MedicationUtils {
  public static getName(medication: MedicationStatement): string {
    return (
      medication.medicationCodeableConcept?.coding?.[0]?.display ||
      medication.medicationCodeableConcept?.text ||
      (medication.medicationCodeableConcept?.coding?.[0]?.system &&
      medication.medicationCodeableConcept?.coding?.[0]?.code
        ? `${medication.medicationCodeableConcept.coding[0].system} - ${medication.medicationCodeableConcept.coding[0].code}`
        : "N/A")
    );
  }

  public static getValue(medication: MedicationStatement): string {
    return (
      medication.status ||
      medication.medicationCodeableConcept?.coding?.[0]?.display ||
      medication.medicationCodeableConcept?.text ||
      (medication.medicationCodeableConcept?.coding?.[0]?.system &&
      medication.medicationCodeableConcept?.coding?.[0]?.code
        ? `${medication.medicationCodeableConcept.coding[0].system} - ${medication.medicationCodeableConcept.coding[0].code}`
        : "N/A")
    );
  }

  public static MedicationFormDataToMedicationStatement(
    data: MedicationFormData,
    supportingInfoDocument?: DocumentReference
  ): MedicationStatement {
    const medicationStatement: MedicationStatement = {
      resourceType: "MedicationStatement",
      status: "active",
      medicationCodeableConcept: {
        coding: [data.medication],
      },
      subject: {
        reference: `Patient/${data.subject.id}`,
        display: data.subject.display,
      },
      context: {
        reference: `Encounter/${data.encounter.id}`,
        display: data.encounter.display,
      },
      informationSource: {
        reference: `Practitioner/${data.performer.id}`,
        display: data.performer.display,
      },
      effectivePeriod: {
        start: data.startDate.toISOString(),
        end: data.endDate.toISOString(),
      },
      derivedFrom: supportingInfoDocument
        ? [{ reference: `DocumentReference/${supportingInfoDocument.id}` }]
        : undefined,
    };

    return medicationStatement;
  }

  public static async MedicationStatementToMedicationFormData(
    medicationStatement: MedicationStatement,
    loadFiles: boolean = false
  ): Promise<MedicationFormData> {
    let dataFiles: FileList | undefined = undefined;

    // Load files if requested and there is a derivedFrom DocumentReference
    if (
      loadFiles &&
      medicationStatement.derivedFrom &&
      medicationStatement.derivedFrom.length > 0
    ) {
      const docRefId =
        medicationStatement.derivedFrom[0].reference?.split("/")[1] || "";
      if (docRefId) {
        const fhirResourceService =
          FhirResourceService.getInstance<DocumentReference>(
            "DocumentReference"
          );
        const resultFiles = await fhirResourceService.getById(docRefId);
        const supportingInfoFiles: DocumentReference[] = resultFiles.success
          ? [resultFiles.data]
          : [];
        dataFiles = await FileManager.documentReferenceToFiles(
          supportingInfoFiles[0]
        );
      }
    }

    return {
      subject: {
        id: medicationStatement.subject?.reference?.split("/")[1] || "",
        display: medicationStatement.subject?.display || "",
      },
      encounter: {
        id: medicationStatement.context?.reference?.split("/")[1] || "",
        display: medicationStatement.context?.display || "",
      },
      performer: {
        id:
          medicationStatement.informationSource?.reference?.split("/")[1] || "",
        display: medicationStatement.informationSource?.display || "",
      },
      medication:
        medicationStatement.medicationCodeableConcept?.coding?.[0] ||
        ({} as Coding),
      startDate: medicationStatement.effectivePeriod?.start
        ? dayjs(medicationStatement.effectivePeriod.start)
        : dayjs(),
      endDate: medicationStatement.effectivePeriod?.end
        ? dayjs(medicationStatement.effectivePeriod.end)
        : dayjs(),
      supportingInfo: dataFiles,
    } as MedicationFormData;
  }
}
