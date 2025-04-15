import { useEffect, useState } from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { I18nextProvider } from "react-i18next";
import i18n from "./i18n";
import Header from "./Components/header/Header";
import Footer from "./Components/footer/Footer";
import styles from "./main.module.css";
import { loadUserRoleFromLocalStorage } from "./Utils/RolUser";
import SignInSide from "./Components/SignInSide";
import { ResourceProvider } from "./Components/ResourceContext";
import ResourceListPage from "./Components/resource-list/ResourceListPage";
import PatientPage from "./Components/patient/page/PatientPage";
import NotFound from "./Components/not-found/NotFound";
import ConfirmPasswordComponent from "./Components/password/ConfirmPasswordComponent";
import EncounterPage from "./Components/encounter/encounter-page/EncounterPage";

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
    path: "/Encounter/:id",
    element: <EncounterPage />,
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

const AppLayout = () => {
  const queryParams = new URLSearchParams(location.search);
  const token = queryParams.get("token");

  const [openDialog, setOpenDialog] = useState(false);

  useEffect(() => {
    console.log("token:", token);
    setOpenDialog(Boolean(token));
  }, [token]);

  const handleIsOpen = (isOpen: boolean) => {
    setOpenDialog(isOpen);
  };

  return (
    <I18nextProvider i18n={i18n}>
      <Toaster />
      <ResourceProvider>
        {loadUserRoleFromLocalStorage() ? (
          <div className={styles.layoutContainer}>
            <Header />
            <main className={styles.main}>
              <RouterProvider router={router} />
            </main>
            <Footer />
          </div>
        ) : (
          <SignInSide />
        )}
        <ConfirmPasswordComponent
          onOpen={handleIsOpen}
          isOpen={openDialog}
          token={token!}
        />
      </ResourceProvider>
    </I18nextProvider>
  );
};

export default AppLayout;
