//import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";

import App from "./App";
import PatientPage from "./Components/patient/PatientPage";
import { Toaster } from "react-hot-toast";

import Header from "./Components/header/Header";
import Footer from "./Components/footer/Footer";
import styles from "./main.module.css";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
  },
  {
    path: "/Patient",
    element: <PatientPage />,
  },
]);

const Layout = () => (
  <div className={styles.layoutContainer}>
    <Header />
    <main className={styles.main}>
      <RouterProvider router={router} />
    </main>
    <Footer />
  </div>
);

createRoot(document.getElementById("root")!).render(
  <>
    <Toaster />
    <Layout />
  </>
);
