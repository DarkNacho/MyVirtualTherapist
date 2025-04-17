import React from "react";
import { Box, Typography } from "@mui/material";
import { COLORS } from "../constants";

interface SensorReadingsProps {
  currentSpo2: string;
  currentHeartRate: string;
  currentRespRate: string;
}

const SensorReadings: React.FC<SensorReadingsProps> = ({
  currentSpo2,
  currentHeartRate,
  currentRespRate,
}) => {
  return (
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
          color={currentSpo2 === "N/A" ? "text.secondary" : COLORS.primary}
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
          color={currentHeartRate === "N/A" ? "text.secondary" : COLORS.redLine}
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
          color={currentRespRate === "N/A" ? "text.secondary" : COLORS.cyanLine}
          fontWeight="bold"
        >
          {currentRespRate}
          {currentRespRate !== "N/A" ? " RPM" : ""}
        </Typography>
      </Box>
    </Box>
  );
};

export default SensorReadings;
