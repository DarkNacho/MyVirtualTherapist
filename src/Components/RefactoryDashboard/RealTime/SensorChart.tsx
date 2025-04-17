import React, { useRef } from "react";
import { Box, Button, Typography } from "@mui/material";
import { Line } from "react-chartjs-2";
import { COLORS } from "../constants";
import { lineOptions } from "../chartConfig";

interface SensorChartProps {
  title: string;
  sensorName: string;
  data: number[];
  currentValue: string;
  valueUnit: string;
  color: string;
  generateLabels: (device: string, sensor: string) => string[];
  hasData: boolean;
  deviceName: string;
  minValue?: number;
  maxValue?: number;
}

const SensorChart: React.FC<SensorChartProps> = ({
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

  const resetZoom = () => {
    if (chartRef.current) {
      chartRef.current.resetZoom();
    }
  };

  return (
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
        {title}
      </Typography>
      <Box sx={{ width: "100%", height: "310px" }}>
        {!hasData || data.length === 0 ? (
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
              labels: generateLabels(deviceName, sensorName),
              datasets: [
                {
                  label: `${title} (${valueUnit})`,
                  data: data,
                  borderColor: color,
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
                  text: `${title} Promedio: ${currentValue}${valueUnit}`,
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
                      const labels = generateLabels(deviceName, sensorName);
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
                  min: minValue,
                  max: maxValue,
                  title: {
                    display: true,
                    text: `${title} (${valueUnit})`,
                  },
                },
              },
            }}
            ref={chartRef}
          />
        )}
      </Box>
      <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 2 }}>
        <Button
          onClick={resetZoom}
          variant="text"
          disabled={!hasData || data.length === 0}
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
  );
};

export default SensorChart;
