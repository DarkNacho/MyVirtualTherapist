import { Dayjs } from "dayjs";
import { Coding } from "fhir/r4";

export interface PractitionerFormData {
  id?: string;
  avatar?: File | null;
  practitionerId?: string;
  nombre: string;
  segundoNombre: string;
  apellidoPaterno: string;
  apellidoMaterno: string;
  fechaNacimiento: Dayjs;
  genero: string;
  rut: string;
  numeroTelefonico: string;
  email: string;
  //photo: string;
  specialty: Coding[];
  role: Coding[];
  practitionerRoleId?: string;
  agendaUrl?: string; //TODO: hacerlo obligatorio
}
