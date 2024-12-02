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

export default function PatientSearchComponent({
  handleAddPatient,
}: {
  handleAddPatient: () => void;
}) {
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
      {/* Contenedor para las filas de contenido */}
      <Box sx={{ flex: 1, display: "flex", flexDirection: "column", gap: 1 }}>
        {/* Primera fila: título y filtro */}
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
              textUnderlineOffset: "0.2em", // Ajusta el offset según sea necesario
            }}
          >
            PACIENTES
          </Typography>
          <IconButton color="primary" onClick={handleFilterClick}>
            <FilterList />
          </IconButton>
        </Box>

        {/* Segunda fila: campo de búsqueda */}
        <TextField
          variant="outlined"
          placeholder="Buscar un paciente"
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

      {/* Botón para agregar paciente, ocupa ambas filas */}
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
            paddingRight: 0, // Eliminar padding derecho para que el icono esté al final
            fontWeight: "bold",
            height: "70px",
            marginLeft: 2,
            whiteSpace: "pre-line",
            backgroundColor: "white", // Color del botón en blanco
            color: "primary.main", // Color del texto en azul
            display: "flex",
            justifyContent: "space-between", // Distribuir contenido
            alignItems: "center", // Alinear verticalmente
            border: "2px solid", // Borde de 2px
            borderColor: "primary.main", // Color del borde azul
          }}
        >
          Agregar{"\n"}Paciente
          <Box
            sx={{
              backgroundColor: "primary.main", // Fondo azul
              height: "70px", // Ocupa todo el alto del botón
              borderRadius: 2,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              padding: 1,
              marginLeft: 2, // Espacio entre texto e icono
            }}
          >
            <Add sx={{ color: "white" }} /> {/* Icono en blanco */}
          </Box>
        </Button>
      </Box>

      {/* Popover para opciones adicionales de búsqueda */}
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
            placeholder="Buscar por teléfono"
            size="small"
            fullWidth
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
          />
          <TextField
            variant="outlined"
            placeholder="Buscar por RUT"
            size="small"
            fullWidth
            value={rut}
            onChange={(e) => setRut(e.target.value)}
          />
          <TextField
            variant="outlined"
            placeholder="Buscar por correo"
            size="small"
            fullWidth
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <Button variant="contained" color="primary" onClick={handleSearch}>
            Buscar
          </Button>
        </Box>
      </Popover>
    </Paper>
  );
}
