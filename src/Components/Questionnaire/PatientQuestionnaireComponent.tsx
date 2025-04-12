import { useEffect, useState } from "react";
import { Questionnaire, QuestionnaireResponse } from "fhir/r4";
import QuestionnaireComponent from "../Questionnaire/QuestionnaireComponent";
import QuestionnaireListDialogComponent from "../Questionnaire/QuestionnaireListDialogComponent";
import { Box, Button, Card, CardContent, Typography, Grid, Paper, Divider } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import { isAdminOrPractitioner } from "../../Utils/RolUser";
import FhirResourceService from "../../Services/FhirService";
import { useTranslation } from "react-i18next";

const questionnaireResponseService =
  FhirResourceService.getInstance<QuestionnaireResponse>("QuestionnaireResponse");
const questionnaireService =
  FhirResourceService.getInstance<Questionnaire>("Questionnaire");

export default function PatientQuestionnaireComponent({
  patientID,
  encounterID,
}: {
  patientID: string;
  encounterID?: string;
}) {
  const [questionnaireResponses, setQuestionnaireResponses] = useState<QuestionnaireResponse[]>([]);
  const [questionnaires, setQuestionnaires] = useState<Record<string, Questionnaire>>({});
  const [newQuestionnaires, setNewQuestionnaires] = useState<Questionnaire[]>([]);
  const [showModal, setShowModal] = useState(false);

  const { t } = useTranslation();

  const handleQuesSelect = (ques: Questionnaire) => {
    setNewQuestionnaires((prevQuestionnaires) => [ques, ...prevQuestionnaires]);
    setShowModal(false);
  };

  const fetchQuestionnaireResponses = async () => {
    try {
      const responseBundle = await questionnaireResponseService.getResources({
        subject: patientID,
        encounter: encounterID!,
      });
      if (!responseBundle.success) throw Error(responseBundle.error);

      setQuestionnaireResponses(responseBundle.data as QuestionnaireResponse[]);
      const updatedQuestionnaires: Record<string, Questionnaire> = {};

      for (const quetionnaireResponse of responseBundle.data as QuestionnaireResponse[]) {
        const quesR_id = quetionnaireResponse.questionnaire;
        if (!quesR_id) continue;

        const res = await questionnaireService.getById(quesR_id);
        if (res.success)
          updatedQuestionnaires[quesR_id] = res.data as Questionnaire;
      }
      setQuestionnaires(updatedQuestionnaires);
    } catch {
      console.log("Error al cargar las evaluaciones");
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      await fetchQuestionnaireResponses();
    };
    fetchData();
  }, [patientID]);

  return (
    <Box sx={{ p: 3 }}>
      {isAdminOrPractitioner() && (
        <Box sx={{ mb: 3 }}>
          <Button
            variant="contained"
            color="primary"
            startIcon={<AddIcon />}
            onClick={() => setShowModal(true)}
            sx={{ 
              backgroundColor: "#354495",
              "&:hover": {
                backgroundColor: "#2a3877",
              }
            }}
          >
            {t("questionnaireListDialogComponent.addNewEvaluation")}
          </Button>
        </Box>
      )}

      {newQuestionnaires.length > 0 && (
        <Paper elevation={3} sx={{ p: 3, mb: 3, backgroundColor: "#f8f9fa" }}>
          <Typography variant="h5" sx={{ mb: 2, color: "#354495", fontWeight: "bold" }}>
            {t("patientQuestionnaireComponent.newForms")}
          </Typography>
          <Grid container spacing={3}>
            {newQuestionnaires.map((newQues, index) => (
              <Grid item xs={12} key={index}>
                <Card>
                  <CardContent>
                    <QuestionnaireComponent
                      questionnaire={newQues}
                      subjectId={patientID}
                      encounterId={encounterID}
                    />
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Paper>
      )}

      {Object.keys(questionnaires).length > 0 && (
        <Paper elevation={3} sx={{ p: 3, backgroundColor: "#f8f9fa" }}>
          <Typography variant="h5" sx={{ mb: 2, color: "#354495", fontWeight: "bold" }}>
            {t("patientQuestionnaireComponent.loadedForms")}
          </Typography>
          <Grid container spacing={3}>
            {questionnaireResponses.map(
              (quesRes, index) =>
                quesRes.questionnaire && (
                  <Grid item xs={12} key={index}>
                    <Card>
                      <CardContent>
                        <QuestionnaireComponent
                          questionnaire={questionnaires[quesRes.questionnaire]}
                          questionnaireResponse={quesRes}
                          subjectId={patientID}
                          encounterId={encounterID}
                        />
                      </CardContent>
                    </Card>
                  </Grid>
                )
            )}
          </Grid>
        </Paper>
      )}

      <QuestionnaireListDialogComponent
        open={showModal}
        onClose={() => setShowModal(false)}
        onQuestionnaireSelect={handleQuesSelect}
      />
    </Box>
  );
}
