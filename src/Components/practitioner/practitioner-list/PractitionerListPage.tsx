import PractitionerList from "./PractitionerList";
import { Practitioner, PractitionerRole } from "fhir/r4";
import PractitionerSearchComponent from "../practitioner-search-component/PractitionerSearchComponent";

import Grid from "@mui/material/Grid";
import { Box, useMediaQuery, useTheme } from "@mui/material";
import PractitionerCreateForm from "../practitioner-create/PractitionerCreateForm";
import { PractitionerFormData } from "../../../Models/Forms/PractitionerForm";
import { useState } from "react";
import PersonUtil from "../../../Services/Utils/PersonUtils";
import HandleResult from "../../../Utils/HandleResult";
import FhirResourceService from "../../../Services/FhirService";
import { SearchParams } from "fhir-kit-client";
import { useTranslation } from "react-i18next";
import { CacheUtils } from "../../../Utils/Cache";

// Definición de la interfaz Result para manejar respuestas de operaciones
interface Result<T> {
  success: boolean;
  data?: T;
  error?: string;
}

let practitionerFormData: PractitionerFormData;

// Declaración de funciones para referencias de tipo, la implementación real está en el componente
const handleEditClick = (person: Practitioner) => {};
const handleDeleteClick = (person: Practitioner) => {
  console.log(`Delete clicked for id: ${person.id}`);
};

const PractitionerListPage = () => {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);
  const [activeStep, setActiveStep] = useState(0);
  const [avatar, setAvatar] = useState<File | null>(null);
  const [isPosting, setIsPosting] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [selectedPractitioner, setSelectedPractitioner] = useState<Practitioner | null>(null);

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  const [searchParam, setSearchParam] = useState<SearchParams | undefined>();

  const handleOpen = () => {
    setIsEditing(false);
    setSelectedPractitioner(null);
    setActiveStep(0);
    setAvatar(null);
    practitionerFormData = {} as PractitionerFormData;
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setIsEditing(false);
    setSelectedPractitioner(null);
  };

  // Implementación real del handleEditClick dentro del componente
  const handleEditPractitioner = async (person: Practitioner) => {
    try {
      setIsEditing(true);
      setSelectedPractitioner(person);
      setActiveStep(0);
      
      // Convertir el practitioner FHIR a PractitionerFormData
      const formData = await PersonUtil.loadPractitionerForm(person);
      practitionerFormData = formData;
      
      // Si hay foto, preparar para mostrarla
      if (person.photo && person.photo.length > 0 && person.photo[0].data) {
        // La foto está en base64, pero no podemos convertirla directamente a File
        // En el componente se mostrará usando la propiedad photo del practitioner
      }
      
      setOpen(true);
    } catch (error) {
      console.error("Error preparing practitioner for edit:", error);
    }
  };

  const handleAvatarChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      setAvatar(event.target.files[0]);
    }
  };

  const submitForm = async (data: PractitionerFormData) => {
    try {
      setIsPosting(true);
      practitionerFormData = { ...practitionerFormData, ...data };
      if (avatar) {
        practitionerFormData.avatar = avatar;
      }
      console.log("practitionerFormData:", practitionerFormData);
      
      if (activeStep < 1) {
        setActiveStep((prev) => prev + 1);
      } else {
        const operation = isEditing ? 
          () => updatePractitioner(practitionerFormData) : 
          () => postPractitioner(practitionerFormData);
        
        const message = isEditing ? 
          t("practitionerPage.practitionerUpdated", "Practitioner updated successfully") : 
          t("practitionerPage.practitionerCreated");
        
        const response = await HandleResult.handleOperation(
          operation,
          message,
          t("practitionerPage.sending")
        );
        
        if (response.success) setActiveStep((prev) => prev + 1);
      }
    } finally {
      await new Promise((resolve) => setTimeout(resolve, 1000)); // wait for 1 second
      setIsPosting(false);
    }
  };

  const updatePractitioner = async (
    data: PractitionerFormData
  ): Promise<Result<Practitioner>> => {
    if (!selectedPractitioner || !selectedPractitioner.id) {
      return {
        success: false,
        error: "No practitioner selected for update"
      };
    }
    
    data.id = selectedPractitioner.id;
    const rut = data.rut.replace(/\./g, "").replace(/-/g, "").toUpperCase();
    data.rut = rut;
    
    const { practitioner, practitionerRole } =
      await PersonUtil.PractitionerFormToPractitioner(data);
    
    if (!practitioner) {
      return {
        success: false,
        error: t("practitionerPage.errorConvertingForm"),
      };
    }
    
    // Actualizar en HAPI FHIR
    const fhirService = 
      FhirResourceService.getInstance<Practitioner>("Practitioner");
    const responseFhir = await fhirService.updateResource(practitioner);
    
    if (!responseFhir.success) return responseFhir;
    
    // Actualizar PractitionerRole si es necesario
    if (practitionerRole) {
      practitionerRole.practitioner = {
        reference: `Practitioner/${responseFhir.data.id}`,
      };
      
      const fhirServiceRole =
        FhirResourceService.getInstance<PractitionerRole>("PractitionerRole");
      
      // Buscar si ya existe un PractitionerRole para este practitioner
      const existingRoleResponse = await fhirServiceRole.getResources({
        practitioner: responseFhir.data.id
      });
      
      if (existingRoleResponse.success && existingRoleResponse.data.length > 0) {
        // Actualizar el role existente
        practitionerRole.id = existingRoleResponse.data[0].id;
        await fhirServiceRole.updateResource(practitionerRole);
      } else {
        // Crear un nuevo role
        await fhirServiceRole.sendResource(practitionerRole);
      }
    }
    
    // También podríamos actualizar la información del usuario en el servidor de autenticación 
    // si fuera necesario
    
    CacheUtils.clearCache();
    return responseFhir;
  };

  const postPractitioner = async (
    data: PractitionerFormData
  ): Promise<Result<Practitioner>> => {
    const rut = data.rut.replace(/\./g, "").replace(/-/g, "").toUpperCase();
    data.rut = rut;
    const { practitioner, practitionerRole } =
      await PersonUtil.PractitionerFormToPractitioner(data);

    console.log("practitionerRole:", practitionerRole);
    if (!practitioner)
      return {
        success: false,
        error: t("practitionerPage.errorConvertingForm"),
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
      return { success: false, error: t("practitionerPage.userExists") };

    //send to hapi fhir
    const fhirService =
      FhirResourceService.getInstance<Practitioner>("Practitioner");
    const responseFhir = await fhirService.sendResource(practitioner);
    if (!responseFhir.success) return responseFhir;

    // send to server
    const user = {
      email: data.email,
      rut: data.rut,
      phone_number: data.numeroTelefonico,
      name: `${data.nombre} ${data.segundoNombre} ${data.apellidoPaterno} ${data.apellidoMaterno}`,
      role: "Practitioner",
      fhir_id: responseFhir.data.id,
      secondaryRoles: data.role?.map((role) => role.code).join(","), //TODO: no guardó los roles.
    };
    practitionerFormData.id = responseFhir.data.id;

    //add practitionerRole to user hapi fhir
    practitionerRole.practitioner = {
      reference: `Practitioner/${responseFhir.data.id}`,
    };

    const fhirServiceRole =
      FhirResourceService.getInstance<PractitionerRole>("PractitionerRole");
    const responseFhirRole = await fhirServiceRole.sendResource(
      practitionerRole
    );
    if (!responseFhirRole.success) return responseFhir;

    url = `${import.meta.env.VITE_SERVER_URL}/auth/register`;
    response_api = await fetch(url, {
      method: "POST",
      headers: {
        accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(user),
    });
    if (response_api.status === 409)
      return { success: false, error: t("practitionerPage.userExists") };
    if (response_api.status !== 201)
      return { success: false, error: response_api.statusText };

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
              <PractitionerSearchComponent
                handleAddPractitioner={handleOpen}
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
              <PractitionerList
                onEditClick={handleEditPractitioner}
                onDeleteClick={handleDeleteClick}
                searchParam={searchParam}
              />
            </Grid>
          </Grid>
        </Grid>
      </Grid>
      <PractitionerCreateForm
        formId="practitioner-create-form"
        practitioner={practitionerFormData}
        submitForm={submitForm}
        handleClose={handleClose}
        open={open}
        activeStep={activeStep}
        setActiveStep={setActiveStep}
        avatar={avatar}
        handleAvatarChange={handleAvatarChange}
        isPosting={isPosting}
        isEditing={isEditing}
        selectedPractitioner={selectedPractitioner}
      />
    </Box>
  );
};

export default PractitionerListPage;
