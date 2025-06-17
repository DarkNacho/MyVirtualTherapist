import { useEffect, useState } from "react";
import { Questionnaire, QuestionnaireResponse } from "fhir/r4";
import QuestionnaireComponent from "../Questionnaire/QuestionnaireComponent";
import QuestionnaireListComponent from "../Questionnaire/QuestionnaireListDialogComponent";
import QuestionnaireModalComponent from "./QuestionnaireModalComponent";
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
  const [selectedQuestionnaire, setSelectedQuestionnaire] =
    useState<Questionnaire | null>(null);
  const [questionnaireDialogOpen, setQuestionnaireDialogOpen] = useState(false);
  const [loading, setLoading] = useState<boolean>(true);

  const { t } = useTranslation();

  const handleQuesSelect = (ques: Questionnaire) => {
    setSelectedQuestionnaire(ques);
    setQuestionnaireDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setQuestionnaireDialogOpen(false);
    // Optional: clear the selected questionnaire when dialog is closed
    // setSelectedQuestionnaire(null);
  };

  const fetchQuestionnaireResponses = async () => {
    try {
      setLoading(true);
      const responseBundle = await questionnaireResponseService.getResources({
        subject: patientID,
        encounter: encounterID!,
        _count: 999,
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
      setLoading(false);
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
          />
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
          <div>
            {Object.keys(questionnaires).length > 0 && (
              <div>
                {Object.entries(questionnaires).map(
                  ([questionnaireId, questionnaire]) => (
                    <Accordion
                      key={questionnaireId}
                      sx={{
                        backgroundColor: "#E3F2FD",
                        borderRadius: "8px",
                        boxShadow: "none",
                        marginBottom: "10px",
                        "&:before": {
                          display: "none",
                        },
                      }}
                    >
                      <AccordionSummary
                        expandIcon={
                          <ExpandMoreIcon sx={{ color: "#FFFFFF" }} />
                        }
                        aria-controls={`panel-${questionnaireId}-content`}
                        id={`panel-${questionnaireId}-header`}
                        sx={{
                          background: {
                            xs: "linear-gradient(to right, #FFFFFF 75%, #1976D2 25%)",
                            sm: "linear-gradient(to right, #FFFFFF 90%, #1976D2 10%)",
                          },
                          color: "#000000",
                          borderRadius: "8px",
                          padding: "10px 16px",
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                          "& .MuiAccordionSummary-content": {
                            margin: 0,
                          },
                        }}
                      >
                        <span style={{ fontWeight: "bold", fontSize: "1rem" }}>
                          {questionnaire.title ||
                            t("patientQuestionnaireComponent.untitled")}
                        </span>
                        <span
                          style={{
                            marginLeft: "auto",
                            fontSize: "0.9rem",
                            color: "#FFFFFF",
                            textDecoration: "underline",
                          }}
                        >
                          Ver más
                        </span>
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
                                <h2 style={{ color: "#1976D2" }}>
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
                                  />
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
        )}
      </div>

      {/* Use the new QuestionnaireModalComponent */}
      <QuestionnaireModalComponent
        open={questionnaireDialogOpen}
        onClose={handleCloseDialog}
        questionnaire={selectedQuestionnaire}
        subjectId={patientID}
        encounterId={encounterID}
      />
    </div>
  );
}
