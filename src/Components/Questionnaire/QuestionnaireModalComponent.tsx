import { useState, useEffect } from "react";
import { Questionnaire } from "fhir/r4";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  IconButton,
  CircularProgress,
  Box,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import QuestionnaireComponent from "./QuestionnaireComponent";
import { useTranslation } from "react-i18next";

// Check if LForms is loaded globally
declare global {
  interface Window {
    LForms?: any;
  }
}

interface QuestionnaireModalProps {
  open: boolean;
  onClose: () => void;
  questionnaire: Questionnaire | null;
  subjectId?: string;
  encounterId?: string;
}

export default function QuestionnaireModalComponent({
  open,
  onClose,
  questionnaire,
  subjectId,
  encounterId,
}: QuestionnaireModalProps) {
  const { t } = useTranslation();
  const [lformsReady, setLformsReady] = useState<boolean>(false);
  const [loadingLForms, setLoadingLForms] = useState<boolean>(false);

  // Add an effect to load LForms if needed
  useEffect(() => {
    if (window.LForms) {
      setLformsReady(true);
      return;
    }

    // Function to check if LForms is loaded
    const checkLFormsLoaded = () => {
      if (window.LForms) {
        setLformsReady(true);
        setLoadingLForms(false);
        return true;
      }
      return false;
    };

    // Try to load LForms script
    const loadLFormsScript = () => {
      if (!loadingLForms && !lformsReady && open) {
        setLoadingLForms(true);

        // Check if already loaded
        if (checkLFormsLoaded()) return;

        // Set up a repeated check for LForms
        const checkInterval = setInterval(() => {
          if (checkLFormsLoaded()) {
            clearInterval(checkInterval);
          }
        }, 500);

        // Clear interval after 10 seconds to prevent infinite checking
        setTimeout(() => {
          clearInterval(checkInterval);
          if (!window.LForms) {
            console.error("Failed to load LForms after timeout");
            setLoadingLForms(false);
          }
        }, 10000);
      }
    };

    // If dialog is open and LForms not loaded, try to load it
    if (open) {
      loadLFormsScript();
    }
  }, [open, loadingLForms, lformsReady]);

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="md">
      <DialogTitle
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          bgcolor: "#1B2455",
          color: "white",
        }}
      >
        {questionnaire?.title ||
          t("patientQuestionnaireComponent.newEvaluation")}
        <IconButton
          edge="end"
          color="inherit"
          onClick={onClose}
          aria-label="close"
          sx={{ color: "white" }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent sx={{ p: 3, mt: 2 }}>
        {questionnaire &&
          (loadingLForms ? (
            <Box sx={{ display: "flex", justifyContent: "center", p: 4 }}>
              <CircularProgress />
              <span style={{ marginLeft: "10px" }}>
                {t("patientQuestionnaireComponent.loadingQuestionnaire") ||
                  "Loading questionnaire..."}
              </span>
            </Box>
          ) : !lformsReady ? (
            <Box sx={{ color: "error.main", textAlign: "center", p: 4 }}>
              {t("patientQuestionnaireComponent.lformsNotLoaded") ||
                "The questionnaire form library could not be loaded. Please try refreshing the page."}
            </Box>
          ) : (
            <QuestionnaireComponent
              questionnaire={questionnaire}
              subjectId={subjectId}
              encounterId={encounterId}
            />
          ))}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="primary">
          {t("patientQuestionnaireComponent.close")}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
