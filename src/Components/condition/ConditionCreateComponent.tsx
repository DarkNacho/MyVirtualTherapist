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

import styles from "./ConditionCreateComponent.module.css";

import HandleResult from "../../Utils/HandleResult";
import { isAdminOrPractitioner } from "../../Utils/RolUser";
import ConditionFormComponent from "./ConditionFormComponent";
import { Condition, DocumentReference } from "fhir/r4";
import ConditionUtils from "../../Services/Utils/ConditionUtils";
import { ConditionFormData } from "../../Models/Forms/ConditionForm";
import { useEffect, useRef, useState } from "react";
import FhirResourceService from "../../Services/FhirService";
import UploadFileComponent, {
  UploadFileComponentRef,
} from "../FileManager/UploadFileComponent";

export default function ConditionCreateComponent({
  patientId,
  encounterId,
  onOpen,
  isOpen,
  condition,
}: {
  patientId: string;
  onOpen: (isOpen: boolean) => void;
  isOpen: boolean;
  encounterId?: string;
  condition?: Condition;
}) {
  const [loading, setLoading] = useState<boolean>(false);
  const [formInitData, setFormInitData] = useState<
    ConditionFormData | undefined
  >(undefined);
  const uploadRef = useRef<UploadFileComponentRef>(null);

  useEffect(() => {
    const initForm = async () => {
      setLoading(true);
      if (isOpen && condition) {
        console.log("Cargando Condition desde props");
        ConditionUtils.ConditionToConditionFormData(condition).then((data) => {
          setFormInitData(data);
          setLoading(false);
          console.log("ConditionFormData inicial:", data);
        });
      } else if (isOpen && !condition) {
        setFormInitData(undefined); // Limpia el formulario si es nuevo
        setLoading(false);
      }
    };
    initForm();
  }, [condition, isOpen]);

  const handleClose = () => {
    onOpen(false);
  };

  const practitionerId = isAdminOrPractitioner()
    ? localStorage.getItem("id") || undefined
    : undefined;

  const handleDelete = async () => {
    if (!condition) return;

    const confirmed = await HandleResult.confirm(
      "¿Estás seguro de que quieres eliminar esta condición? Esta acción no se puede deshacer."
    );
    if (!confirmed) return;

    const response = await HandleResult.handleOperation(
      () =>
        FhirResourceService.getInstance<Condition>("Condition").deleteResource(
          condition.id!
        ),
      "Condición eliminada de forma exitosa",
      "Eliminando..."
    );
    if (response.success) {
      handleClose();
    }
  };

  const onSubmitForm: SubmitHandler<ConditionFormData> = async (data) => {
    let supportingInfoDocument: DocumentReference | undefined = undefined;

    // Lógica para subir archivos
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

    const newCondition = ConditionUtils.ConditionFormDataToCondition(
      data,
      supportingInfoDocument
    );

    // Si estamos editando, asignamos el ID
    if (condition) {
      newCondition.id = condition.id;
    }

    sendCondition(newCondition);
  };

  const sendCondition = async (newCondition: Condition) => {
    const response = await HandleResult.handleOperation(
      () =>
        FhirResourceService.getInstance<Condition>("Condition").sendResource(
          newCondition
        ),
      "Condición guardada de forma exitosa",
      "Enviando..."
    );
    if (response.success) handleClose();
  };

  return (
    <div>
      <Dialog open={isOpen} onClose={handleClose} fullWidth maxWidth="md">
        <DialogTitle className={styles.dialogTitle}>
          Condición
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
                <ConditionFormComponent
                  formId="conditionForm"
                  patientId={patientId}
                  practitionerId={practitionerId!}
                  submitForm={onSubmitForm}
                  encounterId={encounterId}
                  condition={formInitData} // Pasamos los datos iniciales al formulario
                />
                <UploadFileComponent
                  ref={uploadRef}
                  subject={{ reference: `Patient/${patientId}` }}
                  author={{ reference: `Practitioner/${practitionerId}` }}
                  documentReferenceId={
                    condition?.evidence?.[0]?.detail?.[0]?.reference?.split(
                      "/"
                    )[1]
                  }
                />
              </>
            )}
          </Container>
        </DialogContent>
        <DialogActions className={styles.dialogActions}>
          {condition && (
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
          <Button
            type="submit"
            variant="contained"
            color="primary"
            form="conditionForm"
          >
            Enviar
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
