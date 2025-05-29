import React from "react";
import { Box, Typography, Grid, Skeleton } from "@mui/material";
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
  isLoading?: boolean; // New prop for loading state
}

const GeneralAverages: React.FC<GeneralAveragesProps> = ({
  data,
  isLoading = false, // Default to false if not provided
}) => {
  if (isLoading) {
    return (
      <Box sx={{ p: 2, bgcolor: COLORS.veryLightBlue, borderRadius: 1, mb: 2 }}>
        <Skeleton width={300} height={24} sx={{ mb: 1 }} />
        <Grid container spacing={2}>
          {/* SpO2 Skeleton */}
          <Grid item xs={6} sm={3}>
            <Box sx={{ textAlign: "center", p: 1 }}>
              <Skeleton width="80%" height={20} sx={{ mx: "auto" }} />
              <Skeleton width="50%" height={32} sx={{ mx: "auto", my: 1 }} />
              <Skeleton width="70%" height={16} sx={{ mx: "auto" }} />
            </Box>
          </Grid>

          {/* Heart Rate Skeleton */}
          <Grid item xs={6} sm={3}>
            <Box sx={{ textAlign: "center", p: 1 }}>
              <Skeleton width="80%" height={20} sx={{ mx: "auto" }} />
              <Skeleton width="50%" height={32} sx={{ mx: "auto", my: 1 }} />
              <Skeleton width="70%" height={16} sx={{ mx: "auto" }} />
            </Box>
          </Grid>

          {/* Respiratory Rate Skeleton */}
          <Grid item xs={6} sm={3}>
            <Box sx={{ textAlign: "center", p: 1 }}>
              <Skeleton width="80%" height={20} sx={{ mx: "auto" }} />
              <Skeleton width="50%" height={32} sx={{ mx: "auto", my: 1 }} />
              <Skeleton width="70%" height={16} sx={{ mx: "auto" }} />
            </Box>
          </Grid>

          {/* Total Time Skeleton */}
          <Grid item xs={6} sm={3}>
            <Box sx={{ textAlign: "center", p: 1 }}>
              <Skeleton width="80%" height={20} sx={{ mx: "auto" }} />
              <Skeleton width="60%" height={32} sx={{ mx: "auto", my: 1 }} />
              <Skeleton width="70%" height={16} sx={{ mx: "auto" }} />
            </Box>
          </Grid>
        </Grid>
      </Box>
    );
  }

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
