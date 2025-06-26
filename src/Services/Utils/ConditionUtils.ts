import { Condition } from "fhir/r4";
import { ConditionFormData } from "../../Models/Forms/ConditionForm";

export default class ConditionUtils {
  public static getName(condition: Condition): string {
    return (
      condition.code?.coding?.[0]?.display ||
      condition.code?.text ||
      (condition.code?.coding?.[0]?.system && condition.code?.coding?.[0]?.code
        ? `${condition.code.coding[0].system} - ${condition.code.coding[0].code}`
        : "N/A")
    );
  }

  public static getValue(condition: Condition): string {
    return (
      condition.clinicalStatus?.coding?.[0]?.display ||
      condition.clinicalStatus?.text ||
      condition.clinicalStatus?.coding?.[0]?.code ||
      condition.onsetString ||
      "N/A"
    );
  }

  public static ConditionFormDataToCondition(
    data: ConditionFormData
  ): Condition {
    return {
      resourceType: "Condition",
      code: { coding: [data.code] },
      subject: {
        reference: `Patient/${data.subject.id}`,
        display: data.subject.display,
      },
      encounter: {
        reference: `Encounter/${data.encounter.id}`,
        display: data.encounter.display,
      },
      recorder: {
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
      /*
      evidence: data.conditionCodes.map((coding) => ({
        code: {
          coding: [
            {
              code: coding.code,
              system: coding.system,
              display: coding.display,
            },
          ],
        } as CodeableConcept,
      })),
    } as Condition;
     */
    };
  }

  public static ConditionToConditionFormData(
    condition: Condition
  ): ConditionFormData {
    return {
      code:
        condition.code?.coding?.map((coding) => ({
          code: coding.code || "",
          system: coding.system || "",
          display: coding.display || "",
        })) || [],
      subject: {
        id: condition.subject?.reference?.split("/")[1] || "",
        display: condition.subject?.display || "",
      },
      encounter: {
        id: condition.encounter?.reference?.split("/")[1] || "",
        display: condition.encounter?.display || "",
      },
      encounterId: condition.encounter?.reference?.split("/")[1] || "",
      performer: {
        id: condition.recorder?.reference?.split("/")[1] || "",
        display: condition.recorder?.display || "",
      },
      note: condition.note?.[0]?.text || "",
      clinicalStatus: condition.clinicalStatus?.coding?.[0]?.code || "",
      conditionCodes:
        condition.evidence?.map((evidence) => ({
          code: evidence.code?.[0]?.coding?.[0]?.code || "",
          system: evidence.code?.[0]?.coding?.[0]?.system || "",
          display: evidence.code?.[0]?.coding?.[0]?.display || "",
        })) || [],
    } as ConditionFormData;
  }
}
