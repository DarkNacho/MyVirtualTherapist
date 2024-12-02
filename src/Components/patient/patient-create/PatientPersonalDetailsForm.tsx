import { Controller, SubmitHandler, useForm } from "react-hook-form";
import {
  Autocomplete,
  Grid,
  MenuItem,
  TextField,
  Typography,
} from "@mui/material";
import { generoOptions, maritalOptions } from "../../../Models/Terminology";

import dayjs from "dayjs";
import { LocalizationProvider, DatePicker } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { PatientFormData } from "../../../Models/Forms/PatientForm";
import "react-phone-input-2/lib/material.css";
import PersonUtils from "../../../Services/Utils/PersonUtils";

export default function PatientPersonalDetailsForm({
  formId,
  patient,
  submitForm,
}: {
  formId: string;
  patient?: PatientFormData;
  submitForm: SubmitHandler<PatientFormData>;
}) {
  const {
    control,
    register,
    handleSubmit,
    setError,
    clearErrors,
    formState: { errors },
  } = useForm<PatientFormData>({
    defaultValues: {
      nombre: patient?.nombre || "",
      segundoNombre: patient?.segundoNombre || "",
      apellidoPaterno: patient?.apellidoPaterno || "",
      apellidoMaterno: patient?.apellidoMaterno || "",
      genero: patient?.genero || "unknown",
      rut: patient?.rut || "",
      fechaNacimiento: patient?.fechaNacimiento || dayjs().subtract(18, "year"),
      maritalStatus: patient?.maritalStatus || maritalOptions[0],
    },
    mode: "onBlur",
  });

  return (
    <form id={formId} onSubmit={handleSubmit(submitForm)}>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <Typography
            variant="h5"
            sx={{
              color: "blue",
              textDecoration: "underline",
              textDecorationThickness: "0.1em",
              textUnderlineOffset: "0.2em",
            }}
          >
            AGREGAR PACIENTE
          </Typography>
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            label="Nombre"
            {...register("nombre", {
              required: "El Nombre es necesario",
            })}
            fullWidth
            error={Boolean(errors.nombre)}
            helperText={errors.nombre && errors.nombre.message}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            label="Segundo Nombre"
            {...register("segundoNombre")}
            fullWidth
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            label="Apellido Paterno"
            {...register("apellidoPaterno", {
              required: "El Apellido Paterno es necesario",
            })}
            fullWidth
            error={Boolean(errors.apellidoPaterno)}
            helperText={
              errors.apellidoPaterno && errors.apellidoPaterno.message
            }
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            label="Apellido Materno"
            {...register("apellidoMaterno")}
            fullWidth
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <Controller
            control={control}
            name="fechaNacimiento"
            render={({ field: { onChange, value, ref } }) => (
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DatePicker
                  format="DD-MM-YYYY"
                  views={["year", "month", "day"]}
                  maxDate={dayjs()}
                  label="Fecha de Nacimiento"
                  onChange={onChange}
                  value={value}
                  inputRef={ref}
                  sx={{ width: "100%" }}
                ></DatePicker>
              </LocalizationProvider>
            )}
          ></Controller>
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            select
            label="Género"
            defaultValue="unknown"
            {...register("genero", {
              required: "El Género es necesario",
            })}
            fullWidth
            error={Boolean(errors.genero)}
            helperText={errors.genero && errors.genero.message}
          >
            {generoOptions.map((option) => (
              <MenuItem key={option.code} value={option.code}>
                {option.display}
              </MenuItem>
            ))}
          </TextField>
        </Grid>
        <Grid item xs={12} sm={6}>
          <Controller
            name="maritalStatus"
            control={control}
            render={({ field }) => (
              <Autocomplete
                id="Autocomplete-marital"
                options={maritalOptions}
                defaultValue={maritalOptions[0]}
                getOptionLabel={(option) =>
                  option.display || option.code || "unk"
                }
                isOptionEqualToValue={(option, value) =>
                  option.code === value.code
                }
                onChange={(_, newValue) => field.onChange(newValue)}
                renderOption={(props, option) => (
                  <li {...props} key={option.code}>
                    {option.display}
                  </li>
                )}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    fullWidth
                    label="Estado Civil"
                    variant="outlined"
                  />
                )}
              />
            )}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            label="Rut"
            {...register("rut", {
              required: "El Rut es necesario", //TODO: Ver como validarlo aquí ya que falla.
            })}
            fullWidth
            error={Boolean(errors.rut)}
            helperText={errors.rut && errors.rut.message}
            onBlur={async (event) => {
              const isValid = PersonUtils.RutValidation(event.target.value);
              if (!isValid) {
                setError("rut", {
                  type: "manual",
                  message: "Rut inválido",
                });
              } else {
                clearErrors("rut");
              }
            }}
          />
        </Grid>
      </Grid>
    </form>
  );
}
