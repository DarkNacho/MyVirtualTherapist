/* eslint-disable @typescript-eslint/no-explicit-any */
import { SubmitHandler } from "react-hook-form";
import {
  Button,
  Container,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import { useEffect } from "react";
import { Close } from "@mui/icons-material";
import styles from "./modal.module.css";
import HandleResult from "../../Utils/HandleResult";
import ConfirmPasswordForm from "./ConfirmPasswordFormComponent";
import { ConfirmPassword } from "../../Models/Forms/ConfirmPasswordForm";

export default function PersonConfirmPasswordComponent({
  onOpen,
  isOpen,
  token,
}: {
  onOpen: (isOpen: boolean) => void;
  isOpen: boolean;
  token: string;
}) {
  useEffect(() => {
    onOpen(isOpen);
  }, [isOpen]);

  const handleClose = () => {
    onOpen(false);
  };

  const sendPatient = async (user: ConfirmPassword): Promise<Result<any>> => {
    return fetch(`${import.meta.env.VITE_SERVER_URL}/auth/reset-password`, {
      method: "POST",
      headers: {
        accept: "application/json",
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body:
        "&token=" +
        encodeURIComponent(token) +
        "&new_password=" +
        encodeURIComponent(user.newPassword),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        return { success: true, data: data } as Result<any>;
      })
      .catch(async (error) => {
        return { success: false, error: error } as Result<any>; //TODO: mejorar mensaje de error probablemente desde el server
      });
  };

  const postPatient = async (newPatient: ConfirmPassword) => {
    const response = await HandleResult.handleOperation(
      () => sendPatient(newPatient),
      "Contraseña actualizada",
      "Enviando..."
    );

    if (response.success) handleClose();
  };

  // Función que se ejecuta al enviar el formulario
  const onSubmitForm: SubmitHandler<ConfirmPassword> = (data) => {
    postPatient(data);
  };

  return (
    <div>
      <Dialog open={isOpen} onClose={handleClose} fullWidth maxWidth="md">
        <DialogTitle className={styles.dialogTitle}>
          Confirmar Contraseña
          <IconButton
            aria-label="close"
            onClick={handleClose}
            sx={{
              color: "white",
              backgroundColor: "#7e94ff",
              "&:hover": { backgroundColor: "red" },
            }}
          >
            <Close />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          <Container className={styles.container}>
            <ConfirmPasswordForm
              changePassword={true}
              formId="confirmPassword"
              submitForm={onSubmitForm}
            ></ConfirmPasswordForm>
          </Container>
        </DialogContent>
        <DialogActions className={styles.dialogActions}>
          <Button onClick={handleClose} variant="contained" color="error">
            Cancelar
          </Button>

          <Button
            type="submit"
            form="confirmPassword"
            variant="contained"
            color="primary"
          >
            Enviar
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
