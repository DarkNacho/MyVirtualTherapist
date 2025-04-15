import React from "react";
import { Box, Typography, Button } from "@mui/material";
import { COLORS } from "../constants";

interface ProfessionalObservationsProps {
  onOpenObservationsHistory: () => void;
}

const ProfessionalObservations: React.FC<ProfessionalObservationsProps> = ({
  onOpenObservationsHistory,
}) => {
  return (
    <Box
      sx={{
        p: 2,
        bgcolor: "rgba(246, 246, 246, 0.7)",
        borderRadius: 1,
        border: "1px dashed rgba(0, 0, 0, 0.12)",
      }}
    >
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 1,
        }}
      >
        <Typography variant="subtitle1" fontWeight="medium" color="textPrimary">
          Observaciones del Profesional
        </Typography>
        <Box>
          <Button
            variant="text"
            size="small"
            sx={{
              color: COLORS.primary,
              textTransform: "none",
              fontSize: "0.75rem",
              mr: 1,
            }}
            onClick={onOpenObservationsHistory}
          >
            Historial
          </Button>
          <Button
            variant="text"
            size="small"
            sx={{
              color: COLORS.primary,
              textTransform: "none",
              fontSize: "0.75rem",
            }}
          >
            Editar
          </Button>
        </Box>
      </Box>
      <Box sx={{ p: 1 }}>
        <Typography
          variant="body2"
          color="text.secondary"
          sx={{ fontStyle: "italic", mb: 1 }}
        >
          Última actualización: 20/03/2024 por Dr. Martínez
        </Typography>
        <Typography variant="body1">
          La paciente muestra una evolución favorable en los parámetros
          cardiovasculares. Los episodios de desaturación son aislados y no
          persistentes. Se recomienda continuar con el mismo esquema de
          monitorización y mantener la frecuencia de las sesiones actuales.
        </Typography>
      </Box>
    </Box>
  );
};

export default ProfessionalObservations;
