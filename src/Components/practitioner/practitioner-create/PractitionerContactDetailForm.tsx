import { Controller, SubmitHandler, useForm } from "react-hook-form";
import {
  Autocomplete,
  FormHelperText,
  Grid,
  TextField,
  Typography,
} from "@mui/material";
import { PractitionerFormData } from "../../../Models/Forms/PractitionerForm";
import "react-phone-input-2/lib/material.css";
import PhoneInput from "react-phone-input-2";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import {
  practitionerRoles,
  practitionerSpecialties,
} from "../../../Models/Terminology";

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

        <Grid item xs={12} sm={12}>
          <Controller
            name="role"
            control={control}
            render={({ field }) => (
              <Autocomplete
                id="Autocomplete-role"
                multiple
                options={practitionerRoles}
                getOptionLabel={(option) =>
                  option.display || option.code || "UNKNOWN"
                }
                isOptionEqualToValue={(option, value) =>
                  option.code === value.code
                }
                value={field.value}
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
                    label="Roles"
                    variant="outlined"
                  />
                )}
              />
            )}
          />
        </Grid>
        <Grid item xs={12} sm={12}>
          <Controller
            name="specialty"
            control={control}
            render={({ field }) => (
              <Autocomplete
                id="Autocomplete-specialty"
                multiple
                options={practitionerSpecialties}
                getOptionLabel={(option) =>
                  option.display || option.code || "UNKNOWN"
                }
                isOptionEqualToValue={(option, value) =>
                  option.code === value.code
                }
                onChange={(_, newValue) => field.onChange(newValue)}
                value={field.value}
                renderOption={(props, option) => (
                  <li {...props} key={option.code}>
                    {option.display}
                  </li>
                )}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    fullWidth
                    label="Especialidad"
                    variant="outlined"
                  />
                )}
              />
            )}
          />
        </Grid>
      </Grid>
    </form>
  );
}
