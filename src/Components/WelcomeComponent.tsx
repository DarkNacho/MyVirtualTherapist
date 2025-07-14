import React, { useState, useEffect } from "react";
import { Box, Typography, Paper } from "@mui/material";

import img1 from "../assets/PLACEHOLDERS/1.png";
import img2 from "../assets/PLACEHOLDERS/2.png";
import img3 from "../assets/PLACEHOLDERS/3.png";
import img4 from "../assets/PLACEHOLDERS/4.png";
import img5 from "../assets/PLACEHOLDERS/5.png";
import { useTranslation } from "react-i18next";

interface WelcomeComponentProps {
  userName: string;
}

const images = [img1, img2, img3, img4, img5];

const WelcomeComponent: React.FC<WelcomeComponentProps> = ({ userName }) => {
  const { t } = useTranslation();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // Update image every 30 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, 5000);
    return () => clearInterval(interval); // Cleanup on unmount
  }, [images.length]);

  return (
    <Paper
      elevation={3}
      sx={{
        position: "relative",
        borderRadius: 2,
        padding: 2,
        overflow: "hidden",
        height: "100%",
        backgroundColor: "white", // Ensure the background is white
      }}
    >
      {/* Image Background */}
      {images.length > 0 && (
        <Box
          component="img"
          src={images[currentImageIndex]}
          alt="background img"
          sx={{
            borderRadius: 2,
            width: "calc(100% - 46px)", // Adjust width to account for padding
            height: "calc(100% - 46px)", // Adjust height to account for padding
            objectFit: "cover",
            position: "absolute", // Position absolutely within Paper
            top: "23px", // Adjust top position to account for padding
            left: "23px", // Adjust left position to account for padding
          }}
        />
      )}

      {/* Overlay text */}
      <Box
        sx={{
          position: "absolute",
          top: "23px", // Adjust top position to account for padding
          right: "23px", // Adjust right position to account for padding
          backgroundColor: "#2278fe",
          borderTopRightRadius: 8,
          borderBottomLeftRadius: 15,
          padding: "4px 8px",
        }}
      >
        <Typography variant="body1" color="white">
          {t("welcome")} <span>{userName}</span>
        </Typography>
      </Box>
    </Paper>
  );
};

export default WelcomeComponent;
