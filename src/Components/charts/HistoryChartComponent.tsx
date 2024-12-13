import React, { useRef } from "react";
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
import { Button, Grid } from "@mui/material";

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

interface HistoryChartComponentProps {
  data: { name: string; value: string }[];
}

const HistoryChartComponent: React.FC<HistoryChartComponentProps> = ({
  data,
}) => {
  const chartRef = useRef<any>(null);

  const labels = data.map((entry) => {
    const time = new Date(entry.value);
    console.log("time", entry.value);
    return time.toLocaleTimeString("en-US", {
      month: "short",
      day: "numeric",
      hour: "numeric",
      minute: "numeric",
      second: "numeric",
    });
  });

  const dataset = {
    label: "Historial",
    data: data.map((entry) => parseFloat(entry.name)),
    borderColor: "rgb(255, 99, 132)",
    backgroundColor: "rgba(255, 99, 132, 0.5)",
    borderWidth: 2,
    tension: 0.5,
  };

  const options: ChartOptions<"line"> = {
    responsive: true,
    plugins: {
      legend: {
        position: "top" as const,
      },
      title: {
        display: false,
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

  const resetChart = () => {
    if (chartRef.current) {
      chartRef.current.resetZoom(); // Reset zoom
    }
  };

  console.log(data);
  return (
    <div>
      <Grid sx={{ backgroundColor: "rgba(228,233,242, 0.5)" }}>
        <Line
          ref={chartRef}
          data={{ labels, datasets: [dataset] }}
          options={options}
        />
      </Grid>
      <Button variant="outlined" onClick={resetChart}>
        Reset
      </Button>
    </div>
  );
};

export default HistoryChartComponent;
