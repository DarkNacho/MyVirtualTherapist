/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  Button,
  Container,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
} from "@mui/material";
import { useEffect } from "react";
import { Close } from "@mui/icons-material";
import styles from "./modal.module.css";
import HandleResult from "../../Utils/HandleResult";

export default function ForgotPasswordComponent({
  onOpen,
  isOpen,
}: {
  onOpen: (isOpen: boolean) => void;
  isOpen: boolean;
}) {
  useEffect(() => {
    onOpen(isOpen);
  }, [isOpen]);

  const handleClose = () => {
    onOpen(false);
  };

  const generateReset = async (rut: string): Promise<Result<any>> => {
    const response = await fetch(
      `${
        import.meta.env.VITE_SERVER_URL
      }/auth/generate-reset-password-token?rut=${rut}`,
      {
        method: "POST",
        headers: {
          accept: "application/json",
        },
      }
    );
    if (response.status === 200)
      return { success: true, data: await response.json() };

    const responseText = await response.json();
    console.error(responseText);
    return { success: false, error: responseText.detail };
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);

    const rut = data.get("rut") as string;
    if (!rut) return;

    console.log(rut);
    const response = await HandleResult.handleOperation(
      () => generateReset(rut),
      "Solicitud Enviada",
      "Enviado solicitud de cambio de contraseña"
    );

    console.log(response);
    if (!response.success) return;
    handleClose();
  };

  return (
    <div>
      <Dialog open={isOpen} onClose={handleClose} fullWidth maxWidth="md">
        <form onSubmit={handleSubmit}>
          <DialogTitle className={styles.dialogTitle}>
            Restaurar Contraseña
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
              <TextField
                margin="normal"
                required
                fullWidth
                id="rut"
                label="Rut"
                name="rut"
                autoComplete="rut"
                autoFocus
              />
            </Container>
          </DialogContent>
          <DialogActions className={styles.dialogActions}>
            <Button onClick={handleClose} variant="contained" color="error">
              Cancelar
            </Button>

            <Button type="submit" variant="contained" color="primary">
              Enviar
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </div>
  );
}
