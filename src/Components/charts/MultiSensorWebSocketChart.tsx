import { useEffect, useRef, useState } from "react";
import { Line } from "react-chartjs-2";
import useWebSocket from "./useWebSocket";
import zoomPlugin from "chartjs-plugin-zoom";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ChartOptions,
} from "chart.js";
import {
  Box,
  Button,
  Card,
  CardContent,
  Tab,
  Tabs,
  Typography,
} from "@mui/material";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  zoomPlugin
);

// Array de colores para los diferentes sensores
const CHART_COLORS = [
  {
    borderColor: "rgb(255, 99, 132)",
    backgroundColor: "rgba(255, 99, 132, 0.5)",
  },
  {
    borderColor: "rgb(54, 162, 235)",
    backgroundColor: "rgba(54, 162, 235, 0.5)",
  },
  {
    borderColor: "rgb(75, 192, 192)",
    backgroundColor: "rgba(75, 192, 192, 0.5)",
  },
  {
    borderColor: "rgb(153, 102, 255)",
    backgroundColor: "rgba(153, 102, 255, 0.5)",
  },
  {
    borderColor: "rgb(255, 159, 64)",
    backgroundColor: "rgba(255, 159, 64, 0.5)",
  },
  {
    borderColor: "rgb(255, 205, 86)",
    backgroundColor: "rgba(255, 205, 86, 0.5)",
  },
];

export default function MultiSensorWebSocketChart({
  patientId,
  token,
}: {
  patientId?: string;
  token?: string;
}) {
  console.log("MultiSensorWebSocketChart - patientId:", patientId);
  console.log("MultiSensorWebSocketChart - token:", token);

  let webSocketUrl = `${
    import.meta.env.VITE_CHART_SERVER_URL
  }/dashboard_ws?token=${localStorage.getItem(
    "access_token"
  )}&patient_id=${patientId}`;

  if (!patientId && token) {
    webSocketUrl = `${
      import.meta.env.VITE_CHART_SERVER_URL
    }/dashboard_ws_public?token=${token}`;
  }

  const [sensorDataByDevice, isConnected] = useWebSocket(webSocketUrl);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const chartRef = useRef<any>(null);

  const [activeDevice, setActiveDevice] = useState<string>();

  // Función para generar múltiples gráficos de sensores para un dispositivo
  function generateMultiSensorChart(device: string): JSX.Element | null {
    if (!sensorDataByDevice[device]) {
      return null;
    }

    const sensors = Object.keys(sensorDataByDevice[device]);

    if (sensors.length === 0) {
      return (
        <Typography>
          No hay sensores disponibles para este dispositivo
        </Typography>
      );
    }

    // Usamos el primer sensor para establecer las etiquetas de tiempo
    const firstSensor = sensorDataByDevice[device][sensors[0]];
    const labels = firstSensor.data.map((data) => {
      const time = new Date(data.timestamp_epoch * 1000);
      const milliseconds = data.timestamp_millis;
      const timeString = time.toLocaleTimeString("es-CL", {
        minute: "numeric",
        second: "numeric",
        timeZone: "America/Santiago",
      });

      return `${timeString}.${milliseconds.toString().padStart(3, "0")}`;
    });

    // Crear un dataset para cada sensor
    const datasets = sensors.map((sensor, index) => {
      const sensorData = sensorDataByDevice[device][sensor];
      const colorIndex = index % CHART_COLORS.length;

      return {
        label: `Sensor: ${sensor}`,
        data: sensorData.data.map((data) => data.value),
        borderColor: CHART_COLORS[colorIndex].borderColor,
        backgroundColor: CHART_COLORS[colorIndex].backgroundColor,
        borderWidth: 2,
        tension: 0.5,
      };
    });

    const options: ChartOptions<"line"> = {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: "top" as const,
          display: true,
        },
        title: {
          display: true,
          text: `Dispositivo: ${device}`,
        },
        zoom: {
          pan: {
            enabled: true,
            mode: "xy",
          },
          zoom: {
            wheel: {
              enabled: true,
            },
            pinch: {
              enabled: true,
            },
            mode: "xy",
          },
        },
      },
    };

    return (
      <div style={{ overflowX: "auto", maxWidth: "100%" }}>
        <div style={{ minWidth: "1000px", height: "500px" }}>
          <Line ref={chartRef} data={{ labels, datasets }} options={options} />
        </div>
        <Box mt={2}>
          {sensors.map((sensor) => {
            const sensorData = sensorDataByDevice[device][sensor];
            const lastFiveData = sensorData.data.slice(-5);
            const avgValue =
              lastFiveData.reduce((sum, data) => sum + data.value, 0) /
              lastFiveData.length;

            return (
              <Card key={`stats-${device}-${sensor}`} sx={{ mb: 1 }}>
                <CardContent>
                  <Typography variant="subtitle1">
                    <strong>{sensor}</strong>: Valor actual:{" "}
                    {avgValue.toFixed(2)} | Mínimo:{" "}
                    {sensorData.stats.minValue.toFixed(2)} | Máximo:{" "}
                    {sensorData.stats.maxValue.toFixed(2)}
                  </Typography>
                </CardContent>
              </Card>
            );
          })}
        </Box>
      </div>
    );
  }

  const resetChart = () => {
    if (chartRef.current) {
      chartRef.current.resetZoom(); // Reset zoom
    }
  };

  useEffect(() => {
    // Actualizar activeDevice al primer dispositivo si hay datos disponibles
    if (
      !activeDevice &&
      isConnected &&
      Object.keys(sensorDataByDevice).length > 0
    ) {
      setActiveDevice(Object.keys(sensorDataByDevice)[0]);
    }
  }, [isConnected, sensorDataByDevice, activeDevice]);

  if (!isConnected) return <p>Conectando al servidor...</p>;
  if (Object.keys(sensorDataByDevice).length === 0)
    return <p>No se están recibiendo datos</p>;

  const chart = activeDevice && generateMultiSensorChart(activeDevice);

  return (
    <Box>
      <Tabs
        value={activeDevice}
        onChange={(_, value) => setActiveDevice(value)}
        indicatorColor="primary"
        textColor="primary"
        variant="scrollable"
        scrollButtons="auto"
        sx={{ mb: 2 }}
      >
        {Object.keys(sensorDataByDevice).map((device) => (
          <Tab key={device} label={device} value={device} />
        ))}
      </Tabs>

      {!chart && (
        <Typography>Selecciona un dispositivo para ver los datos</Typography>
      )}
      {chart}

      <Button variant="outlined" onClick={resetChart} sx={{ mt: 2 }}>
        Restablecer zoom
      </Button>
    </Box>
  );
}
