import React, { useState } from "react";
import {
  Box,
  Typography,
  TextField,
  InputAdornment,
  IconButton,
  Button,
  Paper,
  Popover,
} from "@mui/material";
import { Search, Add, FilterList } from "@mui/icons-material";
import { useTranslation } from "react-i18next";
import { SearchParams } from "fhir-kit-client";

export default function PatientSearchComponent({
  defaultSearchParam,
  handleAddPatient,
  setSearchParam,
}: {
  defaultSearchParam?: SearchParams;
  handleAddPatient: () => void;
  setSearchParam: React.Dispatch<
    React.SetStateAction<SearchParams | undefined>
  >;
}) {
  const { t } = useTranslation();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [rut, setRut] = useState("");
  const [email, setEmail] = useState("");

  const handleFilterClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleSearch = () => {
    console.log("Buscar por nombre:", name);
    console.log("Buscar por teléfono:", phone);
    console.log("Buscar por RUT:", rut);
    console.log("Buscar por correo:", email);

    const searchParams: SearchParams = { ...defaultSearchParam };

    if (name) {
      searchParams.name = name;
    }
    if (phone) {
      searchParams.telecom = `phone|${phone}`;
    }
    if (rut) {
      searchParams.identifier = `RUT|${rut}`;
    }
    if (email) {
      searchParams.telecom = `email|${email}`;
    }

    setSearchParam(searchParams);
  };

  const open = Boolean(anchorEl);
  const id = open ? "simple-popover" : undefined;

  return (
    <Paper
      elevation={3}
      sx={{
        padding: 2,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        flexDirection: "row",
        borderRadius: 2,
        margin: "auto",
      }}
    >
      <Box sx={{ flex: 1, display: "flex", flexDirection: "column", gap: 1 }}>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <Typography
            variant="h6"
            color="primary"
            sx={{
              fontWeight: "bold",
              textDecoration: "underline",
              textDecorationThickness: "0.1em",
              textUnderlineOffset: "0.2em",
            }}
          >
            {t("patientSearchComponent.patients")}
          </Typography>
          <IconButton color="primary" onClick={handleFilterClick}>
            <FilterList />
          </IconButton>
        </Box>

        <TextField
          variant="outlined"
          placeholder={t("patientSearchComponent.searchPatient")}
          size="small"
          fullWidth
          value={name}
          onChange={(e) => setName(e.target.value)}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton onClick={handleSearch}>
                  <Search />
                </IconButton>
              </InputAdornment>
            ),
          }}
        />
      </Box>

      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          height: "100%",
        }}
      >
        <Button
          variant="contained"
          onClick={handleAddPatient}
          sx={{
            textTransform: "none",
            borderRadius: 2,
            paddingLeft: 3,
            paddingRight: 0,
            fontWeight: "bold",
            height: "70px",
            marginLeft: 2,
            whiteSpace: "pre-line",
            backgroundColor: "white",
            color: "primary.main",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            border: "2px solid",
            borderColor: "primary.main",
          }}
        >
          {t("patientSearchComponent.addPatient")}
          <Box
            sx={{
              backgroundColor: "primary.main",
              height: "70px",
              borderRadius: 2,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              padding: 1,
              marginLeft: 2,
            }}
          >
            <Add sx={{ color: "white" }} />
          </Box>
        </Button>
      </Box>

      <Popover
        id={id}
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "left",
        }}
      >
        <Box sx={{ p: 2, display: "flex", flexDirection: "column", gap: 1 }}>
          <TextField
            variant="outlined"
            placeholder={t("patientSearchComponent.searchByPhone")}
            size="small"
            fullWidth
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
          />
          <TextField
            variant="outlined"
            placeholder={t("patientSearchComponent.searchByRut")}
            size="small"
            fullWidth
            value={rut}
            onChange={(e) => setRut(e.target.value)}
          />
          <TextField
            variant="outlined"
            placeholder={t("patientSearchComponent.searchByEmail")}
            size="small"
            fullWidth
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <Button variant="contained" color="primary" onClick={handleSearch}>
            {t("patientSearchComponent.search")}
          </Button>
        </Box>
      </Popover>
    </Paper>
  );
}
