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

import { useTranslation } from "react-i18next";
import {
  practitionerRoles,
  practitionerSpecialties,
} from "../../../Models/Terminology";
import { DevTool } from "@hookform/devtools";

export default function PractitionerContactDetailForm({
  formId,
  practitioner,
  submitForm,
  isEditing = false,
}: {
  formId: string;
  practitioner?: PractitionerFormData;
  submitForm: SubmitHandler<PractitionerFormData>;
  isEditing?: boolean;
}) {
  const { t } = useTranslation();
  const {
    control,
    register,
    handleSubmit,

    formState: { errors },
  } = useForm<PractitionerFormData>({
    defaultValues: {
      email: practitioner?.email || "",
      numeroTelefonico: practitioner?.numeroTelefonico || "",
      role: practitioner?.role || [],
      specialty: practitioner?.specialty || [],
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
            {t("practitionerContactDetailForm.addPractitioner")}
          </Typography>
        </Grid>
        <Grid item xs={12} sm={6}>
          <Controller
            name="numeroTelefonico"
            control={control}
            rules={{
              required: "El número de teléfono es requerid",
              validate: (value) => {
                if (!value) {
                  return "El número de teléfono es requerido";
                }
                const countryCode = value.slice(0, 2); // Assuming the country code is the first two characters
                if (
                  (countryCode === "56" && value.length < 11) ||
                  value.length > 12
                ) {
                  return "El número de teléfono debe tener 9 dígitos";
                }
                return true;
              },
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
                    label={t("practitionerContactDetailForm.role")}
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
                getOptionLabel={(option) => {
                  if (typeof option === "string") {
                    return option;
                  }
                  return option.display || option.code || "UNKNOWN";
                }}
                isOptionEqualToValue={(option, value) =>
                  option.code === value.code
                }
                freeSolo
                //onChange={(_, newValue) => field.onChange(newValue)}
                onChange={(_, newValue) => {
                  const transformedValue = newValue.map((item) => {
                    if (typeof item === "string") {
                      return {
                        code: "OTHER",
                        system: "cttn.cl",
                        display: item,
                      };
                    }
                    return item;
                  });
                  field.onChange(transformedValue);
                }}
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
      <DevTool control={control} />
    </form>
  );
}
