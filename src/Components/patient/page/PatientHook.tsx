import { useEffect, useState } from "react";
import { usePatient } from "../PatientContext";

export function usePatientHook(patientId?: string) {
  const { patient, setPatient } = usePatient();
  const [effectivePatientId, setEffectivePatientId] = useState<
    string | undefined
  >(undefined);

  useEffect(() => {
    const id = patientId || patient?.id;
    if (id) {
      setEffectivePatientId(id);
    }
  }, [patientId, patient]);

  return { patient, setPatient, effectivePatientId };
}
