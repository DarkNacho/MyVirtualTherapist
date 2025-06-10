import { FC, useRef, useState } from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ChartOptions,
} from "chart.js";
import { Line, Bar } from "react-chartjs-2";
import {
  Grid,
  Paper,
  Typography,
  Box,
  Tab,
  Tabs,
  Button,
  IconButton,
  Tooltip as MuiTooltip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Avatar,
} from "@mui/material";
import zoomPlugin from "chartjs-plugin-zoom";
import HelpOutlineIcon from "@mui/icons-material/HelpOutline";
import CloseIcon from "@mui/icons-material/Close";
import DownloadIcon from "@mui/icons-material/Download";
import ShareIcon from "@mui/icons-material/Share";
import { COLORS } from "./constants";
import { lineOptions, barOptions } from "./Charts/chartConfig";
import RealTime from "../RefactoryDashboard/RealTime/RealTime";
import Summary from "../RefactoryDashboard/Summary/Summary";

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  zoomPlugin
);

// Interface for props
interface DashboardPage {
  patientId: string;
}

const DashboardPage: FC<DashboardPage> = ({ patientId }) => {
  // All your chart refs remain the same

  // State for selected view
  const [selectedVitalsView, setSelectedVitalsView] =
    useState<string>("general");

  // Switch view handler
  const handleVitalsViewChange = (view: string) => {
    setSelectedVitalsView(view);
  };

  // Render buttons for view switching
  const renderVitalsViewButtons = () => (
    <>
      <Box
        sx={{
          display: "flex",
          mb: 3,
          borderRadius: 2,
          bgcolor: "white",
          boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.04)",
          overflow: "hidden",
          p: "2px",
        }}
      >
        <Button
          onClick={() => handleVitalsViewChange("general")}
          sx={{
            flex: 1,
            py: 1.5,
            borderRadius: 1.5,
            textTransform: "none",
            fontWeight: "medium",
            color: selectedVitalsView === "general" ? "white" : COLORS.primary,
            bgcolor:
              selectedVitalsView === "general" ? COLORS.primary : "transparent",
            "&:hover": {
              bgcolor:
                selectedVitalsView === "general"
                  ? COLORS.secondary
                  : "rgba(0, 0, 0, 0.04)",
            },
          }}
        >
          Vista General
        </Button>
        <Button
          onClick={() => handleVitalsViewChange("realtime")}
          sx={{
            flex: 1,
            py: 1.5,
            borderRadius: 1.5,
            textTransform: "none",
            fontWeight: "medium",
            color: selectedVitalsView === "realtime" ? "white" : COLORS.primary,
            bgcolor:
              selectedVitalsView === "realtime"
                ? COLORS.primary
                : "transparent",
            "&:hover": {
              bgcolor:
                selectedVitalsView === "realtime"
                  ? COLORS.secondary
                  : "rgba(0, 0, 0, 0.04)",
            },
          }}
        >
          En Tiempo Real
        </Button>
        <Button
          onClick={() => handleVitalsViewChange("session")}
          sx={{
            flex: 1,
            py: 1.5,
            borderRadius: 1.5,
            textTransform: "none",
            fontWeight: "medium",
            color: selectedVitalsView === "session" ? "white" : COLORS.primary,
            bgcolor:
              selectedVitalsView === "session" ? COLORS.primary : "transparent",
            "&:hover": {
              bgcolor:
                selectedVitalsView === "session"
                  ? COLORS.secondary
                  : "rgba(0, 0, 0, 0.04)",
            },
          }}
        >
          Por Sesión
        </Button>
      </Box>
    </>
  );

  return (
    <Box sx={{ p: 3, backgroundColor: "#f5f7fa", minHeight: "100vh" }}>
      <Typography variant="h4" component="h1" fontWeight="bold" mb={3}>
        Telemonitoreo del Paciente
      </Typography>

      {renderVitalsViewButtons()}

      {/* Render appropriate content based on selected view */}
      {selectedVitalsView === "general" && <Summary patientId={patientId} />}

      {selectedVitalsView === "realtime" && <RealTime patientId={patientId} />}

      {selectedVitalsView === "session" && (
        <Paper sx={{ p: 3, mb: 3, borderRadius: 2, bgcolor: "white" }}>
          <Typography variant="h6" fontWeight="bold" mb={2}>
            Vista por Sesión
          </Typography>
          <Typography variant="body1">
            Aquí se mostrará el detalle de las sesiones individuales (bajo
            desarrollo)
          </Typography>
          {/* You can implement your session view here */}
        </Paper>
      )}

      {/* Keep all your dialogs and other components here */}
      {/* ... */}
    </Box>
  );
};

export default DashboardPage;
