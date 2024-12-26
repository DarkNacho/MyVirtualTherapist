/* eslint-disable @typescript-eslint/no-explicit-any */
//import * as React from "react";
import { useState } from "react";

import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import Link from "@mui/material/Link";
import Paper from "@mui/material/Paper";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import HandleResult from "../Utils/HandleResult";
import { jwtDecode } from "jwt-decode";
import { useTranslation } from "react-i18next";
//import PersonForgotPasswordComponent from "../Components/Person/PersonForgotPasswordComponent";
import backgroundLogin from "../assets/fondo-login.jpg";
import logoBlue from "../assets/logo-azul.png";
import { IconButton, InputAdornment } from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
//import PractitionerCreateComponent from "../Components/Practitioner/PractitionerCreateComponent";
import { Practitioner } from "fhir/r4";
import PractitionerCreateForm from "./practitioner/practitioner-create/PractitionerCreateForm";
import { PractitionerFormData } from "../Models/Forms/PractitionerForm";
import PersonUtil from "../Services/Utils/PersonUtils";
import FhirResourceService from "../Services/FhirService";
import { CacheUtils } from "../Utils/Cache";
import ForgotPasswordComponent from "./password/ForgotPasswordComponent";

function Copyright(props: any) {
  const { t } = useTranslation();
  return (
    <Typography
      variant="body2"
      color="text.secondary"
      align="center"
      {...props}
    >
      {"Copyright © "}
      <Link color="inherit" href="https://www.cttn.cl">
        {t("signInSide.enter")}
      </Link>{" "}
      {new Date().getFullYear()}
      {"."}
    </Typography>
  );
}

const defaultTheme = createTheme({
  components: {
    MuiGrid: {
      styleOverrides: {
        root: {
          "@media (max-width:600px)": {
            backgroundImage: `linear-gradient(rgba(255, 255, 255, 0.5), rgba(255, 255, 255, 0.5)), url(${backgroundLogin})`,
            backgroundRepeat: "no-repeat",
            backgroundSize: "cover",
            backgroundPosition: "center",
          },
        },
      },
    },
  },
});

async function login(username: string, password: string): Promise<Result<any>> {
  const response = await fetch(
    `${import.meta.env.VITE_SERVER_URL}/auth/token`,
    {
      method: "POST",
      headers: {
        accept: "application/json",
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body:
        "grant_type=&username=" +
        encodeURIComponent(username) +
        "&password=" +
        encodeURIComponent(password) +
        "&scope=&client_id=&client_secret=",
    }
  );
  if (response.status === 200)
    return { success: true, data: await response.json() };

  const responseText = await response.json();
  console.error(responseText);
  return { success: false, error: responseText.detail };
}

let practitionerFormData: PractitionerFormData;

export default function SignInSide() {
  const { t } = useTranslation();

  const [showPassword, setShowPassword] = useState(false);

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handleMouseDownPassword = (
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    event.preventDefault();
  };

  const [loading, setLoading] = useState(false);
  const [openDialogForgotPassword, setOpenDialogForgotPassword] =
    useState(false);
  const [openDialogPractitioner, setOpenDialogPractitioner] = useState(false);
  const [avatar, setAvatar] = useState<File | null>(null);
  const [isPosting, setIsPosting] = useState(false);
  const [activeStep, setActiveStep] = useState(0);

  const handleIsOpenForgotPassword = (isOpen: boolean) => {
    setOpenDialogForgotPassword(isOpen);
  };

  const handleClosePractitioner = () => {
    setOpenDialogPractitioner(false);
  };

  const handleAvatarChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      setAvatar(event.target.files[0]);
    }
  };

  const submitFormPractitioner = async (data: PractitionerFormData) => {
    try {
      setIsPosting(true);
      practitionerFormData = { ...practitionerFormData, ...data };
      if (avatar) {
        practitionerFormData.avatar = avatar;
      }
      console.log("practitionerFormData:", practitionerFormData);
      // Add any additional logic if needed
      if (activeStep < 1) {
        setActiveStep((prev) => prev + 1);
      } else {
        const response = await HandleResult.handleOperation(
          () => postPractitioner(practitionerFormData),
          t("practitionerPage.practitionerCreated"),
          t("practitionerPage.sending")
        );
        if (response.success) setActiveStep((prev) => prev + 1);
      }
    } finally {
      await new Promise((resolve) => setTimeout(resolve, 1000)); // wait for 1 second
      setIsPosting(false);
    }
  };

  const postPractitioner = async (
    data: PractitionerFormData
  ): Promise<Result<Practitioner>> => {
    const rut = data.rut.replace(/\./g, "").replace(/-/g, "").toUpperCase();
    data.rut = rut;
    const { practitioner, practitionerRole } =
      await PersonUtil.PractitionerFormToPractitioner(data);

    console.log("practitionerRole:", practitionerRole);
    if (!practitioner)
      return {
        success: false,
        error: t("practitionerPage.errorConvertingForm"),
      };

    //check if user exists
    let url = `${import.meta.env.VITE_SERVER_URL}/auth/find?rut=${data.rut}`;
    let response_api = await fetch(url, {
      method: "GET",
      headers: {
        accept: "application/json",
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("access_token")}`,
      },
    });

    const dataRes = await response_api.json();

    console.log("response:", dataRes);
    if (dataRes.data)
      return { success: false, error: t("practitionerPage.userExists") };

    //send to hapi fhir
    const fhirService =
      FhirResourceService.getInstance<Practitioner>("Practitioner");
    const responseFhir = await fhirService.sendResource(practitioner);
    if (!responseFhir.success) return responseFhir;

    // send to server
    const user = {
      email: data.email,
      rut: data.rut,
      phone_number: data.numeroTelefonico,
      name: `${data.nombre} ${data.segundoNombre} ${data.apellidoPaterno} ${data.apellidoMaterno}`,
      role: "Practitioner",
      fhir_id: responseFhir.data.id,
      secondaryRoles: data.role?.map((role) => role.code).join(","), //TODO: no guardó los roles.
    };
    practitionerFormData.id = responseFhir.data.id;
    //TODO: add practitionerRole to user hapi fhir

    url = `${import.meta.env.VITE_SERVER_URL}/auth/register`;
    response_api = await fetch(url, {
      method: "POST",
      headers: {
        accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(user),
    });
    if (response_api.status === 409)
      return { success: false, error: t("practitionerPage.userExists") };
    if (response_api.status !== 201)
      return { success: false, error: response_api.statusText };

    console.log("response:", response_api);
    CacheUtils.clearCache();
    return responseFhir;
  };

  //Login
  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    try {
      const data = new FormData(event.currentTarget);

      const { rut, password } = {
        rut: data
          .get("rut")
          ?.toString()
          .replace(/\./g, "")
          .replace(/-/g, "")
          .toUpperCase(),
        password: data.get("password")?.toString(),
      };
      if (!rut || !password) return;
      console.log({ rut, password });
      const response = await HandleResult.handleOperation(
        () => login(rut, password),
        t("signInSide.sessionStarted"),
        t("signInSide.startingSession")
      );

      if (!response.success) return;

      console.log(response.data);
      localStorage.setItem("access_token", response.data.access_token);
      localStorage.setItem("token_type", response.data.token_type);
      const jwtToken = response.data.access_token;
      const decodedToken = jwtDecode(jwtToken) as { [key: string]: any };
      console.log("Decoded Token:", decodedToken);
      console.log("userRol:", decodedToken.role);
      console.log("id:", decodedToken.id);
      console.log("name:", decodedToken.name);

      localStorage.setItem("userRol", decodedToken.role);
      localStorage.setItem("id", decodedToken.id);
      localStorage.setItem("name", decodedToken.name);
      localStorage.setItem("tokenExpiration", decodedToken.exp);

      //setLogoutTimer();

      if (decodedToken.role === "Patient")
        window.location.href = `/Patient/${decodedToken.id}`;
      else window.location.href = "/";
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ThemeProvider theme={defaultTheme}>
      <Grid
        container
        component="main"
        sx={{ height: "100vh", overflow: "hidden" }}
      >
        <CssBaseline />
        <Grid item xs={12} sm={8} md={5} component={Paper} elevation={6} square>
          <Box
            sx={{
              my: 8,
              mx: 4,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              height: "100vh",
              overflow: "hidden",
            }}
          >
            <Box
              component="form"
              noValidate
              onSubmit={handleSubmit}
              sx={{
                mt: 1,
                height: "100%",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
              }}
            >
              <TextField
                margin="normal"
                required
                fullWidth
                id="rut"
                label={t("signInSide.rut")}
                name="rut"
                autoComplete="rut"
                autoFocus
                placeholder="123456789"
              />
              <TextField
                margin="normal"
                required
                fullWidth
                name="password"
                label={t("signInSide.password")}
                type={showPassword ? "text" : "password"}
                id="password"
                autoComplete="current-password"
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        aria-label="toggle password visibility"
                        onClick={handleClickShowPassword}
                        onMouseDown={handleMouseDownPassword}
                      >
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />

              <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 2 }}
                disabled={loading}
              >
                {t("signInSide.signIn")}
              </Button>
              <Button
                onClick={() => setOpenDialogPractitioner(true)}
                fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 2 }}
              >
                Registrar Profesional
              </Button>
              <Box textAlign="right">
                <Link
                  href="#"
                  variant="body2"
                  onClick={() => handleIsOpenForgotPassword(true)}
                >
                  {t("signInSide.forgotPassword")}
                </Link>
              </Box>
              <Box
                display="flex"
                justifyContent="center"
                alignItems="center"
                height="100%"
              >
                <img
                  src={logoBlue}
                  alt="logo"
                  style={{ maxWidth: "100%", height: "auto" }}
                />
              </Box>

              <Copyright sx={{ mt: 5 }} />
            </Box>
          </Box>
        </Grid>
        <Grid
          item
          xs={false}
          sm={4}
          md={7}
          sx={{
            backgroundImage: `url(${backgroundLogin})`,
            backgroundRepeat: "no-repeat",
            backgroundColor: (t) =>
              t.palette.mode === "light"
                ? t.palette.grey[50]
                : t.palette.grey[900],
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        />
      </Grid>
      <ForgotPasswordComponent
        onOpen={handleIsOpenForgotPassword}
        isOpen={openDialogForgotPassword}
      />
      <PractitionerCreateForm
        formId="practitioner-create-form"
        practitioner={practitionerFormData}
        submitForm={submitFormPractitioner}
        handleClose={handleClosePractitioner}
        open={openDialogPractitioner}
        activeStep={activeStep}
        setActiveStep={setActiveStep}
        avatar={avatar}
        handleAvatarChange={handleAvatarChange}
        isPosting={isPosting}
      />
    </ThemeProvider>
  );
}
