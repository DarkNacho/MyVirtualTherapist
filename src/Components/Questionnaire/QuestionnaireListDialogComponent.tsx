import { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  List,
  ListItem,
  ListItemText,
  Typography,
  InputAdornment,
  IconButton,
  Paper,
  Box,
  Chip,
  CircularProgress,
} from "@mui/material";
import { Search, Close, FilterList } from "@mui/icons-material";
import { Questionnaire } from "fhir/r4";
import FhirResourceService from "../../Services/FhirService";
import { useTranslation } from "react-i18next";

const questionnaireService = FhirResourceService.getInstance<Questionnaire>("Questionnaire");

interface QuestionnaireListDialogComponentProps {
  open: boolean;
  onClose: () => void;
  onQuestionnaireSelect: (questionnaire: Questionnaire) => void;
}

export default function QuestionnaireListDialogComponent({
  open,
  onClose,
  onQuestionnaireSelect,
}: QuestionnaireListDialogComponentProps) {
  const [questionnaires, setQuestionnaires] = useState<Questionnaire[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(false);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [availableTags, setAvailableTags] = useState<string[]>([]);
  const { t } = useTranslation();

  useEffect(() => {
    if (open) {
      fetchQuestionnaires();
    }
  }, [open]);

  const fetchQuestionnaires = async () => {
    setLoading(true);
    try {
      const response = await questionnaireService.getResources({});
      if (response.success) {
        const data = response.data as Questionnaire[];
        setQuestionnaires(data);
        // Extraer tags únicos de todos los cuestionarios
        const tags = new Set<string>();
        data.forEach((q) => {
          q.code?.forEach((code) => {
            if (code.display) tags.add(code.display);
          });
        });
        setAvailableTags([...tags]);
      }
    } catch (error) {
      console.error("Error al cargar las evaluaciones:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = () => {
    // La búsqueda se realiza automáticamente con el estado actual
  };

  const handleTagClick = (tag: string) => {
    setSelectedTags((prev) =>
      prev.includes(tag)
        ? prev.filter((t) => t !== tag)
        : [...prev, tag]
    );
  };

  const filteredQuestionnaires = questionnaires.filter((ques) => {
    const matchesSearch = ques.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         ques.description?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesTags = selectedTags.length === 0 || 
      ques.code?.some((code) => selectedTags.includes(code.display || ""));
    
    return matchesSearch && matchesTags;
  });

  return (
    <Dialog 
      open={open} 
      onClose={onClose} 
      maxWidth="md" 
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: "12px",
          backgroundColor: "#f8f9fa"
        }
      }}
    >
      <DialogTitle sx={{ 
        backgroundColor: "#354495", 
        color: "white",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center"
      }}>
        {t("questionnaireListDialogComponent.availableEvaluations")}
        <IconButton
          aria-label="close"
          onClick={onClose}
          sx={{ color: "white" }}
        >
          <Close />
        </IconButton>
      </DialogTitle>
      <DialogContent sx={{ p: 3 }}>
        <Box sx={{ mb: 3 }}>
          <Paper elevation={0} sx={{ p: 2, backgroundColor: "white" }}>
            <TextField
              fullWidth
              variant="outlined"
              label={t("questionnaireListDialogComponent.searchFormByTitle")}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton onClick={handleSearch}>
                      <Search />
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
          </Paper>
        </Box>

        <Box sx={{ mb: 3 }}>
          <Typography variant="subtitle1" sx={{ mb: 1, color: "#354495" }}>
            {t("questionnaireListDialogComponent.tags")}
          </Typography>
          <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
            {availableTags.map((tag) => (
              <Chip
                key={tag}
                label={tag}
                onClick={() => handleTagClick(tag)}
                color={selectedTags.includes(tag) ? "primary" : "default"}
                sx={{ 
                  backgroundColor: selectedTags.includes(tag) ? "#354495" : "white",
                  color: selectedTags.includes(tag) ? "white" : "inherit",
                  "&:hover": {
                    backgroundColor: selectedTags.includes(tag) ? "#2a3877" : "#f0f0f0"
                  }
                }}
              />
            ))}
          </Box>
        </Box>

        {loading ? (
          <Box sx={{ display: "flex", justifyContent: "center", p: 3 }}>
            <CircularProgress />
          </Box>
        ) : (
          <List>
            {filteredQuestionnaires.map((ques) => (
              <Paper 
                key={ques.id} 
                elevation={2} 
                sx={{ 
                  mb: 2,
                  cursor: "pointer",
                  "&:hover": {
                    backgroundColor: "#f0f4fc"
                  }
                }}
                onClick={() => onQuestionnaireSelect(ques)}
              >
                <ListItem>
                  <ListItemText
                    primary={
                      <Typography variant="h6" color="primary">
                        {ques.title}
                      </Typography>
                    }
                    secondary={
                      <>
                        <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                          {ques.description}
                        </Typography>
                        <Box sx={{ mt: 1, display: "flex", flexWrap: "wrap", gap: 0.5 }}>
                          {ques.code?.map((code, index) => (
                            <Chip
                              key={index}
                              label={code.display}
                              size="small"
                              sx={{ 
                                backgroundColor: "#e3f2fd",
                                color: "#1976d2"
                              }}
                            />
                          ))}
                        </Box>
                      </>
                    }
                  />
                </ListItem>
              </Paper>
            ))}
          </List>
        )}
      </DialogContent>
      <DialogActions sx={{ p: 2, backgroundColor: "white" }}>
        <Button
          variant="outlined"
          color="error"
          onClick={onClose}
          sx={{ mr: 1 }}
        >
          {t("questionnaireListDialogComponent.cancel")}
        </Button>
        <Button
          variant="contained"
          color="primary"
          href="https://forms.gle/qpzLR1wSi5DoDGAw5"
          sx={{ 
            backgroundColor: "#354495",
            "&:hover": {
              backgroundColor: "#2a3877"
            }
          }}
        >
          {t("questionnaireListDialogComponent.requestForm")}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
