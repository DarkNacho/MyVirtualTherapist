import { Observation } from "fhir/r4";
import FhirResourceService from "./FhirService";

export default class ObservationService extends FhirResourceService<Observation> {
  constructor() {
    super("Observation");
  }

  public async getObservationsOfQuestionnaireResponse(
    QuestionnaireResponseId: string
  ): Promise<Result<Observation[]>> {
    return this.getResources({
      "has-member": `QuestionnaireResponse/${QuestionnaireResponseId}`,
    });
  }
}
