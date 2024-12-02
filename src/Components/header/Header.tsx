import React, { useState } from "react";
import {
  AppBar,
  Toolbar,
  Button,
  Box,
  Grid,
  Typography,
  ListItemAvatar,
  Avatar,
} from "@mui/material";
import LanguageIcon from "@mui/icons-material/Language";
import LogoSVG from "../../assets/logo.svg";
import styles from "./Header.module.css";

interface HeaderProps {
  onLanguageChange?: () => void;
  onMenuClick?: () => void;
}

const Header: React.FC<HeaderProps> = ({ onLanguageChange }) => {
  const [language, setLanguage] = useState<"ES" | "EN">("ES");

  const handleLanguageToggle = () => {
    const newLang = language === "ES" ? "EN" : "ES";
    setLanguage(newLang);
    if (onLanguageChange) {
      onLanguageChange();
    }
  };

  const [selectedItem, setSelectedItem] = useState<string>("PACIENTES");

  const NavItem = ({ text }: { text: string }) => (
    <Typography
      variant="h6"
      onClick={() => setSelectedItem(text)}
      sx={{
        cursor: "pointer",
        color: selectedItem === text ? "blue" : "black",
        textDecoration: selectedItem === text ? "underline" : "none",
        textDecorationThickness: "0.1em",
        textUnderlineOffset: "0.2em",
        "&:hover": {
          textDecoration: "underline",
          textDecorationThickness: "0.1em",
          textUnderlineOffset: "0.2em",
        },
      }}
    >
      {text}
    </Typography>
  );

  return (
    <header className={styles.header}>
      <Box className={styles.root}>
        <AppBar
          position="static"
          sx={{ backgroundColor: "white", color: "black" }}
        >
          <Grid container sx={{ paddingLeft: 20 }}>
            {/* Left Column - Logo (spans 2 rows) */}
            <Grid item xs={2} className={styles.logoContainer}>
              <img
                src={LogoSVG}
                alt="My Virtual Therapist"
                className={styles.logo}
              />
            </Grid>
            {/* Right Column - 2 rows */}
            <Grid item xs={8}>
              {/* Top Row - Actions */}
              <Toolbar className={styles.actionsRow}>
                <Box className={styles.actionButtons}>
                  <Button variant="contained">CONSIGUE MVT Y SMART MESK</Button>
                  <Button
                    variant="contained"
                    onClick={handleLanguageToggle}
                    startIcon={<LanguageIcon />}
                    className={styles.languageButton}
                  >
                    {language}
                  </Button>
                </Box>
              </Toolbar>

              {/* Bottom Row - Navigation */}
              <Toolbar className={styles.navigationRow}>
                <Box className={styles.navLinks}>
                  <NavItem text="PACIENTES" />
                  <NavItem text="PROFESIONALES" />
                  <NavItem text="ENCUENTROS" />
                  <NavItem text="CONTACTO" />
                </Box>
              </Toolbar>
            </Grid>
            <Grid item xs={1}>
              <ListItemAvatar className={styles.avatarWrapper}>
                <Avatar
                  src={`https://robohash.org/1.png`}
                  className={styles.circularContainer}
                />
              </ListItemAvatar>
            </Grid>
          </Grid>
        </AppBar>
      </Box>
    </header>
  );
};

export default Header;
