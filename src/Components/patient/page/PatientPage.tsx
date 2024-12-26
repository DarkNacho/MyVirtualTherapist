import { useEffect, useState } from "react";
import PatientCard from "./PatientCard";
import { Patient } from "fhir/r4";

import { useParams } from "react-router-dom";
import FhirResourceService from "../../../Services/FhirService";
import HandleResult from "../../../Utils/HandleResult";
import { Box, Tabs, Tab } from "@mui/material";
import PatientOverviewTab from "./PatientOverviewTab";
import PatientAppointmentsTab from "./PatientAppointmentsTab";
import PatientSensorTab from "./PatientSensorTab";
import PatientFormsTab from "./PatientFormsTab";
import { useResourceHook } from "../../ResourceHook";

export default function PatientPage() {
  const { id } = useParams<{ id: string }>();
  //const { patient, setPatient } = usePatient();
  const { resource, setResource, effectiveResourceId } =
    useResourceHook<Patient>(id);

  const [selectedTab, setSelectedTab] = useState(0);

  const fetchPatient = async (id: string) => {
    const fhirService = FhirResourceService.getInstance<Patient>("Patient");
    const response = await HandleResult.handleOperation(
      () => fhirService.getById(id),
      "Patient fetched successfully",
      "Fetching patient"
    );
    if (response.success) {
      setResource(response.data);
    } else {
      console.error("Patient not found or ", response.error);
      window.location.href = "/NotFound";
    }
  };

  useEffect(() => {
    if (effectiveResourceId) fetchPatient(effectiveResourceId);
  }, [effectiveResourceId, setResource]);

  const handleTabChange = (_: React.SyntheticEvent, newValue: number) => {
    setSelectedTab(newValue);
  };

  return (
    <Box sx={{ gap: 2, display: "flex", flexDirection: "column" }}>
      <PatientCard patient={resource} />
      <Tabs
        value={selectedTab}
        onChange={handleTabChange}
        centered
        sx={{ fontSize: "1.2rem" }}
      >
        <Tab label="Overview" sx={{ fontSize: "1.2rem" }} />
        <Tab label="Appointments" sx={{ fontSize: "1.2rem" }} />
        <Tab label="Sensor" sx={{ fontSize: "1.2rem" }} />
        <Tab label="Forms" sx={{ fontSize: "1.2rem" }} />
      </Tabs>
      {selectedTab === 0 && <PatientOverviewTab />}
      {selectedTab === 1 && <PatientAppointmentsTab />}
      {selectedTab === 2 && <PatientSensorTab patientId="7" />}
      {selectedTab === 3 && <PatientFormsTab />}
    </Box>
  );
}
