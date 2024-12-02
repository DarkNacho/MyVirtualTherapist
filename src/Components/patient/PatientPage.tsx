import PatientList from "./patient-list/PatientList";
import { Patient } from "fhir/r4";
import PatientSearchComponent from "./patient-search-component/PatientSearchComponent";
import WelcomeComponent from "../WelcomeComponent";

import Grid from "@mui/material/Grid";
import { Box } from "@mui/material";
import PatientCreateForm from "./patient-create/PatientCreateForm";
import { PatientFormData } from "../../Models/Forms/PatientForm";
import { useState } from "react";
import PersonUtil from "../../Services/Utils/PersonUtils";
import HandleResult from "../../Services/HandleResult";
import FhirResourceService from "../../Services/FhirService";

let patientFormData: PatientFormData;

const handleDetailsClick = (person: Patient) => {
  console.log("Details clicked for:", person);
};

const handleEditClick = (person: Patient) => {
  console.log("Edit clicked for:", person);
};

const handleDeleteClick = (person: Patient) => {
  console.log("Delete clicked for:", person);
};
const PatientPage = () => {
  const [open, setOpen] = useState(false);
  const [activeStep, setActiveStep] = useState(0);
  const [avatar, setAvatar] = useState<File | null>(null);
  const [isPosting, setIsPosting] = useState(false);

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleAvatarChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      setAvatar(event.target.files[0]);
    }
  };

  const submitForm = async (data: PatientFormData) => {
    setIsPosting(true);
    patientFormData = { ...patientFormData, ...data };
    if (avatar) {
      patientFormData.avatar = avatar;
    }
    console.log("patientFormData:", patientFormData);
    // Add any additional logic if needed
    if (activeStep < 1) {
      setActiveStep((prev) => prev + 1);
    } else {
      await postPatient(patientFormData);
      setActiveStep((prev) => prev + 1);
    }
    setIsPosting(false);
  };

  const postPatient = async (data: PatientFormData) => {
    const patient = await PersonUtil.PatientFormToPatient(data);
    if (!patient)
      return HandleResult.showErrorMessage(
        "Error al convertir el formulario a paciente"
      );

    const fhirService = new FhirResourceService("Patient");
    const response = await HandleResult.handleOperation(
      () => fhirService.sendResource(patient),
      "Observación guardada de forma exitosa",
      "Enviando..."
    );
    console.log("response:", response);
    return response;
  };

  return (
    <Box>
      <Grid container spacing={2}>
        <Grid item xs={4}>
          <WelcomeComponent userName="Jhon Doe" />
        </Grid>
        <Grid
          item
          xs
          sx={{
            height: "410px !important",
            overflow: "auto",
          }}
        >
          <Grid container gap={0.5}>
            <Grid width="100%">
              <PatientSearchComponent handleAddPatient={handleOpen} />
            </Grid>
            <Grid item width="100%">
              <PatientList
                onDetailsClick={handleDetailsClick}
                onEditClick={handleEditClick}
                onDeleteClick={handleDeleteClick}
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
        open={open}
        activeStep={activeStep}
        setActiveStep={setActiveStep}
        avatar={avatar}
        handleAvatarChange={handleAvatarChange}
        isPosting={isPosting}
      />
    </Box>
  );
};

export default PatientPage;
