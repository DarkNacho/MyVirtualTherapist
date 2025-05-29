import React, { useCallback, useEffect, useMemo, useState } from "react";
import { Paper, Box, Typography, Grid, Skeleton } from "@mui/material";

import GeneralAverages, { GeneralAveragesData } from "./GeneralAverages";
import ProgressSection from "./ProgressSection";
import NotableEventsSection from "./NotableEventsSection";
import ProfessionalObservations from "./ProfessionalObservations";
import TrendHistoryDialog from "./TrendHistoryDialog";
import ObservationsHistoryDialog from "./ObservationsHistoryDialog";
import SensorChart from "../Charts/SensorChart";
import { COLORS } from "../constants";

const observationsHistory = [
  {
    date: "20/03/2024",
    author: "Dr. Martínez",
    content:
      "La paciente muestra una evolución favorable en los parámetros cardiovasculares. Los episodios de desaturación son aislados y no persistentes. Se recomienda continuar con el mismo esquema de monitorización y mantener la frecuencia de las sesiones actuales.",
  },
  {
    date: "05/02/2024",
    author: "Dr. Martínez",
    content:
      "Se observan mejoras en la capacidad respiratoria. La frecuencia cardíaca muestra una tendencia a la normalización. Recomiendo continuar con el tratamiento actual.",
  },
];

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

// First, define interfaces for the data structure
interface SensorData {
  values: number[];
  timestamps: string[];
}

interface SessionData {
  [sensorType: string]: SensorData;
}

interface HistoricalData {
  [sessionId: string]: SessionData;
}

interface ChartData {
  values: number[];
  labels: string[];
}

interface HistoricalDataState {
  spo2: HistoricalData | null;
  heartRate: HistoricalData | null;
  respRate: HistoricalData | null;
}

const Summary: React.FC<SummaryProps> = ({ patientId }) => {
  const baseUrl = import.meta.env.VITE_SERVER_URL; // Use environment variable for base URL

  const [trendDialogOpen, setTrendDialogOpen] = useState(false);
  const [currentTrendType, setCurrentTrendType] = useState<string | null>(null);
  const [observationsHistoryOpen, setObservationsHistoryOpen] = useState(false);
  const [sensorSummary, setSensorSummary] = useState<
    Record<string, SensorSummary>
  >({});

  const [historicalData, setHistoricalData] = useState<HistoricalDataState>({
    spo2: null,
    heartRate: null,
    respRate: null,
  });

  const [historicalDataLoading, setHistoricalDataLoading] = useState(true);

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

  const [loadingSensorSummary, setLoadingSensorSummary] =
    useState<boolean>(true);

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
      setLoadingSensorSummary(true);
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
      setLoadingSensorSummary(false);
    }
  };

  // Add after your existing functions
  const fetchHistoricalSensorData = async (sensorType: string) => {
    if (!patientId) return null;

    try {
      const response = await fetch(
        `${baseUrl}/report/sensors/${patientId}/by-sensor?required_sensor_type=${sensorType}`
      );

      if (!response.ok) {
        throw new Error(
          `Error fetching historical data: ${response.statusText}`
        );
      }

      const data = await response.json();
      console.log(`Historical ${sensorType} data:`, data);
      return data;
    } catch (error) {
      console.error(`Error fetching ${sensorType} historical data:`, error);
      return null;
    }
  };

  const prepareChartData = useCallback(
    (data: HistoricalData | null, sensorType: string): ChartData => {
      if (!data) return { values: [], labels: [] };

      // Get the first session (or a specific one if needed)
      const sessionId = Object.keys(data)[0];
      if (!sessionId || !data[sessionId][sensorType]) {
        return { values: [], labels: [] };
      }

      const sessionData = data[sessionId][sensorType];

      // Format timestamps to more readable format
      const labels = sessionData.timestamps.map((timestamp) => {
        const date = new Date(timestamp);
        return date.toLocaleTimeString("es-CL", {
          hour: "2-digit",
          minute: "2-digit",
        });
      });

      return {
        values: sessionData.values,
        labels: labels,
      };
    },
    []
  );

  // Add this function
  const loadHistoricalData = async () => {
    setHistoricalDataLoading(true);

    // Fetch data for each sensor type
    const spo2Data = await fetchHistoricalSensorData("SpO2");
    const heartRateData = await fetchHistoricalSensorData(
      "Frecuencia Cardíaca"
    );
    const respRateData = await fetchHistoricalSensorData(
      "Frecuencia Respiratoria"
    );

    setHistoricalData({
      spo2: spo2Data,
      heartRate: heartRateData,
      respRate: respRateData,
    });

    setHistoricalDataLoading(false);
  };

  const generateLabels = useCallback(
    (sensorKey: keyof HistoricalDataState) => {
      return () => {
        const chartData = prepareChartData(
          historicalData[sensorKey],
          sensorKey === "spo2"
            ? "SpO2"
            : sensorKey === "heartRate"
            ? "Frecuencia Cardíaca"
            : "Frecuencia Respiratoria"
        );

        return chartData.labels;
      };
    },
    [historicalData, prepareChartData]
  );

  useEffect(() => {
    if (patientId) {
      fetchSensorSummary();
      loadHistoricalData();
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
            <GeneralAverages
              data={averagesData}
              isLoading={loadingSensorSummary}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <ProgressSection onOpenTrendHistory={handleOpenTrendHistory} />
          </Grid>
          <Grid item xs={12} md={6}>
            <NotableEventsSection onOpenTrendHistory={handleOpenTrendHistory} />
          </Grid>
          <Grid item xs={12}>
            <ProfessionalObservations
              observation="La paciente muestra una evolución favorable en los parámetros cardiovasculares. Los episodios de desaturación son aislados y no persistentes. Se recomienda continuar con el mismo esquema de monitorización y mantener la frecuencia de las sesiones actuales."
              lastUpdatedDate="20/03/2024"
              lastUpdatedBy="Dr. Martínez"
              onOpenObservationsHistory={() => setObservationsHistoryOpen(true)}
              onEdit={() => alert("Abriendo editor de observaciones")}
            />
          </Grid>

          <Grid item xs={12}>
            <Paper sx={{ p: 3, borderRadius: 2, bgcolor: "white", mt: 3 }}>
              <Typography variant="h6" fontWeight="bold" sx={{ mb: 2 }}>
                Histórico de Sesiones (última sesión) TODO: Hacerlo Histórico
                por sesiones (probablemente debería mover esto a Por Sesiones)
              </Typography>

              {historicalDataLoading ? (
                <Grid container spacing={3}>
                  {/* SpO2 Skeleton */}
                  <Grid item xs={12} md={6}>
                    <Paper
                      elevation={0}
                      sx={{
                        p: 2,
                        borderRadius: 2,
                        border: "1px solid rgba(0, 0, 0, 0.12)",
                      }}
                    >
                      <Box
                        sx={{
                          display: "flex",
                          justifyContent: "space-between",
                          mb: 2,
                        }}
                      >
                        <Skeleton width={120} height={30} />
                        <Skeleton width={80} height={30} />
                      </Box>
                      <Skeleton variant="rectangular" height={240} />
                    </Paper>
                  </Grid>

                  {/* Heart Rate Skeleton */}
                  <Grid item xs={12} md={6}>
                    <Paper
                      elevation={0}
                      sx={{
                        p: 2,
                        borderRadius: 2,
                        border: "1px solid rgba(0, 0, 0, 0.12)",
                      }}
                    >
                      <Box
                        sx={{
                          display: "flex",
                          justifyContent: "space-between",
                          mb: 2,
                        }}
                      >
                        <Skeleton width={150} height={30} />
                        <Skeleton width={80} height={30} />
                      </Box>
                      <Skeleton variant="rectangular" height={240} />
                    </Paper>
                  </Grid>

                  {/* Respiratory Rate Skeleton */}
                  <Grid item xs={12} md={12}>
                    <Paper
                      elevation={0}
                      sx={{
                        p: 2,
                        borderRadius: 2,
                        border: "1px solid rgba(0, 0, 0, 0.12)",
                      }}
                    >
                      <Box
                        sx={{
                          display: "flex",
                          justifyContent: "space-between",
                          mb: 2,
                        }}
                      >
                        <Skeleton width={180} height={30} />
                        <Skeleton width={80} height={30} />
                      </Box>
                      <Skeleton variant="rectangular" height={240} />
                    </Paper>
                  </Grid>
                </Grid>
              ) : (
                <Grid container spacing={3}>
                  {/* SpO2 Historical Chart */}
                  <Grid item xs={12} md={6}>
                    {historicalData.spo2 && (
                      <SensorChart
                        title="SpO2"
                        sensorName="SpO2"
                        data={
                          prepareChartData(historicalData.spo2, "SpO2").values
                        }
                        currentValue={
                          sensorSummary["SpO2"]?.avg
                            ? Math.round(sensorSummary["SpO2"].avg).toString()
                            : "N/A"
                        }
                        valueUnit="%"
                        color={COLORS.primary}
                        generateLabels={generateLabels("spo2")}
                        hasData={!!historicalData.spo2}
                        deviceName="Sesión histórica"
                        minValue={sensorSummary["SpO2"]?.min ?? 0}
                        maxValue={sensorSummary["SpO2"]?.max ?? 0}
                      />
                    )}
                  </Grid>

                  {/* Heart Rate Historical Chart */}
                  <Grid item xs={12} md={6}>
                    {historicalData.heartRate && (
                      <SensorChart
                        title="Frecuencia Cardíaca"
                        sensorName="Frecuencia Cardíaca"
                        data={
                          prepareChartData(
                            historicalData.heartRate,
                            "Frecuencia Cardíaca"
                          ).values
                        }
                        currentValue={
                          sensorSummary["Frecuencia Cardíaca"]?.avg
                            ? Math.round(
                                sensorSummary["Frecuencia Cardíaca"].avg
                              ).toString()
                            : "N/A"
                        }
                        valueUnit="LPM"
                        color={COLORS.redLine}
                        generateLabels={generateLabels("heartRate")}
                        hasData={!!historicalData.heartRate}
                        deviceName="Sesión histórica"
                        minValue={
                          sensorSummary["Frecuencia Cardíaca"]?.min ?? 0
                        }
                        maxValue={
                          sensorSummary["Frecuencia Cardíaca"]?.max ?? 0
                        }
                      />
                    )}
                  </Grid>

                  {/* Respiratory Rate Historical Chart */}
                  <Grid item xs={12} md={12}>
                    {historicalData.respRate && (
                      <SensorChart
                        title="Frecuencia Respiratoria"
                        sensorName="Frecuencia Respiratoria"
                        data={
                          prepareChartData(
                            historicalData.respRate,
                            "Frecuencia Respiratoria"
                          ).values
                        }
                        currentValue={
                          sensorSummary["Frecuencia Respiratoria"]?.avg
                            ? Math.round(
                                sensorSummary["Frecuencia Respiratoria"].avg
                              ).toString()
                            : "N/A"
                        }
                        valueUnit="RPM"
                        color={COLORS.cyanLine}
                        generateLabels={generateLabels("respRate")}
                        hasData={!!historicalData.respRate}
                        deviceName="Sesión histórica"
                        minValue={
                          sensorSummary["Frecuencia Respiratoria"]?.min ?? 0
                        }
                        maxValue={
                          sensorSummary["Frecuencia Respiratoria"]?.max ?? 0
                        }
                      />
                    )}
                  </Grid>
                </Grid>
              )}
            </Paper>
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
        observations={observationsHistory}
        open={observationsHistoryOpen}
        onClose={() => setObservationsHistoryOpen(false)}
      />
    </>
  );
};

export default Summary;
