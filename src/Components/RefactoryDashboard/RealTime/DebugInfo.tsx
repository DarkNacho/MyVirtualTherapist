import React from "react";
import { Box, Typography } from "@mui/material";

interface DebugInfoProps {
  sensorDataByDevice: any;
}

const DebugInfo: React.FC<DebugInfoProps> = ({ sensorDataByDevice }) => {
  if (!import.meta.env.DEV) return null;

  return (
    <Box
      sx={{
        p: 2,
        bgcolor: "#f5f5f5",
        borderRadius: 1,
        mb: 2,
        overflow: "auto",
      }}
    >
      <Typography variant="subtitle2" sx={{ mb: 1 }}>
        Debug Data Structure:
      </Typography>

      {Object.keys(sensorDataByDevice || {}).map((deviceName) => (
        <Box key={deviceName} sx={{ mb: 2 }}>
          <Typography variant="body2" fontWeight="bold">
            Device: {deviceName}
          </Typography>

          <Box component="ul" sx={{ m: 0, pl: 2 }}>
            {Object.keys(sensorDataByDevice[deviceName] || {}).map(
              (sensorName) => (
                <Box component="li" key={sensorName} sx={{ mb: 1 }}>
                  <Typography variant="caption" display="block">
                    Sensor: {sensorName}
                  </Typography>
                  <Typography variant="caption" display="block" sx={{ ml: 2 }}>
                    Has data:{" "}
                    {sensorDataByDevice[deviceName][sensorName]?.data
                      ? "Yes"
                      : "No"}
                  </Typography>
                  <Typography variant="caption" display="block" sx={{ ml: 2 }}>
                    Data count:{" "}
                    {sensorDataByDevice[deviceName][sensorName]?.data?.length ||
                      0}
                  </Typography>
                </Box>
              )
            )}
          </Box>
        </Box>
      ))}
    </Box>
  );
};

export default DebugInfo;
