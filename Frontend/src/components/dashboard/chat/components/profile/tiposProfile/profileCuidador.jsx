import { useState, useEffect, useEffectEvent } from "react";
import { Typography, Button, TextField, Box, Paper, Divider, Alert, FormControlLabel, Checkbox, Grid } from "@mui/material";
import { tomarDatosCuidadores, actualizarDatosCuidadores, actualizarDatosPerfiles } from "../../../exports/datosInicialesUsuarios";
import { useAuth } from "../../../../../auth/AuthContext";
import CircularProgress from '@mui/material/CircularProgress';


const ProfileCuidador = ({ profile, setProfile }) => {
    const [geriatrico, setGeriatrico] = useState("");
    const [numAdultos, setNumAdultos] = useState("");
    const [infoEspecifica, setInfoEspecifica] = useState("");
    const [sinGeriatrico, setSinGeriatrico] = useState(false);
    //Tomar datos
    const [profileCuidador, setProfileCuidador] = useState(null);
    const [errorAlert, setErrorAlert] = useState(false);
    const [alertMessage, setAlertMessage] = useState("");
    const [severity, setSeverity] = useState("success");
    const [hasChanges, setHasChanges] = useState(false);
    const [loading, setLoading] = useState(false);
    const [dataLoaded, setDataLoaded] = useState(false);
    const [originalData, setOriginalData] = useState(null);
    const [originalUsername, setOriginalUsername] = useState(null);

    const { user } = useAuth();

    const traducirError = (mensaje) => {
        const errores = {
            "Too many request": "Demasiados intentos, esperá unos minutos.",
            "User not found": "No existe una cuenta con ese email asociado.",
            "Network request failed": "Error de conexión, revisá tu internet.",
            "duplicate key value": "Ya existe un perfil para este usuario.",
            "violates foreign key constraint": "Error de referencia, intentá de nuevo.",
            "no rows updated": "No se encontró el registro a actualizar.",
            "permission denied": "No tenés permiso para actualizar estos datos.",
            "value too long": "Uno de los campos tiene demasiados caracteres.",
        };
        const key = Object.keys(errores).find(k => mensaje?.includes(k));
        return key ? errores[key] : "Ocurrió un error, intentalo de nuevo.";
    };

    useEffect(() => {
        if (!user) return;

        const fetchInfoCuidador = async () => {
            const data = await tomarDatosCuidadores(user.id);
            if (data) {
                setProfileCuidador(data);
                setOriginalData(data);
            }
        };
        fetchInfoCuidador();
        setOriginalUsername(profile?.username);
    }, [user]);

    useEffect(() => {
        if (!profileCuidador) return;

        setGeriatrico(profileCuidador.geriatrico || "");
        setNumAdultos(profileCuidador.adultosmayores || "");
        setInfoEspecifica(profileCuidador.infoamonitorear || "");
        setDataLoaded(true);
    }, [profileCuidador]);

    useEffect(() => {
        if (!originalData || !dataLoaded) return;

        const changed = profile?.username !== originalUsername ||
            geriatrico !== originalData.geriatrico ||
            numAdultos !== originalData.adultosmayores ||
            infoEspecifica !== originalData.infoamonitorear
        setHasChanges(changed);
    }, [profile?.username, geriatrico, numAdultos, infoEspecifica, originalData, dataLoaded]);

    const handleUpdateCuidador = async (e) => {
        e.preventDefault();
        if (loading || !hasChanges) return;
        setLoading(true);

        const succesStore = await actualizarDatosPerfiles(user.id, {
            username: profile?.username,
        });

        if (!succesStore.success) {
            setAlertMessage("Ocurrió un error al guardar tu perfil, intentá de nuevo.");
            setErrorAlert(true);
            setSeverity("error");
            setTimeout(() => {
                setErrorAlert(false)
                setErrorTextFields(false)
            }, 5000);
            setLoading(false);
            return;
        }

        if (profile?.role === "cuidador") {
            const updateCuidador = await actualizarDatosCuidadores(user.id, {
                geriatrico: geriatrico,
                adultosmayores: numAdultos,
                infoamonitorear: infoEspecifica,
            });
            if (!updateCuidador.success) {
                setAlertMessage(traducirError(updateCuidador.error));
                setErrorAlert(true);
                setSeverity("error");
                setTimeout(() => {
                    setErrorAlert(false);
                }, 5000);
                setLoading(false);
                return;
            } else {
                setAlertMessage("El perfil se actualizó correctamente.");
                setErrorAlert(true);
                setSeverity("success");
                setTimeout(() => {
                    setErrorAlert(false);
                }, 5000);
                setLoading(false);
                return;
            }
        }
    };

    return (
        <>
            {errorAlert ?
                <Alert
                    variant="filled"
                    severity={severity}
                    sx={{
                        position: "fixed",
                        width: {
                            xs: "85%",
                            sm: "auto",
                            md: "auto",
                            lg: "auto",
                            xl: "auto"
                        },
                        top: 20,
                        left: "50%",
                        color: "#ffffff",
                        transform: "translateX(-50%)",
                        zIndex: 9999,
                        boxShadow: 4,
                        borderRadius: 3,
                        fontSize: "1rem",
                        fontFamily: "'Lora', serif",
                    }}
                >{alertMessage}</Alert>
                :
                null
            }
            <Paper
                name="form-familiar"
                component="form"
                onSubmit={handleUpdateCuidador}
                sx={{
                    width: {
                        xs: "100%",
                        sm: "80%",
                        md: "70%",
                        lg: "75%",
                        xl: "60%",
                    },
                    p: { xs: 2, sm: 3, md: 4 },
                    borderRadius: 4,
                    background: "transparent",
                    my: 1
                }}
            >
                <Typography variant="h2" sx={{
                    fontSize: {
                        xs: "1.2rem",
                        sm: "1.3rem",
                        md: "1.5rem",
                        lg: "1.7rem",
                        xl: "1.8rem"
                    },
                    fontFamily: "'Lora', serif",
                    textAlign: "center"
                }}><strong>Perfil</strong> de usuario</Typography>
                <Typography variant="body2" sx={{
                    mb: 1,
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
                }}>Aquí podras actualizar toda la información de tu usuario cuidador
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
                <Grid container spacing={2}>
                    <Grid size={{
                        xs: 12,
                        sm: 12,
                        md: 12,
                        lg: 6
                    }}>
                        <Box sx={{ my: 0, width: "100%" }}>
                            <Typography variant="body1" sx={{ fontFamily: "'Lora', serif", }}>¿Cómo te llamas?</Typography>
                            <TextField
                                value={profile?.username}
                                onChange={(e) => setProfile({ ...profile, username: e.target.value })}
                                placeholder="Nombre completo"
                                variant="outlined"
                                fullWidth
                                margin="dense"
                                sx={{
                                    backgroundColor: "#303030",
                                    borderRadius: 3,
                                    boxShadow: 3,
                                    input: { color: "white" },
                                    "& .MuiOutlinedInput-root": {
                                        borderRadius: 3,
                                        pr: 1,
                                    },
                                    "& fieldset": {
                                        borderColor: "transparent"
                                    },
                                    "&:hover fieldset": {
                                        borderColor: "transparent"
                                    },
                                    "&.Mui-focused fieldset": {
                                        borderColor: "gray"
                                    }
                                }}
                            ></TextField>
                        </Box>
                    </Grid>
                    <Grid size={{
                        xs: 12,
                        sm: 12,
                        md: 12,
                        lg: 6
                    }}>
                        <Box sx={{ my: 0, width: "100%" }}>
                            <Typography variant="body1" sx={{ fontFamily: "'Lora', serif", }}>¿En qué geriátrico trabajas?</Typography>
                            <TextField
                                value={geriatrico}
                                onChange={(e) => setGeriatrico(e.target.value)}
                                placeholder="Nombre"
                                variant="outlined"
                                fullWidth
                                margin="dense"
                                sx={{
                                    backgroundColor: "#303030",
                                    borderRadius: 3,
                                    boxShadow: 3,
                                    input: { color: "white" },
                                    "& .MuiOutlinedInput-root": {
                                        borderRadius: 3,
                                        pr: 1,
                                    },
                                    "& fieldset": {
                                        borderColor: "transparent"
                                    },
                                    "&:hover fieldset": {
                                        borderColor: "transparent"
                                    },
                                    "&.Mui-focused fieldset": {
                                        borderColor: "gray"
                                    },
                                    "& .MuiOutlinedInput-root.Mui-disabled fieldset": {
                                        borderColor: "transparent",
                                    }
                                }}
                            ></TextField>
                        </Box>
                        <Box sx={{ width: "100%" }}>
                            <FormControlLabel
                                control={
                                    <Checkbox
                                        onChange={(e) => {
                                            setSinGeriatrico(e.target.checked);
                                            e.target.checked ? setGeriatrico("No trabajo en un geriátrico") : setGeriatrico("");
                                        }
                                        }
                                    />
                                }
                                label={
                                    <Typography variant="body1" sx={{ fontFamily: "'Lora', serif" }}>No trabajo en un geriátrico</Typography>
                                }
                            />
                        </Box>
                    </Grid>
                    <Grid size={{
                        xs: 12,
                        sm: 12,
                        md: 12,
                        lg: 5
                    }}>
                        <Box sx={{ my: 0, width: "100%" }}>
                            <Typography variant="body1" sx={{ fontFamily: "'Lora', serif" }}>¿Cuántos adultos mayores tenes a tu cargo?</Typography>
                            <TextField
                                value={numAdultos}
                                onChange={(e) => setNumAdultos(e.target.value)}
                                placeholder=""
                                type="number"
                                variant="outlined"
                                fullWidth
                                margin="dense"
                                sx={{
                                    backgroundColor: "#303030",
                                    borderRadius: 3,
                                    boxShadow: 3,
                                    input: { color: "white" },
                                    "& .MuiOutlinedInput-root": {
                                        borderRadius: 3,
                                        pr: 1,
                                    },
                                    "& fieldset": {
                                        borderColor: "transparent"
                                    },
                                    "&:hover fieldset": {
                                        borderColor: "transparent"
                                    },
                                    "&.Mui-focused fieldset": {
                                        borderColor: "gray"
                                    }
                                }}
                            ></TextField>
                        </Box>

                    </Grid>
                    <Grid size={{
                        xs: 12,
                        sm: 12,
                        md: 12,
                        lg: 7
                    }}>
                        <Box sx={{ my: 0, width: "100%" }}>
                            <Typography variant="body1" sx={{ fontFamily: "'Lora', serif", }}>¿Hay algo especifico que necesites monitorear?</Typography>
                            <TextField
                                value={infoEspecifica}
                                onChange={(e) => setInfoEspecifica(e.target.value)}
                                placeholder="Escribilo..."
                                variant="outlined"
                                fullWidth
                                multiline
                                minRows={4}
                                maxRows={4}
                                margin="dense"
                                sx={{
                                    backgroundColor: "#303030",
                                    borderRadius: 3,
                                    boxShadow: 3,
                                    input: { color: "white" },
                                    "& .MuiOutlinedInput-root": {
                                        borderRadius: 3,
                                        pr: 1,
                                    },
                                    "& fieldset": {
                                        borderColor: "transparent"
                                    },
                                    "&:hover fieldset": {
                                        borderColor: "transparent"
                                    },
                                    "&.Mui-focused fieldset": {
                                        borderColor: "gray"
                                    }
                                }}
                            ></TextField>
                        </Box>
                    </Grid>
                </Grid>
                <Box sx={{ width: { xs: "100%", sm: "100%", md: "100%", lg: "30%" }, mt: 2 }}>
                    <Button variant="contained" type="submit" fullWidth disabled={loading || !hasChanges}
                        sx={{
                            boxShadow: 3,
                            color: "#ffffff",
                            backgroundColor: "#0978a0",
                            fontFamily: "'Lora', serif",
                            fontWeight: "bold",
                            "&:hover": {
                                backgroundColor: "#066688",
                            }
                        }}>{loading ? (
                            <>
                                <CircularProgress size={20} sx={{ color: "#ffffff", mr: 2 }} />
                                Guardando...
                            </>
                        ) : "Actualizar"}
                    </Button>
                </Box>
            </Paper>
        </>
    )
};

export default ProfileCuidador;