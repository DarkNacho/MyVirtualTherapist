import { useEffect, useState } from "react";
import { Questionnaire } from "fhir/r4";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  List,
  ListItem,
  ListItemText,
  IconButton,
  TextField,
  InputAdornment,
} from "@mui/material";
import { Close, Search } from "@mui/icons-material";
import styles from "./QuestionnaireListDialogComponent.module.css";
import FhirResourceService from "../../Services/FhirService";
import HandleResult from "../../Utils/HandleResult";

const questionnaireService =
  FhirResourceService.getInstance<Questionnaire>("Questionnaire");

export default function QuestionnaireListDialogComponent({
  onQuestionnaireSelect,
}: {
  onQuestionnaireSelect: (ques: Questionnaire) => void;
}) {
  const [showModal, setShowModal] = useState(false);
  const [questionnaires, setQuestionnaires] = useState<Questionnaire[]>([]);
  const [searchTerm, setSearchTerm] = useState("");

  const closeModal = () => {
    setShowModal(false);
  };

  const handleNewQuestionnaires = async (direction: "next" | "previous") => {
    HandleResult.handleOperation(
      () => questionnaireService.getNewResources(direction),
      "Formularios Obtenidos exitosamente",
      "Cargando...",
      setQuestionnaires
    );
  };

  const fetchQuestionnaires = async () => {
    HandleResult.handleOperation(
      () => questionnaireService.getResources({ _count: 10 }),
      "Formularios Obtenidos exitosamente",
      "Cargando...",
      setQuestionnaires
    );
  };

  const handleSearch = async () => {
    HandleResult.handleOperation(
      () =>
        questionnaireService.getResources({ _content: searchTerm, _count: 10 }),
      "Formularios Obtenidos exitosamente",
      "Cargando...",
      setQuestionnaires
    );
  };

  useEffect(() => {
    if (showModal) fetchQuestionnaires();
  }, [showModal]);

  return (
    <div>
      <Button
        variant="contained"
        color="primary"
        onClick={() => setShowModal(true)}
      >
        Mostrar Cuestionarios
      </Button>
      <Dialog open={showModal} onClose={closeModal} maxWidth="md" fullWidth>
        <DialogTitle className={styles.dialogTitle}>
          Evaluaciones Disponibles
          <IconButton
            aria-label="close"
            onClick={closeModal}
            sx={{ color: "white", "&:hover": { backgroundColor: "red" } }}
          >
            <Close />
          </IconButton>
        </DialogTitle>
        <DialogContent className={styles.dialog}>
          <div className={styles.dialogContent}>
            <form
              className={styles.searchContainer}
              onSubmit={(e) => {
                e.preventDefault();
                handleSearch();
              }}
            >
              <TextField
                style={{ width: "100%" }}
                label="Buscar Formulario por título"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton type="submit">
                        <Search />
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
            </form>
            <List className={styles.listContent}>
              {questionnaires.map((ques) => (
                <ListItem
                  className={styles.listItem}
                  key={ques.id}
                  onClick={() => {
                    onQuestionnaireSelect(ques);
                    closeModal();
                  }}
                >
                  <ListItemText
                    primary={`${ques.title}`}
                    secondary={`${ques.description}`}
                  />
                </ListItem>
              ))}
            </List>
          </div>
        </DialogContent>
        <DialogActions className={styles.dialogActions}>
          <Button
            style={{ marginRight: "auto" }}
            variant="contained"
            color="error"
            onClick={closeModal}
          >
            Cancelar
          </Button>
          <Button
            variant="contained"
            color="primary"
            href="https://www.google.com"
          >
            Solicitar Formulario
          </Button>
          <Button
            variant="contained"
            color="primary"
            onClick={() => handleNewQuestionnaires("previous")}
            disabled={!questionnaireService.hasPrevPage}
          >
            Página anterior
          </Button>
          <Button
            variant="contained"
            color="primary"
            onClick={() => handleNewQuestionnaires("next")}
            disabled={!questionnaireService.hasNextPage}
          >
            Siguiente página
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
