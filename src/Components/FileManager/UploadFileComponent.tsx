import { useState } from "react";
import { DocumentReference, Reference } from "fhir/r4";
import getFileIconInfo from "./getFileIconInfo";
import CircularProgress from "@mui/material/CircularProgress";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import ErrorIcon from "@mui/icons-material/Error";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import {
  Delete as DeleteIcon,
  Visibility as VisibilityIcon,
} from "@mui/icons-material";
import {
  Box,
  Button,
  Card,
  CardContent,
  Grid,
  IconButton,
  Stack,
  Typography,
} from "@mui/material";
import { useDropzone } from "react-dropzone";
import styles from "./FileManager.module.css";
import FhirResourceService from "../../Services/FhirService";
import FileManager from "../../Services/FileManager";

function formatBytes(bytes: number, decimals = 2) {
  if (bytes === 0) return "0 Bytes";
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ["Bytes", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + " " + sizes[i];
}

export default function UploadFileComponent({
  subject,
  author,
}: {
  subject?: Reference;
  author?: Reference;
}) {
  const [files, setFiles] = useState<File[]>([]);
  const [uploading, setUploading] = useState<{ [key: string]: boolean }>({});
  const [successUpload, setSuccessUpload] = useState<{
    [key: string]: boolean;
  }>({});
  const [errorUpload, setErrorUpload] = useState<{
    [key: string]: string;
  }>({});

  const handleFileChange = (newFiles: File[]) => {
    if (Object.values(successUpload).every((status) => status)) {
      // Reset state if all files were successfully uploaded
      setFiles(newFiles);
      setUploading({});
      setSuccessUpload({});
      setErrorUpload({});
    } else {
      setFiles(newFiles);
    }
  };

  const handleFileUpload = async (file: File, index: number) => {
    setUploading((prev) => ({ ...prev, [index]: true }));

    const response = await HandleUpload(file);
    if (!response.success)
      setErrorUpload((prev) => ({ ...prev, [index]: response.error }));

    setUploading((prev) => ({ ...prev, [index]: false }));
    setSuccessUpload((prev) => ({ ...prev, [index]: response.success }));
  };

  const HandleUpload = async (
    file: File
  ): Promise<Result<DocumentReference>> => {
    if (!file) {
      return {
        success: false,
        error: "Por favor selecciona un archivo primero",
      };
    }

    console.log("Uploading file", file);

    const fhirService =
      FhirResourceService.getInstance<DocumentReference>("DocumentReference");

    const document = await FileManager.fileToDocumentReference(file);
    document.subject = subject;
    document.author = [author || {}];

    return fhirService.sendResource(document);
  };

  const handleFileRemove = (event: React.MouseEvent, index: number) => {
    event.stopPropagation();
    setFiles(files.filter((_, i) => i !== index));
  };

  const uploadAllFiles = async () => {
    setErrorUpload({});
    setSuccessUpload({});
    files.forEach((file, index) => handleFileUpload(file, index));
  };

  const { getRootProps, getInputProps } = useDropzone({
    onDrop: handleFileChange,
  });

  const isUploading = Object.values(uploading).some((status) => status);

  return (
    <Box p={10}>
      <section {...getRootProps()} className={styles.dropzone}>
        <Stack>
          <input {...getInputProps()} />
          <Button variant="outlined" disabled={isUploading}>
            <CloudUploadIcon />
          </Button>
        </Stack>
        <Stack className="filesContainer">
          <Grid container spacing={2}>
            {files.map((file, index) => (
              <Grid item xs={12} sm={6} md={4} lg={3} key={index}>
                <Card key={index} className={styles.card}>
                  <CardContent className={styles.cardContent}>
                    {uploading[index] && (
                      <Box className={styles.uploading}>
                        <CircularProgress />
                      </Box>
                    )}
                    {errorUpload[index] && (
                      <Box>
                        <ErrorIcon color="error" />
                        <Typography color="error">
                          {errorUpload[index]}
                        </Typography>
                      </Box>
                    )}
                    {successUpload[index] && (
                      <Box>
                        <CheckCircleIcon color="primary" />
                        <Typography color="primary">
                          Subido exitosamente
                        </Typography>
                      </Box>
                    )}

                    <Box className={styles.box}>
                      <Typography variant="body1" component="div">
                        {file.name}
                      </Typography>
                      <Typography variant="body2" component="div">
                        {formatBytes(file.size)}
                      </Typography>

                      {getFileIconInfo(file.type).icon}
                    </Box>
                    <Box className={`options ${styles.options}`}>
                      {!successUpload[index] && !isUploading && (
                        <IconButton
                          onClick={(event) => handleFileRemove(event, index)}
                        >
                          <DeleteIcon />
                        </IconButton>
                      )}
                      <IconButton
                        onClick={() =>
                          window.open(
                            URL.createObjectURL(file),
                            "_blank",
                            "noopener,noreferrer"
                          )
                        }
                      >
                        <VisibilityIcon />
                      </IconButton>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Stack>
      </section>
      <Stack>
        <Button
          variant="contained"
          onClick={uploadAllFiles}
          disabled={
            isUploading ||
            files.length === 0 ||
            Object.values(successUpload).length === files.length
          }
        >
          Subir Archivos y Guardar Documentos
        </Button>
      </Stack>
    </Box>
  );
}
