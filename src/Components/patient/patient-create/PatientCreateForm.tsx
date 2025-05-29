import { SubmitHandler } from "react-hook-form";
import {
  Grid,
  Stepper,
  Step,
  Button,
  Box,
  Avatar,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  IconButton,
  StepButton,
  StepConnector,
  stepConnectorClasses,
  styled,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { useTranslation } from "react-i18next";
import PatientContactDetailForm from "./PatientContactDetailForm";
import PatientPersonalDetailsForm from "./PatientPersonalDetailsForm";
import PatientEmergencyContactsForm from "./PatientEmergencyContactsForm";
import { PatientFormData } from "../../../Models/Forms/PatientForm";
import { useState } from "react";
import { Patient } from "fhir/r4";

const steps = ["personalDetails", "contactDetails"];

// Conector personalizado para centrar la línea entre pasos
const CustomConnector = styled(StepConnector)(({ theme }) => ({
  [`&.${stepConnectorClasses.alternativeLabel}`]: {
    top: 15, // Ajusta esta altura según necesites para centrar la línea
    left: "calc(-50% + 10px)",
    right: "calc(50% + 40px)",
  },
  [`&.${stepConnectorClasses.active}`]: {
    [`& .${stepConnectorClasses.line}`]: {
      borderColor: theme.palette.primary.main,
    },
  },
  [`&.${stepConnectorClasses.completed}`]: {
    [`& .${stepConnectorClasses.line}`]: {
      borderColor: theme.palette.primary.main,
    },
  },
  [`& .${stepConnectorClasses.line}`]: {
    borderColor:
      theme.palette.mode === "dark" ? theme.palette.grey[800] : "#eaeaf0",
    borderTopWidth: 3,
    borderRadius: 1,
  },
}));

export default function PatientCreateForm({
  formId,
  patient,
  submitForm,
  handleClose,
  open,
  activeStep,
  avatar,
  handleAvatarChange,
  isPosting = false,
  setActiveStep,
  isEditing = false,
  selectedPatient = undefined,
}: {
  formId: string;
  submitForm: SubmitHandler<PatientFormData>;
  patient?: PatientFormData;
  handleClose: () => void;
  open: boolean;
  activeStep: number;
  avatar?: File | null;
  handleAvatarChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
  isPosting: boolean;
  setActiveStep: (step: number) => void;
  isEditing?: boolean;
  selectedPatient?: Patient | undefined;
}) {
  const { t } = useTranslation();
  const [optionalStep, setOptionalStep] = useState(false);

  // Función para manejar el clic en un paso
  const handleStepClick = (step: number) => {
    // Solo permitir ir a pasos anteriores o iguales al actual
    if (step <= activeStep) {
      setActiveStep(step);
      // Si volvemos al paso 1 desde el paso de emergencia, reseteamos optionalStep
      if (step === 0 && optionalStep) {
        setOptionalStep(false);
      }
    }
  };

  const successView = () => (
    <>
      <Typography
        variant="h5"
        sx={{
          color: "#354495",
          textDecoration: "underline",
          textDecorationThickness: "0.1em",
          textUnderlineOffset: "0.2em",
        }}
      >
        {isEditing
          ? t("patientCreateForm.patientUpdated")
          : t("patientCreateForm.patientCreated")}
      </Typography>
      <Typography
        variant="h6"
        sx={{
          color: "#354495",
        }}
      >
        {patient?.nombre} {patient?.segundoNombre} {patient?.apellidoPaterno}{" "}
        {patient?.apellidoMaterno}
      </Typography>
      {!isEditing && (
        <Typography variant="body1" sx={{ color: "#666" }}>
          {t("patientCreateForm.verifyEmail")}
        </Typography>
      )}
    </>
  );

  const hasPatientPhoto =
    selectedPatient?.photo?.[0]?.data || selectedPatient?.photo?.[0]?.url;

  const renderAvatarUpload = () => (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        height: "90%",
      }}
    >
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          border: "2px solid #2d7dfc",
          borderRadius: "32px",
          width: "100%",
          height: "100%",
          position: "relative",
          backgroundColor: "#f0f4fc",
        }}
      >
        <label htmlFor="avatar-upload">
          {avatar ? (
            <Avatar
              src={URL.createObjectURL(avatar)}
              sx={{
                width: 150,
                height: 150,
                cursor: "pointer",
              }}
            />
          ) : hasPatientPhoto ? (
            <Avatar
              src={
                selectedPatient?.photo?.[0]?.data
                  ? `data:${selectedPatient.photo[0].contentType};base64,${selectedPatient.photo[0].data}`
                  : selectedPatient?.photo?.[0]?.url
              }
              sx={{
                width: 150,
                height: 150,
                cursor: "pointer",
              }}
            />
          ) : (
            <Avatar
              sx={{
                width: 150,
                height: 150,
                cursor: "pointer",
                color: "#2d7dfc",
                backgroundColor: "#f0f4fc",
                border: "2px solid #2d7dfc",
              }}
            />
          )}
        </label>
        <input
          id="avatar-upload"
          type="file"
          hidden
          accept="image/*"
          onChange={handleAvatarChange}
        />
      </Box>
    </Box>
  );

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      fullWidth
      maxWidth="md"
      PaperProps={{
        sx: { borderRadius: "18px" },
      }}
    >
      <DialogTitle>
        <Box sx={{ position: "relative" }}>
          <IconButton
            sx={{ position: "absolute", top: 8, right: 8, color: "#247cfc" }}
            onClick={handleClose}
          >
            <CloseIcon />
          </IconButton>
        </Box>
      </DialogTitle>
      <DialogContent>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={4}>
            {renderAvatarUpload()}
          </Grid>
          <Grid item xs={12} sm={8}>
            {activeStep === 0 && (
              <PatientPersonalDetailsForm
                patient={patient}
                formId={`${formId}-0`}
                submitForm={submitForm}
              />
            )}

            {activeStep === 1 && optionalStep === false && (
              <PatientContactDetailForm
                patient={patient}
                formId={`${formId}-1`}
                submitForm={submitForm}
              />
            )}
            {activeStep === 1 && optionalStep === true && (
              <PatientEmergencyContactsForm
                patient={patient}
                formId={`${formId}-emergency`}
                submitForm={submitForm}
              />
            )}
            {activeStep === 2 && successView()}
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                mt: 2,
              }}
            >
              {/* Stepper con StepButton para permitir hacer clic */}
              <Stepper
                sx={{ width: "80%" }}
                activeStep={activeStep}
                alternativeLabel
                connector={<CustomConnector />}
              >
                {steps.map((label, index) => (
                  <Step key={label}>
                    <StepButton
                      onClick={() => handleStepClick(index)}
                      disabled={index > activeStep}
                      sx={{
                        // Quitar el label al ocultar todo el contenido textual
                        "& .MuiStepLabel-label": { display: "none" },
                        // Mantener el punto de paso centrado y clickable
                        padding: 0,
                        cursor: index <= activeStep ? "pointer" : "default",
                      }}
                    />
                  </Step>
                ))}
              </Stepper>

              <Box sx={{ display: "flex", alignItems: "center", mt: -5 }}>
                {activeStep < steps.length ? (
                  <Button
                    variant="contained"
                    color="primary"
                    type="submit"
                    form={`${formId}-${activeStep}`}
                    disabled={isPosting}
                    sx={{
                      bottom: 0,
                      right: 0,
                      width: 200,
                      borderBottomRightRadius: 18,
                      borderTopLeftRadius: 18,
                      position: "absolute",
                    }}
                  >
                    {activeStep === steps.length - 1
                      ? t("patientCreateForm.submit")
                      : t("patientCreateForm.next")}
                  </Button>
                ) : (
                  <Button
                    sx={{
                      bottom: 0,
                      right: 0,
                      width: 200,
                      borderBottomRightRadius: 18,
                      borderTopLeftRadius: 18,
                      position: "absolute",
                    }}
                    variant="contained"
                    color="primary"
                    onClick={() => {
                      // Navigate to the profile page
                      window.location.href = `/patient/${patient?.id}`;
                    }}
                  >
                    {t("patientCreateForm.viewProfile")}
                  </Button>
                )}
                {activeStep === steps.length - 1 && optionalStep === false && (
                  <Button
                    sx={{
                      bottom: 0,
                      right: 200,
                      width: 200,
                      borderBottomRightRadius: 18,
                      borderTopLeftRadius: 18,
                      position: "absolute",
                    }}
                    variant="contained"
                    color="secondary"
                    onClick={() => {
                      setOptionalStep(true);
                    }}
                  >
                    {t("patientCreateForm.newButton")}
                  </Button>
                )}
              </Box>
            </Box>
          </Grid>
        </Grid>
      </DialogContent>
    </Dialog>
  );
}
