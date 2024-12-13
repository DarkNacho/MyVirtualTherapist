import { useParams } from "react-router-dom";
import WebSocketChart from "../../charts/WebSocketChart";

//import { usePatient } from "../PatientContext";
import { usePatientHook } from "./PatientHook";

export default function PatientSensorTab({
  patientId,
}: {
  patientId?: string;
}) {
  const { token } = useParams();
  const { effectivePatientId } = usePatientHook(patientId);

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
        marginTop: "100px",
      }}
    >
      {!token && <WebSocketChart patientId={effectivePatientId} />}
      {token && <WebSocketChart token={token} />}
    </div>
  );
}
