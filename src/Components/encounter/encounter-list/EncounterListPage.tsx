import EncounterList from "./EncounterList";
import { Encounter } from "fhir/r4";

import Grid from "@mui/material/Grid";
import { Box, useMediaQuery, useTheme } from "@mui/material";
import { SearchParams } from "fhir-kit-client";
import { useState } from "react";

const handleEditClick = (person: Encounter) => {
  console.log("Edit clicked for:", person);
};

const handleDeleteClick = (person: Encounter) => {
  console.log("Delete clicked for:", person);
};
export default function PatientListPage() {
  const [searchParam] = useState<SearchParams | undefined>();

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  return (
    <Box>
      <Grid container spacing={2}>
        <Grid item xs>
          <Grid container gap={0.5}>
            <Grid width="100%">{"search component here"}</Grid>
            <Grid
              item
              width="100%"
              sx={{
                height: isMobile
                  ? "calc(100vh - 275px)"
                  : "calc(100vh - 340px)",

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
    </Box>
  );
}
