import { SubmitHandler, useForm } from "react-hook-form";
import { Grid, TextField } from "@mui/material";
import { DevTool } from "@hookform/devtools";
import { ConfirmPassword } from "../../Models/Forms/ConfirmPasswordForm";

export default function ConfirmPasswordFormComponent({
  formId,
  submitForm,
}: {
  formId: string;
  submitForm: SubmitHandler<ConfirmPassword>;
  changePassword?: boolean;
}) {
  const {
    control,
    register,
    getValues,
    handleSubmit,
    formState: { errors },
  } = useForm<ConfirmPassword>({ mode: "onBlur" });

  return (
    <>
      <form id={formId} onSubmit={handleSubmit(submitForm)}>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={12}>
            <TextField
              label="Nueva Contraseña"
              type="password"
              {...register("newPassword", {
                required: "Contraseña requerida",
              })}
              error={Boolean(errors.newPassword)}
              helperText={errors.newPassword && errors.newPassword.message}
              fullWidth
            />
          </Grid>
          <Grid item xs={12} sm={12}>
            <TextField
              label="Confirmar contraseña"
              type="password"
              {...register("confirmPassword", {
                required: "Contraseña requerida",
                validate: (value) =>
                  value === getValues("newPassword") ||
                  "Las contraseñas no coinciden",
              })}
              error={Boolean(errors.confirmPassword)}
              helperText={
                errors.confirmPassword && errors.confirmPassword.message
              }
              fullWidth
            />
          </Grid>
        </Grid>
      </form>
      <DevTool control={control} />
    </>
  );
}
