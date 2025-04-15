import React, { useState } from "react";
import { Paper, Box, Typography, Grid } from "@mui/material";

import GeneralAverages, { GeneralAveragesData } from "./GeneralAverages";
import ProgressSection from "./ProgressSection";
import NotableEventsSection from "./NotableEventsSection";
import ProfessionalObservations from "./ProfessionalObservations";
import TrendHistoryDialog from "./TrendHistoryDialog";
import ObservationsHistoryDialog from "./ObservationsHistoryDialog";

//interface SummaryProps {
//  // Add any props if needed/
//}

const averagesData: GeneralAveragesData = {
  lastSessionCount: 3,
  spo2: {
    average: 95,
    minRange: 93,
    maxRange: 98,
  },
  heartRate: {
    average: 76,
    minRange: 68,
    maxRange: 88,
  },
  respiratoryRate: {
    average: 14,
    minRange: 12,
    maxRange: 18,
  },
  totalTime: {
    hours: 9,
    minutes: 15,
    since: "10/01/2024",
  },
};

const Summary: React.FC = () => {
  const [trendDialogOpen, setTrendDialogOpen] = useState(false);
  const [currentTrendType, setCurrentTrendType] = useState<string | null>(null);
  const [observationsHistoryOpen, setObservationsHistoryOpen] = useState(false);

  const handleOpenTrendHistory = (trendType: string) => {
    setCurrentTrendType(trendType);
    setTrendDialogOpen(true);
  };

  const handleCloseTrendHistory = () => {
    setTrendDialogOpen(false);
    setCurrentTrendType(null);
  };

  return (
    <>
      <Paper sx={{ p: 3, mb: 3, borderRadius: 2, bgcolor: "white" }}>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mb: 2,
          }}
        >
          <Typography variant="h6" fontWeight="bold">
            Resumen
          </Typography>
          <Typography variant="subtitle2" color="textSecondary">
            Total: 12 sesiones
          </Typography>
        </Box>

        <Grid container spacing={4}>
          <Grid item xs={12}>
            <GeneralAverages data={averagesData} />
          </Grid>

          <Grid item xs={12} md={6}>
            <ProgressSection onOpenTrendHistory={handleOpenTrendHistory} />
          </Grid>

          <Grid item xs={12} md={6}>
            <NotableEventsSection onOpenTrendHistory={handleOpenTrendHistory} />
          </Grid>

          <Grid item xs={12}>
            <ProfessionalObservations
              onOpenObservationsHistory={() => setObservationsHistoryOpen(true)}
            />
          </Grid>
        </Grid>
      </Paper>

      {/* Dialogs */}
      <TrendHistoryDialog
        open={trendDialogOpen}
        onClose={handleCloseTrendHistory}
        trendType={currentTrendType}
      />

      <ObservationsHistoryDialog
        open={observationsHistoryOpen}
        onClose={() => setObservationsHistoryOpen(false)}
      />
    </>
  );
};

export default Summary;
