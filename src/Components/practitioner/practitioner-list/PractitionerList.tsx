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
  useMediaQuery,
  useTheme,
} from "@mui/material";
import {
  Edit,
  Delete,
  ArrowLeft,
  ArrowRight,
  Event,
} from "@mui/icons-material";
import styles from "./PractitionerList.module.css";
import { Practitioner } from "fhir/r4";
import PersonUtil from "../../../Services/Utils/PersonUtils";
import { SearchParams } from "fhir-kit-client";
import HandleResult from "../../../Utils/HandleResult";
import FhirResourceService from "../../../Services/FhirService";
import Tooltip from "@mui/material/Tooltip";
import { useTranslation } from "react-i18next";

interface PractitionerListProps {
  searchParam?: SearchParams;
  onEditClick?: (resource: Practitioner) => void;
  onDeleteClick?: (resource: Practitioner) => void;
}

function identifier(resource: Practitioner, isMobile: boolean) {
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

const fhirService =
  FhirResourceService.getInstance<Practitioner>("Practitioner");

export default function PractitionerList({
  searchParam,

  onEditClick,
  onDeleteClick,
}: PractitionerListProps) {
  const { t } = useTranslation();
  const [resources, setResources] = useState<Practitioner[]>([]);
  const [loading, setLoading] = useState(true);

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const handleNewResources = async (direction: "next" | "previous") => {
    setLoading(true);
    /*await HandleResult.handleOperation(
      () => fhirService.getNewResources(direction),
      t("practitionerList.receivedSuccessfully"),
      t("practitionerList.obtaining"),
      setResources
    );*/
    await HandleResult.handleOperationWithErrorOnly(
      () => fhirService.getNewResources(direction),
      setResources
    );

    setLoading(false);
  };

  const fetchResources = async () => {
    setLoading(true);
    await HandleResult.handleOperation(
      () => fhirService.getResources(searchParam),
      t("practitionerList.receivedSuccessfully"),
      t("practitionerList.obtaining"),
      setResources
    );
    setLoading(false);
  };

  useEffect(() => {
    fetchResources();
  }, [searchParam]);

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
                <ListItem
                  className={styles.listItem}
                  sx={{ overflowX: "auto" }}
                >
                  <ListItemAvatar
                    className={styles.circularContainer}
                    sx={{ marginRight: 2 }}
                  >
                    <Avatar
                      sx={{ width: "55px", height: "50px" }}
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
                          variant="body1"
                          color="textSecondary"
                          component="span"
                          sx={{
                            fontWeight: "bold",
                            display: "block",
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
                              <strong>{t("practitionerList.specialty")}:</strong> Especialidad
                            </Typography>
                          </Box>
                          <Box component="span" className={styles.block}>
                            <Typography
                              variant="body2"
                              color="textSecondary"
                              component="span"
                              sx={{
                                fontSize: isMobile ? "0.7rem" : "0.875rem",
                              }}
                            >
                              <strong>{t("practitionerList.phone")}:</strong>{" "}
                              {PersonUtil.getContactPointFirstOrDefaultAsString(
                                resource,
                                "phone"
                              )}
                            </Typography>
                          </Box>
                          <Box component="span" className={styles.block}>
                            <Typography
                              variant="body2"
                              color="textSecondary"
                              component="span"
                              sx={{
                                fontSize: isMobile ? "0.7rem" : "0.875rem",
                              }}
                            >
                              <strong>Email:</strong>{" "}
                              <a
                                href={`mailto:${PersonUtil.getContactPointFirstOrDefaultAsString(
                                  resource,
                                  "email"
                                )}`}
                              >
                                {PersonUtil.getContactPointFirstOrDefaultAsString(
                                  resource,
                                  "email"
                                )}
                              </a>
                            </Typography>
                          </Box>
                        </>
                      }
                    />
                  </Box>
                  <Box sx={{ display: "flex", gap: 1 }}>
                    <IconButton
                      className={
                        isMobile
                          ? styles.smallCircularContainer
                          : styles.circularContainer
                      }
                      color="primary"
                      aria-label="contact"
                      onClick={() =>
                        resource.telecom?.find(
                          (t) => t.system === "url" && t.rank === 99
                        )?.value &&
                        window.open(
                          resource.telecom?.find(
                            (t) => t.system === "url" && t.rank === 99
                          )?.value,
                          "_blank",
                          "noopener,noreferrer"
                        )
                      }
                    >
                      <Event />
                    </IconButton>
                    {onEditClick && (
                      <Tooltip title={t("practitionerList.edit")}>
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
                      <Tooltip title={t("practitionerList.delete")}>
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
          {t("practitionerList.previous")}
        </Button>
        <Button
          variant="contained"
          color="primary"
          endIcon={<ArrowRight />}
          onClick={() => handleNewResources("next")}
          disabled={!fhirService.hasNextPage}
        >
          {t("practitionerList.next")}
        </Button>
      </Box>
    </Paper>
  );
}
