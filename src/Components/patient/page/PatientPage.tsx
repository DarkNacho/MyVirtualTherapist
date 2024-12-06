import { useEffect } from "react";
import PatientCard from "./PatientCard";
import { Patient } from "fhir/r4";
import { usePatient } from "../PatientContext";
import { useParams } from "react-router-dom";
import FhirResourceService from "../../../Services/FhirService";
import HandleResult from "../../../Utils/HandleResult";

export default function PatientPage() {
  const { id } = useParams<{ id: string }>();
  const { patient, setPatient } = usePatient(); // Use the context

  useEffect(() => {
    const fetchPatient = async () => {
      if (!patient || patient.id !== id) {
        const fhirService = FhirResourceService.getInstance<Patient>("Patient");
        const response = await HandleResult.handleOperation(
          () => fhirService.getById(id!),
          "Patient fetched successfully",
          "Fetching patient"
        );
        if (response.success) {
          setPatient(response.data);
        }
      }
    };

    fetchPatient();
  }, [id, patient, setPatient]);

  const handleDownloadReport = () => {
    console.log("Download report clicked");
  };

  const handleRefer = () => {
    console.log("Refer clicked");
  };

  return (
    <div>
      <PatientCard
        patient={patient}
        onDownloadReport={handleDownloadReport}
        onRefer={handleRefer}
      />
    </div>
  );
}
