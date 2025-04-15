import { DevTool } from "@hookform/devtools";
import { useForm, SubmitHandler, Controller } from "react-hook-form";
import { Autocomplete, Box, MenuItem, Stack, TextField } from "@mui/material";
import { Condition, Encounter, Patient, Practitioner, Coding } from "fhir/r4";
import AutoCompleteComponent from "../auto-complete-components/AutoCompleteComponent";
import PersonUtil from "../../Services/Utils/PersonUtils";
import EncounterUtils from "../../Services/Utils/EncounterUtils";
import { loadUserRoleFromLocalStorage } from "../../Utils/RolUser";
//import AutoCompleteFromLHCComponentComponent from "../AutoCompleteComponents/AutoCompleteFromLHCComponent";
import { CIE10 } from "../../Models/CIE10";

import { clinicalStatus } from "../../Models/Terminology";
import { ConditionFormData } from "../../Models/Forms/ConditionForm";
import UploadFileComponent from "../FileManager/UploadFileComponent";
import { useState, useEffect } from "react";
//import AutoCompleteFromSnomedComponent from "../AutoCompleteComponents/AutoCompleteFromSnomed";

function getEncounterDisplay(resource: Encounter): string {
  return `Profesional: ${EncounterUtils.getPrimaryPractitioner(
    resource
  )} -- ${EncounterUtils.getFormatPeriod(resource.period!)}`;
}

// Interfaz para los datos del formulario

export default function ConditionFormComponent({
  formId,
  submitForm,
  practitionerId,
  patientId,
  encounterId,
  condition,
  readOnly = false,
}: {
  formId: string;
  submitForm: SubmitHandler<ConditionFormData>;
  practitionerId: string;
  patientId?: string;
  encounterId?: string;
  condition?: Condition;
  readOnly?: boolean;
}) {
  const {
    control,
    register,
    trigger,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<ConditionFormData>();

  const [selectedPatient, setSelectedPatient] = useState<string | undefined>(
    patientId
  );
  const [selectedPractitioner, setSelectedPractitioner] = useState<
    string | undefined
  >(practitionerId);

  const roleUser = loadUserRoleFromLocalStorage();

  const [filteredOptions, setFilteredOptions] = useState<Coding[]>([]);

  const handleSearch = (inputValue: string) => {
    if (!inputValue) {
      // If the input is empty, show a small subset of options
      setFilteredOptions(CIE10.slice(0, 10)); // Display the first 10 options
    } else {
      // Filter the CIE10 list based on the input
      const filtered = CIE10.filter(
        (item) =>
          item.display.toLowerCase().includes(inputValue.toLowerCase()) ||
          item.code.toLowerCase().includes(inputValue.toLowerCase())
      );
      setFilteredOptions(filtered.slice(0, 50)); // Limit to 50 results for performance
    }
  };

  // Initialize with a small subset of options
  useEffect(() => {
    setFilteredOptions(CIE10.slice(0, 10)); // Display the first 10 options initially
  }, []);

  console.log("EncounterId", encounterId);
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
                    setSelectedPractitioner(undefined);
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
          {/*<AutoCompleteFromSnomedComponent
            label={"Snomed"}
            onChange={function (value: Coding | null): void {
              alert(JSON.stringify(value, null, 2));
            }}
          ></AutoCompleteFromSnomedComponent>
          */}
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
                defaultResourceId={patientId}
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
                    setSelectedPatient(selectedObject.id);
                  } else {
                    field.onChange(null);
                    setSelectedPatient(undefined);
                  }
                }}
                readOnly={readOnly || Boolean(patientId)}
                textFieldProps={{
                  error: Boolean(errors.performer),
                  helperText: errors.performer && errors.performer.message,
                }}
              />
            )}
          />
          {/*
          <Controller
            name="code"
            control={control}
            defaultValue={condition ? condition.code?.coding?.[0] : {}}
            render={({ field: { onChange } }) => (
              <AutoCompleteFromLHCComponentComponent
                label="loinc"
                table="hpo"
                onChange={onChange}
                defaultResource={condition?.code?.coding?.[0]}
                readOnly={!!condition?.code?.coding || false || readOnly}
                textFieldProps={{
                  ...register("code", {
                    required: "Código requerido",
                  }),
                  error: Boolean(errors.code),
                  helperText: errors.code && errors.code.message,
                  onBlur: () => trigger("code"),
                }}
              />
            )}
          />
          */}

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
                defaultResourceId={encounterId}
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

          <Controller
            name="conditionCodes"
            control={control}
            defaultValue={condition?.code?.coding || []}
            render={({ field }) => (
              <Autocomplete
                id="Autocomplete-CIE10"
                multiple
                options={filteredOptions}
                defaultValue={condition?.code?.coding || []}
                getOptionLabel={(option) => {
                  if (typeof option === "string") {
                    return option;
                  }
                  return option.display || option.code || "UNKNOWN";
                }}
                isOptionEqualToValue={(option, value) => {
                  // Handle case where option or value is a string (new custom item)
                  if (typeof option === "string" || typeof value === "string") {
                    return option === value;
                  }
                  // Handle case where option and value are objects
                  return option.code === value.code;
                }}
                freeSolo
                readOnly={readOnly}
                onInputChange={(_, value) => handleSearch(value)} // Trigger search on input change
                onChange={(_, newValues) => {
                  const formattedValues = newValues.map((newValue) => {
                    if (typeof newValue === "string") {
                      return {
                        code: `OTHER-${Date.now()}`, // Generate a unique code for new values
                        system: "CTTN",
                        display: newValue,
                      };
                    }
                    return newValue;
                  });
                  field.onChange(formattedValues); // Update the field with an array of values
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
                    label="Condiciones Reportadas (CIE10)"
                    variant="outlined"
                  />
                )}
              />
            )}
          />

          <TextField
            multiline
            fullWidth
            defaultValue={condition?.note?.[0].text || ""}
            rows={3}
            label="Notas"
            {...register("note")}
            error={Boolean(errors.note)}
            helperText={errors.note && errors.note.message}
            onBlur={() => trigger("note")}
            inputProps={{ readOnly: readOnly }}
          ></TextField>
          <TextField
            select
            label="Estado"
            defaultValue="active"
            {...register("clinicalStatus", {
              required: "Estado clínico requerido",
            })}
            fullWidth
            error={Boolean(errors.clinicalStatus)}
            helperText={errors.clinicalStatus && errors.clinicalStatus.message}
            inputProps={{ readOnly: readOnly }}
          >
            {clinicalStatus.map((item) => (
              <MenuItem key={item.code} value={item.code}>
                {item.display}
              </MenuItem>
            ))}
          </TextField>

          <Box>
            <UploadFileComponent
              subject={{ reference: `Patient/${selectedPatient}` }}
              author={{ reference: `Practitioner/${selectedPractitioner}` }}
            />
          </Box>
        </Stack>
      </form>
      <DevTool control={control} />
    </>
  );
}
