import { useParams } from "react-router-dom";
import WebSocketChart from "../../charts/WebSocketChart";

//import { usePatient } from "../PatientContext";
import { useResourceHook } from "../../ResourceHook";
import { Patient } from "fhir/r4";

export default function PatientSensorTab({
  patientId,
}: {
  patientId?: string;
}) {
  const { token } = useParams();
  const { effectiveResourceId } = useResourceHook<Patient>(patientId);

  /*
  const [id, setId] = useState<string | undefined>(undefined);
  const { patient } = usePatient();

  useEffect(() => {
    const id = patientId || patient?.id;
    if (id) {
      setId(id);
    }
  }, [patientId, patient]);
  */

  return (
    <div
      style={{
        backgroundColor: "white",
      }}
    >
      {!token && effectiveResourceId && (
        <WebSocketChart patientId={effectiveResourceId} />
      )}
      {token && <WebSocketChart token={token} />}
    </div>
  );
}
