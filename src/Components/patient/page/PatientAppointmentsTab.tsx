import EncounterList from "../../encounter/encounter-list/EncounterList";
import EncounterListPage from "../../encounter/encounter-list/EncounterListPage";

export default function PatientAppointmentsTab({ id }: { id: string }) {
  return (
    <EncounterList
      searchParam={{ practitioner: localStorage.getItem("id")!, patient: id }}
    ></EncounterList>
  );
}
