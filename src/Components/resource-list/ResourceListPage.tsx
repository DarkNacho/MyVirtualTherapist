import React, { useEffect, useState } from "react";
import ResourceList from "./ResourceList";
import NotesIcon from "@mui/icons-material/Notes";
import { Observation } from "fhir/r4";
import { Box } from "@mui/material";

// Datos de ejemplo
const sampleObservations: Observation[] = [
  {
    resourceType: "Observation",
    id: "1",
    code: { text: "Llega de buen ánimo" },
    valueString: "5 EVA en rodilla",
    effectiveDateTime: "2024-11-20",
    status: "final",
  },
  {
    resourceType: "Observation",
    id: "2",
    code: { text: "Llega de mal ánimo" },
    valueString: "5 EVA en rodilla",
    effectiveDateTime: "2024-11-15",
    status: "final",
  },
  {
    resourceType: "Observation",
    id: "3",
    code: { text: "Llega de excelente ánimo" },
    valueString: "5 EVA en rodilla",
    effectiveDateTime: "2024-11-09",
    status: "final",
  },
  {
    resourceType: "Observation",
    id: "1",
    code: { text: "Llega de buen ánimo" },
    valueString: "5 EVA en rodilla",
    effectiveDateTime: "2024-11-20",
    status: "final",
  },
  {
    resourceType: "Observation",
    id: "2",
    code: { text: "Llega de mal ánimo" },
    valueString: "5 EVA en rodilla",
    effectiveDateTime: "2024-11-15",
    status: "final",
  },
  {
    resourceType: "Observation",
    id: "3",
    code: { text: "Llega de excelente ánimo" },
    valueString: "5 EVA en rodilla",
    effectiveDateTime: "2024-11-09",
    status: "final",
  },
  {
    resourceType: "Observation",
    id: "1",
    code: { text: "Llega de buen ánimo" },
    valueString: "5 EVA en rodilla",
    effectiveDateTime: "2024-11-20",
    status: "final",
  },
  {
    resourceType: "Observation",
    id: "2",
    code: { text: "Llega de mal ánimo" },
    valueString: "5 EVA en rodilla",
    effectiveDateTime: "2024-11-15",
    status: "final",
  },
  {
    resourceType: "Observation",
    id: "3",
    code: { text: "Llega de excelente ánimo" },
    valueString: "5 EVA en rodilla",
    effectiveDateTime: "2024-11-09",
    status: "final",
  },
  {
    resourceType: "Observation",
    id: "1",
    code: { text: "Llega de buen ánimo" },
    valueString: "5 EVA en rodilla",
    effectiveDateTime: "2024-11-20",
    status: "final",
  },
  {
    resourceType: "Observation",
    id: "2",
    code: { text: "Llega de mal ánimo" },
    valueString: "5 EVA en rodilla",
    effectiveDateTime: "2024-11-15",
    status: "final",
  },
  {
    resourceType: "Observation",
    id: "3",
    code: { text: "Llega de excelente ánimo" },
    valueString: "5 EVA en rodilla",
    effectiveDateTime: "2024-11-09",
    status: "final",
  },
];

// Función para extraer las cadenas de visualización
const getObservationDisplay = (observation: Observation) => {
  return {
    leftTitle: observation.code?.text || "Sin título",
    leftSubtitle: observation.valueString || "Sin detalles",
    rightText: observation.effectiveDateTime || "Sin fecha",
  };
};

// Manejo del clic en un recurso
const handleObservationClick = (observation: Observation) => {
  alert(`Clicked observation: ${observation.id}`);
};

// Manejo del botón "Añadir"
const handleAddClick = () => {
  alert("Add button clicked!");
};

const ResourceListPage: React.FC = () => {
  const [observations, setObservations] = useState<Observation[] | undefined>(
    undefined
  );

  useEffect(() => {
    // Simulate a network request
    setTimeout(() => {
      setObservations(sampleObservations);
    }, 2000);
  }, []);

  return (
    <Box height="400px" width="600px">
      <ResourceList
        title="Observaciones"
        Icon={NotesIcon}
        resources={observations}
        onClick={handleObservationClick}
        getDisplay={getObservationDisplay}
        onAddClick={handleAddClick}
      />
    </Box>
  );
};

export default ResourceListPage;
