import React from "react";
import { Box, Typography, Grid, Button } from "@mui/material";
import { COLORS } from "../constants";

interface ProgressSectionProps {
  onOpenTrendHistory: (trendType: string) => void;
}

const ProgressSection: React.FC<ProgressSectionProps> = ({
  onOpenTrendHistory,
}) => {
  return (
    <Box sx={{ p: 2, bgcolor: COLORS.veryLightBlue, borderRadius: 1 }}>
      <Typography variant="subtitle1" fontWeight="medium" mb={1}>
        Progreso
      </Typography>
      <Grid container spacing={2}>
        <Grid item xs={12} sm={6}>
          <Box
            sx={{
              p: 2,
              borderRadius: 1,
              bgcolor: "rgba(70, 128, 255, 0.1)",
              border: "1px solid rgba(70, 128, 255, 0.3)",
              mb: { xs: 2, sm: 0 },
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
              <Typography variant="body2" color="textSecondary">
                Tendencia SpO2
              </Typography>
              <Button
                size="small"
                sx={{
                  color: COLORS.primary,
                  textTransform: "none",
                  fontSize: "0.75rem",
                  minWidth: "auto",
                  p: "2px 8px",
                }}
                onClick={() => onOpenTrendHistory("spo2")}
              >
                Historial
              </Button>
            </Box>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <Typography
                variant="body1"
                fontWeight="medium"
                color={COLORS.primary}
              >
                Estable
              </Typography>
              <Typography variant="body2" color="success.main">
                +1.2%
              </Typography>
            </Box>
          </Box>
        </Grid>
        <Grid item xs={12} sm={6}>
          <Box
            sx={{
              p: 2,
              borderRadius: 1,
              bgcolor: "rgba(70, 128, 255, 0.1)",
              border: "1px solid rgba(70, 128, 255, 0.3)",
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
              <Typography variant="body2" color="textSecondary">
                Tendencia FC
              </Typography>
              <Button
                size="small"
                sx={{
                  color: COLORS.primary,
                  textTransform: "none",
                  fontSize: "0.75rem",
                  minWidth: "auto",
                  p: "2px 8px",
                }}
                onClick={() => onOpenTrendHistory("fc")}
              >
                Historial
              </Button>
            </Box>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <Typography
                variant="body1"
                fontWeight="medium"
                color={COLORS.primary}
              >
                Mejorando
              </Typography>
              <Typography variant="body2" color="success.main">
                -3.5 LPM
              </Typography>
            </Box>
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
};

export default ProgressSection;
