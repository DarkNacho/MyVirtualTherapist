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
import styles from "./MedicationCreateComponent.module.css";
import { MedicationStatement, DocumentReference } from "fhir/r4";
import HandleResult from "../../Utils/HandleResult";
import { isAdminOrPractitioner } from "../../Utils/RolUser";
import MedicationFormComponent from "./MedicationFormComponent";
import FhirResourceService from "../../Services/FhirService";
import MedicationUtils from "../../Services/Utils/MedicationUtils";
import { MedicationFormData } from "../../Models/Forms/MedicationForm";
import { useEffect, useRef, useState } from "react";
import UploadFileComponent, {
  UploadFileComponentRef,
} from "../FileManager/UploadFileComponent";

export default function MedicationCreateComponent({
  patientId,
  onOpen,
  isOpen,
  medication,
}: {
  patientId: string;
  onOpen: (isOpen: boolean) => void;
  isOpen: boolean;
  medication?: MedicationStatement;
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
    MedicationFormData | undefined
  >(undefined);

  useEffect(() => {
    const initForm = async () => {
      setLoading(true);
      if (isOpen && medication) {
        // Convert MedicationStatement to MedicationFormData if editing
        MedicationUtils.MedicationStatementToMedicationFormData(
          medication
        ).then((data) => {
          setFormInitData(data);
          setLoading(false);
        });
      } else if (isOpen && !medication) {
        setFormInitData(undefined); // Clear form if new
        setLoading(false);
      }
    };
    initForm();
  }, [medication, isOpen]);

  const handleDelete = async () => {
    if (!medication) return;
    const confirmed = await HandleResult.confirm(
      "¿Estás seguro de que quieres eliminar este medicamento? Esta acción no se puede deshacer."
    );
    if (!confirmed) return;
    const response = await HandleResult.handleOperation(
      () =>
        FhirResourceService.getInstance<MedicationStatement>(
          "MedicationStatement"
        ).deleteResource(medication.id!),
      "Medicamento eliminado de forma exitosa",
      "Eliminando..."
    );
    if (response.success) {
      handleClose();
    }
  };

  const onSubmitForm: SubmitHandler<MedicationFormData> = async (data) => {
    let supportingInfoDocument: DocumentReference | undefined = undefined;

    // File upload logic
    if (
      uploadRef.current?.hasFiles() &&
      !uploadRef.current.getDocumentReference()
    ) {
      const result = await uploadRef.current.uploadAllFiles();
      if (!result?.success || !result.data) {
        console.error("Error al subir archivos.");
        return;
      }
      supportingInfoDocument = result.data;
    } else if (uploadRef.current?.getDocumentReference()) {
      supportingInfoDocument = uploadRef.current.getDocumentReference();
    }

    const newMedication =
      MedicationUtils.MedicationFormDataToMedicationStatement(
        data,
        supportingInfoDocument
      );

    // If editing, assign the ID
    if (medication) {
      newMedication.id = medication.id;
    }

    sendMedication(newMedication);
  };

  const sendMedication = async (newMedication: MedicationStatement) => {
    const response = await HandleResult.handleOperation(
      () =>
        FhirResourceService.getInstance("MedicationStatement").sendResource(
          newMedication
        ),
      "Medicamento guardado de forma exitosa",
      "Enviando..."
    );
    if (response.success) handleClose();
  };

  return (
    <div>
      <Dialog open={isOpen} onClose={handleClose} fullWidth maxWidth="md">
        <DialogTitle className={styles.dialogTitle}>
          {medication ? "Editar Medicamento" : "Agregar Medicamento"}
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
                <MedicationFormComponent
                  formId="form"
                  patientId={patientId}
                  practitionerId={practitionerId}
                  submitForm={onSubmitForm}
                  medication={formInitData}
                  readOnly={false}
                />
                <UploadFileComponent
                  ref={uploadRef}
                  subject={{ reference: `Patient/${patientId}` }}
                  author={{ reference: `Practitioner/${practitionerId}` }}
                  documentReferenceId={
                    medication?.derivedFrom?.[0]?.reference?.split("/")[1] ||
                    undefined
                  }
                />
              </>
            )}
          </Container>
        </DialogContent>
        <DialogActions className={styles.dialogActions}>
          {medication && (
            <Button
              onClick={handleDelete}
              variant="contained"
              color="error"
              sx={{ marginRight: "auto" }}
            >
              Borrar
            </Button>
          )}
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
