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
import PractitionerContactDetailForm from "./PractitionerContactDetailForm";
import PractitionerPersonalDetailsForm from "./PractitionerPersonalDetailsForm";
import { PractitionerFormData } from "../../../Models/Forms/PractitionerForm";

const steps = ["personalDetails", "contactDetails"];

export default function PractitionerCreateForm({
  formId,
  practitioner,
  submitForm,
  handleClose,
  open,
  activeStep,
  setActiveStep,
  avatar,
  handleAvatarChange,
  isPosting = false,
}: {
  formId: string;
  submitForm: SubmitHandler<PractitionerFormData>;
  practitioner?: PractitionerFormData;
  handleClose: () => void;
  open: boolean;
  activeStep: number;
  setActiveStep: React.Dispatch<React.SetStateAction<number>>;
  avatar?: File | null;
  handleAvatarChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
  isPosting: boolean;
}) {
  const { t } = useTranslation();

  const handleBack = () => {
    setActiveStep((prevStep) => prevStep - 1);
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
        {t("practitionerCreateForm.practitionerCreated")}
      </Typography>
      <Typography
        variant="h6"
        sx={{
          color: "#354495",
        }}
      >
        {practitioner?.nombre} {practitioner?.segundoNombre}{" "}
        {practitioner?.apellidoPaterno} {practitioner?.apellidoMaterno}
      </Typography>
      {t("practitionerCreateForm.verifyEmail")}
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
              <PractitionerPersonalDetailsForm
                practitioner={practitioner}
                formId={`${formId}-0`}
                submitForm={submitForm}
              />
            )}

            {activeStep === 1 && (
              <PractitionerContactDetailForm
                practitioner={practitioner}
                formId={`${formId}-1`}
                submitForm={submitForm}
              />
            )}
            {activeStep === 2 && successView()}
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                mt: 3,
              }}
            >
              <Stepper activeStep={activeStep} alternativeLabel>
                {steps.map((label) => (
                  <Step key={label}>
                    <StepLabel>
                      {t(`practitionerCreateForm.${label}`)}
                    </StepLabel>
                  </Step>
                ))}
              </Stepper>

              <Box sx={{ display: "flex", alignItems: "center", mt: -5 }}>
                <Button
                  variant="outlined"
                  disabled={activeStep === 0}
                  onClick={handleBack}
                >
                  {t("practitionerCreateForm.back")}
                </Button>
                {activeStep < steps.length ? (
                  <Button
                    variant="contained"
                    color="primary"
                    type="submit"
                    form={`${formId}-${activeStep}`}
                    disabled={isPosting}
                  >
                    {activeStep === steps.length - 1
                      ? t("practitionerCreateForm.submit")
                      : t("practitionerCreateForm.next")}
                  </Button>
                ) : (
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={() => {
                      // Navigate to the profile page
                      window.location.href = `/practitioner/${practitioner?.id}`;
                    }}
                  >
                    {t("practitionerCreateForm.viewProfile")}
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
