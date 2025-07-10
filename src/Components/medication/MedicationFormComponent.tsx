import { DevTool } from "@hookform/devtools";
import { useForm, SubmitHandler, Controller } from "react-hook-form";
import { Autocomplete, Stack, TextField } from "@mui/material";
import dayjs from "dayjs";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { Patient, Practitioner, Encounter, Coding } from "fhir/r4";

import AutoCompleteComponent from "../auto-complete-components/AutoCompleteComponent";
import PersonUtil from "../../Services/Utils/PersonUtils";
import EncounterUtils from "../../Services/Utils/EncounterUtils";
import { loadUserRoleFromLocalStorage } from "../../Utils/RolUser";
import { MedicationFormData } from "../../Models/Forms/MedicationForm";
import { MedicamentList } from "../../Models/MedicamentList";
import { useEffect, useState } from "react";

function getEncounterDisplay(resource: Encounter): string {
  return `Profesional: ${EncounterUtils.getPrimaryPractitioner(
    resource
  )} -- ${EncounterUtils.getFormatPeriod(resource.period!)}`;
}

// Interfaz para los datos del formulario

export default function MedicationFormComponent({
  formId,
  patientId,
  submitForm,
  medication,
  practitionerId,
  encounterId,
  readOnly = false,
}: {
  formId: string;
  patientId?: string;
  submitForm: SubmitHandler<MedicationFormData>;
  medication?: MedicationFormData;
  practitionerId?: string;
  encounterId?: string;
  readOnly?: boolean;
}) {
  const {
    control,
    register,
    trigger,
    handleSubmit,
    formState: { errors },
  } = useForm<MedicationFormData>({
    defaultValues: {
      performer: medication?.performer || { id: practitionerId, display: "" },
      subject: medication?.subject || { id: patientId, display: "" },
      encounter: medication?.encounter || { id: encounterId, display: "" },
      medication: medication?.medication || {},
      note: medication?.note || "",
      startDate: medication?.startDate || dayjs(),
      endDate: medication?.endDate || dayjs(),
    },
  });

  const roleUser = loadUserRoleFromLocalStorage();

  const [filteredOptions, setFilteredOptions] = useState<Coding[]>([]);

  const handleSearch = (inputValue: string) => {
    if (!inputValue) {
      // If the input is empty, show a small subset of options
      setFilteredOptions(MedicamentList.slice(0, 10)); // Display the first 10 options
    } else {
      // Filter the CIE10 list based on the input
      const filtered = MedicamentList.filter(
        (item) =>
          item.display?.toLowerCase().includes(inputValue.toLowerCase()) ||
          item.code?.toLowerCase().includes(inputValue.toLowerCase()) ||
          "UNKNOWN"
      );
      setFilteredOptions(filtered.slice(0, 50)); // Limit to 50 results for performance
    }
  };

  // Initialize with a small subset of options
  useEffect(() => {
    setFilteredOptions(MedicamentList.slice(0, 10)); // Display the first 10 options initially
  }, []);

  return (
    <>
      <form id={formId} onSubmit={handleSubmit(submitForm)}>
        <Stack spacing={2}>
          <Controller
            name="performer"
            control={control}
            rules={{
              required: "Es necesario seleccionar un Profesional",
            }}
            render={({ field }) => (
              <AutoCompleteComponent<Practitioner>
                resourceType={"Practitioner"}
                label={"Profesional que indica medicamento"}
                getDisplay={PersonUtil.getPersonNameAsString}
                searchParam={"name"}
                defaultResourceId={medication?.performer?.id || practitionerId}
                onChange={(selectedObject) => {
                  if (selectedObject) {
                    field.onChange({
                      id: selectedObject.id,
                      display: PersonUtil.getPersonNameAsString(selectedObject),
                    });
                  } else {
                    field.onChange(null);
                  }
                }}
                readOnly={readOnly || !(roleUser === "Admin")}
                textFieldProps={{
                  error: Boolean(errors.performer),
                  helperText: errors.performer && errors.performer.message,
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
                defaultResourceId={medication?.subject?.id || patientId}
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
            name="medication"
            control={control}
            defaultValue={medication?.medication || {}}
            render={({ field }) => (
              <Autocomplete
                id="Autocomplete-MedicationList"
                options={filteredOptions}
                defaultValue={medication?.medication || {}}
                getOptionLabel={(option) => {
                  if (typeof option === "string") {
                    return option;
                  }
                  return option.display || option.code || "UNKNOWN";
                }}
                isOptionEqualToValue={(option, value) =>
                  option.code === value.code
                }
                onInputChange={(_, value) => handleSearch(value)} // Trigger search on input change
                freeSolo
                readOnly={readOnly}
                onChange={(_, newValue) => {
                  if (typeof newValue === "string") {
                    field.onChange({
                      code: `OTHER-${Date.now()}`,
                      system: "CTTN",
                      display: newValue,
                    });
                  } else {
                    field.onChange(newValue);
                  }
                }}
                renderOption={(props, option) => (
                  <li {...props} key={option.code}>
                    {option.display}
                  </li>
                )}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    fullWidth
                    label="Medicamentos"
                    variant="outlined"
                  />
                )}
              />
            )}
          />
          <Controller
            control={control}
            name="startDate"
            defaultValue={dayjs()}
            render={({ field: { onChange, value, ref } }) => (
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DatePicker
                  format="DD-MM-YYYY"
                  views={["year", "month", "day"]}
                  label="Fecha de inicio"
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
            control={control}
            name="endDate"
            defaultValue={dayjs().add(1, "week")}
            render={({ field: { onChange, value, ref } }) => (
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DatePicker
                  format="DD-MM-YYYY"
                  views={["year", "month", "day"]}
                  label="Fecha de término"
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
            name="encounter"
            control={control}
            rules={{
              required: "Es necesario seleccionar un Paciente",
            }}
            render={({ field }) => (
              <AutoCompleteComponent<Encounter>
                resourceType={"Encounter"}
                label={"Selecciona Encuentro"}
                getDisplay={getEncounterDisplay}
                defaultResourceId={medication?.encounter?.id || encounterId}
                defaultParams={{ subject: patientId!, _count: 99999 }}
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
          <TextField
            multiline
            fullWidth
            defaultValue={medication?.note || ""}
            rows={3}
            label="Notas"
            {...register("note")}
            error={Boolean(errors.note)}
            helperText={errors.note && errors.note.message}
            onBlur={() => trigger("note")}
            inputProps={{ readOnly: readOnly }}
          ></TextField>
        </Stack>
      </form>
      <DevTool control={control} />
    </>
  );
}
