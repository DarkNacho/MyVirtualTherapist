import PractitionerList from "./practitioner-list/PractitionerList";
import { Practitioner } from "fhir/r4";
import PractitionerSearchComponent from "./practitioner-search-component/PractitionerSearchComponent";
import WelcomeComponent from "../WelcomeComponent";

import Grid from "@mui/material/Grid";
import { Box } from "@mui/material";
import PractitionerCreateForm from "./practitioner-create/PractitionerCreateForm";
import { PractitionerFormData } from "../../Models/Forms/PractitionerForm";
import { useState } from "react";
import PersonUtil from "../../Services/Utils/PersonUtils";
import HandleResult from "../../Utils/HandleResult";
import FhirResourceService from "../../Services/FhirService";
import { SearchParams } from "fhir-kit-client";
import { useTranslation } from "react-i18next";

let practitionerFormData: PractitionerFormData;

const handleDetailsClick = (person: Practitioner) => {
  console.log("Details clicked for:", person);
};

const handleEditClick = (person: Practitioner) => {
  console.log("Edit clicked for:", person);
};

const handleDeleteClick = (person: Practitioner) => {
  console.log("Delete clicked for:", person);
};
const PractitionerPage = () => {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);
  const [activeStep, setActiveStep] = useState(0);
  const [avatar, setAvatar] = useState<File | null>(null);
  const [isPosting, setIsPosting] = useState(false);

  const [searchParam, setSearchParam] = useState<SearchParams | undefined>();

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

  const submitForm = async (data: PractitionerFormData) => {
    try {
      setIsPosting(true);
      practitionerFormData = { ...practitionerFormData, ...data };
      if (avatar) {
        practitionerFormData.avatar = avatar;
      }
      console.log("practitionerFormData:", practitionerFormData);
      // Add any additional logic if needed
      if (activeStep < 1) {
        setActiveStep((prev) => prev + 1);
      } else {
        const response = await HandleResult.handleOperation(
          () => postPractitioner(practitionerFormData),
          t("practitionerPage.practitionerCreated"),
          t("practitionerPage.sending")
        );
        if (response.success) setActiveStep((prev) => prev + 1);
      }
    } finally {
      await new Promise((resolve) => setTimeout(resolve, 1000)); // wait for 1 second
      setIsPosting(false);
    }
  };

  const postPractitioner = async (
    data: PractitionerFormData
  ): Promise<Result<Practitioner>> => {
    const practitioner = await PersonUtil.PractitionerFormToPractitioner(data);
    if (!practitioner)
      return {
        success: false,
        error: t("practitionerPage.errorConvertingForm"),
      };

    // send to server
    const user = {
      email: data.email,
      rut: data.rut,
      phone_number: data.numeroTelefonico,
      name: `${data.nombre} ${data.segundoNombre} ${data.apellidoPaterno} ${data.apellidoMaterno}`,
      role: "Practitioner",
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
      return { success: false, error: t("practitionerPage.userExists") };
    if (response_api.status !== 201)
      return { success: false, error: response_api.statusText };
    // end sending api

    //send to hapi fhir
    const fhirService =
      FhirResourceService.getInstance<Practitioner>("Practitioner");
    const responseFhir = await fhirService.sendResource(
      practitioner.practitioner
    );
    if (!responseFhir.success) return responseFhir;

    //update user with fhir_id
    url = `${import.meta.env.VITE_SERVER_URL}/auth/update`;
    user.fhir_id = responseFhir.data.id!;

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
        <Grid item xs={4}>
          <WelcomeComponent userName={localStorage.getItem("name")!} />
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
              <PractitionerSearchComponent
                handleAddPractitioner={handleOpen}
                setSearchParam={setSearchParam}
              />
            </Grid>
            <Grid item width="100%">
              <PractitionerList
                onDetailsClick={handleDetailsClick}
                onEditClick={handleEditClick}
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
      />
    </Box>
  );
};

export default PractitionerPage;
