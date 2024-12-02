import { Controller, SubmitHandler, useForm } from "react-hook-form";
import {
  FormHelperText,
  Grid,
  MenuItem,
  TextField,
  Typography,
} from "@mui/material";
import { contactTypes } from "../../../Models/Terminology";

import { PatientFormData } from "../../../Models/Forms/PatientForm";
import "react-phone-input-2/lib/material.css";
import PhoneInput from "react-phone-input-2";
import { useEffect } from "react";

export default function PatientContactDetailForm({
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
      email: patient?.email || "",
      numeroTelefonico: patient?.numeroTelefonico || "",
      contact: patient?.contact || [
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

  useEffect(() => {
    if (errors.numeroTelefonico) {
      setError("numeroTelefonico", {
        type: "required",
        message: "Número telefónico requerido",
      });
    } else {
      clearErrors("numeroTelefonico");
    }
  }, [errors.numeroTelefonico, setError, clearErrors]);

  useEffect(() => {
    if (errors.contact?.[0]?.numeroTelefonico) {
      setError("contact.0.numeroTelefonico", {
        type: "required",
        message: "Número telefónico requerido",
      });
    } else {
      clearErrors("contact.0.numeroTelefonico");
    }
  }, [errors.contact?.[0]?.numeroTelefonico, setError, clearErrors]);

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
          <Controller
            name="numeroTelefonico"
            control={control}
            rules={{
              required: "Número telefónico requerido",
              validate: (value) =>
                value ? true : "Número telefónico requerido",
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
                specialLabel="Número Telefónico"
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
            label="Email"
            {...register("email", {
              required: "Correo electrónico requerido",
              pattern: {
                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                message: "Correo electrónico inválido",
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
            CONTACTO DE EMERGENCIA
          </Typography>
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            label="Nombre"
            {...register("contact.0.nombre", {
              required: "El Nombre es necesario",
            })}
            fullWidth
            error={Boolean(errors.contact?.[0]?.nombre)}
            helperText={
              errors.contact?.[0]?.nombre && errors.contact?.[0]?.nombre.message
            }
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            type="email"
            label="Email"
            {...register("contact.0.email", {
              required: "Correo electrónico requerido",
              pattern: {
                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                message: "Correo electrónico inválido",
              },
            })}
            error={Boolean(errors.contact?.[0]?.email)}
            helperText={
              errors.contact?.[0]?.email && errors.contact?.[0]?.email.message
            }
            fullWidth
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <Controller
            name="contact.0.numeroTelefonico"
            control={control}
            rules={{
              required: "Número telefónico requerido",
              validate: (value) =>
                value ? true : "Número telefónico requerido",
            }}
            render={({ field }) => (
              <PhoneInput
                country={"cl"} // Default to Chile
                value={field.value}
                onChange={(phone, country) => {
                  field.onChange(phone);
                  console.log("dial_code:", country);
                  console.log("phone:", phone);
                  //setValue("countryCode", `+${country.dialCode}`);
                }}
                inputProps={{
                  required: true,
                  name: "contact.0.numeroTelefonico",
                }}
                inputStyle={{
                  width: "100%",
                  height: "56px",
                }}
                isValid={(value) => !!value}
                enableSearch
                specialLabel="Número Telefónico"
              />
            )}
          />
          {errors.contact?.[0]?.numeroTelefonico && (
            <FormHelperText error>
              {errors.contact?.[0]?.numeroTelefonico.message}
            </FormHelperText>
          )}
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            select
            label="Relación"
            defaultValue="N"
            {...register(`contact.0.contactType`)}
            fullWidth
            error={Boolean(errors.contact?.[0]?.contactType)}
            helperText={
              errors.contact?.[0]?.contactType &&
              errors.contact?.[0]?.contactType?.message
            }
          >
            {contactTypes.map((option) => (
              <MenuItem key={option.code} value={option.code}>
                {option.display}
              </MenuItem>
            ))}
          </TextField>
        </Grid>
      </Grid>
    </form>
  );
}
