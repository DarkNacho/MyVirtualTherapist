import React from "react";
import { Box, Typography, Grid } from "@mui/material";

interface DeviceStatusProps {
  name: string;
  status: string;
  deviceId: string;
  signalQuality: string;
  batteryPercentage: number;
  lastCommunication: string;
  sessionStart: string;
  isWarning?: boolean;
}

const DeviceStatus: React.FC<DeviceStatusProps> = ({
  name,
  status,
  deviceId,
  signalQuality,
  batteryPercentage,
  lastCommunication,
  sessionStart,
  isWarning = false,
}) => {
  // Determinar colores según el estado
  const bgColor = isWarning
    ? "rgba(255, 193, 7, 0.1)"
    : "rgba(76, 175, 80, 0.1)";
  const borderColor = isWarning
    ? "rgba(255, 193, 7, 0.3)"
    : "rgba(76, 175, 80, 0.3)";
  const statusBgColor = isWarning
    ? "rgba(255, 193, 7, 0.8)"
    : "rgba(76, 175, 80, 0.8)";
  const nameColor = isWarning ? "warning.main" : "success.main";
  const batteryColor = batteryPercentage < 20 ? "warning.main" : "inherit";

  return (
    <Box
      sx={{
        p: 3,
        borderRadius: 1,
        bgcolor: bgColor,
        border: `1px solid ${borderColor}`,
        display: "flex",
        flexDirection: "column",
        gap: 2,
        mb: 2,
      }}
    >
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <Typography variant="h6" fontWeight="medium" color={nameColor}>
          {name}
        </Typography>
        <Box
          sx={{
            px: 2,
            py: 0.5,
            bgcolor: statusBgColor,
            color: "white",
            borderRadius: 5,
            fontSize: "0.75rem",
            fontWeight: "bold",
          }}
        >
          {status}
        </Box>
      </Box>

      <Grid container spacing={2} sx={{ mt: 1 }}>
        <Grid item xs={12} sm={4}>
          <Box sx={{ display: "flex", flexDirection: "column" }}>
            <Typography variant="body2" color="textSecondary">
              ID Dispositivo
            </Typography>
            <Typography variant="body1" fontWeight="medium">
              {deviceId}
            </Typography>
          </Box>
        </Grid>
        <Grid item xs={12} sm={4}>
          <Box sx={{ display: "flex", flexDirection: "column" }}>
            <Typography variant="body2" color="textSecondary">
              Calidad de Señal
            </Typography>
            <Typography
              variant="body1"
              fontWeight="medium"
              color="success.main"
            >
              {signalQuality}
            </Typography>
          </Box>
        </Grid>
        <Grid item xs={12} sm={4}>
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "flex-start",
            }}
          >
            <Typography variant="body2" color="textSecondary">
              Batería
            </Typography>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <Typography
                variant="body1"
                fontWeight="medium"
                color={batteryColor}
              >
                {batteryPercentage}%
              </Typography>
              <Box
                sx={{
                  width: 80,
                  height: 12,
                  bgcolor: "rgba(0,0,0,0.1)",
                  borderRadius: 6,
                  overflow: "hidden",
                }}
              >
                <Box
                  sx={{
                    width: `${batteryPercentage}%`,
                    height: "100%",
                    bgcolor: isWarning ? "warning.main" : "success.main",
                    borderRadius: 6,
                  }}
                />
              </Box>
            </Box>
          </Box>
        </Grid>
      </Grid>

      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          pt: 2,
          borderTop: "1px dashed rgba(0,0,0,0.1)",
        }}
      >
        <Typography variant="body2" color="textSecondary">
          Última comunicación: {lastCommunication}
        </Typography>
        <Typography variant="body2" color="textSecondary">
          Sesión iniciada: {sessionStart}
        </Typography>
      </Box>
    </Box>
  );
};

export default DeviceStatus;
