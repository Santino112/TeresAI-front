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
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "flex-start",
                        width: "100%",
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
                        textAlign: {xs: "center", sm: "center", md: "start"},
                        fontFamily: "'Lora', serif",
                        
                    }}>Calendario</Typography>
                    <Typography variant="body2" sx={{
                        my: 1,
                        fontSize: {
                            xs: "1rem",
                            sm: "1rem",
                            md: "1.2rem",
                            lg: "1.3rem",
                            xl: "1.3rem",
                        },
                        textAlign: {xs: "center", sm: "center", md: "start"},
                        fontFamily: "'Lora', serif",
                        lineHeight: 1.8,
                    }}>En esta sección podrás tener una visualización de todos tus eventos agendados con teresa. Puedes chequear por semana o mes.
                    </Typography>
                    <Divider sx={{
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