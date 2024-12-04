import React from "react";
import { Typography, Link } from "@mui/material";
import styles from "./Footer.module.css";
import { useTranslation } from "react-i18next";

const Footer: React.FC = () => {
  const { t } = useTranslation();
  return (
    <footer className={styles.footer}>
      <div className={styles.content}>
        <Typography variant="body2" className={styles.copyright}>
          {t("footer.copyright")}
        </Typography>
        <Link href="#" className={styles.privacyLink}>
          {t("footer.privacyPolicy")}
        </Link>
      </div>
    </footer>
  );
};

export default Footer;
