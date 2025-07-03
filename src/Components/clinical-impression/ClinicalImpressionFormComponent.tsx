import { DevTool } from "@hookform/devtools";
import { useForm, SubmitHandler, Controller } from "react-hook-form";
import {
  TextField,
  Stack,
  Typography,
  Tooltip,
  IconButton,
  InputAdornment,
  Box,
} from "@mui/material";
import dayjs from "dayjs";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { Patient, Practitioner, Encounter } from "fhir/r4";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { useDebouncedCallback } from "use-debounce";

import AutoCompleteComponent from "../auto-complete-components/AutoCompleteComponent";
import PersonUtil from "../../Services/Utils/PersonUtils";
import EncounterUtils from "../../Services/Utils/EncounterUtils";
import { loadUserRoleFromLocalStorage } from "../../Utils/RolUser";
import { ClinicalImpressionFormData } from "../../Models/Forms/ClinicalImpressionForm";

import InfoIcon from "@mui/icons-material/Info";

function getEncounterDisplay(resource: Encounter): string {
  return `Profesional: ${EncounterUtils.getPrimaryPractitioner(
    resource
  )} -- ${EncounterUtils.getFormatPeriod(resource.period!)}`;
}

// Interfaz para los datos del formulario

export default function ClinicalImpressionFormComponent({
  formId,
  patientId,
  submitForm,
  clinicalImpression,
  practitionerId,
  encounterId,
  readOnly = false,
}: {
  formId: string;
  patientId?: string;
  submitForm: SubmitHandler<ClinicalImpressionFormData>;
  clinicalImpression?: ClinicalImpressionFormData;
  practitionerId?: string;
  encounterId?: string;
  readOnly?: boolean;
}) {
  const {
    control,
    trigger,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<ClinicalImpressionFormData>({
    defaultValues: {
      assessor: clinicalImpression?.assessor,
      subject: clinicalImpression?.subject,
      encounter: clinicalImpression?.encounter,
      date: clinicalImpression?.date ? dayjs(clinicalImpression.date) : dayjs(),
      previous: clinicalImpression?.previous,
      description: clinicalImpression?.description || "",
      summary: clinicalImpression?.summary || "Detalles de la evolución",
      note: clinicalImpression?.note || "",
    },
  });

  console.log("ClinicalImpressionFormComponent", clinicalImpression);

  const roleUser = loadUserRoleFromLocalStorage();
  //if (clinicalImpression)
  //  encounterId = clinicalImpression.encounter?.reference?.split("/")[1];

  const handleQuillChange = useDebouncedCallback((content: string) => {
    setValue("summary", content);
    trigger("summary");
  }, 300);

  /*
  const [selectedPatient, setSelectedPatient] = useState<string | undefined>(
    patientId
  );
  const [selectedPractitioner, setSelectedPractitioner] = useState<
    string | undefined
  >(practitionerId);
  */

  return (
    <>
      <form id={formId} onSubmit={handleSubmit(submitForm)}>
        <Stack spacing={2}>
          <Controller
            name="assessor"
            control={control}
            rules={{
              required: "Es necesario seleccionar un Profesional",
            }}
            render={({ field }) => (
              <AutoCompleteComponent<Practitioner>
                resourceType={"Practitioner"}
                label={"Selecciona Profesional"}
                getDisplay={PersonUtil.getPersonNameAsString}
                searchParam={"name"}
                defaultResourceId={
                  clinicalImpression?.assessor?.id || practitionerId
                }
                onChange={(selectedObject) => {
                  if (selectedObject) {
                    field.onChange({
                      id: selectedObject.id,
                      display: PersonUtil.getPersonNameAsString(selectedObject),
                    });
                    //setSelectedPractitioner(selectedObject.id);
                  } else {
                    field.onChange(null);
                  }
                }}
                readOnly={
                  readOnly || !(roleUser === "Admin") || Boolean(encounterId)
                }
                textFieldProps={{
                  error: Boolean(errors.assessor),
                  helperText: errors.assessor && errors.assessor.message,
                }}
              />
            )}
          />
          <Controller
            name="subject"
            control={control}
            rules={{
              required: "Es necesario seleccionar un Paciente",
            }}
            render={({ field }) => (
              <AutoCompleteComponent<Patient>
                resourceType={"Patient"}
                label={"Selecciona Paciente"}
                getDisplay={PersonUtil.getPersonNameAsString}
                searchParam={"name"}
                defaultResourceId={clinicalImpression?.subject?.id || patientId}
                defaultParams={
                  roleUser === "Practitioner"
                    ? { "general-practitioner": practitionerId! }
                    : {}
                }
                onChange={(selectedObject) => {
                  if (selectedObject) {
                    field.onChange({
                      id: selectedObject.id,
                      display: PersonUtil.getPersonNameAsString(selectedObject),
                    });
                    //setSelectedPatient(selectedObject.id);
                  } else {
                    field.onChange(null);
                  }
                }}
                readOnly={readOnly || Boolean(patientId)}
                textFieldProps={{
                  error: Boolean(errors.subject),
                  helperText: errors.subject && errors.subject.message,
                }}
              />
            )}
          />
          <Controller
            name="encounter"
            control={control}
            rules={{
              required: "Es necesario seleccionar un Encuentro",
            }}
            render={({ field }) => (
              <AutoCompleteComponent<Encounter>
                resourceType={"Encounter"}
                label={"Seleccionar Sesión"}
                getDisplay={getEncounterDisplay}
                defaultResourceId={
                  clinicalImpression?.encounter?.id || encounterId
                }
                defaultParams={{
                  subject: clinicalImpression?.subject?.id || patientId!,
                  _count: 99999,
                }}
                searchParam={""}
                onChange={(selectedObject) => {
                  if (selectedObject) {
                    field.onChange({
                      id: selectedObject.id,
                      display: getEncounterDisplay(selectedObject),
                    });
                  } else {
                    field.onChange(null);
                  }
                }}
                readOnly={
                  readOnly || Boolean(encounterId) || roleUser === "Patient"
                }
                textFieldProps={{
                  error: Boolean(errors.encounter),
                  helperText: errors.encounter && errors.encounter.message,
                }}
              />
            )}
          />
          <Controller
            control={control}
            name="date"
            defaultValue={dayjs()}
            render={({ field: { onChange, value, ref } }) => (
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DatePicker
                  format="DD-MM-YYYY"
                  views={["year", "month", "day"]}
                  label="Fecha de registro"
                  onChange={onChange}
                  value={value}
                  inputRef={ref}
                  sx={{ width: "100%" }}
                  readOnly={readOnly}
                ></DatePicker>
              </LocalizationProvider>
            )}
          ></Controller>

          <Controller
            name="description"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                fullWidth
                label="Descripción"
                variant="outlined"
                error={Boolean(errors.description)}
                helperText={errors.description?.message}
                inputProps={{
                  readOnly: readOnly,
                }}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <Tooltip title="Sesión 1 - Kinesiología">
                        <IconButton>
                          <InfoIcon />
                        </IconButton>
                      </Tooltip>
                    </InputAdornment>
                  ),
                }}
              />
            )}
          />
          <Controller
            name="summary"
            control={control}
            defaultValue={clinicalImpression?.summary}
            render={({ field }) => (
              <Box height={300}>
                <ReactQuill
                  value={field.value || "Detalles de la evolución"}
                  onChange={(content) => {
                    field.onChange(content);
                    handleQuillChange(content);
                  }}
                  readOnly={readOnly}
                  modules={{
                    toolbar: !readOnly
                      ? [
                          [{ header: "1" }, { header: "2" }, { font: [] }],
                          [{ size: [] }],
                          [
                            "bold",
                            "italic",
                            "underline",
                            "strike",
                            "blockquote",
                          ],
                          [
                            { list: "ordered" },
                            { list: "bullet" },
                            { indent: "-1" },
                            { indent: "+1" },
                          ],
                          ["link", "image", "video"],
                          ["clean"],
                        ]
                      : false,
                  }}
                  formats={[
                    "header",
                    "font",
                    "size",
                    "bold",
                    "italic",
                    "underline",
                    "strike",
                    "blockquote",
                    "list",
                    "bullet",
                    "indent",
                    "link",
                    "image",
                    "video",
                  ]}
                  style={{ height: 220 }}
                />
                {errors.summary && (
                  <Typography color="error" variant="body2">
                    {errors.summary.message}
                  </Typography>
                )}
              </Box>
            )}
          />
          <Controller
            name="note"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                fullWidth
                label="Notas Extras"
                variant="outlined"
                error={Boolean(errors.note)}
                helperText={errors.note?.message}
                inputProps={{
                  readOnly: readOnly,
                }}
              />
            )}
          />
        </Stack>
      </form>
      <DevTool control={control} />
    </>
  );
}
