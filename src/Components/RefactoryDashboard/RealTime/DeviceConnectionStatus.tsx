import React from "react";
import { Box, Typography, Button, Grid } from "@mui/material";
import DeviceStatus from "./DeviceStatus";

import { COLORS } from "./../constants";

interface Device {
  name: string;
  status: string;
  deviceId: string;
  signalQuality: string;
  batteryPercentage: number;
  lastCommunication: string;
  sessionStart: string;
  isWarning?: boolean;
}

interface DeviceConnectionStatusProps {
  devices: Device[];
  onUpdate?: () => void;
  onAddDevice?: () => void;
}

const DeviceConnectionStatus: React.FC<DeviceConnectionStatusProps> = ({
  devices,
  onUpdate = () => {},
  onAddDevice = () => {},
}) => {
  return (
    <Grid item xs={12}>
      <Box sx={{ p: 2, bgcolor: COLORS.veryLightBlue, borderRadius: 1 }}>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mb: 2,
          }}
        >
          <Typography variant="subtitle1" fontWeight="medium">
            Estado de la Conexión
          </Typography>
          <Button
            variant="text"
            size="small"
            onClick={onUpdate}
            sx={{
              color: COLORS.primary,
              textTransform: "none",
              fontSize: "0.85rem",
            }}
          >
            Actualizar
          </Button>
        </Box>

        {devices.map((device, index) => (
          <DeviceStatus
            key={index}
            name={device.name}
            status={device.status}
            deviceId={device.deviceId}
            signalQuality={device.signalQuality}
            batteryPercentage={device.batteryPercentage}
            lastCommunication={device.lastCommunication}
            sessionStart={device.sessionStart}
            isWarning={device.isWarning}
          />
        ))}

        <Box
          sx={{
            mt: 2,
            p: 2,
            borderRadius: 1,
            border: "1px dashed rgba(0, 0, 0, 0.2)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            cursor: "pointer",
            "&:hover": {
              bgcolor: "rgba(0, 0, 0, 0.04)",
            },
          }}
        >
          <Button
            variant="text"
            onClick={onAddDevice}
            sx={{
              color: COLORS.primary,
              textTransform: "none",
            }}
          >
            + Conectar Nuevo Dispositivo
          </Button>
        </Box>
      </Box>
    </Grid>
  );
};

export default DeviceConnectionStatus;
