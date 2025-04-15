import { SubmitHandler } from "react-hook-form";
import {
  Grid,
  Stepper,
  Step,
  StepLabel,
  Button,
  Box,
  Avatar,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  IconButton,
  Tooltip,
  Paper,
  Divider,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import PhotoCameraIcon from "@mui/icons-material/PhotoCamera";
import { useTranslation } from "react-i18next";
import PatientContactDetailForm from "./PatientContactDetailForm";
import PatientPersonalDetailsForm from "./PatientPersonalDetailsForm";
import { PatientFormData } from "../../../Models/Forms/PatientForm";
import { Patient } from "fhir/r4";

const steps = [
  { id: "personalDetails", label: "Información básica" },
  { id: "contactDetails", label: "Datos de contacto" }
];

export default function PatientCreateForm({
  formId,
  patient,
  submitForm,
  handleClose,
  open,
  activeStep,
  setActiveStep,
  avatar,
  handleAvatarChange,
  isPosting = false,
  isEditing = false,
  selectedPatient = undefined,
}: {
  formId: string;
  submitForm: SubmitHandler<PatientFormData>;
  patient?: PatientFormData;
  handleClose: () => void;
  open: boolean;
  activeStep: number;
  setActiveStep: React.Dispatch<React.SetStateAction<number>>;
  avatar?: File | null;
  handleAvatarChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
  isPosting: boolean;
  isEditing?: boolean;
  selectedPatient?: Patient | undefined;
}) {
  const { t } = useTranslation();

  const handleBack = () => {
    setActiveStep((prevStep) => prevStep - 1);
  };

  const successView = () => (
    <Box sx={{ textAlign: "center", py: 4 }}>
      <Typography
        variant="h4"
        sx={{
          color: "#354495",
          fontWeight: "bold",
          mb: 2,
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
          mb: 3,
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
    </Box>
  );

  const renderAvatarUpload = () => {
    const hasPatientPhoto = selectedPatient?.photo?.[0]?.data || selectedPatient?.photo?.[0]?.url;
    
    return (
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          height: "100%",
        }}
      >
        <Paper
          elevation={3}
          sx={{
            p: 2,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            width: "100%",
            maxWidth: "200px",
            position: "relative",
            backgroundColor: "#f0f4fc",
          }}
        >
          <label htmlFor="avatar-upload">
            {avatar ? (
              <Avatar
                src={URL.createObjectURL(avatar)}
                sx={{
                  width: 120,
                  height: 120,
                  cursor: "pointer",
                  mb: 2,
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
                  width: 120,
                  height: 120,
                  cursor: "pointer",
                  mb: 2,
                }}
              />
            ) : (
              <Avatar
                sx={{
                  width: 120,
                  height: 120,
                  cursor: "pointer",
                  color: "#2d7dfc",
                  backgroundColor: "#f0f4fc",
                  border: "2px solid #2d7dfc",
                  mb: 2,
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
          <Button
            variant="outlined"
            component="span"
            startIcon={<PhotoCameraIcon />}
            onClick={() => document.getElementById("avatar-upload")?.click()}
            sx={{ mt: 1 }}
          >
            {t("patientCreateForm.changePhoto")}
          </Button>
        </Paper>
      </Box>
    );
  };

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
          <Typography 
            variant="h4" 
            component="div" 
            sx={{ 
              textAlign: "center", 
              paddingTop: 1,
              fontWeight: "bold",
              color: "#354495",
            }}
          >
            {isEditing
              ? t("patientPersonalDetailsForm.editPatient")
              : t("patientPersonalDetailsForm.addPatient")}
          </Typography>
          <IconButton
            sx={{ position: "absolute", top: 8, right: 8, color: "#247cfc" }}
            onClick={handleClose}
          >
            <CloseIcon />
          </IconButton>
        </Box>
      </DialogTitle>
      <DialogContent>
        <Grid container spacing={3}>
          <Grid item xs={12} sm={4}>
            {renderAvatarUpload()}
          </Grid>
          <Grid item xs={12} sm={8}>
            {activeStep === 0 && (
              <PatientPersonalDetailsForm
                patient={patient}
                formId={`${formId}-0`}
                submitForm={submitForm}
                isEditing={isEditing}
              />
            )}

            {activeStep === 1 && (
              <PatientContactDetailForm
                patient={patient}
                formId={`${formId}-1`}
                submitForm={submitForm}
                isEditing={isEditing}
              />
            )}
            {activeStep === 2 && successView()}
            
            <Box sx={{ mt: 4 }}>
              <Stepper 
                activeStep={activeStep} 
                alternativeLabel
                sx={{ mb: 4 }}
              >
                {steps.map((step, index) => (
                  <Step key={step.id}>
                    <StepLabel>
                      <Typography variant="subtitle2">
                        {t(`patientCreateForm.${step.id}`)}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        Paso {index + 1} de {steps.length}
                      </Typography>
                    </StepLabel>
                  </Step>
                ))}
              </Stepper>

              <Box 
                sx={{ 
                  display: "flex", 
                  justifyContent: "space-between",
                  alignItems: "center",
                  mt: 2,
                }}
              >
                <Button
                  variant="outlined"
                  disabled={activeStep === 0}
                  onClick={handleBack}
                  sx={{ 
                    minWidth: "120px",
                    color: "#666",
                    borderColor: "#666",
                    "&:hover": {
                      borderColor: "#354495",
                      color: "#354495",
                    }
                  }}
                >
                  {t("patientCreateForm.back")}
                </Button>
                {activeStep < steps.length ? (
                  <Button
                    variant="contained"
                    color="primary"
                    type="submit"
                    form={`${formId}-${activeStep}`}
                    disabled={isPosting}
                    sx={{ 
                      minWidth: "120px",
                      backgroundColor: "#354495",
                      "&:hover": {
                        backgroundColor: "#2a3877",
                      }
                    }}
                  >
                    {activeStep === steps.length - 1
                      ? isEditing 
                        ? t("patientCreateForm.update")
                        : t("patientCreateForm.submit")
                      : t("patientCreateForm.next")}
                  </Button>
                ) : (
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={() => {
                      window.location.href = `/patient/${patient?.id}`;
                    }}
                    sx={{ 
                      minWidth: "120px",
                      backgroundColor: "#354495",
                      "&:hover": {
                        backgroundColor: "#2a3877",
                      }
                    }}
                  >
                    {t("patientCreateForm.viewProfile")}
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