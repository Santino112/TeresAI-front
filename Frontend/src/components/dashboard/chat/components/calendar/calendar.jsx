import { useEffect, useState } from "react";
import {
  Typography,
  TextField,
  Box,
  Paper,
  Divider,
  Button,
  Stack,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Alert
} from "@mui/material";
import AddRoundedIcon from "@mui/icons-material/AddRounded";
import fondoChatAI from "../../../../../assets/images/fondoChatAI.png";
import BotonCalendar from "../buttons/BotonCalendar.jsx";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import api from "../../../../../api/axios.js";

const toLocalInputDateTime = (date = new Date()) => {
  const pad = (n) => String(n).padStart(2, "0");
  const year = date.getFullYear();
  const month = pad(date.getMonth() + 1);
  const day = pad(date.getDate());
  const hours = pad(date.getHours());
  const minutes = pad(date.getMinutes());
  return `${year}-${month}-${day}T${hours}:${minutes}`;
};

const Calendar = () => {
  const [events, setEvents] = useState([]);
  const [openCreateModal, setOpenCreateModal] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    start: toLocalInputDateTime(),
    end: toLocalInputDateTime(new Date(Date.now() + 60 * 60 * 1000)),
  });

  const fetchEvents = async () => {
    const res = await api.get("/calendar/events");
    setEvents(res.data || []);
  };

  useEffect(() => {
    fetchEvents();
    const handleCalendarUpdated = () => {
      fetchEvents();
    };

    window.addEventListener("calendarUpdated", handleCalendarUpdated);
    return () => {
      window.removeEventListener("calendarUpdated", handleCalendarUpdated);
    };
  }, []);

  const handleOpenCreateModal = () => {
    setErrorMessage("");
    setOpenCreateModal(true);
  };

  const handleCloseCreateModal = () => {
    if (submitting) return;
    setOpenCreateModal(false);
  };

  const handleChange = (field) => (event) => {
    setFormData((prev) => ({
      ...prev,
      [field]: event.target.value,
    }));
  };

  const handleCreateEvent = async () => {
    const { title, description, start, end } = formData;

    if (!title.trim() || !start || !end) {
      setErrorMessage("Debes completar titulo, inicio y fin.");
      return;
    }

    const startDate = new Date(start);
    const endDate = new Date(end);

    if (Number.isNaN(startDate.getTime()) || Number.isNaN(endDate.getTime())) {
      setErrorMessage("Las fechas ingresadas no son validas.");
      return;
    }

    if (endDate <= startDate) {
      setErrorMessage("La fecha de fin debe ser posterior al inicio.");
      return;
    }

    setSubmitting(true);
    setErrorMessage("");

    try {
      await api.post("/calendar/events", {
        title: title.trim(),
        description: description.trim(),
        start: startDate.toISOString(),
        end: endDate.toISOString(),
      });

      setOpenCreateModal(false);
      setFormData({
        title: "",
        description: "",
        start: toLocalInputDateTime(),
        end: toLocalInputDateTime(new Date(Date.now() + 60 * 60 * 1000)),
      });

      await fetchEvents();
      window.dispatchEvent(new Event("calendarUpdated"));
    } catch (error) {
      setErrorMessage(error?.response?.data?.error || "No se pudo crear el evento.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        flexGrow: 1,
        width: "100%",
        height: "100%",
        overflow: "auto",
        background: `url(${fondoChatAI})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        p: 2,
      }}
    >
      <Paper
        sx={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "flex-start",
          width: "100%",
          p: { xs: 2, sm: 3, md: 3 },
          borderRadius: 4,
          background: "transparent",
          flexGrow: 0,
        }}
      >
        <Typography
          variant="h3"
          sx={{
            fontSize: {
              xs: "1.5rem",
              sm: "1.5rem",
              md: "1.5rem",
              lg: "1.7rem",
              xl: "1.8rem",
            },
            textAlign: { xs: "center", sm: "center", md: "start" },
            fontFamily: "'Lora', serif",
          }}
        >
          Calendario
        </Typography>
        <Typography
          variant="body2"
          sx={{
            my: 1,
            fontSize: {
              xs: "1rem",
              sm: "1rem",
              md: "1.2rem",
              lg: "1.2rem",
              xl: "1.2rem",
            },
            textAlign: { xs: "center", sm: "center", md: "start" },
            fontFamily: "'Lora', serif",
            lineHeight: 1.8,
          }}
        >
          Puedes visualizar, crear y gestionar eventos desde aqui.
        </Typography>
        <Divider
          sx={{
            width: "100%",
            "&::before, &::after": {
              borderColor: "#ffffff",
            },
          }}
        >
          <Typography variant="body1" sx={{ color: "#ffffff" }}>
            ~
          </Typography>
        </Divider>

        <Stack direction={{ xs: "column", sm: "row" }} spacing={1.5} sx={{ mt: 2, mb: 2 }}>
          <BotonCalendar />
          <Button
            variant="contained"
            onClick={handleOpenCreateModal}
            startIcon={<AddRoundedIcon />}
            sx={{
              boxShadow: 3,
              color: "#ffffff",
              backgroundColor: "#0978a0",
              fontFamily: "'Lora', serif",
              fontWeight: "bold",
              "&:hover": {
                backgroundColor: "#066688",
              },
            }}
          >
            Nuevo evento
          </Button>
        </Stack>

        <Box
          sx={{
            width: "100%",
            overflowX: "auto",
            margin: "0 auto",
            "& .fc-button": {
              fontSize: "0.8rem !important",
              padding: "4px 8px !important",
              backgroundColor: "#444444 !important",
              border: "none !important",
              color: "#ffffff !important",
              "&:hover": {
                backgroundColor: "#303030 !important",
              },
            },
            "& .fc-toolbar-title": {
              fontSize: "1rem !important",
            },
            "& .fc-col-header-cell": {
              fontSize: "0.85rem !important",
            },
            "& .fc-daygrid-day-number": {
              fontSize: "0.85rem !important",
            },
          }}
        >
          <FullCalendar
            plugins={[dayGridPlugin, timeGridPlugin]}
            initialView="dayGridMonth"
            locale="es"
            headerToolbar={{
              left: "prev,next today",
              center: "title",
              right: "dayGridMonth,timeGridWeek",
            }}
            events={events}
          />
        </Box>
      </Paper>

      <Dialog open={openCreateModal} onClose={handleCloseCreateModal} fullWidth maxWidth="sm">
        <DialogTitle sx={{ fontFamily: "'Lora', serif", fontWeight: 700 }}>
          Crear evento nuevo
        </DialogTitle>
        <DialogContent>
          <Stack spacing={2} sx={{ mt: 1 }}>
            {errorMessage ? <Alert severity="error">{errorMessage}</Alert> : null}
            <TextField
              label="Titulo"
              value={formData.title}
              onChange={handleChange("title")}
              fullWidth
              required
            />
            <TextField
              label="Descripcion"
              value={formData.description}
              onChange={handleChange("description")}
              multiline
              minRows={3}
              fullWidth
            />
            <TextField
              label="Inicio"
              type="datetime-local"
              value={formData.start}
              onChange={handleChange("start")}
              InputLabelProps={{ shrink: true }}
              fullWidth
              required
            />
            <TextField
              label="Fin"
              type="datetime-local"
              value={formData.end}
              onChange={handleChange("end")}
              InputLabelProps={{ shrink: true }}
              fullWidth
              required
            />
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseCreateModal} disabled={submitting}>
            Cancelar
          </Button>
          <Button variant="contained" onClick={handleCreateEvent} disabled={submitting}>
            {submitting ? "Guardando..." : "Guardar evento"}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Calendar;
