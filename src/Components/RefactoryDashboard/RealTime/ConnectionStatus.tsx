import React from "react";
import { Box, Button, Typography } from "@mui/material";
import HandleResult from "../../../Utils/HandleResult";

interface ConnectionStatusProps {
  isConnected: boolean;
}

const ConnectionStatus: React.FC<ConnectionStatusProps> = ({ isConnected }) => {
  const handleCopyZoomLink = () => {
    const dummyZoomLink = "https://zoom.us/j/123456789";
    navigator.clipboard.writeText(dummyZoomLink);
    HandleResult.showSuccessMessage("Link de Zoom copiado al portapapeles");
  };

  return (
    <Box sx={{ display: "flex", alignItems: "center" }}>
      <Box
        sx={{
          width: 10,
          height: 10,
          borderRadius: "50%",
          bgcolor: isConnected ? "success.main" : "error.main",
          mr: 1,
        }}
      />
      <Typography variant="caption" sx={{ mr: 2 }}>
        {isConnected ? "Conectado" : "Desconectado"}
      </Typography>
      <Button
        variant="contained"
        onClick={handleCopyZoomLink}
        sx={{
          bgcolor: "#2D8CFF",
          "&:hover": {
            bgcolor: "#2681F2",
          },
          color: "white",
          textTransform: "none",
          fontWeight: "medium",
        }}
      >
        Obtener Link de Video Llamada por Zoom
      </Button>
    </Box>
  );
};

export default ConnectionStatus;
