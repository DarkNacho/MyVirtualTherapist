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
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { useTranslation } from "react-i18next";
import PatientContactDetailForm from "./PatientContactDetailForm";
import PatientPersonalDetailsForm from "./PatientPersonalDetailsForm";
import PatientEmergencyContactsForm from "./PatientEmergencyContactsForm";
import { PatientFormData } from "../../../Models/Forms/PatientForm";
import { useState } from "react";

const steps = ["personalDetails", "contactDetails"];

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
}) {
  const { t } = useTranslation();

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
        {t("patientCreateForm.patientCreated")}
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
      {t("patientCreateForm.verifyEmail")}
    </>
  );

  const renderAvatarUpload = () => (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        height: "90%", // Ensure it takes the full height of the parent container
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

  const [optionalStep, setOptionalStep] = useState(false);

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
              <Stepper sx={{}} activeStep={activeStep} alternativeLabel>
                {steps.map((label, index) => (
                  <Step key={label}>
                    <StepLabel
                      sx={{
                        whiteSpace: "nowrap",
                        marginLeft: index === 0 ? "0" : "50px",
                        marginRight: "50px", // Adjust the margin value as needed
                      }}
                    ></StepLabel>
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
