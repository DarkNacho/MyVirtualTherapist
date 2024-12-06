import { createContext, useContext, useState, ReactNode } from "react";
import { Patient } from "fhir/r4";

interface PatientContextType {
  patient: Patient | undefined;
  setPatient: (patient: Patient | undefined) => void;
}

const PatientContext = createContext<PatientContextType | undefined>(undefined);

export const PatientProvider = ({ children }: { children: ReactNode }) => {
  const [patient, setPatient] = useState<Patient | undefined>();

  return (
    <PatientContext.Provider value={{ patient, setPatient }}>
      {children}
    </PatientContext.Provider>
  );
};

export const usePatient = () => {
  const context = useContext(PatientContext);
  if (!context) {
    throw new Error("usePatient must be used within a PatientProvider");
  }
  return context;
};
