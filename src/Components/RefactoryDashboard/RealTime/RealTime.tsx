import React, { useMemo, useEffect, useState } from "react";
import { Box, Grid, Typography } from "@mui/material";
import { COLORS } from "../constants";
import useWebSocket from "../../charts/useWebSocket";
import ConnectionStatus from "./ConnectionStatus";
import SensorReadings from "./SensorReadings";
import DebugInfo from "./DebugInfo";
import SensorChart from "./SensorChart";
import AlertMessages from "./AlertMessages";

export default function RealTime({
  patientId,
  token,
}: {
  patientId?: string;
  token?: string;
}) {
  console.log("WebSocketChart - patientId:", patientId);
  console.log("WebSocketChart - token:", token);

  // For debugging
  const [debugInfo, setDebugInfo] = useState({
    hasDevices: false,
    deviceNames: [],
    hasSpo2: false,
    hasHeartRate: false,
    hasRespRate: false,
  });

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

  // ...existing code...

  const {
    currentSpo2,
    currentHeartRate,
    currentRespRate,
    hasData,
    chartData,
    sensorDevices,
  } = useMemo(() => {
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
      sensorDevices: {
        spo2Device: "",
        heartRateDevice: "",
        respRateDevice: "",
      },
    };

    if (!sensorDataByDevice || Object.keys(sensorDataByDevice).length === 0) {
      return emptyResult;
    }

    // Initialize variables to store data from different devices
    let spo2Data = null;
    let heartRateData = null;
    let respRateData = null;
    let spo2Device = "";
    let heartRateDevice = "";
    let respRateDevice = "";

    // Search for each sensor across all devices
    Object.keys(sensorDataByDevice).forEach((deviceName) => {
      const device = sensorDataByDevice[deviceName];

      // Check if this device has SpO2 data
      if (device["SpO2"]?.data) {
        spo2Data = device["SpO2"].data;
        spo2Device = deviceName;
      }

      // Check if this device has heart rate data
      if (device["Frecuencia Cardíaca"]?.data) {
        heartRateData = device["Frecuencia Cardíaca"].data;
        heartRateDevice = deviceName;
      }

      // Check if this device has respiratory rate data
      if (device["Frecuencia Respiratoria"]?.data) {
        respRateData = device["Frecuencia Respiratoria"].data;
        respRateDevice = deviceName;
      }
    });

    // Debug data structure
    console.log("Debug Data Structure:");
    if (spo2Device) {
      console.log(`Device: ${spo2Device}`);
      console.log(`\nSensor: SpO2`);
      console.log(`Has data: ${!!spo2Data}`);
      console.log(`Data count: ${spo2Data ? spo2Data.length : 0}`);
    }

    if (heartRateDevice) {
      console.log(`Device: ${heartRateDevice}`);
      console.log(`\nSensor: Frecuencia Cardíaca`);
      console.log(`Has data: ${!!heartRateData}`);
      console.log(`Data count: ${heartRateData ? heartRateData.length : 0}`);
    }

    if (respRateDevice) {
      console.log(`Device: ${respRateDevice}`);
      console.log(`\nSensor: Frecuencia Respiratoria`);
      console.log(`Has data: ${!!respRateData}`);
      console.log(`Data count: ${respRateData ? respRateData.length : 0}`);
    }

    // Calculate averages using the last 5 values if data exists
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

    // Extract values for charts
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
      currentHeartRate: heartRateData ? calculateAverage(heartRateData) : "N/A",
      currentRespRate: respRateData ? calculateAverage(respRateData) : "N/A",
      hasData: hasAnyData,
      chartData: {
        spo2: spo2Data ? extractChartValues(spo2Data) : [],
        heartRate: heartRateData ? extractChartValues(heartRateData) : [],
        respRate: respRateData ? extractChartValues(respRateData) : [],
      },
      sensorDevices: {
        spo2Device,
        heartRateDevice,
        respRateDevice,
      },
    };
  }, [sensorDataByDevice]);

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

  const deviceName = Object.keys(sensorDataByDevice || {})[0] || "";

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
        <ConnectionStatus isConnected={isConnected} />
      </Box>

      <AlertMessages isConnected={isConnected} hasData={hasData} />

      {import.meta.env.DEV && (
        <DebugInfo sensorDataByDevice={sensorDataByDevice} />
      )}

      <Grid container spacing={5}>
        {/* Medición en tiempo real */}
        <Grid item xs={12}>
          <SensorReadings
            currentSpo2={currentSpo2}
            currentHeartRate={currentHeartRate}
            currentRespRate={currentRespRate}
          />
        </Grid>

        {/* SpO2 Chart */}
        <Grid item xs={12} md={6}>
          <SensorChart
            title="SpO2"
            sensorName="SpO2"
            data={chartData.spo2}
            currentValue={currentSpo2}
            valueUnit="%"
            color={COLORS.primary}
            generateLabels={generateLabels}
            hasData={hasData}
            deviceName={sensorDevices.spo2Device}
            minValue={90}
            maxValue={100}
          />
        </Grid>

        {/* Heart Rate Chart */}
        <Grid item xs={12} md={6}>
          <SensorChart
            title="Frecuencia Cardíaca"
            sensorName="Frecuencia Cardíaca"
            data={chartData.heartRate}
            currentValue={currentHeartRate}
            valueUnit="LPM"
            color={COLORS.redLine}
            generateLabels={generateLabels}
            hasData={hasData}
            deviceName={sensorDevices.heartRateDevice}
            minValue={40}
            maxValue={180}
          />
        </Grid>

        {/* Respiratory Rate Chart */}
        <Grid item xs={12} md={12}>
          <SensorChart
            title="Frecuencia Respiratoria"
            sensorName="Frecuencia Respiratoria"
            data={chartData.respRate}
            currentValue={currentRespRate}
            valueUnit="RPM"
            color={COLORS.cyanLine}
            generateLabels={generateLabels}
            hasData={hasData}
            deviceName={sensorDevices.respRateDevice}
            minValue={8}
            maxValue={30}
          />
        </Grid>
      </Grid>
    </Box>
  );
}
