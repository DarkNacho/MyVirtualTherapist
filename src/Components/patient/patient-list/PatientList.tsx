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
import HandleResult from "../../../Services/HandleResult";
import FhirResourceService from "../../../Services/FhirService";

interface PatientListProps {
  searchParam?: SearchParams;
  onDetailsClick?: (resource: Patient) => void;
  onEditClick?: (resource: Patient) => void;
  onDeleteClick?: (resource: Patient) => void;
}

function identifier(resource: Patient) {
  const identifier = PersonUtil.getIdentifierByCode(resource, "RUT");
  return (
    <Typography variant="body2" color="textSecondary" component="span">
      <strong>{identifier.system}</strong> {identifier.value}
    </Typography>
  );
}

const fhirService = new FhirResourceService<Patient>("Patient");

export default function PatientList({
  searchParam,
  onDetailsClick,
  onEditClick,
  onDeleteClick,
}: PatientListProps) {
  const [resources, setResources] = useState<Patient[]>([]);

  const handleNewResources = async (direction: "next" | "prev") => {
    HandleResult.handleOperation(
      () => fhirService.getNewResources(direction),
      "Recibidos exitosamente",
      "Obteniendo...",
      setResources
    );
  };

  const fetchResources = async () => {
    HandleResult.handleOperation(
      () => fhirService.getResources(searchParam),
      "Recibidos exitosamente",
      "Obteniendo...",
      setResources
    );
  };

  useEffect(() => {
    fetchResources();
  }, [searchParam]);

  return (
    <Paper
      elevation={3}
      sx={{
        padding: 2,
        borderRadius: 2,
        height: "100%",
        display: "flex",
        flexDirection: "column",
        border: "1px solid rgba(0, 0, 0, 0.12)",
        boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.1)",
        overflow: "hidden", // This ensures the content doesn't overflow
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
              left: 70, // Start border after padding
              right: 0,
              borderBottom: "1px solid darkblue",
            },
          },
        }}
      >
        {resources.map((resource) => (
          <React.Fragment key={resource.id}>
            <ListItem className={styles.listItem}>
              <ListItemAvatar
                className={styles.circularContainer}
                sx={{ marginRight: 2 }}
              >
                <Avatar
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
                      sx={{ fontWeight: "bold", display: "block" }}
                    >
                      {resource.name?.[0]?.text}
                    </Typography>
                  }
                  secondary={
                    <>
                      {identifier(resource)}
                      <Box component="span" className={styles.block}>
                        <Typography
                          variant="body2"
                          color="textSecondary"
                          component="span"
                        >
                          <strong>Edad:</strong>{" "}
                          {PersonUtil.calcularEdad(resource.birthDate!)}
                        </Typography>
                      </Box>
                      <Box component="span" className={styles.block}>
                        <Typography
                          variant="body2"
                          color="textSecondary"
                          component="span"
                        >
                          <strong>Teléfono:</strong>{" "}
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
                {onDetailsClick && (
                  <IconButton
                    className={styles.circularContainer}
                    color="primary"
                    aria-label="details"
                    onClick={() => onDetailsClick(resource)}
                  >
                    <ArrowForward />
                  </IconButton>
                )}
                {onEditClick && (
                  <IconButton
                    className={styles.circularContainer}
                    color="primary"
                    aria-label="edit"
                    onClick={() => onEditClick(resource)}
                  >
                    <Edit />
                  </IconButton>
                )}
                {onDeleteClick && (
                  <IconButton
                    className={styles.circularContainer}
                    color="error"
                    aria-label="delete"
                    onClick={() => onDeleteClick(resource)}
                  >
                    <Delete />
                  </IconButton>
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
          onClick={() => handleNewResources("prev")}
          disabled={!fhirService.hasPrevPage}
        >
          Anterior
        </Button>
        <Button
          variant="contained"
          color="primary"
          endIcon={<ArrowRight />}
          onClick={() => handleNewResources("next")}
          disabled={!fhirService.hasNextPage}
        >
          Siguiente
        </Button>
      </Box>
    </Paper>
  );
}
