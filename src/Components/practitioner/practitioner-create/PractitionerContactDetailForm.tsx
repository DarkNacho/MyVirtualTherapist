import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { FormHelperText, Grid, TextField, Typography } from "@mui/material";
import { PractitionerFormData } from "../../../Models/Forms/PractitionerForm";
import "react-phone-input-2/lib/material.css";
import PhoneInput from "react-phone-input-2";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";

export default function PractitionerContactDetailForm({
  formId,
  practitioner,
  submitForm,
}: {
  formId: string;
  practitioner?: PractitionerFormData;
  submitForm: SubmitHandler<PractitionerFormData>;
}) {
  const { t } = useTranslation();
  const {
    control,
    register,
    handleSubmit,
    setError,
    clearErrors,
    formState: { errors },
  } = useForm<PractitionerFormData>({
    defaultValues: {
      email: practitioner?.email || "",
      numeroTelefonico: practitioner?.numeroTelefonico || "",
    },
    mode: "onBlur",
  });

  useEffect(() => {
    if (errors.numeroTelefonico) {
      setError("numeroTelefonico", {
        type: "required",
        message: t("practitionerContactDetailForm.phoneNumberRequired"),
      });
    } else {
      clearErrors("numeroTelefonico");
    }
  }, [errors.numeroTelefonico, setError, clearErrors, t]);

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
            {t("practitionerContactDetailForm.addPractitioner")}
          </Typography>
        </Grid>
        <Grid item xs={12} sm={6}>
          <Controller
            name="numeroTelefonico"
            control={control}
            rules={{
              required: t("practitionerContactDetailForm.phoneNumberRequired"),
              validate: (value) =>
                value
                  ? true
                  : t("practitionerContactDetailForm.phoneNumberRequired"),
            }}
            render={({ field }) => (
              <PhoneInput
                country={"cl"} // Default to Chile
                value={field.value}
                onChange={(phone) => {
                  field.onChange(phone);
                  console.log("phone:", phone);
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
                specialLabel={t("practitionerContactDetailForm.phoneNumber")}
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
            label={t("practitionerContactDetailForm.email")}
            {...register("email", {
              required: t("practitionerContactDetailForm.emailRequired"),
              pattern: {
                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                message: t("practitionerContactDetailForm.invalidEmail"),
              },
            })}
            error={Boolean(errors.email)}
            helperText={errors.email && errors.email.message}
            fullWidth
          />
        </Grid>
      </Grid>
    </form>
  );
}
