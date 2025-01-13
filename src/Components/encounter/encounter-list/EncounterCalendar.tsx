import React, { useEffect, useState } from "react";
import {
  Box,
  IconButton,
  Typography,
  Paper,
  Tooltip,
  Skeleton,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { Edit, Delete } from "@mui/icons-material";
import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";
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
const localizer = momentLocalizer(moment);

const messages = {
  es: {
    allDay: "Todo el día",
    previous: "Anterior",
    next: "Siguiente",
    today: "Hoy",
    month: "Mes",
    week: "Semana",
    day: "Día",
    agenda: "Agenda",
    date: "Fecha",
    time: "Hora",
    event: "Evento",
    noEventsInRange: "No hay eventos en este rango.",
    showMore: (total) => `+ Ver más (${total})`,
  },
  en: {
    allDay: "All day",
    previous: "Previous",
    next: "Next",
    today: "Today",
    month: "Month",
    week: "Week",
    day: "Day",
    agenda: "Agenda",
    date: "Date",
    time: "Time",
    event: "Event",
    noEventsInRange: "There are no events in this range.",
    showMore: (total) => `+ Show more (${total})`,
  },
};

export default function EncounterCalendar({
  searchParam,
  onEditClick,
  onDeleteClick,
}: EncounterListProps) {
  const { t, i18n } = useTranslation();
  const [resources, setResources] = useState<Encounter[]>([]);
  const [loading, setLoading] = useState(true);
  const { setResource } = useResource<Encounter>(); // Use the context
  const navigate = useNavigate();

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

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
    <Box sx={{ flex: 1 }}>
      <Skeleton variant="text" width="60%" />
      <Skeleton variant="text" width="40%" />
      <Skeleton variant="text" width="30%" />
      <Skeleton variant="text" width="50%" />
    </Box>
  );

  const events = resources.map((resource) => ({
    id: resource.id,
    title:
      loadUserRoleFromLocalStorage() === "Admin"
        ? `Paciente: ${EncounterUtils.getSubjectDisplayOrID(resource.subject!)}`
        : `Profesional: ${EncounterUtils.getPrimaryPractitioner(resource)}`,
    start: new Date(resource.period?.start!),
    end: new Date(resource.period?.end!),
    resource,
  }));

  const calendarMessages = i18n.language === "es" ? messages.es : messages.en;

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
        height: "100%", // Ensure the Paper component takes the full height of its container
      }}
    >
      {loading ? (
        Array.from(new Array(5)).map((_, index) => (
          <React.Fragment key={index}>{renderSkeleton()}</React.Fragment>
        ))
      ) : (
        <Calendar
          localizer={localizer}
          events={events}
          startAccessor="start"
          endAccessor="end"
          style={{ height: "100%" }} // Set the height of the Calendar to 100%
          messages={calendarMessages}
          onSelectEvent={(event) => handleItemClick(event.resource)}
          components={{
            event: ({ event }) => (
              <Box sx={{ display: "flex", alignItems: "center" }}>
                <Typography variant="body2" sx={{ flexGrow: 1 }}>
                  {event.title}
                </Typography>
                {onEditClick && (
                  <Tooltip title={t("encounterList.edit")}>
                    <IconButton
                      className={
                        isMobile
                          ? styles.smallCircularContainer
                          : styles.circularContainer
                      }
                      color="primary"
                      aria-label="edit"
                      onClick={() => onEditClick(event.resource)}
                    >
                      <Edit />
                    </IconButton>
                  </Tooltip>
                )}
                {onDeleteClick && (
                  <Tooltip title={t("encounterList.delete")}>
                    <IconButton
                      className={
                        isMobile
                          ? styles.smallCircularContainer
                          : styles.circularContainer
                      }
                      color="error"
                      aria-label="delete"
                      onClick={() => onDeleteClick(event.resource)}
                    >
                      <Delete />
                    </IconButton>
                  </Tooltip>
                )}
              </Box>
            ),
          }}
        />
      )}
    </Paper>
  );
}
