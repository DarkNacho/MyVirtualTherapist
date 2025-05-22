type CustomLogicFn = (qr: any, questionnaire: any) => void;

const customLogicRegistry: Record<string, CustomLogicFn> = {
  "356": (qr, questionnaire) => {
    // IMC calculation for Questionnaire id "356"
    if (!qr || !qr.item) {
      console.warn(
        "Custom logic: QuestionnaireResponse or items are undefined."
      );
      return;
    }
    const findItem = (linkId: string) =>
      qr.item.find((item: any) => item.linkId === linkId);

    const weightItem = findItem("weight");
    const heightItem = findItem("height");
    const bmiItem = findItem("bmi");

    const weight = weightItem?.answer?.[0]?.valueDecimal;
    let height = heightItem?.answer?.[0]?.valueDecimal;

    // Convert height from cm to meters if necessary
    if (height && height > 10) {
      console.log("Custom logic (356): Converting height from cm to meters.");
      height = height / 100;
    }

    // Log values for debugging
    console.log(
      "Custom logic (356): weight =",
      weight,
      "height =",
      height,
      "bmiItem =",
      bmiItem
    );

    if (weight && height) {
      const imc = Math.round((weight / (height * height)) * 100) / 100;
      console.log("Custom logic (356): Calculated IMC =", imc);
      if (bmiItem) {
        bmiItem.answer = [{ valueDecimal: imc }];
      } else {
        qr.item.push({
          linkId: "bmi",
          answer: [{ valueDecimal: imc }],
        });
      }
    } else if (bmiItem) {
      bmiItem.answer = [];
    }
  },
  // ...other custom logic...
};

export function applyCustomLogic(
  questionnaireId: string,
  qr: any,
  questionnaire: any
) {
  if (customLogicRegistry[questionnaireId]) {
    console.log("Applying custom logic for questionnaire:", questionnaireId);
    customLogicRegistry[questionnaireId](qr, questionnaire);
  } else {
    console.log("No custom logic for questionnaire:", questionnaireId);
  }
}
