import React, { useState, useEffect } from "react";
import { Box, Typography, Paper } from "@mui/material";
import { useNavigate } from "react-router-dom";

import img1 from "../assets/PLACEHOLDERS/1.png";
import img2 from "../assets/PLACEHOLDERS/2.png";
import img3 from "../assets/PLACEHOLDERS/3.png";
import img4 from "../assets/PLACEHOLDERS/4.png";
import img5 from "../assets/PLACEHOLDERS/5.png";
interface WelcomeComponentProps {
  userName: string;
}

const images = [img1, img2, img3, img4, img5];

const WelcomeComponent: React.FC<WelcomeComponentProps> = ({ userName }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const navigate = useNavigate();

  // Update image every 30 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, 5000);
    return () => clearInterval(interval); // Cleanup on unmount
  }, [images.length]);

  // Event handlers for navigation
  const handleImageClick = () => {
    navigate("/news");
  };

  const handleTextClick = () => {
    navigate("/profile");
  };

  return (
    <Paper
      elevation={3}
      sx={{
        position: "relative",
        borderRadius: 2,
        padding: 2,
        overflow: "hidden",
        height: "100%",
      }}
    >
      {/* Image Background */}
      {images.length > 0 && (
        <Box
          component="img"
          src={images[currentImageIndex]}
          alt="background img"
          onClick={handleImageClick}
          sx={{
            borderRadius: 2,
            width: "100%",
            height: "100%",
            objectFit: "cover",
            position: "absolute", // Position absolutely within Paper
            top: 0,
            left: 0,
            cursor: "pointer",
          }}
        />
      )}

      {/* Overlay text */}
      <Box
        sx={{
          position: "absolute",
          top: 0,
          right: 0,
          backgroundColor: "#287cfc",
          borderTopRightRadius: 2,
          borderBottomLeftRadius: 15,
          padding: "4px 8px",
          cursor: "pointer",
        }}
        onClick={handleTextClick}
      >
        <Typography variant="body1" color="white">
          BIENVENIDO, <span>{userName}</span>
        </Typography>
      </Box>
    </Paper>
  );
};

export default WelcomeComponent;
