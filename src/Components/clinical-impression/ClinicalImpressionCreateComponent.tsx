import { SubmitHandler } from "react-hook-form";
import {
  Button,
  Container,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
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

export default function ClinicalImpressionCreateComponent({
  patientId,
  encounterId,
  onOpen,
  isOpen,
}: {
  patientId: string;
  onOpen: (isOpen: boolean) => void;
  isOpen: boolean;
  encounterId?: string;
}) {
  const handleClose = () => {
    onOpen(false);
  };

  const practitionerId = isAdminOrPractitioner()
    ? localStorage.getItem("id") || undefined
    : undefined;

  const onSubmitForm: SubmitHandler<ClinicalImpressionFormData> = async (
    data
  ) => {
    let supportingInfoFiles: DocumentReference[] = [];

    // upload supporting info files if they exist
    if (data.supportingInfo && data.supportingInfo.length > 0) {
      const supportingInfoFilesResult = await HandleResult.handleOperation(
        () => sendSupportingInfoFiles(data.supportingInfo),
        "Archivos subidos correctamente",
        "Subiendo archivos..."
      );
      if (!supportingInfoFilesResult.success) {
        console.error(
          "Error uploading supporting info files:",
          supportingInfoFilesResult.error
        );
        return;
      }
      supportingInfoFiles =
        supportingInfoFilesResult.data as DocumentReference[];
    }

    const newClinicalImpression =
      ClinicalImpressionUtils.ClinicalImpressionFormDataToClinicalImpression(
        data,
        supportingInfoFiles
      );

    console.log("ClinicalImpressionFormData", data);
    console.log("ClinicalImpression", newClinicalImpression);
    sendClinicalImpression(newClinicalImpression);

    //sendObservation(data);
  };

  const sendSupportingInfoFiles = async (
    files: FileList | undefined
  ): Promise<Result<DocumentReference[]>> => {
    if (!files || files.length === 0) return { success: true, data: [] };
    try {
      const documentReferences =
        await ClinicalImpressionUtils.uploadSupportingInfoFiles(files);
      return { success: true, data: documentReferences };
    } catch (error) {
      console.error("Error uploading supporting info files:", error);
      return {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : String(error) || "Error uploading files",
      };
    }
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
            <ClinicalImpressionFormComponent
              formId="form"
              patientId={patientId}
              practitionerId={practitionerId}
              submitForm={onSubmitForm}
              readOnly={false}
              encounterId={encounterId}
            ></ClinicalImpressionFormComponent>
          </Container>
        </DialogContent>
        <DialogActions className={styles.dialogActions}>
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
