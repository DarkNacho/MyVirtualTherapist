import { Dayjs } from "dayjs";

export interface EncounterFormData {
  practitioner: {
    id: string;
    display: string;
  };
  patient: {
    id: string;
    display: string;
  };
  day: Dayjs;
  start: Dayjs;
  end: Dayjs;
  type: string;
  seguimiento?: {
    id: string;
    display: string;
  };
}
