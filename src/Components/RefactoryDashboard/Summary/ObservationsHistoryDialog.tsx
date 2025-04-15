import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
} from "@mui/material";

interface ObservationsHistoryDialogProps {
  open: boolean;
  onClose: () => void;
}

const ObservationsHistoryDialog: React.FC<ObservationsHistoryDialogProps> = ({
  open,
  onClose,
}) => {
  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>Historial de Observaciones</DialogTitle>
      <DialogContent dividers>
        <Box sx={{ mb: 3 }}>
          <Typography variant="subtitle1" fontWeight="medium">
            20/03/2024 - Dr. Martínez
          </Typography>
          <Typography variant="body2" paragraph>
            La paciente muestra una evolución favorable en los parámetros
            cardiovasculares. Los episodios de desaturación son aislados y no
            persistentes. Se recomienda continuar con el mismo esquema de
            monitorización y mantener la frecuencia de las sesiones actuales.
          </Typography>
        </Box>
        <Box sx={{ mb: 3 }}>
          <Typography variant="subtitle1" fontWeight="medium">
            05/02/2024 - Dr. Martínez
          </Typography>
          <Typography variant="body2" paragraph>
            Se observan mejoras en la capacidad respiratoria. La frecuencia
            cardíaca muestra una tendencia a la normalización. Recomiendo
            continuar con el tratamiento actual.
          </Typography>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="primary">
          Cerrar
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ObservationsHistoryDialog;
