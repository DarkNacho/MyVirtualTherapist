import {
  Card,
  CardContent,
  CardMedia,
  Typography,
  Button,
  Grid,
  Box,
  Skeleton,
} from "@mui/material";
import { Patient } from "fhir/r4";
import PersonUtil from "../../../Services/Utils/PersonUtils";

interface PatientCardProps {
  patient?: Patient; // Patient model as a prop
  onDownloadReport: () => void;
  onRefer: () => void;
}

function identifier(resource: Patient) {
  const identifier = PersonUtil.getIdentifierByCode(resource, "RUT");
  return (
    <Typography variant="body2" color="textSecondary" component="span">
      <strong>{identifier.system}</strong> {identifier.value}
    </Typography>
  );
}

export default function PatientCard({
  patient,
  onDownloadReport,
  onRefer,
}: PatientCardProps) {
  const isLoading = !patient;

  return (
    <Card
      sx={{
        display: "flex",
        alignItems: "center",
        borderRadius: 4,
        position: "relative",
      }}
    >
      <CardContent sx={{ flex: 1 }}>
        <Grid container spacing={2}>
          {/* Profile Picture */}
          <Grid item xs={12} md={1.5}>
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
                    {patient.name?.[0]?.text || "Nombre no disponible"}
                  </strong>
                </Typography>
                {identifier(patient)}
                <Typography variant="body2">
                  Teléfono:{" "}
                  {PersonUtil.getContactPointFirstOrDefaultAsString(
                    patient,
                    "phone"
                  )}
                </Typography>
                <Typography variant="body2">
                  Email:{" "}
                  {PersonUtil.getContactPointFirstOrDefaultAsString(
                    patient,
                    "email"
                  )}
                </Typography>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={onDownloadReport}
                  sx={{ marginTop: 1 }}
                  disabled={isLoading}
                >
                  Descargar Reporte
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
                  Edad: {PersonUtil.calcularEdad(patient.birthDate!)}
                </Typography>
                <Typography variant="body2">
                  Fecha nac.: {patient.birthDate}
                </Typography>
                <Typography variant="body2">Sexo: {patient.gender}</Typography>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={onRefer}
                  sx={{ marginTop: 1 }}
                  disabled={isLoading}
                >
                  Derivar
                </Button>
              </>
            )}
          </Grid>
        </Grid>
      </CardContent>

      {/* Gradient Background */}
      <Box
        sx={{
          position: "absolute",
          top: 0,
          right: 0,
          bottom: 0,
          width: "40%",
          background: "linear-gradient(to right, white, blue)",
        }}
      />
    </Card>
  );
}
