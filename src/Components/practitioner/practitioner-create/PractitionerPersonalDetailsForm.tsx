import { Controller, SubmitHandler, useForm } from "react-hook-form";
import {
  Grid,
  TextField,
  Typography,
  Tooltip,
  IconButton,
} from "@mui/material";

import dayjs from "dayjs";
import { LocalizationProvider, DatePicker } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { PractitionerFormData } from "../../../Models/Forms/PractitionerForm";
import "react-phone-input-2/lib/material.css";
import PersonUtils from "../../../Services/Utils/PersonUtils";
import { useTranslation } from "react-i18next";
import HelpOutlineIcon from "@mui/icons-material/HelpOutline";

export default function PractitionerPersonalDetailsForm({
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
    setError,
    clearErrors,
    formState: { errors },
  } = useForm<PractitionerFormData>({
    defaultValues: {
      nombre: practitioner?.nombre || "",
      segundoNombre: practitioner?.segundoNombre || "",
      apellidoPaterno: practitioner?.apellidoPaterno || "",
      apellidoMaterno: practitioner?.apellidoMaterno || "",
      rut: practitioner?.rut || "",
      fechaNacimiento:
        practitioner?.fechaNacimiento || dayjs().subtract(18, "year"),
      agendaUrl: practitioner?.agendaUrl || "",
    },
    mode: "onBlur",
  });

  return (
    <form id={formId} onSubmit={handleSubmit(submitForm)}>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          {/* <Typography
            variant="h5"
            sx={{
              color: "#354495",
              textDecoration: "underline",
              textDecorationThickness: "0.1em",
              textUnderlineOffset: "0.2em",
            }}
          >
            {isEditing 
              ? t("practitionerPersonalDetailsForm.editPractitioner") 
              : t("practitionerPersonalDetailsForm.addPractitioner")}
          </Typography> */}
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
            label={t("practitionerPersonalDetailsForm.rut")}
            {...register("rut", {
              required: t("practitionerPersonalDetailsForm.rutRequired"),
            })}
            fullWidth
            disabled={isEditing}
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
        <Grid item xs={12} sm={12}>
          <TextField
            label="Agenda URL"
            {...register("agendaUrl")}
            fullWidth
            InputProps={{
              endAdornment: (
                <Tooltip title="Ingrese la URL de su agenda personal">
                  <IconButton>
                    <HelpOutlineIcon />
                  </IconButton>
                </Tooltip>
              ),
            }}
          />
        </Grid>
      </Grid>
    </form>
  );
}
