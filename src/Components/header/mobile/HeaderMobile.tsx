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
  Drawer,
  IconButton,
  List,
  ListItem,
  ListItemText,
} from "@mui/material";
import LanguageIcon from "@mui/icons-material/Language";
import MenuIcon from "@mui/icons-material/Menu";
import LogoSVG from "../../../assets/logo.svg";
import styles from "./HeaderMobile.module.css";
import { Patient, Practitioner } from "fhir/r4";
import { useTranslation } from "react-i18next";

interface HeaderMobileProps {
  user?: Patient | Practitioner;
  selectedItem?: string;
  handleSetLocation: (path: string) => void;
  handleSignOutClick: () => void;
  handleLanguageToggle: () => void;
}

const HeaderMobile: React.FC<HeaderMobileProps> = ({
  user,
  selectedItem,
  handleSetLocation,
  handleSignOutClick,
  handleLanguageToggle,
}) => {
  const { t, i18n } = useTranslation();
  const [drawerOpen, setDrawerOpen] = React.useState(false);

  const NavItem = ({ text }: { text: string }) => (
    <Typography
      component={"a"}
      href={`/#${text}`}
      variant="h6"
      onClick={() => handleSetLocation(text)}
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
          sx={{ backgroundColor: "white", color: "black", height: 64 }}
        >
          <Grid container sx={{ paddingLeft: 2, paddingRight: 2 }}>
            <Grid item xs={5} className={styles.logoContainer}>
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
            <Grid item xs={6}>
              <Toolbar className={styles.actionsRow}>
                <Box className={styles.actionButtons}>
                  <Button variant="contained" size="small">
                    {t("header.getMVT")}
                  </Button>
                </Box>
              </Toolbar>
            </Grid>
            <Grid item xs={1}>
              <Toolbar className={styles.navigationRow}>
                <IconButton
                  edge="end"
                  color="inherit"
                  aria-label="menu"
                  onClick={() => setDrawerOpen(true)}
                >
                  <MenuIcon />
                </IconButton>
              </Toolbar>
            </Grid>
          </Grid>
        </AppBar>
        <Drawer
          anchor="right"
          open={drawerOpen}
          onClose={() => setDrawerOpen(false)}
        >
          <Box
            sx={{ width: 250 }}
            role="presentation"
            onClick={() => setDrawerOpen(false)}
            onKeyDown={() => setDrawerOpen(false)}
          >
            <List>
              <ListItem>
                <ListItemAvatar className={styles.avatarWrapper}>
                  <Avatar
                    src={
                      user?.photo?.[0]?.data
                        ? `data:${user?.photo[0].contentType};base64,${user?.photo[0].data}`
                        : user?.photo?.[0]?.url || undefined
                    }
                    className={styles.circularContainer}
                  />
                </ListItemAvatar>
                <ListItemText primary={user?.name?.[0]?.text || "User"} />
              </ListItem>

              <ListItem>
                <NavItem text={t("header.patients")} />
              </ListItem>
              <ListItem>
                <NavItem text={t("header.practitioners")} />
              </ListItem>
              <ListItem>
                <NavItem text={t("header.encounters")} />
              </ListItem>
              <ListItem>
                <NavItem text={t("header.contact")} />
              </ListItem>
              <ListItem>
                <Button
                  variant="contained"
                  size="small"
                  onClick={handleSignOutClick}
                >
                  {t("header.signOut")}
                </Button>
                <Button
                  variant="contained"
                  size="small"
                  onClick={handleLanguageToggle}
                  startIcon={<LanguageIcon />}
                  className={styles.languageButton}
                >
                  {i18n.language.toUpperCase()}
                </Button>
              </ListItem>
            </List>
          </Box>
        </Drawer>
      </Box>
    </header>
  );
};

export default HeaderMobile;
