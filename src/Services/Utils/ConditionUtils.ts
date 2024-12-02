import { Condition } from "fhir/r4";
import { InfoListData } from "../../Models/InfoList";
import { ConditionFormData } from "../../Models/Forms/ConditionForm";

export default class ConditionUtils {
  // Función para un solo item
  public static extractSingleConditionName(condition: Condition): InfoListData {
    const id = condition.id;
    const name =
      condition.code?.coding?.[0]?.display ||
      condition.code?.text ||
      (condition.code?.coding?.[0]?.system && condition.code?.coding?.[0]?.code
        ? `${condition.code.coding[0].system} - ${condition.code.coding[0].code}`
        : "Unknown Name");

    const value =
      condition.clinicalStatus?.coding?.[0]?.display ||
      condition.clinicalStatus?.text ||
      condition.clinicalStatus?.coding?.[0]?.code ||
      condition.onsetString ||
      "No value";

    return { id, name, value };
  }

  // Función para un array de items
  public static extractConditionNames(conditions: Condition[]): InfoListData[] {
    return conditions.map((condition) =>
      this.extractSingleConditionName(condition)
    );
  }

  public static ConditionFormDataToCondition(
    data: ConditionFormData
  ): Condition {
    return {
      resourceType: "Condition",
      code: {
        coding: [
          {
            code: data.code.code,
            system: data.code.system,
            display: data.code.display,
          },
        ],
      },
      subject: {
        reference: `Patient/${data.subject.id}`,
        display: data.subject.display,
      },
      encounter: {
        reference: `Encounter/${data.encounter.id}`,
        display: data.encounter.display,
      },
      recorder: {
        //! WARNING: quizás pueda cambiar a asserter o tener ambos
        reference: `Practitioner/${data.performer.id}`,
        display: data.performer.display,
      },

      note: [{ text: data.note }],
      clinicalStatus: {
        coding: [
          {
            code: data.clinicalStatus,
            system: "http://terminology.hl7.org/CodeSystem/condition-clinical",
          },
        ],
      },
    } as Condition;
  }

  public static ConditionToConditionFormData(
    condition: Condition
  ): ConditionFormData {
    return {
      code: {
        code: condition.code?.coding?.[0]?.code || "",
        system: condition.code?.coding?.[0]?.system || "",
        display: condition.code?.coding?.[0]?.display || "",
      },
      subject: {
        id: condition.subject?.reference?.split("/")[1] || "",
        display: condition.subject?.display || "",
      },
      encounter: {
        id: condition.encounter?.reference?.split("/")[1] || "",
        display: condition.encounter?.display || "",
      },
      performer: {
        id: condition.recorder?.reference?.split("/")[1] || "", // Assuming recorder is used as performer
        display: condition.recorder?.display || "",
      },
      note: condition.note?.[0]?.text || "",
      clinicalStatus: condition.clinicalStatus?.coding?.[0]?.code || "",
    } as ConditionFormData;
  }
}
