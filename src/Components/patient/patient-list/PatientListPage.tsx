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

// Definición de la interfaz Result para manejar respuestas de operaciones
interface Result<T> {
  success: boolean;
  data?: T;
  error?: string;
}

let patientFormData: PatientFormData;

// Declaración de funciones para referencias de tipo, la implementación real está en el componente
const handleEditClick = (person: Patient) => {};
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
  const [isEditing, setIsEditing] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState<Patient | undefined>();

  const [searchParam, setSearchParam] = useState<SearchParams | undefined>();

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  const handleOpenCreate = () => {
    setIsEditing(false);
    setSelectedPatient(undefined);
    setActiveStep(0);
    setAvatar(null);
    patientFormData = {} as PatientFormData;
    setOpenCreate(true);
  };

  const handleClose = () => {
    setOpenCreate(false);
    setOpenRefer(false);
    setIsEditing(false);
    setSelectedPatient(undefined);
  };

  const handleOpenRefer = (open: boolean) => {
    setOpenRefer(open);
  };

  const handleReferClick = (patient: Patient) => {
    setSelectedPatient(patient);
    setOpenRefer(true);
  };

  // Implementación real del handleEditClick dentro del componente
  const handleEditPatient = async (person: Patient) => {
    try {
      setIsEditing(true);
      setSelectedPatient(person);
      setActiveStep(0);
      
      // Convertir el patient FHIR a PatientFormData
      const formData = await PersonUtil.PatientToPatientForm(person);
      patientFormData = formData;
      
      // Si hay foto, preparar para mostrarla
      if (person.photo && person.photo.length > 0 && person.photo[0].data) {
        // La foto está en base64, pero no podemos convertirla directamente a File
        // En el componente se mostrará usando la propiedad photo del patient
      }
      
      setOpenCreate(true);
    } catch (error) {
      console.error("Error preparing patient for edit:", error);
    }
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
      
      if (activeStep < 1) {
        setActiveStep((prev) => prev + 1);
      } else {
        const operation = isEditing ? 
          () => updatePatient(patientFormData) : 
          () => postPatient(patientFormData);
        
        const message = isEditing ? 
          t("patientPage.patientUpdated") : 
          t("patientPage.patientCreated");
        
        const response = await HandleResult.handleOperation(
          operation,
          message,
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

  const updatePatient = async (
    data: PatientFormData
  ): Promise<Result<Patient>> => {
    if (!selectedPatient || !selectedPatient.id) {
      return {
        success: false,
        error: t("patientPage.noPatientSelected")
      };
    }
    
    data.id = selectedPatient.id;
    const rut = data.rut.replace(/\./g, "").replace(/-/g, "").toUpperCase();
    data.rut = rut;
    
    const patient = await PersonUtil.PatientFormToPatient(data);
    
    if (!patient) {
      return {
        success: false,
        error: t("patientPage.errorConvertingForm"),
      };
    }
    
    // Mantener el generalPractitioner del paciente original si existe
    if (selectedPatient.generalPractitioner && selectedPatient.generalPractitioner.length > 0) {
      patient.generalPractitioner = selectedPatient.generalPractitioner;
    } else {
      // Si no tiene un médico asignado, usar el actual
      patient.generalPractitioner = [
        { reference: `Practitioner/${localStorage.getItem("id")}` },
      ];
    }
    
    // Actualizar en HAPI FHIR
    const fhirService = FhirResourceService.getInstance<Patient>("Patient");
    const responseFhir = await fhirService.updateResource(patient);
    
    if (!responseFhir.success) return responseFhir;
    
    // También podríamos actualizar la información del usuario en el servidor de autenticación 
    // si fuera necesario, por ejemplo, el email o teléfono
    
    CacheUtils.clearCache();
    return responseFhir;
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
        setActiveStep={setActiveStep}
        avatar={avatar}
        handleAvatarChange={handleAvatarChange}
        isPosting={isPosting}
        isEditing={isEditing}
        selectedPatient={selectedPatient}
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
