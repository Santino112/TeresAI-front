import { useEffect, useState } from "react";
import { Typography, Button, TextField, Box, Stack, Paper, Divider, Grid, Modal } from "@mui/material";
import fondoChatAI from "../../../../../assets/images/fondoChatAI.png";
import BotonCalendar from '../buttons/botonCalendar.jsx';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import CalendarMonthRoundedIcon from '@mui/icons-material/CalendarMonthRounded';
import api from "../../../../../api/axios.js";
import esLocale from '@fullcalendar/core/locales/es';
import { supabase } from "../../../../../supabaseClient.js";

const styleModal = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: "90%",
    maxWidth: 500,
    color: '#000000',
    overflowY: "auto",
    bgcolor: "#eeeeee",
    border: '2px solid #000000',
    borderRadius: 3,
    boxShadow: 24,
    p: { xs: 2, sm: 3, md: 3 },
    outline: 'none'
};

const toLocalInputDateTime = (date = new Date()) => {
    const pad = (n) => String(n).padStart(2, "0");
    const year = date.getFullYear();
    const month = pad(date.getMonth() + 1);
    const day = pad(date.getDate());
    const hours = pad(date.getHours());
    const minutes = pad(date.getMinutes());
    return ` ${year} -${month} -${day}T${hours}:${minutes}`;
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
    const [selectedEvent, setSelectedEvent] = useState(null);
    const [openModal, setOpenModal] = useState(false);

    const fetchEvents = async () => {
        const { data } = await supabase.auth.getSession();
        const session = data.session;

        if (!session) return;

        const res = await api.get('/calendar/events', {
            headers: {
                Authorization: `Bearer ${session.access_token}`,
            },
        });

        setEvents(res.data);
    };

    const handleEventClick = (info) => {
        setSelectedEvent({
            title: info.event.title,
            start: info.event.start,
            description: info.event.extendedProps.description,
            category: info.event.extendedProps.category
        });
        setOpenModal(true);
    };

    useEffect(() => {
        fetchEvents();
        const handleCalendarUpdated = () => {
            console.log("Actualizando calendario...")
            fetchEvents();
        };
        window.addEventListener("calendarUpdated", handleCalendarUpdated);
        return () => {
            window.removeEventListener("calendarUpdated", handleCalendarUpdated);
        };
    }, []);

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
                p: { xs: 1, sm: 2, md: 2 }
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
                            transform: "translateY(-40px)"
                        },
                        to: {
                            opacity: 1,
                            transform: "translateY(0)"
                        }
                    }
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
                                        xl: "1.8rem"
                                    },
                                    mb: 1
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
                                Revisa tu disponibilidad por semana o mes de forma rápida.
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
                            '--fc-border-color': 'rgba(0, 0, 0, 0.33)',
                            '--fc-button-bg-color': '#000000',
                            '--fc-button-border-color': '#000000',
                            '--fc-button-hover-bg-color': '#333333',
                            '--fc-button-active-bg-color': '#555555',
                            '--fc-today-bg-color': 'rgba(0, 0, 0, 0.04)',
                            height: "100%",
                        },
                        "& .fc-toolbar-title": {
                            color: "#000000 !important",
                            fontFamily: "'Lora', serif",
                            fontWeight: "700 !important",
                            fontSize: { xs: "1.2rem !important", md: "1.6rem !important" }
                        },
                        "& .fc-button": {
                            textTransform: 'capitalize',
                            borderRadius: '8px !important',
                            fontSize: '0.85rem !important'
                        },
                        // Custom Scrollbar
                        "&::-webkit-scrollbar": { width: "6px" },
                        "&::-webkit-scrollbar-thumb": {
                            backgroundColor: "rgba(255, 255, 255, 0.2)",
                            borderRadius: "10px"
                        },
                        "& .fc-event": {
                            backgroundColor: "#4c9eaa !important",
                            borderColor: "#000000 !important",
                            color: "#ffffff !important",
                            borderRadius: '4px',
                            padding: '2px 4px',
                            fontSize: '0.8rem',
                            whiteSpace: "nowrap !important",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            "@media (min-width: 900px)": {
                                whiteSpace: "normal !important",
                                "& .fc-event-title": {
                                    whiteSpace: "normal !important",
                                }
                            },

                            "& *": {
                                color: "#ffffff !important"
                            }
                        },
                        "& .fc-event-dot": {
                            backgroundColor: "#000000 !important" // Para la vista de lista/puntos
                        },
                        // Agrega esto dentro del objeto sx del Box contenedor del calendario
                        "& .fc-col-header-cell-cushion": {
                            color: "#000000 !important", // Lunes, Martes, etc.
                            textDecoration: "none !important" // Quita el subrayado si existe
                        },
                        "& .fc-daygrid-day-number": {
                            color: "#000000 !important", // Números 1, 2, 3...
                            textDecoration: "none !important",
                            fontWeight: "bold"
                        },
                        "& .fc-daygrid-day-top": {
                            justifyContent: "center", // Opcional: centra los números
                        },
                        // Si usas la vista de semana (timeGrid), esto cambia la hora del lateral
                        "& .fc-timegrid-slot-label-cushion": {
                            color: "#000000 !important"
                        },
                        "& .fc-daygrid-event": {
                            whiteSpace: "normal !important", // Permite que el texto baje
                            alignItems: "flex-start !important",
                        },
                        "& .fc-timegrid-event": {
                            whiteSpace: "normal !important",
                        },
                        // 3. El contenedor interno del texto
                        "& .fc-event-title": {
                            display: "block",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            whiteSpace: "inherit !important"
                        },
                        animation: "slideDown 0.4s ease",
                        "@keyframes slideDown": {
                            from: {
                                opacity: 0,
                                transform: "translateY(-40px)"
                            },
                            to: {
                                opacity: 1,
                                transform: "translateY(0)"
                            }
                        },
                        cursor: "pointer"
                    }}
                >
                    <BotonCalendar />
                    <FullCalendar
                        plugins={[dayGridPlugin, timeGridPlugin]}
                        initialView="dayGridMonth"
                        locale={esLocale}
                        eventColor="#000000"
                        eventTextColor="#000000"
                        eventClick={handleEventClick}
                        headerToolbar={{
                            left: 'prev,next today',

                            center: 'title',
                            right: 'dayGridMonth,timeGridWeek'
                        }}
                        events={events}
                        height="auto"
                        contentHeight="auto"
                    />
                </Box>
                <Modal
                    open={openModal}
                    onClose={() => setOpenModal(false)}
                    aria-labelledby="modal-event-title"
                    aria-describedby="modal-event-description"
                >
                    <Box sx={styleModal}>
                        <Typography
                            id="modal-event-title"
                            variant="h5"
                            sx={{ fontWeight: 700, mb: 0 }}
                        >
                            {selectedEvent?.title}
                        </Typography>
                        <Typography variant="subtitle1" sx={{ color: '#000000', mb: 0, display: 'flex', alignItems: 'center' }}>
                            📅 {selectedEvent?.start?.toLocaleString('es-AR', {
                                weekday: 'long',
                                day: 'numeric',
                                month: 'long',
                                hour: '2-digit',
                                minute: '2-digit'
                            })}
                        </Typography>
                        <Divider sx={{ borderColor: "rgba(0,0,0,0.1)", my: 1 }} />
                        <Typography id="modal-event-description" variant="body1" sx={{ mt: 2, color: '#444' }}>
                            {selectedEvent?.extendedProps?.description || "No hay notas adicionales para este evento."}
                        </Typography>
                        <Divider sx={{ borderColor: "rgba(0,0,0,0.1)", mt: 2 }} />
                        <Box sx={{ mt: 4, display: 'flex', justifyContent: 'flex-end' }}>
                            <Button
                                onClick={() => setOpenModal(false)}
                                variant="contained"
                                sx={{
                                    backgroundColor: "#7d745c",
                                    color: "#ffffff",
                                    borderRadius: 2,
                                    textTransform: "none",
                                    "&:hover": {
                                        backgroundColor: "#67604d"
                                    },

                                }}
                            >
                                Cerrar
                            </Button>
                        </Box>
                    </Box>
                </Modal>
            </Paper>
        </Box>
    )
};

export default Calendar;
