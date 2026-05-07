import { useState, useEffect } from "react";
import { Typography, Button, TextField, Box, Divider, Select, MenuItem, Alert, Grid, Paper, Skeleton, InputAdornment, IconButton } from "@mui/material";
import { tomarDatosElder, actualizarDatosElders, actualizarDatosPerfiles, updateEmail, updateContraseña } from "../../../exports/datosInicialesUsuarios.js";
import { useAuth } from "../../../../../auth/useAuth.jsx";
import CircularProgress from '@mui/material/CircularProgress';
import InsertEmoticonRoundedIcon from '@mui/icons-material/InsertEmoticonRounded';
import EmailRoundedIcon from '@mui/icons-material/EmailRounded';
import MarkEmailReadRoundedIcon from '@mui/icons-material/MarkEmailReadRounded';
import PasswordRoundedIcon from '@mui/icons-material/PasswordRounded';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffRoundedIcon from '@mui/icons-material/VisibilityOffRounded';
import Diversity1RoundedIcon from '@mui/icons-material/Diversity1Rounded';
import FamilyRestroomRoundedIcon from '@mui/icons-material/FamilyRestroomRounded';
import BadgeRoundedIcon from '@mui/icons-material/BadgeRounded';
import PersonAddAlt1RoundedIcon from '@mui/icons-material/PersonAddAlt1Rounded';

const ProfileElder = ({ profile, setProfile }) => {
    const [usernameLocal, setUsernameLocal] = useState(profile?.username || "");
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
    //para actualizar email
    const [nuevoEmail, setNuevoEmail] = useState("");
    const [loadingEmail, setLoadingEmail] = useState(false);
    //para actualizar contraseña
    const [nuevaContraseña, setNuevaContraseña] = useState("");
    const [repetirContraseña, setRepetirContraseña] = useState("");
    const [loadingContraseña, setLoadingContraseña] = useState(false);
    //
    const [showPassword, setShowPassword] = useState(false);

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

    const handleShowPassword = () => {
        setShowPassword((prev) => !prev);
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
        if (!dataLoaded) return;

        localStorage.setItem(`draft_familiar_${user?.id}`, JSON.stringify({
            username: usernameLocal,
            enfermedad,
            medicamentos,
            alergias,
            gustos,
            molestias
        }));
    }, [usernameLocal, enfermedad, medicamentos, alergias, gustos, molestias, dataLoaded]);

    useEffect(() => {
        if (!profileElder || !profile || originalUsername !== null) return;

        const draft = localStorage.getItem(`draft_familiar_${user?.id}`);
        if (draft) {
            const parsed = JSON.parse(draft);
            setUsernameLocal(parsed.username || profile?.username);
            setProfile({ ...profile, username: parsed.username });
            setTieneEnfermedad(parsed.enfermedad === "No" ? "no" : "si");
            setTomaMedicamentos(parsed.medicamentos === "No" ? "no" : "si");
            setTieneAlergias(parsed.alergias === "No" ? "no" : "si");
            setEnfermedad(parsed.enfermedad || "No");
            setMedicamentos(parsed.medicamentos || "No");
            setAlergias(parsed.alergias || "No");
            setGustos(parsed.gustos || "");
            setMolestias(parsed.molestias || "");
            setOriginalUsername(profile?.username);
            setDataLoaded(true);
        } else {
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
        }

        setOriginalUsername(profile?.username);
        setDataLoaded(true);
    }, [profileElder, profile]);

    useEffect(() => {
        if (!originalData || !dataLoaded) return;

        const changed = usernameLocal !== originalUsername ||
            enfermedad !== originalData.enfermedades ||
            medicamentos !== originalData.medicamentos ||
            alergias !== originalData.alergias ||
            molestias !== originalData.molestias ||
            gustos !== originalData.intereses;
        setHasChanges(changed);
    }, [usernameLocal, enfermedad, medicamentos, alergias, molestias, gustos, originalData, dataLoaded]);

    //Actualizar email
    const handleUpdateEmail = async (e) => {
        e.preventDefault();
        if (loadingEmail) return;
        if (!nuevoEmail.trim()) {
            setAlertMessage("Ingresá un email nuevo.");
            setErrorAlert(true);
            setSeverity("error");
            setTimeout(() => setErrorAlert(false), 5000);
            return;
        };
        if (nuevoEmail === user.email) {
            setAlertMessage("El email nuevo debe ser distinto al actual.");
            setErrorAlert(true);
            setSeverity("error");
            setTimeout(() => setErrorAlert(false), 5000);
            return;
        }
        setLoadingEmail(true);

        const successStore = await updateEmail(user.id, { nuevoEmail });

        if (!successStore.success) {
            setAlertMessage(traducirError(successStore.message));
            setErrorAlert(true);
            setSeverity("error");
            setTimeout(() => {
                setErrorAlert(false);
            }, 5000);
            setLoadingEmail(false);
            return;
        }
        setAlertMessage(successStore.message);
        setErrorAlert(true);
        setSeverity("success");
        setTimeout(() => {
            setErrorAlert(false);
        }, 5000);
        setLoadingEmail(false);
    };

    //Actualizar contraseña
    const hanbldeUpdateContraseña = async (e) => {
        e.preventDefault();
        if (loadingContraseña) return;
        if (nuevaContraseña !== repetirContraseña) {
            setAlertMessage("Las contraseñas no coinciden.");
            setErrorAlert(true);
            setSeverity("error");
            setTimeout(() => setErrorAlert(false), 5000);
            return;
        }

        if (nuevaContraseña.length < 6) {
            setAlertMessage("La contraseña debe tener al menos 6 caracteres.");
            setErrorAlert(true);
            setSeverity("error");
            setTimeout(() => setErrorAlert(false), 5000);
            return;
        }
        setLoadingContraseña(true);

        const successStore = await updateContraseña(user.id, { nuevaContraseña });

        if (!successStore.success) {
            setAlertMessage(traducirError(successStore.message));
            setErrorAlert(true);
            setSeverity("error");
            setTimeout(() => {
                setErrorAlert(false);
            }, 5000);
            setLoadingContraseña(false);
            return;
        }
        setAlertMessage(successStore.message);
        setErrorAlert(true);
        setSeverity("success");
        setTimeout(() => {
            setErrorAlert(false);
        }, 5000);
        setLoadingContraseña(false);
        setNuevaContraseña("");
        setRepetirContraseña("");
    };

    const handleUpdateUser = async (e) => {
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
                setErrorAlert(false);
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
                localStorage.removeItem(`draft_familiar_${user?.id}`);
                setOriginalUsername(profile?.username);
                setOriginalData({
                    ...originalData,
                    enfermedades: enfermedad,
                    medicamentos: medicamentos,
                    alergias: alergias,
                    intereses: gustos,
                    molestias: molestias
                })
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
                    variant="filled"
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
                    }}
                >{alertMessage}</Alert>
                :
                null
            }
            <Paper
                sx={{
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "flex-start",
                    width: "100%",
                    p: { xs: 2, sm: 2, md: 2 },
                    boxShadow: 0,
                    borderRadius: 3,
                    boxShadow: 0,
                    background: "transparent",
                    flexGrow: 0,
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
                }}>Perfil <InsertEmoticonRoundedIcon fontSize="medium" sx={{ color: "#000000", ml: 1 }} /></Typography>
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
                }}>Aquí podrás actualizar toda la información de tu usuario elder. Puedes agregar datos sobre tu salud, tus gustos, tus intereses, o cualquier información que quieras compartir para que la inteligencia artificial pueda conocerte mejor y brindarte una mejor experiencia.
                </Typography>
                <Divider sx={{ borderColor: "rgba(0,0,0,0.1)", my: 1, mb: 2 }} />
                <Paper sx={{
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "flex-start",
                    width: "100%",
                    borderRadius: 4,
                    background: "transparent",
                    boxShadow: 0,
                    flexGrow: 0,
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
                }}>
                    <Grid container spacing={3}>
                        <Grid size={{
                            xs: 12,
                            sm: 12,
                            md: 12,
                            lg: 6
                        }}>
                            <Paper
                                sx={{
                                    display: "flex",
                                    flexDirection: "column",
                                    justifyContent: "flex-start",
                                    width: "100%",
                                    height: "100%",
                                    p: { xs: 2, sm: 3, md: 3 },
                                    borderRadius: 4,
                                    boxShadow: 3,
                                    background: "transparent",
                                    flexGrow: 0,
                                }}>
                                <Typography variant="h3" sx={{
                                    color: "#000000",
                                    fontSize: {
                                        xs: "1.4rem",
                                        sm: "1.4rem",
                                        md: "1.4rem",
                                        lg: "1.5rem",
                                        xl: "1.5rem"
                                    },
                                    textAlign: { xs: "center", sm: "center", md: "start" },
                                }}>Actualizar datos de la cuenta</Typography>
                                <Divider sx={{ borderColor: "rgba(0,0,0,0.1)", my: 1, mb: 2 }} />
                                <Typography variant="body2" sx={{
                                    my: 1,
                                    color: "#000000",
                                    fontSize: {
                                        xs: "1.1rem",
                                        sm: "1.1rem",
                                        md: "1.2rem",
                                        lg: "1.3rem",
                                        xl: "1.3rem",
                                    },
                                    textAlign: { xs: "center", sm: "center", md: "start" },
                                    lineHeight: 1.8,
                                }}>Actualizar email con el que te registraste
                                </Typography>
                                <Grid container spacing={2}>
                                    <Grid size={12}>
                                        <Paper
                                            component="form"
                                            onSubmit={handleUpdateEmail}
                                            sx={{
                                                display: "flex",
                                                flexDirection: "column",
                                                boxShadow: 0,
                                                justifyContent: "flex-start",
                                                width: "100%",
                                                height: "100%",
                                                borderRadius: 4,
                                                background: "transparent",
                                                flexGrow: 0,
                                            }}>
                                            <Grid container spacing={2}>
                                                <Grid size={{
                                                    xs: 12,
                                                    sm: 12,
                                                    md: 12,
                                                    lg: 12,
                                                    xl: 6
                                                }} >
                                                    <Box sx={{ my: 0, width: "100%" }}>
                                                        <Typography variant="body1" sx={{ color: "#000000" }}>Email actual</Typography>
                                                        <TextField
                                                            type="email"
                                                            disabled
                                                            placeholder={profile?.email}
                                                            variant="outlined"
                                                            fullWidth
                                                            margin="dense"
                                                            sx={{
                                                                backgroundColor: "#d7d6d6",
                                                                borderRadius: 3,
                                                                boxShadow: 3,
                                                                "& .MuiInputBase-input.Mui-disabled": {
                                                                    color: "#000000",
                                                                    WebkitTextFillColor: "#000000",
                                                                },
                                                                "& .MuiInputBase-input::placeholder": {
                                                                    color: "#000000",
                                                                    opacity: 1,
                                                                },
                                                                "& .MuiOutlinedInput-root.Mui-disabled .MuiInputBase-input::placeholder": {
                                                                    color: "#444444",
                                                                    opacity: 1,
                                                                    WebkitTextFillColor: "#444444",
                                                                },
                                                            }}
                                                            InputProps={{
                                                                startAdornment: (
                                                                    <InputAdornment position="start">
                                                                        <Box sx={{ display: "flex", alignItems: "center", justifyContent: "flex-start", color: "#ffffff" }}>
                                                                            <MarkEmailReadRoundedIcon fontSize='medium' sx={{ mr: 1, color: "#000000" }}></MarkEmailReadRoundedIcon>
                                                                        </Box>
                                                                    </InputAdornment>
                                                                ),
                                                            }}
                                                        ></TextField>
                                                    </Box>
                                                </Grid>
                                                <Grid size={{
                                                    xs: 12,
                                                    sm: 12,
                                                    md: 12,
                                                    lg: 12,
                                                    xl: 6
                                                }}>
                                                    <Box sx={{ my: 0, width: "100%" }}>
                                                        <Typography variant="body1" sx={{ color: "#000000" }}>Email nuevo</Typography>
                                                        <TextField
                                                            type="email"
                                                            value={nuevoEmail}
                                                            onChange={(e) => setNuevoEmail(e.target.value)}
                                                            placeholder="Email nuevo"
                                                            variant="outlined"
                                                            fullWidth
                                                            margin="dense"
                                                            sx={{
                                                                backgroundColor: "#d7d6d6",
                                                                color: "#000000",
                                                                borderRadius: 3,
                                                                boxShadow: 3,
                                                                input: { color: "#000000" },
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
                                                            }}
                                                            InputProps={{
                                                                startAdornment: (
                                                                    <InputAdornment position="start">
                                                                        <Box sx={{ display: "flex", alignItems: "center", justifyContent: "flex-start", color: "#ffffff" }}>
                                                                            <EmailRoundedIcon fontSize='medium' sx={{ mr: 1, color: "#000000" }}></EmailRoundedIcon>
                                                                        </Box>
                                                                    </InputAdornment>
                                                                ),
                                                            }}
                                                        ></TextField>
                                                    </Box>
                                                </Grid>
                                            </Grid>
                                            <Box sx={{ mt: 2 }}>
                                                <Button variant="contained" type="submit" fullWidth disabled={loadingEmail}
                                                    sx={{
                                                        boxShadow: 3,
                                                        borderRadius: 2,
                                                        my: { xs: 1, sm: 1, md: 1, lg: 0 },
                                                        backgroundColor: "#7d745c",
                                                        width: { xs: "100%", sm: "100%", md: "fit-content" },
                                                        minWidth: "auto",
                                                        whiteSpace: "nowrap",
                                                        px: 2,
                                                        color: "#ffffff",
                                                        textTransform: "none",
                                                        fontSize: "1.1rem",
                                                        "&:hover": {
                                                            backgroundColor: "#67604d"
                                                        },
                                                        "&.Mui-disabled": {
                                                            backgroundColor: "#5a5342",
                                                            color: "#ffffff !important",
                                                        }
                                                    }}>{loadingEmail ? (
                                                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                                            <CircularProgress
                                                                size={20}
                                                                sx={{
                                                                    color: "#ffffff",
                                                                    marginRight: "10px"
                                                                }}
                                                            />
                                                            <span>Guardando...</span>
                                                        </Box>
                                                    ) : "Actualizar"}
                                                </Button>
                                            </Box>
                                        </Paper>
                                    </Grid>
                                    <Grid size={12}>
                                        <Paper
                                            component="form"
                                            onSubmit={hanbldeUpdateContraseña}
                                            sx={{
                                                display: "flex",
                                                flexDirection: "column",
                                                justifyContent: "flex-start",
                                                boxShadow: 0,
                                                width: "100%",
                                                height: "100%",
                                                borderRadius: 4,
                                                background: "transparent",
                                                flexGrow: 0,
                                            }}>
                                            <Typography variant="body2" sx={{
                                                color: "#000000",
                                                my: 1,
                                                fontSize: {
                                                    xs: "1.1rem",
                                                    sm: "1.1rem",
                                                    md: "1.2rem",
                                                    lg: "1.3rem",
                                                    xl: "1.3rem",
                                                },
                                                textAlign: { xs: "center", sm: "center", md: "start" },
                                                lineHeight: 1.8,
                                            }}>Actualizar contraseña con la que te registraste.
                                            </Typography>
                                            <Grid container spacing={2}>
                                                <Grid size={{
                                                    xs: 12,
                                                    sm: 12,
                                                    md: 12,
                                                    lg: 12,
                                                    xl: 6
                                                }} >
                                                    <Box sx={{ my: 0, width: "100%" }}>
                                                        <Typography variant="body1" sx={{ color: "#000000" }}>Nueva contraseña</Typography>
                                                        <TextField
                                                            type={showPassword ? "text" : "password"}
                                                            placeholder="Nueva Contraseña"
                                                            value={nuevaContraseña}
                                                            onChange={(e) => setNuevaContraseña(e.target.value)}
                                                            variant="outlined"
                                                            fullWidth
                                                            margin="dense"
                                                            sx={{
                                                                backgroundColor: "#d7d6d6",
                                                                color: "#000000",
                                                                borderRadius: 3,
                                                                boxShadow: 3,
                                                                input: { color: "#000000" },
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
                                                            }}
                                                            InputProps={{
                                                                startAdornment: (
                                                                    <InputAdornment position="start">
                                                                        <Box sx={{ display: "flex", alignItems: "center", justifyContent: "flex-start", color: "#000000" }}>
                                                                            <PasswordRoundedIcon fontSize="medium" sx={{ mr: 1, color: "#000000" }}></PasswordRoundedIcon>
                                                                        </Box>
                                                                    </InputAdornment>
                                                                ),
                                                                endAdornment: (
                                                                    <InputAdornment position="end">
                                                                        <Box sx={{ display: "flex", alignItems: "center", justifyContent: "flex-end", color: "#000000" }}>
                                                                            <IconButton onClick={handleShowPassword}>
                                                                                {showPassword ? <VisibilityIcon sx={{ color: "#000000" }} /> : <VisibilityOffRoundedIcon sx={{ color: "#000000" }} />}
                                                                            </IconButton>
                                                                        </Box>
                                                                    </InputAdornment>
                                                                )
                                                            }}
                                                        ></TextField>
                                                    </Box>
                                                </Grid>
                                                <Grid size={{
                                                    xs: 12,
                                                    sm: 12,
                                                    md: 12,
                                                    lg: 12,
                                                    xl: 6
                                                }}>
                                                    <Box sx={{ my: 0, width: "100%" }}>
                                                        <Typography variant="body1" sx={{ color: "#000000" }}>Confirme contraseña</Typography>
                                                        <TextField
                                                            type={showPassword ? "text" : "password"}
                                                            placeholder="Confirme contraseña"
                                                            value={repetirContraseña}
                                                            onChange={(e) => setRepetirContraseña(e.target.value)}
                                                            variant="outlined"
                                                            fullWidth
                                                            margin="dense"
                                                            sx={{
                                                                backgroundColor: "#d7d6d6",
                                                                color: "#000000",
                                                                borderRadius: 3,
                                                                boxShadow: 3,
                                                                input: { color: "#000000" },
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
                                                            }}
                                                            InputProps={{
                                                                startAdornment: (
                                                                    <InputAdornment position="start">
                                                                        <Box sx={{ display: "flex", alignItems: "center", justifyContent: "flex-start", color: "#000000" }}>
                                                                            <PasswordRoundedIcon fontSize="medium" sx={{ mr: 1, color: "#000000" }}></PasswordRoundedIcon>
                                                                        </Box>
                                                                    </InputAdornment>
                                                                ),
                                                                endAdornment: (
                                                                    <InputAdornment position="end">
                                                                        <Box sx={{ display: "flex", alignItems: "center", justifyContent: "flex-end", color: "#000000" }}>
                                                                            <IconButton onClick={handleShowPassword}>
                                                                                {showPassword ? <VisibilityIcon sx={{ mr: 0, color: "#000000" }} /> : <VisibilityOffRoundedIcon sx={{ mr: 0, color: "#000000" }} />}
                                                                            </IconButton>
                                                                        </Box>
                                                                    </InputAdornment>
                                                                )
                                                            }}
                                                        ></TextField>
                                                    </Box>
                                                </Grid>
                                            </Grid>
                                            <Box sx={{ mt: 2 }}>
                                                <Button variant="contained" type="submit" fullWidth disabled={loadingContraseña}
                                                    sx={{
                                                        boxShadow: 3,
                                                        borderRadius: 2,
                                                        width: { xs: "100%", sm: "100%", md: "fit-content" },
                                                        minWidth: "auto",
                                                        whiteSpace: "nowrap",
                                                        px: 2,
                                                        my: { xs: 1, sm: 1, md: 1, lg: 0 },
                                                        backgroundColor: "#7d745c",
                                                        textTransform: "none",
                                                        fontSize: "1.1rem",
                                                        color: "#ffffff",
                                                        "&:hover": {
                                                            backgroundColor: "#67604d"
                                                        },
                                                        "&.Mui-disabled": {
                                                            backgroundColor: "#5a5342",
                                                            color: "#ffffff !important",
                                                        }
                                                    }}>{loadingContraseña ? (
                                                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                                            <CircularProgress
                                                                size={20}
                                                                sx={{
                                                                    color: "#ffffff",
                                                                    marginRight: "10px"
                                                                }}
                                                            />
                                                            <span>Guardando...</span>
                                                        </Box>
                                                    ) : "Actualizar"}
                                                </Button>
                                            </Box>
                                        </Paper>
                                    </Grid>
                                </Grid>
                            </Paper>
                        </Grid>
                        <Grid size={{
                            xs: 12,
                            sm: 12,
                            md: 12,
                            lg: 6
                        }}>
                            <Paper
                                component="form"
                                onSubmit={handleUpdateUser}
                                sx={{
                                    display: "flex",
                                    flexDirection: "column",
                                    justifyContent: "flex-start",
                                    width: "100%",
                                    height: "100%",
                                    boxShadow: 3,
                                    p: { xs: 2, sm: 3, md: 3 },
                                    borderRadius: 4,
                                    background: "transparent",
                                    flexGrow: 0,
                                }}>
                                <Typography variant="h2" sx={{
                                    color: "#000000",
                                    fontSize: {
                                        xs: "1.4rem",
                                        sm: "1.4rem",
                                        md: "1.4rem",
                                        lg: "1.5rem",
                                        xl: "1.5rem"
                                    },
                                    textAlign: { xs: "center", sm: "center", md: "start" },
                                }}>Actualizar datos de usuario</Typography>
                                <Divider sx={{ borderColor: "rgba(0,0,0,0.1)", my: 1, mb: 2 }} />
                                <Typography variant="body2" sx={{
                                    my: 1,
                                    color: "#000000",
                                    fontSize: {
                                        xs: "1.1rem",
                                        sm: "1.1rem",
                                        md: "1.2rem",
                                        lg: "1.3rem",
                                        xl: "1.3rem",
                                    },
                                    textAlign: { xs: "center", sm: "center", md: "start" },
                                    lineHeight: 1.8,
                                }}>Actualiza los datos que cargaste en el formulario de registro
                                </Typography>
                                <Grid container spacing={2}>
                                    <Grid size={12}>
                                        <Box sx={{ my: 0, width: "100%" }}>
                                            {loadingData ? (
                                                <>
                                                    <Skeleton animation="wave" variant="body1" sx={{ borderRadius: 2, mb: 1, bgcolor: "#000000" }} />
                                                    <Skeleton animation="wave" variant="rectangular" height={50} sx={{ borderRadius: 2, mb: 1, bgcolor: "#000000" }} />
                                                </>
                                            ) : (
                                                <>
                                                    <Typography variant="body1" sx={{ color: "#000000" }}>¿Cómo te llamas?</Typography>
                                                    <TextField
                                                        value={usernameLocal}
                                                        onChange={(e) => {
                                                            setUsernameLocal(e.target.value);
                                                            setProfile({ ...profile, username: e.target.value });
                                                        }
                                                        }
                                                        placeholder="Nombre completo"
                                                        variant="outlined"
                                                        fullWidth
                                                        margin="dense"
                                                        sx={{
                                                            backgroundColor: "#d7d6d6",
                                                            color: "#000000",
                                                            borderRadius: 3,
                                                            boxShadow: 3,
                                                            input: { color: "#000000" },
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
                                        <Box sx={{ width: "100%" }}>
                                            {loadingData ? (
                                                <>
                                                    <Skeleton animation="wave" variant="body1" sx={{ borderRadius: 2, mb: 1, mt: 1, bgcolor: "#4a4a4a" }} />
                                                    <Skeleton animation="wave" variant="rectangular" height={50} sx={{ borderRadius: 2, mb: 1, bgcolor: "#4a4a4a" }} />
                                                </>
                                            ) : (
                                                <>
                                                    <Typography variant="body1" sx={{ color: "#000000" }}>¿Sufris de alguna enfermedad?</Typography>
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
                                                            backgroundColor: "#d7d6d6",
                                                            color: "#000000",
                                                            borderRadius: 3,
                                                            mt: 1,
                                                            boxShadow: 3,
                                                            input: { color: "#000000" },
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
                                                            mb: 1
                                                        }}
                                                    >
                                                        <MenuItem value="seleccione" disabled>Seleccione</MenuItem>
                                                        <MenuItem value="si">Si</MenuItem>
                                                        <MenuItem value="no">No</MenuItem>
                                                    </Select>
                                                    {tieneEnfermedad === "si" && (
                                                        <Box sx={{ width: "100%" }}>
                                                            <Typography variant="body1" sx={{ color: "#000000" }}>¿Cúal/es? Escribilas</Typography>
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
                                                                    backgroundColor: "#d7d6d6",
                                                                    color: "#000000",
                                                                    borderRadius: 3,
                                                                    boxShadow: 3,
                                                                    "& .MuiInputBase-input": {
                                                                        color: "#000000",
                                                                        WebkitTextFillColor: "#000000",
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
                                        <Box sx={{ width: "100%" }}>
                                            {loadingData ? (
                                                <>
                                                    <Skeleton animation="wave" variant="body1" sx={{ borderRadius: 2, mb: 1, mt: 1, bgcolor: "#4a4a4a" }} />
                                                    <Skeleton animation="wave" variant="rectangular" height={50} sx={{ borderRadius: 2, mb: 1, bgcolor: "#4a4a4a" }} />
                                                </>
                                            ) : (
                                                <>
                                                    <Typography variant="body1" sx={{ color: "#000000" }}>¿Tomas medicamentos?</Typography>
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
                                                            backgroundColor: "#d7d6d6",
                                                            color: "#000000",
                                                            mt: 1,
                                                            borderRadius: 3,
                                                            boxShadow: 3,
                                                            input: { color: "#000000" },
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
                                                    <Typography variant="body1" sx={{ color: "#000000" }}>¿Cúal/es? Escribilos</Typography>
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
                                                            backgroundColor: "#d7d6d6",
                                                            color: "#000000",
                                                            borderRadius: 3,
                                                            boxShadow: 3,
                                                            "& .MuiInputBase-input": {
                                                                color: "#000000",
                                                                WebkitTextFillColor: "#000000",
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
                                                    <Typography variant="body1" sx={{ color: "#000000" }}>¿Sufris de alergias?</Typography>
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
                                                            backgroundColor: "#d7d6d6",
                                                            mt: 1,
                                                            color: "#000000",
                                                            borderRadius: 3,
                                                            boxShadow: 3,
                                                            input: { color: "#000000" },
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
                                                    <Typography variant="body1" sx={{ color: "#000000" }}>¿Cúal/es? Escribilas</Typography>
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
                                                            backgroundColor: "#d7d6d6",
                                                            color: "#000000",
                                                            borderRadius: 3,
                                                            boxShadow: 3,
                                                            "& .MuiInputBase-input": {
                                                                color: "#000000",
                                                                WebkitTextFillColor: "#000000",
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
                                                    <Typography variant="body1" sx={{ color: "#000000" }}>¿Hay algo que no te guste o te moleste?</Typography>
                                                    <TextField
                                                        placeholder="Escribilo..."
                                                        value={molestias}
                                                        onChange={(e) => setMolestias(e.target.value)}
                                                        variant="outlined"
                                                        multiline
                                                        minRows={4}
                                                        maxRows={4}
                                                        fullWidth
                                                        margin="dense"
                                                        sx={{
                                                            backgroundColor: "#d7d6d6",
                                                            color: "#000000",
                                                            borderRadius: 3,
                                                            boxShadow: 3,
                                                            "& .MuiInputBase-input": {
                                                                color: "#000000",
                                                                WebkitTextFillColor: "#000000",
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
                                                    <Typography variant="body1" sx={{ color: "#000000" }}>¿Qué cosas te gustan hacer?</Typography>
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
                                                            backgroundColor: "#d7d6d6",
                                                            color: "#000000",
                                                            borderRadius: 3,
                                                            boxShadow: 3,
                                                            "& .MuiInputBase-input": {
                                                                color: "#000000",
                                                                WebkitTextFillColor: "#000000",
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
                                                        }}
                                                    ></TextField>
                                                </>
                                            )}
                                        </Box>
                                    </Grid>
                                </Grid>
                                <Box sx={{ width: { xs: "100%", sm: "100%", md: "100%", lg: "28%" }, mt: 2 }}>
                                    <Button variant="contained" type="submit" fullWidth disabled={loading || !hasChanges}
                                        sx={{
                                            boxShadow: 3,
                                            borderRadius: 2,
                                            my: { xs: 1, sm: 1, md: 1, lg: 0 },
                                            backgroundColor: "#7d745c",
                                            width: { xs: "100%", sm: "100%", md: "fit-content" },
                                            minWidth: "auto",
                                            whiteSpace: "nowrap",
                                            color: "#ffffff",
                                            textTransform: "none",
                                            fontSize: "1.1rem",
                                            "&:hover": {
                                                backgroundColor: "#67604d"
                                            },
                                            "&.Mui-disabled": {
                                                backgroundColor: "#5a5342",
                                                color: "#ffffff !important",
                                            }
                                        }}>{loading ? (
                                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                                <CircularProgress
                                                    size={20}
                                                    sx={{
                                                        color: "#ffffff",
                                                        marginRight: "10px"
                                                    }}
                                                />
                                                <span>Guardando...</span>
                                            </Box>
                                        ) : "Actualizar"}
                                    </Button>
                                </Box>
                            </Paper>
                        </Grid>
                    </Grid>
                </Paper>
            </Paper>
        </>
    );
};

export default ProfileElder;
