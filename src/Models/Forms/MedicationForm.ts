import { Dayjs } from "dayjs";
import { Coding } from "fhir/r4";

export interface MedicationFormData {
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

  medication: Coding;

  note: string;
  startDate: Dayjs;
  endDate: Dayjs;
  supportingInfo?: FileList;
}
