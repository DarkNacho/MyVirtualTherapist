import {
  ForwardedRef,
  forwardRef,
  useEffect,
  useImperativeHandle,
  useState,
} from "react";
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
  Skeleton,
  Stack,
  Typography,
} from "@mui/material";
import { useDropzone } from "react-dropzone";
import styles from "./FileManager.module.css";

import FileManager from "../../Services/FileManager";
import FhirResourceService from "../../Services/FhirService";

function formatBytes(bytes: number, decimals = 2) {
  if (bytes === 0) return "0 Bytes";
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ["Bytes", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + " " + sizes[i];
}

export interface UploadFileComponentRef {
  uploadAllFiles: () => Promise<Result<DocumentReference> | null>;
  isUploading: () => boolean;
  getUploadResult: () => Result<DocumentReference> | null;
  getDocumentReference: () => DocumentReference | undefined;
  hasFiles: () => boolean;
}

const UploadFileComponent = forwardRef(function UploadFileComponent(
  {
    subject,
    author,
    onUploadResult,
    documentReferenceId,
  }: {
    subject?: Reference;
    author: Reference;
    onUploadResult?: (result: Result<DocumentReference> | null) => void;
    documentReferenceId?: string; // Optional, if you want to update an existing DocumentReference
  },
  ref: ForwardedRef<UploadFileComponentRef>
) {
  const [files, setFiles] = useState<File[]>([]);
  const [uploading, setUploading] = useState(false);
  const [successUpload, setSuccessUpload] = useState(false);
  const [errorUpload, setErrorUpload] = useState<string | null>(null);
  const [uploadResult, setUploadResult] =
    useState<Result<DocumentReference> | null>(null);

  const [loadingFiles, setLoadingFiles] = useState(false);

  useEffect(() => {
    if (documentReferenceId) {
      fetchDocumentReference();
    }
  }, [documentReferenceId]);

  useImperativeHandle(ref, () => ({
    uploadAllFiles,
    isUploading: () => uploading,
    getUploadResult: () => uploadResult,
    getDocumentReference: () =>
      uploadResult?.success ? uploadResult.data : undefined,
    hasFiles: () => files.length > 0,
  }));

  const handleFileChange = (newFiles: File[]) => {
    setFiles((prevFiles) => {
      // Opcional: evitar archivos duplicados por nombre y tamaño
      const allFiles = [...prevFiles, ...newFiles];
      const uniqueFiles = Array.from(
        new Map(allFiles.map((f) => [f.name + f.size, f])).values()
      );
      return uniqueFiles;
    });
    setUploading(false);
    setSuccessUpload(false);
    setErrorUpload(null);
    setUploadResult(null);
    if (onUploadResult) onUploadResult(null);
  };

  const uploadAllFiles = async () => {
    setUploading(true);
    setSuccessUpload(false);
    setErrorUpload(null);

    const result = await FileManager.uploadFilesAsDocumentReference(
      documentReferenceId,
      files,
      subject,
      author
    );

    setUploading(false);
    setUploadResult(result);
    if (onUploadResult) onUploadResult(result);

    if (result.success) {
      setSuccessUpload(true);
    } else {
      setErrorUpload(result.error || "Error al subir archivos");
    }
    return result;
  };

  const handleFileRemove = (event: React.MouseEvent, index: number) => {
    event.stopPropagation();
    setFiles(files.filter((_, i) => i !== index));
  };

  const { getRootProps, getInputProps } = useDropzone({
    onDrop: handleFileChange,
  });

  const fetchDocumentReference = async () => {
    if (!documentReferenceId) return;

    try {
      setLoadingFiles(true);

      const fhirResource =
        FhirResourceService.getInstance<DocumentReference>("DocumentReference");

      /*
      const response = await HandleResult.handleOperation(
        () => fhirResource.getById(documentReferenceId),
        "Cargando Documentos",
        "No se pudo obtener los documentos"
      );
      */
      const response = await fhirResource.getById(documentReferenceId);

      if (!response.success) return;

      const files = FileManager.documentReferenceToFiles(response.data);
      setFiles(Array.from(files));
    } catch (error) {
      console.error("Error fetching DocumentReference:", error);
    } finally {
      setLoadingFiles(false);
    }
  };

  return (
    <Box p={10}>
      <section {...getRootProps()} className={styles.dropzone}>
        <Stack>
          <input {...getInputProps()} />
          <Button variant="outlined" disabled={uploading}>
            <CloudUploadIcon />
          </Button>
        </Stack>
        <Stack className="filesContainer">
          <Grid container spacing={2}>
            {loadingFiles
              ? Array.from({ length: 3 }).map((_, idx) => (
                  <Grid item xs={12} sm={6} md={4} lg={3} key={idx}>
                    <Card className={styles.card}>
                      <CardContent className={styles.cardContent}>
                        <Box className={styles.box}>
                          <Skeleton variant="circular" width={40} height={40} />
                          <Skeleton width="80%" />
                          <Skeleton width="60%" />
                        </Box>
                      </CardContent>
                    </Card>
                  </Grid>
                ))
              : files.map((file, index) => (
                  <Grid item xs={12} sm={6} md={4} lg={3} key={index}>
                    <Card key={index} className={styles.card}>
                      <CardContent className={styles.cardContent}>
                        {uploading && (
                          <Box className={styles.uploading}>
                            <CircularProgress />
                          </Box>
                        )}
                        {errorUpload && (
                          <Box>
                            <ErrorIcon color="error" />
                            <Typography color="error">{errorUpload}</Typography>
                          </Box>
                        )}
                        {successUpload && (
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
                          {!successUpload && !uploading && (
                            <IconButton
                              onClick={(event) =>
                                handleFileRemove(event, index)
                              }
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
          disabled={uploading || files.length === 0 || successUpload}
        >
          Subir Archivos y Guardar Documentos
        </Button>
      </Stack>
    </Box>
  );
});
export default UploadFileComponent;
