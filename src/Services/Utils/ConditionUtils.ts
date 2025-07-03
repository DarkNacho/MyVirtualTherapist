import { Condition, DocumentReference } from "fhir/r4";
import { ConditionFormData } from "../../Models/Forms/ConditionForm";
import FhirResourceService from "../FhirService";
import FileManager from "../FileManager";

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
    data: ConditionFormData,
    supportingInfoDocument?: DocumentReference
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
      evidence: [
        {
          detail: [
            { reference: `DocumentReference/${supportingInfoDocument?.id}` },
          ],
        },
      ],
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

  public static async ConditionToConditionFormData(
    condition: Condition,
    loadFiles: boolean = false
  ): Promise<ConditionFormData> {
    let dataFiles: FileList | undefined = undefined;
    const documentReferenceId =
      condition.evidence?.[0]?.detail?.[0]?.reference?.split("/")[1];

    if (loadFiles && documentReferenceId) {
      const fhirResourceService =
        FhirResourceService.getInstance<DocumentReference>("DocumentReference");
      const resultFile = await fhirResourceService.getById(documentReferenceId);

      if (resultFile.success && resultFile.data) {
        dataFiles = await FileManager.documentReferenceToFiles(resultFile.data);
      }
    }

    return {
      code: condition.code?.coding?.[0] || {},
      subject: {
        id: condition.subject?.reference?.split("/")[1] || "",
        display: condition.subject?.display || "",
      },
      encounter: {
        id: condition.encounter?.reference?.split("/")[1] || "",
        display: condition.encounter?.display || "",
      },
      performer: {
        id: condition.recorder?.reference?.split("/")[1] || "",
        display: condition.recorder?.display || "",
      },
      note: condition.note?.[0]?.text || "",
      clinicalStatus: condition.clinicalStatus?.coding?.[0]?.code || "active",
      supportingInfo: dataFiles,
    } as ConditionFormData;
  }
}
