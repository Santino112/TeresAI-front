import { useCallback, useEffect, useState } from "react";
import { Typography, Button, TextField, Box, Stack, Paper, Divider, Grid, Modal, Alert } from "@mui/material";
import fondoChatAI from "../../../../../assets/images/fondoChatAI.png";
import BotonCalendar from '../buttons/botonCalendar.jsx';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import CalendarMonthRoundedIcon from '@mui/icons-material/CalendarMonthRounded';
import api from "../../../../../api/axios.js";
import esLocale from "@fullcalendar/core/locales/es";
import AddRoundedIcon from '@mui/icons-material/AddRounded';
import EditCalendarRoundedIcon from '@mui/icons-material/EditCalendarRounded';
import CircularProgress from "@mui/material/CircularProgress";
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
    p: { xs: 3, sm: 3, md: 4 },
    outline: 'none'
};

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
    const [selectedEvent, setSelectedEvent] = useState(null);
    const [openModal, setOpenModal] = useState(false);
    const [createError, setCreateError] = useState("");
    const [createForm, setCreateForm] = useState({
        title: "",
        content: "",
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
            setCreateError("El titulo del evento es obligatorio.");
            setTimeout(() => {
                setCreateError("");
            }, 7000);
            return;
        }

        if (Number.isNaN(startDate.getTime()) || Number.isNaN(endDate.getTime())) {
            setCreateError("Las fechas ingresadas no son validas.");
            setTimeout(() => {
                setCreateError("");
            }, 7000);
            return;
        }

        if (endDate <= startDate) {
            setCreateError("La fecha de fin debe ser posterior a la fecha de inicio.");
            setTimeout(() => {
                setCreateError("");
            }, 7000);
            return;
        }

        setSubmitting(true);
        setCreateError("");

        try {
            const { data } = await supabase.auth.getSession();
            const session = data.session;

            if (!session) {
                setCreateError("Usuario no autenticado.");
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
            setCreateError(error?.response?.data?.error || "No se pudo crear el evento.");
            setTimeout(() => {
                setCreateError("");
            }, 7000);
        } finally {
            setSubmitting(false);
        }
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
            fetchEvents();
        };

        window.addEventListener("calendarUpdated", handleCalendarUpdated);
        return () => {
            window.removeEventListener("calendarUpdated", handleCalendarUpdated);
        };
    }, [fetchEvents]);

    const ActionButtons = ({ handleOpenCreate, isMobile = false }) => (
        <Box
            sx={{
                display: isMobile ? { xs: "flex", md: "none" } : { xs: "none", md: "flex" },
                mt: isMobile ? 2 : 0,
                mb: isMobile ? 1 : 0,
                width: isMobile ? "100%" : "auto",
                mb: 2,
            }}
        >
            <Button
                variant="contained"
                onClick={handleOpenCreate}
                sx={{
                    borderRadius: 2,
                    mr: { xs: 0, sm: 1 },
                    boxShadow: 3,
                    width: { xs: "100%", sm: "100%", md: "fit-content" },
                    minWidth: "auto",
                    whiteSpace: "nowrap",
                    backgroundColor: "#7d745c",
                    color: "#ffffff",
                    textTransform: "none",
                    fontSize: "1rem",
                    "&:hover": {
                        backgroundColor: "#67604d"
                    },
                }}
            >
                <AddRoundedIcon fontSize="medium" sx={{ mr: 1 }} /> Agregar evento
            </Button>
        </Box>
    );

    return (
        <Box
            sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "stretch",
                flexGrow: 1,
                width: "100%",
                height: "100%",
                overflow: "auto",
                background: `url(${fondoChatAI})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
                backgroundRepeat: "no-repeat",
                p: 2
            }}
        >
            <Paper
                sx={{
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "flex-start",
                    width: "100%",
                    p: { xs: 2, sm: 2, md: 2 },
                    borderRadius: 4,
                    background: "transparent",
                    flexGrow: 0,
                    boxShadow: 0,
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
                <Stack
                    direction={{ xs: "column", sm: "row" }}
                    alignItems="center"
                    justifyContent="space-between"
                    spacing={2}
                >
                    <Stack direction="row" alignItems="center" spacing={1}>
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
                            }}
                        >
                            Calendario <CalendarMonthRoundedIcon fontSize="medium" sx={{ color: "#000000", ml: 1 }} />
                        </Typography>
                    </Stack>
                    <ActionButtons handleOpenCreate={handleOpenCreate} isMobile={false} />
                </Stack>
                <Typography
                    variant="body2"
                    sx={{
                        my: 1,
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
                <Divider sx={{ borderColor: "rgba(0,0,0,0.1)" }} />
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
                        cursor: "pointer",
                        mt: 2,
                    }}
                >
                    <Stack
                        direction={{ xs: "column", md: "row" }}
                        spacing={2}
                        alignItems={{ xs: "stretch", md: "center" }}
                        sx={{ mb: 2 }}
                    >
                        <BotonCalendar />
                        <ActionButtons handleOpenCreate={handleOpenCreate} isMobile={true} />
                    </Stack>
                    {openCreateModal && (
                        <Modal
                            open={openCreateModal}
                            onClose={handleCloseCreate}
                            aria-labelledby="modal-create-title"
                        >
                            <Box sx={styleModal}>
                                <Box sx={{ mb: 1, borderBottom: '1px solid rgba(0,0,0,0.1)' }}>
                                    <Typography id="modal-create-title" variant="h5" sx={{
                                        display: "flex",
                                        justifyContent: "flex-start",
                                        alignItems: "center",
                                        color: "#000000",
                                        fontWeight: 600,
                                        mb: 1
                                    }}>
                                        Nuevo Evento <EditCalendarRoundedIcon fontSize="medium" sx={{ color: "#000000", ml: 1 }} />
                                    </Typography>
                                    <Divider sx={{ borderColor: "rgba(0,0,0,0.1)" }} />
                                </Box>
                                <Box sx={{ mt: 2 }}>
                                    <Stack spacing={3}>
                                        {createError ? <Alert variant="filled" severity="error" sx={{
                                            boxShadow: 4,
                                            borderRadius: 3,
                                            fontSize: "1rem",
                                        }}>{createError}</Alert> : null}
                                        <TextField
                                            label="Título del evento"
                                            value={formData.title}
                                            onChange={handleFormChange("title")}
                                            fullWidth
                                            sx={{
                                                backgroundColor: "#d7d6d6",
                                                borderRadius: 3,
                                                boxShadow: 3,
                                                input: { color: "#000000" },
                                                "& .MuiInputLabel-root": {
                                                    color: "#000000",
                                                    opacity: 0.8
                                                },
                                                "& .MuiInputLabel-root.Mui-focused": {
                                                    color: "#000000 !important"
                                                },
                                                "& .MuiInputBase-input::placeholder": {
                                                    color: "#000000",
                                                    opacity: 0.6,
                                                },
                                                "& .MuiOutlinedInput-root": {
                                                    borderRadius: 3,
                                                    pr: 1,
                                                    "& fieldset": {
                                                        borderColor: "transparent"
                                                    },
                                                    "&:hover fieldset": {
                                                        borderColor: "transparent"
                                                    },
                                                    "&.Mui-focused fieldset": {
                                                        borderColor: "gray"
                                                    },
                                                },
                                                "& .MuiFormHelperText-root": {
                                                    color: "#000000 !important",
                                                    opacity: 0.8,
                                                    fontWeight: 500,
                                                },
                                            }}
                                        />
                                        <TextField
                                            label="Descripción"
                                            placeholder="Ej: Recordar ir al médico..."
                                            value={formData.description}
                                            onChange={handleFormChange("description")}
                                            fullWidth
                                            minRows={6}
                                            multiline
                                            helperText={
                                                <span >
                                                    {`500 caracteres`}
                                                </span>
                                            }
                                            inputProps={{ maxLength: 500 }}
                                            sx={{
                                                backgroundColor: "#d7d6d6",
                                                color: "#000000",
                                                borderRadius: 3,
                                                boxShadow: 3,
                                                "& .MuiInputBase-input": {
                                                    color: "#000000",
                                                    WebkitTextFillColor: "#000000",
                                                },
                                                "& .MuiInputLabel-root": {
                                                    color: "#000000",
                                                    opacity: 0.8
                                                },
                                                "& textarea": {
                                                    color: "#000000",
                                                },
                                                "& .MuiOutlinedInput-root": {
                                                    borderRadius: 3,
                                                    pr: 1,
                                                },
                                                "& fieldset": {
                                                    borderColor: "transparent"
                                                },
                                                "& .MuiInputBase-input::placeholder": {
                                                    color: "#000000",
                                                    opacity: 0.6,
                                                },
                                                "&:hover fieldset": {
                                                    borderColor: "transparent"
                                                },
                                                "&.Mui-focused fieldset": {
                                                    borderColor: "gray"
                                                },
                                                "& .MuiFormHelperText-root": {
                                                    color: "#000000",
                                                    opacity: 0.8,
                                                    fontWeight: 500,
                                                },
                                                "& .MuiInputLabel-root.Mui-focused": {
                                                    color: "#000000 !important"
                                                },
                                                "& .MuiOutlinedInput-root": {
                                                    borderRadius: 3,
                                                    pr: 1,
                                                    "& fieldset": {
                                                        borderColor: "transparent"
                                                    },
                                                    "&:hover fieldset": {
                                                        borderColor: "transparent"
                                                    },
                                                    "&.Mui-focused fieldset": {
                                                        borderColor: "gray"
                                                    },
                                                },
                                            }}
                                        />
                                        <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
                                            <TextField
                                                label="Inicio"
                                                type="datetime-local"
                                                value={formData.start}
                                                onChange={handleFormChange("start")}
                                                InputLabelProps={{ shrink: true }}
                                                fullWidth
                                                sx={{
                                                    backgroundColor: "#d7d6d6",
                                                    color: "#000000",
                                                    borderRadius: 3,
                                                    boxShadow: 3,
                                                    "& .MuiInputBase-input": {
                                                        color: "#000000",
                                                        WebkitTextFillColor: "#000000",
                                                    },
                                                    "& .MuiInputLabel-root": {
                                                        color: "#000000",
                                                        opacity: 0.8
                                                    },
                                                    "& textarea": {
                                                        color: "#000000",
                                                    },
                                                    "& .MuiOutlinedInput-root": {
                                                        borderRadius: 3,
                                                        pr: 1,
                                                    },
                                                    "& fieldset": {
                                                        borderColor: "transparent"
                                                    },
                                                    "& .MuiInputBase-input::placeholder": {
                                                        color: "#000000",
                                                        opacity: 0.6,
                                                    },
                                                    "&:hover fieldset": {
                                                        borderColor: "transparent"
                                                    },
                                                    "&.Mui-focused fieldset": {
                                                        borderColor: "gray"
                                                    },
                                                    "& .MuiFormHelperText-root": {
                                                        color: "#000000",
                                                        opacity: 0.8,
                                                        fontWeight: 500,
                                                    },
                                                    "& .MuiInputLabel-root.Mui-focused": {
                                                        color: "#000000 !important"
                                                    },
                                                    "& .MuiOutlinedInput-root": {
                                                        borderRadius: 3,
                                                        pr: 1,
                                                        "& fieldset": {
                                                            borderColor: "transparent"
                                                        },
                                                        "&:hover fieldset": {
                                                            borderColor: "transparent"
                                                        },
                                                        "&.Mui-focused fieldset": {
                                                            borderColor: "gray"
                                                        },
                                                    },
                                                }}
                                            />
                                            <TextField
                                                label="Fin"
                                                type="datetime-local"
                                                value={formData.end}
                                                onChange={handleFormChange("end")}
                                                InputLabelProps={{ shrink: true }}
                                                fullWidth
                                                sx={{
                                                    backgroundColor: "#d7d6d6",
                                                    color: "#000000",
                                                    borderRadius: 3,
                                                    boxShadow: 3,
                                                    "& .MuiInputBase-input": {
                                                        color: "#000000",
                                                        WebkitTextFillColor: "#000000",
                                                    },
                                                    "& .MuiInputLabel-root": {
                                                        color: "#000000",
                                                        opacity: 0.8
                                                    },
                                                    "& textarea": {
                                                        color: "#000000",
                                                    },
                                                    "& .MuiOutlinedInput-root": {
                                                        borderRadius: 3,
                                                        pr: 1,
                                                    },
                                                    "& fieldset": {
                                                        borderColor: "transparent"
                                                    },
                                                    "& .MuiInputBase-input::placeholder": {
                                                        color: "#000000",
                                                        opacity: 0.6,
                                                    },
                                                    "&:hover fieldset": {
                                                        borderColor: "transparent"
                                                    },
                                                    "&.Mui-focused fieldset": {
                                                        borderColor: "gray"
                                                    },
                                                    "& .MuiFormHelperText-root": {
                                                        color: "#000000",
                                                        opacity: 0.8,
                                                        fontWeight: 500,
                                                    },
                                                    "& .MuiInputLabel-root.Mui-focused": {
                                                        color: "#000000 !important"
                                                    },
                                                    "& .MuiOutlinedInput-root": {
                                                        borderRadius: 3,
                                                        pr: 1,
                                                        "& fieldset": {
                                                            borderColor: "transparent"
                                                        },
                                                        "&:hover fieldset": {
                                                            borderColor: "transparent"
                                                        },
                                                        "&.Mui-focused fieldset": {
                                                            borderColor: "gray"
                                                        },
                                                    },
                                                }}
                                            />
                                        </Stack>
                                        {errorMessage && (
                                            <Typography variant="body2" color="error">
                                                {errorMessage}
                                            </Typography>
                                        )}
                                        <Divider sx={{ borderColor: "rgba(0,0,0,0.1)" }} />
                                    </Stack>
                                    <Box sx={{ mt: 1, display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
                                        <Button
                                            onClick={handleCloseCreate}
                                            sx={{
                                                color: "#464545",
                                                fontWeight: "bold",
                                                borderRadius: 2,
                                                textTransform: "none",
                                                mr: 1,
                                                mt: 1,
                                                "&:hover": { backgroundColor: "#e0e0e0" },
                                            }}
                                        >
                                            Cancelar
                                        </Button>
                                        <Button
                                            onClick={handleCreateEvent}
                                            variant="contained"
                                            disabled={submitting}
                                            sx={{
                                                backgroundColor: "#7d745c",
                                                borderRadius: 2,
                                                color: "#ffffff",
                                                textTransform: "none",
                                                "&:hover": {
                                                    backgroundColor: "#67604d"
                                                },
                                                "&.Mui-disabled": {
                                                    backgroundColor: "#5a5342",
                                                    color: "#ffffff !important",
                                                },
                                                mt: 1
                                            }}
                                        >
                                            {submitting ?
                                                <>
                                                    <CircularProgress size={20} sx={{ color: "#ffffff", mr: 2 }} />
                                                    Creando...
                                                </>
                                                :
                                                "Crear evento"
                                            }
                                        </Button>
                                    </Box>
                                </Box>
                            </Box>
                        </Modal>
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
                        <Stack direction={{ xs: "column", sm: "column", md: "row" }} justifyContent="space-between" alignItems="center" spacing={1}>
                            <Typography
                                id="modal-event-title"
                                variant="h5"
                                sx={{ fontWeight: 600, mb: 0 }}
                            >
                                {selectedEvent?.title}
                            </Typography>
                            <Typography variant="body1" sx={{ color: '#000000', mb: 0, display: 'flex', alignItems: 'center' }}>
                                {selectedEvent?.start?.toLocaleString('es-AR', {
                                    weekday: 'long',
                                    day: 'numeric',
                                    month: 'long',
                                    hour: '2-digit',
                                    minute: '2-digit'
                                })}
                            </Typography>
                        </Stack>
                        <Divider sx={{ borderColor: "rgba(0,0,0,0.1)", my: 1 }} />
                        <Typography id="modal-event-description" variant="body1" sx={{ mt: 2, color: '#000000' }}>
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
