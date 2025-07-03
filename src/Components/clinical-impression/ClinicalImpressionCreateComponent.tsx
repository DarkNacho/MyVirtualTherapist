import { SubmitHandler } from "react-hook-form";
import {
  Button,
  Container,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  CircularProgress,
} from "@mui/material";

import { Close } from "@mui/icons-material";

import styles from "./ClinicalImpressionCreateComponent.module.css";
import { ClinicalImpression, DocumentReference } from "fhir/r4";
import ClinicalImpressionFormComponent from "./ClinicalImpressionFormComponent";
import { ClinicalImpressionFormData } from "../../Models/Forms/ClinicalImpressionForm";
import { isAdminOrPractitioner } from "../../Utils/RolUser";
import ClinicalImpressionUtils from "../../Services/Utils/ClinicalImpression";
import HandleResult from "../../Utils/HandleResult";
import FhirResourceService from "../../Services/FhirService";
import UploadFileComponent, {
  UploadFileComponentRef,
} from "../FileManager/UploadFileComponent";
import { useEffect, useRef, useState } from "react";

export default function ClinicalImpressionCreateComponent({
  patientId,
  encounterId,
  onOpen,
  isOpen,
  clinicalImpression,
}: {
  patientId: string;
  onOpen: (isOpen: boolean) => void;
  isOpen: boolean;
  encounterId?: string;
  clinicalImpression?: ClinicalImpression;
}) {
  const handleClose = () => {
    onOpen(false);
  };

  const practitionerId = isAdminOrPractitioner()
    ? localStorage.getItem("id") || undefined
    : undefined;

  const uploadRef = useRef<UploadFileComponentRef>(null);

  const [loading, setLoading] = useState<boolean>(false);
  const [formInitData, setFormInitData] = useState<
    ClinicalImpressionFormData | undefined
  >(undefined);

  useEffect(() => {
    const initForm = async () => {
      setLoading(true);
      if (isOpen && clinicalImpression) {
        console.log("Cargando ClinicalImpression desde props");
        ClinicalImpressionUtils.ClinicalImpressionToClinicalImpressionFormData(
          clinicalImpression,
          false
        ).then((data) => {
          setFormInitData(data);
          setLoading(false);
          console.log("ClinicalImpressionFormData inicial:", data);
        });
      } else if (isOpen && !clinicalImpression) {
        setFormInitData(undefined); // Limpia el formulario si es nuevo
        setLoading(false);
      }
    };
    initForm();
  }, [clinicalImpression, isOpen]);

  const handleDelete = async () => {
    if (!clinicalImpression) {
      return;
    }

    const confirmed = await HandleResult.confirm(
      "¿Estás seguro de que quieres eliminar esta evolución? Esta acción no se puede deshacer.\n Los archivos asociados también no se eliminarán automáticamente."
    );
    if (!confirmed) {
      return;
    }

    const response = await HandleResult.handleOperation(
      () =>
        FhirResourceService.getInstance<ClinicalImpression>(
          "ClinicalImpression"
        ).deleteResource(clinicalImpression.id!),
      "Evolución eliminada de forma exitosa",
      "Eliminando..."
    );
    if (response.success) {
      handleClose();
    }
  };

  const onSubmitForm: SubmitHandler<ClinicalImpressionFormData> = async (
    data
  ) => {
    let supportingInfoFiles: DocumentReference | undefined = undefined;

    console.log("===> onSubmitForm called");
    console.log("Archivos seleccionados:", uploadRef.current?.hasFiles?.());
    console.log(
      "DocumentReference actual:",
      uploadRef.current?.getDocumentReference?.()
    );

    if (
      uploadRef.current &&
      uploadRef.current.hasFiles &&
      uploadRef.current.hasFiles() &&
      !uploadRef.current.getDocumentReference()
    ) {
      console.log("===> Subiendo archivos...");
      const result = await uploadRef.current.uploadAllFiles();
      console.log("Resultado de uploadAllFiles:", result);
      if (!result?.success || !result.data) {
        console.error("Error al subir archivos o no hay data en el resultado");
        return;
      }
      supportingInfoFiles = result.data;
    } else if (
      uploadRef.current &&
      uploadRef.current.getDocumentReference &&
      uploadRef.current.getDocumentReference()
    ) {
      console.log("===> Ya hay DocumentReference disponible");
      supportingInfoFiles = uploadRef.current.getDocumentReference();
    } else {
      console.log(
        "===> No hay archivos para subir o no se requiere DocumentReference"
      );
    }
    console.log("DocumentReference a enviar:", supportingInfoFiles);

    const newClinicalImpression =
      ClinicalImpressionUtils.ClinicalImpressionFormDataToClinicalImpression(
        data,
        supportingInfoFiles
      );

    if (clinicalImpression) newClinicalImpression.id = clinicalImpression.id;

    console.log("ClinicalImpressionFormData:", data);
    console.log("ClinicalImpression a enviar:", newClinicalImpression);

    sendClinicalImpression(newClinicalImpression);
  };

  const sendClinicalImpression = async (
    newClinicalImpression: ClinicalImpression
  ) => {
    const response = await HandleResult.handleOperation(
      () =>
        FhirResourceService.getInstance<ClinicalImpression>(
          "ClinicalImpression"
        ).sendResource(newClinicalImpression),
      "Evolución guardada de forma exitosa",
      "Enviando..."
    );
    if (response.success) handleClose();
  };

  return (
    <div>
      <Dialog open={isOpen} onClose={handleClose} fullWidth maxWidth="md">
        <DialogTitle className={styles.dialogTitle}>
          Añadir Evolución
          <IconButton
            aria-label="close"
            onClick={handleClose}
            sx={{
              color: "white",
              backgroundColor: "#7e94ff",
              "&:hover": { backgroundColor: "red" },
            }}
          >
            <Close />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          <Container className={styles.container}>
            {loading ? (
              <CircularProgress />
            ) : (
              <>
                <ClinicalImpressionFormComponent
                  formId="form"
                  patientId={patientId}
                  practitionerId={practitionerId}
                  submitForm={onSubmitForm}
                  readOnly={false}
                  encounterId={encounterId}
                  clinicalImpression={formInitData}
                />
              </>
            )}
            <UploadFileComponent
              ref={uploadRef}
              subject={{ reference: `Patient/${patientId}` }}
              author={{ reference: `Practitioner/${practitionerId}` }}
              documentReferenceId={
                clinicalImpression?.supportingInfo?.[0]?.reference?.split(
                  "/"
                )[1] || undefined
              }
            />
          </Container>
        </DialogContent>
        <DialogActions className={styles.dialogActions}>
          <Button
            onClick={handleDelete}
            variant="contained"
            color="error"
            sx={{ marginRight: "auto" }}
          >
            Borrar
          </Button>
          <Button onClick={handleClose} variant="contained" color="error">
            Cancelar
          </Button>
          <Button type="submit" variant="contained" color="primary" form="form">
            Enviar
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
