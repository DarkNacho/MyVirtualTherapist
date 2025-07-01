import { useEffect, useState } from "react";
import { Grid } from "@mui/material";
import ResourceList from "../../resource-list/ResourceList";
import NotesIcon from "@mui/icons-material/Notes";
import ConditionIcon from "@mui/icons-material/MonitorHeartSharp";
import MedicationIcon from "@mui/icons-material/Medication";
import {
  Condition,
  MedicationStatement,
  Patient,
  ClinicalImpression,
} from "fhir/r4";
import FhirResourceService from "../../../Services/FhirService";
import HandleResult from "../../../Utils/HandleResult";

import ConditionUtils from "../../../Services/Utils/ConditionUtils";
import MedicationUtils from "../../../Services/Utils/MedicationUtils";
import ConditionCreateComponent from "../../condition/ConditionCreateComponent";
import MedicationCreateComponent from "../../medication/MedicationCreateComponent";
import { useResource } from "../../ResourceContext";
import ClinicalImpressionCreateComponent from "../../clinical-impression/ClinicalImpressionCreateComponent";
import { useTranslation } from "react-i18next";
import { isAdminOrPractitioner } from "../../../Utils/RolUser";
import dayjs from "dayjs";

function getEvolutionDisplay(evolution: ClinicalImpression) {
  return {
    leftTitle: evolution.description || "N/A",
    leftSubtitle: evolution.note?.[0].text
      ? evolution.note[0].text.length > 25
        ? `${evolution.note[0].text.substring(0, 25)}...`
        : evolution.note[0].text
      : "N/A",
    rightText: dayjs(evolution.date).format("DD-MM-YYYY HH:mm") || "N/A",
  };
}

function getConditionDisplay(condition: Condition) {
  return {
    leftTitle: ConditionUtils.getName(condition),
    leftSubtitle: condition.note?.[0].text
      ? condition.note[0].text.length > 25
        ? `${condition.note[0].text.substring(0, 25)}...`
        : condition.note[0].text
      : "N/A",
    rightText:
      dayjs(condition.recordedDate).format("DD-MM-YYYY HH:mm") || "N/A",
  };
}

function getMedicationDisplay(medication: MedicationStatement) {
  return {
    leftTitle: MedicationUtils.getName(medication),
    leftSubtitle: medication.note?.[0].text
      ? medication.note[0].text.length > 25
        ? `${medication.note[0].text.substring(0, 25)}...`
        : medication.note[0].text
      : "N/A",
    rightText:
      dayjs(medication.effectivePeriod?.start).format("DD-MM-YYYY HH:mm") ||
      "N/A",
  };
}

export default function PatientOverviewTab({
  patientId,
}: {
  patientId?: string;
}) {
  const [evolution, setEvolution] = useState<ClinicalImpression[] | undefined>(
    undefined
  );
  const [conditions, setConditions] = useState<Condition[] | undefined>(
    undefined
  );
  const [medications, setMedications] = useState<
    MedicationStatement[] | undefined
  >(undefined);

  const [selectedEvolution, setSelectedEvolution] = useState<
    ClinicalImpression | undefined
  >(undefined);
  const [selectedCondition, setSelectedCondition] = useState<
    Condition | undefined
  >(undefined);
  const [selectedMedication, setSelectedMedication] = useState<
    MedicationStatement | undefined
  >(undefined);

  const [isEvolutionOpen, setIsEvolutionOpen] = useState(false);
  const [isConditionOpen, setIsConditionOpen] = useState(false);
  const [isMedicationOpen, setIsMedicationOpen] = useState(false);
  const [id, setId] = useState<string | undefined>(undefined);
  const { resource } = useResource<Patient>();

  const isAdminOrPractitionerUser = isAdminOrPractitioner();
  const { t } = useTranslation();

  const fetchEvolution = async (id: string) => {
    const fhirService =
      FhirResourceService.getInstance<ClinicalImpression>("ClinicalImpression");
    /*const response = await HandleResult.handleOperation(
      () => fhirService.getResources({ patient: id }),
      "Evolution fetched successfully",
      "Fetching Evolution"
    );*/
    const response = await HandleResult.handleOperationWithErrorOnly(() =>
      fhirService.getResources({ patient: id })
    );
    if (response.success) {
      setEvolution(response.data);
    }
  };

  const fetchConditions = async (id: string) => {
    const fhirService = FhirResourceService.getInstance<Condition>("Condition");
    /*const response = await HandleResult.handleOperation(
      () => fhirService.getResources({ patient: id }),
      "Conditions fetched successfully",
      "Fetching conditions"
    );*/
    const response = await HandleResult.handleOperationWithErrorOnly(() =>
      fhirService.getResources({ patient: id })
    );
    if (response.success) {
      setConditions(response.data);
    }
  };

  const fetchMedications = async (id: string) => {
    const fhirService = FhirResourceService.getInstance<MedicationStatement>(
      "MedicationStatement"
    );

    /*const response = await HandleResult.handleOperation(
      () => fhirService.getResources({ patient: id }),
      "Medications fetched successfully",
      "Fetching medications"
    );*/
    const response = await HandleResult.handleOperationWithErrorOnly(() =>
      fhirService.getResources({ patient: id })
    );
    if (response.success) {
      setMedications(response.data);
    }
  };

  useEffect(() => {
    const id = patientId || resource?.id;
    if (id) {
      fetchEvolution(id);
      fetchConditions(id);
      fetchMedications(id);
      setId(id);
    }
  }, [patientId, resource]);

  const handleEvolutionClick = (evolution: ClinicalImpression) => {
    console.log("Evolution clicked", evolution);
    setSelectedEvolution(evolution);
    setIsEvolutionOpen(true);
  };

  const handleConditionClick = (condition: Condition) => {
    console.log("Condition clicked", condition);
    setSelectedCondition(condition);
    setIsConditionOpen(true);
  };

  const handleMedicationClick = (medication: MedicationStatement) => {
    console.log("Medication clicked", medication);
    setSelectedMedication(medication);
    setIsMedicationOpen(true);
  };

  const handleAddEvolutionClick = () => {
    setIsEvolutionOpen(true);
  };

  const handleAddConditionClick = () => {
    setIsConditionOpen(true);
  };

  const handleAddMedicationClick = () => {
    setIsMedicationOpen(true);
  };

  const handleEvolutionOpen = (isOpen: boolean) => {
    setIsEvolutionOpen(isOpen);
    if (!isOpen) {
      setSelectedEvolution(undefined);
    }
  };

  const handleConditionOpen = (isOpen: boolean) => {
    setIsConditionOpen(isOpen);
    if (!isOpen) {
      setSelectedCondition(undefined);
    }
  };

  const handleMedicationOpen = (isOpen: boolean) => {
    setIsMedicationOpen(isOpen);
    if (!isOpen) {
      setSelectedMedication(undefined);
    }
  };

  return (
    <>
      <Grid container spacing={2}>
        <Grid item xs={12} md={4}>
          <ResourceList
            title={t("patientPage.evolutions")}
            Icon={NotesIcon}
            resources={evolution}
            onClick={handleEvolutionClick}
            getDisplay={getEvolutionDisplay}
            onAddClick={
              isAdminOrPractitionerUser ? handleAddEvolutionClick : undefined
            }
          />
        </Grid>
        <Grid item xs={12} md={4}>
          <ResourceList
            title={t("patientPage.conditions")}
            Icon={ConditionIcon}
            resources={conditions}
            onClick={handleConditionClick}
            getDisplay={getConditionDisplay}
            onAddClick={
              isAdminOrPractitionerUser ? handleAddConditionClick : undefined
            }
          />
        </Grid>
        <Grid item xs={12} md={4}>
          <ResourceList
            title={t("patientPage.medications")}
            Icon={MedicationIcon}
            resources={medications}
            onClick={handleMedicationClick}
            getDisplay={getMedicationDisplay}
            onAddClick={
              isAdminOrPractitionerUser ? handleAddMedicationClick : undefined
            }
          />
        </Grid>
      </Grid>
      {id && isAdminOrPractitionerUser && (
        <>
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
          <ClinicalImpressionCreateComponent
            patientId={id}
            onOpen={handleEvolutionOpen}
            isOpen={isEvolutionOpen}
            clinicalImpression={selectedEvolution}
          />
        </>
      )}
    </>
  );
}
