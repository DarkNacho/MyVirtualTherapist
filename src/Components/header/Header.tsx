import React, { useEffect, useState } from "react";
import {
  AppBar,
  Toolbar,
  Button,
  Box,
  Grid,
  Typography,
  ListItemAvatar,
  Avatar,
  Menu,
  MenuItem,
} from "@mui/material";
import LanguageIcon from "@mui/icons-material/Language";
import LogoSVG from "../../assets/logo.svg";
import styles from "./Header.module.css";
import { Patient, Practitioner } from "fhir/r4";
import { loadUserRoleFromLocalStorage } from "../../Utils/RolUser";
import FhirResourceService from "../../Services/FhirService";
import { useTranslation } from "react-i18next";

const isTokenExpired = () => {
  const expirationTime = localStorage.getItem("tokenExpiration");
  if (!expirationTime) {
    return true;
  }

  const currentTime = new Date().getTime();
  console.log("current", currentTime);
  console.log("expiration", parseInt(expirationTime, 10));
  return parseInt(expirationTime, 10) * 1000 < currentTime;
};

const handleLogOut = () => {
  localStorage.clear();
  window.location.href = "/";
};

const Header = () => {
  const { t, i18n } = useTranslation();

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [user, setUser] = useState<Patient | Practitioner>();
  const [selectedItem, setSelectedItem] = useState<string>();

  const getUser = async () => {
    const id = localStorage.getItem("id");
    console.log("id", id);
    if (!id) return;
    let user: Patient | Practitioner | undefined;
    const role = loadUserRoleFromLocalStorage();
    if (role === "Patient") {
      const fhirResource = new FhirResourceService<Patient>("Patient");
      const response = await fhirResource.getById(id);
      console.log("response", response);
      if (response.success) user = response.data;
    } else {
      const fhirResource = new FhirResourceService<Practitioner>(
        "Practitioner"
      );

      const response = await fhirResource.getById(id);
      console.log("response", response);
      if (response.success) user = response.data;
    }
    setUser(user);
    localStorage.setItem("user", JSON.stringify(user));
  };

  useEffect(() => {
    getUser();
  }, []);

  useEffect(() => {
    setSelectedItem(t("header.patients"));
  }, [i18n.language, t]);

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleProfileClick = () => {
    // Handle profile click
    alert("Profile clicked");
    console.log("Profile clicked");
    handleClose();
  };

  const handleSignOutClick = () => {
    // Handle sign out click
    handleLogOut();
    console.log("Sign out clicked");
    handleClose();
  };

  const handleLanguageToggle = () => {
    const newLang = i18n.language === "es" ? "en" : "es";
    i18n.changeLanguage(newLang);
  };

  useEffect(() => {
    const checkTokenExpiration = () => {
      if (isTokenExpired()) {
        alert(t("header.sessionExpired"));
        console.log("token expired...");
        handleLogOut();
      } else {
        console.log("token not expired...");
      }
    };

    // Check token expiration immediately
    checkTokenExpiration();

    // Set up an interval to check token expiration every minute
    const intervalId = setInterval(checkTokenExpiration, 60000); // 60000 ms = 1 minute

    // Clear the interval on component unmount
    return () => clearInterval(intervalId);
  }, []);

  const NavItem = ({ text }: { text: string }) => (
    <Typography
      variant="h6"
      onClick={() => setSelectedItem(text)}
      sx={{
        cursor: "pointer",
        color: selectedItem === text ? "#4864cc" : "#2c427e",
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
                  <Button variant="contained">{t("header.getMVT")}</Button>
                  <Button
                    variant="contained"
                    onClick={handleLanguageToggle}
                    startIcon={<LanguageIcon />}
                    className={styles.languageButton}
                  >
                    {i18n.language.toUpperCase()}
                  </Button>
                </Box>
              </Toolbar>

              {/* Bottom Row - Navigation */}
              <Toolbar className={styles.navigationRow}>
                <Box className={styles.navLinks}>
                  <NavItem text={t("header.patients")} />
                  <NavItem text={t("header.practitioners")} />
                  <NavItem text={t("header.encounters")} />
                  <NavItem text={t("header.contact")} />
                </Box>
              </Toolbar>
            </Grid>
            <Grid item xs={1}>
              <ListItemAvatar className={styles.avatarWrapper}>
                <Avatar
                  src={
                    user?.photo?.[0]?.data
                      ? `data:${user?.photo[0].contentType};base64,${user?.photo[0].data}`
                      : user?.photo?.[0]?.url || undefined
                  }
                  className={styles.circularContainer}
                  onClick={handleClick}
                />
                <Menu
                  anchorEl={anchorEl}
                  open={Boolean(anchorEl)}
                  onClose={handleClose}
                >
                  <MenuItem onClick={handleProfileClick}>
                    {t("header.myProfile")}
                  </MenuItem>
                  <MenuItem onClick={handleSignOutClick}>
                    {t("header.signOut")}
                  </MenuItem>
                </Menu>
              </ListItemAvatar>
            </Grid>
          </Grid>
        </AppBar>
      </Box>
    </header>
  );
};

export default Header;
