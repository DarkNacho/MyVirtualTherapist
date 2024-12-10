import { MedicationStatement } from "fhir/r4";
import { MedicationFormData } from "../../Models/Forms/MedicationForm";

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
    data: MedicationFormData
  ) {
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
    };

    return medicationStatement;
  }
}
