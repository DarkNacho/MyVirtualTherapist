import { Box } from "@mui/material";
import EncounterCalendar from "../../encounter/encounter-list/EncounterCalendar";

export default function PatientAppointmentsTab({ id }: { id: string }) {
  return (
    <Box height={"calc(100vh - 305px)"} overflow="auto">
      <EncounterCalendar
        searchParam={{ practitioner: localStorage.getItem("id")!, patient: id }}
        patientId={id}
      ></EncounterCalendar>
    </Box>
  );
}
