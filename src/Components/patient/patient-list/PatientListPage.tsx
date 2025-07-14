import PatientList from "./PatientList";
import { Patient } from "fhir/r4";
import PatientSearchComponent from "../patient-search-component/PatientSearchComponent";
import Grid from "@mui/material/Grid";
import { Box } from "@mui/material";
import PatientCreateForm from "../patient-create/PatientCreateForm";
import { SearchParams } from "fhir-kit-client";
import { useState } from "react";
import PatientRefer from "../patient-refer/PatientRefer";
import { loadUserRoleFromLocalStorage } from "../../../Utils/RolUser";
import { usePatientForm } from "../patient-create/usePatientForm";
import HandleResult from "../../../Utils/HandleResult";
import FhirResourceService from "../../../Services/FhirService";

const handleDeleteClick = async (person: Patient) => {
  if (!person) return;
  const confirmed = await HandleResult.confirm(
    "¿Estás seguro de que quieres eliminar este paciente? Esta acción no se puede deshacer."
  );
  if (!confirmed) return;
  const response = await HandleResult.handleOperation(
    () =>
      FhirResourceService.getInstance<Patient>("Patient").deleteResource(
        person.id!
      ),
    "Paciente eliminado de forma exitosa",
    "Eliminando..."
  );
  if (!response.success) {
    HandleResult.showErrorMessage(
      "Error al eliminar el paciente. Por favor, inténtalo de nuevo más tarde."
    );
  }
};

export default function PatientListPage() {
  const [openRefer, setOpenRefer] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState<Patient | undefined>();

  const userRol = loadUserRoleFromLocalStorage();

  const [defaultSearchParam] = useState<SearchParams | undefined>(
    userRol === "Practitioner"
      ? {
          "general-practitioner": `${localStorage.getItem("id")}`,
        }
      : {}
  );

  const [searchParam, setSearchParam] = useState<SearchParams | undefined>(
    defaultSearchParam
  );

  // Hook para la lógica del formulario de paciente
  const {
    openCreate,
    isEditing,
    activeStep,
    avatar,
    isPosting,
    patientFormData,
    handleOpenCreate,
    handleClose,
    handleAvatarChange,
    handleSetActiveStep,
    submitForm,
    handleEditPatient,
  } = usePatientForm();

  const handleOpenRefer = (open: boolean) => {
    setOpenRefer(open);
  };

  const handleReferClick = (patient: Patient) => {
    setSelectedPatient(patient);
    setOpenRefer(true);
  };

  return (
    <Box>
      <Grid container spacing={2}>
        <Grid item xs>
          <Grid container gap={"38px"}>
            <Grid width="100%">
              <PatientSearchComponent
                handleAddPatient={handleOpenCreate}
                setSearchParam={setSearchParam}
                defaultSearchParam={defaultSearchParam}
              />
            </Grid>
            <Grid
              item
              width="100%"
              sx={{
                height: "calc(100vh - 465px)",
                overflow: "auto",
              }}
            >
              <PatientList
                onReferClick={handleReferClick}
                onEditClick={handleEditPatient}
                onDeleteClick={handleDeleteClick}
                searchParam={searchParam}
              />
            </Grid>
          </Grid>
        </Grid>
      </Grid>
      <PatientCreateForm
        formId="patient-create-form"
        patient={patientFormData}
        submitForm={submitForm}
        handleClose={handleClose}
        open={openCreate}
        activeStep={activeStep}
        avatar={avatar}
        handleAvatarChange={handleAvatarChange}
        isPosting={isPosting}
        setActiveStep={handleSetActiveStep}
        isEditing={isEditing}
        selectedPatient={undefined}
      />
      {selectedPatient && (
        <PatientRefer
          onOpen={handleOpenRefer}
          isOpen={openRefer}
          patient={selectedPatient}
        />
      )}
    </Box>
  );
}
