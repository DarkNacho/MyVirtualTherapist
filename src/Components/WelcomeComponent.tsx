import React, { useState, useEffect } from "react";
import { Box, Typography, Paper } from "@mui/material";
import { useNavigate } from "react-router-dom";

interface WelcomeComponentProps {
  userName: string;
}

const images = [
  "https://www.firstbenefits.org/wp-content/uploads/2017/10/placeholder-1024x1024.png",
  "https://t4.ftcdn.net/jpg/05/71/83/47/360_F_571834789_ujYbUnH190iUokdDhZq7GXeTBRgqYVwa.jpg",
];

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
          top: 16,
          right: 16,
          backgroundColor: "rgba(255, 255, 255, 0.8)",
          borderRadius: 1,
          padding: "4px 8px",
          cursor: "pointer",
        }}
        onClick={handleTextClick}
      >
        <Typography variant="body1" color="primary">
          BIENVENIDO, <span style={{ fontWeight: "bold" }}>{userName}</span>
        </Typography>
      </Box>
    </Paper>
  );
};

export default WelcomeComponent;
