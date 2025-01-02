import { Dayjs } from "dayjs";

export interface ClinicalImpressionFormData {
  assessor: {
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
  date: Dayjs;
  previous?: string;
  description?: string;
  summary: string;
  note?: string;
  supportingInfo?: FileList;
}
