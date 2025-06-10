import { Coding } from "fhir/r4";

export const category: Coding[] = [
  {
    code: "social-history",
    display: "Historia Social",
    system: "http://terminology.hl7.org/CodeSystem/observation-category",
  },
  {
    code: "vital-signs",
    display: "Signos Vitales",
    system: "http://terminology.hl7.org/CodeSystem/observation-category",
  },
  {
    code: "imaging",
    display: "Imágenes",
    system: "http://terminology.hl7.org/CodeSystem/observation-category",
  },
  {
    code: "laboratory",
    display: "Laboratorio",
    system: "http://terminology.hl7.org/CodeSystem/observation-category",
  },
  {
    code: "procedure",
    display: "Procedimiento",
    system: "http://terminology.hl7.org/CodeSystem/observation-category",
  },
  {
    code: "survey",
    display: "Encuesta",
    system: "http://terminology.hl7.org/CodeSystem/observation-category",
  },
  {
    code: "exam",
    display: "Examen",
    system: "http://terminology.hl7.org/CodeSystem/observation-category",
  },
  {
    code: "therapy",
    display: "Terapia",
    system: "http://terminology.hl7.org/CodeSystem/observation-category",
  },
  {
    code: "activity",
    display: "Actividad",
    system: "http://terminology.hl7.org/CodeSystem/observation-category",
  },
];

export const interpretation: Coding[] = [
  {
    code: "N",
    display: "Normal",
    system:
      "http://terminology.hl7.org/CodeSystem/v3-ObservationInterpretation",
  },
  {
    code: "_GeneticObservationInterpretation icon",
    display: "Interpretación de Observación Genética",
    system:
      "http://terminology.hl7.org/CodeSystem/v3-ObservationInterpretation",
  },
  {
    code: "CAR",
    display: "Portador",
    system:
      "http://terminology.hl7.org/CodeSystem/v3-ObservationInterpretation",
  },
  {
    code: "B",
    display: "Mejor",
    system:
      "http://terminology.hl7.org/CodeSystem/v3-ObservationInterpretation",
  },
  {
    code: "D",
    display: "Cambio significativo hacia abajo",
    system:
      "http://terminology.hl7.org/CodeSystem/v3-ObservationInterpretation",
  },
  {
    code: "U",
    display: "Cambio significativo hacia arriba",
    system:
      "http://terminology.hl7.org/CodeSystem/v3-ObservationInterpretation",
  },
  {
    code: "W",
    display: "Peor",
    system:
      "http://terminology.hl7.org/CodeSystem/v3-ObservationInterpretation",
  },
  {
    code: "<",
    display: "Fuera de escala baja",
    system:
      "http://terminology.hl7.org/CodeSystem/v3-ObservationInterpretation",
  },
  {
    code: ">",
    display: "Fuera de escala alta",
    system:
      "http://terminology.hl7.org/CodeSystem/v3-ObservationInterpretation",
  },
  {
    code: "IE",
    display: "Evidencia insuficiente",
    system:
      "http://terminology.hl7.org/CodeSystem/v3-ObservationInterpretation",
  },
  {
    code: "A",
    display: "Anormal",
    system:
      "http://terminology.hl7.org/CodeSystem/v3-ObservationInterpretation",
  },
  {
    code: "AA",
    display: "Anormal crítico",
    system:
      "http://terminology.hl7.org/CodeSystem/v3-ObservationInterpretation",
  },
  {
    code: "HH",
    display: "Alto crítico",
    system:
      "http://terminology.hl7.org/CodeSystem/v3-ObservationInterpretation",
  },
  {
    code: "LL",
    display: "Bajo crítico",
    system:
      "http://terminology.hl7.org/CodeSystem/v3-ObservationInterpretation",
  },
  {
    code: "H",
    display: "Alto",
    system:
      "http://terminology.hl7.org/CodeSystem/v3-ObservationInterpretation",
  },
  {
    code: "HU",
    display: "Significativamente alto",
    system:
      "http://terminology.hl7.org/CodeSystem/v3-ObservationInterpretation",
  },
  {
    code: "L",
    display: "Bajo",
    system:
      "http://terminology.hl7.org/CodeSystem/v3-ObservationInterpretation",
  },
  {
    code: "LU",
    display: "Significativamente bajo",
    system:
      "http://terminology.hl7.org/CodeSystem/v3-ObservationInterpretation",
  },
  {
    code: "I",
    display: "Intermedio",
    system:
      "http://terminology.hl7.org/CodeSystem/v3-ObservationInterpretation",
  },
  {
    code: "NCL",
    display: "Sin punto de corte definido por CLSI",
    system:
      "http://terminology.hl7.org/CodeSystem/v3-ObservationInterpretation",
  },
  {
    code: "NS",
    display: "No susceptible",
    system:
      "http://terminology.hl7.org/CodeSystem/v3-ObservationInterpretation",
  },
  {
    code: "R",
    display: "Resistente",
    system:
      "http://terminology.hl7.org/CodeSystem/v3-ObservationInterpretation",
  },
  {
    code: "SYN-R",
    display: "Sinergia - resistente",
    system:
      "http://terminology.hl7.org/CodeSystem/v3-ObservationInterpretation",
  },
  {
    code: "S",
    display: "Susceptible",
    system:
      "http://terminology.hl7.org/CodeSystem/v3-ObservationInterpretation",
  },
  {
    code: "SSD",
    display: "Dependiente de la dosis susceptible",
    system:
      "http://terminology.hl7.org/CodeSystem/v3-ObservationInterpretation",
  },
  {
    code: "SYN-S",
    display: "Sinergia - susceptible",
    system:
      "http://terminology.hl7.org/CodeSystem/v3-ObservationInterpretation",
  },
  {
    code: "EX",
    display: "Fuera de umbral",
    system:
      "http://terminology.hl7.org/CodeSystem/v3-ObservationInterpretation",
  },
  {
    code: "HX",
    display: "Por encima del umbral alto",
    system:
      "http://terminology.hl7.org/CodeSystem/v3-ObservationInterpretation",
  },
  {
    code: "LX",
    display: "Por debajo del umbral bajo",
    system:
      "http://terminology.hl7.org/CodeSystem/v3-ObservationInterpretation",
  },
  {
    code: "ObservationInterpretationDetection",
    display: "Detección de interpretación de observación",
    system:
      "http://terminology.hl7.org/CodeSystem/v3-ObservationInterpretation",
  },
  {
    code: "IND",
    display: "Indeterminado",
    system:
      "http://terminology.hl7.org/CodeSystem/v3-ObservationInterpretation",
  },
  {
    code: "E",
    display: "Equívoco",
    system:
      "http://terminology.hl7.org/CodeSystem/v3-ObservationInterpretation",
  },
  {
    code: "NEG",
    display: "Negativo",
    system:
      "http://terminology.hl7.org/CodeSystem/v3-ObservationInterpretation",
  },
  {
    code: "ND",
    display: "No detectado",
    system:
      "http://terminology.hl7.org/CodeSystem/v3-ObservationInterpretation",
  },
  {
    code: "POS",
    display: "Positivo",
    system:
      "http://terminology.hl7.org/CodeSystem/v3-ObservationInterpretation",
  },
  {
    code: "DET",
    display: "Detectado",
    system:
      "http://terminology.hl7.org/CodeSystem/v3-ObservationInterpretation",
  },
  {
    code: "EXP",
    display: "Esperado",
    system:
      "http://terminology.hl7.org/CodeSystem/v3-ObservationInterpretation",
  },
  {
    code: "UNE",
    display: "Inesperado",
    system:
      "http://terminology.hl7.org/CodeSystem/v3-ObservationInterpretation",
  },
  {
    code: "NR",
    display: "No reactivo",
    system:
      "http://terminology.hl7.org/CodeSystem/v3-ObservationInterpretation",
  },
  {
    code: "RR",
    display: "Reactivo",
    system:
      "http://terminology.hl7.org/CodeSystem/v3-ObservationInterpretation",
  },
  {
    code: "WR",
    display: "Débilmente reactivo",
    system:
      "http://terminology.hl7.org/CodeSystem/v3-ObservationInterpretation",
  },
];
/* Tiene más opciones pero es para futura actualización a R5
export const generoOptions: Coding[] = [
  {
    code: "asked-declined",
    display: "No declarado",
    system: "http://terminology.hl7.org/CodeSystem/data-absent-reason",
  },
  {
    code: "unknown",
    display: "No especificado",
    system: "http://hl7.org/fhir/administrative-gender",
  },
  {
    code: "male",
    display: "Masculino",
    system: "http://hl7.org/fhir/administrative-gender",
  },
  {
    code: "female",
    display: "Femenino",
    system: "http://hl7.org/fhir/administrative-gender",
  },
  {
    code: "446141000124107",
    display: "Identifica como femenino",
    system: "http://snomed.info/sct",
  },
  {
    code: "446151000124109",
    display: "Identifica como masculino",
    system: "http://snomed.info/sct",
  },
  {
    code: "33791000087105",
    display: "Identifica como no-binario",
    system: "http://snomed.info/sct",
  },
  {
    code: "other",
    display: "Otro",
    system: "http://hl7.org/fhir/administrative-gender",
  },
];*/

export const generoOptions: Coding[] = [
  {
    code: "unknown",
    display: "No especificado",
    system: "http://hl7.org/fhir/administrative-gender",
  },
  {
    code: "male",
    display: "Masculino",
    system: "http://hl7.org/fhir/administrative-gender",
  },
  {
    code: "female",
    display: "Femenino",
    system: "http://hl7.org/fhir/administrative-gender",
  },
  {
    code: "other",
    display: "Otro",
    system: "http://hl7.org/fhir/administrative-gender",
  },
];

export const maritalOptions: Coding[] = [
  {
    code: "S",
    display: "Soltero",
    system: "http://terminology.hl7.org/CodeSystem/v3-MaritalStatus",
  },
  {
    code: "M",
    display: "Casado",
    system: "http://terminology.hl7.org/CodeSystem/v3-MaritalStatus",
  },
  {
    code: "C",
    display: "Conviviente",
    system: "http://terminology.hl7.org/CodeSystem/v3-MaritalStatus",
  },
  {
    code: "D",
    display: "Divorciado",
    system: "http://terminology.hl7.org/CodeSystem/v3-MaritalStatus",
  },
  {
    code: "L",
    display: "Separado",
    system: "http://terminology.hl7.org/CodeSystem/v3-MaritalStatus",
  },
  {
    code: "W",
    display: "Viudo",
    system: "http://terminology.hl7.org/CodeSystem/v3-MaritalStatus",
  },
  {
    code: "UNK",
    display: "Desconocido",
    system: "http://terminology.hl7.org/CodeSystem/v3-MaritalStatus",
  },
];

export const contactTypes: Coding[] = [
  { code: "C", display: "Contacto de Emergencia" },
  { code: "E", display: "Empleador" },
  { code: "F", display: "Agencia Federal" },
  { code: "I", display: "Compañía de Seguros" },
  { code: "N", display: "Familiar más Cercano" },
  { code: "S", display: "Agencia Estatal" },
  { code: "U", display: "Desconocido" },
];

export const countryCodes: Coding[] = [
  // América
  { code: "+1", display: "Estados Unidos / Canadá" },
  { code: "+52", display: "México" },
  { code: "+55", display: "Brasil" },
  { code: "+54", display: "Argentina" },
  { code: "+57", display: "Colombia" },
  { code: "+56", display: "Chile" },
  { code: "+58", display: "Venezuela" },
  { code: "+51", display: "Perú" },
  { code: "+593", display: "Ecuador" },
  { code: "+53", display: "Cuba" },
  { code: "+591", display: "Bolivia" },
  { code: "+506", display: "Costa Rica" },
  { code: "+507", display: "Panamá" },
  { code: "+598", display: "Uruguay" },
  // Europa
  { code: "+34", display: "España" },
  { code: "+49", display: "Alemania" },
  { code: "+33", display: "Francia" },
  { code: "+39", display: "Italia" },
  { code: "+44", display: "Reino Unido" },
  { code: "+7", display: "Rusia" },
  { code: "+380", display: "Ucrania" },
  { code: "+48", display: "Polonia" },
  { code: "+40", display: "Rumania" },
  { code: "+31", display: "Países Bajos" },
  { code: "+32", display: "Bélgica" },
  { code: "+30", display: "Grecia" },
  { code: "+351", display: "Portugal" },
  { code: "+46", display: "Suecia" },
  { code: "+47", display: "Noruega" },
  // Asia
  { code: "+86", display: "China" },
  { code: "+91", display: "India" },
  { code: "+81", display: "Japón" },
  { code: "+82", display: "Corea del Sur" },
  { code: "+62", display: "Indonesia" },
  { code: "+90", display: "Turquía" },
  { code: "+63", display: "Filipinas" },
  { code: "+66", display: "Tailandia" },
  { code: "+84", display: "Vietnam" },
  { code: "+972", display: "Israel" },
  { code: "+60", display: "Malasia" },
  { code: "+65", display: "Singapur" },
  { code: "+92", display: "Pakistán" },
  { code: "+880", display: "Bangladés" },
  { code: "+966", display: "Arabia Saudita" },
  // África
  { code: "+20", display: "Egipto" },
  { code: "+27", display: "Sudáfrica" },
  { code: "+234", display: "Nigeria" },
  { code: "+254", display: "Kenia" },
  { code: "+212", display: "Marruecos" },
  { code: "+213", display: "Argelia" },
  { code: "+256", display: "Uganda" },
  { code: "+233", display: "Ghana" },
  { code: "+237", display: "Camerún" },
  { code: "+225", display: "Costa de Marfil" },
  { code: "+221", display: "Senegal" },
  { code: "+255", display: "Tanzania" },
  { code: "+249", display: "Sudán" },
  { code: "+218", display: "Libia" },
  { code: "+216", display: "Túnez" },
  // Oceanía
  { code: "+61", display: "Australia" },
  { code: "+64", display: "Nueva Zelanda" },
  { code: "+679", display: "Fiji" },
  { code: "+675", display: "Papúa Nueva Guinea" },
  { code: "+676", display: "Tonga" },
  // Medio Oriente
  { code: "+98", display: "Irán" },
  { code: "+964", display: "Iraq" },
  { code: "+962", display: "Jordania" },
  { code: "+961", display: "Líbano" },
  { code: "+965", display: "Kuwait" },
  { code: "+971", display: "Emiratos Árabes Unidos" },
  { code: "+968", display: "Omán" },
  { code: "+974", display: "Catar" },
  { code: "+973", display: "Bahrein" },
  { code: "+967", display: "Yemen" },
];

export const encounterType: Coding[] = [
  { code: "AMB", display: "Ambulatorio" },
  { code: "VR", display: "Virtual" },
  { code: "EMER", display: "Emergencia" },
  { code: "FLD", display: "Terreno" },
  { code: "HH", display: "Domicilio" },
  { code: "IMP", display: "Hospitalaria" },
  { code: "ACUTE", display: "Hospitalización aguda" },
  { code: "NONAC", display: "Hospitalización no aguda" },
  { code: "UKN", display: "No especificado" },
];

export const clinicalStatus: Coding[] = [
  { code: "active", display: "Activo" },
  { code: "recurrence", display: "Reaparición" },
  { code: "relapse", display: "Recaída" },
  { code: "inactive", display: "Inactivo" },
  { code: "remission", display: "Remisión" },
  { code: "resolved", display: "Resuelto" },
];
/* Tiene más opciones pero es para futura actualización y posiblemente mejor traducción
export const practitionerSpecialty: Coding[] = [
  {
    code: "408467006",
    display: "Enfermedad mental en adultos",
    system: "http://snomed.info/sct",
  },
  {
    code: "394577000",
    display: "Anestesiología",
    system: "http://snomed.info/sct",
  },
  {
    code: "394578005",
    display: "Medicina Audiológica",
    system: "http://snomed.info/sct",
  },
  {
    code: "421661004",
    display: "Banco de sangre y medicina de transfusión",
    system: "http://snomed.info/sct",
  },
  {
    code: "408462000",
    display: "Cuidado de quemaduras",
    system: "http://snomed.info/sct",
  },
  {
    code: "394579002",
    display: "Cardiología",
    system: "http://snomed.info/sct",
  },
  {
    code: "394804000",
    display: "Citogenética clínica y genética molecular",
    system: "http://snomed.info/sct",
  },
  {
    code: "394580004",
    display: "Genética clínica",
    system: "http://snomed.info/sct",
  },
  {
    code: "394803006",
    display: "Hematología clínica",
    system: "http://snomed.info/sct",
  },
  {
    code: "408480009",
    display: "Inmunología clínica",
    system: "http://snomed.info/sct",
  },
  {
    code: "408454008",
    display: "Microbiología clínica",
    system: "http://snomed.info/sct",
  },
  {
    code: "394809005",
    display: "Neurofisiología clínica",
    system: "http://snomed.info/sct",
  },
  {
    code: "394592004",
    display: "Oncología clínica",
    system: "http://snomed.info/sct",
  },
  {
    code: "394600006",
    display: "Farmacología clínica",
    system: "http://snomed.info/sct",
  },
  {
    code: "394601005",
    display: "Fisiología clínica",
    system: "http://snomed.info/sct",
  },
  {
    code: "394581000",
    display: "Medicina Comunitaria",
    system: "http://snomed.info/sct",
  },
  {
    code: "408478003",
    display: "Medicina de Cuidados Intensivos",
    system: "http://snomed.info/sct",
  },
  {
    code: "394812008",
    display: "Especialidades de Medicina Dental",
    system: "http://snomed.info/sct",
  },
  {
    code: "408444009",
    display: "Odontología General",
    system: "http://snomed.info/sct",
  },
  {
    code: "394582007",
    display: "Dermatología",
    system: "http://snomed.info/sct",
  },
  {
    code: "408475000",
    display: "Medicina Diabética",
    system: "http://snomed.info/sct",
  },
  {
    code: "410005002",
    display: "Medicina de Buceo",
    system: "http://snomed.info/sct",
  },
  {
    code: "394583002",
    display: "Endocrinología",
    system: "http://snomed.info/sct",
  },
  {
    code: "419772000",
    display: "Medicina Familiar",
    system: "http://snomed.info/sct",
  },
  {
    code: "394584008",
    display: "Gastroenterología",
    system: "http://snomed.info/sct",
  },
  {
    code: "408443003",
    display: "Práctica Médica General",
    system: "http://snomed.info/sct",
  },
  {
    code: "394802001",
    display: "Medicina General",
    system: "http://snomed.info/sct",
  },
  {
    code: "394915009",
    display: "Patología General",
    system: "http://snomed.info/sct",
  },
  {
    code: "394814009",
    display: "Práctica General",
    system: "http://snomed.info/sct",
  },
  {
    code: "394808002",
    display: "Medicina Genitourinaria",
    system: "http://snomed.info/sct",
  },
  {
    code: "394811001",
    display: "Geriatría",
    system: "http://snomed.info/sct",
  },
  {
    code: "408446006",
    display: "Oncología Ginecológica",
    system: "http://snomed.info/sct",
  },
  {
    code: "394586005",
    display: "Ginecología",
    system: "http://snomed.info/sct",
  },
  {
    code: "394916005",
    display: "Hematopatología",
    system: "http://snomed.info/sct",
  },
  {
    code: "408472002",
    display: "Hepatología",
    system: "http://snomed.info/sct",
  },
  {
    code: "394597005",
    display: "Histopatología",
    system: "http://snomed.info/sct",
  },
  {
    code: "394598000",
    display: "Inmunopatología",
    system: "http://snomed.info/sct",
  },
  {
    code: "394807007",
    display: "Enfermedades Infecciosas",
    system: "http://snomed.info/sct",
  },
  {
    code: "419192003",
    display: "Medicina Interna",
    system: "http://snomed.info/sct",
  },
  {
    code: "408468001",
    display: "Discapacidad Intelectual",
    system: "http://snomed.info/sct",
  },
  {
    code: "394593009",
    display: "Oncología Médica",
    system: "http://snomed.info/sct",
  },
  {
    code: "394813003",
    display: "Oftalmología Médica",
    system: "http://snomed.info/sct",
  },
  {
    code: "410001006",
    display: "Medicina Militar",
    system: "http://snomed.info/sct",
  },
  {
    code: "394589003",
    display: "Nefrología",
    system: "http://snomed.info/sct",
  },
  {
    code: "394591006",
    display: "Neurología",
    system: "http://snomed.info/sct",
  },
  {
    code: "394599008",
    display: "Neuropatología",
    system: "http://snomed.info/sct",
  },
  {
    code: "394649004",
    display: "Medicina Nuclear",
    system: "http://snomed.info/sct",
  },
  {
    code: "408470005",
    display: "Obstetricia",
    system: "http://snomed.info/sct",
  },
  {
    code: "394585009",
    display: "Obstetricia y Ginecología",
    system: "http://snomed.info/sct",
  },
  {
    code: "394821009",
    display: "Medicina Ocupacional",
    system: "http://snomed.info/sct",
  },
  {
    code: "422191005",
    display: "Cirugía Oftalmológica",
    system: "http://snomed.info/sct",
  },
  {
    code: "394594003",
    display: "Oftalmología",
    system: "http://snomed.info/sct",
  },
  {
    code: "416304004",
    display: "Medicina Osteopática Manipulativa",
    system: "http://snomed.info/sct",
  },
  {
    code: "418960008",
    display: "Otorrinolaringología",
    system: "http://snomed.info/sct",
  },
  {
    code: "394882004",
    display: "Manejo del Dolor",
    system: "http://snomed.info/sct",
  },
  {
    code: "394806003",
    display: "Medicina Paliativa",
    system: "http://snomed.info/sct",
  },
  {
    code: "394588006",
    display: "Psiquiatría Pediátrica (Infantil y Adolescente)",
    system: "http://snomed.info/sct",
  },
  {
    code: "408459003",
    display: "Cardiología Pediátrica",
    system: "http://snomed.info/sct",
  },
  {
    code: "394607009",
    display: "Odontología Pediátrica",
    system: "http://snomed.info/sct",
  },
  {
    code: "419610006",
    display: "Endocrinología Pediátrica",
    system: "http://snomed.info/sct",
  },
  {
    code: "418058008",
    display: "Gastroenterología Pediátrica",
    system: "http://snomed.info/sct",
  },
  {
    code: "420208008",
    display: "Genética Pediátrica",
    system: "http://snomed.info/sct",
  },
  {
    code: "418652005",
    display: "Hematología Pediátrica",
    system: "http://snomed.info/sct",
  },
  {
    code: "418535003",
    display: "Inmunología Pediátrica",
    system: "http://snomed.info/sct",
  },
  {
    code: "418862001",
    display: "Enfermedades Infecciosas Pediátricas",
    system: "http://snomed.info/sct",
  },
  {
    code: "419365004",
    display: "Nefrología Pediátrica",
    system: "http://snomed.info/sct",
  },
  {
    code: "418002000",
    display: "Oncología Pediátrica",
    system: "http://snomed.info/sct",
  },
  {
    code: "419983000",
    display: "Oftalmología Pediátrica",
    system: "http://snomed.info/sct",
  },
  {
    code: "419170002",
    display: "Neumología Pediátrica",
    system: "http://snomed.info/sct",
  },
  {
    code: "419472004",
    display: "Reumatología Pediátrica",
    system: "http://snomed.info/sct",
  },
  {
    code: "394539006",
    display: "Cirugía Pediátrica",
    system: "http://snomed.info/sct",
  },
  {
    code: "420112009",
    display: "Cirugía Pediátrica - Trasplante de médula ósea",
    system: "http://snomed.info/sct",
  },
  {
    code: "409968004",
    display: "Medicina Preventiva",
    system: "http://snomed.info/sct",
  },
  {
    code: "394587001",
    display: "Psiquiatría",
    system: "http://snomed.info/sct",
  },
  {
    code: "394913002",
    display: "Psicoterapia",
    system: "http://snomed.info/sct",
  },
  {
    code: "408440000",
    display: "Medicina de Salud Pública",
    system: "http://snomed.info/sct",
  },
  {
    code: "418112009",
    display: "Medicina Pulmonar",
    system: "http://snomed.info/sct",
  },
  {
    code: "419815003",
    display: "Oncología por Radiación",
    system: "http://snomed.info/sct",
  },
  {
    code: "394914008",
    display: "Radiología",
    system: "http://snomed.info/sct",
  },
  {
    code: "408455009",
    display: "Radiología - Radiología Intervencionista",
    system: "http://snomed.info/sct",
  },
  {
    code: "394602003",
    display: "Rehabilitación",
    system: "http://snomed.info/sct",
  },
  {
    code: "408447002",
    display: "Cuidados de Descanso",
    system: "http://snomed.info/sct",
  },
  {
    code: "394810000",
    display: "Reumatología",
    system: "http://snomed.info/sct",
  },
  {
    code: "408450004",
    display: "Estudios del Sueño",
    system: "http://snomed.info/sct",
  },
  {
    code: "408476004",
    display: "Cirugía - Trasplante de Hueso y Médula",
    system: "http://snomed.info/sct",
  },
  {
    code: "408469009",
    display: "Cirugía - Cirugía de Mama",
    system: "http://snomed.info/sct",
  },
  {
    code: "408466002",
    display: "Cirugía - Cirugía Cardíaca",
    system: "http://snomed.info/sct",
  },
  {
    code: "408471009",
    display: "Cirugía - Trasplante Cardio-Torácico",
    system: "http://snomed.info/sct",
  },
  {
    code: "408464004",
    display: "Cirugía - Cirugía Colorrectal",
    system: "http://snomed.info/sct",
  },
  {
    code: "408441001",
    display: "Cirugía Dental - Endodoncia",
    system: "http://snomed.info/sct",
  },
  {
    code: "408465003",
    display: "Cirugía Dental - Cirugía Oral y Maxilofacial",
    system: "http://snomed.info/sct",
  },
  {
    code: "394605001",
    display: "Cirugía Dental - Cirugía Oral",
    system: "http://snomed.info/sct",
  },
  {
    code: "394608004",
    display: "Cirugía Dental - Ortodoncia",
    system: "http://snomed.info/sct",
  },
  {
    code: "408461007",
    display: "Cirugía Dental - Cirugía Periodontal",
    system: "http://snomed.info/sct",
  },
  {
    code: "408460008",
    display: "Cirugía Dental - Prostodoncia Quirúrgica",
    system: "http://snomed.info/sct",
  },
  {
    code: "394606000",
    display: "Cirugía Dental - Odontología Restaurativa",
    system: "http://snomed.info/sct",
  },
  {
    code: "408449004",
    display: "Cirugía Dental - Odontología - Cirugía",
    system: "http://snomed.info/sct",
  },
  {
    code: "418018006",
    display: "Cirugía Dermatológica",
    system: "http://snomed.info/sct",
  },
  {
    code: "394604002",
    display: "Cirugía de Oído, Nariz y Garganta",
    system: "http://snomed.info/sct",
  },
  {
    code: "394609007",
    display: "Cirugía General",
    system: "http://snomed.info/sct",
  },
  {
    code: "408474001",
    display: "Cirugía Hepatobiliar y Pancreática",
    system: "http://snomed.info/sct",
  },
  {
    code: "394610002",
    display: "Neurocirugía",
    system: "http://snomed.info/sct",
  },
  {
    code: "394611003",
    display: "Cirugía Plástica",
    system: "http://snomed.info/sct",
  },
  {
    code: "408477008",
    display: "Cirugía - Cirugía de Trasplante",
    system: "http://snomed.info/sct",
  },
  {
    code: "394801008",
    display: "Cirugía - Traumatología y Ortopedia",
    system: "http://snomed.info/sct",
  },
  {
    code: "408463005",
    display: "Cirugía Vascular",
    system: "http://snomed.info/sct",
  },
  {
    code: "419321007",
    display: "Oncología Quirúrgica",
    system: "http://snomed.info/sct",
  },
  {
    code: "394576009",
    display: "Quirúrgica - Accidente y Emergencia",
    system: "http://snomed.info/sct",
  },
  {
    code: "394590007",
    display: "Medicina Torácica",
    system: "http://snomed.info/sct",
  },
  {
    code: "409967009",
    display: "Toxicología",
    system: "http://snomed.info/sct",
  },
  {
    code: "408448007",
    display: "Medicina Tropical",
    system: "http://snomed.info/sct",
  },
  {
    code: "419043006",
    display: "Oncología Urológica",
    system: "http://snomed.info/sct",
  },
  {
    code: "394612005",
    display: "Urología",
    system: "http://snomed.info/sct",
  },
  {
    code: "394733009",
    display: "Especialidad Médica - OTROS - NO LISTADOS",
    system: "http://snomed.info/sct",
  },
  {
    code: "394732004",
    display: "Especialidad Quirúrgica - OTROS - NO LISTADOS",
    system: "http://snomed.info/sct",
  },
];/*

/* Tiene más opciones pero es para futura actualización y posiblemente mejor traducción
export const practitionerRole: Coding[] = [
  {
    code: "doctor",
    display: "Médico",
    system: "http://terminology.hl7.org/CodeSystem/practitioner-role",
  },
  {
    code: "nurse",
    display: "Enfermera",
    system: "http://terminology.hl7.org/CodeSystem/practitioner-role",
  },
  {
    code: "pharmacist",
    display: "Farmacéutico",
    system: "http://terminology.hl7.org/CodeSystem/practitioner-role",
  },
  {
    code: "researcher",
    display: "Investigador",
    system: "http://terminology.hl7.org/CodeSystem/practitioner-role",
  },
  {
    code: "teacher",
    display: "Profesor",
    system: "http://terminology.hl7.org/CodeSystem/practitioner-role",
  },
  {
    code: "ict",
    display: "Profesional de las TIC",
    system: "http://terminology.hl7.org/CodeSystem/practitioner-role",
  },
  {
    code: "1421009",
    display: "Cirujano especializado",
    system: "http://snomed.info/sct",
  },
  {
    code: "3430008",
    display: "Radioterapeuta",
    system: "http://snomed.info/sct",
  },
  {
    code: "3842006",
    display: "Quiropráctico",
    system: "http://snomed.info/sct",
  },
  {
    code: "4162009",
    display: "Auxiliar de odontología",
    system: "http://snomed.info/sct",
  },
  {
    code: "5275007",
    display: "NA - Auxiliar de enfermería",
    system: "http://snomed.info/sct",
  },
  {
    code: "6816002",
    display: "Enfermero especializado",
    system: "http://snomed.info/sct",
  },
  {
    code: "6868009",
    display: "Administrador de hospital",
    system: "http://snomed.info/sct",
  },
  {
    code: "8724009",
    display: "Cirujano plástico",
    system: "http://snomed.info/sct",
  },
  {
    code: "11661002",
    display: "Neuropatólogo",
    system: "http://snomed.info/sct",
  },
  {
    code: "11911009",
    display: "Nefrólogo",
    system: "http://snomed.info/sct",
  },
  {
    code: "11935004",
    display: "Obstetra",
    system: "http://snomed.info/sct",
  },
  {
    code: "13580004",
    display: "Asistente dental escolar",
    system: "http://snomed.info/sct",
  },
  {
    code: "14698002",
    display: "Microbiólogo médico",
    system: "http://snomed.info/sct",
  },
  {
    code: "17561000",
    display: "Cardiólogo",
    system: "http://snomed.info/sct",
  },
  {
    code: "18803008",
    display: "Dermatólogo",
    system: "http://snomed.info/sct",
  },
  {
    code: "18850004",
    display: "Hematólogo de laboratorio",
    system: "http://snomed.info/sct",
  },
  {
    code: "19244007",
    display: "Gerodoncista",
    system: "http://snomed.info/sct",
  },
  {
    code: "20145008",
    display: "Prostodoncista removible",
    system: "http://snomed.info/sct",
  },
  {
    code: "21365001",
    display: "Odontólogo especializado",
    system: "http://snomed.info/sct",
  },
  {
    code: "21450003",
    display: "Neuropsiquiatra",
    system: "http://snomed.info/sct",
  },
  {
    code: "22515006",
    display: "Asistente médico",
    system: "http://snomed.info/sct",
  },
  {
    code: "22731001",
    display: "Cirujano ortopédico",
    system: "http://snomed.info/sct",
  },
  {
    code: "22983004",
    display: "Cirujano torácico",
    system: "http://snomed.info/sct",
  },
  {
    code: "23278007",
    display: "Médico de salud comunitaria",
    system: "http://snomed.info/sct",
  },
  {
    code: "24430003",
    display: "Especialista en medicina física",
    system: "http://snomed.info/sct",
  },
  {
    code: "24590004",
    display: "Urólogo",
    system: "http://snomed.info/sct",
  },
  {
    code: "25961008",
    display: "Especialista en electroencefalografía",
    system: "http://snomed.info/sct",
  },
  {
    code: "26042002",
    display: "Higienista dental",
    system: "http://snomed.info/sct",
  },
  {
    code: "26369006",
    display: "Enfermero de salud pública",
    system: "http://snomed.info/sct",
  },
  {
    code: "28229004",
    display: "Optometrista",
    system: "http://snomed.info/sct",
  },
  {
    code: "28411006",
    display: "Neonatólogo",
    system: "http://snomed.info/sct",
  },
  {
    code: "28544002",
    display: "Patólogo químico",
    system: "http://snomed.info/sct",
  },
  {
    code: "36682004",
    display: "PT - Fisioterapeuta",
    system: "http://snomed.info/sct",
  },
  {
    code: "37154003",
    display: "Periodoncista",
    system: "http://snomed.info/sct",
  },
  {
    code: "37504001",
    display: "Ortodoncista",
    system: "http://snomed.info/sct",
  },
  {
    code: "39677007",
    display: "Especialista en medicina interna",
    system: "http://snomed.info/sct",
  },
  {
    code: "40127002",
    display: "Dietista (general)",
    system: "http://snomed.info/sct",
  },
  {
    code: "40204001",
    display: "Hematólogo",
    system: "http://snomed.info/sct",
  },
  {
    code: "40570005",
    display: "Intérprete",
    system: "http://snomed.info/sct",
  },
  {
    code: "41672002",
    display: "Médico respiratorio",
    system: "http://snomed.info/sct",
  },
  {
    code: "41904004",
    display: "Técnico en radiología médica",
    system: "http://snomed.info/sct",
  },
  {
    code: "43702002",
    display: "Enfermero de salud laboral",
    system: "http://snomed.info/sct",
  },
  {
    code: "44652006",
    display: "Asistente farmacéutico",
    system: "http://snomed.info/sct",
  },
  {
    code: "45419001",
    display: "Masajista",
    system: "http://snomed.info/sct",
  },
  {
    code: "45440000",
    display: "Reumatólogo",
    system: "http://snomed.info/sct",
  },
  {
    code: "45544007",
    display: "Neurocirujano",
    system: "http://snomed.info/sct",
  },
  {
    code: "45956004",
    display: "Sanitario",
    system: "http://snomed.info/sct",
  },
  {
    code: "46255001",
    display: "Farmacéutico",
    system: "http://snomed.info/sct",
  },
  {
    code: "48740002",
    display: "Filólogo",
    system: "http://snomed.info/sct",
  },
  {
    code: "49203003",
    display: "Optometrista",
    system: "http://snomed.info/sct",
  },
  {
    code: "49993003",
    display: "Cirujano maxilofacial",
    system: "http://snomed.info/sct",
  },
  {
    code: "50149000",
    display: "Endodoncista",
    system: "http://snomed.info/sct",
  },
  {
    code: "54503009",
    display: "Curandero",
    system: "http://snomed.info/sct",
  },
  {
    code: "56397003",
    display: "Neurólogo",
    system: "http://snomed.info/sct",
  },
  {
    code: "56466003",
    display: "Médico comunitario",
    system: "http://snomed.info/sct",
  },
  {
    code: "56542007",
    display: "Administrador de historias clínicas",
    system: "http://snomed.info/sct",
  },
  {
    code: "56545009",
    display: "Cirujano cardiovascular",
    system: "http://snomed.info/sct",
  },
  {
    code: "57654006",
    display: "Prostodoncista fijo",
    system: "http://snomed.info/sct",
  },
  {
    code: "59058001",
    display: "Médico general",
    system: "http://snomed.info/sct",
  },
  {
    code: "59169001",
    display: "Técnico ortopédico",
    system: "http://snomed.info/sct",
  },
  {
    code: "59944000",
    display: "Psicólogo",
    system: "http://snomed.info/sct",
  },
  {
    code: "60008001",
    display: "Dietista comunitario",
    system: "http://snomed.info/sct",
  },
  {
    code: "61207006",
    display: "Médico patólogo",
    system: "http://snomed.info/sct",
  },
  {
    code: "61246008",
    display: "Especialista en medicina de laboratorio",
    system: "http://snomed.info/sct",
  },
  {
    code: "61345009",
    display: "Otorrinolaringólogo",
    system: "http://snomed.info/sct",
  },
  {
    code: "61894003",
    display: "Endocrinólogo",
    system: "http://snomed.info/sct",
  },
  {
    code: "62247001",
    display: "Especialista en medicina familiar",
    system: "http://snomed.info/sct",
  },
  {
    code: "63098009",
    display: "Inmunólogo clínico",
    system: "http://snomed.info/sct",
  },
  {
    code: "66476003",
    display: "Patólogo oral",
    system: "http://snomed.info/sct",
  },
  {
    code: "66862007",
    display: "Radiólogo",
    system: "http://snomed.info/sct",
  },
  {
    code: "68867008",
    display: "Odontólogo de salud pública",
    system: "http://snomed.info/sct",
  },
  {
    code: "68950000",
    display: "Prostodoncista",
    system: "http://snomed.info/sct",
  },
  {
    code: "69280009",
    display: "Médico especialista",
    system: "http://snomed.info/sct",
  },
  {
    code: "71838004",
    display: "Gastroenterólogo",
    system: "http://snomed.info/sct",
  },
  {
    code: "73265009",
    display: "Auxiliar de enfermería",
    system: "http://snomed.info/sct",
  },
  {
    code: "75271001",
    display: "Matrona",
    system: "http://snomed.info/sct",
  },
  {
    code: "76166008",
    display: "Auxiliar de farmacia",
    system: "http://snomed.info/sct",
  },
  {
    code: "76231001",
    display: "Osteópata",
    system: "http://snomed.info/sct",
  },
  {
    code: "76899008",
    display: "Médico infectólogo",
    system: "http://snomed.info/sct",
  },
  {
    code: "78703002",
    display: "Cirujano general",
    system: "http://snomed.info/sct",
  },
  {
    code: "78729002",
    display: "Radiólogo de diagnóstico",
    system: "http://snomed.info/sct",
  },
  {
    code: "79898004",
    display: "Auxiliar de matrona",
    system: "http://snomed.info/sct",
  },
  {
    code: "80409005",
    display: "Traductor",
    system: "http://snomed.info/sct",
  },
  {
    code: "80546007",
    display: "Terapeuta ocupacional",
    system: "http://snomed.info/sct",
  },
  {
    code: "80584001",
    display: "Psiquiatra",
    system: "http://snomed.info/sct",
  },
  {
    code: "80933006",
    display: "Médico nuclear",
    system: "http://snomed.info/sct",
  },
  {
    code: "81464008",
    display: "Patólogo clínico",
    system: "http://snomed.info/sct",
  },
  {
    code: "82296001",
    display: "Pediatra",
    system: "http://snomed.info/sct",
  },
  {
    code: "83189004",
    display: "Otra enfermera profesional",
    system: "http://snomed.info/sct",
  },
  {
    code: "83273008",
    display: "Anatomopatólogo",
    system: "http://snomed.info/sct",
  },
  {
    code: "83685006",
    display: "Ginecólogo",
    system: "http://snomed.info/sct",
  },
  {
    code: "85733003",
    display: "Patólogo general",
    system: "http://snomed.info/sct",
  },
  {
    code: "88189002",
    display: "Anestesista",
    system: "http://snomed.info/sct",
  },
  {
    code: "88475002",
    display: "Otros dietistas y nutricionistas de salud pública",
    system: "http://snomed.info/sct",
  },
  {
    code: "90201008",
    display: "Odontopediatra",
    system: "http://snomed.info/sct",
  },
  {
    code: "90655003",
    display: "Médico de atención al anciano",
    system: "http://snomed.info/sct",
  },
  {
    code: "106289002",
    display: "Cirujano dental",
    system: "http://snomed.info/sct",
  },
  {
    code: "106291005",
    display: "Dietista AND/OR public health nutritionist",
    system: "http://snomed.info/sct",
  },
  {
    code: "106292003",
    display: "Enfermera",
    system: "http://snomed.info/sct",
  },
  {
    code: "106293008",
    display: "Personal de enfermería",
    system: "http://snomed.info/sct",
  },
  {
    code: "106294002",
    display: "Personal de partería",
    system: "http://snomed.info/sct",
  },
  {
    code: "106296000",
    display: "Physiotherapist AND/OR occupational therapist",
    system: "http://snomed.info/sct",
  },
  {
    code: "106330007",
    display: "Filólogo, translator AND/OR interpreter",
    system: "http://snomed.info/sct",
  },
  {
    code: "112247003",
    display: "Médico",
    system: "http://snomed.info/sct",
  },
  {
    code: "158965000",
    display: "Médico generalista",
    system: "http://snomed.info/sct",
  },
  {
    code: "158966004",
    display: "Administrador médico - nacional",
    system: "http://snomed.info/sct",
  },
  {
    code: "158967008",
    display: "Médico asesor",
    system: "http://snomed.info/sct",
  },
  {
    code: "158968003",
    display: "Cirujano consultor",
    system: "http://snomed.info/sct",
  },
  {
    code: "158969006",
    display: "Consultor ginecología y obstetricia",
    system: "http://snomed.info/sct",
  },
  {
    code: "158970007",
    display: "Anestesista",
    system: "http://snomed.info/sct",
  },
  {
    code: "158971006",
    display: "Registrador hospitalario",
    system: "http://snomed.info/sct",
  },
  {
    code: "158972004",
    display: "Encargado de hospital",
    system: "http://snomed.info/sct",
  },
  {
    code: "158973009",
    display: "Médico del trabajo",
    system: "http://snomed.info/sct",
  },
  {
    code: "158974003",
    display: "Médico clínico",
    system: "http://snomed.info/sct",
  },
  {
    code: "158975002",
    display: "Médico generalista - teaching",
    system: "http://snomed.info/sct",
  },
  {
    code: "158977005",
    display: "Administrador dental",
    system: "http://snomed.info/sct",
  },
  {
    code: "158978000",
    display: "Consultor dental",
    system: "http://snomed.info/sct",
  },
  {
    code: "158979008",
    display: "Odontólogo general",
    system: "http://snomed.info/sct",
  },
  {
    code: "158980006",
    display: "Odontólogo docente",
    system: "http://snomed.info/sct",
  },
  {
    code: "158983008",
    display: "Enfermera administrator - national",
    system: "http://snomed.info/sct",
  },
  {
    code: "158984002",
    display: "Oficial de enfermería - región",
    system: "http://snomed.info/sct",
  },
  {
    code: "158985001",
    display: "Oficial de enfermería - distrito",
    system: "http://snomed.info/sct",
  },
  {
    code: "158986000",
    display: "Administrador de enfermería - organismo profesional",
    system: "http://snomed.info/sct",
  },
  {
    code: "158987009",
    display: "Oficial de enfermería - división",
    system: "http://snomed.info/sct",
  },
  {
    code: "158988004",
    display: "Enfermera education director",
    system: "http://snomed.info/sct",
  },
  {
    code: "158989007",
    display: "Encargado de enfermería - salud laboral",
    system: "http://snomed.info/sct",
  },
  {
    code: "158990003",
    display: "Oficial de enfermería",
    system: "http://snomed.info/sct",
  },
  {
    code: "158992006",
    display: "Enfermera matrona",
    system: "http://snomed.info/sct",
  },
  {
    code: "158993001",
    display: "Enfermera de quirófano",
    system: "http://snomed.info/sct",
  },
  {
    code: "158994007",
    display: "Enfermera de plantilla",
    system: "http://snomed.info/sct",
  },
  {
    code: "158995008",
    display: "Matrona de plantilla",
    system: "http://snomed.info/sct",
  },
  {
    code: "158996009",
    display: "Enfermera diplomada",
    system: "http://snomed.info/sct",
  },
  {
    code: "158997000",
    display: "Enfermera de distrito",
    system: "http://snomed.info/sct",
  },
  {
    code: "158998005",
    display: "Enfermera privada",
    system: "http://snomed.info/sct",
  },
  {
    code: "158999002",
    display: "Matrona comunitaria",
    system: "http://snomed.info/sct",
  },
  {
    code: "159001001",
    display: "Enfermera de clínica",
    system: "http://snomed.info/sct",
  },
  {
    code: "159002008",
    display: "Enfermera de consulta",
    system: "http://snomed.info/sct",
  },
  {
    code: "159003003",
    display: "Enfermera escolar",
    system: "http://snomed.info/sct",
  },
  {
    code: "159004009",
    display: "Enfermera - teaching",
    system: "http://snomed.info/sct",
  },
  {
    code: "159005005",
    display: "Estudiante de enfermería",
    system: "http://snomed.info/sct",
  },
  {
    code: "159006006",
    display: "Enfermera dental",
    system: "http://snomed.info/sct",
  },
  {
    code: "159007002",
    display: "Enfermera pediátrica comunitaria",
    system: "http://snomed.info/sct",
  },
  {
    code: "159010009",
    display: "Farmacéutico de hospital",
    system: "http://snomed.info/sct",
  },
  {
    code: "159011008",
    display: "Farmacéutico minorista",
    system: "http://snomed.info/sct",
  },
  {
    code: "159012001",
    display: "Farmacéutico industrial",
    system: "http://snomed.info/sct",
  },
  {
    code: "159013006",
    display: "Farmacéutico oficial H.A.",
    system: "http://snomed.info/sct",
  },
  {
    code: "159014000",
    display: "Farmacéutico en prácticas",
    system: "http://snomed.info/sct",
  },
  {
    code: "159016003",
    display: "Radiógrafo médico",
    system: "http://snomed.info/sct",
  },
  {
    code: "159017007",
    display: "Radiógrafo de diagnóstico",
    system: "http://snomed.info/sct",
  },
  {
    code: "159018002",
    display: "Radiógrafo terapéutico",
    system: "http://snomed.info/sct",
  },
  {
    code: "159019005",
    display: "Aprendiz de radiógrafo",
    system: "http://snomed.info/sct",
  },
  {
    code: "159021000",
    display: "Óptico oftalmólogo",
    system: "http://snomed.info/sct",
  },
  {
    code: "159022007",
    display: "Aprendiz de óptico",
    system: "http://snomed.info/sct",
  },
  {
    code: "159025009",
    display: "Gimnasia curativa",
    system: "http://snomed.info/sct",
  },
  {
    code: "159026005",
    display: "Logopeda",
    system: "http://snomed.info/sct",
  },
  {
    code: "159027001",
    display: "Ortóptico",
    system: "http://snomed.info/sct",
  },
  {
    code: "159028006",
    display: "Terapeuta de apoyo en prácticas",
    system: "http://snomed.info/sct",
  },
  {
    code: "159033005",
    display: "Dietista",
    system: "http://snomed.info/sct",
  },
  {
    code: "159034004",
    display: "Podólogo",
    system: "http://snomed.info/sct",
  },
  {
    code: "159035003",
    display: "Auxiliar de odontología",
    system: "http://snomed.info/sct",
  },
  {
    code: "159036002",
    display: "Técnico de ECG",
    system: "http://snomed.info/sct",
  },
  {
    code: "159037006",
    display: "Técnico de EEG",
    system: "http://snomed.info/sct",
  },
  {
    code: "159038001",
    display: "Técnico en prótesis",
    system: "http://snomed.info/sct",
  },
  {
    code: "159039009",
    display: "Técnico en audiología",
    system: "http://snomed.info/sct",
  },
  {
    code: "159040006",
    display: "Técnico de farmacia",
    system: "http://snomed.info/sct",
  },
  {
    code: "159041005",
    display: "Técnico médico en formación",
    system: "http://snomed.info/sct",
  },
  {
    code: "159141008",
    display: "Genetista",
    system: "http://snomed.info/sct",
  },
  {
    code: "159972006",
    display: "Montador de corsés quirúrgicos",
    system: "http://snomed.info/sct",
  },
  {
    code: "160008000",
    display: "Técnico dental",
    system: "http://snomed.info/sct",
  },
  {
    code: "224529009",
    display: "Auxiliar de clínica",
    system: "http://snomed.info/sct",
  },
  {
    code: "224530004",
    display: "Registrador senior",
    system: "http://snomed.info/sct",
  },
  {
    code: "224531000",
    display: "Registrador",
    system: "http://snomed.info/sct",
  },
  {
    code: "224532007",
    display: "Oficial superior",
    system: "http://snomed.info/sct",
  },
  {
    code: "224533002",
    display: "MO - Oficial médico",
    system: "http://snomed.info/sct",
  },
  {
    code: "224534008",
    display: "Health visitor, nurse/midwife",
    system: "http://snomed.info/sct",
  },
  {
    code: "224535009",
    display: "Enfermera diplomada",
    system: "http://snomed.info/sct",
  },
  {
    code: "224536005",
    display: "Tutor de obstetricia",
    system: "http://snomed.info/sct",
  },
  {
    code: "224537001",
    display: "Enfermera de urgencias",
    system: "http://snomed.info/sct",
  },
  {
    code: "224538006",
    display: "Enfermera de triaje",
    system: "http://snomed.info/sct",
  },
  {
    code: "224540001",
    display: "Enfermera comunitaria",
    system: "http://snomed.info/sct",
  },
  {
    code: "224541002",
    display: "Enfermera asesora de continencia",
    system: "http://snomed.info/sct",
  },
  {
    code: "224542009",
    display: "Enfermera de cuidados coronarios",
    system: "http://snomed.info/sct",
  },
  {
    code: "224543004",
    display: "Enfermera diabética",
    system: "http://snomed.info/sct",
  },
  {
    code: "224544005",
    display: "Enfermera de planificación familiar",
    system: "http://snomed.info/sct",
  },
  {
    code: "224545006",
    display: "Enfermera de cuidados a personas mayores",
    system: "http://snomed.info/sct",
  },
  {
    code: "224546007",
    display: "Enfermera de control de infecciones",
    system: "http://snomed.info/sct",
  },
  {
    code: "224547003",
    display: "Enfermera de terapia intensiva",
    system: "http://snomed.info/sct",
  },
  {
    code: "224548008",
    display: "Enfermera de dificultades de aprendizaje",
    system: "http://snomed.info/sct",
  },
  {
    code: "224549000",
    display: "Enfermera neonatal",
    system: "http://snomed.info/sct",
  },
  {
    code: "224550000",
    display: "Enfermera de neurología",
    system: "http://snomed.info/sct",
  },
  {
    code: "224551001",
    display: "Enfermera industrial",
    system: "http://snomed.info/sct",
  },
  {
    code: "224552008",
    display: "Enfermera de oncología",
    system: "http://snomed.info/sct",
  },
  {
    code: "224553003",
    display: "Enfermera de Macmillan",
    system: "http://snomed.info/sct",
  },
  {
    code: "224554009",
    display: "Enfermera Marie Curie",
    system: "http://snomed.info/sct",
  },
  {
    code: "224555005",
    display: "Enfermera de control del dolor",
    system: "http://snomed.info/sct",
  },
  {
    code: "224556006",
    display: "Enfermera de cuidados paliativos",
    system: "http://snomed.info/sct",
  },
  {
    code: "224557002",
    display: "Enfermera de quimioterapia",
    system: "http://snomed.info/sct",
  },
  {
    code: "224558007",
    display: "Enfermera de radioterapia",
    system: "http://snomed.info/sct",
  },
  {
    code: "224559004",
    display: "Enfermera PACU",
    system: "http://snomed.info/sct",
  },
  {
    code: "224560009",
    display: "Estomaterapeuta",
    system: "http://snomed.info/sct",
  },
  {
    code: "224561008",
    display: "Enfermera de quirófano",
    system: "http://snomed.info/sct",
  },
  {
    code: "224562001",
    display: "Enfermera pediátrica",
    system: "http://snomed.info/sct",
  },
  {
    code: "224563006",
    display: "Enfermera psiquiátrica",
    system: "http://snomed.info/sct",
  },
  {
    code: "224564000",
    display: "Enfermera de salud mental comunitaria",
    system: "http://snomed.info/sct",
  },
  {
    code: "224565004",
    display: "Enfermera renal",
    system: "http://snomed.info/sct",
  },
  {
    code: "224566003",
    display: "Enfermera de hemodiálisis",
    system: "http://snomed.info/sct",
  },
  {
    code: "224567007",
    display: "Enfermera de cuidados de heridas",
    system: "http://snomed.info/sct",
  },
  {
    code: "224569005",
    display: "Enfermera grade",
    system: "http://snomed.info/sct",
  },
  {
    code: "224570006",
    display: "Especialista en enfermería clínica",
    system: "http://snomed.info/sct",
  },
  {
    code: "224571005",
    display: "Enfermera practitioner",
    system: "http://snomed.info/sct",
  },
  {
    code: "224572003",
    display: "Hermana enfermera",
    system: "http://snomed.info/sct",
  },
  {
    code: "224573008",
    display: "CN - Enfermera responsable",
    system: "http://snomed.info/sct",
  },
  {
    code: "224574002",
    display: "Jefe de sala",
    system: "http://snomed.info/sct",
  },
  {
    code: "224575001",
    display: "Jefe de equipo de enfermería",
    system: "http://snomed.info/sct",
  },
  {
    code: "224576000",
    display: "Auxiliar de enfermería",
    system: "http://snomed.info/sct",
  },
  {
    code: "224577009",
    display: "Auxiliar de enfermería",
    system: "http://snomed.info/sct",
  },
  {
    code: "224578004",
    display: "Enfermerary nurse",
    system: "http://snomed.info/sct",
  },
  {
    code: "224579007",
    display: "Gestor de servicios sanitarios",
    system: "http://snomed.info/sct",
  },
  {
    code: "224580005",
    display: "Jefe de servicio de salud laboral",
    system: "http://snomed.info/sct",
  },
  {
    code: "224581009",
    display: "Enfermera comunitaria manager",
    system: "http://snomed.info/sct",
  },
  {
    code: "224583007",
    display: "Terapeuta conductual",
    system: "http://snomed.info/sct",
  },
  {
    code: "224584001",
    display: "Auxiliar de terapia conductual",
    system: "http://snomed.info/sct",
  },
  {
    code: "224585000",
    display: "Terapeuta dramático",
    system: "http://snomed.info/sct",
  },
  {
    code: "224586004",
    display: "Terapeuta ocupacional a domicilio",
    system: "http://snomed.info/sct",
  },
  {
    code: "224587008",
    display: "Auxiliar de terapia ocupacional",
    system: "http://snomed.info/sct",
  },
  {
    code: "224588003",
    display: "Psicoterapeuta",
    system: "http://snomed.info/sct",
  },
  {
    code: "224589006",
    display: "Fisioterapeuta comunitario",
    system: "http://snomed.info/sct",
  },
  {
    code: "224590002",
    display: "Terapeuta lúdico",
    system: "http://snomed.info/sct",
  },
  {
    code: "224591003",
    display: "Especialista en juego",
    system: "http://snomed.info/sct",
  },
  {
    code: "224592005",
    display: "Animador lúdico",
    system: "http://snomed.info/sct",
  },
  {
    code: "224593000",
    display: "Community-based speech/language therapist",
    system: "http://snomed.info/sct",
  },
  {
    code: "224594006",
    display: "Speech/language assistant",
    system: "http://snomed.info/sct",
  },
  {
    code: "224595007",
    display: "Orientador profesional",
    system: "http://snomed.info/sct",
  },
  {
    code: "224596008",
    display: "Orientador matrimonial",
    system: "http://snomed.info/sct",
  },
  {
    code: "224597004",
    display: "Enfermera asesora cualificada",
    system: "http://snomed.info/sct",
  },
  {
    code: "224598009",
    display: "Trabajador social cualificado",
    system: "http://snomed.info/sct",
  },
  {
    code: "224599001",
    display: "Asesor de personal cualificado",
    system: "http://snomed.info/sct",
  },
  {
    code: "224600003",
    display: "Psicoanalista",
    system: "http://snomed.info/sct",
  },
  {
    code: "224601004",
    display: "Psicólogo asistente",
    system: "http://snomed.info/sct",
  },
  {
    code: "224602006",
    display: "Podólogo comunitario",
    system: "http://snomed.info/sct",
  },
  {
    code: "224603001",
    display: "Podólogo",
    system: "http://snomed.info/sct",
  },
  {
    code: "224604007",
    display: "Audiometristaa",
    system: "http://snomed.info/sct",
  },
  {
    code: "224605008",
    display: "Audiometrista",
    system: "http://snomed.info/sct",
  },
  {
    code: "224606009",
    display: "Técnico sanitario",
    system: "http://snomed.info/sct",
  },
  {
    code: "224607000",
    display: "Instructor técnico de terapia ocupacional",
    system: "http://snomed.info/sct",
  },
  {
    code: "224608005",
    display: "Personal sanitario administrativo",
    system: "http://snomed.info/sct",
  },
  {
    code: "224609002",
    display: "Personal sanitario complementario",
    system: "http://snomed.info/sct",
  },
  {
    code: "224610007",
    display: "Personal de servicios de apoyo",
    system: "http://snomed.info/sct",
  },
  {
    code: "224614003",
    display: "Investigador asociado",
    system: "http://snomed.info/sct",
  },
  {
    code: "224615002",
    display: "Research nurse",
    system: "http://snomed.info/sct",
  },
  {
    code: "224620002",
    display: "Auxiliar de comunicación",
    system: "http://snomed.info/sct",
  },
  {
    code: "224621003",
    display: "Palantypista",
    system: "http://snomed.info/sct",
  },
  {
    code: "224622005",
    display: "Tomador de apuntes",
    system: "http://snomed.info/sct",
  },
  {
    code: "224623000",
    display: "Cuer",
    system: "http://snomed.info/sct",
  },
  {
    code: "224624006",
    display: "Orador labial",
    system: "http://snomed.info/sct",
  },
  {
    code: "224625007",
    display: "Intérprete for British sign language",
    system: "http://snomed.info/sct",
  },
  {
    code: "224626008",
    display: "Intérprete for Signs supporting English",
    system: "http://snomed.info/sct",
  },
  {
    code: "224936003",
    display: "Médico generalista",
    system: "http://snomed.info/sct",
  },
  {
    code: "225726006",
    display: "Asesor de lactancia",
    system: "http://snomed.info/sct",
  },
  {
    code: "225727002",
    display: "Asesor de matrona",
    system: "http://snomed.info/sct",
  },
  {
    code: "265937000",
    display: "Enfermería",
    system: "http://snomed.info/sct",
  },
  {
    code: "265939002",
    display: "Medical/dental technicians",
    system: "http://snomed.info/sct",
  },
  {
    code: "283875005",
    display: "Enfermero de Parkinson",
    system: "http://snomed.info/sct",
  },
  {
    code: "302211009",
    display: "Enfermera especializada",
    system: "http://snomed.info/sct",
  },
  {
    code: "303124005",
    display: "Miembro del tribunal de revisión de salud mental",
    system: "http://snomed.info/sct",
  },
  {
    code: "303129000",
    display: "Director de hospital",
    system: "http://snomed.info/sct",
  },
  {
    code: "303133007",
    display: "Médico responsable",
    system: "http://snomed.info/sct",
  },
  {
    code: "303134001",
    display: "Médico independiente",
    system: "http://snomed.info/sct",
  },
  {
    code: "304291006",
    display: "Asesor en duelo",
    system: "http://snomed.info/sct",
  },
  {
    code: "304292004",
    display: "Cirujano",
    system: "http://snomed.info/sct",
  },
  {
    code: "307988006",
    display: "Técnico médico",
    system: "http://snomed.info/sct",
  },
  {
    code: "308002005",
    display: "Terapeuta curativo",
    system: "http://snomed.info/sct",
  },
  {
    code: "309294001",
    display: "Médico de urgencias",
    system: "http://snomed.info/sct",
  },
  {
    code: "309295000",
    display: "Oncólogo clínico",
    system: "http://snomed.info/sct",
  },
  {
    code: "309296004",
    display: "Médico de planificación familiar",
    system: "http://snomed.info/sct",
  },
  {
    code: "309322005",
    display: "Médico generalista adjunto",
    system: "http://snomed.info/sct",
  },
  {
    code: "309323000",
    display: "Socio de médico generalista",
    system: "http://snomed.info/sct",
  },
  {
    code: "309324006",
    display: "Médico general adjunto",
    system: "http://snomed.info/sct",
  },
  {
    code: "309326008",
    display: "Médico general suplente",
    system: "http://snomed.info/sct",
  },
  {
    code: "309327004",
    display: "Médico generalista residente",
    system: "http://snomed.info/sct",
  },
  {
    code: "309328009",
    display: "Pediatra ambulatorio",
    system: "http://snomed.info/sct",
  },
  {
    code: "309329001",
    display: "Pediatra comunitario",
    system: "http://snomed.info/sct",
  },
  {
    code: "309330006",
    display: "Cardiólogo pediátrico",
    system: "http://snomed.info/sct",
  },
  {
    code: "309331005",
    display: "Endocrinólogo pediátrico",
    system: "http://snomed.info/sct",
  },
  {
    code: "309332003",
    display: "Gastroenterólogo pediátrico",
    system: "http://snomed.info/sct",
  },
  {
    code: "309333008",
    display: "Nefrólogo pediátrico",
    system: "http://snomed.info/sct",
  },
  {
    code: "309334002",
    display: "Neurólogo pediátrico",
    system: "http://snomed.info/sct",
  },
  {
    code: "309335001",
    display: "Reumatólogo pediátrico",
    system: "http://snomed.info/sct",
  },
  {
    code: "309336000",
    display: "Oncólogo pediátrico",
    system: "http://snomed.info/sct",
  },
  {
    code: "309337009",
    display: "Especialista en tratamiento del dolor",
    system: "http://snomed.info/sct",
  },
  {
    code: "309338004",
    display: "Especialista en cuidados intensivos",
    system: "http://snomed.info/sct",
  },
  {
    code: "309339007",
    display: "Especialista en cuidados intensivos para adultos",
    system: "http://snomed.info/sct",
  },
  {
    code: "309340009",
    display: "Especialista en cuidados intensivos pediátricos",
    system: "http://snomed.info/sct",
  },
  {
    code: "309341008",
    display: "Médico especialista en transfusión sanguínea",
    system: "http://snomed.info/sct",
  },
  {
    code: "309342001",
    display: "Histopatólogo",
    system: "http://snomed.info/sct",
  },
  {
    code: "309343006",
    display: "Médico",
    system: "http://snomed.info/sct",
  },
  {
    code: "309345004",
    display: "Médico de tórax",
    system: "http://snomed.info/sct",
  },
  {
    code: "309346003",
    display: "Médico torácico",
    system: "http://snomed.info/sct",
  },
  {
    code: "309347007",
    display: "Hematólogo clínico",
    system: "http://snomed.info/sct",
  },
  {
    code: "309348002",
    display: "Neurofisiólogo clínico",
    system: "http://snomed.info/sct",
  },
  {
    code: "309349005",
    display: "Fisiólogo clínico",
    system: "http://snomed.info/sct",
  },
  {
    code: "309350005",
    display: "Diabetólogo",
    system: "http://snomed.info/sct",
  },
  {
    code: "309351009",
    display: "Andrólogo",
    system: "http://snomed.info/sct",
  },
  {
    code: "309352002",
    display: "Neuroendocrinólogo",
    system: "http://snomed.info/sct",
  },
  {
    code: "309353007",
    display: "Endocrinólogo reproductivo",
    system: "http://snomed.info/sct",
  },
  {
    code: "309354001",
    display: "Tiroidólogo",
    system: "http://snomed.info/sct",
  },
  {
    code: "309355000",
    display: "Genetista clínico",
    system: "http://snomed.info/sct",
  },
  {
    code: "309356004",
    display: "Citogenetista clínico",
    system: "http://snomed.info/sct",
  },
  {
    code: "309357008",
    display: "Genetista molecular clínico",
    system: "http://snomed.info/sct",
  },
  {
    code: "309358003",
    display: "Médico de medicina genitourinaria",
    system: "http://snomed.info/sct",
  },
  {
    code: "309359006",
    display: "Médico de cuidados paliativos",
    system: "http://snomed.info/sct",
  },
  {
    code: "309360001",
    display: "Médico de rehabilitación",
    system: "http://snomed.info/sct",
  },
  {
    code: "309361002",
    display: "Psiquiatra de niños y adolescentes",
    system: "http://snomed.info/sct",
  },
  {
    code: "309362009",
    display: "Psiquiatra forense",
    system: "http://snomed.info/sct",
  },
  {
    code: "309363004",
    display: "Psiquiatra de enlace",
    system: "http://snomed.info/sct",
  },
  {
    code: "309364005",
    display: "Psicogeriatra",
    system: "http://snomed.info/sct",
  },
  {
    code: "309365006",
    display: "Psiquiatra for mental handicap",
    system: "http://snomed.info/sct",
  },
  {
    code: "309366007",
    display: "Psiquiatra de rehabilitación",
    system: "http://snomed.info/sct",
  },
  {
    code: "309367003",
    display: "Obstetra and gynecologist",
    system: "http://snomed.info/sct",
  },
  {
    code: "309368008",
    display: "Cirujano de mama",
    system: "http://snomed.info/sct",
  },
  {
    code: "309369000",
    display: "Cirujano cardiotorácico",
    system: "http://snomed.info/sct",
  },
  {
    code: "309371000",
    display: "Cirujano cardíaco",
    system: "http://snomed.info/sct",
  },
  {
    code: "309372007",
    display: "Otorrinolaringólogo",
    system: "http://snomed.info/sct",
  },
  {
    code: "309373002",
    display: "Cirujano endocrino",
    system: "http://snomed.info/sct",
  },
  {
    code: "309374008",
    display: "Cirujano de tiroides",
    system: "http://snomed.info/sct",
  },
  {
    code: "309375009",
    display: "Cirujano hipofisario",
    system: "http://snomed.info/sct",
  },
  {
    code: "309376005",
    display: "Cirujano gastrointestinal",
    system: "http://snomed.info/sct",
  },
  {
    code: "309377001",
    display: "Cirujano gastrointestinal general",
    system: "http://snomed.info/sct",
  },
  {
    code: "309378006",
    display: "Cirujano digestivo alto",
    system: "http://snomed.info/sct",
  },
  {
    code: "309379003",
    display: "Cirujano colorrectal",
    system: "http://snomed.info/sct",
  },
  {
    code: "309380000",
    display: "Cirujano de mano",
    system: "http://snomed.info/sct",
  },
  {
    code: "309381001",
    display: "Cirujano hepatobiliar",
    system: "http://snomed.info/sct",
  },
  {
    code: "309382008",
    display: "Cirujano oftalmólogo",
    system: "http://snomed.info/sct",
  },
  {
    code: "309383003",
    display: "Cirujano pediátrico",
    system: "http://snomed.info/sct",
  },
  {
    code: "309384009",
    display: "Cirujano pancreático",
    system: "http://snomed.info/sct",
  },
  {
    code: "309385005",
    display: "Cirujano de trasplante",
    system: "http://snomed.info/sct",
  },
  {
    code: "309386006",
    display: "Cirujano traumatólogo",
    system: "http://snomed.info/sct",
  },
  {
    code: "309388007",
    display: "Cirujano vascular",
    system: "http://snomed.info/sct",
  },
  {
    code: "309389004",
    display: "Médico generalista grade",
    system: "http://snomed.info/sct",
  },
  {
    code: "309390008",
    display: "Consultor hospitalario",
    system: "http://snomed.info/sct",
  },
  {
    code: "309391007",
    display: "Especialista visitante",
    system: "http://snomed.info/sct",
  },
  {
    code: "309392000",
    display: "Médico investigador",
    system: "http://snomed.info/sct",
  },
  {
    code: "309393005",
    display: "Médico generalista",
    system: "http://snomed.info/sct",
  },
  {
    code: "309394004",
    display: "Médico generalista principal",
    system: "http://snomed.info/sct",
  },
  {
    code: "309395003",
    display: "Especialista hospitalario",
    system: "http://snomed.info/sct",
  },
  {
    code: "309396002",
    display: "Especialista asociado",
    system: "http://snomed.info/sct",
  },
  {
    code: "309397006",
    display: "Investigador",
    system: "http://snomed.info/sct",
  },
  {
    code: "309398001",
    display: "Profesional sanitario aliado",
    system: "http://snomed.info/sct",
  },
  {
    code: "309399009",
    display: "Dietista hospitalario",
    system: "http://snomed.info/sct",
  },
  {
    code: "309400002",
    display: "Fisioterapeuta a domicilio",
    system: "http://snomed.info/sct",
  },
  {
    code: "309401003",
    display: "Fisioterapeuta de medicina general",
    system: "http://snomed.info/sct",
  },
  {
    code: "309402005",
    display: "Fisioterapeuta hospitalario",
    system: "http://snomed.info/sct",
  },
  {
    code: "309403000",
    display: "Fisioterapeuta privado",
    system: "http://snomed.info/sct",
  },
  {
    code: "309404006",
    display: "Auxiliar de fisioterapia",
    system: "http://snomed.info/sct",
  },
  {
    code: "309409001",
    display: "Logopeda hospitalario",
    system: "http://snomed.info/sct",
  },
  {
    code: "309410006",
    display: "Terapeuta artístico",
    system: "http://snomed.info/sct",
  },
  {
    code: "309411005",
    display: "Danzaterapeuta",
    system: "http://snomed.info/sct",
  },
  {
    code: "309412003",
    display: "Musicoterapeuta",
    system: "http://snomed.info/sct",
  },
  {
    code: "309413008",
    display: "Dietista renal",
    system: "http://snomed.info/sct",
  },
  {
    code: "309414002",
    display: "Dietista hepática",
    system: "http://snomed.info/sct",
  },
  {
    code: "309415001",
    display: "Dietista oncológico",
    system: "http://snomed.info/sct",
  },
  {
    code: "309416000",
    display: "Dietista pediátrico",
    system: "http://snomed.info/sct",
  },
  {
    code: "309417009",
    display: "Dietista para diabetes",
    system: "http://snomed.info/sct",
  },
  {
    code: "309418004",
    display: "Audiólogo",
    system: "http://snomed.info/sct",
  },
  {
    code: "309419007",
    display: "Terapeuta auditivo",
    system: "http://snomed.info/sct",
  },
  {
    code: "309420001",
    display: "Audiólogo",
    system: "http://snomed.info/sct",
  },
  {
    code: "309421002",
    display: "Distribuidor de audífonos",
    system: "http://snomed.info/sct",
  },
  {
    code: "309422009",
    display: "Terapeuta ocupacional comunitario",
    system: "http://snomed.info/sct",
  },
  {
    code: "309423004",
    display: "Terapeuta ocupacional hospitalario",
    system: "http://snomed.info/sct",
  },
  {
    code: "309427003",
    display: "Terapeuta ocupacional de servicios sociales",
    system: "http://snomed.info/sct",
  },
  {
    code: "309428008",
    display: "Ortesista",
    system: "http://snomed.info/sct",
  },
  {
    code: "309429000",
    display: "Adaptador quirúrgico",
    system: "http://snomed.info/sct",
  },
  {
    code: "309434001",
    display: "Podólogo hospitalario",
    system: "http://snomed.info/sct",
  },
  {
    code: "309435000",
    display: "Auxiliar de podología",
    system: "http://snomed.info/sct",
  },
  {
    code: "309436004",
    display: "Enfermero de linfedema",
    system: "http://snomed.info/sct",
  },
  {
    code: "309437008",
    display:
      "Enfermera comunitaria especializada en dificultades de aprendizaje",
    system: "http://snomed.info/sct",
  },
  {
    code: "309439006",
    display: "Profesor de enfermería clínica",
    system: "http://snomed.info/sct",
  },
  {
    code: "309440008",
    display: "Profesor de enfermería práctica comunitaria",
    system: "http://snomed.info/sct",
  },
  {
    code: "309441007",
    display: "Enfermera tutor",
    system: "http://snomed.info/sct",
  },
  {
    code: "309442000",
    display: "Enfermera teacher practitioner",
    system: "http://snomed.info/sct",
  },
  {
    code: "309443005",
    display: "Enfermera lecturer practitioner",
    system: "http://snomed.info/sct",
  },
  {
    code: "309444004",
    display: "Enfermera de extensión",
    system: "http://snomed.info/sct",
  },
  {
    code: "309445003",
    display: "Enfermera anestesista",
    system: "http://snomed.info/sct",
  },
  {
    code: "309446002",
    display: "Enfermera manager",
    system: "http://snomed.info/sct",
  },
  {
    code: "309450009",
    display: "Enfermera administrator",
    system: "http://snomed.info/sct",
  },
  {
    code: "309452001",
    display: "Grado de matrona",
    system: "http://snomed.info/sct",
  },
  {
    code: "309453006",
    display: "Matrona",
    system: "http://snomed.info/sct",
  },
  {
    code: "309454000",
    display: "Estudiante de matrona",
    system: "http://snomed.info/sct",
  },
  {
    code: "309455004",
    display: "Matrona",
    system: "http://snomed.info/sct",
  },
  {
    code: "309459005",
    display: "Grado profesional sanitario",
    system: "http://snomed.info/sct",
  },
  {
    code: "309460000",
    display: "Odontólogo restaurador",
    system: "http://snomed.info/sct",
  },
  {
    code: "310170009",
    display: "Audiólogo pediátrico",
    system: "http://snomed.info/sct",
  },
  {
    code: "310171008",
    display: "Inmunopatólogo",
    system: "http://snomed.info/sct",
  },
  {
    code: "310172001",
    display: "Médico audiólogo",
    system: "http://snomed.info/sct",
  },
  {
    code: "310173006",
    display: "Farmacólogo clínico",
    system: "http://snomed.info/sct",
  },
  {
    code: "310174000",
    display: "Médico privado",
    system: "http://snomed.info/sct",
  },
  {
    code: "310175004",
    display: "Enfermero de agencia",
    system: "http://snomed.info/sct",
  },
  {
    code: "310176003",
    display: "Enfermero terapeuta conductual",
    system: "http://snomed.info/sct",
  },
  {
    code: "310177007",
    display: "Enfermera de rehabilitación cardiaca",
    system: "http://snomed.info/sct",
  },
  {
    code: "310178002",
    display: "Enfermera genitourinaria",
    system: "http://snomed.info/sct",
  },
  {
    code: "310179005",
    display: "Enfermera especialista en reumatología",
    system: "http://snomed.info/sct",
  },
  {
    code: "310180008",
    display: "Enfermera de continencia",
    system: "http://snomed.info/sct",
  },
  {
    code: "310181007",
    display: "Enfermera de localización de contactos",
    system: "http://snomed.info/sct",
  },
  {
    code: "310182000",
    display: "Enfermera general",
    system: "http://snomed.info/sct",
  },
  {
    code: "310183005",
    display: "Enfermera for the mentally handicapped",
    system: "http://snomed.info/sct",
  },
  {
    code: "310184004",
    display: "Enfermera de enlace",
    system: "http://snomed.info/sct",
  },
  {
    code: "310185003",
    display: "Enfermera de enlace para diabéticos",
    system: "http://snomed.info/sct",
  },
  {
    code: "310186002",
    display: "Enfermera psychotherapist",
    system: "http://snomed.info/sct",
  },
  {
    code: "310187006",
    display: "Enfermera de empresa",
    system: "http://snomed.info/sct",
  },
  {
    code: "310188001",
    display: "Matrona de hospital",
    system: "http://snomed.info/sct",
  },
  {
    code: "310189009",
    display: "Asesor genético",
    system: "http://snomed.info/sct",
  },
  {
    code: "310190000",
    display: "Asesor en salud mental",
    system: "http://snomed.info/sct",
  },
  {
    code: "310191001",
    display: "Psicólogo clínico",
    system: "http://snomed.info/sct",
  },
  {
    code: "310192008",
    display: "Psicólogo educativo",
    system: "http://snomed.info/sct",
  },
  {
    code: "310193003",
    display: "Médico forense",
    system: "http://snomed.info/sct",
  },
  {
    code: "310194009",
    display: "Oficial de aparatos",
    system: "http://snomed.info/sct",
  },
  {
    code: "310512001",
    display: "Médico oncólogo",
    system: "http://snomed.info/sct",
  },
  {
    code: "311441001",
    display: "Médico escolar",
    system: "http://snomed.info/sct",
  },
  {
    code: "312485001",
    display: "Matrona integrada",
    system: "http://snomed.info/sct",
  },
  {
    code: "372102007",
    display: "Enfermero asistente",
    system: "http://snomed.info/sct",
  },
  {
    code: "387619007",
    display: "Óptico",
    system: "http://snomed.info/sct",
  },
  {
    code: "394572006",
    display: "Secretario médico",
    system: "http://snomed.info/sct",
  },
  {
    code: "394618009",
    display: "Enfermero de hospital",
    system: "http://snomed.info/sct",
  },
  {
    code: "397824005",
    display: "Anestesista consultor",
    system: "http://snomed.info/sct",
  },
  {
    code: "397897005",
    display: "Paramédico",
    system: "http://snomed.info/sct",
  },
  {
    code: "397903001",
    display: "Obstetra",
    system: "http://snomed.info/sct",
  },
  {
    code: "397908005",
    display: "Médico de plantilla",
    system: "http://snomed.info/sct",
  },
  {
    code: "398130009",
    display: "Estudiante de medicina",
    system: "http://snomed.info/sct",
  },
  {
    code: "398238009",
    display: "Registrador obstétrico interino",
    system: "http://snomed.info/sct",
  },
  {
    code: "404940000",
    display: "Fisioterapeuta instructor técnico",
    system: "http://snomed.info/sct",
  },
  {
    code: "405277009",
    display: "Médico residente",
    system: "http://snomed.info/sct",
  },
  {
    code: "405278004",
    display: "Enfermero anestesista diplomado",
    system: "http://snomed.info/sct",
  },
  {
    code: "405279007",
    display: "Médico adjunto",
    system: "http://snomed.info/sct",
  },
  {
    code: "405623001",
    display: "Médico asignado",
    system: "http://snomed.info/sct",
  },
  {
    code: "405684005",
    display: "Profesional que inicia el caso quirúrgico",
    system: "http://snomed.info/sct",
  },
  {
    code: "405685006",
    display:
      "Profesional que releva al personal durante el procedimiento quirúrgico",
    system: "http://snomed.info/sct",
  },
  {
    code: "408798009",
    display: "Pediatra consultor",
    system: "http://snomed.info/sct",
  },
  {
    code: "408799001",
    display: "Neonatólogo consultor",
    system: "http://snomed.info/sct",
  },
  {
    code: "409974004",
    display: "Educador sanitario",
    system: "http://snomed.info/sct",
  },
  {
    code: "409975003",
    display: "Especialista certificado en educación sanitaria",
    system: "http://snomed.info/sct",
  },
  {
    code: "413854007",
    display: "Enfermera circulante",
    system: "http://snomed.info/sct",
  },
  {
    code: "415075003",
    display: "Enfermera perioperatoria",
    system: "http://snomed.info/sct",
  },
  {
    code: "415506007",
    display: "Enfermera de quirófano",
    system: "http://snomed.info/sct",
  },
  {
    code: "416160000",
    display: "Fellow of American Academy of Osteópatay",
    system: "http://snomed.info/sct",
  },
  {
    code: "420409002",
    display: "Cirujano oculoplástico",
    system: "http://snomed.info/sct",
  },
  {
    code: "420678001",
    display: "Cirujano de retina",
    system: "http://snomed.info/sct",
  },
  {
    code: "421841007",
    display: "Médico de admisión",
    system: "http://snomed.info/sct",
  },
  {
    code: "422140007",
    display: "Médico oftalmólogo",
    system: "http://snomed.info/sct",
  },
  {
    code: "422234006",
    display: "Oftalmólogo",
    system: "http://snomed.info/sct",
  },
  {
    code: "432100008",
    display: "Técnico sanitario",
    system: "http://snomed.info/sct",
  },
  {
    code: "442867008",
    display: "Terapeuta respiratorio",
    system: "http://snomed.info/sct",
  },
  {
    code: "443090005",
    display: "Cirujano podiátrico",
    system: "http://snomed.info/sct",
  },
  {
    code: "444912007",
    display: "Hipnoterapeuta",
    system: "http://snomed.info/sct",
  },
  {
    code: "445313000",
    display: "Enfermero especialista en asma",
    system: "http://snomed.info/sct",
  },
  {
    code: "445451001",
    display: "Enfermera case manager",
    system: "http://snomed.info/sct",
  },
  {
    code: "446050000",
    display: "Médico de atención primaria",
    system: "http://snomed.info/sct",
  },
  {
    code: "446701002",
    display: "Especialista en medicina de las adicciones",
    system: "http://snomed.info/sct",
  },
  {
    code: "449161006",
    display: "Asistente médico",
    system: "http://snomed.info/sct",
  },
  {
    code: "471302004",
    display: "Matrona gubernamental",
    system: "http://snomed.info/sct",
  },
  {
    code: "3981000175106",
    display: "Enfermera complex case manager",
    system: "http://snomed.info/sct",
  },
  {
    code: "231189271000087109",
    display: "Naturópata",
    system: "http://snomed.info/sct",
  },
  {
    code: "236749831000087105",
    display: "Protésico",
    system: "http://snomed.info/sct",
  },
  {
    code: "258508741000087105",
    display: "Cirujano de cadera y rodilla",
    system: "http://snomed.info/sct",
  },
  {
    code: "260767431000087107",
    display: "Hepatólogo",
    system: "http://snomed.info/sct",
  },
  {
    code: "285631911000087106",
    display: "Cirujano de hombro",
    system: "http://snomed.info/sct",
  },
  {
    code: "291705421000087106",
    display: "Radiólogo intervencionista",
    system: "http://snomed.info/sct",
  },
  {
    code: "341320851000087105",
    display: "Radiólogo pediátrico",
    system: "http://snomed.info/sct",
  },
  {
    code: "368890881000087105",
    display: "Especialista en medicina de urgencias",
    system: "http://snomed.info/sct",
  },
  {
    code: "398480381000087106",
    display: "Especialista en medicina familiar - palliative care",
    system: "http://snomed.info/sct",
  },
  {
    code: "416186861000087101",
    display: "Oncólogo quirúrgico",
    system: "http://snomed.info/sct",
  },
  {
    code: "450044741000087104",
    display: "Acupuntor",
    system: "http://snomed.info/sct",
  },
  {
    code: "465511991000087105",
    display: "Cirujano ortopédico pediátrico",
    system: "http://snomed.info/sct",
  },
  {
    code: "494782281000087101",
    display: "Hematólogo pediátrico",
    system: "http://snomed.info/sct",
  },
  {
    code: "619197631000087102",
    display: "Neurorradiólogo",
    system: "http://snomed.info/sct",
  },
  {
    code: "623630151000087105",
    display: "Especialista en medicina familiar - anesthetist",
    system: "http://snomed.info/sct",
  },
  {
    code: "666997781000087107",
    display: "Doula",
    system: "http://snomed.info/sct",
  },
  {
    code: "673825031000087109",
    display: "Especialista en fitoterapia tradicional",
    system: "http://snomed.info/sct",
  },
  {
    code: "682131381000087105",
    display: "Especialista en medicina del trabajo",
    system: "http://snomed.info/sct",
  },
  {
    code: "724111801000087104",
    display: "Especialista en medicina de urgencias pediátricas",
    system: "http://snomed.info/sct",
  },
  {
    code: "747936471000087102",
    display: "Especialista en medicina familiar - care of the elderly",
    system: "http://snomed.info/sct",
  },
  {
    code: "766788081000087100",
    display: "Especialista en medicina del viajero",
    system: "http://snomed.info/sct",
  },
  {
    code: "767205061000087108",
    display: "Cirujano de columna",
    system: "http://snomed.info/sct",
  },
  {
    code: "813758161000087106",
    display: "Especialista en medicina materna o fetal",
    system: "http://snomed.info/sct",
  },
  {
    code: "822410621000087104",
    display: "Masajista",
    system: "http://snomed.info/sct",
  },
  {
    code: "847240411000087102",
    display: "Hospitalista",
    system: "http://snomed.info/sct",
  },
  {
    code: "853827051000087104",
    display: "Especialista en medicina deportiva",
    system: "http://snomed.info/sct",
  },
  {
    code: "926871431000087103",
    display: "Respirólogo pediátrico",
    system: "http://snomed.info/sct",
  },
  {
    code: "954544641000087107",
    display: "Homeópata",
    system: "http://snomed.info/sct",
  },
  {
    code: "956387501000087102",
    display: "Especialista en medicina familiar - emergency medicine",
    system: "http://snomed.info/sct",
  },
  {
    code: "969118571000087109",
    display: "Hematólogo pediátrico or oncologist",
    system: "http://snomed.info/sct",
  },
  {
    code: "984095901000087105",
    display: "Cirujano de pie y tobillo",
    system: "http://snomed.info/sct",
  },
  {
    code: "990928611000087105",
    display: "Cardiólogo invasivo",
    system: "http://snomed.info/sct",
  },
  {
    code: "999480451000087102",
    display: "Gestor de casos",
    system: "http://snomed.info/sct",
  },
  {
    code: "999480461000087104",
    display: "Cinestesiólogo",
    system: "http://snomed.info/sct",
  },
];
*/

export const practitionerRoles: Coding[] = [
  // Medicina
  { code: "medicina", display: "Medicina", system: "cttn.cl" },
  { code: "odontologia", display: "Odontología", system: "cttn.cl" },
  { code: "kinesiologia", display: "Kinesiología", system: "cttn.cl" },
  { code: "enfermeria", display: "Enfermería", system: "cttn.cl" },
  { code: "nutricion", display: "Nutrición", system: "cttn.cl" },
  { code: "psicologia", display: "Psicología", system: "cttn.cl" },
  {
    code: "tecnologia-medica",
    display: "Tecnología Médica",
    system: "cttn.cl",
  },
  { code: "fonoaudiologia", display: "Fonoaudiología", system: "cttn.cl" },
  {
    code: "terapia-ocupacional",
    display: "Terapia Ocupacional",
    system: "cttn.cl",
  },
];

export const practitionerSpecialties: Coding[] = [
  // Medicina
  { code: "pediatria", display: "Pediatría", system: "cttn.cl" },
  {
    code: "ginecologia-obstetricia",
    display: "Ginecología y Obstetricia",
    system: "cttn.cl",
  },
  { code: "cirugia", display: "Cirugía", system: "cttn.cl" },
  { code: "medicina-interna", display: "Medicina Interna", system: "cttn.cl" },
  { code: "psiquiatria", display: "Psiquiatría", system: "cttn.cl" },
  { code: "cardiologia", display: "Cardiología", system: "cttn.cl" },
  { code: "dermatologia", display: "Dermatología", system: "cttn.cl" },
  { code: "oftalmologia", display: "Oftalmología", system: "cttn.cl" },
  {
    code: "otorrinolaringologia",
    display: "Otorrinolaringología",
    system: "cttn.cl",
  },
  { code: "anestesiologia", display: "Anestesiología", system: "cttn.cl" },

  // Odontología
  { code: "ortodoncia", display: "Ortodoncia", system: "cttn.cl" },
  { code: "endodoncia", display: "Endodoncia", system: "cttn.cl" },
  { code: "periodoncia", display: "Periodoncia", system: "cttn.cl" },
  { code: "implantes", display: "Implantes", system: "cttn.cl" },
  { code: "cirugia-oral", display: "Cirugía Oral", system: "cttn.cl" },

  // Kinesiología
  {
    code: "kinesiologia-deportiva",
    display: "Kinesiología Deportiva",
    system: "cttn.cl",
  },
  {
    code: "kinesiologia-geriatrica",
    display: "Kinesiología Geriátrica",
    system: "cttn.cl",
  },
  {
    code: "kinesiologia-neurologica",
    display: "Kinesiología Neurológica",
    system: "cttn.cl",
  },
  {
    code: "kinesiologia-infantil",
    display: "Kinesiología Infantil",
    system: "cttn.cl",
  },
  {
    code: "kinesiologia-cardiorespiratoria",
    display: "Kinesiología Cardiorespiratoria",
    system: "cttn.cl",
  },

  // Enfermería
  {
    code: "enfermeria-pediatrica",
    display: "Enfermería Pediátrica",
    system: "cttn.cl",
  },
  {
    code: "enfermeria-geriatrica",
    display: "Enfermería Geriátrica",
    system: "cttn.cl",
  },
  {
    code: "enfermeria-salud-mental",
    display: "Enfermería en Salud Mental",
    system: "cttn.cl",
  },
  {
    code: "enfermeria-quirurgica",
    display: "Enfermería Quirúrgica",
    system: "cttn.cl",
  },

  // Nutrición
  {
    code: "nutricion-clinica",
    display: "Nutrición Clínica",
    system: "cttn.cl",
  },
  {
    code: "nutricion-deportiva",
    display: "Nutrición Deportiva",
    system: "cttn.cl",
  },
  { code: "salud-publica", display: "Salud Pública", system: "cttn.cl" },

  // Psicología
  {
    code: "psicologia-clinica",
    display: "Psicología Clínica",
    system: "cttn.cl",
  },
  {
    code: "psicologia-educacional",
    display: "Psicología Educacional",
    system: "cttn.cl",
  },
  {
    code: "psicologia-organizacional",
    display: "Psicología Organizacional",
    system: "cttn.cl",
  },

  // Tecnología Médica
  {
    code: "imagenes-diagnosticas",
    display: "Imágenes Diagnósticas",
    system: "cttn.cl",
  },
  {
    code: "laboratorio-clinico",
    display: "Laboratorio Clínico",
    system: "cttn.cl",
  },
  { code: "optometria", display: "Optometría", system: "cttn.cl" },

  // Fonoaudiología
  {
    code: "fonoaudiologia-clinica",
    display: "Fonoaudiología Clínica",
    system: "cttn.cl",
  },
  {
    code: "fonoaudiologia-educacional",
    display: "Fonoaudiología Educacional",
    system: "cttn.cl",
  },

  // Terapia Ocupacional
  {
    code: "terapia-ocupacional-salud-mental",
    display: "Terapia Ocupacional en Salud Mental",
    system: "cttn.cl",
  },
  {
    code: "terapia-ocupacional-pediatrica",
    display: "Terapia Ocupacional Pediátrica",
    system: "cttn.cl",
  },
];
