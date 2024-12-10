import React from "react";
import { Typography, Link, useMediaQuery, useTheme } from "@mui/material";
import styles from "./Footer.module.css";
import { useTranslation } from "react-i18next";

const Footer: React.FC = () => {
  const { t } = useTranslation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  return (
    <footer className={styles.footer}>
      <div className={styles.content}>
        <Typography
          variant="body2"
          fontSize={isMobile ? 12 : 16}
          className={styles.copyright}
        >
          {t("footer.copyright")}
        </Typography>
        <Link
          href="#"
          fontSize={isMobile ? 12 : 16}
          className={styles.privacyLink}
        >
          {t("footer.privacyPolicy")}
        </Link>
      </div>
    </footer>
  );
};

export default Footer;
