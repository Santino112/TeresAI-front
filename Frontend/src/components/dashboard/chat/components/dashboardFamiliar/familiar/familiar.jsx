import { useEffect, useState, useRef } from "react";
import { Typography, Button, TextField, Box, Stack, Paper, Divider, Grid } from "@mui/material"
import fondoChatAI from "../../../../../../assets/images/fondoChatAI.png";
import ElderlyRoundedIcon from "@mui/icons-material/ElderlyRounded";
import { BarChart } from '@mui/x-charts/BarChart';
import { PieChart } from '@mui/x-charts/PieChart';
import { Gauge } from '@mui/x-charts/Gauge';

const Familiar = () => {
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
                    border: "2px solid red",
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
                <Typography variant="h3" sx={{
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
                }}>Mi familiar <ElderlyRoundedIcon fontSize="medium" sx={{ color: "#000000", ml: 1 }} /></Typography>
                <Typography variant="body2" sx={{
                    color: "#000000",
                    my: 1,
                    fontSize: {
                        xs: "1rem",
                        sm: "1rem",
                        md: "1.2rem",
                        lg: "1.3rem",
                        xl: "1.3rem",
                    },
                    textAlign: { xs: "center", sm: "center", md: "start" },
                    lineHeight: 1.8,
                }}>En esta sección podrás tener una visualización de todos tus eventos agendados con teresa. Puedes chequear por semana o mes.
                </Typography>
                <Divider sx={{ borderColor: "rgba(0,0,0,0.1)", my: 1, mb: 2 }} />
                <Grid container spacing={3} sx={{ mt: 1 }}>
                    {/* 1. Gráfico de Barras: Ancho completo (xs={12}) */}
                    <Grid item xs={12}>
                        <Paper sx={{ borderRadius: 3, background: "gray", color: "#000000", boxShadow: 'none', border: '1px solid rgba(0,0,0,0.05)' }}>
                            <Typography variant="subtitle2" sx={{ mb: 2, fontWeight: 600 }}>
                                Auditoría de Eventos Agendados
                            </Typography>
                            <Box sx={{ width: '100%', height: 350 }}>
                                <BarChart
                                    xAxis={[{
                                        scaleType: 'band',
                                        data: ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'],
                                        categoryGapRatio: 0.3
                                    }]}
                                    series={[
                                        { data: [2, 3, 1, 2, 1, 0, 1], label: 'Médicos', color: '#7d745c' },
                                    ]}
                                    height={200}
                                    width={1600}
                                    margin={{ top: 10, bottom: 30, left: 40, right: 10 }}
                                    slotProps={{
                                        legend: {
                                            direction: 'row',
                                            position: { vertical: 'bottom', horizontal: 'center' },
                                        },
                                    }}
                                />
                            </Box>
                        </Paper>
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <Paper sx={{ p: 2, borderRadius: 3, height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                            <Typography variant="subtitle2" sx={{ width: '100%', mb: 1, fontWeight: 600 }}>Cumplimiento Semanal</Typography>
                            <Box sx={{ width: "100%", height: 200 }}>
                                <Gauge
                                    value={78}
                                    startAngle={-110}
                                    endAngle={110}
                                    height={200}
                                    sx={{
                                        [`& .MuiGauge-valueText`]: { fontSize: 28, fontWeight: 'bold', fill: "#000000" },
                                        [`& .MuiGauge-valueArc`]: { fill: '#7d745c' },
                                        [`& .MuiGauge-referenceArc`]: {
                                            fill: 'rgba(0, 0, 0, 0.1)', // Color del fondo del arco (gris clarito)
                                        },
                                    }}

                                    text={({ value }) => `${value}%`}
                                />
                            </Box>
                        </Paper>
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <Paper sx={{ p: 2, borderRadius: 3, height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                            <Typography variant="subtitle2" sx={{ width: '100%', mb: 1, fontWeight: 600 }}>Nivel de Felicidad</Typography>
                            <Box sx={{ width: "100%", height: 200 }}>
                                <Gauge
                                    value={92}
                                    startAngle={-110}
                                    endAngle={110}
                                    height={200}
                                    sx={{
                                        [`& .MuiGauge-valueText`]: { fontSize: 28, fontWeight: 'bold' },
                                        [`& .MuiGauge-valueArc`]: { fill: '#a59d84' }
                                    }}
                                    text={({ value }) => `${value}%`}
                                />
                            </Box>
                        </Paper>
                    </Grid>
                </Grid>
            </Paper>
        </Box>
    );
};

export default Familiar;