import { useEffect, useState } from "react";
import { Box, Button, Grid, Link, Tab, Tabs, Typography } from "@mui/material";
import ResourceList from "../../resource-list/ResourceList";
import ConditionIcon from "@mui/icons-material/MonitorHeartSharp";
import { Condition, ClinicalImpression, Encounter } from "fhir/r4";
import FhirResourceService from "../../../Services/FhirService";
import HandleResult from "../../../Utils/HandleResult";

import ConditionUtils from "../../../Services/Utils/ConditionUtils";
import ConditionCreateComponent from "../../condition/ConditionCreateComponent";
import { useTranslation } from "react-i18next";
import { SensorDataByDevice } from "../../../Models/SensorModel";
import DeviceSensorChart from "../../charts/DeviceSensorChart";
import ClinicalImpressionFormComponent from "../../clinical-impression/ClinicalImpressionFormComponent";
import PatientReportModal from "../../patient/patient-report/PatientReport";
import PatientQuestionnaireComponent from "../../Questionnaire/PatientQuestionnaireComponent";
import { useNavigate, useParams } from "react-router-dom";
import { useResourceHook } from "../../ResourceHook";
import EncounterUtils from "../../../Services/Utils/EncounterUtils";

function getConditionDisplay(condition: Condition) {
  return {
    leftTitle: ConditionUtils.getName(condition),
    leftSubtitle: ConditionUtils.getValue(condition),
    rightText: condition.recordedDate || "N/A",
  };
}

function getEncounterDisplay(resource: Encounter): string {
  return `Profesional: ${EncounterUtils.getPrimaryPractitioner(
    resource
  )} ${EncounterUtils.getFormatPeriod(resource.period!)}`;
}

export default function EncounterPage() {
  const [conditions, setConditions] = useState<Condition[] | undefined>(
    undefined
  );
  const [evolution, setEvolution] = useState<ClinicalImpression | undefined>(
    undefined
  );

  const [isConditionOpen, setIsConditionOpen] = useState(false);
  const [isReportOpen, setIsReportOpen] = useState(false);

  const [patientId, setPatientId] = useState<string | undefined>(undefined);
  const [practitionerId, setPractitionerId] = useState<string | undefined>(
    undefined
  );
  const { id } = useParams<{ id: string }>();
  const { resource, setResource, effectiveResourceId } =
    useResourceHook<Encounter>(id);
  const [tabIndex, setTabIndex] = useState(0);

  const navigate = useNavigate();

  const [loadingSensorData, setLoadingSensorData] = useState(true);

  const [sensorDataByDevice, setSensorDataByDevice] =
    useState<SensorDataByDevice>({});

  const { t } = useTranslation();

  const fetchEncounter = async (id: string) => {
    const fhirService = FhirResourceService.getInstance<Encounter>("Encounter");
    const response = await HandleResult.handleOperation(
      () => fhirService.getById(id),
      "Encounter fetched successfully",
      "Fetching encounter"
    );
    if (response.success) {
      setResource(response.data);
      setPatientId(
        response.data?.subject?.reference?.split("/")[1] ||
          response.data?.subject?.reference
      );
      setPractitionerId(
        response.data?.participant?.[0]?.individual?.reference?.split("/")[1] ||
          response.data?.participant?.[0]?.individual?.reference ||
          localStorage.getItem("id")!
      );
    } else {
      console.error("Encounter not found or ", response.error);
      window.location.href = "/NotFound";
    }
  };

  const fetchEvolution = async (id: string) => {
    const fhirService =
      FhirResourceService.getInstance<ClinicalImpression>("ClinicalImpression");
    const response: Result<ClinicalImpression[]> =
      await HandleResult.handleOperation(
        () => fhirService.getResources({ encounter: id }),
        "Evolution fetched successfully",
        "Fetching Evolution"
      );
    if (response.success) {
      setEvolution(response.data?.[0]);
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

  const fetchSensorData = async (encounterId: string) => {
    try {
      setLoadingSensorData(true);
      console.log("Fetching data for sensor:", encounterId);
      const response = await fetch(
        `${import.meta.env.VITE_SERVER_URL}/sensor2/data/${encounterId}`
      );
      if (!response.ok) {
        throw new Error("error in fetch sensor data");
      }
      const data: SensorDataByDevice = await response.json();
      console.log("Sensor data:", data);
      setSensorDataByDevice(data);
    } catch (error) {
      console.error("Failed to fetch data for sensor:", error);
    } finally {
      setLoadingSensorData(false);
    }
  };

  const handleTabChange = (_, newValue: number) => {
    setTabIndex(newValue);
  };

  useEffect(() => {
    const id = effectiveResourceId;

    if (id) {
      fetchEvolution(id);
      fetchConditions(id);
      fetchSensorData(id);
      if (!resource) {
        fetchEncounter(id);
      }
      if (resource) {
        setPatientId(
          resource?.subject?.reference?.split("/")[1] ||
            resource?.subject?.reference
        );
        setPractitionerId(
          resource?.participant?.[0]?.individual?.reference?.split("/")[1] ||
            resource?.participant?.[0]?.individual?.reference ||
            localStorage.getItem("id")!
        );
      }
    }
  }, [effectiveResourceId, resource]);

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

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    console.log("submitting form");
  };

  const onSubmitForm: SubmitHandler<ClinicalImpressionFormData> = (data) => {
    //const newObservation =
    //  ObservationUtils.ObservationFormDataToObservation(data);
    console.log("ClinicalImpressionCreateComponent", data);

    //sendObservation(data);
  };

  const TabPanel = (props) => {
    const { children, value, index, ...other } = props;

    return (
      <div
        role="tabpanel"
        hidden={value !== index}
        id={`tabpanel-${index}`}
        aria-labelledby={`tab-${index}`}
        {...other}
      >
        {value === index && <Box p={3}>{children}</Box>}
      </div>
    );
  };

  return (
    <>
      <Box>
        <Link
          component="button"
          onClick={() => navigate(`/Patient/${patientId}`)}
          underline="always"
        >
          <Typography variant="h5">{resource?.subject?.display}</Typography>
        </Link>
        <Typography variant="h5">{getEncounterDisplay(resource!)}</Typography>
        <Box display="flex">
          <PatientQuestionnaireComponent
            patientID={patientId!}
            encounterID={id!}
          ></PatientQuestionnaireComponent>
        </Box>
      </Box>
      <Grid container spacing={2} justifyContent="center">
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
        <Grid item xs={12} md={12}>
          <Box bgcolor="rgba(228, 233, 242, 0.8)" mt="30px" borderRadius="10px">
            <Tabs value={tabIndex} onChange={handleTabChange}>
              <Tab label="Evolución" />
              <Tab label="Gráficos del sensor" />
            </Tabs>
            <TabPanel value={tabIndex} index={0}>
              <ClinicalImpressionFormComponent
                formId="form-clinical-impression"
                patientId={patientId}
                practitionerId={practitionerId}
                submitForm={onSubmitForm}
                readOnly={false}
                encounterId={id}
              ></ClinicalImpressionFormComponent>
              <Box display="flex" justifyContent="flex-end">
                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  form="form-clinical-impression"
                >
                  Enviar
                </Button>
              </Box>
            </TabPanel>
            <TabPanel value={tabIndex} index={1}>
              {loadingSensorData ? (
                <p>Fetching sensor data...</p>
              ) : (
                <DeviceSensorChart sensorDataByDevice={sensorDataByDevice} />
              )}
            </TabPanel>
          </Box>
        </Grid>
      </Grid>
      {id && patientId && (
        <>
          <PatientReportModal
            open={isReportOpen}
            handleClose={() => setIsReportOpen(false)}
            patientId={patientId}
            encounterId={id}
          />
          <ConditionCreateComponent
            patientId={patientId}
            onOpen={handleConditionOpen}
            isOpen={isConditionOpen}
            encounterId={id}
          />
        </>
      )}
    </>
  );
}
