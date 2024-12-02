import { Observation, Condition } from "fhir/r4";
import { InfoListData } from "../../Models/InfoList";
import { ObservationFormData } from "../../Models/Forms/ObservationForm";
import dayjs from "dayjs";
import ObservationService from "../ObservationService";

interface ObservationReport {
  code: string;
  system: string;
  value: string; // Adjust based on actual type of value
  issued: string;
  performer: string;
  subject: string;
  encounter: string;
  interpretation: string;
  note: string;
}
export default class ObservationUtils {
  public static getValue(observation: Observation) {
    if (!observation) return "";
    if (observation.valueQuantity) {
      return `${observation.valueQuantity.value}${
        observation.valueQuantity.code
          ? ` ${observation.valueQuantity.code}`
          : ""
      }`;
    }

    if (observation.valueCodeableConcept) {
      return (
        observation.valueCodeableConcept.text || "Unknown Value CodeableConcept"
      );
    }

    if (typeof observation.valueString !== "undefined") {
      return observation.valueString;
    }

    if (typeof observation.valueBoolean !== "undefined") {
      return observation.valueBoolean ? "True" : "False";
    }

    if (typeof observation.valueInteger !== "undefined") {
      return observation.valueInteger.toString();
    }

    if (observation.valueRange) {
      const low = observation.valueRange.low?.value;
      const high = observation.valueRange.high?.value;
      const unit = observation.valueRange.low?.unit || "";
      return low !== undefined && high !== undefined
        ? `${low} - ${high} ${unit}`
        : "Unknown ValueRange";
    }

    if (observation.valueRatio) {
      const numerator = observation.valueRatio.numerator?.value;
      const denominator = observation.valueRatio.denominator?.value;
      return numerator !== undefined && denominator !== undefined
        ? `${numerator} / ${denominator}`
        : "Unknown ValueRatio";
    }

    if (observation.valueSampledData) {
      return "SampledData";
    }

    if (typeof observation.valueTime !== "undefined") {
      return observation.valueTime;
    }

    if (typeof observation.valueDateTime !== "undefined") {
      return observation.valueDateTime;
    }

    if (observation.valuePeriod) {
      return `Start: ${observation.valuePeriod.start}, End: ${observation.valuePeriod.end}`;
    }

    return "Unknown Value";
  }

  public static getName(observation: Observation) {
    const name =
      observation.code?.coding?.[0]?.display ||
      observation.code?.text ||
      (observation.code?.coding?.[0]?.system &&
      observation.code?.coding?.[0]?.code
        ? `${observation.code.coding[0].system} - ${observation.code.coding[0].code}`
        : "Unknown Name");

    return name;
  }

  public static extractObservationInfo(
    observations: Observation[]
  ): InfoListData[] {
    return observations.map((observation) => {
      const id = observation.id;
      const name = this.getName(observation);
      const value = this.getValue(observation);
      return { id, name, value };
    });
  }

  public static ObservationToCondition(observation: Observation): Condition {
    const condition: Condition = {
      resourceType: "Condition",
      id: observation.id,
      subject: observation.subject!,
      encounter: observation.encounter,
      code: {
        coding: observation.code.coding,
        text: observation.code.text,
      },
      evidence: observation.hasMember
        ? [
            {
              detail: observation.hasMember.map((member) => ({
                reference: member.reference,
              })),
            },
          ]
        : undefined,
      extension: observation.extension,
      onsetString: ObservationUtils.getValue(observation),
    };
    return condition;
  }

  public static getFirstPerformerId(
    observation: Observation
  ): string | undefined {
    if (observation.performer && observation.performer.length > 0) {
      const reference = observation.performer[0].reference;
      return reference?.split("/")[1];
    }
    return undefined;
  }

  public static getEncounterId(observation: Observation): string | undefined {
    if (!observation) return undefined;

    if (observation.encounter?.reference?.length ?? 0 > 0) {
      const reference = observation.encounter?.reference;
      return reference?.split("/")[1];
    }
    return undefined;
  }

  public static ObservationFormDataToObservation(
    data: ObservationFormData
  ): Observation {
    return {
      ...data,
      valueString: data.valueString,
      subject: {
        reference: `Patient/${data.subject.id}`,
        display: data.subject.display,
      },
      encounter: {
        reference: `Encounter/${data.encounter.id}`,
        display: data.encounter.display,
      },
      performer: [
        {
          reference: `Practitioner/${data.performer.id}`,
          display: data.performer.display,
        },
      ],
      category: [{ coding: data.category }], //TODO: cardinality a muchos, por lo que debería cambiarlo a lista en vez de sólo un item
      code: { coding: [data.code] },
      interpretation: [{ coding: data.interpretation }],
      issued: dayjs(data.issued).toISOString(),
      note: [{ text: data.note }],

      resourceType: "Observation",
      status: "unknown",
    } as Observation;
  }

  public static ObservationReport(data: Observation): ObservationReport {
    return {
      code: data.code?.coding?.[0]?.code || "",
      system: data.code?.coding?.[0]?.system || "",
      value: ObservationUtils.getValue(data),
      issued: dayjs(data.issued).format("DD-MM-YYYY HH:mm"),
      performer: data.performer?.[0]?.display || "",
      subject: data.subject?.display || "",
      encounter: data.encounter?.display || "",
      interpretation: data.interpretation?.[0]?.coding?.[0]?.display || "",
      note: data.note?.[0]?.text || "",
    } as ObservationReport;
  }
  public static async generatePatientObservationReport(
    patientId: string
  ): Promise<ObservationReport[]> {
    const observations: Observation[] = [];
    const observationService = new ObservationService();
    const response = await observationService.getResources({
      subject: patientId,
      _count: 100,
    });
    if (!response.success) {
      throw new Error("Error al obtener observaciones");
    }
    observations.push(...response.data);
    while (observationService.hasNextPage) {
      const nextPage = await observationService.getNewResources("next");
      if (!nextPage.success) {
        throw new Error("Error al obtener observaciones");
      }
      observations.push(...nextPage.data);
    }
    return observations.map((observation) =>
      this.ObservationReport(observation)
    );
  }
}
