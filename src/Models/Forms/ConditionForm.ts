import { Coding } from "fhir/r4";

export interface ConditionFormData {
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
  encounterId: string;
  code: Coding;
  note: string; // https://hl7.org/fhir/datatypes.html#Annotation
  clinicalStatus: string;
  supportingInfo: FileList | undefined; // DocumentReference
}
