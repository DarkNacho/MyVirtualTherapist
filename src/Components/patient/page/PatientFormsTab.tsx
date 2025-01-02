import PatientQuestionnaireComponent from "../../Questionnaire/PatientQuestionnaireComponent";

export default function PatientFormsTab({ id }: { id: string }) {
  return <PatientQuestionnaireComponent patientID={id} />;
}
