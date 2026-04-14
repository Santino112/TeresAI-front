import { useState, useEffect, useEffectEvent } from "react";
import { Typography, Button, TextField, Box, Divider, Select, MenuItem, Alert, Grid, Paper, Skeleton } from "@mui/material";
import { tomarDatosElder, actualizarDatosElders, actualizarDatosPerfiles } from "../../../exports/datosInicialesUsuarios";
import { useAuth } from "../../../../../auth/AuthContext";
import fondoChatAI from "../../../../../../assets/images/fondoChatAI.png";
import CircularProgress from '@mui/material/CircularProgress';

const ProfileElder = ({ profile, setProfile }) => {
    const [tieneEnfermedad, setTieneEnfermedad] = useState("seleccione");
    const [enfermedad, setEnfermedad] = useState("No");
    const [tomaMedicamentos, setTomaMedicamentos] = useState("seleccione");
    const [medicamentos, setMedicamentos] = useState("No");
    const [tieneAlergias, setTieneAlergias] = useState("seleccione");
    const [alergias, setAlergias] = useState("No");
    const [molestias, setMolestias] = useState("");
    const [gustos, setGustos] = useState("");
    //Toma de datos
    const [profileElder, setProfileElder] = useState(null);
    const [errorAlert, setErrorAlert] = useState(false);
    const [alertMessage, setAlertMessage] = useState("");
    const [severity, setSeverity] = useState("success");
    const [hasChanges, setHasChanges] = useState(false);
    const [loading, setLoading] = useState(false);
    const [loadingData, setLoadingData] = useState(true);
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

        const fetchInfoElder = async () => {
            setLoadingData(true);
            try {
                const data = await tomarDatosElder(user.id);
                if (data) {
                    setProfileElder(data);
                    setOriginalData(data);
                    setOriginalUsername(data.username);
                }
            } catch (error) {
                console.error("Error cargando datos:", error);
            } finally {
                setLoadingData(false);
            }
        };
        fetchInfoElder();
    }, [user]);

    useEffect(() => {
        if (!profileElder) return;

        if (profileElder.enfermedades === "No") {
            setTieneEnfermedad("no");
        } else {
            setTieneEnfermedad("si");
            setEnfermedad(profileElder.enfermedades);
        }

        if (profileElder.medicamentos === "No") {
            setTomaMedicamentos("no");
        } else {
            setTomaMedicamentos("si");
            setMedicamentos(profileElder.medicamentos);
        }

        if (profileElder.alergias === "No") {
            setTieneAlergias("no");
        } else {
            setTieneAlergias("si");
            setAlergias(profileElder.alergias);
        }

        setMolestias(profileElder.molestias);
        setGustos(profileElder.intereses);

        setDataLoaded(true);
    }, [profileElder]);

    useEffect(() => {
        if (!originalData || !dataLoaded) return;

        const changed = profile?.username !== originalUsername ||
            enfermedad !== originalData.enfermedades ||
            medicamentos !== originalData.medicamentos ||
            alergias !== originalData.alergias ||
            molestias !== originalData.molestias ||
            gustos !== originalData.intereses;
        setHasChanges(changed);
    }, [profile?.username, enfermedad, medicamentos, alergias, molestias, gustos, originalData, dataLoaded]);

    const handleUpdateDatos = async (e) => {
        e.preventDefault();
        if (loading || !hasChanges) return;

        if (tieneEnfermedad === "si" && !enfermedad.trim()) {
            setAlertMessage("Por favor, ingrese la/s enfermade/s que padece.");
            setErrorAlert(true);
            setSeverity("error");
            setTimeout(() => {
                setErrorAlert(false);
            }, 5000);
            return;
        } else if (tomaMedicamentos === "si" && !medicamentos.trim()) {
            setAlertMessage("Por favor, ingrese lo/s medicamento/s que toma.");
            setErrorAlert(true);
            setSeverity("error");
            setTimeout(() => {
                setErrorAlert(false);
            }, 5000);
            return;
        } else if (tieneAlergias === "si" && !alergias.trim()) {
            setAlertMessage("Por favor, ingrese la/s alergia/s que padece.");
            setErrorAlert(true);
            setSeverity("error");
            setTimeout(() => {
                setErrorAlert(false);
            }, 5000);
            return;
        }
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

        if (profile?.role === "elder") {
            const updateElder = await actualizarDatosElders(user.id, {
                enfermedades: enfermedad,
                medicamentos: medicamentos,
                alergias: alergias,
                molestias: molestias,
                intereses: gustos
            });
            if (!updateElder.success) {
                setAlertMessage(traducirError(updateElder.error));
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
                component="form"
                onSubmit={handleUpdateDatos}
                sx={{
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "flex-start",
                    width: "%100",
                    p: { xs: 2, sm: 3, md: 4 },
                    borderRadius: 4,
                    background: "transparent",
                    flexGrow: 0,
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
                    textAlign: { xs: "center", sm: "center", md: "start" },
                }}><strong>Perfil</strong> de usuario 🧞‍♂️</Typography>
                <Typography variant="body2" sx={{
                    my: 1,
                    fontSize: {
                        xs: "1rem",
                        sm: "1rem",
                        md: "1.2rem",
                        lg: "1.3rem",
                        xl: "1.3rem",
                    },
                    fontFamily: "'Lora', serif",
                    textAlign: { xs: "center", sm: "center", md: "start" },
                    lineHeight: 1.8,
                }}>Aquí podrás actualizar toda la información de tu usuario elder. Puedes agregar datos sobre tu salud, tus gustos, tus intereses, o cualquier información que quieras compartir para que la inteligencia artificial pueda conocerte mejor y brindarte una mejor experiencia.
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
                    <Grid size={12}>
                        <Box sx={{ my: 0, width: "100%" }}>
                            {loadingData ? (
                                <>
                                    <Skeleton animation="wave" variant="body1" sx={{ borderRadius: 2, mb: 1, bgcolor: "#4a4a4a" }} />
                                    <Skeleton animation="wave" variant="rectangular" height={50} sx={{ borderRadius: 2, mb: 1, bgcolor: "#4a4a4a" }} />
                                </>
                            ) : (
                                <>
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
                                </>
                            )}
                        </Box>
                    </Grid>
                    <Grid size={{
                        xs: 12,
                        sm: 12,
                        md: 12,
                        lg: 6
                    }}>
                        <Box sx={{ mb: 1, width: "100%" }}>
                            {loadingData ? (
                                <>
                                    <Skeleton animation="wave" variant="body1" sx={{ borderRadius: 2, mb: 1, mt: 1, bgcolor: "#4a4a4a" }} />
                                    <Skeleton animation="wave" variant="rectangular" height={50} sx={{ borderRadius: 2, mb: 1, bgcolor: "#4a4a4a" }} />
                                </>
                            ) : (
                                <>
                                    <Typography variant="body1" sx={{ fontFamily: "'Lora', serif", }}>¿Sufris de alguna enfermedad?</Typography>
                                    <Select
                                        value={tieneEnfermedad}
                                        onChange={(e) => {
                                            setTieneEnfermedad(e.target.value)
                                            e.target.value === "si" ? setEnfermedad("") : setEnfermedad("No")
                                        }
                                        }
                                        labelId="demo-simple-select-helper-label"
                                        id="demo-simple-select-helper"
                                        fullWidth
                                        MenuProps={{
                                            PaperProps: {
                                                sx: {
                                                    borderRadius: 3,
                                                    backgroundColor: "#303030",
                                                    color: "#ffffff",
                                                }
                                            },
                                            MenuListProps: { sx: { p: 0 } }
                                        }} sx={{
                                            backgroundColor: "#303030",
                                            borderRadius: 3,
                                            boxShadow: 3,
                                            mt: 1,
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
                                            mb: 1
                                        }}
                                    >
                                        <MenuItem value="seleccione" disabled>Seleccione</MenuItem>
                                        <MenuItem value="si">Si</MenuItem>
                                        <MenuItem value="no">No</MenuItem>
                                    </Select>
                                    {tieneEnfermedad === "si" && (
                                        <Box sx={{ width: "100%" }}>
                                            <Typography variant="body1" sx={{ fontFamily: "'Lora', serif", }}>¿Cúal/es? Escribilas</Typography>
                                            <TextField
                                                placeholder="Escribilas..."
                                                value={enfermedad}
                                                onChange={(e) => setEnfermedad(e.target.value)}
                                                variant="outlined"
                                                multiline
                                                minRows={4}
                                                maxRows={4}
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
                                    )}
                                </>
                            )
                            }
                        </Box>
                    </Grid>
                    <Grid size={{
                        xs: 12,
                        sm: 12,
                        md: 12,
                        lg: 6
                    }}>
                        <Box sx={{ my: 0, width: "100%" }}>
                            {loadingData ? (
                                <>
                                    <Skeleton animation="wave" variant="body1" sx={{ borderRadius: 2, mb: 1, mt: 1, bgcolor: "#4a4a4a" }} />
                                    <Skeleton animation="wave" variant="rectangular" height={50} sx={{ borderRadius: 2, mb: 1, bgcolor: "#4a4a4a" }} />
                                </>
                            ) : (
                                <>
                                    <Typography variant="body1" sx={{ fontFamily: "'Lora', serif", }}>¿Tomas medicamentos?</Typography>
                                    <Select
                                        value={tomaMedicamentos}
                                        onChange={(e) => {
                                            setTomaMedicamentos(e.target.value);
                                            e.target.value === "si" ? setMedicamentos("") : setMedicamentos("No")
                                        }
                                        }
                                        labelId="demo-simple-select-helper-label"
                                        id="demo-simple-select-helper"
                                        fullWidth
                                        MenuProps={{
                                            PaperProps: {
                                                sx: {
                                                    borderRadius: 3,
                                                    backgroundColor: "#303030",
                                                    color: "#ffffff",
                                                }
                                            },
                                            MenuListProps: { sx: { p: 0 } }
                                        }} sx={{
                                            backgroundColor: "#303030",
                                            borderRadius: 3,
                                            boxShadow: 3,
                                            mt: 1,
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
                                            mb: 1
                                        }}
                                    >
                                        <MenuItem value="seleccione" disabled>Seleccione</MenuItem>
                                        <MenuItem value="si">Si</MenuItem>
                                        <MenuItem value="no">No</MenuItem>
                                    </Select>
                                </>
                            )}
                            {tomaMedicamentos === "si" && (
                                <Box sx={{ width: "100%" }}>
                                    <Typography variant="body1" sx={{ fontFamily: "'Lora', serif", }}>¿Cúal/es? Escribilos</Typography>
                                    <TextField
                                        placeholder="Escribilos..."
                                        value={medicamentos}
                                        onChange={(e) => setMedicamentos(e.target.value)}
                                        variant="outlined"
                                        multiline
                                        minRows={4}
                                        maxRows={4}
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
                            )}
                        </Box>
                    </Grid>
                    <Grid size={12}>
                        <Box sx={{ my: 0, width: "100%" }}>
                            {loadingData ? (
                                <>
                                    <Skeleton animation="wave" variant="body1" sx={{ borderRadius: 2, mb: 1, mt: 1, bgcolor: "#4a4a4a" }} />
                                    <Skeleton animation="wave" variant="rectangular" height={50} sx={{ borderRadius: 2, mb: 1, bgcolor: "#4a4a4a" }} />
                                </>
                            ) : (
                                <>
                                    <Typography variant="body1" sx={{ fontFamily: "'Lora', serif", }}>¿Sufris de alergias?</Typography>
                                    <Select
                                        value={tieneAlergias}
                                        onChange={(e) => {
                                            setTieneAlergias(e.target.value)
                                            e.target.value === "si" ? setAlergias("") : setAlergias("No")
                                        }
                                        }
                                        labelId="demo-simple-select-helper-label"
                                        id="demo-simple-select-helper"
                                        fullWidth
                                        MenuProps={{
                                            PaperProps: {
                                                sx: {
                                                    borderRadius: 3,
                                                    backgroundColor: "#303030",
                                                    color: "#ffffff",
                                                }
                                            },
                                            MenuListProps: { sx: { p: 0 } }
                                        }} sx={{
                                            backgroundColor: "#303030",
                                            borderRadius: 3,
                                            boxShadow: 3,
                                            mt: 1,
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
                                            mb: 1
                                        }}
                                    >
                                        <MenuItem value="seleccione" disabled>Seleccione</MenuItem>
                                        <MenuItem value="si">Si</MenuItem>
                                        <MenuItem value="no">No</MenuItem>
                                    </Select>
                                </>
                            )}
                            {tieneAlergias === "si" && (
                                <Box sx={{ width: "100%" }}>
                                    <Typography variant="body1" sx={{ fontFamily: "'Lora', serif", }}>¿Cúal/es? Escribilas</Typography>
                                    <TextField
                                        placeholder="Escribilas..."
                                        value={alergias}
                                        onChange={(e) => setAlergias(e.target.value)}
                                        variant="outlined"
                                        multiline
                                        minRows={4}
                                        maxRows={4}
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
                            )}
                        </Box>
                    </Grid>
                    <Grid size={{
                        xs: 12,
                        sm: 12,
                        md: 12,
                        lg: 6
                    }}>
                        <Box sx={{ my: 0, width: "100%" }}>
                            {loadingData ? (
                                <>
                                    <Skeleton animation="wave" variant="body1" sx={{ borderRadius: 2, mb: 1, mt: 1, bgcolor: "#4a4a4a" }} />
                                    <Skeleton animation="wave" variant="rectangular" height={120} sx={{ borderRadius: 2, mb: 1, bgcolor: "#4a4a4a" }} />
                                </>
                            ) : (
                                <>
                                    <Typography variant="body1" sx={{ fontFamily: "'Lora', serif", }}>¿Hay algo que no te guste o te moleste?</Typography>
                                    <TextField
                                        placeholder="Escribilas..."
                                        value={molestias}
                                        onChange={(e) => setMolestias(e.target.value)}
                                        variant="outlined"
                                        multiline
                                        minRows={4}
                                        maxRows={4}
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
                                </>
                            )}
                        </Box>
                    </Grid>
                    <Grid size={{
                        xs: 12,
                        sm: 12,
                        md: 12,
                        lg: 6
                    }}>
                        <Box sx={{ my: 0, width: "100%" }}>
                            {loadingData ? (
                                <>
                                    <Skeleton animation="wave" variant="body1" sx={{ borderRadius: 2, mb: 1, mt: 1, bgcolor: "#4a4a4a" }} />
                                    <Skeleton animation="wave" variant="rectangular" height={120} sx={{ borderRadius: 2, mb: 1, bgcolor: "#4a4a4a" }} />
                                </>
                            ) : (
                                <>
                                    <Typography variant="body1" sx={{ fontFamily: "'Lora', serif", }}>¿Qué cosas te gustan hacer?</Typography>
                                    <TextField
                                        placeholder="Escribilas..."
                                        value={gustos}
                                        onChange={(e) => setGustos(e.target.value)}
                                        variant="outlined"
                                        multiline
                                        fullWidth
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
                                </>
                            )}
                        </Box>
                    </Grid>
                </Grid>
                <Box sx={{ width: { xs: "100%", sm: "100%", md: "100%", lg: "20%" }, mt: 2 }}>
                    <Button variant="contained" type="submit" fullWidth disabled={loading || !hasChanges}
                        sx={{
                            boxShadow: 3,
                            my: 1,
                            mb: 1,
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
    );
};

export default ProfileElder;