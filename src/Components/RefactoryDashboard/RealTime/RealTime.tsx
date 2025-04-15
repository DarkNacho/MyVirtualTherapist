import React, { useRef, useMemo, useEffect, useState } from "react";
import { Box, Button, Grid, Typography, Alert } from "@mui/material";
import { Line } from "react-chartjs-2";
import { COLORS } from "../constants";
import { lineOptions } from "../chartConfig";
import useWebSocket from "../../charts/useWebSocket";

export default function RealTime({
  patientId,
  token,
}: {
  patientId?: string;
  token?: string;
}) {
  console.log("WebSocketChart - patientId:", patientId);
  console.log("WebSocketChart - token:", token);

  const spo2RealtimeChartRef = useRef(null);
  const hrRealtimeChartRef = useRef(null);
  const respRealtimeChartRef = useRef(null);

  // For debugging
  const [debugInfo, setDebugInfo] = useState({
    hasDevices: false,
    deviceNames: [],
    hasSpo2: false,
    hasHeartRate: false,
    hasRespRate: false,
  });

  const resetZoomForChart = (chartRef: any) => {
    if (chartRef.current) {
      chartRef.current.resetZoom();
    }
  };

  let webSocketUrl = `${
    import.meta.env.VITE_CHART_SERVER_URL
  }/dashboard_ws?token=${localStorage.getItem("access_token")}&patient_id=7`; //${patientId}

  if (!patientId && token) {
    webSocketUrl = `${
      import.meta.env.VITE_CHART_SERVER_URL
    }/dashboard_ws_public?token=${token}`;
  }

  const [sensorDataByDevice, isConnected] = useWebSocket(webSocketUrl);

  // Debug logging to understand data structure
  useEffect(() => {
    if (sensorDataByDevice) {
      const deviceNames = Object.keys(sensorDataByDevice);
      const primaryDevice = deviceNames[0] || ""; // Usually "Pulsioxímetro"

      setDebugInfo({
        hasDevices: deviceNames.length > 0,
        deviceNames,
        hasSpo2: primaryDevice && !!sensorDataByDevice[primaryDevice]?.["SpO2"],
        hasHeartRate:
          primaryDevice &&
          !!sensorDataByDevice[primaryDevice]?.["Frecuencia Cardíaca"],
        hasRespRate:
          primaryDevice &&
          !!sensorDataByDevice[primaryDevice]?.["Frecuencia Respiratoria"],
      });

      console.log("WebSocket Data Structure:", sensorDataByDevice);
      if (primaryDevice) {
        console.log("Primary Device:", primaryDevice);
        console.log(
          "Available Sensors:",
          Object.keys(sensorDataByDevice[primaryDevice] || {})
        );
      }
    }
  }, [sensorDataByDevice]);

  // Update the useMemo section with better debugging

  const { currentSpo2, currentHeartRate, currentRespRate, hasData, chartData } =
    useMemo(() => {
      // Default return with empty data
      const emptyResult = {
        currentSpo2: "N/A",
        currentHeartRate: "N/A",
        currentRespRate: "N/A",
        hasData: false,
        chartData: {
          spo2: [],
          heartRate: [],
          respRate: [],
        },
      };

      if (!sensorDataByDevice || Object.keys(sensorDataByDevice).length === 0) {
        return emptyResult;
      }

      // Find the device (usually "Pulsioxímetro")
      const deviceName = Object.keys(sensorDataByDevice)[0];
      if (!deviceName) return emptyResult;

      const device = sensorDataByDevice[deviceName];

      // Get sensor data if available
      const spo2Data = device?.["SpO2"]?.data;
      const heartRateData = device?.["Frecuencia Cardíaca"]?.data;
      const respRateData = device?.["Frecuencia Respiratoria"]?.data;

      // Debug data structure
      console.log("Device name:", deviceName);
      console.log(
        "SpO2 data exists:",
        !!spo2Data,
        spo2Data ? spo2Data.length : 0
      );
      console.log(
        "Heart rate data exists:",
        !!heartRateData,
        heartRateData ? heartRateData.length : 0
      );
      console.log(
        "Resp rate data exists:",
        !!respRateData,
        respRateData ? respRateData.length : 0
      );

      // If we have SpO2 but not the others, inspect the structure
      if (spo2Data && (!heartRateData || !respRateData)) {
        console.log("SpO2 data first item:", spo2Data[0]);
        console.log("Available sensors:", Object.keys(device));

        // Check directly if specific keys exist in the device
        const cardiacSensorExists = "Frecuencia Cardíaca" in device;
        const respSensorExists = "Frecuencia Respiratoria" in device;

        console.log("Cardiac sensor key exists:", cardiacSensorExists);
        console.log("Respiratory sensor key exists:", respSensorExists);

        // If the keys exist but data access fails, check their structure
        if (cardiacSensorExists) {
          console.log(
            "Cardiac sensor structure:",
            device["Frecuencia Cardíaca"]
          );
        }

        if (respSensorExists) {
          console.log(
            "Respiratory sensor structure:",
            device["Frecuencia Respiratoria"]
          );
        }
      }

      // Calculate averages using the last 5 values if data exists (following WebSocketChart logic)
      const calculateAverage = (dataArray) => {
        if (!dataArray || !Array.isArray(dataArray) || dataArray.length === 0) {
          return "N/A";
        }

        try {
          const lastFiveData = dataArray.slice(-5);
          const avgValue =
            lastFiveData.reduce((sum, data) => sum + data.value, 0) /
            lastFiveData.length;
          return Math.round(avgValue).toString();
        } catch (error) {
          console.error("Error calculating average:", error);
          console.log("Data causing error:", dataArray.slice(-5));
          return "N/A";
        }
      };

      // Extract values for charts (similar to WebSocketChart)
      const extractChartValues = (dataArray) => {
        if (!dataArray || !Array.isArray(dataArray)) return [];
        try {
          return dataArray.map((item) => item.value);
        } catch (error) {
          console.error("Error extracting chart values:", error);
          return [];
        }
      };

      // Check if we have any valid data
      const hasAnyData = !!(spo2Data || heartRateData || respRateData);

      return {
        currentSpo2: spo2Data ? calculateAverage(spo2Data) : "N/A",
        currentHeartRate: heartRateData
          ? calculateAverage(heartRateData)
          : "N/A",
        currentRespRate: respRateData ? calculateAverage(respRateData) : "N/A",
        hasData: hasAnyData,
        chartData: {
          spo2: spo2Data ? extractChartValues(spo2Data) : [],
          heartRate: heartRateData ? extractChartValues(heartRateData) : [],
          respRate: respRateData ? extractChartValues(respRateData) : [],
        },
      };
    }, [sensorDataByDevice]);
  // Generate labels similar to WebSocketChart for time display
  const generateLabels = (device, sensor) => {
    if (!sensorDataByDevice?.[device]?.[sensor]?.data) return [];

    const data = sensorDataByDevice[device][sensor].data;
    return data.map((item) => {
      const time = new Date(item.timestamp_epoch * 1000);
      const milliseconds = item.timestamp_millis;
      return (
        time.toLocaleTimeString("es-CL", {
          minute: "numeric",
          second: "numeric",
          timeZone: "America/Santiago",
        }) +
        "." +
        milliseconds.toString().padStart(3, "0")
      );
    });
  };

  return (
    <Box
      sx={{
        p: 3,
        borderRadius: 2,
        bgcolor: "white",
        boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.05)",
        mb: 6,
      }}
    >
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 2,
        }}
      >
        <Typography variant="h6" fontWeight="bold">
          Datos del Sensor en Tiempo Real
        </Typography>
        <Box sx={{ display: "flex", alignItems: "center" }}>
          <Box
            sx={{
              width: 10,
              height: 10,
              borderRadius: "50%",
              bgcolor: isConnected ? "success.main" : "error.main",
              mr: 1,
            }}
          />
          <Typography variant="caption" sx={{ mr: 2 }}>
            {isConnected ? "Conectado" : "Desconectado"}
          </Typography>
          <Button
            variant="contained"
            onClick={() => {
              const dummyZoomLink = "https://zoom.us/j/123456789";
              navigator.clipboard.writeText(dummyZoomLink);
              alert("Link de Zoom copiado al portapapeles");
            }}
            sx={{
              bgcolor: "#2D8CFF",
              "&:hover": {
                bgcolor: "#2681F2",
              },
              color: "white",
              textTransform: "none",
              fontWeight: "medium",
            }}
          >
            Obtener Link de Video Llamada por Zoom
          </Button>
        </Box>
      </Box>

      {!isConnected && (
        <Alert severity="warning" sx={{ mb: 3 }}>
          No hay conexión con el servidor de datos. Intentando reconectar...
        </Alert>
      )}

      {isConnected && !hasData && (
        <Alert severity="info" sx={{ mb: 3 }}>
          Conexión establecida, esperando datos del sensor...
        </Alert>
      )}

      {/* Debug info - remove in production */}
      {import.meta.env.DEV && (
        <Grid item xs={12}>
          <Box
            sx={{
              p: 2,
              bgcolor: "#f5f5f5",
              borderRadius: 1,
              mb: 2,
              overflow: "auto",
            }}
          >
            <Typography variant="subtitle2" sx={{ mb: 1 }}>
              Debug Data Structure:
            </Typography>

            {Object.keys(sensorDataByDevice || {}).map((deviceName) => (
              <Box key={deviceName} sx={{ mb: 2 }}>
                <Typography variant="body2" fontWeight="bold">
                  Device: {deviceName}
                </Typography>

                <Box component="ul" sx={{ m: 0, pl: 2 }}>
                  {Object.keys(sensorDataByDevice[deviceName] || {}).map(
                    (sensorName) => (
                      <Box component="li" key={sensorName} sx={{ mb: 1 }}>
                        <Typography variant="caption" display="block">
                          Sensor: {sensorName}
                        </Typography>
                        <Typography
                          variant="caption"
                          display="block"
                          sx={{ ml: 2 }}
                        >
                          Has data:{" "}
                          {sensorDataByDevice[deviceName][sensorName]?.data
                            ? "Yes"
                            : "No"}
                        </Typography>
                        <Typography
                          variant="caption"
                          display="block"
                          sx={{ ml: 2 }}
                        >
                          Data count:{" "}
                          {sensorDataByDevice[deviceName][sensorName]?.data
                            ?.length || 0}
                        </Typography>
                      </Box>
                    )
                  )}
                </Box>
              </Box>
            ))}
          </Box>
        </Grid>
      )}

      <Grid container spacing={5}>
        {/* Medición en tiempo real */}
        <Grid item xs={12}>
          <Box
            sx={{
              p: 2,
              bgcolor: COLORS.veryLightBlue,
              borderRadius: 1,
              mb: 2,
              display: "flex",
              justifyContent: "space-around",
            }}
          >
            <Box sx={{ textAlign: "center", p: 2 }}>
              <Typography variant="body2" color="textSecondary">
                SpO2 Actual
              </Typography>
              <Typography
                variant="h4"
                color={
                  currentSpo2 === "N/A" ? "text.secondary" : COLORS.primary
                }
                fontWeight="bold"
              >
                {currentSpo2}
                {currentSpo2 !== "N/A" ? "%" : ""}
              </Typography>
            </Box>
            <Box sx={{ textAlign: "center", p: 2 }}>
              <Typography variant="body2" color="textSecondary">
                Frecuencia Cardíaca
              </Typography>
              <Typography
                variant="h4"
                color={
                  currentHeartRate === "N/A" ? "text.secondary" : COLORS.redLine
                }
                fontWeight="bold"
              >
                {currentHeartRate}
                {currentHeartRate !== "N/A" ? " LPM" : ""}
              </Typography>
            </Box>
            <Box sx={{ textAlign: "center", p: 2 }}>
              <Typography variant="body2" color="textSecondary">
                Frecuencia Respiratoria
              </Typography>
              <Typography
                variant="h4"
                color={
                  currentRespRate === "N/A" ? "text.secondary" : COLORS.cyanLine
                }
                fontWeight="bold"
              >
                {currentRespRate}
                {currentRespRate !== "N/A" ? " RPM" : ""}
              </Typography>
            </Box>
          </Box>
        </Grid>

        {/* Gráficos separados para cada variable */}
        <Grid item xs={12} md={6}>
          <Box
            sx={{
              p: 2,
              bgcolor: COLORS.veryLightBlue,
              borderRadius: 1,
              mb: 2,
              height: "430px",
            }}
          >
            <Typography variant="subtitle1" fontWeight="medium" mb={2}>
              SpO2 en Tiempo Real
            </Typography>
            <Box sx={{ width: "100%", height: "310px" }}>
              {!hasData || chartData.spo2.length === 0 ? (
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    height: "100%",
                    color: "text.secondary",
                    flexDirection: "column",
                  }}
                >
                  <Typography variant="body1" sx={{ mb: 1 }}>
                    No se están recibiendo datos
                  </Typography>
                  <Typography variant="caption">
                    Esperando información del sensor...
                  </Typography>
                </Box>
              ) : (
                <Line
                  data={{
                    labels: generateLabels(
                      Object.keys(sensorDataByDevice)[0],
                      "SpO2"
                    ),
                    datasets: [
                      {
                        label: "SpO2 (%)",
                        data: chartData.spo2,
                        borderColor: COLORS.primary,
                        borderWidth: 2,
                        pointRadius: 0,
                        fill: false,
                        tension: 0.4,
                      },
                    ],
                  }}
                  options={{
                    ...lineOptions,
                    responsive: true,
                    maintainAspectRatio: false,
                    animation: {
                      duration: 0,
                    },
                    plugins: {
                      ...lineOptions.plugins,
                      legend: {
                        display: true,
                        position: "top",
                      },
                      title: {
                        display: true,
                        text: `SpO2 Promedio: ${currentSpo2}%`,
                      },
                    },
                    scales: {
                      ...lineOptions.scales,
                      x: {
                        ...lineOptions.scales?.x,
                        display: true,
                        title: {
                          display: true,
                          text: "Tiempo",
                        },
                        ticks: {
                          maxRotation: 45,
                          minRotation: 45,
                          callback: function (_, index) {
                            // Show fewer labels for clarity
                            const labels = generateLabels(
                              Object.keys(sensorDataByDevice)[0],
                              "SpO2"
                            );
                            return index % 5 === 0 ? labels[index] : "";
                          },
                          color: COLORS.darkGray,
                          font: {
                            size: 10,
                          },
                        },
                        grid: {
                          display: true,
                          color: "rgba(0, 0, 0, 0.05)",
                        },
                      },
                      y: {
                        ...lineOptions.scales?.y,
                        min: 90,
                        max: 100,
                        title: {
                          display: true,
                          text: "SpO2 (%)",
                        },
                      },
                    },
                  }}
                  ref={spo2RealtimeChartRef}
                />
              )}
            </Box>
            <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 2 }}>
              <Button
                onClick={() => resetZoomForChart(spo2RealtimeChartRef)}
                variant="text"
                disabled={!hasData || chartData.spo2.length === 0}
                sx={{
                  color: COLORS.secondary,
                  textTransform: "none",
                  fontWeight: "normal",
                  fontSize: "0.85rem",
                }}
              >
                Resetear Zoom
              </Button>
            </Box>
          </Box>
        </Grid>

        {/* Add heart rate and resp rate charts similarly */}
      </Grid>
    </Box>
  );
}
