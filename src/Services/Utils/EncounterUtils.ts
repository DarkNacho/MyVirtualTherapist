import { Encounter, Period, Reference } from "fhir/r4";
import { loadUserRoleFromLocalStorage } from "../../Utils/RolUser";

/**
 * Utility class for working with Encounter objects.
 */
export default class EncounterUtils {
  /**
   * Pads a number with zeros.
   * @param number - The number to pad.
   * @returns The padded number as a string.
   */
  private static padZero(number: number): string {
    return number.toString().padStart(2, "0");
  }

  /**
   * Formats the start and end dates of a period.
   * @param period - The period object.
   * @returns The formatted period as a string.
   */
  public static getFormatPeriod(period: Period): string {
    if (!period) return "N/A"; //throw new Error("Period is required.");

    if (!period.start) return "N/A";

    const startDate = new Date(period.start);

    const formattedStartDate = `${this.padZero(
      startDate.getDate()
    )}-${this.padZero(
      startDate.getMonth() + 1
    )}-${startDate.getFullYear()} ${this.padZero(
      startDate.getHours()
    )}:${this.padZero(startDate.getMinutes())}`;

    if (!period.end) return formattedStartDate;

    const endDate = new Date(period.end);
    const formattedEndDate = `${this.padZero(
      endDate.getHours()
    )}:${this.padZero(endDate.getMinutes())}`;

    return `${formattedStartDate} - ${formattedEndDate}`;
  }

  public static getPeriod(period: Period): string {
    if (!period) return "N/A"; //throw new Error("Period is required.");

    if (!period.start) return "N/A";

    const startDate = new Date(period.start);

    const formattedStartDate = `${this.padZero(
      startDate.getHours()
    )}:${this.padZero(startDate.getMinutes())}`;

    if (!period.end) return formattedStartDate;

    const endDate = new Date(period.end);
    const formattedEndDate = `${this.padZero(
      endDate.getHours()
    )}:${this.padZero(endDate.getMinutes())}`;

    return `${formattedStartDate} - ${formattedEndDate}`;
  }

  public static getDisplay(resource: Encounter): string {
    const roleUser = loadUserRoleFromLocalStorage();
    let display = "";

    if (roleUser === "Admin")
      display = `Paciente: ${this.getSubjectDisplayOrID(resource.subject!)}
  Profesional: ${this.getPrimaryPractitioner(resource)}`;

    if (roleUser == "Patient")
      display = `Profesional: ${this.getPrimaryPractitioner(resource)}`;
    if (roleUser == "Practitioner")
      display = `Paciente: ${this.getSubjectDisplayOrID(resource.subject!)}`;

    return `  ${display}
  ${EncounterUtils.getFormatPeriod(resource.period!)}`;
  }
  /**
   * Gets the display name or ID of the subject.
   * @param subject - The subject object.
   * @returns The display name or ID of the subject as a string.
   */
  public static getSubjectDisplayOrID(subject: Reference): string {
    if (!subject) return "N/A"; //throw new Error("Subject is required.");
    if (subject.display) return subject.display;

    return this.getSubjectID(subject);
  }

  /**
   * Gets the ID of the subject.
   * @param subject - The subject object.
   * @returns The ID of the subject as a string.
   */
  public static getSubjectID(subject: Reference): string {
    if (!subject) return "N/A"; //throw new Error("Subject is required.");
    if (!subject.reference) return "N/A";

    // Extracting the ID from the reference (e.g., "Patient/123")
    const id = subject.reference.split("/")[1];
    return id ? id : subject.reference;
  }

  /**
   * Gets the primary practitioner of the encounter.
   * @param encounter - The encounter object.
   * @returns The display name or ID of the primary practitioner as a string.
   */
  public static getPrimaryPractitioner(encounter: Encounter): string {
    if (!encounter) return "N/A"; //throw new Error("Encounter is required.");

    const participants = encounter.participant || [];

    const primaryPerformer = participants.find((participant) => {
      return (
        participant.type &&
        participant.type.some(
          (type) =>
            type.coding &&
            type.coding.some(
              (coding) =>
                coding.system ===
                  "http://terminology.hl7.org/CodeSystem/v3-ParticipationType" &&
                coding.code === "PPRF"
            )
        )
      );
    });

    if (primaryPerformer) {
      return this.getSubjectDisplayOrID(primaryPerformer.individual!);
    }

    const firstParticipant = participants[0];
    if (firstParticipant) {
      return this.getSubjectDisplayOrID(firstParticipant.individual!);
    }
    return "N/A";
  }
}
