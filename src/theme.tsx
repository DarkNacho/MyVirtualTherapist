import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  typography: {
    fontFamily: "Manrope, sans-serif",
  },
  palette: {
    primary: {
      main: "#5988ff",
    },
  },
  components: {
    MuiDialog: {
      styleOverrides: {
        root: {
          "& .MuiBackdrop-root": {
            backgroundColor: "rgba(45, 125, 252, 0.5)", // Custom backdrop color
          },
        },
      },
    },
  },
});

export default theme;
