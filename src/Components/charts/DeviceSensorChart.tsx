import { useEffect, useRef, useState } from "react";
import { Line } from "react-chartjs-2";
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
import { Button, Tab, Tabs } from "@mui/material";
import { SensorDataByDevice } from "../../Models/SensorModel";

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

export default function DeviceSensorChart({
  sensorDataByDevice,
}: {
  sensorDataByDevice: SensorDataByDevice;
}) {
  const [activeDevice, setActiveDevice] = useState<string>();
  const [activeSensor, setActiveSensor] = useState<string>();
  const chartRef = useRef<any>(null);

  function generateChart(device: string, sensor: string): JSX.Element | null {
    if (!sensorDataByDevice[device] || !sensorDataByDevice[device][sensor]) {
      return null;
    }

    const data = sensorDataByDevice[device][sensor];
    const labels = data.data.map((data) => {
      const time = new Date(data.timestamp_epoch * 1000);
      const milliseconds = data.timestamp_millis;
      const timeString = time.toLocaleTimeString("es-CL", {
        minute: "numeric",
        second: "numeric",
        timeZone: "America/Santiago",
      });

      return `${timeString}.${milliseconds.toString().padStart(3, "0")}`;
    });

    const dataset = {
      label: `Device: ${device}, Sensor: ${sensor}`,
      data: data.data.map((data) => data.value),
      borderColor: "rgb(255, 99, 132)",
      backgroundColor: "rgba(255, 99, 132, 0.5)",
      borderWidth: 2,
      tension: 0.5,
    };

    const options: ChartOptions<"line"> = {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: "top" as const,
          display: false,
        },
        title: {
          display: true,
          text: `Valor: ${data.stats.avgValue} Mínimo: ${data.stats.minValue} \t Máximo: ${data.stats.maxValue}`,
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
      <div
        key={`${device}-${sensor}`}
        style={{ overflowX: "auto", maxWidth: "100%" }}
      >
        <div style={{ minWidth: "1000px", height: "500px" }}>
          <Line
            ref={chartRef}
            data={{ labels, datasets: [dataset] }}
            options={options}
          />
        </div>
      </div>
    );
  }

  const resetChart = () => {
    if (chartRef.current) {
      chartRef.current.resetZoom(); // Reset zoom
    }
  };

  useEffect(() => {
    // Update activeDevice to the first device if data is available
    if (!activeDevice && Object.keys(sensorDataByDevice).length > 0) {
      setActiveDevice(Object.keys(sensorDataByDevice)[0]);
    }
    if (
      !activeSensor &&
      activeDevice &&
      Object.keys(sensorDataByDevice[activeDevice]).length > 0
    ) {
      setActiveSensor(Object.keys(sensorDataByDevice[activeDevice])[0]);
    }
  }, [sensorDataByDevice]);

  const chart =
    activeDevice && activeSensor && generateChart(activeDevice, activeSensor);

  return (
    <div>
      <Tabs
        value={activeDevice}
        onChange={(_, value) => {
          setActiveDevice(value);
          setActiveSensor(Object.keys(sensorDataByDevice[value])[0]);
        }}
        indicatorColor="primary"
        textColor="primary"
        variant="scrollable"
        scrollButtons="auto"
      >
        {Object.keys(sensorDataByDevice).map((device) => (
          <Tab key={device} label={device} value={device} />
        ))}
      </Tabs>
      {activeDevice && (
        <Tabs
          value={activeSensor}
          onChange={(_, value) => {
            setActiveSensor(value);
          }}
          indicatorColor="primary"
          textColor="primary"
          variant="scrollable"
          scrollButtons="auto"
        >
          {Object.keys(sensorDataByDevice[activeDevice]).map((sensor) => (
            <Tab key={sensor} label={sensor} value={sensor} />
          ))}
        </Tabs>
      )}
      {chart}
      <Button variant="outlined" onClick={resetChart}>
        Restablecer
      </Button>
    </div>
  );
}
