import { useState, useEffect, useEffectEvent, useRef } from "react";
import { Typography, Button, TextField, Box, Divider, Select, MenuItem, Alert, Grid, Paper, InputAdornment, IconButton } from "@mui/material";
import { tomarDatosFamiliares, actualizarDatosFamiliares, actualizarDatosPerfiles, updateEmail, updateContraseña, linkearUsuarios } from "../../../exports/datosInicialesUsuarios";
import { useAuth } from "../../../../../auth/useAuth";
import CircularProgress from '@mui/material/CircularProgress';
import EmailRoundedIcon from '@mui/icons-material/EmailRounded';
import MarkEmailReadRoundedIcon from '@mui/icons-material/MarkEmailReadRounded';
import PasswordRoundedIcon from '@mui/icons-material/PasswordRounded';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffRoundedIcon from '@mui/icons-material/VisibilityOffRounded';
import Diversity1RoundedIcon from '@mui/icons-material/Diversity1Rounded';
import FamilyRestroomRoundedIcon from '@mui/icons-material/FamilyRestroomRounded';
import BadgeRoundedIcon from '@mui/icons-material/BadgeRounded';
import PersonAddAlt1RoundedIcon from '@mui/icons-material/PersonAddAlt1Rounded';
import InsertEmoticonRoundedIcon from '@mui/icons-material/InsertEmoticonRounded';

const ProfileFamiliar = ({ profile, setProfile }) => {
    const [usernameLocal, setUsernameLocal] = useState(profile?.username || "");
    const [nombreFamiliar, setNombreFamiliar] = useState("");
    const [tipoFamiliar, setTipoFamiliar] = useState("");
    //Toma datos
    const [profileFamiliar, setProfileFamiliar] = useState(null);
    const [errorAlert, setErrorAlert] = useState(false);
    const [alertMessage, setAlertMessage] = useState("");
    const [severity, setSeverity] = useState("success");
    const [hasChanges, setHasChanges] = useState(false);
    const [loading, setLoading] = useState(false);
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
    //Para agregar un nuevo elder
    const [emailElder, setEmailElder] = useState("");
    const [loadingNuevoElder, setLoadingNuevoElder] = useState(false);
    //
    const [showPassword, setShowPassword] = useState(false);
    const { user } = useAuth();

    const traducirError = (mensaje) => {
        const errores = {
            "Too many request": "Demasiados intentos, esperá unos minutos.",
            "User not found": "No existe una cuenta con ese email asociado.",
            "Network request failed": "Error de conexión, revisá tu internet.",
            "unique_link": "Ya estás vinculado con ese adulto mayor.",
            "duplicate key value": "Ya estás vinculado con ese adulto mayor.",
            "violates foreign key constraint": "Error de referencia, intentá de nuevo.",
            "no rows updated": "No se encontró el registro a actualizar.",
            "permission denied": "No tenés permiso para actualizar estos datos.",
            "value too long": "Uno de los campos tiene demasiados caracteres.",
            "already in use": "Ese email ya está siendo usado por otra cuenta.",
            "Invalid email": "El formato del email no es válido.",
            "should be different": "El nuevo email debe ser distinto al actual.",
            "rate limit": "Demasiados intentos, esperá unos minutos.",
            "User not found": "La sesión expiró, volvé a iniciar sesión.",
            "already registered": "Ese email ya está siendo usado por otra cuenta.",
            "must be different": "El nuevo email debe ser distinto al actual.",
            "unable to validate": "El formato del email no es válido.",
            "has already been registered": "Ese email ya está siendo usado por otra cuenta.",
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
            try {
                const data = await tomarDatosFamiliares(user.id);
                if (data) {
                    setProfileFamiliar(data);
                    setOriginalData(data);
                }
            } catch (error) {
                console.error("Error cargando datos:", error);
            };
        };
        fetchInfoElder();
    }, [user]);

    useEffect(() => {
        if (!dataLoaded) return;

        localStorage.setItem(`draft_familiar_${user?.id}`, JSON.stringify({
            username: usernameLocal,
            nombreFamiliar,
            tipoFamiliar
        }));
    }, [usernameLocal, nombreFamiliar, tipoFamiliar, dataLoaded]);


    useEffect(() => {
        if (!profileFamiliar || !profile || originalUsername !== null) return;

        const draft = localStorage.getItem(`draft_familiar_${user?.id}`);
        if (draft) {
            const parsed = JSON.parse(draft);
            setUsernameLocal(parsed.username || profile?.username);
            setProfile({ ...profile, username: parsed.username });
            setNombreFamiliar(parsed.nombreFamiliar || "");
            setTipoFamiliar(parsed.tipoFamiliar || "seleccione");
            setOriginalUsername(profile?.username);
            setDataLoaded(true);
        } else {
            setNombreFamiliar(profileFamiliar.nombreElder || "");
            setTipoFamiliar(profileFamiliar.relacion || "seleccione");
        }
        setOriginalUsername(profile?.username);
        setDataLoaded(true);
    }, [profileFamiliar, profile]);

    useEffect(() => {
        if (!originalData || !dataLoaded) return;

        const changed = usernameLocal !== originalUsername ||
            nombreFamiliar !== originalData.nombreElder ||
            tipoFamiliar !== originalData.relacion;

        setHasChanges(changed);
    }, [usernameLocal, nombreFamiliar, tipoFamiliar, originalData, dataLoaded]);

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

    //Actualizar datos del formulario que esta despues del registro inicial
    const handleUpdateUser = async (e) => {
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
            }, 5000);
            setLoading(false);
            return;
        }
        if (profile?.role === "familiar") {
            const updateFamiliar = await actualizarDatosFamiliares(user.id, {
                relacion: tipoFamiliar,
                nombreElder: nombreFamiliar,
            });
            if (!updateFamiliar.success) {
                setAlertMessage(traducirError(updateFamiliar.error));
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
                    nombreElder: nombreFamiliar,
                    relacion: tipoFamiliar
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

    //Agregar un nuevo anciano a controlar
    const handleAgregarElder = async (e) => {
        e.preventDefault();
        if (loadingNuevoElder) return;

        if (!emailElder.trim()) {
            setAlertMessage("Ingresá el email de tu familiar.");
            setErrorAlert(true);
            setSeverity("error");
            setTimeout(() => setErrorAlert(false), 5000);
            return;
        };
        setLoadingNuevoElder(true);

        const succesStore = await linkearUsuarios(user.id, {
            emailFamiliar: emailElder,
            rol: profile?.role
        });

        if (!succesStore.success) {
            setAlertMessage(succesStore.message);
            setErrorAlert(true);
            setSeverity("error");
            setTimeout(() => {
                setErrorAlert(false);
            }, 5000);
            setLoadingNuevoElder(false);
            return;
        };

        setAlertMessage("Vinculación exitosa. Familiar añadido");
        setErrorAlert(true);
        setSeverity("success");
        setEmailElder("");
        setTimeout(() => setErrorAlert(false), 5000);
        setLoadingNuevoElder(false);
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
                <Typography variant="h2" sx={{
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
                }}>Aquí podrás actualizar toda la información de tu usuario familiar. Puedes agregar datos sobre tu salud, tus gustos, tus intereses, o cualquier información que quieras compartir para que la inteligencia artificial pueda conocerte mejor y brindarte una mejor experiencia.
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
                                }}>Actualizar email con el que te registraste.
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
                                                        <>
                                                            <CircularProgress size={20} sx={{ color: "#ffffff", mr: 2 }} />
                                                            Guardando...
                                                        </>
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
                                                                            <PasswordRoundedIcon fontSize="medium" sx={{ mr: 1 }}></PasswordRoundedIcon>
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
                                                        <>
                                                            <CircularProgress size={20} sx={{ color: "#ffffff", mr: 2 }} />
                                                            Guardando...
                                                        </>
                                                    ) : "Actualizar"}
                                                </Button>
                                            </Box>
                                        </Paper>
                                    </Grid>
                                </Grid>
                            </Paper>
                        </Grid >
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
                                }}>Actualiza los datos que cargaste en el formulario de registro.
                                </Typography>
                                <Grid container spacing={2}>
                                    <Grid size={12}>
                                        <Box sx={{ my: 0, width: "100%" }}>
                                            <Typography variant="body1" sx={{ color: "#000000" }}>¿Cómo te llamas?</Typography>
                                            <TextField
                                                value={usernameLocal}
                                                onChange={(e) => {
                                                    setUsernameLocal(e.target.value);
                                                    setProfile({ ...profile, username: e.target.value })
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
                                                InputProps={{
                                                    startAdornment: (
                                                        <InputAdornment position="start">
                                                            <Box sx={{ display: "flex", alignItems: "center", justifyContent: "flex-start", color: "#000000" }}>
                                                                <BadgeRoundedIcon fontSize="medium" sx={{ mr: 1, color: "#000000" }}></BadgeRoundedIcon>
                                                            </Box>
                                                        </InputAdornment>
                                                    ),
                                                }}
                                            ></TextField>
                                        </Box>
                                    </Grid>
                                    <Grid size={12}>
                                        <Box sx={{ my: 0, width: "100%" }}>
                                            <Typography variant="body1" sx={{ color: "#000000" }}>¿Cuál es el nombre del familiar que cuidas?</Typography>
                                            <TextField
                                                value={nombreFamiliar}
                                                onChange={(e) => setNombreFamiliar(e.target.value)}
                                                placeholder="Nombre del familiar"
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
                                                                <Diversity1RoundedIcon fontSize="medium" sx={{ mr: 1, color: "#000000" }}></Diversity1RoundedIcon>
                                                            </Box>
                                                        </InputAdornment>
                                                    ),
                                                }}
                                            ></TextField>
                                        </Box>
                                    </Grid>
                                    <Grid size={12}>
                                        <Box sx={{ my: 0, width: "100%" }}>
                                            <Typography variant="body1" sx={{ color: "#000000" }}>¿Cuál es tu relación con esa persona?</Typography>
                                            <Select
                                                value={tipoFamiliar}
                                                onChange={(e) => setTipoFamiliar(e.target.value)}
                                                labelId="demo-simple-select-helper-label"
                                                id="demo-simple-select-helper"
                                                fullWidth
                                                renderValue={(selected) => (
                                                    <Box sx={{ display: "flex", alignItems: "center", color: "#000000" }}>
                                                        <FamilyRestroomRoundedIcon fontSize="small" sx={{ mr: 2 }} />
                                                        {selected.charAt(0).toUpperCase() + selected.slice(1)}
                                                    </Box>
                                                )}
                                                MenuProps={{
                                                    PaperProps: {
                                                        sx: {
                                                            borderRadius: 3,
                                                            backgroundColor: "#303030",
                                                            color: "#ffffff",
                                                        }
                                                    },
                                                    MenuListProps: { sx: { p: 0 } }
                                                }}
                                                sx={{
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
                                                    "& .MuiSelect-icon": {
                                                        color: "#000000",
                                                    },
                                                    mb: 1
                                                }}
                                            >
                                                <MenuItem value="seleccione" disabled>Seleccione</MenuItem>
                                                <MenuItem value="hijo">Hijo</MenuItem>
                                                <MenuItem value="nieto">Nieto</MenuItem>
                                                <MenuItem value="sobrino">Sobrino</MenuItem>
                                                <MenuItem value="otro">Ninguno de los anteriores</MenuItem>
                                            </Select>
                                        </Box>
                                    </Grid>
                                </Grid>
                                <Box sx={{ width: { xs: "100%", sm: "100%", md: "100%", lg: "30%" }, mt: 2 }}>
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
                                            <>
                                                <CircularProgress size={20} sx={{ color: "#ffffff", mr: 2 }} />
                                                Guardando...
                                            </>
                                        ) : "Actualizar"}
                                    </Button>
                                </Box>
                            </Paper>
                        </Grid>
                    </Grid >
                </Paper >
                <Paper
                    component="form"
                    onSubmit={handleAgregarElder}
                    sx={{
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "flex-start",
                        width: "100%",
                        p: { xs: 2, sm: 3, md: 3 },
                        borderRadius: 4,
                        background: "transparent",
                        boxShadow: 3,
                        flexGrow: 0,
                        my: 4
                    }}
                >
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
                    }}>Agregar nuevo familiar</Typography>
                    <Typography variant="body2" sx={{
                        mt: { xs: 1, sm: 1, md: 1, lg: 0, xl: 0 },
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
                    }}>Aquí puedes agregar a otro familiar al que quieras cuidar usando su email
                    </Typography>
                    <TextField
                        placeholder="Email del familiar"
                        value={emailElder}
                        onChange={(e) => setEmailElder(e.target.value)}
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
                                        <PersonAddAlt1RoundedIcon fontSize="medium" sx={{ mr: 1, color: "#000000" }}></PersonAddAlt1RoundedIcon>
                                    </Box>
                                </InputAdornment>
                            )
                        }}
                    ></TextField>
                    <Box sx={{ width: { xs: "100%", sm: "100%", md: "100%", lg: "14.2%" }, mt: 2 }}>
                        <Button variant="contained" type="submit" fullWidth disabled={loadingNuevoElder}
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
                            }}>Agregar
                        </Button>
                    </Box>
                </Paper>
            </Paper>
        </>
    )
};

export default ProfileFamiliar;
