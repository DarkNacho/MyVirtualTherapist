import {
  Controller,
  SubmitHandler,
  useForm,
  useFieldArray,
} from "react-hook-form";
import {
  Grid,
  TextField,
  Typography,
  MenuItem,
  FormHelperText,
  IconButton,
} from "@mui/material";
import { contactTypes } from "../../../Models/Terminology";
import { PatientFormData } from "../../../Models/Forms/PatientForm";
import PhoneInput from "react-phone-input-2";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import RemoveCircleOutlineIcon from "@mui/icons-material/RemoveCircleOutline";

export default function PatientEmergencyContactsForm({
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
      contact: patient?.contact?.slice(1) || [
        {
          nombre: "",
          email: "",
          numeroTelefonico: "",
          contactType: "N",
        },
      ],
    },
    mode: "onBlur",
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "contact",
  });

  useEffect(() => {
    fields.forEach((_, index) => {
      // Skip the first item (index 0)
      if (index === 0) return;

      if (errors.contact?.[index]?.numeroTelefonico) {
        setError(`contact.${index}.numeroTelefonico`, {
          type: "required",
          message: t("patientContactDetailForm.phoneNumberRequired"),
        });
      } else {
        clearErrors(`contact.${index}.numeroTelefonico`);
      }
    });
  }, [errors.contact, fields, setError, clearErrors, t]);

  const handleAddContact = () => {
    append({
      nombre: "",
      email: "",
      numeroTelefonico: "",
      contactType: "N",

      segundoNombre: "",
      apellidoPaterno: "",
      apellidoMaterno: "",
    });
  };

  const handleRemoveContact = (index: number) => {
    if (fields.length > 1) {
      remove(index);
    }
  };

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
            {t("patientContactDetailForm.emergencyContact")}
          </Typography>
        </Grid>

        {fields.map((field, index) => (
          <Grid container spacing={2} key={field.id}>
            <Grid item xs={12} sm={6}>
              <TextField
                label={t("patientContactDetailForm.name")}
                {...register(`contact.${index}.nombre`, {
                  required: t("patientContactDetailForm.nameRequired"),
                })}
                fullWidth
                error={Boolean(errors.contact?.[index]?.nombre)}
                helperText={
                  errors.contact?.[index]?.nombre &&
                  errors.contact?.[index]?.nombre.message
                }
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                type="email"
                label={t("patientContactDetailForm.email")}
                {...register(`contact.${index}.email`, {
                  required: t("patientContactDetailForm.emailRequired"),
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    message: t("patientContactDetailForm.invalidEmail"),
                  },
                })}
                error={Boolean(errors.contact?.[index]?.email)}
                helperText={
                  errors.contact?.[index]?.email &&
                  errors.contact?.[index]?.email.message
                }
                fullWidth
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <Controller
                name={`contact.${index}.numeroTelefonico`}
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
                      name: `contact.${index}.numeroTelefonico`,
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
              {errors.contact?.[index]?.numeroTelefonico && (
                <FormHelperText error>
                  {errors.contact?.[index]?.numeroTelefonico.message}
                </FormHelperText>
              )}
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                select
                label={t("patientContactDetailForm.relation")}
                defaultValue="N"
                {...register(`contact.${index}.contactType`)}
                fullWidth
                error={Boolean(errors.contact?.[index]?.contactType)}
                helperText={
                  errors.contact?.[index]?.contactType &&
                  errors.contact?.[index]?.contactType?.message
                }
              >
                {contactTypes.map((option) => (
                  <MenuItem key={option.code} value={option.code}>
                    {option.display}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
            <Grid item xs={12}>
              <IconButton
                color="error"
                onClick={() => handleRemoveContact(index)}
                disabled={fields.length === 1} // Prevent removing the last contact
              >
                <RemoveCircleOutlineIcon />
              </IconButton>
              {index === fields.length - 1 && ( // Render Add button only for the last contact
                <IconButton color="primary" onClick={handleAddContact}>
                  <AddCircleOutlineIcon />
                </IconButton>
              )}
            </Grid>
          </Grid>
        ))}
      </Grid>
    </form>
  );
}
