import EncounterList from "./EncounterList";
import { Encounter } from "fhir/r4";

import Grid from "@mui/material/Grid";
import { Box, useMediaQuery, useTheme } from "@mui/material";
import { SearchParams } from "fhir-kit-client";
import { useState } from "react";
import EncounterSearchComponent from "../encounter-search-component/EncounterSearchComponent";
import EncounterCreateComponent from "../encounter-create/EncounterCreateComponent";

const handleEditClick = (person: Encounter) => {
  console.log("Edit clicked for:", person);
};

const handleDeleteClick = (person: Encounter) => {
  console.log("Delete clicked for:", person);
};
export default function PatientListPage() {
  const [searchParam, setSearchParam] = useState<SearchParams | undefined>();
  const [openCreate, setOpenCreate] = useState(false);

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  const handleOpenCreate = () => {
    setOpenCreate(true);
  };

  return (
    <Box>
      <Grid container spacing={2}>
        <Grid item xs>
          <Grid container gap={"38px"}>
            <Grid width="100%">
              <EncounterSearchComponent
                handleAdd={handleOpenCreate}
                setSearchParam={setSearchParam}
              />
            </Grid>
            <Grid
              item
              width="100%"
              sx={{
                height: isMobile
                  ? "calc(100vh - 275px)"
                  : "calc(100vh - 215px)",

                overflow: "auto",
              }}
            >
              <EncounterList
                onEditClick={handleEditClick}
                onDeleteClick={handleDeleteClick}
                searchParam={searchParam}
              />
            </Grid>
          </Grid>
        </Grid>
      </Grid>
      <EncounterCreateComponent
        onOpen={function (isOpen: boolean): void {
          setOpenCreate(isOpen);
        }}
        isOpen={openCreate}
      />
    </Box>
  );
}
