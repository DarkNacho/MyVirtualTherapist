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

interface HeaderDesktopProps {
  user?: Patient | Practitioner;
  selectedItem?: string;
  handleSetLocation: (path: string) => void;
  handleSignOutClick: () => void;
  handleLanguageToggle: () => void;
}

const handleOpenApp = () => {
  const appUrl = "zoomus://"; // Replace with your custom URL scheme
  //const fallbackUrl = "https://google.cl"; // Replace with your download page URL

  const iframe = document.createElement("iframe");
  iframe.style.display = "none";
  iframe.src = appUrl;

  document.body.appendChild(iframe);
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

  const NavItem = ({ text, href }: { text: string; href?: string }) => (
    <Typography
      component={"a"}
      href={href ? href : `/#${text}`}
      variant="h6"
      target={href ? "_blank" : undefined}
      onClick={href ? undefined : () => handleSetLocation(text)}
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
            <Grid item xs={2} className={styles.logoContainer}>
              <img
                src={LogoSVG}
                alt="My Virtual Therapist"
                className={styles.logo}
                onClick={() => {
                  handleSetLocation(t("header.patients"));
                  window.location.href = "/";
                }}
              />
            </Grid>
            <Grid item xs={8}>
              <Toolbar className={styles.actionsRow}>
                <Box className={styles.actionButtons}>
                  <Button variant="contained" onClick={handleOpenApp}>
                    {t("header.getMVT")}{" "}
                  </Button>
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
              <Toolbar className={styles.navigationRow}>
                <Box className={styles.navLinks}>
                  <NavItem text={t("header.patients")} />
                  <NavItem text={t("header.practitioners")} />
                  <NavItem text={t("header.encounters")} />
                  <NavItem
                    text={t("header.contact")}
                    href="https://wa.me/+56931416677"
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
