import React, { useState } from "react";
import {
  Box,
  Typography,
  TextField,
  IconButton,
  Button,
  Paper,
  Popover,
} from "@mui/material";
import { Search, Add, FilterList } from "@mui/icons-material";
import { useTranslation } from "react-i18next";
import { SearchParams } from "fhir-kit-client";

import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { Dayjs } from "dayjs";
import "dayjs/locale/es";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";

export default function EncounterSearchComponent({
  defaultSearchParam,
  handleAdd,
  setSearchParam,
}: {
  defaultSearchParam?: SearchParams;
  handleAdd: () => void;
  setSearchParam: React.Dispatch<
    React.SetStateAction<SearchParams | undefined>
  >;
}) {
  const { t } = useTranslation();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [startDate, setStartDate] = useState<Dayjs | null>(null);
  const [endDate, setEndDate] = useState<Dayjs | null>(null);
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
    console.log("Buscar por fecha de inicio:", startDate);
    console.log("Buscar por fecha de fin:", endDate);

    const date: string[] = [];
    if (startDate) date.push(`ge${startDate.startOf("day").toISOString()}`);
    if (endDate)
      date.push(`lt${endDate.add(1, "day").startOf("day").toISOString()}`);

    const searchParams: SearchParams = {
      ...defaultSearchParam,
      date: date,
    };

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
            {t("encounterSearchComponent.encounter")}
          </Typography>
          <IconButton color="primary" onClick={handleFilterClick}>
            <FilterList />
          </IconButton>
        </Box>

        <Box sx={{ display: "flex", gap: 2 }}>
          <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="es">
            <DatePicker
              format="DD-MM-YYYY"
              views={["year", "month", "day"]}
              label={t("encounterSearchComponent.startDate")}
              value={startDate}
              onChange={(value) => setStartDate(value)}
              //sx={{ width: "100%" }}
            ></DatePicker>
            <DatePicker
              format="DD-MM-YYYY"
              views={["year", "month", "day"]}
              label={t("encounterSearchComponent.endDate")}
              value={endDate}
              onChange={(value) => setEndDate(value)}
              //sx={{ width: "100%" }}
            ></DatePicker>
          </LocalizationProvider>
          <IconButton onClick={handleSearch}>
            <Search />
          </IconButton>
        </Box>
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
          onClick={handleAdd}
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
          {t("encounterSearchComponent.addEncounter")}
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
            placeholder={t("encounterSearchComponent.searchByPhone")}
            size="small"
            fullWidth
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
          />
          <TextField
            variant="outlined"
            placeholder={t("encounterSearchComponent.searchByRut")}
            size="small"
            fullWidth
            value={rut}
            onChange={(e) => setRut(e.target.value)}
          />
          <TextField
            variant="outlined"
            placeholder={t("encounterSearchComponent.searchByEmail")}
            size="small"
            fullWidth
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <Button variant="contained" color="primary" onClick={handleSearch}>
            {t("encounterSearchComponent.search")}
          </Button>
        </Box>
      </Popover>
    </Paper>
  );
}
