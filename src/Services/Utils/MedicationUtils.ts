import { MedicationStatement } from "fhir/r4";
import { MedicationFormData } from "../../Models/Forms/MedicationForm";

export default class MedicationUtils {
  public static extractMedicationInfo(
    medications: MedicationStatement[]
  ): { name: string; value: string }[] {
    return medications.map((medication) => {
      const name =
        medication.medicationCodeableConcept?.coding?.[0]?.display ||
        medication.medicationCodeableConcept?.text ||
        (medication.medicationCodeableConcept?.coding?.[0]?.system &&
        medication.medicationCodeableConcept?.coding?.[0]?.code
          ? `${medication.medicationCodeableConcept.coding[0].system} - ${medication.medicationCodeableConcept.coding[0].code}`
          : "Unknown Name");

      const value = medication.dosage?.[0]?.text || "";

      return { name, value };
    });
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
