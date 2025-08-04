import React, { useEffect, useState } from "react";
import {
  Box,
  IconButton,
  Typography,
  Paper,
  Tooltip,
  Skeleton,
  Menu,
  MenuItem,
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
import EncounterUtils from "../../../Services/Utils/EncounterUtils";
import EncounterCreateComponent from "../encounter-create/EncounterCreateComponent";
import { isAdminOrPractitioner } from "../../../Utils/RolUser";

interface EncounterListProps {
  searchParam?: SearchParams;
  patientId?: string;
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
    showMore: (total: number) => `+ Ver más (${total})`,
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
    showMore: (total: number) => `+ Show more (${total})`,
  },
};

let startDate: Date | undefined = undefined;
let endDate: Date | undefined = undefined;

export default function EncounterCalendar({
  searchParam,
  patientId,
}: EncounterListProps) {
  const { t, i18n } = useTranslation();
  const [resources, setResources] = useState<Encounter[]>([]);
  const [loading, setLoading] = useState(true);
  const { setResource } = useResource<Encounter>(); // Use the context
  const navigate = useNavigate();

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedEvent, setSelectedEvent] = useState<null | Encounter>(null);
  const [currentView, setCurrentView] = useState<string>("month");
  const [openCreate, setOpenCreate] = useState(false);
  const isAdminPractitioner = isAdminOrPractitioner();
  const [selectedResource, setSelectedResource] = useState<
    Encounter | undefined
  >(undefined);
  const [mode, setMode] = useState<"create" | "edit">("create");

  const fetchResources = async () => {
    setLoading(true);
    /*await HandleResult.handleOperation(
      () => fhirService.getResources(searchParam),
      t("encounterList.receivedSuccessfully"),
      t("encounterList.obtaining"),
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

  const handleItemClick = (resource: Encounter) => {
    setResource(resource);
    navigate(`/Encounter/${resource.id}`);
  };

  const handleMenuClick = (
    event: {
      id: string | undefined;
      title: string;
      start: Date;
      end: Date;
      resource: Encounter;
    },
    e: React.SyntheticEvent<HTMLElement, Event>
  ) => {
    if (isAdminOrPractitioner()) {
      if (currentView !== "agenda") {
        setAnchorEl(e.currentTarget as HTMLElement);
        setSelectedEvent(event.resource);
      }
    } else {
      handleItemClick(event.resource);
    }
  };

  /*
  const handleEventClick = (event: {
    id: string | undefined;
    title: string;
    start: Date;
    end: Date;
    resource: Encounter;
  }) => {
    handleItemClick(event.resource);
  };*/

  const handleCloseMenu = () => {
    setAnchorEl(null);
    setSelectedEvent(null);
    //setSelectedResource(undefined);
  };

  const handleEditClick = (encounter: Encounter) => {
    setSelectedResource(encounter);
    setMode("edit");
    setOpenCreate(true);
    console.log("Edit encounter:", encounter);
  };

  const handleCreateClick = (start: Date, end: Date) => {
    startDate = start;
    endDate = end;
    setSelectedResource(undefined);
    setMode("create");
    setOpenCreate(true);
  };

  const handleDeleteClick = async (encounter: Encounter) => {
    if (!encounter) return;
    const confirmed = await HandleResult.confirm(
      "¿Estás seguro de que quieres eliminar esta sesión? Esta acción no se puede deshacer."
    );
    if (!confirmed) return;
    const response = await HandleResult.handleOperation(
      () =>
        FhirResourceService.getInstance<Encounter>("Encounter").deleteResource(
          encounter.id!
        ),
      "Sesión eliminada de forma exitosa",
      "Eliminando..."
    );
    if (!response.success) {
      HandleResult.showErrorMessage(
        "Error al eliminar la sesión. Por favor, inténtalo de nuevo más tarde."
      );
    }
  };

  const renderSkeleton = () => (
    <Box sx={{ flex: 1 }}>
      <Skeleton variant="text" width="60%" />
      <Skeleton variant="text" width="40%" />
      <Skeleton variant="text" width="30%" />
      <Skeleton variant="text" width="50%" />
    </Box>
  );

  const CustomAgendaEvent = ({
    event,
    onEditClick,
    onDeleteClick,
    t,
  }: {
    event: {
      id: string | undefined;
      title: string;
      start: Date;
      end: Date;
      resource: Encounter;
    };
    onEditClick?: (resource: Encounter) => void;
    onDeleteClick?: (resource: Encounter) => void;
    t: (key: string) => string;
  }) => (
    <Box sx={{ display: "flex", alignItems: "center" }}>
      <Typography
        variant="body2"
        sx={{
          flexGrow: 1,
          whiteSpace: "nowrap",
          overflow: "hidden",
          textOverflow: "ellipsis",
        }}
      >
        {event.title}
      </Typography>
      {isAdminPractitioner && onEditClick && (
        <Tooltip title={t("encounterList.edit")}>
          <IconButton
            className={styles.smallCircularContainer}
            color="primary"
            aria-label="edit"
            onClick={() => onEditClick(event.resource as Encounter)}
          >
            <Edit />
          </IconButton>
        </Tooltip>
      )}
      {isAdminPractitioner && onDeleteClick && (
        <Tooltip title={t("encounterList.delete")}>
          <IconButton
            className={styles.smallCircularContainer}
            color="error"
            aria-label="delete"
            onClick={() => onDeleteClick(event.resource as Encounter)}
          >
            <Delete />
          </IconButton>
        </Tooltip>
      )}
    </Box>
  );

  const events = resources.map((resource) => ({
    id: resource.id,
    title: EncounterUtils.getSubjectDisplayOrID(resource.subject!),
    start: resource.period?.start
      ? new Date(resource.period.start)
      : new Date(),
    end: resource.period?.end ? new Date(resource.period.end) : new Date(),
    resource,
  }));

  const calendarMessages = i18n.language === "es" ? messages.es : messages.en;

  return (
    <>
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
            onSelectSlot={({ start, end }) => {
              let adjustedEnd = end;
              if (currentView === "month") {
                adjustedEnd = moment(end).subtract(1, "second").toDate();
              }
              const isSameDay = moment(start).isSame(adjustedEnd, "day");
              if (isSameDay) {
                handleCreateClick(start, adjustedEnd);
              } else {
                HandleResult.showInfoMessage(
                  "Please select a slot within a single day."
                );
              }
            }}
            onSelectEvent={handleMenuClick}
            onView={(view) => setCurrentView(view)}
            popup
            selectable
            components={{
              event: ({ event }) => (
                <Box sx={{ display: "flex", alignItems: "center" }}>
                  <Typography
                    variant="body2"
                    sx={{
                      flexGrow: 1,
                      whiteSpace: "nowrap",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                    }}
                  >
                    {currentView === "month"
                      ? `${moment(event.start).format("HH:mm")} - ${moment(
                          event.end
                        ).format("HH:mm")} ${event.title}`
                      : event.title}
                  </Typography>
                </Box>
              ),
              agenda: {
                event: (props) => (
                  <CustomAgendaEvent
                    event={props.event}
                    onEditClick={handleEditClick}
                    onDeleteClick={handleDeleteClick}
                    t={t}
                  />
                ),
              },
            }}
          />
        )}
        {currentView !== "agenda" && (
          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleCloseMenu}
          >
            {/*<MenuItem
              onClick={() => {
                handleItemClick(selectedEvent!);
                handleCloseMenu();
              }}
            >
              <Visibility fontSize="small" />
              {t("encounterList.view")}
            </MenuItem>*/}
            {handleEditClick && isAdminPractitioner && (
              <MenuItem
                onClick={() => {
                  handleEditClick(selectedEvent!);
                  handleCloseMenu();
                }}
              >
                <Edit fontSize="small" />
                {t("encounterList.edit")}
              </MenuItem>
            )}
            {handleDeleteClick && isAdminPractitioner && (
              <MenuItem
                onClick={() => {
                  handleDeleteClick(selectedEvent!);
                  handleCloseMenu();
                }}
              >
                <Delete fontSize="small" />
                {t("encounterList.delete")}
              </MenuItem>
            )}
          </Menu>
        )}
      </Paper>
      {isAdminPractitioner && (
        <EncounterCreateComponent
          onOpen={function (isOpen: boolean): void {
            setOpenCreate(isOpen);
            if (!isOpen) setSelectedResource(undefined);
          }}
          isOpen={openCreate}
          start={startDate}
          end={endDate}
          patientId={patientId}
          encounter={selectedResource}
          mode={mode}
        />
      )}
    </>
  );
}
