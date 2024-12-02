import { Condition } from "fhir/r4";
import ResourceService from "./FhirService";
import { SearchParams } from "fhir-kit-client";

export default class ConditionService extends ResourceService<Condition> {
  constructor() {
    super("Condition");
  }

  private async getAllConditions(
    params?: SearchParams
  ): Promise<Result<Condition[]>> {
    let conditions: Condition[] = [];
    const result = await this.getResources(params);

    if (!result.success) return result;

    conditions = [...conditions, ...result.data]; //conditions.concat(result.data);

    while (this.hasNextPage) {
      const res = await this.getNewResources("next");
      if (!res.success) return res;

      conditions = [...conditions, ...res.data]; //conditions.concat(res.data);
    }

    return { success: true, data: conditions };
  }

  //ve que tenga una referencia a un QuestionnaireResponse en evidence
  public async getConditionsWithQuestionnaireResponse(
    subjectID: string,
    questionnaireResponseID: string
  ): Promise<Result<Condition[]>> {
    const result = await this.getAllConditions({ subject: subjectID });
    if (!result.success) return result;
    const conditions = result.data.filter((item) =>
      item.evidence?.some((evidence) =>
        evidence.detail?.some(
          (detail) =>
            detail.reference ===
            `QuestionnaireResponse/${questionnaireResponseID}`
        )
      )
    );
    return { success: true, data: conditions };
  }
}
