import React from "react";
import { Box, Typography, Grid, Button } from "@mui/material";
import { COLORS } from "../constants";

interface NotableEventsSectionProps {
  onOpenTrendHistory: (trendType: string) => void;
}

const NotableEventsSection: React.FC<NotableEventsSectionProps> = ({
  onOpenTrendHistory,
}) => {
  return (
    <Box sx={{ p: 2, bgcolor: COLORS.veryLightBlue, borderRadius: 1 }}>
      <Typography variant="subtitle1" fontWeight="medium" mb={1}>
        Eventos Notables
      </Typography>
      <Grid container spacing={4}>
        <Grid item xs={12} md={6}>
          <Box
            sx={{
              p: 2,
              borderRadius: 1,
              bgcolor: "rgba(255, 235, 235, 0.8)",
              border: "1px solid rgba(255, 105, 105, 0.3)",
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
              <Typography variant="body2" color="error.main">
                SpO2 &lt; 90%
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
                onClick={() => onOpenTrendHistory("spo2_events")}
              >
                Historial
              </Button>
            </Box>
            <Typography variant="body1">
              2 eventos (última: 15/03/2024)
            </Typography>
          </Box>
        </Grid>
        <Grid item xs={12} md={6}>
          <Box
            sx={{
              p: 2,
              borderRadius: 1,
              bgcolor: "rgba(232, 244, 253, 0.8)",
              border: "1px solid rgba(33, 150, 243, 0.3)",
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
              <Typography variant="body2" color="info.main">
                FC &gt; 100 LPM
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
                onClick={() => onOpenTrendHistory("fc_events")}
              >
                Historial
              </Button>
            </Box>
            <Typography variant="body1">
              3 eventos (última: 01/03/2024)
            </Typography>
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
};

export default NotableEventsSection;
