import { Dayjs } from "dayjs";
import { Coding } from "fhir/r4";

export interface PatientFormData {
  id?: string;
  avatar?: File;
  nombre: string;
  segundoNombre: string;
  apellidoPaterno: string;
  apellidoMaterno: string;
  fechaNacimiento: Dayjs;
  genero: string;
  rut: string;
  numeroTelefonico: string;
  email: string;
  region: string;
  ciudad: string;
  direccion: string;
  //photo: string;
  maritalStatus: Coding;
  contact: {
    nombre: string;
    segundoNombre: string;
    apellidoPaterno: string;
    apellidoMaterno: string;
    contactType: string;
    email: string;
    numeroTelefonico: string;
  }[];
}
