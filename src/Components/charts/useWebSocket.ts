import { useState, useEffect } from "react";
import { SensorData, SensorDataByDevice } from "../../Models/SensorModel";

export default function useWebSocket(
  uri: string
): [SensorDataByDevice, boolean] {
  const [sensorDataByDevice, setSensorDataByDevice] =
    useState<SensorDataByDevice>({});
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    const socket = new WebSocket(uri);

    socket.onopen = () => {
      console.log("WebSocket connected");
      setIsConnected(true);
    };

    socket.onmessage = (event) => {
      try {
        const data: SensorData = JSON.parse(event.data);
        console.log("Dato recibido:", data);

        const deviceKey = data.device;
        const sensorKey = data.sensor_type;

        setSensorDataByDevice((prevData) => {
          const existingSensorData = prevData[deviceKey]?.[sensorKey] || {
            data: [],
            stats: { minValue: Infinity, maxValue: -Infinity, avgValue: 0 },
          };

          const newData = [...existingSensorData.data, data];
          const newStats = {
            minValue: Math.min(existingSensorData.stats.minValue, data.value),
            maxValue: Math.max(existingSensorData.stats.maxValue, data.value),
            avgValue:
              newData.reduce((sum, item) => sum + item.value, 0) /
              newData.length,
          };

          return {
            ...prevData,
            [deviceKey]: {
              ...prevData[deviceKey],
              [sensorKey]: {
                data: newData,
                stats: newStats,
              },
            },
          };
        });
      } catch (error) {
        console.error("Error parsing JSON data:", error);
      }
    };

    socket.onclose = () => {
      console.log("WebSocket disconnected");
      setIsConnected(false);
    };

    return () => {
      console.log("Cleaning up WebSocket");
      if (
        socket.readyState === WebSocket.OPEN ||
        socket.readyState === WebSocket.CONNECTING
      ) {
        socket.close();
      }
    };
  }, [uri]);

  return [sensorDataByDevice, isConnected];
}
