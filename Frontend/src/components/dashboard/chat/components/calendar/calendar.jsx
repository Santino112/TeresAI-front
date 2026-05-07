import { useCallback, useEffect, useState } from "react";
import { Typography, Button, TextField, Box, Stack, Paper, Divider, Grid } from "@mui/material";
import fondoChatAI from "../../../../../assets/images/fondoChatAI.png";
import BotonCalendar from "../buttons/BotonCalendar.jsx";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import CalendarMonthRoundedIcon from "@mui/icons-material/CalendarMonthRounded";
import api from "../../../../../api/axios.js";
import esLocale from "@fullcalendar/core/locales/es";
import { supabase } from "../../../../../supabaseClient.js";

const toLocalInputDateTime = (date = new Date()) => {
  const currentDate = new Date(date);

  if (Number.isNaN(currentDate.getTime())) {
    return "";
  }

  const pad = (value) => String(value).padStart(2, "0");

  return `${currentDate.getFullYear()}-${pad(currentDate.getMonth() + 1)}-${pad(currentDate.getDate())}T${pad(currentDate.getHours())}:${pad(currentDate.getMinutes())}`;
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

  const fetchEvents = useCallback(async () => {
    try {
      const { data } = await supabase.auth.getSession();
      const session = data.session;

      if (!session) return;

      const res = await api.get("/calendar/events", {
        headers: {
          Authorization: `Bearer ${session.access_token}`,
        },
      });

      setEvents(Array.isArray(res.data) ? res.data : []);
    } catch (error) {
      setErrorMessage(error?.response?.data?.error || "No se pudieron cargar los eventos del calendario.");
    }
  }, []);

  const handleOpenCreate = () => {
    setErrorMessage("");
    setFormData({
      title: "",
      description: "",
      start: toLocalInputDateTime(),
      end: toLocalInputDateTime(new Date(Date.now() + 60 * 60 * 1000)),
    });
    setOpenCreateModal(true);
  };

  const handleCloseCreate = () => {
    if (submitting) return;
    setOpenCreateModal(false);
    setErrorMessage("");
  };

  const handleFormChange = (field) => (event) => {
    const { value } = event.target;
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleCreateEvent = async () => {
    if (submitting) return;

    const title = formData.title.trim();
    const description = formData.description.trim();
    const startDate = new Date(formData.start);
    const endDate = new Date(formData.end);

    if (!title) {
      setErrorMessage("El titulo del evento es obligatorio.");
      return;
    }

    if (Number.isNaN(startDate.getTime()) || Number.isNaN(endDate.getTime())) {
      setErrorMessage("Las fechas ingresadas no son validas.");
      return;
    }

    if (endDate <= startDate) {
      setErrorMessage("La fecha de fin debe ser posterior a la fecha de inicio.");
      return;
    }

    setSubmitting(true);
    setErrorMessage("");

    try {
      const { data } = await supabase.auth.getSession();
      const session = data.session;

      if (!session) {
        setErrorMessage("Usuario no autenticado.");
        return;
      }

      await api.post(
        "/calendar/events",
        {
          title,
          description,
          start: startDate.toISOString(),
          end: endDate.toISOString(),
        },
        {
          headers: {
            Authorization: `Bearer ${session.access_token}`,
          },
        }
      );

      setOpenCreateModal(false);
      await fetchEvents();
      window.dispatchEvent(new Event("calendarUpdated"));
    } catch (error) {
      setErrorMessage(error?.response?.data?.error || "No se pudo crear el evento.");
    } finally {
      setSubmitting(false);
    }
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
  }, [fetchEvents]);

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        flexGrow: 1,
        width: "100%",
        height: "100%",
        overflow: "hidden",
        background: `url(${fondoChatAI})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        p: { xs: 1, sm: 2, md: 2 },
      }}
    >
      <Paper
        elevation={0}
        sx={{
          display: "flex",
          flexDirection: "column",
          height: "auto",
          width: "100%",
          borderRadius: { xs: 4, md: 6 },
          p: { xs: 2, md: 2 },
          background: "transparent",
          backdropFilter: "blur(12px)",
          WebkitBackdropFilter: "blur(12px)",
          border: "1px solid rgba(255, 255, 255, 0.3)",
          boxShadow: 0,
          overflow: "hidden",
          animation: "slideDown 0.4s ease",
          "@keyframes slideDown": {
            from: {
              opacity: 0,
              transform: "translateY(-40px)",
            },
            to: {
              opacity: 1,
              transform: "translateY(0)",
            },
          },
        }}
      >
        <Box sx={{ pb: 2 }}>
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} md={8}>
              <Typography
                variant="h3"
                sx={{
                  display: "flex",
                  justifyContent: { xs: "center", sm: "center", md: "flex-start" },
                  alignItems: "center",
                  color: "#000000",
                  fontSize: {
                    xs: "1.5rem",
                    sm: "1.5rem",
                    md: "1.5rem",
                    lg: "1.7rem",
                    xl: "1.8rem",
                  },
                  mb: 1,
                }}
              >
                Calendario <CalendarMonthRoundedIcon fontSize="medium" sx={{ color: "#000000", ml: 1 }} />
              </Typography>
              <Typography
                variant="body1"
                sx={{
                  color: "#000000",
                  fontSize: {
                    xs: "1rem",
                    sm: "1rem",
                    md: "1.2rem",
                    lg: "1.3rem",
                    xl: "1.3rem",
                  },
                  lineHeight: 1.6,
                  textAlign: { xs: "center", sm: "center", md: "start" },
                }}
              >
                Gestiona y visualiza tus eventos agendados con Teresa.
                Revisa tu disponibilidad por semana o mes de forma rapida.
              </Typography>
            </Grid>
          </Grid>
        </Box>

        <Divider sx={{ borderColor: "rgba(0,0,0,0.1)", mb: 2 }} />

        <Box
          sx={{
            flexGrow: 1,
            overflowY: "auto",
            "& .fc": {
              "--fc-border-color": "rgba(0, 0, 0, 0.08)",
              "--fc-button-bg-color": "#000000",
              "--fc-button-border-color": "#000000",
              "--fc-button-hover-bg-color": "#333333",
              "--fc-button-active-bg-color": "#555555",
              "--fc-today-bg-color": "rgba(0, 0, 0, 0.04)",
              fontFamily: "'Lora', serif",
              height: "100%",
            },
            "& .fc-toolbar-title": {
              color: "#000000 !important",
              fontFamily: "'Lora', serif",
              fontWeight: "700 !important",
              fontSize: { xs: "1.2rem !important", md: "1.6rem !important" },
            },
            "& .fc-button": {
              textTransform: "capitalize",
              borderRadius: "8px !important",
              fontSize: "0.85rem !important",
            },
            "&::-webkit-scrollbar": { width: "6px" },
            "&::-webkit-scrollbar-thumb": {
              backgroundColor: "rgba(255, 255, 255, 0.2)",
              borderRadius: "10px",
            },
            "& .fc-event": {
              backgroundColor: "#4c9eaa !important",
              borderColor: "#000000 !important",
              color: "#ffffff !important",
              borderRadius: "4px",
              padding: "2px 4px",
              fontSize: "0.8rem",
            },
            "& .fc-event-dot": {
              backgroundColor: "#000000 !important",
            },
            "& .fc-col-header-cell-cushion": {
              color: "#000000 !important",
              textDecoration: "none !important",
            },
            "& .fc-daygrid-day-number": {
              color: "#000000 !important",
              textDecoration: "none !important",
              fontWeight: "bold",
            },
            "& .fc-daygrid-day-top": {
              justifyContent: "center",
            },
            "& .fc-timegrid-slot-label-cushion": {
              color: "#000000 !important",
            },
            animation: "slideDown 0.4s ease",
            "@keyframes slideDown": {
              from: {
                opacity: 0,
                transform: "translateY(-40px)",
              },
              to: {
                opacity: 1,
                transform: "translateY(0)",
              },
            },
          }}
        >
          <Stack
            direction={{ xs: "column", md: "row" }}
            spacing={1}
            alignItems={{ xs: "stretch", md: "center" }}
            sx={{ mb: 2 }}
          >
            <BotonCalendar />
            <Button
              variant="contained"
              onClick={handleOpenCreate}
              sx={{
                borderRadius: 3,
                mb: { xs: 1, md: 3 },
                width: { xs: "100%", md: "fit-content" },
                minWidth: "auto",
                px: 2,
                backgroundColor: "#0978a0",
                color: "#ffffff",
                textTransform: "none",
                fontSize: "1rem",
                "&:hover": {
                  backgroundColor: "#066688",
                },
              }}
            >
              Agregar evento
            </Button>
          </Stack>

          {openCreateModal && (
            <Paper
              elevation={1}
              sx={{
                p: 2,
                mb: 2,
                borderRadius: 3,
                backgroundColor: "rgba(255, 255, 255, 0.75)",
              }}
            >
              <Stack spacing={2}>
                <TextField
                  label="Titulo"
                  value={formData.title}
                  onChange={handleFormChange("title")}
                  required
                  fullWidth
                />
                <TextField
                  label="Descripcion"
                  value={formData.description}
                  onChange={handleFormChange("description")}
                  fullWidth
                  multiline
                  minRows={2}
                />
                <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
                  <TextField
                    label="Inicio"
                    type="datetime-local"
                    value={formData.start}
                    onChange={handleFormChange("start")}
                    InputLabelProps={{ shrink: true }}
                    fullWidth
                    required
                  />
                  <TextField
                    label="Fin"
                    type="datetime-local"
                    value={formData.end}
                    onChange={handleFormChange("end")}
                    InputLabelProps={{ shrink: true }}
                    fullWidth
                    required
                  />
                </Stack>

                {errorMessage ? (
                  <Typography variant="body2" color="error">
                    {errorMessage}
                  </Typography>
                ) : null}

                <Stack direction="row" spacing={1} justifyContent="flex-end">
                  <Button onClick={handleCloseCreate} disabled={submitting}>
                    Cancelar
                  </Button>
                  <Button variant="contained" onClick={handleCreateEvent} disabled={submitting}>
                    {submitting ? "Guardando..." : "Guardar evento"}
                  </Button>
                </Stack>
              </Stack>
            </Paper>
          )}

          {!openCreateModal && errorMessage ? (
            <Typography variant="body2" color="error" sx={{ mb: 2 }}>
              {errorMessage}
            </Typography>
          ) : null}

          <FullCalendar
            plugins={[dayGridPlugin, timeGridPlugin]}
            initialView="dayGridMonth"
            locale={esLocale}
            eventColor="#000000"
            eventTextColor="#000000"
            headerToolbar={{
              left: "prev,next today",
              center: "title",
              right: "dayGridMonth,timeGridWeek",
            }}
            events={events}
            height="auto"
            contentHeight="auto"
          />
        </Box>
      </Paper>
    </Box>
  );
};

export default Calendar;
