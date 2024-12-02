import { Dayjs } from "dayjs";
import { Coding } from "fhir/r4";

export interface PersonConfirmPassword {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}
export interface PersonContactDetails {
  countryCode: string;
  numeroTelefonico: string;
  email: string;
}

export interface PersonContact {
  contact: {
    nombre: string;
    segundoNombre: string;
    apellidoPaterno: string;
    apellidoMaterno: string;
    contactType: string;
    email: string;
    countryCode: string;
    numeroTelefonico: string;
  }[];
}

export interface PersonDetails {
  nombre: string;
  segundoNombre: string;
  apellidoPaterno: string;
  apellidoMaterno: string;
  fechaNacimiento: Dayjs;
  genero: string;
  maritalStatus: Coding;
  rut: string;
}
