import React from "react";
import { Box, Typography, Button } from "@mui/material";
import { COLORS } from "../constants";

interface ProfessionalObservationsProps {
  observation: string;
  lastUpdatedDate?: string;
  lastUpdatedBy?: string;
  onOpenObservationsHistory: () => void;
  onEdit?: () => void;
}

const ProfessionalObservations: React.FC<ProfessionalObservationsProps> = ({
  observation,
  lastUpdatedDate = "",
  lastUpdatedBy = "",
  onOpenObservationsHistory,
  onEdit = () => {},
}) => {
  const lastUpdateInfo =
    lastUpdatedDate || lastUpdatedBy
      ? `Última actualización: ${lastUpdatedDate}${
          lastUpdatedBy ? ` por ${lastUpdatedBy}` : ""
        }`
      : "";

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
            onClick={onEdit}
          >
            Editar
          </Button>
        </Box>
      </Box>
      <Box sx={{ p: 1 }}>
        {lastUpdateInfo && (
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{ fontStyle: "italic", mb: 1 }}
          >
            {lastUpdateInfo}
          </Typography>
        )}
        <Typography variant="body1">{observation}</Typography>
      </Box>
    </Box>
  );
};

export default ProfessionalObservations;
