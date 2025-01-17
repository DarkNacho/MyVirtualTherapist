import { Link } from "react-router-dom";
import styles from "./style.module.css";
import SadFaceSVG from "../../assets/SadFace.svg";
import { useTranslation } from "react-i18next";

export default function NotFound() {
  const { t } = useTranslation();

  return (
    <div className={styles.container}>
      <img
        src={SadFaceSVG}
        alt={t("notFound.sadFaceAlt")}
        className={styles.sadFace}
      />
      <h1 className={styles.header}>{t("notFound.error404")}</h1>
      <div className={styles.messageContainer}>
        <p className={styles.paragraph}>{t("notFound.nothingHere")}</p>
        <p className={styles.paragraph2}>{t("notFound.linkNotCorrect")}</p>
      </div>
      <Link to={`/#${t("header.patients")}`} className={styles.link}>
        {t("notFound.backToHome")}
      </Link>
    </div>
  );
}
