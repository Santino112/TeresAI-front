import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Typography, Button, TextField, Box, Select, MenuItem, FormHelperText, Divider, Paper, Alert, Checkbox, FormControlLabel } from "@mui/material";
import { useAuth } from "../auth/AuthContext";
import { supabase } from "../../supabaseClient";
import { saveProfile, elderPeople, familyPeople, caregivePeople } from "../dashboard/chat/exports/datosInicialesUsuarios";
import imagenInfoUsers from "../../assets/images/imagenInfoUsers.jpg";

const InformacionUsuarios = () => {
    const [errorAlert, setErrorAlert] = useState(false);
    const [alertMessage, setAlertMessage] = useState("");
    const [errorTextFields, setErrorTextFields] = useState(false);
    //
    const [checkingProfile, setCheckingProfile] = useState(true);
    const [nombre, setNombre] = useState("");
    const [rol, setRol] = useState("elder");
    //Rol de elder
    const [tieneEnfermedad, setTieneEnfermedad] = useState("seleccione");
    const [enfermedad, setEnfermedad] = useState("No");
    const [tomaMedicamentos, setTomaMedicamentos] = useState("seleccione");
    const [medicamentos, setMedicamentos] = useState("No");
    const [tieneAlergias, setTieneAlergias] = useState("seleccione");
    const [alergias, setAlergias] = useState("No");
    const [molestias, setMolestias] = useState("");
    const [gustos, setGustos] = useState("");
    //Rol de familiar
    const [nombreFamiliar, setNombreFamiliar] = useState("");
    const [tipoFamiliar, setTipoFamiliar] = useState("seleccione");
    //Rol cuidador
    const [geriatrico, setGeriatrico] = useState("");
    const [numAdultos, setNumAdultos] = useState("");
    const [infoEspecifica, setInfoEspecifica] = useState("");
    const [sinGeriatrico, setSinGeriatrico] = useState(false);
    //
    const { user, loading: authLoading } = useAuth();
    const navigate = useNavigate();
    const label = { slotProps: { input: { 'aria-label': 'Checkbox demo' } } };

    const traducirError = (mensaje) => {
        const errores = {
            "Email not confirmed": "El email no está confirmado. Confirmalo.",
            "Too many request": "Demasiados intentos, esperá unos minutos.",
            "User not found": "No existe una cuenta con ese email asociado.",
            "Network request failed": "Error de conexión, revisá tu internet.",
            "null value in column": "Hay campos obligatorios sin completar.",
            "duplicate key value": "Ya existe un perfil para este usuario.",
            "violates foreign key constraint": "Error de referencia, intentá de nuevo.",
            "violates not-null constraint": "Hay campos obligatorios sin completar.",
        };
        const key = Object.keys(errores).find(k => mensaje?.includes(k));
        return key ? errores[key] : "Ocurrió un error, intentalo de nuevo.";
    };

    const handleStoreDatos = async (e) => {
        e.preventDefault();

        const camposComunes = rol === "elder" && [tieneEnfermedad, tomaMedicamentos, tieneAlergias].some(v => v === "seleccione");
        const campoFamiliar = rol === "familiar" && tipoFamiliar === "seleccione";

        if (camposComunes || campoFamiliar) {
            setErrorTextFields(true);
            setAlertMessage("Por favor completá todos los campos.");
            setErrorAlert(true);
            setTimeout(() => {
                setErrorAlert(false)
                setErrorTextFields(false)
            }, 5000);
            return;
        }

        if (!nombre.trim()) {
            setAlertMessage("El nombre es obligatorio.");
            setErrorAlert(true);
            setTimeout(() => {
                setErrorAlert(false)
                setErrorTextFields(false)
            }, 5000);
            return;
        }

        setErrorTextFields(false);

        const successStore = await saveProfile(user.id, {
            username: nombre,
            role: rol,
            interests: gustos
        });

        if (!successStore) {
            setAlertMessage("Ocurrió un error al guardar tu perfil, intentá de nuevo.");
            setErrorAlert(true);
            setTimeout(() => {
                setErrorAlert(false)
                setErrorTextFields(false)
            }, 5000);
            return;
        }

        if (rol === "elder") {
            const resultElder = await elderPeople(user.id, {
                enfermedades: enfermedad,
                medicamentos: medicamentos,
                alergias: alergias,
                molestias: molestias,
                intereses: gustos
            });
            if (!resultElder.success) {
                setAlertMessage(traducirError(resultElder.message));
                setErrorAlert(true);
                setTimeout(() => {
                    setErrorAlert(false)
                    setErrorTextFields(false)
                }, 5000);
                return;
            }

        } else if (rol === "familiar") {
            const resultFamiliar = await familyPeople(user.id, {
                relacion: tipoFamiliar,
                nombreelder: nombreFamiliar
            });
            if (!resultFamiliar.success) {
                setAlertMessage(traducirError(resultFamiliar.message));
                setErrorAlert(true);
                setTimeout(() => {
                    setErrorAlert(false)
                    setErrorTextFields(false)
                }, 5000);
                return;
            }

        } else {
            const resultCuidador = await caregivePeople(user.id, {
                geriatrico: geriatrico,
                adultosmayores: numAdultos,
                infoamonitorear: infoEspecifica
            });
            if (!resultCuidador.success) {
                setAlertMessage(traducirError(resultCuidador.message));
                setErrorAlert(true);
                setTimeout(() => {
                    setErrorAlert(false)
                    setErrorTextFields(false)
                }, 5000);
                return;
            }
        }

        if (rol === "elder") navigate("/paginaChatAI");
        if (rol === "familiar") navigate("/paginaFamiliar");
        if (rol === "cuidador") navigate("/paginaCuidador");
    };

    useEffect(() => {
        if (authLoading) return;
        if (!user) { navigate('/'); return; }

        const checkProfile = async () => {
            const { data } = await supabase
                .schema("public")
                .from("profiles")
                .select("role")
                .eq("id", user.id)
                .single();

            if (data) {
                if (data.role === "elder") navigate("/paginaChatAI");
                if (data.role === "familiar") navigate("/paginaFamiliar");
                if (data.role === "cuidador") navigate("/paginaCuidador");
            } else {
                setCheckingProfile(false);
            }
        };
        checkProfile();
    }, [user, authLoading]);

    if (checkingProfile) return null;

    return (
        <>
            <Box
                sx={{
                    position: "fixed",
                    inset: 0,
                    zIndex: 0,
                    background: `linear-gradient(to bottom, rgba(0, 0, 0, 0.67) 40%, rgba(0, 0, 0, 0.83) 100%), url(${imagenInfoUsers})`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                    backgroundRepeat: "no-repeat",
                }}
            />
            <Box
                sx={{
                    position: "relative",
                    zIndex: 1,
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                    alignItems: { xs: "flex-start", md: "center" },
                    minHeight: "100dvh",
                    width: "100%",
                    px: { xs: 2, sm: 4, md: 0 },
                    py: { xs: 3, md: 4 },
                }}>
                {errorAlert ?
                    <Alert
                        variant="filled"
                        severity="error"
                        sx={{
                            position: "fixed",
                            top: 20,
                            left: "50%",
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
                    onSubmit={handleStoreDatos}
                    elevation={6}
                    sx={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        width: {
                            xs: "100%",
                            sm: "80%",
                            md: "50%",
                            lg: "35%",
                            xl: "27%",
                        },
                        p: { xs: 2, sm: 3, md: 3 },
                        borderRadius: 4,
                        bgcolor: "#626C66",
                        gap: 1,
                    }}
                >
                    <Typography variant="h5"
                        sx={{

                            fontFamily: "'Lora', serif",
                            textAlign: "center",
                            color: "white",
                        }}
                    >Antes de comenzar</Typography>
                    <Divider sx={{

                        width: "100%",
                        "&::before, &::after": {
                            borderColor: "#ffffff",
                        }
                    }}>
                        <Typography variant="body1" sx={{ color: "#ffffff" }}>~</Typography>
                    </Divider>
                    <Box sx={{ my: 0, width: "100%" }}>
                        <Typography variant="body1" sx={{ fontFamily: "'Lora', serif", }}>¿Cómo te llamas?</Typography>
                        <TextField
                            error={errorTextFields}
                            placeholder="Nombre completo"
                            value={nombre}
                            onChange={(e) => setNombre(e.target.value)}
                            variant="outlined"
                            fullWidth
                            margin="dense"
                            sx={{
                                backgroundColor: "#484848",
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
                    <Box sx={{ my: 1, width: "100%" }}>
                        <Typography variant="body1" sx={{ fontFamily: "'Lora', serif", }}>¿Qué rol cumplis?</Typography>
                        <Select
                            error={errorTextFields}
                            labelId="demo-simple-select-helper-label"
                            id="demo-simple-select-helper"
                            value={rol}
                            fullWidth
                            onChange={(e) => setRol(e.target.value)}
                            MenuProps={{
                                PaperProps: {
                                    sx: {
                                        borderRadius: 3,
                                        backgroundColor: "#534d4d",
                                        color: "#E6E6E6",
                                    }
                                },
                                MenuListProps: { sx: { p: 0 } }
                            }} sx={{
                                backgroundColor: "#484848",
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
                                }
                            }}
                        >
                            <MenuItem value="elder">🧓 Adulto mayor</MenuItem>
                            <MenuItem value="familiar">🧑 Familiar</MenuItem>
                            <MenuItem value="cuidador">👩‍⚕️ Cuidador</MenuItem>
                        </Select>
                        <FormHelperText>Si sos adulto mayor no cambies de opción</FormHelperText>
                    </Box>
                    {rol === "elder" ? (
                        <>
                            <Box sx={{ mb: 1, width: "100%" }}>
                                <Typography variant="body1" sx={{ fontFamily: "'Lora', serif", }}>¿Sufris de alguna enfermedad?</Typography>
                                <Select
                                    error={errorTextFields}
                                    labelId="demo-simple-select-helper-label"
                                    id="demo-simple-select-helper"
                                    value={tieneEnfermedad}
                                    fullWidth
                                    onChange={(e) => {
                                        setTieneEnfermedad(e.target.value)
                                        e.target.value === "si" ? setEnfermedad("") : setEnfermedad("No")
                                    }
                                    }
                                    MenuProps={{
                                        PaperProps: {
                                            sx: {
                                                borderRadius: 3,
                                                backgroundColor: "#534d4d",
                                                color: "#E6E6E6",
                                            }
                                        },
                                        MenuListProps: { sx: { p: 0 } }
                                    }} sx={{
                                        backgroundColor: "#484848",
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
                                            error={errorTextFields}
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
                                                backgroundColor: "#484848",
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

                            <Box sx={{ my: 0, width: "100%" }}>
                                <Typography variant="body1" sx={{ fontFamily: "'Lora', serif", }}>¿Tomas medicamentos?</Typography>
                                <Select
                                    error={errorTextFields}
                                    labelId="demo-simple-select-helper-label"
                                    id="demo-simple-select-helper"
                                    value={tomaMedicamentos}
                                    fullWidth
                                    onChange={(e) => {
                                        setTomaMedicamentos(e.target.value);
                                        e.target.value === "si" ? setMedicamentos("") : setMedicamentos("No")
                                    }
                                    }
                                    MenuProps={{
                                        PaperProps: {
                                            sx: {
                                                borderRadius: 3,
                                                backgroundColor: "#534d4d",
                                                color: "#E6E6E6",
                                            }
                                        },
                                        MenuListProps: { sx: { p: 0 } }
                                    }} sx={{
                                        backgroundColor: "#484848",
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
                                {tomaMedicamentos === "si" && (
                                    <Box sx={{ width: "100%" }}>
                                        <Typography variant="body1" sx={{ fontFamily: "'Lora', serif", }}>¿Cúal/es? Escribilos</Typography>
                                        <TextField
                                            error={errorTextFields}
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
                                                backgroundColor: "#484848",
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

                            <Box sx={{ my: 0, width: "100%" }}>
                                <Typography variant="body1" sx={{ fontFamily: "'Lora', serif", }}>¿Sufris de alergias?</Typography>
                                <Select
                                    error={errorTextFields}
                                    labelId="demo-simple-select-helper-label"
                                    id="demo-simple-select-helper"
                                    value={tieneAlergias}
                                    fullWidth
                                    onChange={(e) => {
                                        setTieneAlergias(e.target.value)
                                        e.target.value === "si" ? setAlergias("") : setAlergias("No")
                                    }
                                    }
                                    MenuProps={{
                                        PaperProps: {
                                            sx: {
                                                borderRadius: 3,
                                                backgroundColor: "#534d4d",
                                                color: "#E6E6E6",
                                            }
                                        },
                                        MenuListProps: { sx: { p: 0 } }
                                    }} sx={{
                                        backgroundColor: "#484848",
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
                                {tieneAlergias === "si" && (
                                    <Box sx={{ width: "100%" }}>
                                        <Typography variant="body1" sx={{ fontFamily: "'Lora', serif", }}>¿Cúal/es? Escribilas</Typography>
                                        <TextField
                                            error={errorTextFields}
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
                                                backgroundColor: "#484848",
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

                            <Box sx={{ my: 0, width: "100%" }}>
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
                                        backgroundColor: "#484848",
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

                            <Box sx={{ my: 1, width: "100%" }}>
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
                                        backgroundColor: "#484848",
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
                        </>

                    ) : rol === "familiar" ? (
                        <>
                            <Box sx={{ my: 0, width: "100%" }}>
                                <Typography variant="body1" sx={{ fontFamily: "'Lora', serif", }}>¿A que familiar cuidas?</Typography>
                                <TextField
                                    error={errorTextFields}
                                    placeholder="Nombre"
                                    value={nombreFamiliar}
                                    onChange={(e) => setNombreFamiliar(e.target.value)}
                                    variant="outlined"
                                    fullWidth
                                    margin="dense"
                                    sx={{
                                        backgroundColor: "#484848",
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

                            <Box sx={{ my: 0, width: "100%" }}>
                                <Typography variant="body1" sx={{ fontFamily: "'Lora', serif", }}>¿Cual es tu relación con esa persona?</Typography>
                                <Select
                                    error={errorTextFields}
                                    labelId="demo-simple-select-helper-label"
                                    id="demo-simple-select-helper"
                                    value={tipoFamiliar}
                                    fullWidth
                                    onChange={(e) => setTipoFamiliar(e.target.value)}
                                    MenuProps={{
                                        PaperProps: {
                                            sx: {
                                                borderRadius: 3,
                                                backgroundColor: "#534d4d",
                                                color: "#E6E6E6",
                                            }
                                        },
                                        MenuListProps: { sx: { p: 0 } }
                                    }} sx={{
                                        backgroundColor: "#484848",
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
                                    <MenuItem value="hijo">Hijo</MenuItem>
                                    <MenuItem value="nieto">Nieto</MenuItem>
                                    <MenuItem value="sobrino">Sobrino</MenuItem>
                                    <MenuItem value="otro">Ninguno de los anteriores</MenuItem>
                                </Select>
                            </Box>
                        </>
                    ) : (
                        <>
                            <Box sx={{ my: 0, width: "100%" }}>
                                <Typography variant="body1" sx={{ fontFamily: "'Lora', serif", }}>¿En qué geriátrico trabajas?</Typography>
                                <TextField
                                    disabled={sinGeriatrico}
                                    error={errorTextFields}
                                    placeholder="Nombre"
                                    value={geriatrico}
                                    onChange={(e) => setGeriatrico(e.target.value)}
                                    variant="outlined"
                                    fullWidth
                                    margin="dense"
                                    sx={{
                                        backgroundColor: "#484848",
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
                                            checked={sinGeriatrico}
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
                            <Box sx={{ my: 0, width: "100%" }}>
                                <Typography variant="body1" sx={{ fontFamily: "'Lora', serif" }}>¿Cuántos adultos mayores tenes a tu cargo?</Typography>
                                <TextField
                                    error={errorTextFields}
                                    placeholder=""
                                    type="number"
                                    value={numAdultos}
                                    onChange={(e) => setNumAdultos(e.target.value)}
                                    variant="outlined"
                                    fullWidth
                                    margin="dense"
                                    sx={{
                                        backgroundColor: "#484848",
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

                            <Box sx={{ my: 0, width: "100%" }}>
                                <Typography variant="body1" sx={{ fontFamily: "'Lora', serif", }}>¿Hay algo especifico que necesites monitorear?</Typography>
                                <TextField
                                    error={errorTextFields}
                                    placeholder="Escribilo..."
                                    value={infoEspecifica}
                                    onChange={(e) => setInfoEspecifica(e.target.value)}
                                    variant="outlined"
                                    fullWidth
                                    multiline
                                    minRows={4}
                                    maxRows={4}
                                    margin="dense"
                                    sx={{
                                        backgroundColor: "#484848",
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
                        </>
                    )}
                    <Divider sx={{

                        width: "100%",
                        "&::before, &::after": {
                            borderColor: "#ffffff",
                        }
                    }}>
                        <Typography variant="body1" sx={{ color: "#ffffff" }}>~</Typography>
                    </Divider>
                    <Box sx={{ width: "100%" }}>
                        <Button variant="contained" type="submit" fullWidth
                            sx={{

                                boxShadow: 3,
                                color: "#ffffff",
                                backgroundColor: "#918B76",
                                fontFamily: "'Lora', serif",
                                fontWeight: "bold",
                                "&:hover": {
                                    backgroundColor: "#7a7664",
                                }
                            }}>Guardar
                        </Button>
                    </Box>
                </Paper>
            </Box>
        </>
    )
};

export default InformacionUsuarios;