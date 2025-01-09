import { useState, useEffect } from "react";
import WelcomeComponent from "../WelcomeComponent";
import { Grid, Box, useMediaQuery, useTheme } from "@mui/material";
import PatientListPage from "../patient/patient-list/PatientListPage";
import PractitionerListPage from "../practitioner/practitioner-list/PractitionerListPage";
import { useTranslation } from "react-i18next";
import EncounterListPage from "../encounter/encounter-list/EncounterListPage";

export default function ResourceListPage() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const { t } = useTranslation();

  const [selectedItem, setSelectedItem] = useState<string>(
    window.location.hash.substring(1)
  );

  useEffect(() => {
    const handleHashChange = () => {
      setSelectedItem(window.location.hash.substring(1));
    };

    window.addEventListener("hashchange", handleHashChange);

    return () => {
      window.removeEventListener("hashchange", handleHashChange);
    };
  }, []);

  /*
  useEffect(() => {
    interface LocationChangeEvent extends Event {
      detail: string;
    }

    const handleLocationChange = (event: LocationChangeEvent) => {
      setSelectedItem(event.detail);
    };

    window.addEventListener(
      "locationChange",
      handleLocationChange as EventListener
    );

    return () => {
      window.removeEventListener(
        "locationChange",
        handleLocationChange as EventListener
      );
    };
  }, []);
*/

  const renderContent = () => {
    switch (selectedItem) {
      case t("header.patients"):
        return <PatientListPage />;
      case t("header.practitioners"):
        return <PractitionerListPage />;
      case t("header.encounters"):
        return <EncounterListPage />;
      // Add more cases here for other options
      default:
        return (
          <div>Select an option from the menu, selected: {selectedItem}</div>
        );
    }
  };

  return (
    <Box>
      <Grid container spacing={1}>
        {!isMobile && (
          <Grid item minWidth={"637px"} minHeight={"664px"}>
            <WelcomeComponent userName={localStorage.getItem("name")!} />
          </Grid>
        )}
        <Grid item xs>
          {renderContent()}
        </Grid>
      </Grid>
    </Box>
  );
}
