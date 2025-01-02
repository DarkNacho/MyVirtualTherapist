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
import { ClinicalImpression } from "fhir/r4";
import ClinicalImpressionFormComponent from "./ClinicalImpressionFormComponent";
import { ClinicalImpressionFormData } from "../../Models/Forms/ClinicalImpressionForm";
import { isAdminOrPractitioner } from "../../Utils/RolUser";

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

  const onSubmitForm: SubmitHandler<ClinicalImpressionFormData> = (data) => {
    //const newObservation =
    //  ObservationUtils.ObservationFormDataToObservation(data);
    console.log("ClinicalImpressionCreateComponent", data);

    //sendObservation(data);
  };

  const sendClinicalImpression = async (
    newClinicalImpression: ClinicalImpression
  ) => {
    /*const response = await HandleResult.handleOperation(
      () => new ObservationService().sendResource(newObservation),
      "Observación guardada de forma exitosa",
      "Enviando..."
    );
    if (response.success) handleClose();
    */
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
