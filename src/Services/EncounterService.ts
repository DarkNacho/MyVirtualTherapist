import { Encounter } from "fhir/r4";
import FhirResourceService from "./FhirService";

export default class EncounterService extends FhirResourceService<Encounter> {
  constructor() {
    super("Encounter");
  }

  private addClinicalNoteExtension(
    encounter: Encounter,
    note: string
  ): Encounter {
    const extension = {
      url: "http://cttn.cl/fhir/StructureDefinition/encounter-clinical-note",
      valueString: note,
    };

    return {
      ...encounter,
      extension: encounter.extension
        ? [...encounter.extension, extension]
        : [extension],
    };
  }

  private updateClinicalNoteExtension(
    encounter: Encounter,
    newNote: string
  ): Encounter {
    const extensionUrl =
      "http://cttn.cl/fhir/StructureDefinition/encounter-clinical-note";
    const existingExtensionIndex = encounter.extension?.findIndex(
      (ext) => ext.url === extensionUrl
    );

    if (existingExtensionIndex !== undefined && existingExtensionIndex !== -1) {
      const updatedExtensions = encounter.extension
        ? [...encounter.extension]
        : [];
      updatedExtensions[existingExtensionIndex] = {
        ...updatedExtensions[existingExtensionIndex],
        valueString: newNote,
      };
      return {
        ...encounter,
        extension: updatedExtensions,
      };
    } else {
      return this.addClinicalNoteExtension(encounter, newNote);
    }
  }

  public setClinicalNote(encounter: Encounter, note: string): Encounter {
    const extensionUrl =
      "http://cttn.cl/fhir/StructureDefinition/encounter-clinical-note";
    const existingExtension = encounter.extension?.some(
      (ext) => ext.url === extensionUrl
    );

    if (existingExtension) {
      return this.updateClinicalNoteExtension(encounter, note);
    } else {
      return this.addClinicalNoteExtension(encounter, note);
    }
  }

  public getClinicalNoteExtension(encounter: Encounter): string {
    const extensionUrl =
      "http://cttn.cl/fhir/StructureDefinition/encounter-clinical-note";
    const extension = encounter.extension?.find(
      (ext) => ext.url === extensionUrl
    );
    return extension?.valueString || "";
  }
}
