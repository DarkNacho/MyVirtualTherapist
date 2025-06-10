import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { FormHelperText, Grid, TextField, Typography } from "@mui/material";

import { PatientFormData } from "../../../Models/Forms/PatientForm";
import "react-phone-input-2/lib/material.css";
import PhoneInput from "react-phone-input-2";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { DevTool } from "@hookform/devtools";

export default function PatientContactDetailForm({
  formId,
  patient,
  submitForm,
}: {
  formId: string;
  patient?: PatientFormData;
  submitForm: SubmitHandler<PatientFormData>;
}) {
  const { t } = useTranslation();
  const {
    control,
    register,
    handleSubmit,
    setError,
    clearErrors,
    formState: { errors },
  } = useForm<PatientFormData>({
    defaultValues: {
      email: patient?.email || "",
      numeroTelefonico: patient?.numeroTelefonico || "",
      region: patient?.region || "",
      ciudad: patient?.ciudad || "",
      direccion: patient?.direccion || "",
    },
    mode: "onBlur",
  });

  useEffect(() => {
    if (errors.numeroTelefonico) {
      setError("numeroTelefonico", {
        type: "required",
        message: t("patientContactDetailForm.phoneNumberRequired"),
      });
    } else {
      clearErrors("numeroTelefonico");
    }
  }, [errors.numeroTelefonico, setError, clearErrors, t]);

  useEffect(() => {
    if (errors.contact?.[0]?.numeroTelefonico) {
      setError("contact.0.numeroTelefonico", {
        type: "required",
        message: t("patientContactDetailForm.phoneNumberRequired"),
      });
    } else {
      clearErrors("contact.0.numeroTelefonico");
    }
  }, [errors.contact?.[0]?.numeroTelefonico, setError, clearErrors, t]);

  return (
    <>
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
              {t("patientContactDetailForm.addPatient")}
            </Typography>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Controller
              name="numeroTelefonico"
              control={control}
              rules={{
                required: t("patientContactDetailForm.phoneNumberRequired"),
                validate: (value) =>
                  value
                    ? true
                    : t("patientContactDetailForm.phoneNumberRequired"),
              }}
              render={({ field }) => (
                <PhoneInput
                  country={"cl"} // Default to Chile
                  value={field.value}
                  onChange={(phone) => {
                    field.onChange(phone);
                  }}
                  inputProps={{
                    required: true,
                    name: "numeroTelefonico",
                  }}
                  inputStyle={{
                    width: "100%",
                    height: "56px",
                  }}
                  isValid={(value) => !!value}
                  enableSearch
                  specialLabel={t("patientContactDetailForm.phoneNumber")}
                />
              )}
            />
            {errors.numeroTelefonico && (
              <FormHelperText error>
                {errors.numeroTelefonico.message}
              </FormHelperText>
            )}
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              type="email"
              label={t("patientContactDetailForm.email")}
              {...register("email", {
                required: t("patientContactDetailForm.emailRequired"),
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  message: t("patientContactDetailForm.invalidEmail"),
                },
              })}
              error={Boolean(errors.email)}
              helperText={errors.email && errors.email.message}
              fullWidth
            />
          </Grid>
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
              {t("patientContactDetailForm.address")}
            </Typography>
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label={t("patientContactDetailForm.region")}
              {...register("region", {
                required: t("patientContactDetailForm.regionRequired"),
              })}
              fullWidth
              error={Boolean(errors.region)}
              helperText={errors.region && errors.region.message}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label={t("patientContactDetailForm.city")}
              {...register("ciudad", {
                required: t("patientContactDetailForm.cityRequired"),
              })}
              fullWidth
              error={Boolean(errors.ciudad)}
              helperText={errors.ciudad && errors.ciudad.message}
            />
          </Grid>

          <Grid item xs={12} sm={12}>
            <TextField
              label={t("patientContactDetailForm.streetAddress")}
              {...register("direccion", {
                required: t("patientContactDetailForm.streetAddressRequired"),
              })}
              fullWidth
              error={Boolean(errors.direccion)}
              helperText={errors.direccion && errors.direccion.message}
            />
          </Grid>
        </Grid>
      </form>
      <DevTool control={control} />
    </>
  );
}
