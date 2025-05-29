import {
  Attachment,
  Patient,
  Person,
  Practitioner,
  PractitionerRole,
} from "fhir/r4";
import { PatientFormData } from "../../Models/Forms/PatientForm";
import dayjs from "dayjs";
import { PractitionerFormData } from "../../Models/Forms/PractitionerForm";

type FhirResourceType = Patient | Practitioner | Person;

/**
 * Utility class for working with person-related resources.
 */
export default class PersonUtil {
  /**
   * Formats a Chilean RUT (Rol Único Tributario) number.
   * @param rut - The RUT number to format.
   * @returns The formatted RUT with dots and hyphen.
   */
  static formatRut(rut: string): string {
    // Remove any existing dots or hyphens
    rut = rut.replace(/\./g, "").replace(/-/g, "");

    // Extract the verifier digit and the main number
    const dv = rut.slice(-1);
    const rutNumerico = rut.slice(0, -1);

    // Add dots every three digits from the end
    const rutConPuntos = rutNumerico.replace(/\B(?=(\d{3})+(?!\d))/g, ".");

    // Return the formatted RUT with a hyphen before the verifier digit
    return `${rutConPuntos}-${dv}`;
  }

  /**
   * Retrieves the person's name as a string.
   * @param resource - The FHIR resource representing a person.
   * @returns The person's name as a string.
   */
  static getPersonNameAsString(resource: FhirResourceType): string {
    let name = "";

    // Try to get the name using resource.name[0].text
    if (resource.name && resource.name[0] && resource.name[0].text) {
      name = resource.name[0].text;
    } else if (resource.name && resource.name[0]) {
      // Try to get the name using resource.name[0].given and resource.name[0].family
      const givenNames = resource.name[0].given
        ? resource.name[0].given.join(" ")
        : "";
      const familyName = resource.name[0].family ? resource.name[0].family : "";
      name = `${givenNames} ${familyName}`;
    } else if (
      // eslint-disable-next-line no-dupe-else-if
      resource.name &&
      resource.name[0] &&
      resource.name[0].use === "official"
    ) {
      // Try to get the name using resource.name[0].prefix, resource.name[0].given, and resource.name[0].family
      const prefix = resource.name[0].prefix
        ? resource.name[0].prefix.join(" ")
        : "";
      const givenNames = resource.name[0].given
        ? resource.name[0].given.join(" ")
        : "";
      const familyName = resource.name[0].family ? resource.name[0].family : "";
      name = `${prefix} ${givenNames} ${familyName}`;
    }

    return name;
  }

  /**
   * Calculates the age based on the given date of birth.
   * @param fechaNacimiento - The date of birth in string format.
   * @returns The calculated age.
   */
  static calcularEdad(fechaNacimiento: string): number {
    if (!fechaNacimiento) return 0;
    const hoy = new Date();
    const fechaNac = new Date(fechaNacimiento);
    let edad = hoy.getFullYear() - fechaNac.getFullYear();
    const mes = hoy.getMonth() - fechaNac.getMonth();

    if (mes < 0 || (mes === 0 && hoy.getDate() < fechaNac.getDate())) {
      edad--;
    }

    return edad;
  }

  /**
   * Retrieves the first contact point of the specified system as a string.
   * @param recurso - The FHIR resource representing a person.
   * @param system - The contact point system to retrieve (e.g., 'phone', 'email').
   * @returns The first contact point of the specified system as a string, or 'N/A' if not found.
   */
  static getContactPointFirstOrDefaultAsString(
    recurso: FhirResourceType,
    system: "phone" | "fax" | "email" | "pager" | "url" | "sms" | "other"
  ): string {
    if (recurso && recurso.telecom && Array.isArray(recurso.telecom)) {
      const contactPoint = recurso.telecom.find(
        (contacto) => contacto.system === system && contacto.value
      );
      if (contactPoint) {
        return contactPoint.value || "N/A";
      }
    }
    return "N/A";
  }

  /**
   * Retrieves the first identifier or ID of the resource as a string.
   * @param resource - The FHIR resource representing a person.
   * @returns The first identifier value or ID of the resource as a string.
   */
  static getFirstIdentifierOrDefault(resource: FhirResourceType) {
    if (resource.identifier && resource.identifier.length > 0) {
      // Return the value of the first identifier if it exists
      return resource.identifier[0];
    }
    return { system: "ID", value: resource.id };
  }

  /**
   * Retrieves an identifier based on the code.
   * @param resource - The FHIR resource representing a person.
   * @param code - The code of the identifier to retrieve.
   * @returns The identifier with the specified code, or an empty string if no such identifier exists.
   */
  static getIdentifierByCode(resource: FhirResourceType, code: string) {
    if (resource.identifier && resource.identifier.length > 0) {
      // Find the identifier with the specified code
      const identifier = resource.identifier.find((id) => id.system === code);
      // If the identifier exists, return its value
      if (identifier) {
        return identifier;
      }
    }
    return this.getFirstIdentifierOrDefault(resource);
  }

  /**
   * Retrieves the marital status of a patient.
   *
   * @param resource - The patient resource.
   * @returns The marital status of the patient, or "N/A" if not available.
   */
  static getMaritalStatus(resource: Patient): string {
    if (
      resource &&
      resource.maritalStatus &&
      resource.maritalStatus.coding &&
      resource.maritalStatus.coding.length > 0
    ) {
      return (
        resource.maritalStatus.coding[0].display ||
        resource.maritalStatus.coding[0].code ||
        "das"
      );
    } else if (
      resource &&
      resource.maritalStatus &&
      resource.maritalStatus.text
    ) {
      return resource.maritalStatus.text;
    }
    return "N/A";
  }

  /**
   * Validates a Chilean RUT (Rol Único Tributario) number.
   * @param rut - The RUT number to validate.
   * @returns A boolean indicating whether the RUT is valid or not.
   */
  static RutValidation = (rut: string) => {
    // Eliminar puntos y guiones del RUT y convertir la letra a mayúscula
    rut = rut.replace(/\./g, "").replace(/-/g, "").toUpperCase();

    // Extraer dígito verificador y número
    const dv = rut.slice(-1);
    let rutNumerico = parseInt(rut.slice(0, -1), 10);

    // Calcular dígito verificador esperado
    let m = 0;
    let s = 1;
    for (; rutNumerico; rutNumerico = Math.floor(rutNumerico / 10)) {
      s = (s + (rutNumerico % 10) * (9 - (m++ % 6))) % 11;
    }

    const dvEsperado = (s ? s - 1 : "K").toString();

    // Verificar si el dígito verificador es correcto
    return dv === dvEsperado;
  };

  /**
   * Retrieves the gender of a person.
   *
   * @param resource - The FHIR resource representing a person.
   * @returns The gender of the person, or "N/A" if not available.
   */
  static getGender(resource: FhirResourceType): string {
    if (resource.gender === undefined) return "N/A";

    const genderMap: Record<string, string> = {
      male: "masculino",
      female: "femenino",
      other: "otro",
      unknown: "desconocido",
    };
    return genderMap[resource.gender] || "N/A";
  }
  static fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        if (reader.result) {
          resolve(reader.result.toString().split(",")[1]);
        } else {
          reject(new Error("File reading failed"));
        }
      };
      reader.onerror = (error) => reject(error);
    });
  };

  static attachmentToFile = (attachment: Attachment): File | undefined => {
    if (!attachment || !attachment.data) {
      return undefined;
    }

    const byteString = atob(attachment.data);
    const arrayBuffer = new ArrayBuffer(byteString.length);
    const uint8Array = new Uint8Array(arrayBuffer);

    for (let i = 0; i < byteString.length; i++) {
      uint8Array[i] = byteString.charCodeAt(i);
    }

    const blob = new Blob([uint8Array], { type: attachment.contentType });
    const file = new File([blob], "attachment", {
      type: attachment.contentType,
    });

    return file;
  };

  static PatientFormToPatient = async (
    data: PatientFormData
  ): Promise<Patient> => {
    const rut = data.rut.replace(/\./g, "").replace(/-/g, "").toUpperCase();
    let avatar: Attachment[] | undefined;

    if (data.avatar) {
      const avatarBase64 = await this.fileToBase64(data.avatar);
      avatar = [
        {
          contentType: data.avatar.type, // MIME type of the file
          data: avatarBase64,
        },
      ];
    }
    return {
      resourceType: "Patient",
      id: data.id,
      identifier: [{ system: "RUT", value: rut }],
      name: [
        {
          family: data.apellidoPaterno,
          given: [data.nombre, data.segundoNombre],
          suffix: [data.apellidoMaterno],
          text: `${data.nombre} ${data.segundoNombre} ${data.apellidoPaterno} ${data.apellidoMaterno}`,
        },
      ],
      birthDate: data.fechaNacimiento.toISOString(),
      gender: data.genero as "male" | "female" | "other" | "unknown",
      telecom: [
        {
          system: "phone",
          value: data.numeroTelefonico,
        },
        { system: "email", value: data.email },
      ],
      maritalStatus: {
        coding: data.maritalStatus ? [data.maritalStatus] : undefined,
      },
      photo: avatar,
      contact: data.contact?.map((contact) => {
        return {
          name: {
            given: [contact.nombre, contact.segundoNombre],
            family: contact.apellidoPaterno,
            suffix: [contact.apellidoMaterno],
          },
          telecom: [
            {
              system: "phone",
              value: contact.numeroTelefonico,
            },
            {
              system: "email",
              value: contact.email,
            },
          ],
          relationship: [
            {
              coding: [
                {
                  code: contact.contactType,
                },
              ],
            },
          ],
        };
      }),
    };
  };

  static PatientToPatientForm = (patient: Patient): PatientFormData => {
    const rut =
      patient.identifier?.find((t) => t.system === "RUT")?.value || "";
    const name = patient.name?.[0] ?? {};
    const telecomPhone =
      patient.telecom?.find((t) => t.system === "phone")?.value || "";
    const telecomEmail =
      patient.telecom?.find((t) => t.system === "email")?.value || "";

    const gender = patient.gender || "unknown";

    const avatarAttachment = patient.photo?.[0];
    const avatar = this.attachmentToFile(avatarAttachment!);

    return {
      id: patient.id,
      rut: rut,
      nombre: name.given?.[0] ?? "",
      segundoNombre: name.given?.[1] ?? "",
      apellidoPaterno: name.family || "",
      apellidoMaterno: name.suffix ? name.suffix[0] : "",
      fechaNacimiento: patient.birthDate
        ? dayjs(patient.birthDate)
        : dayjs().subtract(18, "years"),
      genero: gender,
      numeroTelefonico: telecomPhone,
      email: telecomEmail || "",
      maritalStatus: patient.maritalStatus?.coding?.[0] || {},
      avatar: avatar,
      //photo: patient.photo?.[0].url || "",
      contact:
        patient.contact?.map((contact) => {
          const contactName = contact.name || {};
          const phoneContact =
            contact.telecom?.find((t) => t.system === "phone")?.value || "";
          const emailContact =
            contact.telecom?.find((t) => t.system === "email")?.value || "";
          const relationshipCoding =
            contact.relationship?.[0]?.coding?.[0]?.code || "";

          return {
            nombre: contactName.given?.[0] || "",
            segundoNombre: contactName.given?.[1] || "",
            apellidoPaterno: contactName.family || "",
            apellidoMaterno: contactName.suffix?.[0] || "",
            contactType: relationshipCoding,
            email: emailContact,
            numeroTelefonico: phoneContact,
          };
        }) || [],
    };
  };

  static async PractitionerFormToPractitioner(
    data: PractitionerFormData
  ): Promise<{
    practitioner: Practitioner;
    practitionerRole: PractitionerRole;
  }> {
    const rut = data.rut.replace(/\./g, "").replace(/-/g, "").toUpperCase();
    let avatar: Attachment[] | undefined;

    if (data.avatar) {
      const avatarBase64 = await this.fileToBase64(data.avatar);
      avatar = [
        {
          contentType: data.avatar.type, // MIME type of the file
          data: avatarBase64,
        },
      ];
    }

    const practitioner: Practitioner = {
      resourceType: "Practitioner",
      id: data.practitionerId,
      identifier: [{ system: "RUT", value: rut }],
      name: [
        {
          family: data.apellidoPaterno,
          given: [data.nombre, data.segundoNombre],
          suffix: [data.apellidoMaterno],
          text: `${data.nombre} ${data.segundoNombre} ${data.apellidoPaterno} ${data.apellidoMaterno}`,
        },
      ],
      birthDate: data.fechaNacimiento.toISOString(),
      gender: data.genero as "male" | "female" | "other" | "unknown",
      telecom: [
        {
          system: "phone",
          value: data.numeroTelefonico,
        },
        { system: "email", value: data.email },
        { system: "url", use: "work", rank: 99, value: data.agendaUrl }, //!WARNING: rank: 99 is usado para especificar que corresponde a url de agenda.
      ],
      photo: avatar,
      //photo: [{ url: data.photo }],
    };

    const practitionerRole: PractitionerRole = {
      resourceType: "PractitionerRole",
      id: data.practitionerRoleId,
      code: [{ coding: data.role }],
      specialty: [{ coding: data.specialty }],
    };

    return { practitioner, practitionerRole };
  }

  static PractitionerToPractitionerForm = (
    practitioner: Practitioner,
    practitionerRole: PractitionerRole
  ): PractitionerFormData => {
    const rut =
      practitioner.identifier?.find((t) => t.system === "RUT")?.value || "";
    const name = practitioner.name?.[0] ?? {};
    const telecomPhone =
      practitioner.telecom?.find((t) => t.system === "phone")?.value || "";
    const telecomEmail =
      practitioner.telecom?.find((t) => t.system === "email")?.value || "";

    const agendaUrl =
      practitioner.telecom?.find((t) => t.system === "url" && t.rank === 99)
        ?.value || "";

    const role = practitionerRole?.code?.[0]?.coding || [];
    const specialty = practitionerRole?.specialty?.[0]?.coding || [];

    const avatarAttachment = practitioner.photo?.[0];
    const avatar = this.attachmentToFile(avatarAttachment!);

    return {
      practitionerId: practitioner.id || undefined,
      practitionerRoleId: practitionerRole?.id || undefined,
      rut: rut,
      nombre: name.given?.[0] ?? name.text ?? "",
      segundoNombre: name.given?.[1] ?? "",
      apellidoPaterno: name.family || "",
      apellidoMaterno: name.suffix ? name.suffix[0] : "",
      fechaNacimiento: practitioner.birthDate
        ? dayjs(practitioner.birthDate)
        : dayjs().subtract(18, "years"),
      genero: practitioner.gender || "unknown",
      numeroTelefonico: telecomPhone,
      avatar: avatar,
      //photo: practitioner.photo?.[0].url || "",
      email: telecomEmail,
      specialty: specialty,
      role: role,
      agendaUrl: agendaUrl,
    };
  };
}
