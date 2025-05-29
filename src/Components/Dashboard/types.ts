export interface DashboardProps {
  oxygenSaturationData: number[];
  heartRateData: number[];
  respiratoryRateData: number[];
  patientId?: string;
}

export interface PatientData {
  id: string;
  name: {
    given: string[];
    family: string;
  };
  birthDate: string;
  gender: string;
  address: {
    line: string[];
    city: string;
    postalCode: string;
  }[];
  telecom: {
    system: string;
    value: string;
  }[];
  identifier: {
    system: string;
    value: string;
  }[];
}

export interface Encounter {
  id: string;
  period: {
    start: string;
  };
  type: {
    text: string;
  }[];
  status: string;
}

export interface Questionnaire {
  id: string;
  title: string;
  date: string;
  status: string;
} 