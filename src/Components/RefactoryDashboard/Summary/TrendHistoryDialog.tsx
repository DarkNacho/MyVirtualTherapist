import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
} from "@mui/material";

interface TrendHistoryDialogProps {
  open: boolean;
  onClose: () => void;
  trendType: string | null;
}

const TrendHistoryDialog: React.FC<TrendHistoryDialogProps> = ({
  open,
  onClose,
  trendType,
}) => {
  // Dialog content based on trend type
  const renderTrendDialogContent = () => {
    switch (trendType) {
      case "spo2":
        return <Typography>Historial de tendencias de SpO2</Typography>;
      case "fc":
        return (
          <Typography>
            Historial de tendencias de Frecuencia Cardiaca
          </Typography>
        );
      case "spo2_events":
        return <Typography>Historial de eventos de SpO2 &lt; 90%</Typography>;
      case "fc_events":
        return <Typography>Historial de eventos de FC &gt; 100 LPM</Typography>;
      default:
        return <Typography>No hay datos disponibles</Typography>;
    }
  };

  const renderTrendDialogTitle = () => {
    switch (trendType) {
      case "spo2":
        return "Historial de SpO2";
      case "fc":
        return "Historial de Frecuencia Cardiaca";
      case "spo2_events":
        return "Eventos de Desaturación";
      case "fc_events":
        return "Eventos de Taquicardia";
      default:
        return "Historial";
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>{renderTrendDialogTitle()}</DialogTitle>
      <DialogContent dividers>{renderTrendDialogContent()}</DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="primary">
          Cerrar
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default TrendHistoryDialog;
