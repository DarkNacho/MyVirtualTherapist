import PractitionerList from "./PractitionerList";
import { Practitioner } from "fhir/r4";
import PractitionerSearchComponent from "../practitioner-search-component/PractitionerSearchComponent";

import Grid from "@mui/material/Grid";
import { Box } from "@mui/material";
import PractitionerCreateForm from "../practitioner-create/PractitionerCreateForm";
import { SearchParams } from "fhir-kit-client";
import { useState } from "react";
import { isAdminOrPractitioner } from "../../../Utils/RolUser";
import { usePractitionerForm } from "../practitioner-create/usePractitionerForm";

const handleDeleteClick = (person: Practitioner) => {
  console.log(`Delete clicked for id: ${person.id}`);
};

const PractitionerListPage = () => {
  const isAdminOrPractitionerUser = isAdminOrPractitioner();
  const [searchParam, setSearchParam] = useState<SearchParams | undefined>();

  const {
    open,
    activeStep,
    setActiveStep,
    avatar,
    handleAvatarChange,
    isPosting,
    isEditing,
    practitionerFormData,
    handleOpen,
    handleClose,
    handleEditClick,
    submitForm,
  } = usePractitionerForm();

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
                onEditClick={
                  isAdminOrPractitionerUser ? handleEditClick : undefined
                }
                onDeleteClick={
                  isAdminOrPractitionerUser ? handleDeleteClick : undefined
                }
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
      />
    </Box>
  );
};

export default PractitionerListPage;
