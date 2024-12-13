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
import styles from "./MedicationCreateComponent.module.css";
import { MedicationStatement } from "fhir/r4";
import HandleResult from "../../Utils/HandleResult";
import { isAdminOrPractitioner } from "../../Utils/RolUser";
import MedicationFormComponent from "./MedicationFormComponent";
import FhirResourceService from "../../Services/FhirService";
import MedicationUtils from "../../Services/Utils/MedicationUtils";
import { MedicationFormData } from "../../Models/Forms/MedicationForm";

export default function MedicationCreateComponent({
  patientId,
  onOpen,
  isOpen,
}: {
  patientId: string;
  onOpen: (isOpen: boolean) => void;
  isOpen: boolean;
}) {
  const handleClose = () => {
    onOpen(false);
  };

  const practitionerId = isAdminOrPractitioner()
    ? localStorage.getItem("id") || undefined
    : undefined;

  const onSubmitForm: SubmitHandler<MedicationFormData> = (data) => {
    const medication =
      MedicationUtils.MedicationFormDataToMedicationStatement(data);
    sendMedication(medication);
  };

  const sendMedication = async (newMedication: MedicationStatement) => {
    const response = await HandleResult.handleOperation(
      () =>
        FhirResourceService.getInstance("MedicationStatement").sendResource(
          newMedication
        ),
      "Medicamento guardada de forma exitosa",
      "Enviando..."
    );
    if (response.success) handleClose();
  };

  return (
    <div>
      <Dialog open={isOpen} onClose={handleClose} fullWidth maxWidth="md">
        <DialogTitle className={styles.dialogTitle}>
          Agregar Medicamento
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
            <MedicationFormComponent
              formId="form"
              patientId={patientId}
              practitionerId={practitionerId}
              submitForm={onSubmitForm}
              readOnly={false}
            ></MedicationFormComponent>
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
