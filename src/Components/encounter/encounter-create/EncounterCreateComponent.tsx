import { SubmitHandler } from "react-hook-form";
import {
  Button,
  Container,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Skeleton,
} from "@mui/material";

import { useEffect, useState } from "react";
import { Close } from "@mui/icons-material";

import styles from "./EncounterCreateComponent.module.css";
import { Encounter } from "fhir/r4";

import EncounterFormComponent from "./EncounterFormComponent";
import HandleResult from "../../../Utils/HandleResult";
import FhirResourceService from "../../../Services/FhirService";

import { EncounterFormData } from "../../../Models/Forms/EncounterForm";
import { CacheUtils } from "../../../Utils/Cache";
import EncounterUtils from "../../../Services/Utils/EncounterUtils";

export default function EncounterCreateComponent({
  onOpen,
  isOpen,
  patientId,
  start,
  end,
  encounter,
  mode,
}: {
  onOpen: (isOpen: boolean) => void;
  isOpen: boolean;
  patientId?: string;
  start?: Date;
  end?: Date;
  encounter?: Encounter;
  mode: "create" | "edit";
}) {
  useEffect(() => {
    onOpen(isOpen);
  }, [isOpen]);

  const handleClose = () => {
    onOpen(false);
  };

  const [loading, setLoading] = useState<boolean>(false);
  const [formInitData, setFormInitData] = useState<
    EncounterFormData | undefined
  >(undefined);

  useEffect(() => {
    if (!isOpen) {
      setFormInitData(undefined);
      setLoading(false);
      return;
    }
    console.log("isOpen", isOpen);
    console.log("mode", mode);
    console.log("encounter", encounter);

    if (mode === "edit") {
      if (!encounter) {
        setLoading(true);
        setFormInitData(undefined);
        return;
      }
      // encounter ya está, inicializa el form
      setLoading(true);
      const formData = EncounterUtils.EncounterToEncounterFormData(encounter);
      setFormInitData(formData);
      setLoading(false);
      console.log("Form data initialized for edit mode:", formData);
    } else if (mode === "create") {
      setFormInitData(undefined);
      setLoading(false);
    }
  }, [encounter, isOpen, mode]);

  const practitionerId = localStorage.getItem("id");

  const postEncounter = async (newEncounter: Encounter) => {
    const fhirService = FhirResourceService.getInstance<Encounter>("Encounter");

    const response = await HandleResult.handleOperation(
      () => fhirService.sendResource(newEncounter),
      "Encuentro guardado de forma exitosa",
      "Enviando..."
    );
    if (response.success) {
      CacheUtils.clearCacheByKeySubstring("Encounter");
      handleClose();
    }
  };

  // Función que se ejecuta al enviar el formulario
  const onSubmitForm: SubmitHandler<EncounterFormData> = (data) => {
    console.log("send form");
    console.log(data);

    const newEncounter = EncounterUtils.EncounterFormDataToEncounter(data);
    if (encounter) newEncounter.id = encounter.id; // Mantiene el ID si se está editando
    //alert(JSON.stringify(newEncounter, null, 2));
    postEncounter(newEncounter);
  };

  return (
    <div>
      <Dialog open={isOpen} onClose={handleClose} fullWidth maxWidth="md">
        <DialogTitle className={styles.dialogTitle}>
          Crear nuevo encuentro
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
              <>
                <Skeleton variant="rectangular" height={60} sx={{ mb: 2 }} />
                <Skeleton variant="rectangular" height={60} sx={{ mb: 2 }} />
                <Skeleton variant="rectangular" height={60} sx={{ mb: 2 }} />
                <Skeleton variant="rectangular" height={40} width="40%" />
              </>
            ) : (
              <EncounterFormComponent
                formId="encounterForm"
                submitForm={onSubmitForm}
                practitionerId={practitionerId!}
                patientId={patientId}
                start={start}
                end={end}
                encounter={formInitData}
              />
            )}
          </Container>
        </DialogContent>
        <DialogActions className={styles.dialogActions}>
          <Button onClick={handleClose} variant="contained" color="error">
            Cancelar
          </Button>
          <Button
            type="submit"
            variant="contained"
            color="primary"
            form="encounterForm"
            disabled={loading}
          >
            Enviar
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
