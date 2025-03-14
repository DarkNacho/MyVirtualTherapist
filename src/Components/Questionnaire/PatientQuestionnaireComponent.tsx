import { useEffect, useState } from "react";
import { Questionnaire, QuestionnaireResponse } from "fhir/r4";
import QuestionnaireComponent from "../Questionnaire/QuestionnaireComponent";
import QuestionnaireListComponent from "../Questionnaire/QuestionnaireListDialogComponent";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Skeleton,
  Box,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { isAdminOrPractitioner } from "../../Utils/RolUser";
import FhirResourceService from "../../Services/FhirService";
import { useTranslation } from "react-i18next";

const questionnaireResponseService =
  FhirResourceService.getInstance<QuestionnaireResponse>(
    "QuestionnaireResponse"
  );
const questionnaireService =
  FhirResourceService.getInstance<Questionnaire>("Questionnaire");

export default function PatientQuestionnaireComponent({
  patientID,
  encounterID,
}: {
  patientID: string;
  encounterID?: string;
}) {
  const [questionnaireResponses, setQuestionnaireResponses] = useState<
    QuestionnaireResponse[]
  >([]);
  const [questionnaires, setQuestionnaires] = useState<
    Record<string, Questionnaire>
  >({});
  const [newQuestionnaires, setNewQuestionnaires] = useState<Questionnaire[]>(
    []
  );
  const [loading, setLoading] = useState<boolean>(true); // Loading state

  const { t } = useTranslation();

  const handleQuesSelect = (ques: Questionnaire) => {
    setNewQuestionnaires((prevQuestionnaires) => [ques, ...prevQuestionnaires]);
    console.log("Questionario seleccionado", ques);
  };

  const fetchQuestionnaireResponses = async () => {
    try {
      setLoading(true); // Start loading
      const responseBundle = await questionnaireResponseService.getResources({
        subject: patientID,
        encounter: encounterID!,
      });
      if (!responseBundle.success) throw Error(responseBundle.error);

      console.log("Questionnaire Responses", responseBundle.data);
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
      console.log("Questionnaires", updatedQuestionnaires);
    } catch {
      console.log("entro al catch");
    } finally {
      setLoading(false); // Stop loading
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      await fetchQuestionnaireResponses();
    };
    fetchData();
  }, [patientID]);

  return (
    <div>
      {isAdminOrPractitioner() && (
        <div>
          <QuestionnaireListComponent
            onQuestionnaireSelect={handleQuesSelect}
          ></QuestionnaireListComponent>
        </div>
      )}
      <div>
        {loading ? (
          // Skeleton while loading
          <Box>
            <Skeleton
              variant="rectangular"
              height={50}
              sx={{ marginBottom: 2 }}
            />
            <Skeleton
              variant="rectangular"
              height={50}
              sx={{ marginBottom: 2 }}
            />
            <Skeleton
              variant="rectangular"
              height={50}
              sx={{ marginBottom: 2 }}
            />
          </Box>
        ) : (
          <>
            {newQuestionnaires.length > 0 && (
              <Accordion sx={{ backgroundColor: "transparent" }}>
                <AccordionSummary
                  expandIcon={<ExpandMoreIcon />}
                  aria-controls="panel1-content-new"
                  id="panel1-header-new"
                >
                  <h1 style={{ textDecoration: "underline" }}>
                    {t("patientQuestionnaireComponent.newForms")}
                  </h1>
                </AccordionSummary>
                <AccordionDetails>
                  {newQuestionnaires.map((newQues, index) => (
                    <div key={index}>
                      <QuestionnaireComponent
                        questionnaire={newQues}
                        subjectId={patientID}
                        encounterId={encounterID}
                      ></QuestionnaireComponent>
                    </div>
                  ))}
                </AccordionDetails>
              </Accordion>
            )}
            <div>
              {Object.keys(questionnaires).length > 0 && (
                <div>
                  {Object.entries(questionnaires).map(
                    ([questionnaireId, questionnaire]) => (
                      <Accordion
                        key={questionnaireId}
                        sx={{ backgroundColor: "transparent" }}
                      >
                        <AccordionSummary
                          expandIcon={<ExpandMoreIcon />}
                          aria-controls={`panel-${questionnaireId}-content`}
                          id={`panel-${questionnaireId}-header`}
                        >
                          <h1 style={{ textDecoration: "underline" }}>
                            {questionnaire.title ||
                              t("patientQuestionnaireComponent.untitled")}
                          </h1>
                        </AccordionSummary>
                        <AccordionDetails>
                          {questionnaireResponses
                            .filter(
                              (quesRes) =>
                                quesRes.questionnaire === questionnaireId
                            )
                            .map((quesRes, index) => (
                              <Accordion
                                key={index}
                                sx={{
                                  backgroundColor: "transparent",
                                  marginBottom: "10px",
                                }}
                              >
                                <AccordionSummary
                                  expandIcon={<ExpandMoreIcon />}
                                  aria-controls={`panel-${questionnaireId}-${index}-content`}
                                  id={`panel-${questionnaireId}-${index}-header`}
                                >
                                  <h2>
                                    {quesRes.authored
                                      ? new Date(
                                          quesRes.authored
                                        ).toLocaleString()
                                      : t(
                                          "patientQuestionnaireComponent.unknownDate"
                                        )}
                                  </h2>
                                </AccordionSummary>
                                <AccordionDetails>
                                  <div style={{ paddingBottom: "20px" }}>
                                    <QuestionnaireComponent
                                      questionnaire={questionnaire}
                                      questionnaireResponse={quesRes}
                                      subjectId={patientID}
                                      encounterId={encounterID}
                                    ></QuestionnaireComponent>
                                  </div>
                                </AccordionDetails>
                              </Accordion>
                            ))}
                        </AccordionDetails>
                      </Accordion>
                    )
                  )}
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
