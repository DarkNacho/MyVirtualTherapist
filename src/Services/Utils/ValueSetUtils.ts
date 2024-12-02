import { Coding, ValueSet } from "fhir/r4";

export default class ValueSetUtils {
  static convertValueSetToCodingArray(valueSet: ValueSet) {
    const codingArray: Coding[] = [];

    valueSet.compose?.include.forEach((include) => {
      include.concept?.forEach((concept) => {
        const codingObject = {
          system: include.system,
          code: concept.code,
          display: concept.display,
        };
        codingArray.push(codingObject);
      });
    });

    return codingArray;
  }
}
