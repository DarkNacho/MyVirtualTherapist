import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { Grid, MenuItem, TextField, Typography } from "@mui/material";
import { generoOptions } from "../../../Models/Terminology";

import dayjs from "dayjs";
import { LocalizationProvider, DatePicker } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { PractitionerFormData } from "../../../Models/Forms/PractitionerForm";
import "react-phone-input-2/lib/material.css";
import PersonUtils from "../../../Services/Utils/PersonUtils";
import { useTranslation } from "react-i18next";
import { useEffect, useState } from "react";

export default function PractitionerPersonalDetailsForm({
  formId,
  practitioner,
  submitForm,
}: {
  formId: string;
  practitioner?: PractitionerFormData;
  submitForm: SubmitHandler<PractitionerFormData>;
}) {
  const { t, i18n } = useTranslation();
  const currentLanguage = i18n.language;
  const [localizedGeneroOptions, setLocalizedGeneroOptions] =
    useState(generoOptions);

  useEffect(() => {
    const updatedGeneroOptions = generoOptions.map((option) => ({
      ...option,
      display:
        t(`terminology.generoOptions.${option.code}`, {
          lng: currentLanguage,
        }) || option.display,
    }));
    setLocalizedGeneroOptions(updatedGeneroOptions);
  }, [t, currentLanguage]);

  const {
    control,
    register,
    handleSubmit,
    setError,
    clearErrors,
    formState: { errors },
  } = useForm<PractitionerFormData>({
    defaultValues: {
      nombre: practitioner?.nombre || "",
      segundoNombre: practitioner?.segundoNombre || "",
      apellidoPaterno: practitioner?.apellidoPaterno || "",
      apellidoMaterno: practitioner?.apellidoMaterno || "",
      genero: practitioner?.genero || "unknown",
      rut: practitioner?.rut || "",
      fechaNacimiento:
        practitioner?.fechaNacimiento || dayjs().subtract(18, "year"),
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
              color: "#354495",
              textDecoration: "underline",
              textDecorationThickness: "0.1em",
              textUnderlineOffset: "0.2em",
            }}
          >
            {t("practitionerPersonalDetailsForm.addPractitioner")}
          </Typography>
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            label={t("practitionerPersonalDetailsForm.name")}
            {...register("nombre", {
              required: t("practitionerPersonalDetailsForm.nameRequired"),
            })}
            fullWidth
            error={Boolean(errors.nombre)}
            helperText={errors.nombre && errors.nombre.message}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            label={t("practitionerPersonalDetailsForm.secondName")}
            {...register("segundoNombre")}
            fullWidth
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            label={t("practitionerPersonalDetailsForm.lastName")}
            {...register("apellidoPaterno", {
              required: t("practitionerPersonalDetailsForm.lastNameRequired"),
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
            label={t("practitionerPersonalDetailsForm.motherLastName")}
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
                  label={t("practitionerPersonalDetailsForm.birthDate")}
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
            label={t("practitionerPersonalDetailsForm.gender")}
            defaultValue="unknown"
            {...register("genero", {
              required: t("practitionerPersonalDetailsForm.genderRequired"),
            })}
            fullWidth
            error={Boolean(errors.genero)}
            helperText={errors.genero && errors.genero.message}
          >
            {localizedGeneroOptions.map((option) => (
              <MenuItem key={option.code} value={option.code}>
                {option.display}
              </MenuItem>
            ))}
          </TextField>
        </Grid>

        <Grid item xs={12} sm={6}>
          <TextField
            label={t("practitionerPersonalDetailsForm.rut")}
            {...register("rut", {
              required: t("practitionerPersonalDetailsForm.rutRequired"), //TODO: Ver como validarlo aquí ya que falla.
            })}
            fullWidth
            error={Boolean(errors.rut)}
            helperText={errors.rut && errors.rut.message}
            onBlur={async (event) => {
              const isValid = PersonUtils.RutValidation(event.target.value);
              if (!isValid) {
                setError("rut", {
                  type: "manual",
                  message: t("practitionerPersonalDetailsForm.invalidRut"),
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
