import React, { useEffect, useState } from 'react';
import {
    Typography, Box,
    Dialog, DialogTitle, DialogContent, DialogActions, Button, Grid, Divider,
    CircularProgress
} from '@mui/material';
import AirIcon from '@mui/icons-material/Air';
import WaterDropIcon from '@mui/icons-material/WaterDrop';
import ThermostatIcon from '@mui/icons-material/Thermostat';
import WbSunnyIcon from '@mui/icons-material/WbSunny';

const API_KEY = import.meta.env.VITE_WEATHER_API_KEY; // o process.env.REACT_APP_WEATHER_API_KEY si usás CRA
const CIUDAD = "Villa Maria, Cordoba, Argentina";

export default function Clima({ open, onClose }) {
    const [weatherData, setWeatherData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (!open) return;
        obtenerClima();
    }, [open]);

    async function obtenerClima() {
        setLoading(true);
        setError(null);
        try {
            const res = await fetch(
                `https://api.weatherapi.com/v1/current.json?key=${API_KEY}&q=${CIUDAD}&lang=es`
            );
            if (!res.ok) throw new Error("No se pudo obtener el clima.");
            const data = await res.json();

            setWeatherData({
                city: data.location.name,
                region: data.location.region,
                country: data.location.country,
                temp: Math.round(data.current.temp_c),
                thermal: Math.round(data.current.feelslike_c),
                humidity: data.current.humidity,
                wind: Math.round(data.current.wind_kph),
                uv: data.current.uv,
                condition: data.current.condition.text,
                icon: "https:" + data.current.condition.icon,
            });
        } catch (e) {
            setError(e.message);
        } finally {
            setLoading(false);
        }
    }

    return (
        <Dialog
            open={open}
            onClose={onClose}
            aria-labelledby="weather-dialog-title"
            maxWidth="xs"
            fullWidth
            PaperProps={{
                sx: {
                    borderRadius: 3,
                    width: "90%",
                    maxWidth: 500,
                    color: '#000000',
                    overflowY: "auto",
                    maxHeight: '90dvh',
                    bgcolor: "#ffffff",
                    border: '2px solid #000000',
                    boxShadow: 24,
                    outline: 'none',
                    p: { xs: 2, sm: 2, md: 3 },
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
                }
            }}
        >
            <DialogTitle sx={{ textAlign: 'flex-start', pb: 1 }}>
                <Typography variant="h5" sx={{ fontWeight: 600 }}>
                    {weatherData?.city}
                </Typography>
                <Typography variant="body1">
                    {weatherData ? `${weatherData.region}, ${weatherData.country}` : "Clima"}
                </Typography>
            </DialogTitle>
            <DialogContent sx={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
                {loading && (
                    <Box sx={{ p: 5, display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", gap: 2, flexGrow: 1 }}>
                        <Typography variant="h2" sx={{ fontSize: "1rem", fontFamily: "'Lora', serif", color: "#000000" }}>Cargando clima...</Typography>
                        <CircularProgress sx={{ color: "#000000" }} />
                    </Box>
                )}
                {error && (
                    <Typography color="error" sx={{ my: 2, fontSize: "1rem" }}>
                        {error}
                    </Typography>
                )}
                {weatherData && !loading && (
                    <>
                        <Box display="flex" flexDirection="row" justifyContent="flex-start" alignItems="center" my={1} sx={{
                            backgroundColor: "#f5f5f5",
                            boxShadow: 2,
                            width: "100%",
                            borderRadius: 3,
                        }}>
                            <Box>
                                <Box
                                    component="img"
                                    src={weatherData.icon}
                                    alt={weatherData.condition}
                                    sx={{ width: 100, height: 100 }}
                                />
                            </Box>
                            <Box>
                                <Typography variant="h3" sx={{ position: "relative", right: 10, fontSize: "3.5rem" }}>
                                    {weatherData.temp}°C
                                </Typography>
                                <Typography sx={{ fontSize: "1rem" }}>
                                    {weatherData.condition}
                                </Typography>
                            </Box>
                        </Box>

                        <Divider sx={{ borderColor: "rgba(0,0,0,0.1)", width: "100%", mt: 1 }} />
                        <Grid container spacing={3} sx={{ mt: 2 }}>
                            <Grid item size={6}>
                                <Box sx={{ backgroundColor: "#f5f5f5", borderRadius: 3, p: 2, textAlign: "flex-start", boxShadow: 2 }}>
                                    <ThermostatIcon sx={{ color: "#000000" }} />
                                    <Typography variant="body2">Sensación</Typography>
                                    <Typography variant="body1">{weatherData.thermal}°C</Typography>
                                </Box>
                            </Grid>
                            <Grid item size={6}>
                                <Box sx={{ backgroundColor: "#f5f5f5", borderRadius: 3, p: 2, textAlign: "flex-start", boxShadow: 2 }}>
                                    <WaterDropIcon sx={{ color: "#000000" }} />
                                    <Typography variant="body2">Humedad</Typography>
                                    <Typography variant="body1">{weatherData.humidity}%</Typography>
                                </Box>
                            </Grid>
                            <Grid item size={6}>
                                <Box sx={{ backgroundColor: "#f5f5f5", borderRadius: 3, p: 2, textAlign: "flex-start", boxShadow: 2 }}>
                                    <AirIcon sx={{ color: "#000000" }} />
                                    <Typography variant="body2">Viento</Typography>
                                    <Typography variant="body1">{weatherData.wind} km/h</Typography>
                                </Box>
                            </Grid>
                            <Grid item size={6}>
                                <Box sx={{ backgroundColor: "#f5f5f5", borderRadius: 3, p: 2, textAlign: "flex-start", boxShadow: 2 }}>
                                    <WbSunnyIcon sx={{ color: "#000000" }} />
                                    <Typography variant="body2">Índice UV</Typography>
                                    <Typography variant="body1">{weatherData.uv}</Typography>
                                </Box>
                            </Grid>
                        </Grid>
                    </>
                )}
            </DialogContent>
            <DialogActions sx={{ justifyContent: 'flex-end', mt: 1 }}>
                <Button onClick={onClose} variant="outlined" sx={{
                    backgroundColor: "#7d745c",
                    color: "#ffffff",
                    borderRadius: 2,
                    textTransform: "none",
                    "&:hover": { backgroundColor: "#67604d" },
                    fontSize: "1rem",
                }}>
                    Cerrar
                </Button>
            </DialogActions>
        </Dialog>
    );
}