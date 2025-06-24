import React from "react";
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
import LogoSVG from "../../../assets/logo.svg";
import styles from "./HeaderDesktop.module.css";
import { Patient, Practitioner } from "fhir/r4";
import { useTranslation } from "react-i18next";
import { isPatient, isAdminOrPractitioner } from "../../../Utils/RolUser";
import HandleResult from "../../../Utils/HandleResult";

interface HeaderDesktopProps {
  user?: Patient | Practitioner;
  selectedItem?: string;
  handleSetLocation: (path: string) => void;
  handleSignOutClick: () => void;
  handleLanguageToggle: () => void;
}

const handleOpenApp = () => {
  /*
  const appUrl = "zoomus://"; // Replace with your custom URL scheme
  //const fallbackUrl = "https://google.cl"; // Replace with your download page URL

  const iframe = document.createElement("iframe");
  iframe.style.display = "none";
  iframe.src = appUrl;

  document.body.appendChild(iframe);\
  */
  HandleResult.showErrorMessage("En construcción, pronto disponible");
};

const HeaderDesktop: React.FC<HeaderDesktopProps> = ({
  user,
  selectedItem,
  handleSetLocation,
  handleSignOutClick,
  handleLanguageToggle,
}) => {
  const { t, i18n } = useTranslation();
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);

  const isPatientUser = isPatient();
  const isAdminOrPractitionerUser = isAdminOrPractitioner();

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleProfileClick = () => {
    alert("Profile clicked");
    handleClose();
  };

  const NavItem = ({
    text,
    href,
    target,
    onClick,
  }: {
    text: string;
    href?: string;
    target?: string;
    onClick?: () => void;
  }) => (
    <Typography
      component={"a"}
      href={href ? href : `/#${text}`}
      variant="h6"
      target={target}
      onClick={onClick ? onClick : () => handleSetLocation(text)}
      sx={{
        cursor: "pointer",
        color: selectedItem === text ? "#344293" : "#2c427e",
        textDecoration: selectedItem === text ? "underline" : "none",
        textDecorationThickness: "0.1em",
        textUnderlineOffset: "0.2em",
        fontWeight: selectedItem === text ? "bold" : "normal",
        fontSize: "11pt",
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
          <Grid container sx={{ paddingLeft: "200px" }}>
            <Grid item xs={2} className={styles.logoContainer}>
              <img
                src={LogoSVG}
                alt="My Virtual Therapist"
                className={styles.logo}
                onClick={() => {
                  if (isAdminOrPractitionerUser) {
                    handleSetLocation(t("header.patients"));
                    window.location.href = "/";
                  }
                  if (isPatientUser) {
                    window.location.href = `/Patient/${localStorage.getItem(
                      "id"
                    )}`;
                  }
                }}
              />
            </Grid>
            <Grid item xs={8.3}>
              <Toolbar className={styles.actionsRow}>
                <Box className={styles.actionButtons}>
                  <Button
                    variant="contained"
                    onClick={handleOpenApp}
                    sx={{ fontWeight: "bold", background: "#2278fe" }}
                  >
                    {t("header.getMVT")}{" "}
                  </Button>
                  <Button
                    variant="contained"
                    onClick={handleLanguageToggle}
                    startIcon={<LanguageIcon />}
                    className={styles.languageButton}
                    sx={{ background: "#2278fe" }}
                  >
                    {i18n.language.toUpperCase()}
                  </Button>
                </Box>
              </Toolbar>
              <Toolbar className={styles.navigationRow}>
                <Box className={styles.navLinks}>
                  {isPatientUser && (
                    <NavItem
                      text={t("header.me")}
                      href={`/Patient/${localStorage.getItem("id")}`}
                      onClick={() => {}}
                    />
                  )}
                  {isAdminOrPractitionerUser && (
                    <NavItem text={t("header.patients")} />
                  )}
                  <NavItem text={t("header.practitioners")} />
                  {isAdminOrPractitionerUser && (
                    <NavItem text={t("header.encounters")} />
                  )}
                  <NavItem
                    text={t("header.contact")}
                    href="https://wa.me/+56931416677"
                    target="_blank"
                    onClick={() => {}}
                  />
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

export default HeaderDesktop;
