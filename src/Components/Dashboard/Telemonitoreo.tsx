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
import { lineOptions, barOptions } from "./chartConfig";
import HandleResult from "../../Utils/HandleResult";

// Registrar los componentes necesarios de Chart.js
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

// Interfaces para los datos
interface DashboardProps {
  oxygenSaturationData: number[];
  heartRateData: number[];
  respiratoryRateData: number[];
  patientId?: string;
}

const LightDashboard: FC<DashboardProps> = ({
  oxygenSaturationData,
  heartRateData,
  respiratoryRateData,
  patientId,
}) => {
  const spo2ChartRef = useRef<ChartJS<"line">>(null);
  const heartRateChartRef = useRef<ChartJS<"line">>(null);
  const respRateChartRef = useRef<ChartJS<"line">>(null);
  const inertialChartRef =
    useRef<ChartJS<"line", (number | null)[], string>>(null);
  const realtimeChartRef =
    useRef<ChartJS<"line", (number | null)[], string>>(null);
  const spo2RealtimeChartRef =
    useRef<ChartJS<"line", (number | null)[], string>>(null);
  const hrRealtimeChartRef = useRef<ChartJS<"line">>(null);
  const respRealtimeChartRef = useRef<ChartJS<"line">>(null);
  const lastSessionChartRef = useRef<ChartJS<"line">>(null);
  const detailSpo2ChartRef = useRef<ChartJS<"line">>(null);
  const detailHeartRateChartRef = useRef<ChartJS<"line">>(null);
  const detailRespRateChartRef = useRef<ChartJS<"line">>(null);
  const detailInertialChartRef =
    useRef<ChartJS<"line", (number | null)[], string>>(null);
  // Referencias para los gráficos de sesión
  const spo2SessionChartRef =
    useRef<ChartJS<"line", (number | null)[], string>>(null);
  const heartRateSessionChartRef =
    useRef<ChartJS<"line", (number | null)[], string>>(null);
  const respRateSessionChartRef =
    useRef<ChartJS<"line", (number | null)[], string>>(null);

  const [selectedTab, setSelectedTab] = useState(0);

  // Estado para controlar qué gráfico se muestra en detalle
  const [detailDialog, setDetailDialog] = useState({
    open: false,
    title: "",
    value: "",
    chartType: "", // Para identificar qué gráfico mostrar
    description: "",
  });

  // Estado para controlar el botón seleccionado en la pestaña Signos Vitales
  const [selectedVitalsView, setSelectedVitalsView] = useState("general");

  // Estado para el panel de personalización
  const [customConfig, setCustomConfig] = useState({
    showSpo2: true,
    showHeartRate: true,
    showRespRate: true,
    showInertial: true,
    startDate: new Date(new Date().setMonth(new Date().getMonth() - 1))
      .toISOString()
      .split("T")[0], // Un mes atrás
    endDate: new Date().toISOString().split("T")[0], // Hoy
  });

  // Función para resetear el zoom
  const resetZoomForChart = (chartRef: React.RefObject<ChartJS<"line">>) => {
    if (chartRef.current) {
      chartRef.current.resetZoom();
    }
  };

  // Estilos para los encabezados de las tarjetas
  const cardHeaderStyle = {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    mb: 2,
  };

  // Estilos para las pills que muestran valores principales
  const valuePillStyle = {
    display: "inline-block",
    backgroundColor: COLORS.primary,
    color: "white",
    py: 0.5,
    px: 2,
    borderRadius: 3,
    fontWeight: "bold",
    fontSize: "1rem",
    my: 1,
  };

  // Función para abrir el diálogo de detalle
  const handleOpenDetail = (
    title: string,
    value: string,
    chartType: string,
    description: string
  ) => {
    setDetailDialog({
      open: true,
      title,
      value,
      chartType,
      description,
    });
  };

  // Función para cerrar el diálogo
  const handleCloseDetail = () => {
    setDetailDialog({
      open: false,
      title: "",
      value: "",
      chartType: "",
      description: "",
    });
  };

  // Opciones extendidas para gráficos en vista detallada
  const detailedLineOptions: ChartOptions<"line"> = {
    ...lineOptions,
    plugins: {
      ...lineOptions.plugins,
      title: {
        display: true,
        text: "Detalle histórico",
        font: {
          size: 16,
          weight: "bold",
        },
        color: COLORS.primary,
        padding: {
          top: 10,
          bottom: 20,
        },
      },
      legend: {
        display: true,
        position: "top",
      },
      tooltip: {
        ...lineOptions.plugins?.tooltip,
        callbacks: {
          label: function (context) {
            return `Valor: ${context.raw}`;
          },
        },
      },
    },
    scales: {
      ...lineOptions.scales,
      y: {
        ...lineOptions.scales?.y,
        ticks: {
          ...lineOptions.scales?.y?.ticks,
          font: {
            size: 12,
          },
        },
      },
      x: {
        ...lineOptions.scales?.x,
        ticks: {
          ...lineOptions.scales?.x?.ticks,
          font: {
            size: 12,
          },
        },
      },
    },
  };

  // Manejador para cambiar vista en Signos Vitales
  const handleVitalsViewChange = (view: string) => {
    setSelectedVitalsView(view);
  };

  // Manejador para cambios en la configuración personalizada
  const handleCustomConfigChange = (config: any) => {
    setCustomConfig({ ...customConfig, ...config });
  };

  // Manejador para resetear los filtros de fecha
  const handleResetFilters = () => {
    setCustomConfig({
      ...customConfig,
      startDate: new Date(new Date().setMonth(new Date().getMonth() - 1))
        .toISOString()
        .split("T")[0],
      endDate: new Date().toISOString().split("T")[0],
    });
  };

  // Manejador para cambios de pestaña
  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setSelectedTab(newValue);
    // Resetear la vista de signos vitales a 'general' si cambiamos de pestaña
    if (newValue !== 0) {
      setSelectedVitalsView("general");
      // Limpiar la selección de sesión
      setSelectedSession({
        id: "",
        date: "",
      });
    }
  };

  // Nombre de las pestañas según la imagen
  //const tabNames = ['Signos Vitales', 'Sesiones', 'Evaluaciones'];
  const tabNames = ["Signos Vitales"];

  // Cerca del inicio del componente, donde están las otras declaraciones de useState:
  const [inertialObservationsOpen, setInertialObservationsOpen] =
    useState(false);

  // Estado para el diálogo de historial de tendencias
  const [trendHistoryDialog, setTrendHistoryDialog] = useState({
    open: false,
    type: "",
  });

  // Estado para rastrear la sesión seleccionada
  const [selectedSession, setSelectedSession] = useState({
    id: "",
    date: "",
  });

  const handleOpenTrendHistory = (
    type: "spo2" | "fc" | "spo2_events" | "fc_events"
  ) => {
    setTrendHistoryDialog({
      open: true,
      type,
    });
  };

  // Función para seleccionar una sesión específica
  const handleSessionSelect = (sessionId: string, sessionDate: string) => {
    setSelectedSession({
      id: sessionId,
      date: sessionDate,
    });
    // Cerrar el diálogo de historial
    setTrendHistoryDialog({
      open: false,
      type: "",
    });
    // Cambiar a la vista "session"
    handleVitalsViewChange("session");
  };

  // Botones para las vistas de signos vitales
  const renderVitalsViewButtons = () => (
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
            selectedVitalsView === "realtime" ? COLORS.primary : "transparent",
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
  );

  // Estado para el diálogo de historial de observaciones
  const [observationsHistoryOpen, setObservationsHistoryOpen] = useState(false);

  // Agrego un estado para las sesiones disponibles
  const [availableSessions, setAvailableSessions] = useState([
    { id: "12", date: "15/03/2024", name: "Sesión #12 (15/03/2024)" },
    { id: "11", date: "05/03/2024", name: "Sesión #11 (05/03/2024)" },
    { id: "10", date: "03/03/2024", name: "Sesión #10 (03/03/2024)" },
    { id: "9", date: "01/03/2024", name: "Sesión #9 (01/03/2024)" },
    { id: "8", date: "28/02/2024", name: "Sesión #8 (28/02/2024)" },
    { id: "7", date: "20/02/2024", name: "Sesión #7 (20/02/2024)" },
    { id: "6", date: "15/02/2024", name: "Sesión #6 (15/02/2024)" },
    { id: "5", date: "10/02/2024", name: "Sesión #5 (10/02/2024)" },
    { id: "4", date: "05/02/2024", name: "Sesión #4 (05/02/2024)" },
    { id: "3", date: "01/02/2024", name: "Sesión #3 (01/02/2024)" },
    { id: "2", date: "25/01/2024", name: "Sesión #2 (25/01/2024)" },
    { id: "1", date: "15/01/2024", name: "Sesión #1 (15/01/2024)" },
  ]);

  // Descripciones para cada gráfico
  //TODO: Agregar descripciones a cada idioma
  const chartDescriptions = {
    spo2: "La saturación de oxígeno en sangre (SpO2) es una medida de la cantidad de oxígeno transportada en la sangre. Valores normales son entre 95-100%. Valores por debajo de 90% pueden indicar hipoxemia.",
    heartRate:
      "La frecuencia cardíaca indica cuántas veces late el corazón por minuto. El rango normal para adultos en reposo es de 60-100 latidos por minuto. Variaciones pueden indicar actividad física, estrés o condiciones médicas.",
    respRate:
      "La frecuencia respiratoria mide la cantidad de respiraciones por minuto. Para adultos en reposo, lo normal es entre 12-20 respiraciones/minuto. Valores fuera de este rango pueden indicar problemas respiratorios o metabólicos.",
    inertial:
      "Los sensores inerciales detectan movimientos anómalos o patrones irregulares durante las sesiones del paciente. El histograma muestra la cantidad de eventos registrados por sesión, lo que permite identificar tendencias en la estabilidad postural, temblores o movimientos bruscos que pueden requerir intervención clínica. Un aumento en la frecuencia de eventos puede indicar deterioro neuromotor o problemas de equilibrio.",
  };

  // Función para generar etiquetas de fechas de sesiones para los gráficos
  const generateSessionDateLabels = () => {
    // Usamos las fechas de las sesiones disponibles, ordenadas cronológicamente
    return availableSessions
      .slice() // Creamos una copia para no modificar el original
      .sort((a, b) => {
        // Convertimos las fechas a formato que se pueda comparar (año, mes, día)
        const dateA = a.date.split("/").reverse().join("-");
        const dateB = b.date.split("/").reverse().join("-");
        return new Date(dateA).getTime() - new Date(dateB).getTime();
      })
      .map((session) => {
        // Formatear para incluir número de sesión y fecha abreviada
        const dateParts = session.date.split("/");
        return `S${session.id}\n${dateParts[0]}/${dateParts[1]}`;
      });
  };

  // Generar datos de SpO2 realistas
  const generateSpO2Data = () => {
    return availableSessions
      .map((_, index) => {
        // Valores base que fluctúan entre 94 y 98
        let baseValue = 96;

        // Para las últimas sesiones, mostrar una tendencia de mejora
        if (index > 8) baseValue += 1;

        // Agregar variación aleatoria (-1 a +1)
        return baseValue + Math.floor(Math.random() * 3) - 1;
      })
      .sort(); // Ordenar para que coincida con el orden de las etiquetas
  };

  // Generar datos de FC realistas
  const generateHeartRateData = () => {
    return availableSessions
      .map((session, index) => {
        // Valores base que fluctúan entre 70 y 80
        let baseValue = 75;

        // Simular un valor alto para la sesión 9
        if (session.id === "9") return 102;

        // Para las últimas sesiones, mostrar una tendencia de mejora (FC más baja)
        if (index > 8) baseValue -= 3;

        // Agregar variación aleatoria (-5 a +5)
        return baseValue + Math.floor(Math.random() * 11) - 5;
      })
      .sort(); // Ordenar para que coincida con el orden de las etiquetas
  };

  // Generar datos de FR realistas
  const generateRespRateData = () => {
    return availableSessions
      .slice(0, 7)
      .map((_, index) => {
        // Valores base que fluctúan entre 12 y 16
        let baseValue = 14;

        // Agregar variación aleatoria (-1 a +2)
        return baseValue + Math.floor(Math.random() * 4) - 1;
      })
      .sort(); // Ordenar para que coincida con el orden de las etiquetas
  };

  // Generar datos de eventos anómalos de movimiento para el histograma
  const generateMotionAnomalyEvents = () => {
    return availableSessions.slice(0, 10).map((session) => {
      // Generar número de eventos basado en el ID de sesión
      let baseEvents = 0;

      // Sesiones específicas con más eventos para destacar
      if (session.id === "9") return 8; // Sesión con muchos eventos anómalos
      if (session.id === "7") return 5; // Sesión con varios eventos anómalos
      if (session.id === "4") return 6; // Sesión con varios eventos anómalos

      // Para el resto, generar un número aleatorio entre 0 y 4
      return Math.floor(Math.random() * 5);
    });
  };

  return (
    <Box sx={{ p: 3, backgroundColor: "#f5f7fa", minHeight: "100vh" }}>
      {/* Contenido basado en la pestaña seleccionada */}
      {selectedTab === 0 && (
        <>
          {renderVitalsViewButtons()}

          {/* Vista general - Gráficos originales */}
          {(selectedVitalsView === "general" ||
            (selectedVitalsView === "custom" &&
              Object.values(customConfig).some((val) => val === true))) && (
            <>
              {/* Resumen histórico de signos vitales */}
              {selectedVitalsView === "general" && (
                <Paper sx={{ p: 3, mb: 3, borderRadius: 2, bgcolor: "white" }}>
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      mb: 2,
                    }}
                  >
                    <Typography variant="h6" fontWeight="bold">
                      Resumen
                    </Typography>
                    <Typography variant="subtitle2" color="textSecondary">
                      Total: 12 sesiones
                    </Typography>
                  </Box>

                  <Grid container spacing={4}>
                    <Grid item xs={12}>
                      <Box
                        sx={{
                          p: 2,
                          bgcolor: COLORS.veryLightBlue,
                          borderRadius: 1,
                          mb: 2,
                        }}
                      >
                        <Typography
                          variant="subtitle1"
                          fontWeight="medium"
                          mb={1}
                        >
                          Promedios Generales Últimas 3 Sesiones
                        </Typography>
                        <Grid container spacing={2}>
                          <Grid item xs={6} sm={3}>
                            <Box sx={{ textAlign: "center", p: 1 }}>
                              <Typography variant="body2" color="textSecondary">
                                SpO2 Promedio
                              </Typography>
                              <Typography
                                variant="h6"
                                color={COLORS.primary}
                                fontWeight="bold"
                              >
                                95%
                              </Typography>
                              <Typography
                                variant="caption"
                                color="text.secondary"
                              >
                                Rango: 93-98%
                              </Typography>
                            </Box>
                          </Grid>
                          <Grid item xs={6} sm={3}>
                            <Box sx={{ textAlign: "center", p: 1 }}>
                              <Typography variant="body2" color="textSecondary">
                                FC Promedio
                              </Typography>
                              <Typography
                                variant="h6"
                                color="#ff4569"
                                fontWeight="bold"
                              >
                                76 LPM
                              </Typography>
                              <Typography
                                variant="caption"
                                color="text.secondary"
                              >
                                Rango: 68-88 LPM
                              </Typography>
                            </Box>
                          </Grid>
                          <Grid item xs={6} sm={3}>
                            <Box sx={{ textAlign: "center", p: 1 }}>
                              <Typography variant="body2" color="textSecondary">
                                FR Promedio
                              </Typography>
                              <Typography
                                variant="h6"
                                color="#1fc8e3"
                                fontWeight="bold"
                              >
                                14 RPM
                              </Typography>
                              <Typography
                                variant="caption"
                                color="text.secondary"
                              >
                                Rango: 12-18 RPM
                              </Typography>
                            </Box>
                          </Grid>
                          <Grid item xs={6} sm={3}>
                            <Box sx={{ textAlign: "center", p: 1 }}>
                              <Typography variant="body2" color="textSecondary">
                                Tiempo Total
                              </Typography>
                              <Typography
                                variant="h6"
                                color={COLORS.primary}
                                fontWeight="bold"
                              >
                                9h 15m
                              </Typography>
                              <Typography
                                variant="caption"
                                color="text.secondary"
                              >
                                Desde: 10/01/2024
                              </Typography>
                            </Box>
                          </Grid>
                        </Grid>
                      </Box>
                    </Grid>

                    <Grid item xs={12} md={6}>
                      <Box
                        sx={{
                          p: 2,
                          bgcolor: COLORS.veryLightBlue,
                          borderRadius: 1,
                        }}
                      >
                        <Typography
                          variant="subtitle1"
                          fontWeight="medium"
                          mb={1}
                        >
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
                                <Typography
                                  variant="body2"
                                  color="textSecondary"
                                >
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
                                  onClick={() => handleOpenTrendHistory("spo2")}
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
                                <Typography
                                  variant="body2"
                                  color="success.main"
                                >
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
                                <Typography
                                  variant="body2"
                                  color="textSecondary"
                                >
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
                                  onClick={() => handleOpenTrendHistory("fc")}
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
                                <Typography
                                  variant="body2"
                                  color="success.main"
                                >
                                  -3.5 LPM
                                </Typography>
                              </Box>
                            </Box>
                          </Grid>
                        </Grid>
                      </Box>
                    </Grid>

                    <Grid item xs={12} md={6}>
                      <Box
                        sx={{
                          p: 2,
                          bgcolor: COLORS.veryLightBlue,
                          borderRadius: 1,
                        }}
                      >
                        <Typography
                          variant="subtitle1"
                          fontWeight="medium"
                          mb={1}
                        >
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
                                  onClick={() =>
                                    handleOpenTrendHistory("spo2_events")
                                  }
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
                                  onClick={() =>
                                    handleOpenTrendHistory("fc_events")
                                  }
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
                    </Grid>

                    {/* Observaciones del profesional - Vista General */}
                    <Grid item xs={12}>
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
                          <Typography
                            variant="subtitle1"
                            fontWeight="medium"
                            color="textPrimary"
                          >
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
                              onClick={() => setObservationsHistoryOpen(true)}
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
                            La paciente muestra una evolución favorable en los
                            parámetros cardiovasculares. Los episodios de
                            desaturación son aislados y no persistentes. Se
                            recomienda continuar con el mismo esquema de
                            monitorización y mantener la frecuencia de las
                            sesiones actuales.
                          </Typography>
                        </Box>
                      </Box>
                    </Grid>
                  </Grid>
                </Paper>
              )}

              {/* Selector de rango de fechas y filtros */}
              {selectedVitalsView === "general" && (
                <Paper sx={{ p: 3, mb: 3, borderRadius: 2, bgcolor: "white" }}>
                  <Typography variant="h6" fontWeight="bold" mb={2}>
                    Filtros
                  </Typography>

                  <Box>
                    <Typography variant="subtitle1" fontWeight="medium" mb={1}>
                      Rango de Fechas
                    </Typography>
                    <Grid container spacing={2}>
                      <Grid item xs={12} sm={6}>
                        <Box sx={{ display: "flex", flexDirection: "column" }}>
                          <label
                            htmlFor="start-date"
                            style={{ marginBottom: "4px" }}
                          >
                            Fecha Inicio
                          </label>
                          <input
                            type="date"
                            id="start-date"
                            value={customConfig.startDate}
                            onChange={(e) =>
                              handleCustomConfigChange({
                                startDate: e.target.value,
                              })
                            }
                            style={{
                              padding: "8px",
                              borderRadius: "4px",
                              border: "1px solid #ddd",
                            }}
                          />
                        </Box>
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <Box sx={{ display: "flex", flexDirection: "column" }}>
                          <label
                            htmlFor="end-date"
                            style={{ marginBottom: "4px" }}
                          >
                            Fecha Fin
                          </label>
                          <input
                            type="date"
                            id="end-date"
                            value={customConfig.endDate}
                            onChange={(e) =>
                              handleCustomConfigChange({
                                endDate: e.target.value,
                              })
                            }
                            style={{
                              padding: "8px",
                              borderRadius: "4px",
                              border: "1px solid #ddd",
                            }}
                          />
                        </Box>
                      </Grid>
                    </Grid>
                  </Box>

                  <Box sx={{ mt: 3, textAlign: "right" }}>
                    <Button
                      variant="outlined"
                      onClick={handleResetFilters}
                      sx={{
                        borderColor: COLORS.primary,
                        color: COLORS.primary,
                        mr: 2,
                        "&:hover": {
                          borderColor: COLORS.secondary,
                          color: COLORS.secondary,
                        },
                      }}
                    >
                      Resetear Filtros
                    </Button>
                    <Button
                      variant="contained"
                      sx={{
                        bgcolor: COLORS.primary,
                        "&:hover": { bgcolor: COLORS.secondary },
                      }}
                    >
                      Aplicar Filtros
                    </Button>
                  </Box>
                </Paper>
              )}
              <Grid container spacing={4}>
                {/* Saturación de oxígeno */}
                {(selectedVitalsView === "general" ||
                  (selectedVitalsView === "custom" &&
                    customConfig.showSpo2)) && (
                  <Grid item xs={12} md={6}>
                    <Paper
                      sx={{
                        p: 3,
                        borderRadius: 2,
                        boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.05)",
                        height: "450",
                        bgcolor: "white",
                        overflow: "hidden",
                      }}
                    >
                      <Box sx={cardHeaderStyle}>
                        <Box sx={{ display: "flex", alignItems: "center" }}>
                          <Typography
                            variant="h6"
                            fontWeight="bold"
                            color="textPrimary"
                          >
                            SATURACIÓN DE OXÍGENO (%)
                          </Typography>
                          <MuiTooltip
                            title={chartDescriptions.spo2}
                            arrow
                            placement="top"
                          >
                            <IconButton size="small" sx={{ ml: 1 }}>
                              <HelpOutlineIcon
                                fontSize="small"
                                color="primary"
                              />
                            </IconButton>
                          </MuiTooltip>
                        </Box>
                        <Box sx={valuePillStyle}>86%</Box>
                      </Box>
                      <Box
                        sx={{
                          borderRadius: 1,
                          backgroundColor: COLORS.veryLightBlue,
                          p: 1,
                          mb: 4,
                          height: 350,
                        }}
                      >
                        <Line
                          data={{
                            labels: generateSessionDateLabels(),
                            datasets: [
                              {
                                label: "SpO2 (%)",
                                data: generateSpO2Data(),
                                borderColor: COLORS.primary,
                                backgroundColor: "transparent",
                                borderWidth: 2,
                                tension: 0.4,
                                pointRadius: 3,
                                pointBackgroundColor: COLORS.primary,
                              },
                            ],
                          }}
                          options={{
                            ...lineOptions,
                            scales: {
                              ...lineOptions.scales,
                              x: {
                                ...lineOptions.scales?.x,
                                title: {
                                  display: true,
                                  text: "Sesiones",
                                  font: {
                                    size: 12,
                                    weight: "bold",
                                  },
                                },
                              },
                              y: {
                                ...lineOptions.scales?.y,
                                min: 90,
                                max: 100,
                                title: {
                                  display: true,
                                  text: "SpO2 (%)",
                                  font: {
                                    size: 12,
                                    weight: "bold",
                                  },
                                },
                              },
                            },
                          }}
                          ref={spo2ChartRef}
                        />
                      </Box>
                      <Box
                        sx={{
                          display: "flex",
                          justifyContent: "flex-end",
                          mt: 2,
                        }}
                      >
                        <Button
                          onClick={() => resetZoomForChart(spo2ChartRef)}
                          variant="text"
                          sx={{
                            color: COLORS.secondary,
                            textTransform: "none",
                            fontWeight: "normal",
                            fontSize: "0.85rem",
                            mr: 2,
                          }}
                        >
                          Resetear Zoom
                        </Button>
                        <Button
                          variant="text"
                          sx={{
                            color: COLORS.primary,
                            textTransform: "none",
                            fontWeight: "normal",
                            fontSize: "0.85rem",
                          }}
                          onClick={() =>
                            handleOpenDetail(
                              "SATURACIÓN DE OXÍGENO (%)",
                              "86%",
                              "spo2",
                              chartDescriptions.spo2
                            )
                          }
                        >
                          Ver detalles
                        </Button>
                      </Box>
                    </Paper>
                  </Grid>
                )}

                {/* Frecuencia cardiaca */}
                {(selectedVitalsView === "general" ||
                  (selectedVitalsView === "custom" &&
                    customConfig.showHeartRate)) && (
                  <Grid item xs={12} md={6}>
                    <Paper
                      sx={{
                        p: 3,
                        borderRadius: 2,
                        boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.05)",
                        height: "410",
                        bgcolor: "white",
                        overflow: "hidden",
                      }}
                    >
                      <Box sx={cardHeaderStyle}>
                        <Box sx={{ display: "flex", alignItems: "center" }}>
                          <Typography
                            variant="h6"
                            fontWeight="bold"
                            color="textPrimary"
                          >
                            FRECUENCIA CARDIACA (LPM)
                          </Typography>
                          <MuiTooltip
                            title={chartDescriptions.heartRate}
                            arrow
                            placement="top"
                          >
                            <IconButton size="small" sx={{ ml: 1 }}>
                              <HelpOutlineIcon
                                fontSize="small"
                                color="primary"
                              />
                            </IconButton>
                          </MuiTooltip>
                        </Box>
                        <Box sx={valuePillStyle}>85LPM</Box>
                      </Box>
                      <Box
                        sx={{
                          borderRadius: 1,
                          backgroundColor: COLORS.veryLightBlue,
                          p: 1,
                          mb: 4,
                          height: 350,
                        }}
                      >
                        <Line
                          data={{
                            labels: generateSessionDateLabels(),
                            datasets: [
                              {
                                label: "FC (LPM)",
                                data: generateHeartRateData(),
                                borderColor: COLORS.redLine,
                                backgroundColor: "transparent",
                                borderWidth: 2,
                                tension: 0.4,
                                pointRadius: 3,
                                pointBackgroundColor: COLORS.redLine,
                              },
                            ],
                          }}
                          options={{
                            ...lineOptions,
                            scales: {
                              ...lineOptions.scales,
                              x: {
                                ...lineOptions.scales?.x,
                                title: {
                                  display: true,
                                  text: "Sesiones",
                                  font: {
                                    size: 12,
                                    weight: "bold",
                                  },
                                },
                              },
                              y: {
                                ...lineOptions.scales?.y,
                                min: 60,
                                max: 110,
                                title: {
                                  display: true,
                                  text: "FC (LPM)",
                                  font: {
                                    size: 12,
                                    weight: "bold",
                                  },
                                },
                              },
                            },
                          }}
                          ref={heartRateChartRef}
                        />
                      </Box>
                      <Box
                        sx={{
                          display: "flex",
                          justifyContent: "flex-end",
                          mt: 2,
                        }}
                      >
                        <Button
                          onClick={() => resetZoomForChart(heartRateChartRef)}
                          variant="text"
                          sx={{
                            color: COLORS.secondary,
                            textTransform: "none",
                            fontWeight: "normal",
                            fontSize: "0.85rem",
                            mr: 2,
                          }}
                        >
                          Resetear Zoom
                        </Button>
                        <Button
                          variant="text"
                          sx={{
                            color: COLORS.primary,
                            textTransform: "none",
                            fontWeight: "normal",
                            fontSize: "0.85rem",
                          }}
                          onClick={() =>
                            handleOpenDetail(
                              "FRECUENCIA CARDIACA (LPM)",
                              "85LPM",
                              "heartRate",
                              chartDescriptions.heartRate
                            )
                          }
                        >
                          Ver detalles
                        </Button>
                      </Box>
                    </Paper>
                  </Grid>
                )}

                {/* Frecuencia Respiratoria */}
                {(selectedVitalsView === "general" ||
                  (selectedVitalsView === "custom" &&
                    customConfig.showRespRate)) && (
                  <Grid item xs={12} md={6}>
                    <Paper
                      sx={{
                        p: 3,
                        borderRadius: 2,
                        boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.05)",
                        height: "410",
                        bgcolor: "white",
                        overflow: "hidden",
                      }}
                    >
                      <Box sx={cardHeaderStyle}>
                        <Box sx={{ display: "flex", alignItems: "center" }}>
                          <Typography
                            variant="h6"
                            fontWeight="bold"
                            color="textPrimary"
                          >
                            FRECUENCIA RESPIRATORIA (RPM)
                          </Typography>
                          <MuiTooltip
                            title={chartDescriptions.respRate}
                            arrow
                            placement="top"
                          >
                            <IconButton size="small" sx={{ ml: 1 }}>
                              <HelpOutlineIcon
                                fontSize="small"
                                color="primary"
                              />
                            </IconButton>
                          </MuiTooltip>
                        </Box>
                        <Box sx={valuePillStyle}>12RPM</Box>
                      </Box>
                      <Box
                        sx={{
                          borderRadius: 1,
                          backgroundColor: COLORS.veryLightBlue,
                          p: 1,
                          mb: 4,
                          height: 350,
                        }}
                      >
                        <Line
                          data={{
                            labels: generateSessionDateLabels().slice(0, 7),
                            datasets: [
                              {
                                label: "FR (RPM)",
                                data: generateRespRateData(),
                                borderColor: COLORS.cyanLine,
                                borderWidth: 2,
                                pointRadius: 3,
                                pointBackgroundColor: COLORS.cyanLine,
                                tension: 0.4,
                                fill: false,
                              },
                            ],
                          }}
                          options={{
                            ...lineOptions,
                            scales: {
                              ...lineOptions.scales,
                              x: {
                                ...lineOptions.scales?.x,
                                title: {
                                  display: true,
                                  text: "Sesiones",
                                  font: {
                                    size: 12,
                                    weight: "bold",
                                  },
                                },
                              },
                              y: {
                                ...lineOptions.scales?.y,
                                min: 10,
                                max: 20,
                                title: {
                                  display: true,
                                  text: "FR (RPM)",
                                  font: {
                                    size: 12,
                                    weight: "bold",
                                  },
                                },
                              },
                            },
                          }}
                          ref={respRateChartRef}
                        />
                      </Box>
                      <Box
                        sx={{
                          display: "flex",
                          justifyContent: "flex-end",
                          mt: 2,
                        }}
                      >
                        <Button
                          onClick={() => resetZoomForChart(respRateChartRef)}
                          variant="text"
                          sx={{
                            color: COLORS.secondary,
                            textTransform: "none",
                            fontWeight: "normal",
                            fontSize: "0.85rem",
                            mr: 2,
                          }}
                        >
                          Resetear Zoom
                        </Button>
                        <Button
                          variant="text"
                          sx={{
                            color: COLORS.primary,
                            textTransform: "none",
                            fontWeight: "normal",
                            fontSize: "0.85rem",
                          }}
                          onClick={() =>
                            handleOpenDetail(
                              "FRECUENCIA RESPIRATORIA (RPM)",
                              "12RPM",
                              "respRate",
                              chartDescriptions.respRate
                            )
                          }
                        >
                          Ver detalles
                        </Button>
                      </Box>
                    </Paper>
                  </Grid>
                )}

                {/* Sensores Inerciales */}
                {(selectedVitalsView === "general" ||
                  (selectedVitalsView === "custom" &&
                    customConfig.showInertial)) && (
                  <Grid item xs={12} md={6}>
                    <Paper
                      sx={{
                        p: 3,
                        borderRadius: 2,
                        boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.05)",
                        height: "410",
                        bgcolor: "white",
                        overflow: "hidden",
                      }}
                    >
                      <Box sx={cardHeaderStyle}>
                        <Box sx={{ display: "flex", alignItems: "center" }}>
                          <Typography
                            variant="h6"
                            fontWeight="bold"
                            color="textPrimary"
                          >
                            EVENTOS ANOMALOS DEL MOVIMIENTO
                          </Typography>
                          <MuiTooltip
                            title={chartDescriptions.inertial}
                            arrow
                            placement="top"
                          >
                            <IconButton size="small" sx={{ ml: 1 }}>
                              <HelpOutlineIcon
                                fontSize="small"
                                color="primary"
                              />
                            </IconButton>
                          </MuiTooltip>
                        </Box>
                        <Box
                          sx={{
                            ...valuePillStyle,
                            cursor: "pointer",
                            "&:hover": {
                              opacity: 0.9,
                              boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.1)",
                            },
                          }}
                          onClick={() => setInertialObservationsOpen(true)}
                        >
                          DETALLES
                        </Box>
                      </Box>
                      <Box
                        sx={{
                          borderRadius: 1,
                          backgroundColor: COLORS.veryLightBlue,
                          p: 1,
                          mb: 4,
                          height: 350,
                        }}
                      >
                        <Bar
                          data={{
                            labels: generateSessionDateLabels().slice(0, 10),
                            datasets: [
                              {
                                label: "Eventos anómalos",
                                data: generateMotionAnomalyEvents(),
                                backgroundColor: COLORS.primary,
                                borderColor: COLORS.primary,
                                borderWidth: 1,
                                barThickness: 25,
                                hoverBackgroundColor: COLORS.secondary,
                              },
                            ],
                          }}
                          options={{
                            ...lineOptions,
                            scales: {
                              ...lineOptions.scales,
                              x: {
                                ...lineOptions.scales?.x,
                                title: {
                                  display: true,
                                  text: "Sesiones",
                                  font: {
                                    size: 12,
                                    weight: "bold",
                                  },
                                },
                              },
                              y: {
                                ...lineOptions.scales?.y,
                                beginAtZero: true,
                                max: 10,
                                ticks: {
                                  stepSize: 1,
                                },
                                title: {
                                  display: true,
                                  text: "Cantidad de eventos",
                                  font: {
                                    size: 12,
                                    weight: "bold",
                                  },
                                },
                              },
                            },
                            plugins: {
                              ...lineOptions.plugins,
                              tooltip: {
                                ...lineOptions.plugins?.tooltip,
                                callbacks: {
                                  label: function (context) {
                                    return `Eventos: ${context.raw}`;
                                  },
                                },
                              },
                            },
                          }}
                          ref={inertialChartRef}
                        />
                      </Box>
                      <Box
                        sx={{
                          display: "flex",
                          justifyContent: "flex-end",
                          mt: 2,
                        }}
                      >
                        <Button
                          onClick={() => resetZoomForChart(inertialChartRef)}
                          variant="text"
                          sx={{
                            color: COLORS.secondary,
                            textTransform: "none",
                            fontWeight: "normal",
                            fontSize: "0.85rem",
                            mr: 2,
                          }}
                        >
                          Resetear Zoom
                        </Button>
                        <Button
                          variant="text"
                          sx={{
                            color: COLORS.primary,
                            textTransform: "none",
                            fontWeight: "normal",
                            fontSize: "0.85rem",
                          }}
                          onClick={() =>
                            handleOpenDetail(
                              "SENSORES INERCIALES",
                              "ESTADO: BUENO",
                              "inertial",
                              chartDescriptions.inertial
                            )
                          }
                        >
                          Ver detalles
                        </Button>
                      </Box>
                    </Paper>
                  </Grid>
                )}
              </Grid>
            </>
          )}

          {/* Contenido en tiempo real (antiguo sensor) */}
          {selectedVitalsView === "realtime" && (
            <Box
              sx={{
                p: 3,
                borderRadius: 2,
                bgcolor: "white",
                boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.05)",
                mb: 6,
              }}
            >
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  mb: 2,
                }}
              >
                <Typography variant="h6" fontWeight="bold">
                  Datos del Sensor en Tiempo Real
                </Typography>
                <Button
                  variant="contained"
                  onClick={() => {
                    const dummyZoomLink = "https://zoom.us/j/123456789";
                    navigator.clipboard.writeText(dummyZoomLink);
                    HandleResult.showSuccessMessage(
                      "Link de Zoom copiado al portapapeles"
                    );
                  }}
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
              <Grid container spacing={5}>
                {/* Medición en tiempo real */}
                <Grid item xs={12}>
                  <Box
                    sx={{
                      p: 2,
                      bgcolor: COLORS.veryLightBlue,
                      borderRadius: 1,
                      mb: 2,
                      display: "flex",
                      justifyContent: "space-around",
                    }}
                  >
                    <Box sx={{ textAlign: "center", p: 2 }}>
                      <Typography variant="body2" color="textSecondary">
                        SpO2 Actual
                      </Typography>
                      <Typography
                        variant="h4"
                        color={COLORS.primary}
                        fontWeight="bold"
                      >
                        95%
                      </Typography>
                    </Box>
                    <Box sx={{ textAlign: "center", p: 2 }}>
                      <Typography variant="body2" color="textSecondary">
                        Frecuencia Cardíaca
                      </Typography>
                      <Typography
                        variant="h4"
                        color={COLORS.redLine}
                        fontWeight="bold"
                      >
                        82 LPM
                      </Typography>
                    </Box>
                    <Box sx={{ textAlign: "center", p: 2 }}>
                      <Typography variant="body2" color="textSecondary">
                        Frecuencia Respiratoria
                      </Typography>
                      <Typography
                        variant="h4"
                        color={COLORS.cyanLine}
                        fontWeight="bold"
                      >
                        14 RPM
                      </Typography>
                    </Box>
                  </Box>
                </Grid>

                {/* Gráficos separados para cada variable */}
                <Grid item xs={12} md={6}>
                  <Box
                    sx={{
                      p: 2,
                      bgcolor: COLORS.veryLightBlue,
                      borderRadius: 1,
                      mb: 2,
                      height: "430px",
                    }}
                  >
                    <Typography variant="subtitle1" fontWeight="medium" mb={2}>
                      SpO2 en Tiempo Real
                    </Typography>
                    <Box sx={{ width: "100%", height: "310px" }}>
                      <Line
                        data={{
                          labels: Array.from({ length: 60 }, (_, i) =>
                            i.toString()
                          ),
                          datasets: [
                            {
                              label: "SpO2 (%)",
                              data: Array.from({ length: 60 }, () =>
                                Math.floor(93 + Math.random() * 5)
                              ),
                              borderColor: COLORS.primary,
                              borderWidth: 2,
                              pointRadius: 0,
                              fill: false,
                              tension: 0.4,
                            },
                          ],
                        }}
                        options={{
                          ...lineOptions,
                          responsive: true,
                          maintainAspectRatio: false,
                          animation: {
                            duration: 0,
                          },
                          plugins: {
                            ...lineOptions.plugins,
                            legend: {
                              display: true,
                              position: "top",
                            },
                          },
                          scales: {
                            ...lineOptions.scales,
                            x: {
                              ...lineOptions.scales?.x,
                              display: true, // Mostrar el eje X
                              title: {
                                display: true,
                                text: "Tiempo (segundos)",
                              },
                              ticks: {
                                // Mostrar sólo cada 60 segundos para evitar saturación
                                callback: function (value, index) {
                                  return index % 3 === 0
                                    ? `-${59 - index}s`
                                    : "";
                                },
                                color: COLORS.darkGray,
                                font: {
                                  size: 10,
                                },
                              },
                              grid: {
                                display: true,
                                color: "rgba(0, 0, 0, 0.05)",
                              },
                            },
                            y: {
                              ...lineOptions.scales?.y,
                              min: 90,
                              max: 100,
                              title: {
                                display: true,
                                text: "SpO2 (%)",
                              },
                            },
                          },
                        }}
                        ref={spo2RealtimeChartRef}
                      />
                    </Box>
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "flex-end",
                        mt: 2,
                      }}
                    >
                      <Button
                        onClick={() => resetZoomForChart(spo2RealtimeChartRef)}
                        variant="text"
                        sx={{
                          color: COLORS.secondary,
                          textTransform: "none",
                          fontWeight: "normal",
                          fontSize: "0.85rem",
                        }}
                      >
                        Resetear Zoom
                      </Button>
                    </Box>
                  </Box>
                </Grid>

                <Grid item xs={12} md={6}>
                  <Box
                    sx={{
                      p: 2,
                      bgcolor: COLORS.veryLightBlue,
                      borderRadius: 1,
                      mb: 2,
                      height: "430px",
                    }}
                  >
                    <Typography variant="subtitle1" fontWeight="medium" mb={2}>
                      Frecuencia Cardíaca en Tiempo Real
                    </Typography>
                    <Box sx={{ width: "100%", height: "310px" }}>
                      <Line
                        data={{
                          labels: Array.from({ length: 60 }, (_, i) =>
                            i.toString()
                          ),
                          datasets: [
                            {
                              label: "FC (LPM)",
                              data: Array.from({ length: 60 }, () =>
                                Math.floor(70 + Math.random() * 20)
                              ),
                              borderColor: COLORS.redLine,
                              borderWidth: 2,
                              pointRadius: 0,
                              fill: false,
                              tension: 0.4,
                            },
                          ],
                        }}
                        options={{
                          ...lineOptions,
                          responsive: true,
                          maintainAspectRatio: false,
                          animation: {
                            duration: 0,
                          },
                          plugins: {
                            ...lineOptions.plugins,
                            legend: {
                              display: true,
                              position: "top",
                            },
                          },
                          scales: {
                            ...lineOptions.scales,
                            x: {
                              ...lineOptions.scales?.x,
                              display: true, // Mostrar el eje X
                              title: {
                                display: true,
                                text: "Tiempo (segundos)",
                              },
                              ticks: {
                                // Mostrar sólo cada 10 segundos para evitar saturación
                                callback: function (value, index) {
                                  return index % 3 === 0
                                    ? `-${59 - index}s`
                                    : "";
                                },
                                color: COLORS.darkGray,
                                font: {
                                  size: 10,
                                },
                              },
                              grid: {
                                display: true,
                                color: "rgba(0, 0, 0, 0.05)",
                              },
                            },
                            y: {
                              ...lineOptions.scales?.y,
                              min: 60,
                              max: 100,
                              title: {
                                display: true,
                                text: "FC (LPM)",
                              },
                            },
                          },
                        }}
                        ref={hrRealtimeChartRef}
                      />
                    </Box>
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "flex-end",
                        mt: 2,
                      }}
                    >
                      <Button
                        onClick={() => resetZoomForChart(hrRealtimeChartRef)}
                        variant="text"
                        sx={{
                          color: COLORS.secondary,
                          textTransform: "none",
                          fontWeight: "normal",
                          fontSize: "0.85rem",
                        }}
                      >
                        Resetear Zoom
                      </Button>
                    </Box>
                  </Box>
                </Grid>

                <Grid item xs={12}>
                  <Box
                    sx={{
                      p: 2,
                      bgcolor: COLORS.veryLightBlue,
                      borderRadius: 1,
                      mb: 2,
                      height: "460px",
                    }}
                  >
                    <Typography variant="subtitle1" fontWeight="medium" mb={2}>
                      Frecuencia Respiratoria en Tiempo Real
                    </Typography>
                    <Box sx={{ width: "100%", height: "330px" }}>
                      <Line
                        data={{
                          labels: Array.from({ length: 60 }, (_, i) =>
                            i.toString()
                          ),
                          datasets: [
                            {
                              label: "FR (RPM)",
                              data: Array.from({ length: 60 }, () =>
                                Math.floor(12 + Math.random() * 6)
                              ),
                              borderColor: COLORS.cyanLine,
                              borderWidth: 2,
                              pointRadius: 0,
                              fill: false,
                              tension: 0.4,
                            },
                          ],
                        }}
                        options={{
                          ...lineOptions,
                          responsive: true,
                          maintainAspectRatio: false,
                          animation: {
                            duration: 0,
                          },
                          plugins: {
                            ...lineOptions.plugins,
                            legend: {
                              display: true,
                              position: "top",
                            },
                          },
                          scales: {
                            ...lineOptions.scales,
                            x: {
                              ...lineOptions.scales?.x,
                              display: true, // Mostrar el eje X
                              title: {
                                display: true,
                                text: "Tiempo (segundos)",
                              },
                              ticks: {
                                // Mostrar sólo cada 10 segundos para evitar saturación
                                callback: function (value, index) {
                                  return index % 1 === 0
                                    ? `-${59 - index}s`
                                    : "";
                                },
                                color: COLORS.darkGray,
                                font: {
                                  size: 10,
                                },
                              },
                              grid: {
                                display: true,
                                color: "rgba(0, 0, 0, 0.05)",
                              },
                            },
                            y: {
                              ...lineOptions.scales?.y,
                              min: 8,
                              max: 20,
                              title: {
                                display: true,
                                text: "FR (RPM)",
                              },
                            },
                          },
                        }}
                        ref={respRealtimeChartRef}
                      />
                    </Box>
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "flex-end",
                        mt: 2,
                      }}
                    >
                      <Button
                        onClick={() => resetZoomForChart(respRealtimeChartRef)}
                        variant="text"
                        sx={{
                          color: COLORS.secondary,
                          textTransform: "none",
                          fontWeight: "normal",
                          fontSize: "0.85rem",
                        }}
                      >
                        Resetear Zoom
                      </Button>
                    </Box>
                  </Box>
                </Grid>

                {/* Estado de la conexión */}
                <Grid item xs={12}>
                  <Box
                    sx={{
                      p: 2,
                      bgcolor: COLORS.veryLightBlue,
                      borderRadius: 1,
                    }}
                  >
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        mb: 2,
                      }}
                    >
                      <Typography variant="subtitle1" fontWeight="medium">
                        Estado de la Conexión
                      </Typography>
                      <Button
                        variant="text"
                        size="small"
                        sx={{
                          color: COLORS.primary,
                          textTransform: "none",
                          fontSize: "0.85rem",
                        }}
                      >
                        Actualizar
                      </Button>
                    </Box>

                    {/* Dispositivo 1 - Conectado */}
                    <Box
                      sx={{
                        p: 3,
                        borderRadius: 1,
                        bgcolor: "rgba(76, 175, 80, 0.1)",
                        border: "1px solid rgba(76, 175, 80, 0.3)",
                        display: "flex",
                        flexDirection: "column",
                        gap: 2,
                        mb: 2,
                      }}
                    >
                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "space-between",
                        }}
                      >
                        <Typography
                          variant="h6"
                          fontWeight="medium"
                          color="success.main"
                        >
                          Pulsioxímetro
                        </Typography>
                        <Box
                          sx={{
                            px: 2,
                            py: 0.5,
                            bgcolor: "rgba(76, 175, 80, 0.8)",
                            color: "white",
                            borderRadius: 5,
                            fontSize: "0.75rem",
                            fontWeight: "bold",
                          }}
                        >
                          ONLINE
                        </Box>
                      </Box>

                      <Grid container spacing={2} sx={{ mt: 1 }}>
                        <Grid item xs={12} sm={4}>
                          <Box
                            sx={{ display: "flex", flexDirection: "column" }}
                          >
                            <Typography variant="body2" color="textSecondary">
                              ID Dispositivo
                            </Typography>
                            <Typography variant="body1" fontWeight="medium">
                              SMARTM-OX22
                            </Typography>
                          </Box>
                        </Grid>
                        <Grid item xs={12} sm={4}>
                          <Box
                            sx={{ display: "flex", flexDirection: "column" }}
                          >
                            <Typography variant="body2" color="textSecondary">
                              Calidad de Señal
                            </Typography>
                            <Typography
                              variant="body1"
                              fontWeight="medium"
                              color="success.main"
                            >
                              Excelente
                            </Typography>
                          </Box>
                        </Grid>
                        <Grid item xs={12} sm={4}>
                          <Box
                            sx={{
                              display: "flex",
                              flexDirection: "column",
                              alignItems: "flex-start",
                            }}
                          >
                            <Typography variant="body2" color="textSecondary">
                              Batería
                            </Typography>
                            <Box
                              sx={{
                                display: "flex",
                                alignItems: "center",
                                gap: 1,
                              }}
                            >
                              <Typography variant="body1" fontWeight="medium">
                                85%
                              </Typography>
                              <Box
                                sx={{
                                  width: 80,
                                  height: 12,
                                  bgcolor: "rgba(0,0,0,0.1)",
                                  borderRadius: 6,
                                  overflow: "hidden",
                                }}
                              >
                                <Box
                                  sx={{
                                    width: "85%",
                                    height: "100%",
                                    bgcolor: "success.main",
                                    borderRadius: 6,
                                  }}
                                />
                              </Box>
                            </Box>
                          </Box>
                        </Grid>
                      </Grid>

                      <Box
                        sx={{
                          display: "flex",
                          justifyContent: "space-between",
                          pt: 2,
                          borderTop: "1px dashed rgba(0,0,0,0.1)",
                        }}
                      >
                        <Typography variant="body2" color="textSecondary">
                          Última comunicación: hace 2 segundos
                        </Typography>
                        <Typography variant="body2" color="textSecondary">
                          Sesión iniciada: 15:30
                        </Typography>
                      </Box>
                    </Box>

                    {/* Dispositivo 2 - Conectado */}
                    <Box
                      sx={{
                        p: 3,
                        borderRadius: 1,
                        bgcolor: "rgba(76, 175, 80, 0.1)",
                        border: "1px solid rgba(76, 175, 80, 0.3)",
                        display: "flex",
                        flexDirection: "column",
                        gap: 2,
                        mb: 2,
                      }}
                    >
                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "space-between",
                        }}
                      >
                        <Typography
                          variant="h6"
                          fontWeight="medium"
                          color="success.main"
                        >
                          Sensor Inercial
                        </Typography>
                        <Box
                          sx={{
                            px: 2,
                            py: 0.5,
                            bgcolor: "rgba(76, 175, 80, 0.8)",
                            color: "white",
                            borderRadius: 5,
                            fontSize: "0.75rem",
                            fontWeight: "bold",
                          }}
                        >
                          ONLINE
                        </Box>
                      </Box>

                      <Grid container spacing={2} sx={{ mt: 1 }}>
                        <Grid item xs={12} sm={4}>
                          <Box
                            sx={{ display: "flex", flexDirection: "column" }}
                          >
                            <Typography variant="body2" color="textSecondary">
                              ID Dispositivo
                            </Typography>
                            <Typography variant="body1" fontWeight="medium">
                              SMARTM-INR15
                            </Typography>
                          </Box>
                        </Grid>
                        <Grid item xs={12} sm={4}>
                          <Box
                            sx={{ display: "flex", flexDirection: "column" }}
                          >
                            <Typography variant="body2" color="textSecondary">
                              Calidad de Señal
                            </Typography>
                            <Typography
                              variant="body1"
                              fontWeight="medium"
                              color="success.main"
                            >
                              Buena
                            </Typography>
                          </Box>
                        </Grid>
                        <Grid item xs={12} sm={4}>
                          <Box
                            sx={{
                              display: "flex",
                              flexDirection: "column",
                              alignItems: "flex-start",
                            }}
                          >
                            <Typography variant="body2" color="textSecondary">
                              Batería
                            </Typography>
                            <Box
                              sx={{
                                display: "flex",
                                alignItems: "center",
                                gap: 1,
                              }}
                            >
                              <Typography variant="body1" fontWeight="medium">
                                72%
                              </Typography>
                              <Box
                                sx={{
                                  width: 80,
                                  height: 12,
                                  bgcolor: "rgba(0,0,0,0.1)",
                                  borderRadius: 6,
                                  overflow: "hidden",
                                }}
                              >
                                <Box
                                  sx={{
                                    width: "72%",
                                    height: "100%",
                                    bgcolor: "success.main",
                                    borderRadius: 6,
                                  }}
                                />
                              </Box>
                            </Box>
                          </Box>
                        </Grid>
                      </Grid>

                      <Box
                        sx={{
                          display: "flex",
                          justifyContent: "space-between",
                          pt: 2,
                          borderTop: "1px dashed rgba(0,0,0,0.1)",
                        }}
                      >
                        <Typography variant="body2" color="textSecondary">
                          Última comunicación: hace 5 segundos
                        </Typography>
                        <Typography variant="body2" color="textSecondary">
                          Sesión iniciada: 15:30
                        </Typography>
                      </Box>
                    </Box>

                    {/* Dispositivo 3 - Con advertencia */}
                    <Box
                      sx={{
                        p: 3,
                        borderRadius: 1,
                        bgcolor: "rgba(255, 193, 7, 0.1)",
                        border: "1px solid rgba(255, 193, 7, 0.3)",
                        display: "flex",
                        flexDirection: "column",
                        gap: 2,
                      }}
                    >
                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "space-between",
                        }}
                      >
                        <Typography
                          variant="h6"
                          fontWeight="medium"
                          color="warning.main"
                        >
                          Mascarilla
                        </Typography>
                        <Box
                          sx={{
                            px: 2,
                            py: 0.5,
                            bgcolor: "rgba(255, 193, 7, 0.8)",
                            color: "white",
                            borderRadius: 5,
                            fontSize: "0.75rem",
                            fontWeight: "bold",
                          }}
                        >
                          BATERÍA BAJA
                        </Box>
                      </Box>

                      <Grid container spacing={2} sx={{ mt: 1 }}>
                        <Grid item xs={12} sm={4}>
                          <Box
                            sx={{ display: "flex", flexDirection: "column" }}
                          >
                            <Typography variant="body2" color="textSecondary">
                              ID Dispositivo
                            </Typography>
                            <Typography variant="body1" fontWeight="medium">
                              SMARTM-ECG08
                            </Typography>
                          </Box>
                        </Grid>
                        <Grid item xs={12} sm={4}>
                          <Box
                            sx={{ display: "flex", flexDirection: "column" }}
                          >
                            <Typography variant="body2" color="textSecondary">
                              Calidad de Señal
                            </Typography>
                            <Typography
                              variant="body1"
                              fontWeight="medium"
                              color="success.main"
                            >
                              Buena
                            </Typography>
                          </Box>
                        </Grid>
                        <Grid item xs={12} sm={4}>
                          <Box
                            sx={{
                              display: "flex",
                              flexDirection: "column",
                              alignItems: "flex-start",
                            }}
                          >
                            <Typography variant="body2" color="textSecondary">
                              Batería
                            </Typography>
                            <Box
                              sx={{
                                display: "flex",
                                alignItems: "center",
                                gap: 1,
                              }}
                            >
                              <Typography
                                variant="body1"
                                fontWeight="medium"
                                color="warning.main"
                              >
                                18%
                              </Typography>
                              <Box
                                sx={{
                                  width: 80,
                                  height: 12,
                                  bgcolor: "rgba(0,0,0,0.1)",
                                  borderRadius: 6,
                                  overflow: "hidden",
                                }}
                              >
                                <Box
                                  sx={{
                                    width: "18%",
                                    height: "100%",
                                    bgcolor: "warning.main",
                                    borderRadius: 6,
                                  }}
                                />
                              </Box>
                            </Box>
                          </Box>
                        </Grid>
                      </Grid>

                      <Box
                        sx={{
                          display: "flex",
                          justifyContent: "space-between",
                          pt: 2,
                          borderTop: "1px dashed rgba(0,0,0,0.1)",
                        }}
                      >
                        <Typography variant="body2" color="textSecondary">
                          Última comunicación: hace 8 segundos
                        </Typography>
                        <Typography variant="body2" color="textSecondary">
                          Sesión iniciada: 15:30
                        </Typography>
                      </Box>
                    </Box>

                    {/* Botón para agregar dispositivo */}
                    <Box
                      sx={{
                        mt: 2,
                        p: 2,
                        borderRadius: 1,
                        border: "1px dashed rgba(0, 0, 0, 0.2)",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        cursor: "pointer",
                        "&:hover": {
                          bgcolor: "rgba(0, 0, 0, 0.04)",
                        },
                      }}
                    >
                      <Button
                        variant="text"
                        sx={{
                          color: COLORS.primary,
                          textTransform: "none",
                        }}
                      >
                        + Conectar Nuevo Dispositivo
                      </Button>
                    </Box>
                  </Box>
                </Grid>
              </Grid>
            </Box>
          )}

          {/* Por sesión - ultima sesión */}
          {selectedVitalsView === "lastSession" && (
            <Paper sx={{ p: 3, mb: 3, borderRadius: 2, bgcolor: "white" }}>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  mb: 2,
                }}
              >
                <Typography variant="h6" fontWeight="bold">
                  Detalle de la Última Sesión
                </Typography>
                <Typography variant="subtitle2" color="textSecondary">
                  Fecha: 15/03/2024
                </Typography>
              </Box>

              <Grid container spacing={3}>
                <Grid item xs={12}>
                  <Box
                    sx={{
                      p: 2,
                      bgcolor: COLORS.veryLightBlue,
                      borderRadius: 1,
                      mb: 2,
                    }}
                  >
                    <Typography variant="subtitle1" fontWeight="medium" mb={1}>
                      Resumen de Signos Vitales
                    </Typography>
                    <Grid container spacing={4}>
                      <Grid item xs={6} sm={3}>
                        <Box sx={{ textAlign: "center", p: 1 }}>
                          <Typography variant="body2" color="textSecondary">
                            SpO2 Promedio
                          </Typography>
                          <Typography
                            variant="h6"
                            color={COLORS.primary}
                            fontWeight="bold"
                          >
                            94%
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            Rango: 93-97%
                          </Typography>
                        </Box>
                      </Grid>
                      <Grid item xs={6} sm={3}>
                        <Box sx={{ textAlign: "center", p: 1 }}>
                          <Typography variant="body2" color="textSecondary">
                            FC Promedio
                          </Typography>
                          <Typography
                            variant="h6"
                            color={COLORS.primary}
                            fontWeight="bold"
                          >
                            78 LPM
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            Rango: 70-85 LPM
                          </Typography>
                        </Box>
                      </Grid>
                      <Grid item xs={6} sm={3}>
                        <Box sx={{ textAlign: "center", p: 1 }}>
                          <Typography variant="body2" color="textSecondary">
                            FR Promedio
                          </Typography>
                          <Typography
                            variant="h6"
                            color={COLORS.primary}
                            fontWeight="bold"
                          >
                            16 RPM
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            Rango: 14-18 RPM
                          </Typography>
                        </Box>
                      </Grid>
                      <Grid item xs={6} sm={3}>
                        <Box sx={{ textAlign: "center", p: 1 }}>
                          <Typography variant="body2" color="textSecondary">
                            Duración
                          </Typography>
                          <Typography
                            variant="h6"
                            color={COLORS.primary}
                            fontWeight="bold"
                          >
                            45 min
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            15/03/2024
                          </Typography>
                        </Box>
                      </Grid>
                    </Grid>
                  </Box>
                </Grid>

                {/* Observaciones del profesional - Última Sesión */}
                <Grid item xs={12}>
                  <Box
                    sx={{
                      p: 2,
                      bgcolor: "rgba(246, 246, 246, 0.7)",
                      borderRadius: 1,
                      border: "1px dashed rgba(0, 0, 0, 0.12)",
                      mb: 2,
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
                      <Typography
                        variant="subtitle1"
                        fontWeight="medium"
                        color="textPrimary"
                      >
                        Notas de la Sesión
                      </Typography>
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
                    <Box sx={{ p: 1 }}>
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{ fontStyle: "italic", mb: 1 }}
                      >
                        Agregado por: Dra. Sánchez - 15/03/2024
                      </Typography>
                      <Typography variant="body1">
                        Durante esta sesión, la paciente presentó variabilidad
                        en la frecuencia cardíaca al realizar ejercicios de
                        respiración profunda. Se realizaron ajustes en la
                        postura que mejoraron los valores de oxigenación. La
                        paciente reporta sensación de bienestar y menos fatiga
                        al finalizar la sesión.
                      </Typography>
                    </Box>
                  </Box>
                </Grid>

                {/* Gráfico detallado de la última sesión */}
                <Grid item xs={12}>
                  <Box
                    sx={{
                      borderRadius: 1,
                      backgroundColor: COLORS.veryLightBlue,
                      p: 2,
                      height: 400,
                      mb: 5,
                      width: "100%",
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                    }}
                  >
                    <Typography variant="subtitle1" fontWeight="medium" mb={1}>
                      Evolución Durante la Sesión
                    </Typography>
                    <Box sx={{ width: "95%", height: "330px" }}>
                      <Line
                        data={{
                          labels: [
                            "0 min",
                            "5 min",
                            "10 min",
                            "15 min",
                            "20 min",
                            "25 min",
                            "30 min",
                            "35 min",
                            "40 min",
                            "45 min",
                          ],
                          datasets: [
                            {
                              label: "SpO2 (%)",
                              data: [95, 94, 96, 93, 95, 94, 97, 96, 95, 94],
                              borderColor: COLORS.primary,
                              backgroundColor: "transparent",
                              yAxisID: "y",
                            },
                            {
                              label: "FC (LPM)",
                              data: [75, 80, 85, 75, 70, 75, 80, 85, 80, 78],
                              borderColor: COLORS.redLine,
                              backgroundColor: "transparent",
                              yAxisID: "y1",
                            },
                            {
                              label: "FR (RPM)",
                              data: [14, 15, 18, 16, 15, 14, 16, 18, 15, 16],
                              borderColor: COLORS.cyanLine,
                              backgroundColor: "transparent",
                              yAxisID: "y2",
                            },
                          ],
                        }}
                        options={{
                          ...lineOptions,
                          responsive: true,
                          maintainAspectRatio: false,
                          plugins: {
                            ...lineOptions.plugins,
                            legend: {
                              display: true,
                              position: "top",
                            },
                          },
                          scales: {
                            ...lineOptions.scales,
                            y: {
                              ...lineOptions.scales?.y,
                              position: "left",
                              title: {
                                display: true,
                                text: "SpO2 (%)",
                              },
                              min: 90,
                              max: 100,
                            },
                            y1: {
                              type: "linear",
                              display: true,
                              position: "right",
                              title: {
                                display: true,
                                text: "FC (LPM)",
                              },
                              min: 60,
                              max: 100,
                              grid: {
                                drawOnChartArea: false,
                              },
                            },
                            y2: {
                              type: "linear",
                              display: true,
                              position: "right",
                              title: {
                                display: true,
                                text: "FR (RPM)",
                              },
                              min: 10,
                              max: 20,
                              grid: {
                                drawOnChartArea: false,
                              },
                            },
                          },
                        }}
                        ref={lastSessionChartRef}
                      />
                    </Box>
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "flex-end",
                        mt: 2,
                        width: "95%",
                      }}
                    >
                      <Button
                        onClick={() => resetZoomForChart(lastSessionChartRef)}
                        variant="text"
                        sx={{
                          color: COLORS.secondary,
                          textTransform: "none",
                          fontWeight: "normal",
                          fontSize: "0.85rem",
                        }}
                      >
                        Resetear Zoom
                      </Button>
                    </Box>
                  </Box>
                </Grid>
              </Grid>
            </Paper>
          )}
        </>
      )}

      {/* Por sesión - Según sesión seleccionada */}
      {selectedTab === 0 && selectedVitalsView === "session" && (
        <Paper
          sx={{
            mb: 4,
            p: 3,
            borderRadius: 2,
            boxShadow: "0px 3px 6px rgba(0, 0, 0, 0.08)",
          }}
        >
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              mb: 3,
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center" }}>
              <Typography variant="h6" color="textPrimary" sx={{ mr: 2 }}>
                Detalles de la Sesión
              </Typography>
              <Box sx={{ minWidth: 250 }}>
                <select
                  value={selectedSession.id || "12"}
                  onChange={(e) => {
                    const session = availableSessions.find(
                      (s) => s.id === e.target.value
                    );
                    if (session) {
                      handleSessionSelect(session.id, session.date);
                    }
                  }}
                  style={{
                    padding: "8px 12px",
                    borderRadius: "4px",
                    border: "1px solid #ddd",
                    backgroundColor: "#f8f9fa",
                    width: "100%",
                    fontSize: "14px",
                  }}
                >
                  {availableSessions.map((session) => (
                    <option key={session.id} value={session.id}>
                      {session.name}
                    </option>
                  ))}
                </select>
              </Box>
            </Box>
            <Button
              variant="outlined"
              color="primary"
              size="small"
              onClick={() => handleVitalsViewChange("general")}
              sx={{ textTransform: "none" }}
            >
              Volver a Vista General
            </Button>
          </Box>

          <Box sx={{ mb: 4 }}>
            <Typography variant="subtitle1" fontWeight="medium" gutterBottom>
              Resumen de Signos Vitales
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <Box
                  sx={{
                    p: 2,
                    bgcolor: COLORS.veryLightBlue,
                    borderRadius: 1,
                    mb: 2,
                  }}
                >
                  <Grid container spacing={2}>
                    <Grid item xs={6} sm={3}>
                      <Box sx={{ textAlign: "center", p: 1 }}>
                        <Typography variant="body2" color="textSecondary">
                          SpO2 Promedio
                        </Typography>
                        <Typography
                          variant="h6"
                          color={COLORS.primary}
                          fontWeight="bold"
                        >
                          96%
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          Rango: 95-97%
                        </Typography>
                      </Box>
                    </Grid>
                    <Grid item xs={6} sm={3}>
                      <Box sx={{ textAlign: "center", p: 1 }}>
                        <Typography variant="body2" color="textSecondary">
                          FC Promedio
                        </Typography>
                        <Typography
                          variant="h6"
                          color="#ff4569"
                          fontWeight="bold"
                        >
                          99 LPM
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          Rango: 78-109 LPM
                        </Typography>
                      </Box>
                    </Grid>
                    <Grid item xs={6} sm={3}>
                      <Box sx={{ textAlign: "center", p: 1 }}>
                        <Typography variant="body2" color="textSecondary">
                          FR Promedio
                        </Typography>
                        <Typography
                          variant="h6"
                          color="#1fc8e3"
                          fontWeight="bold"
                        >
                          16 RPM
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          Rango: 14-18 RPM
                        </Typography>
                      </Box>
                    </Grid>
                    <Grid item xs={6} sm={3}>
                      <Box sx={{ textAlign: "center", p: 1 }}>
                        <Typography variant="body2" color="textSecondary">
                          Tiempo Sesión
                        </Typography>
                        <Typography
                          variant="h6"
                          color={COLORS.primary}
                          fontWeight="bold"
                        >
                          45m
                        </Typography>
                      </Box>
                    </Grid>
                  </Grid>
                </Box>
              </Grid>
            </Grid>
          </Box>

          {selectedSession.id === "12" && (
            <Box sx={{ mb: 4 }}>
              <Typography
                variant="subtitle1"
                fontWeight="medium"
                color="error"
                gutterBottom
              >
                Eventos Detectados
              </Typography>
              <Box
                sx={{
                  p: 2,
                  borderRadius: 1,
                  bgcolor: "rgba(255, 235, 235, 0.8)",
                  border: "1px solid rgba(255, 105, 105, 0.3)",
                }}
              >
                <Typography variant="body2" gutterBottom>
                  <strong>SpO2 &lt; 90%</strong> - Detectado a las 10:23 AM
                  (88%)
                </Typography>
                <Typography variant="body2">
                  Duración: 45 segundos • Se resolvió espontáneamente sin
                  intervención
                </Typography>
              </Box>
            </Box>
          )}

          {selectedSession.id === "9" && (
            <Box sx={{ mb: 4 }}>
              <Typography
                variant="subtitle1"
                fontWeight="medium"
                color="info.main"
                gutterBottom
              >
                Eventos Detectados
              </Typography>
              <Box
                sx={{
                  p: 2,
                  borderRadius: 1,
                  bgcolor: "rgba(232, 244, 253, 0.8)",
                  border: "1px solid rgba(33, 150, 243, 0.3)",
                }}
              >
                <Typography variant="body2" gutterBottom>
                  <strong>FC &gt; 100 LPM</strong> - Detectado a las 09:45 AM
                  (102 LPM)
                </Typography>
                <Typography variant="body2">
                  Duración: 1 min 20 seg • Coincidió con actividad física ligera
                </Typography>
              </Box>
            </Box>
          )}

          {/* Observaciones de Profesional */}
          <Box sx={{ mb: 4 }}>
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                mb: 2,
              }}
            >
              <Typography
                variant="subtitle1"
                fontWeight="medium"
                sx={{ color: COLORS.primary }}
                gutterBottom
              >
                Observaciones de Profesional
              </Typography>
              <Button
                variant="contained"
                color="primary"
                size="small"
                //onClick={() => {
                // Función para manejar la adición de una nueva observación
                // Por ejemplo, abrir un modal o cambiar de estado
                // handleAddObservation();
                //}}
                //startIcon={<AddIcon />}
                sx={{
                  textTransform: "none",
                  height: 35,
                }}
              >
                Agregar Observación
              </Button>
            </Box>
            <Paper
              sx={{
                p: 2.5,
                borderRadius: 1,
                bgcolor: "white",
                border: `1px solid ${COLORS.gridLine}`,
              }}
            >
              {selectedSession.id === "12" && (
                <>
                  <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                    <Avatar
                      sx={{
                        bgcolor: COLORS.primary,
                        width: 40,
                        height: 40,
                        mr: 2,
                      }}
                    >
                      DR
                    </Avatar>
                    <Box>
                      <Typography variant="subtitle2">
                        Dr. Ricardo Torres
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        Neumólogo • 08/04/2024
                      </Typography>
                    </Box>
                  </Box>
                  <Typography variant="body2" paragraph>
                    Paciente presenta episodio transitorio de desaturación que
                    coincide con maniobra de tos. Se observa buena recuperación
                    sin necesidad de oxigenoterapia suplementaria.
                  </Typography>
                  <Typography variant="body2" paragraph>
                    Mantiene buena mecánica ventilatoria y respuesta adecuada al
                    esfuerzo en los ejercicios respiratorios. Mejoría en
                    tolerancia a actividad física comparado con sesiones
                    anteriores.
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{ color: COLORS.primary, fontWeight: "medium" }}
                  >
                    Recomendación: Continuar con el plan de ejercicios
                    respiratorios enfocados en aumento progresivo de carga.
                    Vigilar SpO2 durante actividades con mayor demanda.
                  </Typography>
                </>
              )}

              {selectedSession.id === "9" && (
                <>
                  <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                    <Avatar
                      sx={{
                        bgcolor: COLORS.redLine,
                        width: 40,
                        height: 40,
                        mr: 2,
                      }}
                    >
                      MM
                    </Avatar>
                    <Box>
                      <Typography variant="subtitle2">
                        Dra. María Morales
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        Cardióloga • 01/03/2024
                      </Typography>
                    </Box>
                  </Box>
                  <Typography variant="body2" paragraph>
                    Se observa tendencia al aumento de frecuencia cardíaca con
                    actividades de baja intensidad. La paciente refiere
                    sensación de palpitaciones ocasionales que coinciden con los
                    picos registrados en FC.
                  </Typography>
                  <Typography variant="body2" paragraph>
                    Los datos de sensores inerciales muestran desvíos posturales
                    que podrían estar relacionados con compensación por fatiga
                    muscular prematura.
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{ color: COLORS.redLine, fontWeight: "medium" }}
                  >
                    Recomendación: Ajustar intensidad de ejercicios
                    cardiovasculares. Considerar valoración de medicación.
                    Implementar ejercicios específicos para corrección postural.
                  </Typography>
                </>
              )}

              {!["9", "12"].includes(selectedSession.id as string) && (
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ fontStyle: "italic", textAlign: "center", py: 2 }}
                >
                  No hay observaciones registradas para esta sesión
                </Typography>
              )}
            </Paper>
          </Box>

          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Paper
                sx={{
                  p: 3,
                  borderRadius: 2,
                  boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.05)",
                  height: "100%",
                  bgcolor: "white",
                  overflow: "hidden",
                }}
              >
                <Box sx={cardHeaderStyle}>
                  <Box sx={{ display: "flex", alignItems: "center" }}>
                    <Typography
                      variant="h6"
                      fontWeight="bold"
                      color="textPrimary"
                    >
                      SATURACIÓN DE OXÍGENO (%)
                    </Typography>
                    <MuiTooltip
                      title={chartDescriptions.spo2}
                      arrow
                      placement="top"
                    >
                      <IconButton size="small" sx={{ ml: 1 }}>
                        <HelpOutlineIcon fontSize="small" color="primary" />
                      </IconButton>
                    </MuiTooltip>
                  </Box>
                  <Box sx={valuePillStyle}>
                    {selectedSession.id === "12" ? "88%" : "96%"}
                  </Box>
                </Box>
                <Box
                  sx={{
                    borderRadius: 1,
                    backgroundColor: COLORS.veryLightBlue,
                    p: 1,
                    mb: 4,
                    height: 350,
                  }}
                >
                  <Line
                    data={{
                      labels: Array.from({ length: 45 }, (_, i) => `${i + 1}m`),
                      datasets: [
                        {
                          label: "SpO2 (%)",
                          data: [
                            ...Array.from({ length: 10 }, () =>
                              Math.floor(Math.random() * 3 + 96)
                            ),
                            ...Array.from({ length: 15 }, () =>
                              Math.floor(Math.random() * 3 + 94)
                            ),
                            ...(selectedSession.id === "12"
                              ? [88]
                              : [Math.floor(Math.random() * 3 + 94)]),
                            ...Array.from({ length: 19 }, () =>
                              Math.floor(Math.random() * 3 + 95)
                            ),
                          ],
                          borderColor: COLORS.primary,
                          backgroundColor: "transparent",
                          borderWidth: 2,
                          tension: 0.4,
                          pointRadius: (ctx) =>
                            ctx.dataIndex === 26 && selectedSession.id === "12"
                              ? 5
                              : 0,
                          pointBackgroundColor: COLORS.primary,
                        },
                      ],
                    }}
                    options={{
                      ...lineOptions,
                      plugins: {
                        ...lineOptions.plugins,
                        zoom: {
                          ...lineOptions.plugins?.zoom,
                          pan: {
                            enabled: true,
                            mode: "x",
                          },
                          zoom: {
                            wheel: {
                              enabled: true,
                            },
                            pinch: {
                              enabled: true,
                            },
                            mode: "x",
                          },
                        },
                      },
                    }}
                    ref={spo2SessionChartRef}
                  />
                </Box>
                <Box
                  sx={{ display: "flex", justifyContent: "flex-end", mt: 2 }}
                >
                  <Button
                    onClick={() => resetZoomForChart(spo2SessionChartRef)}
                    variant="text"
                    sx={{
                      color: COLORS.secondary,
                      textTransform: "none",
                      fontWeight: "normal",
                      fontSize: "0.85rem",
                      mr: 2,
                    }}
                  >
                    Resetear Zoom
                  </Button>
                  <Button
                    variant="text"
                    sx={{
                      color: COLORS.primary,
                      textTransform: "none",
                      fontWeight: "normal",
                      fontSize: "0.85rem",
                    }}
                    onClick={() =>
                      handleOpenDetail(
                        "SATURACIÓN DE OXÍGENO (%) - SESIÓN #" +
                          selectedSession.id,
                        selectedSession.id === "12" ? "88%" : "96%",
                        "spo2_session",
                        selectedSession.id === "12"
                          ? "Durante esta sesión se registró una caída de SpO2 por debajo del 90% que duró aproximadamente 45 segundos."
                          : "Los niveles de oxigenación se mantuvieron estables durante toda la sesión."
                      )
                    }
                  >
                    Ver detalles
                  </Button>
                </Box>
              </Paper>
            </Grid>
            <Grid item xs={12} md={6}>
              <Paper
                sx={{
                  p: 3,
                  borderRadius: 2,
                  boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.05)",
                  height: "100%",
                  bgcolor: "white",
                  overflow: "hidden",
                }}
              >
                <Box sx={cardHeaderStyle}>
                  <Box sx={{ display: "flex", alignItems: "center" }}>
                    <Typography
                      variant="h6"
                      fontWeight="bold"
                      color="textPrimary"
                    >
                      FRECUENCIA CARDIACA (LPM)
                    </Typography>
                    <MuiTooltip
                      title={chartDescriptions.heartRate}
                      arrow
                      placement="top"
                    >
                      <IconButton size="small" sx={{ ml: 1 }}>
                        <HelpOutlineIcon fontSize="small" color="primary" />
                      </IconButton>
                    </MuiTooltip>
                  </Box>
                  <Box sx={valuePillStyle}>
                    {selectedSession.id === "9" ? "102 LPM" : "99 LPM"}
                  </Box>
                </Box>
                <Box
                  sx={{
                    borderRadius: 1,
                    backgroundColor: COLORS.veryLightBlue,
                    p: 1,
                    mb: 4,
                    height: 350,
                  }}
                >
                  <Line
                    data={{
                      labels: Array.from({ length: 45 }, (_, i) => `${i + 1}m`),
                      datasets: [
                        {
                          label: "FC (LPM)",
                          data: [
                            ...Array.from({ length: 15 }, () =>
                              Math.floor(Math.random() * 10 + 78)
                            ),
                            ...(selectedSession.id === "9"
                              ? [102, 103, 101]
                              : Array.from({ length: 3 }, () =>
                                  Math.floor(Math.random() * 6 + 70)
                                )),
                            ...Array.from({ length: 27 }, () =>
                              Math.floor(Math.random() * 10 + 99)
                            ),
                          ],
                          borderColor: COLORS.redLine,
                          backgroundColor: "transparent",
                          borderWidth: 2,
                          tension: 0.4,
                          pointRadius: (ctx) =>
                            ctx.dataIndex >= 15 &&
                            ctx.dataIndex <= 17 &&
                            selectedSession.id === "9"
                              ? 5
                              : 0,
                          pointBackgroundColor: COLORS.redLine,
                        },
                      ],
                    }}
                    options={{
                      ...lineOptions,
                      plugins: {
                        ...lineOptions.plugins,
                        zoom: {
                          ...lineOptions.plugins?.zoom,
                          pan: {
                            enabled: true,
                            mode: "x",
                          },
                          zoom: {
                            wheel: {
                              enabled: true,
                            },
                            pinch: {
                              enabled: true,
                            },
                            mode: "x",
                          },
                        },
                      },
                    }}
                    ref={heartRateSessionChartRef}
                  />
                </Box>
                <Box
                  sx={{ display: "flex", justifyContent: "flex-end", mt: 2 }}
                >
                  <Button
                    onClick={() => resetZoomForChart(heartRateSessionChartRef)}
                    variant="text"
                    sx={{
                      color: COLORS.secondary,
                      textTransform: "none",
                      fontWeight: "normal",
                      fontSize: "0.85rem",
                      mr: 2,
                    }}
                  >
                    Resetear Zoom
                  </Button>
                  <Button
                    variant="text"
                    sx={{
                      color: COLORS.primary,
                      textTransform: "none",
                      fontWeight: "normal",
                      fontSize: "0.85rem",
                    }}
                    onClick={() =>
                      handleOpenDetail(
                        "FRECUENCIA CARDIACA (LPM) - SESIÓN #" +
                          selectedSession.id,
                        selectedSession.id === "9" ? "102 LPM" : "99 LPM",
                        "heart_rate_session",
                        selectedSession.id === "9"
                          ? "Se observó un incremento transitorio de la frecuencia cardíaca durante aproximadamente 1 minuto 20 segundos, asociado a actividad física ligera."
                          : "La frecuencia cardíaca se mantuvo dentro de límites normales durante toda la sesión."
                      )
                    }
                  >
                    Ver detalles
                  </Button>
                </Box>
              </Paper>
            </Grid>

            {/* Nuevo gráfico - Acelerómetro (3 ejes) */}
            <Grid item xs={12} md={6}>
              <Paper
                sx={{
                  p: 3,
                  borderRadius: 2,
                  boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.05)",
                  height: "100%",
                  bgcolor: "white",
                  overflow: "hidden",
                }}
              >
                <Box sx={cardHeaderStyle}>
                  <Box sx={{ display: "flex", alignItems: "center" }}>
                    <Typography
                      variant="h6"
                      fontWeight="bold"
                      color="textPrimary"
                    >
                      ACELERÓMETRO (m/s²)
                    </Typography>
                    <MuiTooltip
                      title="El acelerómetro mide la aceleración en los ejes X, Y y Z. Permite detectar movimientos, cambios de posición y patrones de actividad."
                      arrow
                      placement="top"
                    >
                      <IconButton size="small" sx={{ ml: 1 }}>
                        <HelpOutlineIcon fontSize="small" color="primary" />
                      </IconButton>
                    </MuiTooltip>
                  </Box>
                  <Box
                    sx={{
                      ...valuePillStyle,
                      cursor: "pointer",
                      "&:hover": {
                        opacity: 0.9,
                        boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.1)",
                      },
                    }}
                    onClick={() => setInertialObservationsOpen(true)}
                  >
                    DETALLES
                  </Box>
                </Box>
                <Box
                  sx={{
                    borderRadius: 1,
                    backgroundColor: COLORS.veryLightBlue,
                    p: 1,
                    mb: 4,
                    height: 350,
                  }}
                >
                  <Line
                    data={{
                      labels: Array.from({ length: 45 }, (_, i) => `${i + 1}m`),
                      datasets: [
                        {
                          label: "Eje X",
                          data: Array.from({ length: 45 }, () =>
                            (Math.random() * 2 - 1).toFixed(2)
                          ),
                          borderColor: COLORS.primary,
                          backgroundColor: "transparent",
                          borderWidth: 1.5,
                          tension: 0.2,
                        },
                        {
                          label: "Eje Y",
                          data: Array.from({ length: 45 }, () =>
                            (Math.random() * 2 - 1).toFixed(2)
                          ),
                          borderColor: COLORS.redLine,
                          backgroundColor: "transparent",
                          borderWidth: 1.5,
                          tension: 0.2,
                        },
                        {
                          label: "Eje Z",
                          data: Array.from({ length: 45 }, () =>
                            (Math.random() * 2 + 8).toFixed(2)
                          ),
                          borderColor: COLORS.cyanLine,
                          backgroundColor: "transparent",
                          borderWidth: 1.5,
                          tension: 0.2,
                        },
                      ],
                    }}
                    options={{
                      ...lineOptions,
                      plugins: {
                        ...lineOptions.plugins,
                        zoom: {
                          ...lineOptions.plugins?.zoom,
                          pan: {
                            enabled: true,
                            mode: "x",
                          },
                          zoom: {
                            wheel: {
                              enabled: true,
                            },
                            pinch: {
                              enabled: true,
                            },
                            mode: "x",
                          },
                        },
                        legend: {
                          display: true,
                          position: "top",
                          labels: {
                            boxWidth: 15,
                            usePointStyle: true,
                            pointStyle: "circle",
                          },
                        },
                      },
                      scales: {
                        ...lineOptions.scales,
                        y: {
                          ...lineOptions.scales?.y,
                          min: -2,
                          max: 10,
                          title: {
                            display: true,
                            text: "Aceleración (m/s²)",
                          },
                        },
                      },
                    }}
                    ref={inertialChartRef}
                  />
                </Box>
                <Box
                  sx={{ display: "flex", justifyContent: "flex-end", mt: 2 }}
                >
                  <Button
                    onClick={() => resetZoomForChart(inertialChartRef)}
                    variant="text"
                    sx={{
                      color: COLORS.secondary,
                      textTransform: "none",
                      fontWeight: "normal",
                      fontSize: "0.85rem",
                      mr: 2,
                    }}
                  >
                    Resetear Zoom
                  </Button>
                  <Button
                    variant="text"
                    sx={{
                      color: COLORS.primary,
                      textTransform: "none",
                      fontWeight: "normal",
                      fontSize: "0.85rem",
                    }}
                    onClick={() =>
                      handleOpenDetail(
                        "ACELERÓMETRO - SESIÓN #" + selectedSession.id,
                        "DATOS COMPLETOS",
                        "accel_session",
                        "El acelerómetro registra la aceleración en tres ejes (X, Y, Z). El eje Z muestra valores positivos más altos debido a la aceleración gravitacional. Anomalías en los ejes X e Y pueden indicar temblores o movimientos irregulares."
                      )
                    }
                  >
                    Ver detalles
                  </Button>
                </Box>
              </Paper>
            </Grid>

            {/* Nuevo gráfico - Giroscopio (3 ejes) */}
            <Grid item xs={12} md={6}>
              <Paper
                sx={{
                  p: 3,
                  borderRadius: 2,
                  boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.05)",
                  height: "100%",
                  bgcolor: "white",
                  overflow: "hidden",
                }}
              >
                <Box sx={cardHeaderStyle}>
                  <Box sx={{ display: "flex", alignItems: "center" }}>
                    <Typography
                      variant="h6"
                      fontWeight="bold"
                      color="textPrimary"
                    >
                      GIROSCOPIO (rad/s)
                    </Typography>
                    <MuiTooltip
                      title="El giroscopio mide la velocidad angular en los ejes X, Y y Z. Permite detectar rotaciones, giros y orientación espacial del paciente."
                      arrow
                      placement="top"
                    >
                      <IconButton size="small" sx={{ ml: 1 }}>
                        <HelpOutlineIcon fontSize="small" color="primary" />
                      </IconButton>
                    </MuiTooltip>
                  </Box>
                  <Box
                    sx={{
                      ...valuePillStyle,
                      cursor: "pointer",
                      "&:hover": {
                        opacity: 0.9,
                        boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.1)",
                      },
                    }}
                    onClick={() => setInertialObservationsOpen(true)}
                  >
                    DETALLES
                  </Box>
                </Box>
                <Box
                  sx={{
                    borderRadius: 1,
                    backgroundColor: COLORS.veryLightBlue,
                    p: 1,
                    mb: 4,
                    height: 350,
                  }}
                >
                  <Line
                    data={{
                      labels: Array.from({ length: 45 }, (_, i) => `${i + 1}m`),
                      datasets: [
                        {
                          label: "Eje X",
                          data: Array.from({ length: 45 }, () =>
                            (Math.random() * 0.5 - 0.25).toFixed(2)
                          ),
                          borderColor: COLORS.greenLine,
                          backgroundColor: "transparent",
                          borderWidth: 1.5,
                          tension: 0.2,
                        },
                        {
                          label: "Eje Y",
                          data: Array.from({ length: 45 }, () =>
                            (Math.random() * 0.5 - 0.25).toFixed(2)
                          ),
                          borderColor: "#9c27b0", // Púrpura para distinguir
                          backgroundColor: "transparent",
                          borderWidth: 1.5,
                          tension: 0.2,
                        },
                        {
                          label: "Eje Z",
                          data: Array.from({ length: 45 }, () =>
                            (Math.random() * 0.5 - 0.25).toFixed(2)
                          ),
                          borderColor: "#ff9800", // Naranja para distinguir
                          backgroundColor: "transparent",
                          borderWidth: 1.5,
                          tension: 0.2,
                        },
                      ],
                    }}
                    options={{
                      ...lineOptions,
                      plugins: {
                        ...lineOptions.plugins,
                        zoom: {
                          ...lineOptions.plugins?.zoom,
                          pan: {
                            enabled: true,
                            mode: "x",
                          },
                          zoom: {
                            wheel: {
                              enabled: true,
                            },
                            pinch: {
                              enabled: true,
                            },
                            mode: "x",
                          },
                        },
                        legend: {
                          display: true,
                          position: "top",
                          labels: {
                            boxWidth: 15,
                            usePointStyle: true,
                            pointStyle: "circle",
                          },
                        },
                      },
                      scales: {
                        ...lineOptions.scales,
                        y: {
                          ...lineOptions.scales?.y,
                          min: -0.3,
                          max: 0.3,
                          title: {
                            display: true,
                            text: "Velocidad angular (rad/s)",
                          },
                        },
                      },
                    }}
                  />
                </Box>
                <Box
                  sx={{ display: "flex", justifyContent: "flex-end", mt: 2 }}
                >
                  <Button
                    variant="text"
                    sx={{
                      color: COLORS.secondary,
                      textTransform: "none",
                      fontWeight: "normal",
                      fontSize: "0.85rem",
                      mr: 2,
                    }}
                  >
                    Resetear Zoom
                  </Button>
                  <Button
                    variant="text"
                    sx={{
                      color: COLORS.primary,
                      textTransform: "none",
                      fontWeight: "normal",
                      fontSize: "0.85rem",
                    }}
                    onClick={() =>
                      handleOpenDetail(
                        "GIROSCOPIO - SESIÓN #" + selectedSession.id,
                        "DATOS COMPLETOS",
                        "gyro_session",
                        "El giroscopio mide la velocidad angular en radianes por segundo. Valores significativamente diferentes de cero indican rotación en ese eje. Patrones repetitivos pueden indicar temblores o movimientos rítmicos anormales."
                      )
                    }
                  >
                    Ver detalles
                  </Button>
                </Box>
              </Paper>
            </Grid>
            {/* Nuevo gráfico - Frecuencia Respiratoria */}
            <Grid item xs={12} md={6}>
              <Paper
                sx={{
                  p: 3,
                  borderRadius: 2,
                  boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.05)",
                  height: "100%",
                  bgcolor: "white",
                  overflow: "hidden",
                }}
              >
                <Box sx={cardHeaderStyle}>
                  <Box sx={{ display: "flex", alignItems: "center" }}>
                    <Typography
                      variant="h6"
                      fontWeight="bold"
                      color="textPrimary"
                    >
                      FRECUENCIA RESPIRATORIA (RPM)
                    </Typography>
                    <MuiTooltip
                      title={chartDescriptions.respRate}
                      arrow
                      placement="top"
                    >
                      <IconButton size="small" sx={{ ml: 1 }}>
                        <HelpOutlineIcon fontSize="small" color="primary" />
                      </IconButton>
                    </MuiTooltip>
                  </Box>
                  <Box sx={valuePillStyle}>15 RPM</Box>
                </Box>
                <Box
                  sx={{
                    borderRadius: 1,
                    backgroundColor: COLORS.veryLightBlue,
                    p: 1,
                    mb: 4,
                    height: 350,
                  }}
                >
                  <Line
                    data={{
                      labels: Array.from({ length: 45 }, (_, i) => `${i + 1}m`),
                      datasets: [
                        {
                          label: "FR (RPM)",
                          data: Array.from({ length: 45 }, () =>
                            Math.floor(Math.random() * 4 + 13)
                          ),
                          borderColor: COLORS.cyanLine,
                          backgroundColor: "transparent",
                          borderWidth: 2,
                          tension: 0.4,
                          pointRadius: 0,
                          pointBackgroundColor: COLORS.cyanLine,
                        },
                      ],
                    }}
                    options={{
                      ...lineOptions,
                      plugins: {
                        ...lineOptions.plugins,
                        zoom: {
                          ...lineOptions.plugins?.zoom,
                          pan: {
                            enabled: true,
                            mode: "x",
                          },
                          zoom: {
                            wheel: {
                              enabled: true,
                            },
                            pinch: {
                              enabled: true,
                            },
                            mode: "x",
                          },
                        },
                      },
                      scales: {
                        ...lineOptions.scales,
                        y: {
                          ...lineOptions.scales?.y,
                          min: 10,
                          max: 20,
                          ticks: {
                            stepSize: 2,
                          },
                        },
                      },
                    }}
                    ref={respRateSessionChartRef}
                  />
                </Box>
                <Box
                  sx={{ display: "flex", justifyContent: "flex-end", mt: 2 }}
                >
                  <Button
                    onClick={() => resetZoomForChart(respRateSessionChartRef)}
                    variant="text"
                    sx={{
                      color: COLORS.secondary,
                      textTransform: "none",
                      fontWeight: "normal",
                      fontSize: "0.85rem",
                      mr: 2,
                    }}
                  >
                    Resetear Zoom
                  </Button>
                  <Button
                    variant="text"
                    sx={{
                      color: COLORS.primary,
                      textTransform: "none",
                      fontWeight: "normal",
                      fontSize: "0.85rem",
                    }}
                    onClick={() =>
                      handleOpenDetail(
                        "FRECUENCIA RESPIRATORIA (RPM) - SESIÓN #" +
                          selectedSession.id,
                        "15 RPM",
                        "resp_rate_session",
                        "La frecuencia respiratoria se mantuvo en rangos normales durante toda la sesión, sin eventos significativos."
                      )
                    }
                  >
                    Ver detalles
                  </Button>
                </Box>
              </Paper>
            </Grid>
          </Grid>
        </Paper>
      )}

      {/* Diálogo de detalle para mostrar el gráfico ampliado */}
      <Dialog
        open={detailDialog.open}
        onClose={handleCloseDetail}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            p: 2,
            bgcolor: "white",
            borderBottom: `1px solid ${COLORS.gridLine}`,
          }}
        >
          <Box>
            <Typography variant="h6" fontWeight="bold" color="textPrimary">
              {detailDialog.title}
            </Typography>
            <Box sx={valuePillStyle} style={{ marginTop: 8 }}>
              {detailDialog.value}
            </Box>
          </Box>
          <IconButton
            edge="end"
            color="inherit"
            onClick={handleCloseDetail}
            aria-label="close"
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent sx={{ p: 3, bgcolor: COLORS.lightGrey }}>
          <Box sx={{ mb: 3 }}>
            <Typography variant="body1" color="textSecondary">
              {detailDialog.description}
            </Typography>
          </Box>
          <Box
            sx={{
              height: 400,
              bgcolor: "white",
              borderRadius: 2,
              p: 3,
              boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.05)",
            }}
          >
            {detailDialog.chartType === "spo2" && (
              <>
                <Line
                  data={{
                    ...oxygenSaturationChartData,
                    datasets: [
                      {
                        ...oxygenSaturationChartData.datasets[0],
                        pointRadius: 3,
                      },
                    ],
                  }}
                  options={detailedLineOptions}
                  ref={detailSpo2ChartRef}
                />
                <Box
                  sx={{ display: "flex", justifyContent: "flex-end", mt: 2 }}
                >
                  <Button
                    onClick={() => resetZoomForChart(detailSpo2ChartRef)}
                    variant="text"
                    sx={{
                      color: COLORS.secondary,
                      textTransform: "none",
                      fontWeight: "normal",
                      fontSize: "0.85rem",
                    }}
                  >
                    Resetear Zoom
                  </Button>
                </Box>
              </>
            )}
            {detailDialog.chartType === "heartRate" && (
              <>
                <Line
                  data={{
                    ...heartRateChartData,
                    datasets: [
                      {
                        ...heartRateChartData.datasets[0],
                        pointRadius: 3,
                      },
                    ],
                  }}
                  options={detailedLineOptions}
                  ref={detailHeartRateChartRef}
                />
                <Box
                  sx={{ display: "flex", justifyContent: "flex-end", mt: 2 }}
                >
                  <Button
                    onClick={() => resetZoomForChart(detailHeartRateChartRef)}
                    variant="text"
                    sx={{
                      color: COLORS.secondary,
                      textTransform: "none",
                      fontWeight: "normal",
                      fontSize: "0.85rem",
                    }}
                  >
                    Resetear Zoom
                  </Button>
                </Box>
              </>
            )}
            {detailDialog.chartType === "respRate" && (
              <>
                <Line
                  data={{
                    ...respiratoryRateChartData,
                    datasets: [
                      {
                        ...respiratoryRateChartData.datasets[0],
                        pointRadius: 3,
                      },
                    ],
                  }}
                  options={detailedLineOptions}
                  ref={detailRespRateChartRef}
                />
                <Box
                  sx={{ display: "flex", justifyContent: "flex-end", mt: 2 }}
                >
                  <Button
                    onClick={() => resetZoomForChart(detailRespRateChartRef)}
                    variant="text"
                    sx={{
                      color: COLORS.secondary,
                      textTransform: "none",
                      fontWeight: "normal",
                      fontSize: "0.85rem",
                    }}
                  >
                    Resetear Zoom
                  </Button>
                </Box>
              </>
            )}
            {detailDialog.chartType === "inertial" && (
              <>
                <Bar
                  data={{
                    labels: generateSessionDateLabels().slice(0, 10),
                    datasets: [
                      {
                        label: "Eventos anómalos por sesión",
                        data: generateMotionAnomalyEvents(),
                        backgroundColor: COLORS.primary,
                        borderColor: COLORS.primary,
                        borderWidth: 1,
                        barThickness: 30,
                        hoverBackgroundColor: COLORS.secondary,
                      },
                    ],
                  }}
                  options={{
                    ...detailedLineOptions,
                    plugins: {
                      ...detailedLineOptions.plugins,
                      title: {
                        ...detailedLineOptions.plugins?.title,
                        text: "Histograma de Eventos Anómalos de Movimiento",
                      },
                      legend: {
                        display: true,
                        position: "top",
                      },
                    },
                    scales: {
                      ...detailedLineOptions.scales,
                      y: {
                        ...detailedLineOptions.scales?.y,
                        beginAtZero: true,
                        max: 10,
                        ticks: {
                          stepSize: 1,
                        },
                        title: {
                          display: true,
                          text: "Número de eventos",
                          font: {
                            size: 14,
                            weight: "bold",
                          },
                        },
                      },
                      x: {
                        ...detailedLineOptions.scales?.x,
                        title: {
                          display: true,
                          text: "Sesiones",
                          font: {
                            size: 14,
                            weight: "bold",
                          },
                        },
                      },
                    },
                  }}
                  ref={detailInertialChartRef}
                />
                <Box sx={{ mt: 4 }}>
                  <Typography
                    variant="subtitle1"
                    fontWeight="medium"
                    gutterBottom
                  >
                    Resumen de Anomalías por Sesión
                  </Typography>
                  <Typography variant="body2" sx={{ mb: 2 }}>
                    El histograma muestra la cantidad de eventos anómalos
                    detectados en el movimiento del paciente durante cada
                    sesión. Los eventos incluyen movimientos bruscos, posturas
                    incorrectas y períodos de inactividad.
                  </Typography>
                  <Typography variant="body2">
                    <strong>Observaciones destacadas:</strong>
                  </Typography>
                  <ul style={{ margin: "8px 0", paddingLeft: "20px" }}>
                    <li>
                      <Typography variant="body2">
                        La sesión 9 (01/03/2024) muestra el mayor número de
                        anomalías (8 eventos)
                      </Typography>
                    </li>
                    <li>
                      <Typography variant="body2">
                        Las sesiones 4 y 7 también presentan múltiples eventos
                        anómalos
                      </Typography>
                    </li>
                    <li>
                      <Typography variant="body2">
                        En general, se observa una tendencia a la disminución de
                        eventos en las sesiones más recientes
                      </Typography>
                    </li>
                  </ul>
                </Box>
              </>
            )}
          </Box>
        </DialogContent>
        <DialogActions sx={{ p: 2, borderTop: `1px solid ${COLORS.gridLine}` }}>
          <Button onClick={handleCloseDetail} sx={{ color: COLORS.primary }}>
            Cerrar
          </Button>
        </DialogActions>
      </Dialog>

      {/* Diálogo de observaciones de sensores inerciales */}
      <Dialog
        open={inertialObservationsOpen}
        onClose={() => setInertialObservationsOpen(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            p: 2,
            bgcolor: "white",
            borderBottom: `1px solid ${COLORS.gridLine}`,
          }}
        >
          <Typography variant="h6" fontWeight="bold" color="textPrimary">
            Detalle de Eventos Detectados por Sensores Inerciales
          </Typography>
          <IconButton
            edge="end"
            color="inherit"
            onClick={() => setInertialObservationsOpen(false)}
            aria-label="close"
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent sx={{ p: 3, bgcolor: COLORS.lightGrey }}>
          <Grid container spacing={3}>
            {/* Resumen general de eventos */}
            <Grid item xs={12}>
              <Paper sx={{ p: 2, mb: 3 }}>
                <Typography
                  variant="subtitle1"
                  fontWeight="bold"
                  sx={{ mb: 1 }}
                >
                  Resumen de Eventos por Categoría
                </Typography>
                <Typography variant="body2" sx={{ mb: 2 }}>
                  Los sensores inerciales registraron un total de 28 eventos
                  anómalos durante las últimas 10 sesiones, distribuidos en las
                  siguientes categorías:
                </Typography>

                <Grid container spacing={2}>
                  <Grid item xs={6} md={3}>
                    <Box
                      sx={{
                        textAlign: "center",
                        p: 2,
                        bgcolor: "rgba(19, 72, 185, 0.1)",
                        borderRadius: 1,
                      }}
                    >
                      <Typography
                        variant="h5"
                        color={COLORS.primary}
                        fontWeight="bold"
                      >
                        12
                      </Typography>
                      <Typography variant="body2">
                        Desvíos posturales
                      </Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={6} md={3}>
                    <Box
                      sx={{
                        textAlign: "center",
                        p: 2,
                        bgcolor: "rgba(255, 69, 105, 0.1)",
                        borderRadius: 1,
                      }}
                    >
                      <Typography
                        variant="h5"
                        color={COLORS.redLine}
                        fontWeight="bold"
                      >
                        8
                      </Typography>
                      <Typography variant="body2">Temblores</Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={6} md={3}>
                    <Box
                      sx={{
                        textAlign: "center",
                        p: 2,
                        bgcolor: "rgba(31, 200, 227, 0.1)",
                        borderRadius: 1,
                      }}
                    >
                      <Typography
                        variant="h5"
                        color={COLORS.cyanLine}
                        fontWeight="bold"
                      >
                        5
                      </Typography>
                      <Typography variant="body2">
                        Movimientos bruscos
                      </Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={6} md={3}>
                    <Box
                      sx={{
                        textAlign: "center",
                        p: 2,
                        bgcolor: "rgba(76, 175, 80, 0.1)",
                        borderRadius: 1,
                      }}
                    >
                      <Typography
                        variant="h5"
                        color={COLORS.greenLine}
                        fontWeight="bold"
                      >
                        3
                      </Typography>
                      <Typography variant="body2">Interrupciones</Typography>
                    </Box>
                  </Grid>
                </Grid>
              </Paper>
            </Grid>

            {/* Sesiones con mayor incidencia */}
            <Grid item xs={12}>
              <Paper sx={{ p: 2, mb: 3 }}>
                <Typography
                  variant="subtitle1"
                  fontWeight="bold"
                  sx={{ mb: 1 }}
                >
                  Sesiones con Mayor Incidencia de Eventos
                </Typography>

                <Box sx={{ mb: 2 }}>
                  <Typography
                    variant="subtitle2"
                    fontWeight="medium"
                    sx={{ mb: 1, color: COLORS.primary }}
                  >
                    Sesión #9 - 01/03/2024 (8 eventos)
                  </Typography>
                  <Box
                    sx={{
                      p: 2,
                      bgcolor: "rgba(19, 72, 185, 0.05)",
                      borderRadius: 1,
                      mb: 1,
                    }}
                  >
                    <Typography variant="body2" sx={{ mb: 1 }}>
                      <strong>Patrón principal:</strong> Desvíos posturales
                      laterales durante ejercicios de rehabilitación
                      respiratoria.
                    </Typography>
                    <Typography variant="body2">
                      <strong>Observación clínica:</strong> La paciente mostró
                      tendencia a inclinarse hacia la derecha durante los
                      ejercicios de respiración profunda, posiblemente indicando
                      debilidad muscular en el hemicuerpo izquierdo o
                      compensación por dolor.
                    </Typography>
                  </Box>
                </Box>

                <Box sx={{ mb: 2 }}>
                  <Typography
                    variant="subtitle2"
                    fontWeight="medium"
                    sx={{ mb: 1, color: COLORS.redLine }}
                  >
                    Sesión #4 - 05/02/2024 (6 eventos)
                  </Typography>
                  <Box
                    sx={{
                      p: 2,
                      bgcolor: "rgba(255, 69, 105, 0.05)",
                      borderRadius: 1,
                      mb: 1,
                    }}
                  >
                    <Typography variant="body2" sx={{ mb: 1 }}>
                      <strong>Patrón principal:</strong> Temblores de baja
                      intensidad pero persistentes durante periodos de reposo.
                    </Typography>
                    <Typography variant="body2">
                      <strong>Observación clínica:</strong> Los temblores
                      coincidieron con periodos de mayor ansiedad reportada por
                      la paciente. Se recomienda evaluar componente ansioso y
                      posible relación con medicación.
                    </Typography>
                  </Box>
                </Box>

                <Box>
                  <Typography
                    variant="subtitle2"
                    fontWeight="medium"
                    sx={{ mb: 1, color: COLORS.cyanLine }}
                  >
                    Sesión #7 - 20/02/2024 (5 eventos)
                  </Typography>
                  <Box
                    sx={{
                      p: 2,
                      bgcolor: "rgba(31, 200, 227, 0.05)",
                      borderRadius: 1,
                    }}
                  >
                    <Typography variant="body2" sx={{ mb: 1 }}>
                      <strong>Patrón principal:</strong> Movimientos bruscos y
                      pequeñas interrupciones en la continuidad del monitoreo.
                    </Typography>
                    <Typography variant="body2">
                      <strong>Observación clínica:</strong> Los movimientos
                      bruscos se asociaron temporalmente con episodios de tos.
                      La paciente reportó molestias en la garganta durante esta
                      sesión.
                    </Typography>
                  </Box>
                </Box>
              </Paper>
            </Grid>

            {/* Tendencias y análisis */}
            <Grid item xs={12}>
              <Paper sx={{ p: 2 }}>
                <Typography
                  variant="subtitle1"
                  fontWeight="bold"
                  sx={{ mb: 1 }}
                >
                  Análisis y Tendencias
                </Typography>

                <Box sx={{ mb: 2 }}>
                  <Typography variant="body2" sx={{ mb: 2 }}>
                    El análisis de los datos recogidos por los sensores
                    inerciales muestra las siguientes tendencias significativas:
                  </Typography>

                  <Box
                    sx={{
                      mb: 2,
                      p: 2,
                      bgcolor: "rgba(246, 246, 246, 0.7)",
                      borderRadius: 1,
                      border: "1px dashed rgba(0, 0, 0, 0.12)",
                    }}
                  >
                    <Typography
                      variant="body2"
                      fontWeight="medium"
                      sx={{ mb: 1 }}
                    >
                      1. Correlación entre eventos posturales y fatiga
                    </Typography>
                    <Typography variant="body2" sx={{ mb: 1 }}>
                      Se observa un aumento de desvíos posturales después de 20
                      minutos de actividad, sugiriendo fatiga muscular
                      progresiva.
                    </Typography>
                  </Box>

                  <Box
                    sx={{
                      mb: 2,
                      p: 2,
                      bgcolor: "rgba(246, 246, 246, 0.7)",
                      borderRadius: 1,
                      border: "1px dashed rgba(0, 0, 0, 0.12)",
                    }}
                  >
                    <Typography
                      variant="body2"
                      fontWeight="medium"
                      sx={{ mb: 1 }}
                    >
                      2. Disminución de eventos en las últimas sesiones
                    </Typography>
                    <Typography variant="body2" sx={{ mb: 1 }}>
                      Se registra una disminución general del 25% en eventos de
                      temblores en las últimas 3 sesiones, indicando posible
                      mejora en la estabilidad.
                    </Typography>
                  </Box>

                  <Box
                    sx={{
                      p: 2,
                      bgcolor: "rgba(246, 246, 246, 0.7)",
                      borderRadius: 1,
                      border: "1px dashed rgba(0, 0, 0, 0.12)",
                    }}
                  >
                    <Typography
                      variant="body2"
                      fontWeight="medium"
                      sx={{ mb: 1 }}
                    >
                      3. Recomendaciones clínicas
                    </Typography>
                    <Typography variant="body2">
                      Se sugiere incorporar ejercicios específicos de
                      fortalecimiento del core y propiocepción para mejorar la
                      estabilidad postural. Considerar evaluación neurológica
                      para valorar los temblores de baja intensidad.
                    </Typography>
                  </Box>
                </Box>
              </Paper>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions sx={{ p: 2, borderTop: `1px solid ${COLORS.gridLine}` }}>
          <Button
            onClick={() => setInertialObservationsOpen(false)}
            sx={{ color: COLORS.primary }}
          >
            Cerrar
          </Button>
        </DialogActions>
      </Dialog>

      {/* Diálogo para historial de tendencias */}
      <Dialog
        open={trendHistoryDialog.open}
        onClose={() =>
          setTrendHistoryDialog({ ...trendHistoryDialog, open: false })
        }
        maxWidth="md"
        fullWidth
      >
        <DialogTitle
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            p: 2,
            bgcolor: "white",
            borderBottom: `1px solid ${COLORS.gridLine}`,
          }}
        >
          <Typography variant="h6" fontWeight="bold">
            {trendHistoryDialog.type === "spo2" &&
              "Historial de Tendencias - SpO2"}
            {trendHistoryDialog.type === "fc" &&
              "Historial de Tendencias - Frecuencia Cardíaca"}
            {trendHistoryDialog.type === "spo2_events" &&
              "Historial de Eventos - SpO2 < 90%"}
            {trendHistoryDialog.type === "fc_events" &&
              "Historial de Eventos - FC > 100 LPM"}
          </Typography>
          <IconButton
            edge="end"
            color="inherit"
            onClick={() =>
              setTrendHistoryDialog({ ...trendHistoryDialog, open: false })
            }
            aria-label="close"
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent sx={{ p: 3, bgcolor: COLORS.lightGrey }}>
          <Box sx={{ bgcolor: "white", p: 3, borderRadius: 2 }}>
            {(trendHistoryDialog.type === "spo2" ||
              trendHistoryDialog.type === "fc") && (
              <>
                <Typography variant="subtitle1" gutterBottom>
                  Últimas 10 sesiones
                </Typography>
                <Box sx={{ height: 300, mb: 3 }}>
                  <Line
                    data={{
                      labels: [
                        "Sesión 1",
                        "Sesión 2",
                        "Sesión 3",
                        "Sesión 4",
                        "Sesión 5",
                        "Sesión 6",
                        "Sesión 7",
                        "Sesión 8",
                        "Sesión 9",
                        "Sesión 10",
                      ],
                      datasets: [
                        {
                          label:
                            trendHistoryDialog.type === "spo2"
                              ? "SpO2 (%)"
                              : "FC (LPM)",
                          data:
                            trendHistoryDialog.type === "spo2"
                              ? [95, 94, 96, 95, 97, 94, 95, 96, 95, 96]
                              : [82, 78, 75, 73, 76, 74, 72, 75, 73, 72],
                          borderColor:
                            trendHistoryDialog.type === "spo2"
                              ? COLORS.primary
                              : COLORS.redLine,
                          backgroundColor: "transparent",
                          tension: 0.4,
                        },
                      ],
                    }}
                    options={{
                      responsive: true,
                      maintainAspectRatio: false,
                      plugins: {
                        legend: {
                          display: true,
                          position: "top",
                        },
                      },
                      scales: {
                        y: {
                          beginAtZero: false,
                          min: trendHistoryDialog.type === "spo2" ? 90 : 60,
                          max: trendHistoryDialog.type === "spo2" ? 100 : 90,
                        },
                      },
                    }}
                  />
                </Box>
                <Typography variant="body2" color="textSecondary">
                  {trendHistoryDialog.type === "spo2"
                    ? "La tendencia muestra una estabilidad general en los niveles de saturación de oxígeno, con variaciones mínimas entre sesiones."
                    : "Se observa una tendencia a la baja en la frecuencia cardíaca, indicando una mejora en el acondicionamiento cardiovascular."}
                </Typography>
              </>
            )}

            {(trendHistoryDialog.type === "spo2_events" ||
              trendHistoryDialog.type === "fc_events") && (
              <>
                <Typography variant="subtitle1" gutterBottom>
                  Registro de eventos
                </Typography>
                <Box sx={{ mb: 3, maxHeight: 400, overflow: "auto" }}>
                  <table style={{ width: "100%", borderCollapse: "collapse" }}>
                    <thead>
                      <tr
                        style={{
                          backgroundColor: COLORS.veryLightBlue,
                          borderBottom: `1px solid ${COLORS.gridLine}`,
                        }}
                      >
                        <th style={{ padding: "10px", textAlign: "left" }}>
                          Fecha
                        </th>
                        <th style={{ padding: "10px", textAlign: "left" }}>
                          Hora
                        </th>
                        <th style={{ padding: "10px", textAlign: "left" }}>
                          Valor
                        </th>
                        <th style={{ padding: "10px", textAlign: "left" }}>
                          Duración
                        </th>
                        <th style={{ padding: "10px", textAlign: "left" }}>
                          Sesión
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {trendHistoryDialog.type === "spo2_events" ? (
                        <>
                          <tr
                            style={{
                              borderBottom: `1px solid ${COLORS.gridLine}`,
                            }}
                          >
                            <td style={{ padding: "10px" }}>15/03/2024</td>
                            <td style={{ padding: "10px" }}>10:23 AM</td>
                            <td style={{ padding: "10px", color: "red" }}>
                              88%
                            </td>
                            <td style={{ padding: "10px" }}>45 segundos</td>
                            <td style={{ padding: "10px" }}>
                              <Button
                                sx={{
                                  color: COLORS.primary,
                                  textTransform: "none",
                                  p: 0,
                                  fontWeight: "normal",
                                  "&:hover": {
                                    textDecoration: "underline",
                                    background: "transparent",
                                  },
                                }}
                                onClick={() =>
                                  handleSessionSelect("12", "15/03/2024")
                                }
                              >
                                Sesión #12
                              </Button>
                            </td>
                          </tr>
                          <tr
                            style={{
                              borderBottom: `1px solid ${COLORS.gridLine}`,
                            }}
                          >
                            <td style={{ padding: "10px" }}>28/02/2024</td>
                            <td style={{ padding: "10px" }}>11:05 AM</td>
                            <td style={{ padding: "10px", color: "red" }}>
                              89%
                            </td>
                            <td style={{ padding: "10px" }}>30 segundos</td>
                            <td style={{ padding: "10px" }}>
                              <Button
                                sx={{
                                  color: COLORS.primary,
                                  textTransform: "none",
                                  p: 0,
                                  fontWeight: "normal",
                                  "&:hover": {
                                    textDecoration: "underline",
                                    background: "transparent",
                                  },
                                }}
                                onClick={() =>
                                  handleSessionSelect("8", "28/02/2024")
                                }
                              >
                                Sesión #8
                              </Button>
                            </td>
                          </tr>
                        </>
                      ) : (
                        <>
                          <tr
                            style={{
                              borderBottom: `1px solid ${COLORS.gridLine}`,
                            }}
                          >
                            <td style={{ padding: "10px" }}>01/03/2024</td>
                            <td style={{ padding: "10px" }}>09:45 AM</td>
                            <td style={{ padding: "10px", color: "blue" }}>
                              102 LPM
                            </td>
                            <td style={{ padding: "10px" }}>1 min 20 seg</td>
                            <td style={{ padding: "10px" }}>
                              <Button
                                sx={{
                                  color: COLORS.primary,
                                  textTransform: "none",
                                  p: 0,
                                  fontWeight: "normal",
                                  "&:hover": {
                                    textDecoration: "underline",
                                    background: "transparent",
                                  },
                                }}
                                onClick={() =>
                                  handleSessionSelect("9", "01/03/2024")
                                }
                              >
                                Sesión #9
                              </Button>
                            </td>
                          </tr>
                          <tr
                            style={{
                              borderBottom: `1px solid ${COLORS.gridLine}`,
                            }}
                          >
                            <td style={{ padding: "10px" }}>15/02/2024</td>
                            <td style={{ padding: "10px" }}>10:10 AM</td>
                            <td style={{ padding: "10px", color: "blue" }}>
                              105 LPM
                            </td>
                            <td style={{ padding: "10px" }}>55 segundos</td>
                            <td style={{ padding: "10px" }}>
                              <Button
                                sx={{
                                  color: COLORS.primary,
                                  textTransform: "none",
                                  p: 0,
                                  fontWeight: "normal",
                                  "&:hover": {
                                    textDecoration: "underline",
                                    background: "transparent",
                                  },
                                }}
                                onClick={() =>
                                  handleSessionSelect("6", "15/02/2024")
                                }
                              >
                                Sesión #6
                              </Button>
                            </td>
                          </tr>
                          <tr
                            style={{
                              borderBottom: `1px solid ${COLORS.gridLine}`,
                            }}
                          >
                            <td style={{ padding: "10px" }}>01/02/2024</td>
                            <td style={{ padding: "10px" }}>11:30 AM</td>
                            <td style={{ padding: "10px", color: "blue" }}>
                              110 LPM
                            </td>
                            <td style={{ padding: "10px" }}>2 min 10 seg</td>
                            <td style={{ padding: "10px" }}>
                              <Button
                                sx={{
                                  color: COLORS.primary,
                                  textTransform: "none",
                                  p: 0,
                                  fontWeight: "normal",
                                  "&:hover": {
                                    textDecoration: "underline",
                                    background: "transparent",
                                  },
                                }}
                                onClick={() =>
                                  handleSessionSelect("3", "01/02/2024")
                                }
                              >
                                Sesión #3
                              </Button>
                            </td>
                          </tr>
                        </>
                      )}
                    </tbody>
                  </table>
                </Box>
                <Typography variant="body2" color="textSecondary">
                  {trendHistoryDialog.type === "spo2_events"
                    ? "Se han registrado 2 eventos donde la saturación de oxígeno cayó por debajo del 90%. Estos episodios fueron transitorios y se resolvieron espontáneamente."
                    : "Se han registrado 3 eventos donde la frecuencia cardíaca superó los 100 LPM. Estos episodios generalmente ocurrieron durante actividad física ligera."}
                </Typography>
              </>
            )}
          </Box>
        </DialogContent>
        <DialogActions sx={{ p: 2, borderTop: `1px solid ${COLORS.gridLine}` }}>
          <Button
            onClick={() =>
              setTrendHistoryDialog({ ...trendHistoryDialog, open: false })
            }
            sx={{ color: COLORS.primary }}
          >
            Cerrar
          </Button>
        </DialogActions>
      </Dialog>

      {/* Diálogo para historial de observaciones */}
      <Dialog
        open={observationsHistoryOpen}
        onClose={() => setObservationsHistoryOpen(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            p: 2,
            bgcolor: "white",
            borderBottom: `1px solid ${COLORS.gridLine}`,
          }}
        >
          <Typography variant="h6" fontWeight="bold">
            Historial de Observaciones del Profesional
          </Typography>
          <IconButton
            edge="end"
            color="inherit"
            onClick={() => setObservationsHistoryOpen(false)}
            aria-label="close"
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent sx={{ p: 3, bgcolor: COLORS.lightGrey }}>
          <Box sx={{ bgcolor: "white", p: 3, borderRadius: 2, mb: 2 }}>
            <Box
              sx={{
                mb: 2,
                pb: 2,
                borderBottom: `1px solid ${COLORS.gridLine}`,
              }}
            >
              <Typography variant="subtitle1" fontWeight="bold">
                Sesión #12 - 15/03/2024
              </Typography>
              <Typography
                variant="body2"
                color="text.secondary"
                sx={{ fontStyle: "italic", mb: 1 }}
              >
                Dr. Martínez - 20/03/2024
              </Typography>
              <Typography variant="body1">
                La paciente muestra una evolución favorable en los parámetros
                cardiovasculares. Los episodios de desaturación son aislados y
                no persistentes. Se recomienda continuar con el mismo esquema de
                monitorización y mantener la frecuencia de las sesiones
                actuales.
              </Typography>
            </Box>

            <Box
              sx={{
                mb: 2,
                pb: 2,
                borderBottom: `1px solid ${COLORS.gridLine}`,
              }}
            >
              <Typography variant="subtitle1" fontWeight="bold">
                Sesión #8 - 28/02/2024
              </Typography>
              <Typography
                variant="body2"
                color="text.secondary"
                sx={{ fontStyle: "italic", mb: 1 }}
              >
                Dra. Gómez - 01/03/2024
              </Typography>
              <Typography variant="body1">
                Se observa un ligero episodio de desaturación durante la sesión
                que se recupera espontáneamente. La tendencia general de los
                signos vitales es estable. Se debe vigilar la frecuencia
                cardíaca, que muestra oscilaciones al final de la sesión.
              </Typography>
            </Box>

            <Box
              sx={{
                mb: 2,
                pb: 2,
                borderBottom: `1px solid ${COLORS.gridLine}`,
              }}
            >
              <Typography variant="subtitle1" fontWeight="bold">
                Sesión #6 - 15/02/2024
              </Typography>
              <Typography
                variant="body2"
                color="text.secondary"
                sx={{ fontStyle: "italic", mb: 1 }}
              >
                Dr. Martínez - 16/02/2024
              </Typography>
              <Typography variant="body1">
                Los parámetros cardiorrespiratorios se mantienen dentro de
                límites normales durante toda la sesión. El tratamiento muestra
                buenos resultados y la tolerancia a la actividad física ha
                mejorado considerablemente desde la sesión anterior.
              </Typography>
            </Box>

            <Box>
              <Typography variant="subtitle1" fontWeight="bold">
                Sesión #3 - 01/02/2024
              </Typography>
              <Typography
                variant="body2"
                color="text.secondary"
                sx={{ fontStyle: "italic", mb: 1 }}
              >
                Dra. Gómez - 02/02/2024
              </Typography>
              <Typography variant="body1">
                La paciente presenta frecuencia cardíaca elevada durante parte
                de la sesión, lo que sugiere una respuesta exagerada al
                ejercicio. Se recomienda ajustar la intensidad de la actividad
                física y monitorizar de cerca la respuesta cardiovascular en las
                próximas sesiones.
              </Typography>
            </Box>
          </Box>
        </DialogContent>
        <DialogActions sx={{ p: 2, borderTop: `1px solid ${COLORS.gridLine}` }}>
          <Button
            onClick={() => setObservationsHistoryOpen(false)}
            sx={{ color: COLORS.primary }}
          >
            Cerrar
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default LightDashboard;

// NOTA: Estos son datos dummy que reemplazan la conexión al servidor FHIR
const dummyPatient = {
  id: "dummy-patient-001",
  name: [
    {
      given: ["Carmen"],
      family: "de las Mercedes Garrido Morales",
    },
  ],
  birthDate: "1948-06-10",
  gender: "female",
  address: [
    {
      line: ["Calle Principal 123"],
      city: "Ciudad Ejemplo",
      postalCode: "12345",
    },
  ],
  telecom: [
    {
      system: "phone",
      value: "+56 9 1234 5678",
    },
    {
      system: "email",
      value: "correo@correo.com",
    },
  ],
  identifier: [
    {
      system: "RUT",
      value: "5.357.244-8",
    },
  ],
};
// NOTA: Estos son datos dummy que reemplazan los encuentros del servidor FHIR
const dummyEncounters = [
  {
    id: "enc-001",
    period: { start: "2024-03-15T10:00:00Z" },
    type: [{ text: "Consulta de rutina" }],
    status: "finished",
  },
  {
    id: "enc-002",
    period: { start: "2024-03-10T15:30:00Z" },
    type: [{ text: "Control de signos vitales" }],
    status: "finished",
  },
];
// NOTA: Estos son datos dummy que reemplazan los cuestionarios del servidor FHIR
const dummyQuestionnaires = [
  {
    id: "q-001",
    title: "Evaluación de síntomas",
    date: "2024-03-15",
    status: "completed",
  },
  {
    id: "q-002",
    title: "Escala de dolor",
    date: "2024-03-10",
    status: "completed",
  },
];
