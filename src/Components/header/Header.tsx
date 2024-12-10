import { useEffect, useState } from "react";
import { useMediaQuery, useTheme } from "@mui/material";
import HeaderDesktop from "./desktop/HeaderDesktop";
import HeaderMobile from "./mobile/HeaderMobile";
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
  return parseInt(expirationTime, 10) * 1000 < currentTime;
};

const handleLogOut = () => {
  FhirResourceService.clearInstances();
  localStorage.clear();
  window.location.href = "/";
};

const Header = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const { t, i18n } = useTranslation();

  const [user, setUser] = useState<Patient | Practitioner>();
  const [selectedItem, setSelectedItem] = useState<string>();

  const getUser = async () => {
    const id = localStorage.getItem("id");
    if (!id) return;
    let user: Patient | Practitioner | undefined;
    const role = loadUserRoleFromLocalStorage();
    if (role === "Patient") {
      const fhirResource = FhirResourceService.getInstance<Patient>("Patient");
      const response = await fhirResource.getById(id);
      if (response.success) user = response.data;
    } else {
      const fhirResource =
        FhirResourceService.getInstance<Practitioner>("Practitioner");

      const response = await fhirResource.getById(id);
      if (response.success) user = response.data;
    }
    setUser(user);
    localStorage.setItem("user", JSON.stringify(user));
  };

  const handleSetLocation = (path: string) => {
    localStorage.setItem("location", path);
    setSelectedItem(path);
  };

  useEffect(() => {
    getUser();
  }, []);

  useEffect(() => {
    const location = localStorage.getItem("location");
    switch (location) {
      case "/Patients":
        setSelectedItem(t("header.patients"));
        break;
      case "/Practitioners":
        setSelectedItem(t("header.practitioners"));
        break;
      // Add more cases as needed for other tabs
      default:
        setSelectedItem(t("header.patients"));
    }
  }, [i18n.language, t]);

  const handleSignOutClick = () => {
    handleLogOut();
  };

  const handleLanguageToggle = () => {
    const newLang = i18n.language === "es" ? "en" : "es";
    i18n.changeLanguage(newLang);
  };

  useEffect(() => {
    const checkTokenExpiration = () => {
      if (isTokenExpired()) {
        alert(t("header.sessionExpired"));
        handleLogOut();
      }
    };

    checkTokenExpiration();
    const intervalId = setInterval(checkTokenExpiration, 60000);

    return () => clearInterval(intervalId);
  }, []);

  return isMobile ? (
    <HeaderMobile
      user={user}
      selectedItem={selectedItem}
      handleSetLocation={handleSetLocation}
      handleSignOutClick={handleSignOutClick}
      handleLanguageToggle={handleLanguageToggle}
    />
  ) : (
    <HeaderDesktop
      user={user}
      selectedItem={selectedItem}
      handleSetLocation={handleSetLocation}
      handleSignOutClick={handleSignOutClick}
      handleLanguageToggle={handleLanguageToggle}
    />
  );
};

export default Header;
