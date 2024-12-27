import React, { useEffect, useState } from "react";
import {
  Box,
  IconButton,
  List,
  ListItem,
  ListItemText,
  Typography,
  Paper,
  Button,
  Tooltip,
  Skeleton,
} from "@mui/material";
import { Edit, Delete, ArrowLeft, ArrowRight } from "@mui/icons-material";
import styles from "./EncounterList.module.css";
import { Encounter } from "fhir/r4";

import { SearchParams } from "fhir-kit-client";
import HandleResult from "../../../Utils/HandleResult";
import FhirResourceService from "../../../Services/FhirService";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { useResource } from "../../ResourceContext"; // Import the context
import { loadUserRoleFromLocalStorage } from "../../../Utils/RolUser";
import EncounterUtils from "../../../Services/Utils/EncounterUtils";

interface EncounterListProps {
  searchParam?: SearchParams;
  onEditClick?: (resource: Encounter) => void;
  onDeleteClick?: (resource: Encounter) => void;
}

const fhirService = FhirResourceService.getInstance<Encounter>("Encounter");

function getDisplay(
  resource: Encounter,
  handleItemClick: (resource: Encounter) => void
): JSX.Element {
  const roleUser = loadUserRoleFromLocalStorage();
  let primaryText = "";
  let secondaryText = "";

  if (roleUser === "Admin") {
    primaryText = `Paciente: ${EncounterUtils.getSubjectDisplayOrID(
      resource.subject!
    )}`;
    secondaryText = `Profesional: ${EncounterUtils.getPrimaryPractitioner(
      resource
    )}`;
  } else if (roleUser === "Patient") {
    primaryText = `Profesional: ${EncounterUtils.getPrimaryPractitioner(
      resource
    )}`;
  } else if (roleUser === "Practitioner") {
    primaryText = `Paciente: ${EncounterUtils.getSubjectDisplayOrID(
      resource.subject!
    )}`;
  }

  const periodText = EncounterUtils.getFormatPeriod(resource.period!);

  return (
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
          }}
        >
          {primaryText}
        </Typography>
      }
      secondary={
        <Typography variant="body2" color="textSecondary" component="span">
          {secondaryText}
          <br />
          {periodText}
        </Typography>
      }
    />
  );
}

export default function EncounterList({
  searchParam,
  onEditClick,
  onDeleteClick,
}: EncounterListProps) {
  const { t } = useTranslation();
  const [resources, setResources] = useState<Encounter[]>([]);
  const [loading, setLoading] = useState(true);
  const { setResource } = useResource<Encounter>(); // Use the context
  const navigate = useNavigate();

  const handleNewResources = async (direction: "next" | "previous") => {
    setLoading(true);
    await HandleResult.handleOperation(
      () => fhirService.getNewResources(direction),
      t("encounterList.receivedSuccessfully"),
      t("encounterList.obtaining"),
      setResources
    );
    setLoading(false);
  };

  const fetchResources = async () => {
    setLoading(true);
    await HandleResult.handleOperation(
      () => fhirService.getResources(searchParam),
      t("encounterList.receivedSuccessfully"),
      t("encounterList.obtaining"),
      setResources
    );
    setLoading(false);
  };

  useEffect(() => {
    fetchResources();
  }, [searchParam]);

  const handleItemClick = (resource: Encounter) => {
    setResource(resource);
    navigate(`/Encounter/${resource.id}`);
  };

  const renderSkeleton = () => (
    <ListItem className={styles.listItem}>
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
                  <Box sx={{ flex: 1 }}>
                    {getDisplay(resource, handleItemClick)}
                  </Box>
                  <Box sx={{ display: "flex", gap: 1 }}>
                    {onEditClick && (
                      <Tooltip title={t("encounterList.edit")}>
                        <IconButton
                          className={styles.circularContainer}
                          color="primary"
                          aria-label="edit"
                          onClick={() => onEditClick(resource)}
                        >
                          <Edit />
                        </IconButton>
                      </Tooltip>
                    )}
                    {onDeleteClick && (
                      <Tooltip title={t("encounterList.delete")}>
                        <IconButton
                          className={styles.circularContainer}
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
          {t("encounterList.previous")}
        </Button>
        <Button
          variant="contained"
          color="primary"
          endIcon={<ArrowRight />}
          onClick={() => handleNewResources("next")}
          disabled={!fhirService.hasNextPage}
        >
          {t("encounterList.next")}
        </Button>
      </Box>
    </Paper>
  );
}
