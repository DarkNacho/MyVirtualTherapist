import { useEffect, useState } from "react";
import { Grid } from "@mui/material";
import ResourceList from "../../resource-list/ResourceList";
import NotesIcon from "@mui/icons-material/Notes";
import ConditionIcon from "@mui/icons-material/MonitorHeartSharp";
import { Condition, ClinicalImpression, Encounter } from "fhir/r4";
import FhirResourceService from "../../../Services/FhirService";
import HandleResult from "../../../Utils/HandleResult";

import ConditionUtils from "../../../Services/Utils/ConditionUtils";
import ConditionCreateComponent from "../../condition/ConditionCreateComponent";
import { useResource } from "../../ResourceContext";
import ClinicalImpressionCreateComponent from "../../clinical-impression/ClinicalImpressionCreateComponent";
import { useTranslation } from "react-i18next";

function getEvolutionDisplay(evolution: ClinicalImpression) {
  return {
    leftTitle: evolution.description || "N/A",
    leftSubtitle: evolution.note?.[0].text || "N/A",
    rightText: evolution.date || "N/A",
  };
}

function getConditionDisplay(condition: Condition) {
  return {
    leftTitle: ConditionUtils.getName(condition),
    leftSubtitle: ConditionUtils.getValue(condition),
    rightText: condition.recordedDate || "N/A",
  };
}

export default function EncounterPage({
  encounterId,
}: {
  encounterId?: string;
}) {
  const [evolution, setEvolution] = useState<ClinicalImpression[] | undefined>(
    undefined
  );
  const [conditions, setConditions] = useState<Condition[] | undefined>(
    undefined
  );

  const [isEvolutionOpen, setIsEvolutionOpen] = useState(false);
  const [isConditionOpen, setIsConditionOpen] = useState(false);

  const [patientId, setPatientId] = useState<string | undefined>(undefined);

  const [id, setId] = useState<string | undefined>(undefined);
  const { resource } = useResource<Encounter>();

  const { t } = useTranslation();

  const fetchEvolution = async (id: string) => {
    const fhirService =
      FhirResourceService.getInstance<ClinicalImpression>("ClinicalImpression");
    const response = await HandleResult.handleOperation(
      () => fhirService.getResources({ encounter: id }),
      "Evolution fetched successfully",
      "Fetching Evolution"
    );
    if (response.success) {
      setEvolution(response.data);
    }
  };

  const fetchConditions = async (id: string) => {
    const fhirService = FhirResourceService.getInstance<Condition>("Condition");
    const response = await HandleResult.handleOperation(
      () => fhirService.getResources({ encounter: id }),
      "Conditions fetched successfully",
      "Fetching conditions"
    );
    if (response.success) {
      setConditions(response.data);
    }
  };

  useEffect(() => {
    const id = encounterId || resource?.id;
    if (id) {
      fetchEvolution(id);
      fetchConditions(id);

      setId(id);
      setPatientId(
        resource?.subject?.reference?.split("/")[1] ||
          resource?.subject?.reference
      );
    }
  }, [encounterId, resource]);

  const handleEvolutionClick = (evolution: ClinicalImpression) => {
    console.log("Evolution clicked", evolution);
  };

  const handleConditionClick = (condition: Condition) => {
    console.log("Condition clicked", condition);
  };

  const handleAddEvolutionClick = () => {
    setIsEvolutionOpen(true);
  };

  const handleAddConditionClick = () => {
    setIsConditionOpen(true);
  };

  const handleEvolutionOpen = (isOpen: boolean) => {
    setIsEvolutionOpen(isOpen);
  };

  const handleConditionOpen = (isOpen: boolean) => {
    setIsConditionOpen(isOpen);
  };

  return (
    <>
      <Grid container spacing={2} justifyContent="center">
        <Grid item xs={12} md={4}>
          <ResourceList
            title={t("patientPage.evolutions")}
            Icon={NotesIcon}
            resources={evolution}
            onClick={handleEvolutionClick}
            getDisplay={getEvolutionDisplay}
            onAddClick={handleAddEvolutionClick}
          />
        </Grid>
        <Grid item xs={12} md={4}>
          <ResourceList
            title={t("patientPage.conditions")}
            Icon={ConditionIcon}
            resources={conditions}
            onClick={handleConditionClick}
            getDisplay={getConditionDisplay}
            onAddClick={handleAddConditionClick}
          />
        </Grid>
      </Grid>
      {id && patientId && (
        <>
          <ConditionCreateComponent
            patientId={patientId}
            onOpen={handleConditionOpen}
            isOpen={isConditionOpen}
            encounterId={id}
          />

          <ClinicalImpressionCreateComponent
            patientId={patientId}
            onOpen={handleEvolutionOpen}
            isOpen={isEvolutionOpen}
            encounterId={id}
          />
        </>
      )}
    </>
  );
}
