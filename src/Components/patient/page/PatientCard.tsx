import {
  Card,
  CardContent,
  CardMedia,
  Typography,
  Button,
  Grid,
  Box,
  Skeleton,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { Patient } from "fhir/r4";
import PersonUtil from "../../../Services/Utils/PersonUtils";
import PatientReportModal from "../patient-report/PatientReport";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Add } from "@mui/icons-material";
import EncounterCreateComponent from "../../encounter/encounter-create/EncounterCreateComponent";

function identifier(resource: Patient) {
  const identifier = PersonUtil.getIdentifierByCode(resource, "RUT");
  return (
    <Typography variant="body2">
      <strong>{identifier.system}</strong>{" "}
      {PersonUtil.formatRut(identifier.value!)}
    </Typography>
  );
}

export default function PatientCard({ patient }: { patient?: Patient }) {
  const isLoading = !patient;
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const { t } = useTranslation();

  const [openReport, setOpenReport] = useState(false);

  const [openCreate, setOpenCreate] = useState(false);

  const handleOpenCreate = () => {
    setOpenCreate(true);
  };

  const handleClickOpenReport = () => {
    setOpenReport(true);
  };

  const handleCloseReport = () => {
    setOpenReport(false);
  };

  const onRefer = () => {
    console.log("Referir a otro profesional");
  };

  const genderMap = {
    male: t("terminology.genderOptions.male"),
    female: t("terminology.genderOptions.female"),
    other: t("terminology.genderOptions.other"),
    unknown: t("terminology.genderOptions.unknown"),
  };

  return (
    <>
      <Card
        sx={{
          display: "flex",
          alignItems: "center",
          borderRadius: 4,
          position: "relative",
          flexDirection: isMobile ? "column" : "row",
          textAlign: isMobile ? "center" : "left",
        }}
      >
        <CardContent sx={{ flex: 1 }}>
          <Grid
            container
            spacing={2}
            justifyContent={isMobile ? "center" : "flex-start"}
          >
            {/* Profile Picture */}
            <Grid item xs={12} md={1.5} display="flex" justifyContent="center">
              {isLoading ? (
                <Skeleton variant="circular" width={150} height={150} />
              ) : (
                <CardMedia
                  component="img"
                  sx={{
                    width: 150,
                    height: 150,
                    borderRadius: "50%",
                    border: "2px solid #2d7dfc",
                  }}
                  image={
                    patient.photo?.[0]?.data
                      ? `data:${patient.photo[0].contentType};base64,${patient.photo[0].data}`
                      : patient.photo?.[0]?.url || undefined
                  }
                  alt={`${patient.name?.[0]?.text} profile`}
                />
              )}
            </Grid>

            {/* Patient's Name and Contact Info */}
            <Grid item xs={12} md={3}>
              {isLoading ? (
                <>
                  <Skeleton width="80%" />
                  <Skeleton width="60%" />
                  <Skeleton width="40%" />
                  <Skeleton width="50%" />
                  <Skeleton width="30%" />
                </>
              ) : (
                <>
                  <Typography
                    variant="h6"
                    component="div"
                    sx={{
                      whiteSpace: "nowrap",
                      overflow: "visible",
                      textOverflow: "ellipsis",
                      width: "100%",
                    }}
                  >
                    <strong>
                      {patient.name?.[0]?.text ||
                        t("patientCard.nameNotAvailable")}
                    </strong>
                  </Typography>
                  {identifier(patient)}
                  <Typography variant="body2">
                    {t("patientCard.phone")}:{" "}
                    {PersonUtil.getContactPointFirstOrDefaultAsString(
                      patient,
                      "phone"
                    )}
                  </Typography>
                  <Typography variant="body2">
                    {t("patientCard.email")}:{" "}
                    <a
                      href={`mailto:${PersonUtil.getContactPointFirstOrDefaultAsString(
                        patient,
                        "email"
                      )}`}
                    >
                      {PersonUtil.getContactPointFirstOrDefaultAsString(
                        patient,
                        "email"
                      )}
                    </a>
                  </Typography>
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={handleClickOpenReport}
                    sx={{ marginTop: 1 }}
                    disabled={isLoading}
                  >
                    {t("patientCard.downloadReport")}
                  </Button>
                </>
              )}
            </Grid>

            {/* Patient's Age, Gender, and Birth Date */}
            <Grid item xs={12} md={3}>
              {isLoading ? (
                <>
                  <Skeleton width="80%" />
                  <Skeleton width="60%" />
                  <Skeleton width="40%" />
                </>
              ) : (
                <>
                  <Typography variant="h6" component="div">
                    <strong>&nbsp;</strong>
                  </Typography>
                  <Typography variant="body2">
                    {t("patientCard.age")}:{" "}
                    {PersonUtil.calcularEdad(patient.birthDate!)}
                  </Typography>
                  <Typography variant="body2">
                    {t("patientCard.birthDate")}:{" "}
                    {new Date(patient.birthDate!).toLocaleDateString("es-ES")}
                  </Typography>
                  <Typography variant="body2">
                    {t("patientCard.gender")}:{" "}
                    {genderMap[patient.gender || "unknown"]}
                  </Typography>
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={onRefer}
                    sx={{ marginTop: 1 }}
                    disabled={isLoading}
                  >
                    {t("patientCard.refer")}
                  </Button>
                </>
              )}
            </Grid>
          </Grid>
        </CardContent>

        {/* Gradient Background */}

        {!isMobile && (
          <Box
            sx={{
              position: "absolute",
              top: 0,
              right: 0,
              bottom: 0,
              width: "40%",
              background: "linear-gradient(to right, white, blue)",
            }}
          >
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                paddingLeft: 30,
                height: "100%",
                width: "70%",
              }}
            >
              <Button
                variant="contained"
                onClick={handleOpenCreate}
                sx={{
                  textTransform: "none",
                  borderRadius: 2,
                  paddingLeft: 3,
                  paddingRight: 0,
                  fontWeight: "bold",
                  height: "70px",
                  marginLeft: 2,
                  whiteSpace: "pre-line",
                  backgroundColor: "white",
                  color: "primary.main",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  border: "2px solid",
                  borderColor: "primary.main",
                }}
              >
                {t("patientCard.newEncounter")}
                <Box
                  sx={{
                    height: "70px",
                    borderRadius: 2,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    padding: 1,
                    marginLeft: 2,
                  }}
                >
                  <Add sx={{ color: "primary.main" }} />
                </Box>
              </Button>
            </Box>
          </Box>
        )}
      </Card>
      {patient && (
        <>
          <PatientReportModal
            open={openReport}
            handleClose={handleCloseReport}
            patientId={patient.id!}
          />
          <EncounterCreateComponent
            onOpen={function (isOpen: boolean): void {
              setOpenCreate(isOpen);
            }}
            patientId={patient.id!}
            isOpen={openCreate}
          />
        </>
      )}
    </>
  );
}
