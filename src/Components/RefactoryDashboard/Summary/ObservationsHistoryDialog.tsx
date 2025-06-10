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

// Interfaz para cada entrada de observación
interface ObservationEntry {
  date: string;
  author: string;
  content: string;
}

interface ObservationsHistoryDialogProps {
  open: boolean;
  onClose: () => void;
  observations: ObservationEntry[];
  title?: string;
  closeButtonText?: string;
}

const ObservationsHistoryDialog: React.FC<ObservationsHistoryDialogProps> = ({
  open,
  onClose,
  observations = [],
  title = "Historial de Observaciones",
  closeButtonText = "Cerrar",
}) => {
  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>{title}</DialogTitle>
      <DialogContent dividers>
        {observations.length > 0 ? (
          observations.map((observation, index) => (
            <Box
              key={index}
              sx={{ mb: index < observations.length - 1 ? 3 : 0 }}
            >
              <Typography variant="subtitle1" fontWeight="medium">
                {observation.date} - {observation.author}
              </Typography>
              <Typography variant="body2" paragraph>
                {observation.content}
              </Typography>
            </Box>
          ))
        ) : (
          <Typography variant="body1" align="center" sx={{ py: 2 }}>
            No hay observaciones registradas.
          </Typography>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="primary">
          {closeButtonText}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ObservationsHistoryDialog;
