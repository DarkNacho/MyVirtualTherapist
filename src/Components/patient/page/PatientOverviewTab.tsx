import { useEffect, useState } from "react";
import { Grid } from "@mui/material";
import ResourceList from "../../resource-list/ResourceList";
import NotesIcon from "@mui/icons-material/Notes";
import ConditionIcon from "@mui/icons-material/MonitorHeartSharp";
import MedicationIcon from "@mui/icons-material/Medication";
import { Observation, Condition, MedicationStatement } from "fhir/r4";
import FhirResourceService from "../../../Services/FhirService";
import HandleResult from "../../../Utils/HandleResult";
import ObservationUtils from "../../../Services/Utils/ObservationUtils";
import ConditionUtils from "../../../Services/Utils/ConditionUtils";
import MedicationUtils from "../../../Services/Utils/MedicationUtils";
import ObservationCreateComponent from "../../observation/ObservationCreateComponent";
import ConditionCreateComponent from "../../condition/ConditionCreateComponent";
import MedicationCreateComponent from "../../medication/MedicationCreateComponent";
import { usePatient } from "../PatientContext";

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

export default function PatientOverviewTab({
  patientId,
}: {
  patientId?: string;
}) {
  const [observations, setObservations] = useState<Observation[] | undefined>(
    undefined
  );
  const [conditions, setConditions] = useState<Condition[] | undefined>(
    undefined
  );
  const [medications, setMedications] = useState<
    MedicationStatement[] | undefined
  >(undefined);
  const [isObservationOpen, setIsObservationOpen] = useState(false);
  const [isConditionOpen, setIsConditionOpen] = useState(false);
  const [isMedicationOpen, setIsMedicationOpen] = useState(false);
  const [id, setId] = useState<string | undefined>(undefined);
  const { patient } = usePatient();

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
    const id = patientId || patient?.id;
    if (id) {
      fetchObservations(id);
      fetchConditions(id);
      fetchMedications(id);
      setId(id);
    }
  }, [patientId, patient]);

  const handleObservationClick = (observation: Observation) => {
    console.log("Observation clicked", observation);
  };

  const handleConditionClick = (condition: Condition) => {
    console.log("Condition clicked", condition);
  };

  const handleMedicationClick = (medication: MedicationStatement) => {
    console.log("Medication clicked", medication);
  };

  const handleAddObservationClick = () => {
    setIsObservationOpen(true);
  };

  const handleAddConditionClick = () => {
    setIsConditionOpen(true);
  };

  const handleAddMedicationClick = () => {
    setIsMedicationOpen(true);
  };

  const handleObservationOpen = (isOpen: boolean) => {
    setIsObservationOpen(isOpen);
  };

  const handleConditionOpen = (isOpen: boolean) => {
    setIsConditionOpen(isOpen);
  };

  const handleMedicationOpen = (isOpen: boolean) => {
    setIsMedicationOpen(isOpen);
  };

  return (
    <>
      <Grid container spacing={2}>
        <Grid item xs={12} md={4}>
          <ResourceList
            title="Observaciones"
            Icon={NotesIcon}
            resources={observations}
            onClick={handleObservationClick}
            getDisplay={getObservationDisplay}
            onAddClick={handleAddObservationClick}
          />
        </Grid>
        <Grid item xs={12} md={4}>
          <ResourceList
            title="Condiciones"
            Icon={ConditionIcon}
            resources={conditions}
            onClick={handleConditionClick}
            getDisplay={getConditionDisplay}
            onAddClick={handleAddConditionClick}
          />
        </Grid>
        <Grid item xs={12} md={4}>
          <ResourceList
            title="Medicaciones"
            Icon={MedicationIcon}
            resources={medications}
            onClick={handleMedicationClick}
            getDisplay={getMedicationDisplay}
            onAddClick={handleAddMedicationClick}
          />
        </Grid>
      </Grid>
      {id && (
        <>
          <ObservationCreateComponent
            patientId={id}
            onOpen={handleObservationOpen}
            isOpen={isObservationOpen}
          />
          <ConditionCreateComponent
            patientId={id}
            onOpen={handleConditionOpen}
            isOpen={isConditionOpen}
          />
          <MedicationCreateComponent
            patientId={id}
            onOpen={handleMedicationOpen}
            isOpen={isMedicationOpen}
          />
        </>
      )}
    </>
  );
}
