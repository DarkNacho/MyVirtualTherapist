import { useState, useEffect, useRef } from "react";

// Type for the sensor data expected from WebSocket
interface SensorDataPoint {
  timestamp_epoch: number;
  timestamp_millis: number;
  value: number;
}

interface SensorInfo {
  data: SensorDataPoint[];
  stats?: {
    minValue: number;
    maxValue: number;
    avgValue: number;
  };
}

export interface SensorDataByDevice {
  [deviceName: string]: {
    [sensorType: string]: SensorInfo;
  };
}

// Maximum data points to keep for each sensor
const MAX_DATA_POINTS = 250;

/**
 * A custom hook that connects to a WebSocket and throttles state updates
 * for better performance with real-time data.
 *
 * @param uri WebSocket URI to connect to
 * @param updateInterval Throttle interval in milliseconds
 * @returns [SensorDataByDevice, isConnected]
 */
export default function useThrottledWebSocket(
  uri: string,
  updateInterval: number = 500
): [SensorDataByDevice, boolean] {
  const [sensorDataByDevice, setSensorDataByDevice] =
    useState<SensorDataByDevice>({});
  const [isConnected, setIsConnected] = useState(false);

  // Use refs to store pending updates without triggering re-renders
  const pendingDataRef = useRef<SensorDataByDevice>({});
  const socketRef = useRef<WebSocket | null>(null);
  const timerRef = useRef<number | null>(null);

  useEffect(() => {
    // Clean function to properly clean up resources
    const cleanUp = () => {
      if (timerRef.current) {
        window.clearInterval(timerRef.current);
        timerRef.current = null;
      }

      if (
        socketRef.current &&
        (socketRef.current.readyState === WebSocket.OPEN ||
          socketRef.current.readyState === WebSocket.CONNECTING)
      ) {
        socketRef.current.close();
        socketRef.current = null;
      }
    };

    // Clean up previous connection if exists
    cleanUp();

    // Reset connection state
    setIsConnected(false);

    // Apply pending updates to state
    const processUpdate = () => {
      setSensorDataByDevice((current) => {
        // No pending updates, return current state
        if (Object.keys(pendingDataRef.current).length === 0) {
          return current;
        }

        // Create a new object to avoid mutating current state
        const newData = { ...current };

        // Process each device in the pending updates
        Object.keys(pendingDataRef.current).forEach((deviceKey) => {
          if (!newData[deviceKey]) newData[deviceKey] = {};

          // Process each sensor for this device
          Object.keys(pendingDataRef.current[deviceKey]).forEach(
            (sensorKey) => {
              const existingData = newData[deviceKey][sensorKey]?.data || [];
              const newItems =
                pendingDataRef.current[deviceKey][sensorKey]?.data || [];

              // Combine existing data with new items, limiting to MAX_DATA_POINTS
              const combinedData = [...existingData, ...newItems].slice(
                -MAX_DATA_POINTS
              );

              // Update the data for this sensor
              newData[deviceKey][sensorKey] = {
                data: combinedData,
                // Calculate basic statistics for the data if needed
                stats:
                  combinedData.length > 0
                    ? {
                        minValue: Math.min(...combinedData.map((d) => d.value)),
                        maxValue: Math.max(...combinedData.map((d) => d.value)),
                        avgValue:
                          combinedData.reduce((sum, d) => sum + d.value, 0) /
                          combinedData.length,
                      }
                    : undefined,
              };
            }
          );
        });

        // Clear pending updates
        pendingDataRef.current = {};

        return newData;
      });
    };

    // Create and configure WebSocket
    const socket = new WebSocket(uri);
    socketRef.current = socket;

    socket.onopen = () => {
      setIsConnected(true);

      // Start periodic updates
      timerRef.current = window.setInterval(processUpdate, updateInterval);
    };

    socket.onclose = () => {
      setIsConnected(false);
      if (timerRef.current) {
        window.clearInterval(timerRef.current);
        timerRef.current = null;
      }
    };

    socket.onerror = (error) => {
      if (import.meta.env.DEV) {
        console.error("WebSocket error:", error);
      }
    };

    socket.onmessage = (event) => {
      try {
        const parsedData = JSON.parse(event.data);

        // Handle the data format from the server
        if (parsedData && parsedData.device && parsedData.sensor_type) {
          const deviceKey = parsedData.device;
          const sensorKey = parsedData.sensor_type;

          // Initialize device and sensor in pending data if needed
          if (!pendingDataRef.current[deviceKey]) {
            pendingDataRef.current[deviceKey] = {};
          }

          if (!pendingDataRef.current[deviceKey][sensorKey]) {
            pendingDataRef.current[deviceKey][sensorKey] = { data: [] };
          }

          // Add the new data point
          pendingDataRef.current[deviceKey][sensorKey].data.push(parsedData);
        }
      } catch (error) {
        if (import.meta.env.DEV) {
          console.error("Error parsing WebSocket message:", error);
        }
      }
    };

    // Clean up when component unmounts or URI changes
    return cleanUp;
  }, [uri, updateInterval]);

  return [sensorDataByDevice, isConnected];
}
