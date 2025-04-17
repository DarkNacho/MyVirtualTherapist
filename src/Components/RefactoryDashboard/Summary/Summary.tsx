import React, { useEffect, useMemo, useState } from "react";
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

interface SummaryProps {
  patientId: string;
}

interface SensorSummary {
  min: number | null;
  max: number | null;
  avg: number | null;
  median: number | null;
  stddev: number | null;
  count: number;
}

const Summary: React.FC<SummaryProps> = ({ patientId }) => {
  const baseUrl = import.meta.env.VITE_SERVER_URL; // Use environment variable for base URL

  const [trendDialogOpen, setTrendDialogOpen] = useState(false);
  const [currentTrendType, setCurrentTrendType] = useState<string | null>(null);
  const [observationsHistoryOpen, setObservationsHistoryOpen] = useState(false);
  const [sensorSummary, setSensorSummary] = useState<
    Record<string, SensorSummary>
  >({});

  // Convert API sensor summary to GeneralAveragesData format
  const averagesData: GeneralAveragesData = useMemo(() => {
    // Default data structure with placeholder values
    // Calculate date 7 days ago
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    const formattedDate = sevenDaysAgo.toLocaleDateString("es-CL");

    const defaultData: GeneralAveragesData = {
      lastSessionCount: 9999,
      spo2: {
        average: 0,
        minRange: 0,
        maxRange: 0,
      },
      heartRate: {
        average: 0,
        minRange: 0,
        maxRange: 0,
      },
      respiratoryRate: {
        average: 0,
        minRange: 0,
        maxRange: 0,
      },
      totalTime: {
        hours: 0,
        minutes: 0,
        since: formattedDate,
      },
    };

    // Early return if data isn't loaded yet
    if (Object.keys(sensorSummary).length === 0) {
      return defaultData;
    }

    // Map sensor data to the correct format
    try {
      // SpO2 data
      if (sensorSummary["SpO2"]) {
        defaultData.spo2 = {
          average: Math.round(sensorSummary["SpO2"].avg ?? 0),
          minRange: Math.round(sensorSummary["SpO2"].min ?? 0),
          maxRange: Math.round(sensorSummary["SpO2"].max ?? 0),
        };
      }

      // Heart rate data
      if (sensorSummary["Frecuencia Cardíaca"]) {
        defaultData.heartRate = {
          average: Math.round(sensorSummary["Frecuencia Cardíaca"].avg ?? 0),
          minRange: Math.round(sensorSummary["Frecuencia Cardíaca"].min ?? 0),
          maxRange: Math.round(sensorSummary["Frecuencia Cardíaca"].max ?? 0),
        };
      }

      // Respiratory rate data
      if (sensorSummary["Frecuencia Respiratoria"]) {
        defaultData.respiratoryRate = {
          average: Math.round(
            sensorSummary["Frecuencia Respiratoria"].avg ?? 0
          ),
          minRange: Math.round(
            sensorSummary["Frecuencia Respiratoria"].min ?? 0
          ),
          maxRange: Math.round(
            sensorSummary["Frecuencia Respiratoria"].max ?? 0
          ),
        };
      }

      // You might want to fetch the totalTime data separately or calculate it

      return defaultData;
    } catch (error) {
      console.error("Error converting sensor summary to averages data:", error);
      return defaultData;
    }
  }, [sensorSummary]);

  const [loadingSensorSumarry, setLoadingSensorSumarry] =
    useState<boolean>(false);

  const handleOpenTrendHistory = (trendType: string) => {
    setCurrentTrendType(trendType);
    setTrendDialogOpen(true);
  };

  const handleCloseTrendHistory = () => {
    setTrendDialogOpen(false);
    setCurrentTrendType(null);
  };

  const fetchSensorSummary = async () => {
    if (!patientId) return; // Ensure patientId is defined
    try {
      setLoadingSensorSumarry(true);
      const response = await fetch(
        `${baseUrl}/report/sensors/${patientId}/summary`
      );
      if (!response.ok) {
        throw new Error(
          `Error fetching sensor summary: ${response.statusText}`
        );
      }
      const data = await response.json();
      console.log("Sensor summary data:", data); // Debugging line
      setSensorSummary(data);
    } catch (error) {
      console.error("Error fetching sensor summary:", error);
    } finally {
      setLoadingSensorSumarry(false);
    }
  };

  useEffect(() => {
    if (patientId) {
      fetchSensorSummary();
      //fetchSensorProgress();
    }
  }, [patientId]);

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
            Total: NNN sesiones
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
