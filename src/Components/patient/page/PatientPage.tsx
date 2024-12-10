import { useEffect, useState } from "react";
import PatientCard from "./PatientCard";
import { Observation, Patient, Condition, MedicationStatement } from "fhir/r4";
import { usePatient } from "../PatientContext";
import { useParams } from "react-router-dom";
import FhirResourceService from "../../../Services/FhirService";
import HandleResult from "../../../Utils/HandleResult";
import { Box, Grid } from "@mui/material";
import ResourceList from "../../resource-list/ResourceList";
import NotesIcon from "@mui/icons-material/Notes"; // Assuming you have this icon
import ConditionUtils from "../../../Services/Utils/ConditionUtils";
import MedicationUtils from "../../../Services/Utils/MedicationUtils";
import ObservationUtils from "../../../Services/Utils/ObservationUtils";
import MedicationIcon from "@mui/icons-material/Medication"; // Assuming you have this icon
import ConditionIcon from "@mui/icons-material/MonitorHeartSharp"; // Assuming you have this icon

function getObservationDisplay(observation: Observation) {
  return {
    leftTitle: ObservationUtils.getName(observation),
    leftSubtitle: ObservationUtils.getValue(observation),
    rightText: observation.effectiveDateTime || "N/A",
  };
}

function getConditionDisplay(condition: Condition) {
  return {
    leftTitle: ConditionUtils.getName(condition),
    leftSubtitle: ConditionUtils.getValue(condition),
    rightText: condition.onsetString || "N/A",
  };
}

function getMedicationDisplay(medication: MedicationStatement) {
  return {
    leftTitle: MedicationUtils.getName(medication),
    leftSubtitle: MedicationUtils.getValue(medication),
    rightText: medication.effectivePeriod?.start || "N/A",
  };
}

export default function PatientPage() {
  const { id } = useParams<{ id: string }>();
  const { patient, setPatient } = usePatient(); // Use the context
  const [observations, setObservations] = useState<Observation[]>([]);
  const [conditions, setConditions] = useState<Condition[]>([]);
  const [medications, setMedications] = useState<MedicationStatement[]>([]);

  const fetchPatient = async (id: string) => {
    const fhirService = FhirResourceService.getInstance<Patient>("Patient");
    const response = await HandleResult.handleOperation(
      () => fhirService.getById(id),
      "Patient fetched successfully",
      "Fetching patient"
    );
    if (response.success) {
      setPatient(response.data);
    }
  };

  const fetchObservations = async (id: string) => {
    const fhirService =
      FhirResourceService.getInstance<Observation>("Observation");
    const response = await HandleResult.handleOperation(
      () => fhirService.getResources({ patient: id }),
      "Observations fetched successfully",
      "Fetching observations"
    );
    if (response.success) {
      setObservations(response.data);
    }
  };

  const fetchConditions = async (id: string) => {
    const fhirService = FhirResourceService.getInstance<Condition>("Condition");
    const response = await HandleResult.handleOperation(
      () => fhirService.getResources({ patient: id }),
      "Conditions fetched successfully",
      "Fetching conditions"
    );
    if (response.success) {
      setConditions(response.data);
    }
  };

  const fetchMedications = async (id: string) => {
    const fhirService = FhirResourceService.getInstance<MedicationStatement>(
      "MedicationStatement"
    );
    const response = await HandleResult.handleOperation(
      () => fhirService.getResources({ patient: id }),
      "Medications fetched successfully",
      "Fetching medications"
    );
    if (response.success) {
      setMedications(response.data);
    }
  };

  useEffect(() => {
    const tempId = id || patient?.id;
    if (!tempId) {
      alert("No patient given, returning to home");
      window.location.href = "/";
      return;
    } else if (!patient && id) fetchPatient(tempId);

    fetchObservations(tempId);
    fetchConditions(tempId);
    fetchMedications(tempId);
  }, [id, patient, setPatient]);

  const handleDownloadReport = () => {
    console.log("Download report clicked");
  };

  const handleRefer = () => {
    console.log("Refer clicked");
  };

  const handleObservationClick = (observation: Observation) => {
    console.log("Observation clicked", observation);
  };

  const handleConditionClick = (condition: Condition) => {
    console.log("Condition clicked", condition);
  };

  const handleMedicationClick = (medication: MedicationStatement) => {
    console.log("Medication clicked", medication);
  };

  const handleAddClick = () => {
    console.log("Add clicked");
  };

  return (
    <Box>
      <PatientCard
        patient={patient}
        onDownloadReport={handleDownloadReport}
        onRefer={handleRefer}
      />
      <Grid container spacing={2}>
        <Grid item xs={12} md={4} maxHeight={500}>
          <ResourceList
            title="Observaciones"
            Icon={NotesIcon}
            resources={observations}
            onClick={handleObservationClick}
            getDisplay={getObservationDisplay}
            onAddClick={handleAddClick}
          />
        </Grid>
        <Grid item xs={12} md={4}>
          <ResourceList
            title="Condiciones"
            Icon={ConditionIcon}
            resources={conditions}
            onClick={handleConditionClick}
            getDisplay={getConditionDisplay}
            onAddClick={handleAddClick}
          />
        </Grid>
        <Grid item xs={12} md={4}>
          <ResourceList
            title="Medicaciones"
            Icon={MedicationIcon}
            resources={medications}
            onClick={handleMedicationClick}
            getDisplay={getMedicationDisplay}
            onAddClick={handleAddClick}
          />
        </Grid>
      </Grid>
    </Box>
  );
}
