import { useMemo, useEffect, useState, useCallback } from "react";
import { Box, Grid, Typography } from "@mui/material";
import { COLORS } from "../constants";
import useThrottledWebSocket from "../../charts/useThrottledWebSocket";
import ConnectionStatus from "./ConnectionStatus";
import SensorReadings from "./SensorReadings";
import DebugInfo from "./DebugInfo";
import SensorChart from "../Charts/SensorChart";
import AlertMessages from "./AlertMessages";
import DeviceConnectionStatus from "./DeviceConnectionStatus";

// Maximum number of data points to display in charts
const MAX_DATA_POINTS = 100;

// Define interfaces for the data structure
interface SensorDataPoint {
  value: number;
  timestamp_epoch: number;
}

interface DebugInfoState {
  hasDevices: boolean;
  deviceNames: string[];
  hasSpo2: boolean;
  hasHeartRate: boolean;
  hasRespRate: boolean;
}

interface ChartData {
  spo2: number[];
  heartRate: number[];
  respRate: number[];
}

interface SensorDevices {
  spo2Device: string;
  heartRateDevice: string;
  respRateDevice: string;
}

interface ProcessedSensorData {
  currentSpo2: string;
  currentHeartRate: string;
  currentRespRate: string;
  hasData: boolean;
  chartData: ChartData;
  sensorDevices: SensorDevices;
}

interface RealTimeProps {
  patientId?: string;
  token?: string;
}

export default function RealTime({ patientId, token }: RealTimeProps) {
  // For debugging
  const [debugInfo, setDebugInfo] = useState<DebugInfoState>({
    hasDevices: false,
    deviceNames: [],
    hasSpo2: false,
    hasHeartRate: false,
    hasRespRate: false,
  });

  let webSocketUrl = `${
    import.meta.env.VITE_CHART_SERVER_URL
  }/dashboard_ws?token=${localStorage.getItem(
    "access_token"
  )}&patient_id=${patientId}`; //${patientId}

  if (!patientId && token) {
    webSocketUrl = `${
      import.meta.env.VITE_CHART_SERVER_URL
    }/dashboard_ws_public?token=${token}`;
  }

  const [sensorDataByDevice, isConnected] = useThrottledWebSocket(
    webSocketUrl,
    500
  );

  // Debug logging to understand data structure - only in development mode
  useEffect(() => {
    if (import.meta.env.DEV && sensorDataByDevice) {
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
    }
  }, [sensorDataByDevice]);

  const {
    currentSpo2,
    currentHeartRate,
    currentRespRate,
    hasData,
    chartData,
    sensorDevices,
  } = useMemo<ProcessedSensorData>(() => {
    // Default return with empty data
    const emptyResult: ProcessedSensorData = {
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
    let spo2Data: SensorDataPoint[] | null = null;
    let heartRateData: SensorDataPoint[] | null = null;
    let respRateData: SensorDataPoint[] | null = null;
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

    // Calculate averages using the last 5 values if data exists
    const calculateAverage = (dataArray: SensorDataPoint[] | null): string => {
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
        if (import.meta.env.DEV) {
          console.error("Error calculating average:", error);
        }
        return "N/A";
      }
    };

    // Extract values for charts - limit to MAX_DATA_POINTS
    const extractChartValues = (
      dataArray: SensorDataPoint[] | null
    ): number[] => {
      if (!dataArray || !Array.isArray(dataArray)) return [];
      try {
        return dataArray.slice(-MAX_DATA_POINTS).map((item) => item.value);
      } catch (error) {
        if (import.meta.env.DEV) {
          console.error("Error extracting chart values:", error);
        }
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

  const generateLabels = useCallback(
    (device: string, sensor: string): string[] => {
      if (!sensorDataByDevice?.[device]?.[sensor]?.data) return [];

      // Get only the latest data points that match our chart data
      const data = sensorDataByDevice[device][sensor].data.slice(
        -MAX_DATA_POINTS
      );

      // Format timestamps with cached formatter
      return data.map((item) => {
        const time = new Date(item.timestamp_epoch * 1000);
        // Only include seconds for smoother rendering
        return time.toLocaleTimeString("es-CL", {
          minute: "numeric",
          second: "numeric",
          timeZone: "America/Santiago",
        });
      });
    },
    [sensorDataByDevice]
  );

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
        <Grid item xs={12}>
          <DeviceConnectionStatus
            devices={[
              {
                name: "Pulsioxímetro",
                status: "ONLINE",
                deviceId: "SMARTM-OX22",
                signalQuality: "Excelente",
                batteryPercentage: 85,
                lastCommunication: "hace 2 segundos",
                sessionStart: "15:30",
              },
              {
                name: "Sensor Inercial",
                status: "ONLINE",
                deviceId: "SMARTM-INR15",
                signalQuality: "Buena",
                batteryPercentage: 72,
                lastCommunication: "hace 5 segundos",
                sessionStart: "15:30",
              },
              {
                name: "Mascarilla",
                status: "BATERÍA BAJA",
                deviceId: "SMARTM-ECG08",
                signalQuality: "Buena",
                batteryPercentage: 18,
                lastCommunication: "hace 8 segundos",
                sessionStart: "15:30",
                isWarning: true,
              },
            ]}
            onUpdate={() => alert("Actualizando conexión...")}
            onAddDevice={() => alert("Agregar nuevo dispositivo...")}
          />
        </Grid>
      </Grid>
    </Box>
  );
}
