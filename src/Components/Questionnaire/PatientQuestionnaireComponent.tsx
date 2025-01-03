import { useEffect, useState } from "react";
import { Questionnaire, QuestionnaireResponse } from "fhir/r4";
import QuestionnaireComponent from "../Questionnaire/QuestionnaireComponent";
import QuestionnaireListComponent from "../Questionnaire/QuestionnaireListDialogComponent";
import { Accordion, AccordionDetails, AccordionSummary } from "@mui/material";
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

  const { t } = useTranslation();

  const handleQuesSelect = (ques: Questionnaire) => {
    setNewQuestionnaires((prevQuestionnaires) => [ques, ...prevQuestionnaires]);
    console.log("Questionario seleccionado", ques);
  };

  const fetchQuestionnaireResponses = async () => {
    try {
      const responseBundle = await questionnaireResponseService.getResources({
        subject: patientID,
        encounter: encounterID!,
      });
      if (!responseBundle.success) throw Error(responseBundle.error);

      console.log(responseBundle.data);
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
      console.log("entro al catch");
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
      </div>
      <div>
        {Object.keys(questionnaires).length > 0 && (
          <Accordion defaultExpanded sx={{ backgroundColor: "transparent" }}>
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              aria-controls="panel1-content-old"
              id="panel1-header-old"
            >
              <h1 style={{ textDecoration: "underline" }}>
                {t("patientQuestionnaireComponent.loadedForms")}
              </h1>
            </AccordionSummary>
            <AccordionDetails>
              {Object.keys(questionnaires).length > 0 && (
                <div>
                  {questionnaireResponses.map(
                    (quesRes, index) =>
                      quesRes.questionnaire && (
                        <div style={{ paddingBottom: "50px" }} key={index}>
                          <QuestionnaireComponent
                            questionnaire={
                              questionnaires[quesRes.questionnaire]
                            }
                            questionnaireResponse={quesRes}
                            subjectId={patientID}
                            encounterId={encounterID}
                          ></QuestionnaireComponent>
                        </div>
                      )
                  )}
                </div>
              )}
            </AccordionDetails>
          </Accordion>
        )}
      </div>
    </div>
  );
}
