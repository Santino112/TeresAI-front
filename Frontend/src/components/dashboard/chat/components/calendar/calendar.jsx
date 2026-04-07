import { Typography, Box, Paper, Divider } from "@mui/material";
import fondoChatAI from "../../../../../assets/images/fondoChatAI.png";
import BotonCalendar from '../buttons/botonCalendar';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';

const Calendar = () => {
    return (
        <Box
            sx={{
                flexGrow: 1,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                width: "100%",
                overflowY: "auto",
                overflowX: "hidden",
                minHeight: 0,
            }}
        >
            <Box
                sx={{
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                    alignItems: "center",
                    flexGrow: 1,
                    width: "100%",
                    background: `url(${fondoChatAI})`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                    backgroundRepeat: "no-repeat",
                    p: 2
                }}
            >
                <Paper
                    sx={{
                        width: {
                            xs: "100%",
                            sm: "80%",
                            md: "70%",
                            lg: "75%",
                            xl: "60%",
                        },
                        p: { xs: 2, sm: 3, md: 3 },
                        borderRadius: 4,
                        background: "transparent",
                        flexGrow: 0,
                        scrollbarWidth: 'thin',
                        scrollbarColor: '#404040 transparent',

                        /* Chrome / Edge / Safari */
                        '&::-webkit-scrollbar': {
                            width: '6px',
                        },
                        '&::-webkit-scrollbar-track': {
                            background: 'transparent',
                        },
                        '&::-webkit-scrollbar-thumb': {
                            backgroundColor: '#2f2f2f',
                            borderRadius: '8px',
                        },
                        '&::-webkit-scrollbar-thumb:hover': {
                            backgroundColor: '#444',
                        },
                    }}
                >
                    <Typography variant="h3" sx={{
                        fontSize: {
                            xs: "1.5rem",
                            sm: "1.5rem",
                            md: "1.5rem",
                            lg: "1.7rem",
                            xl: "1.8rem"
                        },
                        fontFamily: "'Lora', serif",
                        textAlign: "center"
                    }}>Calendario</Typography>
                    <Typography variant="body2" sx={{
                        my: 2,
                        fontSize: {
                            xs: "1rem",
                            sm: "1rem",
                            md: "1.2rem",
                            lg: "1.3rem",
                            xl: "1.3rem",
                        },
                        fontFamily: "'Lora', serif",
                        textAlign: "center",
                        lineHeight: 1.8,
                    }}>En esta sección podrás tener una visualización de todos tus eventos agendados con teresa. Puedes chequear por semana o mes.
                    </Typography>
                    <Divider sx={{
                        my: 1,
                        width: "100%",
                        "&::before, &::after": {
                            borderColor: "#ffffff",
                        }
                    }}>
                        <Typography variant="body1" sx={{ color: "#ffffff" }}>~</Typography>
                    </Divider>
                    <Box sx={{
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
                            }
                        },
                        "& .fc-toolbar-title": {
                            fontSize: "1rem !important",

                        },
                        "& .fc-col-header-cell": {
                            fontSize: "0.85rem !important",
                        },
                        "& .fc-daygrid-day-number": {
                            fontSize: "0.85rem !important",
                        }
                    }}>
                        <BotonCalendar />
                        <FullCalendar
                            plugins={[dayGridPlugin, timeGridPlugin]}
                            initialView="dayGridMonth"
                            locale="es"
                            headerToolbar={{
                                left: 'prev,next today',
                                center: 'title',
                                right: 'dayGridMonth,timeGridWeek'
                            }}

                        />
                    </Box>
                </Paper>
            </Box>
        </Box>
    )
};

export default Calendar;