//import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";

import { I18nextProvider } from "react-i18next";
import i18n from "./i18n";

import PatientPage from "./Components/patient/PatientPage";
import { Toaster } from "react-hot-toast";

import Header from "./Components/header/Header";
import Footer from "./Components/footer/Footer";
import styles from "./main.module.css";
import { loadUserRoleFromLocalStorage } from "./Utils/RolUser";
import SignInSide from "./Components/SignInSide";

const router = createBrowserRouter([
  {
    path: "/",
    element: <PatientPage />,
  },
  {
    path: "/Patient",
    element: <PatientPage />,
  },
]);

const Layout = () =>
  loadUserRoleFromLocalStorage() ? (
    <div className={styles.layoutContainer}>
      <Header />
      <main className={styles.main}>
        <RouterProvider router={router} />
      </main>
      <Footer />
    </div>
  ) : (
    <SignInSide />
  );

createRoot(document.getElementById("root")!).render(
  <I18nextProvider i18n={i18n}>
    <Toaster />
    <Layout />
  </I18nextProvider>
);
