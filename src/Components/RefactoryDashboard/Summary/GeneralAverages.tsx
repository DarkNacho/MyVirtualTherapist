import React from "react";
import { Box, Typography, Grid } from "@mui/material";
import { COLORS } from "../constants";

export interface GeneralAveragesData {
  lastSessionCount: number;
  spo2: {
    average: number;
    minRange: number;
    maxRange: number;
  };
  heartRate: {
    average: number;
    minRange: number;
    maxRange: number;
  };
  respiratoryRate: {
    average: number;
    minRange: number;
    maxRange: number;
  };
  totalTime: {
    hours: number;
    minutes: number;
    since: string; // Date in format DD/MM/YYYY
  };
}

interface GeneralAveragesProps {
  data: GeneralAveragesData;
}

const GeneralAverages: React.FC<GeneralAveragesProps> = ({ data }) => {
  return (
    <Box sx={{ p: 2, bgcolor: COLORS.veryLightBlue, borderRadius: 1, mb: 2 }}>
      <Typography variant="subtitle1" fontWeight="medium" mb={1}>
        Promedios Generales Últimas {data.lastSessionCount} Sesiones
      </Typography>
      <Grid container spacing={2}>
        <Grid item xs={6} sm={3}>
          <Box sx={{ textAlign: "center", p: 1 }}>
            <Typography variant="body2" color="textSecondary">
              SpO2 Promedio
            </Typography>
            <Typography variant="h6" color={COLORS.primary} fontWeight="bold">
              {data.spo2.average}%
            </Typography>
            <Typography variant="caption" color="text.secondary">
              Rango: {data.spo2.minRange}-{data.spo2.maxRange}%
            </Typography>
          </Box>
        </Grid>
        <Grid item xs={6} sm={3}>
          <Box sx={{ textAlign: "center", p: 1 }}>
            <Typography variant="body2" color="textSecondary">
              FC Promedio
            </Typography>
            <Typography variant="h6" color="#ff4569" fontWeight="bold">
              {data.heartRate.average} LPM
            </Typography>
            <Typography variant="caption" color="text.secondary">
              Rango: {data.heartRate.minRange}-{data.heartRate.maxRange} LPM
            </Typography>
          </Box>
        </Grid>
        <Grid item xs={6} sm={3}>
          <Box sx={{ textAlign: "center", p: 1 }}>
            <Typography variant="body2" color="textSecondary">
              FR Promedio
            </Typography>
            <Typography variant="h6" color="#1fc8e3" fontWeight="bold">
              {data.respiratoryRate.average} RPM
            </Typography>
            <Typography variant="caption" color="text.secondary">
              Rango: {data.respiratoryRate.minRange}-
              {data.respiratoryRate.maxRange} RPM
            </Typography>
          </Box>
        </Grid>
        <Grid item xs={6} sm={3}>
          <Box sx={{ textAlign: "center", p: 1 }}>
            <Typography variant="body2" color="textSecondary">
              Tiempo Total
            </Typography>
            <Typography variant="h6" color={COLORS.primary} fontWeight="bold">
              {data.totalTime.hours}h {data.totalTime.minutes}m
            </Typography>
            <Typography variant="caption" color="text.secondary">
              Desde: {data.totalTime.since}
            </Typography>
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
};

export default GeneralAverages;
