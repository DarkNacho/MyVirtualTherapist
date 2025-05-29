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
  Select,
  MenuItem,
  SelectChangeEvent,
} from "@mui/material";
import { useState } from "react";
import HandleResult from "../../../Utils/HandleResult";
import AutoCompleteComponent from "../../../Components/auto-complete-components/AutoCompleteComponent";
import { Encounter } from "fhir/r4";
import EncounterUtils from "../../../Services/Utils/EncounterUtils";

interface ReportModalProps {
  open: boolean;
  handleClose: () => void;
  patientId: string;
  encounterId?: string;
}

const dateFilterOptions = [
  { value: "all", label: "Todo" },
  { value: "session", label: "Sesión" },
  { value: "week", label: "Semana" },
  { value: "month", label: "Mes" },
  { value: "range", label: "Rango personalizado" },
];

export default function PatientReportModal({
  open,
  handleClose,
  patientId,
  encounterId,
}: ReportModalProps) {
  const [reportOptions, setReportOptions] = useState({
    clinic: false,
    sensor: false,
    med: false,
    cond: false,
    questionnaire: false,
  });

  const [excludedSensorTypes, setExcludedSensorTypes] = useState({
    Temperatura: false,
    sensor2: false,
    sensor3: false,
  });
  const [selectedEncounter, setSelectedEncounter] = useState<{
    id: string;
    display: string;
  } | null>(null);

  const [dateFilter, setDateFilter] = useState("all");
  const [timeRange, setTimeRange] = useState({ start: "", end: "" });

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

  function getEncounterDisplay(resource: Encounter): string {
    return `Profesional: ${EncounterUtils.getPrimaryPractitioner(
      resource
    )} -- ${EncounterUtils.getFormatPeriod(resource.period!)}`;
  }

  // Correct type for MUI Select onChange
  const handleDateFilterChange = (event: SelectChangeEvent<string>) => {
    setDateFilter(event.target.value as string);
  };

  const downloadReport = async (): Promise<Result<Blob>> => {
    // Convert boolean values to strings
    const stringifiedOptions = Object.entries(reportOptions).reduce(
      (acc, [key, value]) => {
        acc[key] = String(value);
        return acc;
      },
      {} as Record<string, string>
    );

    stringifiedOptions.date_filter = dateFilter;
    if (dateFilter === "range") {
      if (timeRange.start) stringifiedOptions.start = timeRange.start;
      if (timeRange.end) stringifiedOptions.end = timeRange.end;
    }

    if (dateFilter === "session") {
      // Usa el encounter seleccionado por el usuario, o el que viene por props
      if (selectedEncounter?.id)
        stringifiedOptions.encounter_id = selectedEncounter.id;
      else if (encounterId) stringifiedOptions.encounter_id = encounterId;
    } else if (encounterId) {
      stringifiedOptions.encounter_id = encounterId;
    }
    const queryParams = new URLSearchParams(stringifiedOptions);

    Object.entries(excludedSensorTypes).forEach(([sensor, isExcluded]) => {
      if (isExcluded) {
        queryParams.append("excluded_sensor_types", sensor);
      }
    });

    const downloadUrl = `${
      import.meta.env.VITE_SERVER_URL
    }/report/${patientId}?${queryParams.toString()}`;

    try {
      const response = await fetch(downloadUrl, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("access_token")}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        return { success: false, error: "Error al generar el Reporte" };
        throw new Error("Network response was not ok");
      }

      const blob = await response.blob();
      const blobUrl = window.URL.createObjectURL(blob);

      // Obtener el nombre del archivo desde el encabezado Content-Disposition
      const contentDisposition = response.headers.get("Content-Disposition");
      let fileName = "downloaded_file.pdf"; // Nombre por defecto
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
      return { success: true, data: blob };
    } catch (error) {
      let errorMessage = "Error al descargar el archivo";
      if (error instanceof Error) {
        errorMessage = error.message;
      }
      console.error("Download failed:", error);
      return {
        success: false,
        error: errorMessage,
      };
    }
  };

  const handleDownload = async () => {
    await HandleResult.handleOperation(
      downloadReport,
      "Informe generado correctamente",
      "Generando informe..."
    );
    //await downloadReport();
    handleClose();
  };

  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle>Seleccione las opciones para el informe</DialogTitle>
      <DialogContent>
        <FormControlLabel
          control={
            <Checkbox
              checked={reportOptions.clinic}
              onChange={handleCheckboxChange}
              name="clinic"
            />
          }
          label="Evoluciones"
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
              checked={reportOptions.questionnaire}
              onChange={handleCheckboxChange}
              name="questionnaire"
            />
          }
          label="Evaluaciones"
        />
        <div style={{ marginTop: 16, marginBottom: 8 }}>
          <Typography variant="subtitle1">Filtrar por fecha:</Typography>
          <Select
            value={dateFilter}
            onChange={handleDateFilterChange}
            fullWidth
          >
            {dateFilterOptions.map((opt) => (
              <MenuItem key={opt.value} value={opt.value}>
                {opt.label}
              </MenuItem>
            ))}
          </Select>
        </div>
        {dateFilter === "range" && (
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
              sx={{ marginRight: 2, marginBottom: 2 }}
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
              sx={{ marginBottom: 2 }}
            />
          </div>
        )}
        {dateFilter === "session" && (
          <div style={{ marginTop: 16, marginBottom: 8 }}>
            <AutoCompleteComponent<Encounter>
              resourceType={"Encounter"}
              label={"Selecciona Encuentro"}
              getDisplay={getEncounterDisplay}
              defaultResourceId={encounterId}
              defaultParams={{ subject: patientId, _count: 99999 }}
              searchParam={""}
              onChange={(selectedObject) => {
                if (selectedObject) {
                  setSelectedEncounter({
                    id: selectedObject.id!,
                    display: getEncounterDisplay(selectedObject),
                  });
                } else {
                  setSelectedEncounter(null);
                }
              }}
              readOnly={Boolean(encounterId)}
              textFieldProps={{}}
            />
          </div>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Cancelar</Button>
        <Button onClick={handleDownload} variant="contained" color="primary">
          Descargar
        </Button>
      </DialogActions>
    </Dialog>
  );
}
