import React from "react";
import { Typography, Link } from "@mui/material";
import styles from "./Footer.module.css";

const Footer: React.FC = () => {
  return (
    <footer className={styles.footer}>
      <div className={styles.content}>
        <Typography variant="body2" className={styles.copyright}>
          © Lab Control Motor Humano - My Virtual Therapist - Smart Mesck
        </Typography>
        <Link href="#" className={styles.privacyLink}>
          Políticas de privacidad
        </Link>
      </div>
    </footer>
  );
};

export default Footer;
