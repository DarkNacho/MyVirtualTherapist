import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControlLabel,
  Checkbox,
  FormGroup,
  TextField,
  Button,
  Typography,
} from "@mui/material";
import { useState } from "react";

interface ReportModalProps {
  open: boolean;
  handleClose: () => void;
  patientId: string;
}

export default function PatientReportModal({
  open,
  handleClose,
  patientId,
}: ReportModalProps) {
  const [reportOptions, setReportOptions] = useState({
    obs: false,
    sensor: false,
    med: false,
    cond: false,
  });

  const [excludedSensorTypes, setExcludedSensorTypes] = useState({
    Temperatura: false,
    sensor2: false,
    sensor3: false,
  });
  const [isTimeRange, setIsTimeRange] = useState(false);
  const [timeRange, setTimeRange] = useState({ start: "", end: "" });

  const toggleTimeRange = () => {
    setIsTimeRange((prev) => !prev);
  };

  const handleCheckboxChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = event.target;
    setReportOptions((prev) => ({ ...prev, [name]: checked }));
  };

  const handleSensorCheckboxChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { name, checked } = event.target;
    setExcludedSensorTypes((prev) => ({
      ...prev,
      [name]: checked,
    }));
  };

  const handleTimeRangeChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { name, value } = event.target;
    setTimeRange((prevRange) => ({
      ...prevRange,
      [name]: value,
    }));
  };

  const downloadReport = async (): Promise<void> => {
    // Convert boolean values to strings
    const stringifiedOptions = Object.entries(reportOptions).reduce(
      (acc, [key, value]) => {
        acc[key] = String(value);
        return acc;
      },
      {} as Record<string, string>
    );

    if (timeRange.start)
      stringifiedOptions.start = new Date(timeRange.start).toISOString();
    if (timeRange.end)
      stringifiedOptions.end = new Date(timeRange.end).toISOString();

    const queryParams = new URLSearchParams(stringifiedOptions);

    Object.entries(excludedSensorTypes).forEach(([sensor, isExcluded]) => {
      if (isExcluded) {
        queryParams.append("excluded_sensor_types", sensor);
      }
    });

    const downloadUrl = `${
      import.meta.env.VITE_SERVER_URL
    }/report/${patientId}?${queryParams.toString()}`;

    console.log("Download URL:", downloadUrl);
    try {
      const response = await fetch(downloadUrl, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("access_token")}`, // Replace yourJWTTokenHere with the actual token
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const blob = await response.blob();
      const blobUrl = window.URL.createObjectURL(blob);

      // Obtener el nombre del archivo desde el encabezado Content-Disposition
      const contentDisposition = response.headers.get("Content-Disposition");
      let fileName = "downloaded_file.pdf"; // Nombre por defecto
      console.log("Content-Disposition:", contentDisposition);
      if (contentDisposition) {
        const fileNameMatch = contentDisposition.match(
          /filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/
        );
        if (fileNameMatch && fileNameMatch[1]) {
          fileName = fileNameMatch[1].replace(/['"]/g, "");
        }
      }

      const link = document.createElement("a");
      link.href = blobUrl;
      link.setAttribute("download", fileName);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error("Download failed:", error);
    }
  };

  const handleDownload = async () => {
    await downloadReport();
    handleClose();
  };

  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle>Seleccione las opciones para el informe</DialogTitle>
      <DialogContent>
        <FormControlLabel
          control={
            <Checkbox
              checked={reportOptions.obs}
              onChange={handleCheckboxChange}
              name="obs"
            />
          }
          label="Observaciones"
        />
        <FormControlLabel
          control={
            <Checkbox
              checked={reportOptions.sensor}
              onChange={handleCheckboxChange}
              name="sensor"
            />
          }
          label="Sensor"
        />
        {reportOptions.sensor && (
          <FormGroup row>
            <Typography variant="h6" gutterBottom>
              Sensores a excluir:
            </Typography>

            <FormControlLabel
              control={
                <Checkbox
                  checked={excludedSensorTypes.Temperatura}
                  onChange={handleSensorCheckboxChange}
                  name="Temperatura"
                />
              }
              label="Temperatura"
            />
            <FormControlLabel
              control={
                <Checkbox
                  checked={excludedSensorTypes.sensor2}
                  onChange={handleSensorCheckboxChange}
                  name="sensor2"
                />
              }
              label="Sensor 2"
            />
            <FormControlLabel
              control={
                <Checkbox
                  checked={excludedSensorTypes.sensor3}
                  onChange={handleSensorCheckboxChange}
                  name="sensor3"
                />
              }
              label="Sensor 3"
            />
          </FormGroup>
        )}
        <FormControlLabel
          control={
            <Checkbox
              checked={reportOptions.med}
              onChange={handleCheckboxChange}
              name="med"
            />
          }
          label="Medicación"
        />
        <FormControlLabel
          control={
            <Checkbox
              checked={reportOptions.cond}
              onChange={handleCheckboxChange}
              name="cond"
            />
          }
          label="Condición"
        />
        <FormControlLabel
          control={
            <Checkbox
              checked={isTimeRange}
              onChange={toggleTimeRange}
              name="isTimeRange"
            />
          }
          label="Rango de Tiempo"
        />
        {isTimeRange && (
          <div>
            <TextField
              label="Inicio"
              type="datetime-local"
              name="start"
              value={timeRange.start}
              onChange={handleTimeRangeChange}
              InputLabelProps={{
                shrink: true,
              }}
            />
            <TextField
              label="Fin"
              type="datetime-local"
              name="end"
              value={timeRange.end}
              onChange={handleTimeRangeChange}
              InputLabelProps={{
                shrink: true,
              }}
            />
          </div>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Cancelar</Button>
        <Button onClick={handleDownload}>Descargar</Button>
      </DialogActions>
    </Dialog>
  );
}
