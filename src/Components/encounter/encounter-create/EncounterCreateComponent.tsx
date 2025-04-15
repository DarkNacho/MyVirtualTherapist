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

import { useEffect } from "react";
import { Close } from "@mui/icons-material";

import styles from "./EncounterCreateComponent.module.css";
import { Encounter } from "fhir/r4";

import EncounterFormComponent from "./EncounterFormComponent";
import HandleResult from "../../../Utils/HandleResult";
import FhirResourceService from "../../../Services/FhirService";
import dayjs from "dayjs";
import { EncounterFormData } from "../../../Models/Forms/EncounterForm";
import { CacheUtils } from "../../../Utils/Cache";

export default function EncounterCreateComponent({
  onOpen,
  isOpen,
  patientId,
  start,
  end,
}: {
  onOpen: (isOpen: boolean) => void;
  isOpen: boolean;
  patientId?: string;
  start?: Date;
  end?: Date;
}) {
  useEffect(() => {
    onOpen(isOpen);
  }, [isOpen]);

  const handleClose = () => {
    onOpen(false);
  };

  const practitionerId = localStorage.getItem("id");

  const postEncounter = async (newEncounter: Encounter) => {
    const fhirService = FhirResourceService.getInstance<Encounter>("Encounter");

    const response = await HandleResult.handleOperation(
      () => fhirService.postResource(newEncounter),
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

    const seguimiento = data.seguimiento?.id
      ? {
          reference: `Encounter/${data.seguimiento.id}`,
          display: data.seguimiento.display,
        }
      : undefined;

    const newEncounter: Encounter = {
      resourceType: "Encounter",
      subject: {
        reference: `Patient/${data.patient.id}`,
        display: data.patient.display,
      },
      participant: [
        {
          individual: {
            reference: `Practitioner/${data.practitioner.id}`,
            display: data.practitioner.display,
          },
        },
      ],
      period: {
        start: dayjs(
          `${dayjs(data.day).format("DD-MM-YY")} ${dayjs(data.start).format(
            "HH:mm"
          )}`,
          "DD-MM-YY HH:mm"
        ).toISOString(),
        end: dayjs(
          `${dayjs(data.day).format("DD-MM-YY")} ${dayjs(data.end).format(
            "HH:mm"
          )}`,
          "DD-MM-YY HH:mm"
        ).toISOString(),
      },
      partOf: seguimiento,
      status: "finished",
      class: {
        code: data.type,
        system: "http://terminology.hl7.org/CodeSystem/v3-ActCode",
      },
    };
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
            <EncounterFormComponent
              formId="encounterForm"
              submitForm={onSubmitForm}
              practitionerId={practitionerId!}
              patientId={patientId}
              start={start}
              end={end}
            ></EncounterFormComponent>
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
          >
            Enviar
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
