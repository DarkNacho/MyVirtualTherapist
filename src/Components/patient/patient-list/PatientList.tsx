import React, { useEffect, useState } from "react";
import {
  Avatar,
  Box,
  IconButton,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Typography,
  Paper,
  Button,
  Skeleton,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import {
  ArrowForward,
  Edit,
  Delete,
  ArrowLeft,
  ArrowRight,
} from "@mui/icons-material";
import styles from "./PatientList.module.css";
import { Patient } from "fhir/r4";
import PersonUtil from "../../../Services/Utils/PersonUtils";
import { SearchParams } from "fhir-kit-client";
import HandleResult from "../../../Utils/HandleResult";
import FhirResourceService from "../../../Services/FhirService";
import Tooltip from "@mui/material/Tooltip";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { useResource } from "../../ResourceContext"; // Import the context

interface PatientListProps {
  searchParam?: SearchParams;
  onReferClick?: (resource: Patient) => void;
  onEditClick?: (resource: Patient) => void;
  onDeleteClick?: (resource: Patient) => void;
}

function identifier(resource: Patient, isMobile: boolean) {
  const identifier = PersonUtil.getIdentifierByCode(resource, "RUT");
  return (
    <Typography
      variant="body2"
      color="textSecondary"
      component="span"
      sx={{ fontSize: isMobile ? "0.7rem" : "0.875rem" }}
    >
      <strong>{identifier.system}</strong>{" "}
      {PersonUtil.formatRut(identifier.value!)}
    </Typography>
  );
}

const fhirService = FhirResourceService.getInstance<Patient>("Patient");

export default function PatientList({
  searchParam,
  onReferClick,
  onEditClick,
  onDeleteClick,
}: PatientListProps) {
  const { t } = useTranslation();
  const [resources, setResources] = useState<Patient[]>([]);
  const [loading, setLoading] = useState(true);
  const { setResource } = useResource<Patient>(); // Use the context
  const navigate = useNavigate();

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const handleNewResources = async (direction: "next" | "previous") => {
    setLoading(true);
    await HandleResult.handleOperation(
      () => fhirService.getNewResources(direction),
      t("patientList.receivedSuccessfully"),
      t("patientList.obtaining"),
      setResources
    );
    setLoading(false);
  };

  const fetchResources = async () => {
    setLoading(true);
    /*await HandleResult.handleOperation(
      () => fhirService.getResources(searchParam),
      t("patientList.receivedSuccessfully"),
      t("patientList.obtaining"),
      setResources
    );*/
    await HandleResult.handleOperationWithErrorOnly(
      () => fhirService.getResources(searchParam),
      setResources
    );
    setLoading(false);
  };

  useEffect(() => {
    fetchResources();
  }, [searchParam]);

  const handleItemClick = (resource: Patient) => {
    setResource(resource); // Store the selected patient in the context
    navigate(`/Patient/${resource.id}`);
  };
  const renderSkeleton = () => (
    <ListItem className={styles.listItem}>
      <ListItemAvatar
        className={styles.circularContainer}
        sx={{ marginRight: 2 }}
      >
        <Skeleton variant="circular" width={55} height={50} />
      </ListItemAvatar>
      <Box sx={{ flex: 1 }}>
        <ListItemText
          primary={<Skeleton variant="text" width="60%" />}
          secondary={
            <>
              <Skeleton variant="text" width="40%" />
              <Skeleton variant="text" width="30%" />
              <Skeleton variant="text" width="50%" />
            </>
          }
        />
      </Box>
      <Box sx={{ display: "flex", gap: 1 }}>
        <Skeleton variant="circular" width={40} height={40} />
        <Skeleton variant="circular" width={40} height={40} />
        <Skeleton variant="circular" width={40} height={40} />
      </Box>
    </ListItem>
  );

  return (
    <Paper
      elevation={3}
      sx={{
        padding: 2,
        borderRadius: 2,
        flexGrow: 1,

        display: "flex",
        flexDirection: "column",
        border: "1px solid rgba(0, 0, 0, 0.12)",
        boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.1)",
        overflow: "hidden",
      }}
    >
      <List
        sx={{
          flex: 1,
          overflow: "hidden",
          height: "100%",

          "& .MuiListItem-root": {
            "& ::after": {
              content: '""',
              position: "absolute",
              bottom: 0,
              left: 70,
              right: 0,
              borderBottom: "1px solid darkblue",
            },
          },
        }}
      >
        {loading
          ? Array.from(new Array(5)).map((_, index) => (
              <React.Fragment key={index}>{renderSkeleton()}</React.Fragment>
            ))
          : resources.map((resource) => (
              <React.Fragment key={resource.id}>
                <ListItem className={styles.listItem}>
                  <ListItemAvatar
                    className={styles.circularContainer}
                    sx={{ marginRight: 2 }}
                  >
                    <Avatar
                      onClick={() => handleItemClick(resource)}
                      sx={{
                        width: "55px",
                        height: "50px",
                        ":hover": { cursor: "pointer" },
                      }}
                      src={
                        resource.photo?.[0]?.data
                          ? `data:${resource.photo[0].contentType};base64,${resource.photo[0].data}`
                          : resource.photo?.[0]?.url || undefined
                      }
                    />
                  </ListItemAvatar>
                  <Box sx={{ flex: 1 }}>
                    <ListItemText
                      primary={
                        <Typography
                          onClick={() => handleItemClick(resource)}
                          variant="body1"
                          color="textSecondary"
                          component="span"
                          sx={{
                            fontWeight: "bold",
                            display: "block",
                            ":hover": { cursor: "pointer" },
                            whiteSpace: "nowrap",
                            overflow: "visible",
                            textOverflow: "ellipsis",
                            width: "100%",
                            fontSize: isMobile ? "0.7rem" : "0.875rem",
                          }}
                        >
                          {resource.name?.[0]?.text}
                        </Typography>
                      }
                      secondary={
                        <>
                          {identifier(resource, isMobile)}
                          <Box component="span" className={styles.block}>
                            <Typography
                              variant="body2"
                              color="textSecondary"
                              component="span"
                              sx={{
                                fontSize: isMobile ? "0.7rem" : "0.875rem",
                              }}
                            >
                              <strong>{t("patientList.age")}:</strong>{" "}
                              {PersonUtil.calcularEdad(resource.birthDate!)}
                            </Typography>
                          </Box>
                          <Box component="span" className={styles.block}>
                            <Typography
                              variant="body2"
                              color="textSecondary"
                              component="span"
                              sx={{
                                whiteSpace: "nowrap",
                                overflow: "visible",
                                textOverflow: "ellipsis",
                                width: "100%",
                                fontSize: isMobile ? "0.7rem" : "0.875rem",
                              }}
                            >
                              <strong>{t("patientList.phone")}:</strong>{" "}
                              {PersonUtil.getContactPointFirstOrDefaultAsString(
                                resource,
                                "phone"
                              )}
                            </Typography>
                          </Box>
                        </>
                      }
                    />
                  </Box>
                  <Box sx={{ display: "flex", gap: 1 }}>
                    {onReferClick && (
                      <Tooltip title={t("patientList.referPatient")}>
                        <IconButton
                          className={
                            isMobile
                              ? styles.smallCircularContainer
                              : styles.circularContainer
                          }
                          color="primary"
                          aria-label="derive"
                          onClick={() => onReferClick(resource)}
                        >
                          <ArrowForward />
                        </IconButton>
                      </Tooltip>
                    )}
                    {onEditClick && (
                      <Tooltip title={t("patientList.edit")}>
                        <IconButton
                          className={
                            isMobile
                              ? styles.smallCircularContainer
                              : styles.circularContainer
                          }
                          color="primary"
                          aria-label="edit"
                          onClick={() => onEditClick(resource)}
                        >
                          <Edit />
                        </IconButton>
                      </Tooltip>
                    )}
                    {onDeleteClick && (
                      <Tooltip title={t("patientList.delete")}>
                        <IconButton
                          className={
                            isMobile
                              ? styles.smallCircularContainer
                              : styles.circularContainer
                          }
                          color="error"
                          aria-label="delete"
                          onClick={() => onDeleteClick(resource)}
                        >
                          <Delete />
                        </IconButton>
                      </Tooltip>
                    )}
                  </Box>
                </ListItem>
              </React.Fragment>
            ))}
      </List>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          borderTop: 1,
          borderColor: "divider",
          paddingTop: 1,
        }}
      >
        <Button
          variant="contained"
          color="primary"
          startIcon={<ArrowLeft />}
          onClick={() => handleNewResources("previous")}
          disabled={!fhirService.hasPrevPage}
        >
          {t("patientList.previous")}
        </Button>
        <Button
          variant="contained"
          color="primary"
          endIcon={<ArrowRight />}
          onClick={() => handleNewResources("next")}
          disabled={!fhirService.hasNextPage}
        >
          {t("patientList.next")}
        </Button>
      </Box>
    </Paper>
  );
}
