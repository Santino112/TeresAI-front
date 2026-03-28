import { useEffect, useState, useRef } from "react";
import { Typography, Button, TextField, Box, Stack } from "@mui/material";
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
                    backgroundColor: "#2f342d",
                    p: 2
                }}
            >
                <Typography variant="h3" sx={{
                    mt: 2,
                    fontSize: {
                        xs: "1.7rem",
                        sm: "1.7rem",
                        md: "1.4rem",
                        lg: "1.5rem",
                        xl: "2rem"
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
                }}>En esta sección podrás tener una visualizacion de todos tus eventos agendados con teresa.
                </Typography>
                <Box sx={{mb: 2, width: "800px"}}>
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
            </Box>
        </Box>
    )
};

export default Calendar;