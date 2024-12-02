import { Dayjs } from "dayjs";
import { Coding } from "fhir/r4";

export interface ObservationFormData {
  performer: {
    id: string;
    display: string;
  };
  subject: {
    id: string;
    display: string;
  };
  encounter: {
    id: string;
    display: string;
  };

  code: Coding;
  category: Coding[]; // https://hl7.org/fhir/valueset-observation-category.html
  interpretation: Coding[]; // https://hl7.org/fhir/valueset-observation-interpretation.html
  note: string; // https://hl7.org/fhir/datatypes.html#Annotation
  issued: Dayjs;
  valueString: string;
}
