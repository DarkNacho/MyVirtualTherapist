import { useMemo, useRef, memo } from "react";
import { Box, Typography, Paper } from "@mui/material";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
  ChartOptions,
} from "chart.js";

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);
interface SensorChartProps {
  title: string;
  sensorName: string;
  data: number[];
  currentValue: string;
  valueUnit: string;
  color: string;
  generateLabels: (deviceName: string, sensorName: string) => string[];
  hasData: boolean;
  deviceName: string;
  minValue: number;
  maxValue: number;
}

// Memoize the chart component to prevent unnecessary re-renders
const SensorChart = memo<SensorChartProps>(
  ({
    title,
    sensorName,
    data,
    currentValue,
    valueUnit,
    color,
    generateLabels,
    hasData,
    deviceName,
    minValue,
    maxValue,
  }) => {
    const chartRef = useRef(null);

    // Memoize chart data to avoid recreating on every render
    const chartData = useMemo(() => {
      // Only generate labels if we have data
      const labels =
        data.length > 0 ? generateLabels(deviceName, sensorName) : [];

      return {
        labels,
        datasets: [
          {
            label: title,
            data: data,
            fill: false,
            borderColor: color,
            borderWidth: 2,
            tension: 0.3,
            pointRadius: 0, // No points for better performance
            pointHoverRadius: 4,
          },
        ],
      };
    }, [data, deviceName, sensorName, generateLabels, title, color]);

    // Memoize chart options
    const options = useMemo<ChartOptions<"line">>(
      () => ({
        responsive: true,
        maintainAspectRatio: false,
        animation: {
          duration: 0,
        },
        plugins: {
          legend: {
            display: false,
          },
          tooltip: {
            enabled: true,
            intersect: false,
            mode: "index",
          },
        },
        scales: {
          y: {
            min: minValue,
            max: maxValue,
            beginAtZero: false,
          },
          x: {
            ticks: {
              maxTicksLimit: 10,
              maxRotation: 0,
            },
          },
        },
        elements: {
          line: {
            cubicInterpolationMode: "monotone",
          },
        },
        interaction: {
          mode: "index",
          intersect: false,
        },
      }),
      [minValue, maxValue]
    );

    // Display "No Data" message when appropriate
    if (!hasData) {
      return (
        <Paper
          elevation={0}
          sx={{
            p: 2,
            height: 300,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            border: "1px solid rgba(0, 0, 0, 0.12)",
            borderRadius: 2,
          }}
        >
          <Typography variant="body1" color="text.secondary">
            No hay datos disponibles
          </Typography>
        </Paper>
      );
    }

    return (
      <Paper
        elevation={0}
        sx={{
          p: 2,
          borderRadius: 2,
          border: "1px solid rgba(0, 0, 0, 0.12)",
        }}
      >
        <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
          <Typography variant="subtitle1" fontWeight="medium">
            {title}
          </Typography>
          <Typography variant="h6" fontWeight="bold" sx={{ color }}>
            {currentValue !== "N/A" ? `${currentValue} ${valueUnit}` : "N/A"}
          </Typography>
        </Box>

        <Box sx={{ height: 240, position: "relative" }}>
          <Line
            ref={chartRef}
            data={chartData}
            options={options}
            height={240}
          />
        </Box>
      </Paper>
    );
  }
);

export default SensorChart;
