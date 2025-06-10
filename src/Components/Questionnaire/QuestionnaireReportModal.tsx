import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControlLabel,
  Checkbox,
  Button,
} from "@mui/material";
import { useState } from "react";

interface QuestionnaireReportModalProps {
  open: boolean;
  handleClose: () => void;
  questionnaireResponseId: string;
}

export default function QuestionnaireReportModal({
  open,
  handleClose,
  questionnaireResponseId,
}: QuestionnaireReportModalProps) {
  const [reportOptions, setReportOptions] = useState({
    includeBarChart: false,
    includePieChart: false,
    includeLineChart: false,
  });

  const handleCheckboxChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = event.target;
    setReportOptions((prev) => ({ ...prev, [name]: checked }));
  };

  const downloadReport = async (): Promise<void> => {
    const queryParams = new URLSearchParams({
      include_bar_chart: String(reportOptions.includeBarChart),
      include_pie_chart: String(reportOptions.includePieChart),
      include_line_chart: String(reportOptions.includeLineChart),
    });

    const downloadUrl = `${
      import.meta.env.VITE_SERVER_URL
    }/report/questionnaire/${questionnaireResponseId}/?${queryParams.toString()}`;

    try {
      const response = await fetch(downloadUrl, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("access_token")}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const blob = await response.blob();
      const blobUrl = window.URL.createObjectURL(blob);
      const contentDisposition = response.headers.get("Content-Disposition");
      let fileName = "report.pdf";

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
              checked={reportOptions.includeBarChart}
              onChange={handleCheckboxChange}
              name="includeBarChart"
            />
          }
          label="Incluir Gráfico de Barras"
        />
        <FormControlLabel
          control={
            <Checkbox
              checked={reportOptions.includePieChart}
              onChange={handleCheckboxChange}
              name="includePieChart"
            />
          }
          label="Incluir Gráfico de Pastel"
        />
        <FormControlLabel
          control={
            <Checkbox
              checked={reportOptions.includeLineChart}
              onChange={handleCheckboxChange}
              name="includeLineChart"
            />
          }
          label="Incluir Gráfico de Líneas"
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Cancelar</Button>
        <Button onClick={handleDownload}>Descargar</Button>
      </DialogActions>
    </Dialog>
  );
}
