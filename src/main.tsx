//import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import AppLayout from "./AppLayout";
import "./main.module.css";
import theme from "./theme";
import { ThemeProvider } from "@mui/material/styles";

createRoot(document.getElementById("root")!).render(
  <ThemeProvider theme={theme}>
    <AppLayout />
  </ThemeProvider>
);
