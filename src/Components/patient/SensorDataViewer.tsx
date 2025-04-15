import React, { useEffect, useState } from "react";
import {
  Box,
  Card,
  CardContent,
  Typography,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Tabs,
  Tab,
  Skeleton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

interface SensorSummary {
  min: number | null;
  max: number | null;
  avg: number | null;
  median: number | null;
  stddev: number | null;
  count: number;
}

interface SensorProgress {
  time_periods: string[];
  min_values: number[];
  max_values: number[];
  avg_values: number[];
  median_values: number[];
}

interface SensorDataViewerProps {
  patientId?: string; // Patient ID passed as a prop (optional to handle undefined)
}

const SensorDataViewer: React.FC<SensorDataViewerProps> = ({ patientId }) => {
  const [timeGrouping, setTimeGrouping] = useState<"day" | "week" | "month">(
    "week"
  );
  const [sensorSummary, setSensorSummary] = useState<
    Record<string, SensorSummary>
  >({});
  const [sensorProgress, setSensorProgress] = useState<
    Record<string, SensorProgress>
  >({});
  const [loading, setLoading] = useState<boolean>(false);
  const [selectedSensor, setSelectedSensor] = useState<string | null>(null);

  const baseUrl = import.meta.env.VITE_SERVER_URL; // Use environment variable for base URL

  // Fetch historical sensor summary
  const fetchSensorSummary = async () => {
    if (!patientId) return; // Ensure patientId is defined
    try {
      setLoading(true);
      const response = await fetch(
        `${baseUrl}/report/sensors/${patientId}/summary`
      );
      if (!response.ok) {
        throw new Error(
          `Error fetching sensor summary: ${response.statusText}`
        );
      }
      const data = await response.json();
      setSensorSummary(data);
    } catch (error) {
      console.error("Error fetching sensor summary:", error);
    } finally {
      setLoading(false);
    }
  };

  // Fetch sensor progress over time
  const fetchSensorProgress = async () => {
    if (!patientId) return; // Ensure patientId is defined
    try {
      setLoading(true);
      const response = await fetch(
        `${baseUrl}/report/sensors/${patientId}/progress?time_grouping=${timeGrouping}`
      );
      if (!response.ok) {
        throw new Error(
          `Error fetching sensor progress: ${response.statusText}`
        );
      }
      const data = await response.json();
      setSensorProgress(data);
      setSelectedSensor(Object.keys(data)[0] || null); // Default to the first sensor
    } catch (error) {
      console.error("Error fetching sensor progress:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (patientId) {
      fetchSensorSummary();
      fetchSensorProgress();
    }
  }, [patientId, timeGrouping]);

  const handleTabChange = (event: React.SyntheticEvent, newValue: string) => {
    setSelectedSensor(newValue);
  };

  const getChartData = (sensor: string) => {
    const progress = sensorProgress[sensor];
    return {
      labels: progress.time_periods,
      datasets: [
        {
          label: "Min",
          data: progress.min_values,
          borderColor: "rgb(75, 192, 192)",
          backgroundColor: "rgba(75, 192, 192, 0.2)",
          tension: 0.4,
        },
        {
          label: "Max",
          data: progress.max_values,
          borderColor: "rgb(255, 99, 132)",
          backgroundColor: "rgba(255, 99, 132, 0.2)",
          tension: 0.4,
        },
        {
          label: "Avg",
          data: progress.avg_values,
          borderColor: "rgb(54, 162, 235)",
          backgroundColor: "rgba(54, 162, 235, 0.2)",
          tension: 0.4,
        },
        {
          label: "Median",
          data: progress.median_values,
          borderColor: "rgb(153, 102, 255)",
          backgroundColor: "rgba(153, 102, 255, 0.2)",
          tension: 0.4,
        },
      ],
    };
  };

  return (
    <Box sx={{ padding: 4 }}>
      <Typography variant="h4" gutterBottom>
        Sensor Data Viewer
      </Typography>

      {/* Loading Indicator */}
      {loading ? (
        <>
          <Skeleton
            variant="rectangular"
            height={200}
            sx={{ marginBottom: 4 }}
          />
          <Skeleton variant="rectangular" height={200} />
        </>
      ) : (
        <>
          {/* Historical Sensor Summary */}
          <Card sx={{ marginBottom: 4 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Historical Sensor Summary
              </Typography>
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Sensor Type</TableCell>
                      <TableCell>Min</TableCell>
                      <TableCell>Max</TableCell>
                      <TableCell>Avg</TableCell>
                      <TableCell>Median</TableCell>
                      <TableCell>StdDev</TableCell>
                      <TableCell>Count</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {Object.entries(sensorSummary).map(
                      ([sensorType, summary]) => (
                        <TableRow key={sensorType}>
                          <TableCell>{sensorType}</TableCell>
                          <TableCell>{summary.min}</TableCell>
                          <TableCell>{summary.max}</TableCell>
                          <TableCell>{summary.avg}</TableCell>
                          <TableCell>{summary.median}</TableCell>
                          <TableCell>{summary.stddev}</TableCell>
                          <TableCell>{summary.count}</TableCell>
                        </TableRow>
                      )
                    )}
                  </TableBody>
                </Table>
              </TableContainer>
            </CardContent>
          </Card>
          {/* Time Grouping Selector */}
          <FormControl fullWidth sx={{ marginBottom: 2 }}>
            <InputLabel>Time Grouping</InputLabel>
            <Select
              value={timeGrouping}
              onChange={(e) =>
                setTimeGrouping(e.target.value as "day" | "week" | "month")
              }
              label="Time Grouping"
            >
              <MenuItem value="day">Day</MenuItem>
              <MenuItem value="week">Week</MenuItem>
              <MenuItem value="month">Month</MenuItem>
            </Select>
          </FormControl>
          {/* Sensor Tabs */}
          <Card sx={{ marginBottom: 4 }}>
            <CardContent>
              <Tabs
                value={selectedSensor}
                onChange={handleTabChange}
                variant="scrollable"
                scrollButtons="auto"
              >
                {Object.keys(sensorProgress).map((sensorType) => (
                  <Tab key={sensorType} label={sensorType} value={sensorType} />
                ))}
              </Tabs>
            </CardContent>
          </Card>

          {/* Sensor Chart */}
          {selectedSensor && sensorProgress[selectedSensor] && (
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  {selectedSensor} Progress Over Time
                </Typography>
                <Line
                  data={getChartData(selectedSensor)}
                  options={{
                    responsive: true,
                    plugins: {
                      legend: {
                        position: "top",
                      },
                      title: {
                        display: true,
                        text: `${selectedSensor} Data`,
                      },
                    },
                  }}
                />
              </CardContent>
            </Card>
          )}
        </>
      )}
    </Box>
  );
};

export default SensorDataViewer;
