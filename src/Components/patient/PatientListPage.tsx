import PatientList from "./patient-list/PatientList";
import { Patient } from "fhir/r4";
import PatientSearchComponent from "./patient-search-component/PatientSearchComponent";
import WelcomeComponent from "../WelcomeComponent";

import Grid from "@mui/material/Grid";
import { Box, useMediaQuery, useTheme } from "@mui/material";
import PatientCreateForm from "./patient-create/PatientCreateForm";
import { PatientFormData } from "../../Models/Forms/PatientForm";
import PersonUtil from "../../Services/Utils/PersonUtils";
import HandleResult from "../../Utils/HandleResult";
import FhirResourceService from "../../Services/FhirService";
import { SearchParams } from "fhir-kit-client";
import { useTranslation } from "react-i18next";
import { useState } from "react";

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
export default function PatientListPage() {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);
  const [activeStep, setActiveStep] = useState(0);
  const [avatar, setAvatar] = useState<File | null>(null);
  const [isPosting, setIsPosting] = useState(false);

  const [searchParam, setSearchParam] = useState<SearchParams | undefined>();

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

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
    try {
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
        //await postPatient(patientFormData);
        const response = await HandleResult.handleOperation(
          () => postPatient(patientFormData),
          t("patientPage.patientCreated"),
          t("patientPage.sending")
        );
        if (response.success) setActiveStep((prev) => prev + 1);
        else setActiveStep(0);

        await new Promise((resolve) => setTimeout(resolve, 2000)); // wait for 1 second
      }
    } finally {
      setIsPosting(false);
    }
  };

  const postPatient = async (
    data: PatientFormData
  ): Promise<Result<Patient>> => {
    const patient = await PersonUtil.PatientFormToPatient(data);
    if (!patient)
      return {
        success: false,
        error: t("patientPage.errorConvertingForm"),
      };

    // send to server
    const user = {
      email: data.email,
      rut: data.rut,
      phone_number: data.numeroTelefonico,
      name: `${data.nombre} ${data.segundoNombre} ${data.apellidoPaterno} ${data.apellidoMaterno}`,
      role: "Patient",
      fhir_id: "",
    };
    let url = `${import.meta.env.VITE_SERVER_URL}/auth/register`;
    let response_api = await fetch(url, {
      method: "POST",
      headers: {
        accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(user),
    });
    if (response_api.status === 409)
      return { success: false, error: t("patientPage.userExists") };
    if (response_api.status !== 201)
      return { success: false, error: response_api.statusText };
    // end sending api

    //send to hapi fhir
    const fhirService = FhirResourceService.getInstance<Patient>("Patient");
    const responseFhir = await fhirService.sendResource(patient);
    if (!responseFhir.success) return responseFhir;

    //update user with fhir_id
    url = `${import.meta.env.VITE_SERVER_URL}/auth/update`;
    user.fhir_id = responseFhir.data.id!;
    patientFormData.id = responseFhir.data.id!;

    response_api = await fetch(url, {
      method: "PUT",
      headers: {
        accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(user),
    });

    if (response_api.status !== 200)
      return { success: false, error: response_api.statusText };

    console.log("response:", response_api);
    return responseFhir;
  };

  return (
    <Box>
      <Grid container spacing={2}>
        {!isMobile && (
          <Grid item xs={4}>
            <WelcomeComponent userName={localStorage.getItem("name")!} />
          </Grid>
        )}
        <Grid item xs>
          <Grid container gap={0.5}>
            <Grid width="100%">
              <PatientSearchComponent
                handleAddPatient={handleOpen}
                setSearchParam={setSearchParam}
              />
            </Grid>
            <Grid
              item
              width="100%"
              sx={{
                height: {
                  xs: "calc(100vh - 295px)",
                  sm: "calc(100vh - 335px)",
                },

                overflow: "auto",
              }}
            >
              <PatientList
                onDetailsClick={handleDetailsClick}
                onEditClick={handleEditClick}
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
        open={open}
        activeStep={activeStep}
        avatar={avatar}
        handleAvatarChange={handleAvatarChange}
        isPosting={isPosting}
      />
    </Box>
  );
}
