//import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";

import { I18nextProvider } from "react-i18next";
import i18n from "./i18n";

import { Toaster } from "react-hot-toast";

import Header from "./Components/header/Header";
import Footer from "./Components/footer/Footer";
import styles from "./main.module.css";
import { loadUserRoleFromLocalStorage } from "./Utils/RolUser";
import SignInSide from "./Components/SignInSide";
import NotFound from "./Components/not-found/NotFound";
import PatientPage from "./Components/patient/page/PatientPage";
import { ResourceProvider } from "./Components/ResourceContext";
import ResourceListPage from "./Components/resource-list/ResourceListPage";

const router = createBrowserRouter([
  {
    path: "/",
    element: <ResourceListPage />,
  },

  {
    path: "/Patient/:id",
    element: <PatientPage />,
  },

  {
    path: "/list",
    element: <ResourceListPage />,
  },
  {
    path: "/NotFound",
    element: <NotFound />,
  },
  {
    path: "*",
    element: <NotFound />,
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
    <ResourceProvider>
      <Layout />
    </ResourceProvider>
  </I18nextProvider>
);
