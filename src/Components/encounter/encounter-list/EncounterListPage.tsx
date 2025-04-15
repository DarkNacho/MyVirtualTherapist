import { Encounter } from "fhir/r4";

import Grid from "@mui/material/Grid";
import { Box } from "@mui/material";

import EncounterCalendar from "./EncounterCalendar";
import { loadUserRoleFromLocalStorage } from "../../../Utils/RolUser";

const handleEditClick = (person: Encounter) => {
  console.log("Edit clicked for:", person);
};

const handleDeleteClick = (person: Encounter) => {
  console.log("Delete clicked for:", person);
};
export default function EncounterListPage() {
  const userRol = loadUserRoleFromLocalStorage();

  return (
    <Box>
      <Grid container spacing={2}>
        <Grid item xs>
          <Grid container gap={"38px"}>
            {/*<Grid width="100%">
              <EncounterSearchComponent
                handleAdd={handleOpenCreate}
                setSearchParam={setSearchParam}
              />
            </Grid>*/}
            <Grid
              item
              width="100%"
              sx={{
                height: "calc(100vh - 305px)",
                overflow: "auto",
              }}
            >
              <EncounterCalendar
                onEditClick={handleEditClick}
                onDeleteClick={handleDeleteClick}
                searchParam={
                  userRol === "Practitioner"
                    ? { participant: `${localStorage.getItem("id")}` }
                    : { patient: localStorage.getItem("id")! }
                }
              />
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </Box>
  );
}
