import React from "react";
import { Alert } from "@mui/material";

interface AlertMessagesProps {
  isConnected: boolean;
  hasData: boolean;
}

const AlertMessages: React.FC<AlertMessagesProps> = ({
  isConnected,
  hasData,
}) => {
  if (!isConnected) {
    return (
      <Alert severity="warning" sx={{ mb: 3 }}>
        No hay conexión con el servidor de datos. Intentando reconectar...
      </Alert>
    );
  }

  if (isConnected && !hasData) {
    return (
      <Alert severity="info" sx={{ mb: 3 }}>
        Conexión establecida, esperando datos del sensor...
      </Alert>
    );
  }

  return null;
};

export default AlertMessages;
