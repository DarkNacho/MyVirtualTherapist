import PractitionerList from "./PractitionerListPatient";

import Grid from "@mui/material/Grid";
import { Box } from "@mui/material";

const PractitionerListPage = () => {
  return (
    <Box>
      <Grid container spacing={2}>
        <Grid item xs>
          <Grid container gap={"38px"}>
            <Grid
              item
              width="100%"
              sx={{
                height: "calc(100vh - 465px)",
                overflow: "auto",
              }}
            >
              <PractitionerList />
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </Box>
  );
};

export default PractitionerListPage;
