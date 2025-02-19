import PatientList from "./PatientList";
import { Patient } from "fhir/r4";
import PatientSearchComponent from "../patient-search-component/PatientSearchComponent";

import Grid from "@mui/material/Grid";
import { Box, useMediaQuery, useTheme } from "@mui/material";
import PatientCreateForm from "../patient-create/PatientCreateForm";
import { PatientFormData } from "../../../Models/Forms/PatientForm";
import PersonUtil from "../../../Services/Utils/PersonUtils";
import HandleResult from "../../../Utils/HandleResult";
import FhirResourceService from "../../../Services/FhirService";
import { SearchParams } from "fhir-kit-client";
import { useTranslation } from "react-i18next";
import { useState } from "react";
import { CacheUtils } from "../../../Utils/Cache";
import PatientRefer from "../patient-refer/PatientRefer";

let patientFormData: PatientFormData;

const handleEditClick = (person: Patient) => {
  alert(`Edit clicked for id:${person.id} `);
};

const handleDeleteClick = (person: Patient) => {
  alert(`Delete clicked for id: ${person.id}`);
};
export default function PatientListPage() {
  const { t } = useTranslation();

  const [openCreate, setOpenCreate] = useState(false);
  const [openRefer, setOpenRefer] = useState(false);

  const [activeStep, setActiveStep] = useState(0);
  const [avatar, setAvatar] = useState<File | null>(null);
  const [isPosting, setIsPosting] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState<Patient | undefined>();

  const [searchParam, setSearchParam] = useState<SearchParams | undefined>();

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  const handleOpenCreate = () => {
    setOpenCreate(true);
  };

  const handleClose = () => {
    setOpenCreate(false);
    setOpenRefer(false);
  };

  const handleOpenRefer = (open: boolean) => {
    setOpenRefer(open);
  };

  const handleReferClick = (patient: Patient) => {
    setSelectedPatient(patient);
    setOpenRefer(true);
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
    const rut = data.rut.replace(/\./g, "").replace(/-/g, "").toUpperCase();
    data.rut = rut;
    const patient = await PersonUtil.PatientFormToPatient(data);

    //add user as default practitioner
    patient.generalPractitioner = [
      { reference: `Practitioner/${localStorage.getItem("id")}` },
    ];

    if (!patient)
      return {
        success: false,
        error: t("patientPage.errorConvertingForm"),
      };

    //check if user exists
    let url = `${import.meta.env.VITE_SERVER_URL}/auth/find?rut=${data.rut}`;
    let response_api = await fetch(url, {
      method: "GET",
      headers: {
        accept: "application/json",
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("access_token")}`,
      },
    });

    const dataRes = await response_api.json();

    console.log("response:", dataRes);
    if (dataRes.data)
      return { success: false, error: t("patientPage.userExists") };

    //send to hapi fhir
    const fhirService = FhirResourceService.getInstance<Patient>("Patient");
    const responseFhir = await fhirService.sendResource(patient);
    if (!responseFhir.success) return responseFhir;

    // send to server

    const user = {
      email: data.email,
      rut: data.rut,
      phone_number: data.numeroTelefonico,
      name: `${data.nombre} ${data.segundoNombre} ${data.apellidoPaterno} ${data.apellidoMaterno}`,
      role: "Patient",
      fhir_id: responseFhir.data.id,
    };
    patientFormData.id = responseFhir.data.id;

    url = `${import.meta.env.VITE_SERVER_URL}/auth/register`;

    response_api = await fetch(url, {
      method: "POST",
      headers: {
        accept: "application/json",
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("access_token")}`,
      },
      body: JSON.stringify(user),
    });

    if (response_api.status !== 201) {
      console.log("error:", response_api, "deleting resource");
      await fhirService.deleteResource(responseFhir.data.id!);
      return { success: false, error: response_api.statusText };
    }
    console.log("response:", response_api);
    CacheUtils.clearCache();
    return responseFhir;
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
        open={openCreate}
        activeStep={activeStep}
        avatar={avatar}
        handleAvatarChange={handleAvatarChange}
        isPosting={isPosting}
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
