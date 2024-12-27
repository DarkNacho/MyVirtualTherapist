import { DevTool } from "@hookform/devtools";
import PersonUtil from "../../../Services/Utils/PersonUtils";
import AutoCompleteComponent from "../../auto-complete-components/AutoCompleteComponent";

import { useForm, Controller, SubmitHandler } from "react-hook-form";
import dayjs from "dayjs";
import {
  DatePicker,
  LocalizationProvider,
  TimePicker,
} from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { Box, MenuItem, Stack, TextField } from "@mui/material";
import { Encounter, Patient, Practitioner } from "fhir/r4";
import { loadUserRoleFromLocalStorage } from "../../../Utils/RolUser";

import { encounterType } from "../../../Models/Terminology";
import { useState } from "react";
import EncounterUtils from "../../../Services/Utils/EncounterUtils";
import { EncounterFormData } from "../../../Models/Forms/EncounterForm";

function getDisplay(resource: Encounter): string {
  const roleUser = loadUserRoleFromLocalStorage();
  let display = "";

  if (roleUser === "Admin")
    display = `Paciente: ${EncounterUtils.getSubjectDisplayOrID(
      resource.subject!
    )}
  Profesional: ${EncounterUtils.getPrimaryPractitioner(resource)}`;

  if (roleUser == "Patient")
    display = `Profesional: ${EncounterUtils.getPrimaryPractitioner(resource)}`;
  if (roleUser == "Practitioner")
    display = `Paciente: ${EncounterUtils.getSubjectDisplayOrID(
      resource.subject!
    )}`;

  return `  ${display}
  ${EncounterUtils.getFormatPeriod(resource.period!)}`;
}

export default function EncounterFormComponent({
  formId,
  submitForm,
  practitionerId,
  patientId,
  readOnly = false,
}: {
  formId: string;
  submitForm: SubmitHandler<EncounterFormData>;
  practitionerId: string;
  patientId?: string;
  readOnly?: boolean;
}) {
  const {
    handleSubmit,
    control,
    register,
    formState: { errors },
  } = useForm<EncounterFormData>();

  const roleUser = loadUserRoleFromLocalStorage();

  const [selectedPatient, setSelectedPatient] = useState<string | undefined>(
    patientId
  );
  const [selectedPractitioner, setSelectedPractitioner] = useState<
    string | undefined
  >(practitionerId);

  return (
    <>
      <form id={formId} onSubmit={handleSubmit(submitForm)}>
        <Stack spacing={2}>
          <Controller
            name="practitioner"
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
                defaultResourceId={practitionerId}
                onChange={(selectedObject) => {
                  if (selectedObject) {
                    field.onChange({
                      id: selectedObject.id,
                      display: PersonUtil.getPersonNameAsString(selectedObject),
                    });
                    setSelectedPractitioner(selectedObject.id);
                  } else {
                    field.onChange(null);
                  }
                }}
                readOnly={readOnly || !(roleUser === "Admin")}
                textFieldProps={{
                  error: Boolean(errors.practitioner),
                  helperText:
                    errors.practitioner && errors.practitioner.message,
                }}
              />
            )}
          />
          <Controller
            name="patient"
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
                defaultResourceId={patientId}
                defaultParams={
                  roleUser === "Practitioner"
                    ? { "general-practitioner": practitionerId }
                    : {}
                }
                onChange={(selectedObject) => {
                  if (selectedObject) {
                    field.onChange({
                      id: selectedObject.id,
                      display: PersonUtil.getPersonNameAsString(selectedObject),
                    });
                    setSelectedPatient(selectedObject.id);
                  } else {
                    field.onChange(null);
                  }
                }}
                readOnly={readOnly || Boolean(patientId)}
                textFieldProps={{
                  error: Boolean(errors.patient),
                  helperText: errors.patient && errors.patient.message,
                }}
              />
            )}
          />
          <Box gap={5} display="flex" justifyContent="space-between">
            <Controller
              control={control}
              name="day"
              defaultValue={dayjs()}
              render={({ field }) => (
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <DatePicker
                    format="DD-MM-YYYY"
                    views={["year", "month", "day"]}
                    label="Fecha"
                    onChange={field.onChange}
                    value={field.value}
                    inputRef={field.ref}
                    sx={{ width: "100%" }}
                    readOnly={readOnly}
                  ></DatePicker>
                </LocalizationProvider>
              )}
            ></Controller>

            <Controller
              control={control}
              name="start"
              defaultValue={dayjs()}
              render={({ field: { onChange, value, ref } }) => (
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <TimePicker
                    label="Inicia"
                    onChange={onChange}
                    value={value}
                    inputRef={ref}
                    sx={{ width: "100%" }}
                    readOnly={readOnly}
                  ></TimePicker>
                </LocalizationProvider>
              )}
            ></Controller>

            <Controller
              control={control}
              defaultValue={dayjs().add(30, "minutes")}
              name="end"
              render={({ field: { onChange, value, ref } }) => (
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <TimePicker
                    label="Finaliza"
                    onChange={onChange}
                    value={value}
                    inputRef={ref}
                    sx={{ width: "100%" }}
                    readOnly={readOnly}
                  ></TimePicker>
                </LocalizationProvider>
              )}
            ></Controller>
          </Box>
          <TextField
            select
            label="Tipo"
            defaultValue="AMB"
            {...register("type", {
              required: "Tipo de consulta requerida",
            })}
            fullWidth
            error={Boolean(errors.type)}
            helperText={errors.type && errors.type.message}
            inputProps={{ readOnly: readOnly }}
          >
            {encounterType.map((item) => (
              <MenuItem key={item.code} value={item.code}>
                {item.display}
              </MenuItem>
            ))}
          </TextField>
          <Controller
            name="seguimiento"
            control={control}
            render={({ field }) => (
              <AutoCompleteComponent<Encounter>
                resourceType={"Encounter"}
                label={"Selecciona un encuentro para hacer seguimiento"}
                getDisplay={getDisplay}
                defaultParams={{
                  subject: selectedPatient!,
                  participant: selectedPractitioner!,
                  _count: 99999,
                }}
                searchParam={""}
                onChange={(selectedObject) => {
                  if (selectedObject) {
                    field.onChange({
                      id: selectedObject.id,
                      display: getDisplay(selectedObject),
                    });
                  } else {
                    field.onChange(null);
                  }
                }}
                textFieldProps={{
                  error: Boolean(errors.practitioner),
                  helperText:
                    errors.practitioner && errors.practitioner.message,
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
