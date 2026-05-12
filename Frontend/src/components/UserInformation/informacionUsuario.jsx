import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Typography, Button, Box, FormHelperText, Divider, Paper, Alert, Checkbox, FormControlLabel, InputAdornment, FormControl, FormLabel, RadioGroup, Radio } from "@mui/material";
import { useAuth } from "../auth/useAuth.jsx";
import { supabase } from "../../supabaseClient.js";
import { saveProfile, elderPeople, familyPeople, caregivePeople, linkearUsuarios } from "../dashboard/chat/exports/datosInicialesUsuarios.js";
import InfoElder from "./tipoUsuario/infoElder.jsx";
import InfoFamiliar from "./tipoUsuario/infoFamiliar.jsx";
import InfoCuidador from "./tipoUsuario/infoCuidador.jsx";
import VoiceTextField from "./VoiceTextField.jsx";
import fondoChatAI from "../../assets/images/fondoChatAI.png";
import BadgeRoundedIcon from '@mui/icons-material/BadgeRounded';

const InformacionUsuarios = () => {
    const [isSaving, setIsSaving] = useState(false);
    const [hasError, setHasError] = useState(false);
    const isProcessingRef = useRef(false);
    const [errorAlert, setErrorAlert] = useState(false);
    const [alertMessage, setAlertMessage] = useState("");
    const [errorTextFields, setErrorTextFields] = useState(false);
    //Datos cuidador
    const [geriatrico, setGeriatrico] = useState("");
    const [numAdultos, setNumAdultos] = useState("");
    const [infoEspecifica, setInfoEspecifica] = useState("");
    const [sinGeriatrico, setSinGeriatrico] = useState(false);
    //Datos familiar
    const [nombreFamiliar, setNombreFamiliar] = useState("");
    const [emailFamiliar, setEmailFamiliar] = useState("");
    const [numeroTelefono, setNumeroTelefono] = useState("");
    const [tipoFamiliar, setTipoFamiliar] = useState("seleccione");
    //Datos elder
    const [tieneEnfermedad, setTieneEnfermedad] = useState("seleccione");
    const [enfermedad, setEnfermedad] = useState("No");
    const [tomaMedicamentos, setTomaMedicamentos] = useState("seleccione");
    const [medicamentos, setMedicamentos] = useState("No");
    const [tieneAlergias, setTieneAlergias] = useState("seleccione");
    const [alergias, setAlergias] = useState("No");
    const [molestias, setMolestias] = useState("");
    const [gustos, setGustos] = useState("");
    //Datos del perfil
    const [checkingProfile, setCheckingProfile] = useState(true);
    const [nombre, setNombre] = useState("");
    const [rol, setRol] = useState("elder");

    const { user, loading: authLoading } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        const metadataName = user?.user_metadata?.username || user?.user_metadata?.display_name || "";
        if (metadataName && !nombre) {
            setNombre(metadataName);
        }
    }, [user, nombre]);

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

        if (!nombre.trim() || rol === "seleccione") {
            setAlertMessage("El nombre y el rol son obligatorios.");
            setErrorAlert(true);
            setErrorTextFields(true);
            setTimeout(() => {
                setErrorAlert(false);
                setErrorTextFields(false);
            }, 5000)
            return;
        };

        if (rol === "elder") {
            const incompletos = [tieneEnfermedad, tomaMedicamentos, tieneAlergias].some((s) => s === "seleccione");
            const detallesFaltantes =
                (tieneEnfermedad === "si" && !enfermedad.trim()) ||
                (tomaMedicamentos === "si" && !medicamentos.trim()) ||
                (tieneAlergias === "si" && !alergias.trim());

            if (incompletos || detallesFaltantes) {
                setAlertMessage("Debe completar todos los campos en ROJO de la persona adulta.");
                setErrorAlert(true);
                setErrorTextFields(true);
                setTimeout(() => {
                    setErrorAlert(false);
                    setErrorTextFields(false);
                }, 5000);
                return;
            };
        } else if (rol === "familiar") {
            const incompleto = [tipoFamiliar].some((s) => s === "seleccione");
            const detallesFaltantes =
                !nombreFamiliar.trim() ||
                !emailFamiliar.trim() ||
                !numeroTelefono.trim();

            if (incompleto || detallesFaltantes) {
                setAlertMessage("Debe completar todos los campos del familiar.");
                setErrorAlert(true);
                setErrorTextFields(true);
                setTimeout(() => {
                    setErrorAlert(false);
                    setErrorTextFields(false);
                }, 5000);
                return;
            };
        } else {
            if (!numAdultos || (!sinGeriatrico && !geriatrico.trim())) {
                setAlertMessage("Debe completar todos los campos en ROJO del cuidador.");
                setErrorAlert(true);
                setErrorTextFields(true);
                setTimeout(() => {
                    setErrorAlert(false);
                    setErrorTextFields(false);
                }, 5000);
                return;
            };
        };

        setErrorAlert(false);
        setErrorTextFields(false);
        setIsSaving(true);
        isProcessingRef.current = true;

        const successStore = await saveProfile(user.id, {
            username: nombre,
            role: rol,
            interests: gustos,
            email: user?.email,
            phone: user?.phone
        });

        if (!successStore) {
            setAlertMessage("Ocurrió un error al guardar tu perfil, intentá de nuevo.");
            setErrorAlert(true);
            setErrorTextFields(true);
            setTimeout(() => {
                setErrorAlert(false);
                setErrorTextFields(false);
            }, 5000);
            return;
        };

        try {
            if (rol === "elder") {
                const resultElder = await elderPeople(user.id, {
                    enfermedades: enfermedad,
                    medicamentos: medicamentos,
                    alergias: alergias,
                    molestias: molestias,
                    intereses: gustos
                });
                if (!resultElder.success) {
                    const { error: deleteError } = await supabase
                        .schema("public")
                        .from("profiles")
                        .delete()
                        .eq("id", user.id);

                    console.log("deleteError:", deleteError);
                    isProcessingRef.current = false;
                    setHasError(true);
                    setAlertMessage(traducirError(resultElder.message));
                    setErrorAlert(true);
                    setErrorTextFields(true);
                    setTimeout(() => {
                        setErrorAlert(false);
                        setErrorTextFields(false);
                        setHasError(true);
                    }, 5000);
                    setTimeout(() => setIsSaving(false), 500);
                    return;
                } else {
                    navigate("/paginaChatAI");
                    return;
                }

            } else if (rol === "familiar") {

                const resultLinkear = await linkearUsuarios(user.id, {
                    emailFamiliar: emailFamiliar,
                    rol: rol
                });

                if (!resultLinkear.success) {
                    const { error: deleteError } = await supabase
                        .schema("public")
                        .from("profiles")
                        .delete()
                        .eq("id", user.id);

                    console.log("deleteError:", deleteError);
                    isProcessingRef.current = false;
                    setHasError(true);
                    setAlertMessage(resultLinkear.message);
                    setErrorAlert(true);
                    setErrorTextFields(true);
                    setTimeout(() => {
                        setErrorAlert(false);
                        setErrorTextFields(false);
                        setHasError(false);
                    }, 5000);
                    setTimeout(() => setIsSaving(false), 500);
                    return;
                }

                const resultFamiliar = await familyPeople(user.id, {
                    relacion: tipoFamiliar,
                    nombreElder: nombreFamiliar,
                    numeroTelefono: numeroTelefono
                });

                if (!resultFamiliar.success) {
                    const { error: deleteError } = await supabase
                        .schema("public")
                        .from("profiles")
                        .delete()
                        .eq("id", user.id);

                    console.log("deleteError:", deleteError);
                    isProcessingRef.current = false;
                    setHasError(true);
                    setAlertMessage(traducirError(resultFamiliar.message));
                    setErrorAlert(true);
                    setErrorTextFields(true);
                    setTimeout(() => {
                        setErrorAlert(false);
                        setErrorTextFields(false);
                        setHasError(false);
                    }, 5000);
                    setTimeout(() => setIsSaving(false), 500);
                    return;
                }
                
                navigate("/paginaFamiliar");
                return;

            } else if (rol === "cuidador") {
                const resultCuidador = await caregivePeople(user.id, {
                    geriatrico: geriatrico,
                    adultosmayores: numAdultos,
                    infoamonitorear: infoEspecifica
                });
                if (!resultCuidador.success) {
                    const { error: deleteError } = await supabase
                        .schema("public")
                        .from("profiles")
                        .delete()
                        .eq("id", user.id);

                    console.log("deleteError:", deleteError);
                    isProcessingRef.current = false;
                    setHasError(true);
                    setAlertMessage(traducirError(resultCuidador.message));
                    setErrorAlert(true);
                    setErrorTextFields(true);
                    setTimeout(() => {
                        setErrorAlert(false);
                        setErrorTextFields(false);
                        setHasError(false);
                    }, 5000);
                    setTimeout(() => setIsSaving(false), 500);
                    return;
                } else {
                    navigate("/paginaCuidador");
                    return;
                }
            };
        } catch {
            const { error: deleteError } = await supabase
                .schema("public")
                .from("profiles")
                .delete()
                .eq("id", user.id);

            console.log("deleteError:", deleteError);
            isProcessingRef.current = false;
            setHasError(true);
            setAlertMessage(traducirError("Ocurrio un error inesperado, reintentelo."));
            setErrorAlert(true);
            setErrorTextFields(true);
            setTimeout(() => {
                setErrorAlert(false);
                setErrorTextFields(false);
                setHasError(false);
            }, 5000);
            setTimeout(() => setIsSaving(false), 500);
            return;
        };
    };

    useEffect(() => {
        if (authLoading || isSaving || isProcessingRef.current || hasError) return;
        if (!user) { navigate('/'); return; }

        const checkProfile = async () => {
            const { data } = await supabase
                .schema("public")
                .from("profiles")
                .select("role")
                .eq("id", user.id)
                .single()

            if (data && !isProcessingRef.current) {
                if (data.role === "elder") navigate("/paginaChatAI");
                if (data.role === "familiar") navigate("/paginaFamiliar");
                if (data.role === "cuidador") navigate("/paginaCuidador");
            } else if (!data) {
                setCheckingProfile(false);
            }
        };
        checkProfile();
    }, [user, authLoading, isSaving, navigate, hasError]);

    if (checkingProfile) return null;

    return (
        <>
            <Box
                sx={{
                    position: "fixed",
                    inset: 0,
                    zIndex: 0,
                    background: `url(${fondoChatAI})`,
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
                    justifyContent: "",
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
                            width: {
                                xs: "85%",
                                sm: "auto",
                                md: "auto",
                                lg: "auto",
                                xl: "auto"
                            },
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
                    sx={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        border: "none",
                        width: {
                            xs: "100%",
                            sm: "80%",
                            md: "50%",
                            lg: "35%",
                            xl: "27%",
                        },
                        p: { xs: 2, sm: 3, md: 3 },
                        borderRadius: 4,
                        boxShadow: 5,
                        background: "#ffffff",
                        gap: 1,
                        color: "#000000",
                    }}
                >
                    <Typography variant="h5"
                        sx={{
                            textAlign: "center",
                            color: "black",
                        }}
                    >Antes de comenzar
                    </Typography>
                    <Typography
                        variant="caption"
                        sx={{
                            color: "#000000",
                            display: "block",
                            lineHeight: 1.5,
                            textAlign: "center",
                            fontSize: {
                                xs: "1rem",
                                md: "1rem"
                            },
                        }}
                    >Completa tu información personal así teresa puede conocerte mejor y generar una mejor experiencia. Si tienes dudas puedes presionar este botón
                    </Typography>
                    <Divider sx={{
                        my: 0,
                        width: "100%",
                        "&::before, &::after": {
                            content: '""',
                            borderColor: "#000000",
                            borderTop: "1px solid #000000",
                            opacity: 1
                        },
                    }}>
                        <Typography variant="body1" sx={{ color: "#000000", fontWeight: 'bold' }}>∼</Typography>
                    </Divider>
                    <Box sx={{ my: 0, width: "100%" }}>
                        <Typography variant="body1" sx={{ color: "#000000" }}>¿Cómo te llamas?</Typography>
                        <VoiceTextField
                            error={errorTextFields}
                            placeholder="Nombre completo"
                            value={nombre}
                            onChange={(e) => setNombre(e.target.value)}
                            fullWidth
                            margin="dense"
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <Box sx={{ display: "flex", alignItems: "center", justifyContent: "flex-start", color: "#ffffff" }}>
                                            <BadgeRoundedIcon fontSize='medium' sx={{ mr: 1, color: "#000000" }}></BadgeRoundedIcon>
                                        </Box>
                                    </InputAdornment>
                                ),
                            }}
                            sx={{
                                backgroundColor: "#d7d6d6",
                                borderRadius: 3,
                                boxShadow: 3,
                                input: { color: "#000000" },
                                "& .MuiInputLabel-root": {
                                    color: "#000000",
                                    opacity: 0.8
                                },
                                "& .MuiInputLabel-root.Mui-focused": {
                                    color: "#000000 !important"
                                },
                                "& .MuiInputBase-input::placeholder": {
                                    color: "#000000",
                                    opacity: 0.6,
                                },
                                "& .MuiOutlinedInput-root": {
                                    borderRadius: 3,
                                    pr: 1,
                                    "& fieldset": {
                                        borderColor: "transparent"
                                    },
                                    "&:hover fieldset": {
                                        borderColor: "transparent"
                                    },
                                    "&.Mui-focused fieldset": {
                                        borderColor: "gray"
                                    },
                                },
                            }}
                        />
                    </Box>
                    <Box sx={{ my: 1, width: "100%" }}>
                        <Typography variant="body1" sx={{ color: "#000000" }}>¿Qué rol cumplis?</Typography>
                        <FormControl
                            error={errorTextFields}
                            component="fieldset"
                            sx={{
                                width: "100%",
                                mt: 1,
                                p: 1.5,
                                borderRadius: 3,
                                backgroundColor: "#d7d6d6",
                                boxShadow: 3,
                            }}
                        >
                            <RadioGroup
                                value={rol}
                                onChange={(e) => setRol(e.target.value)}
                                row
                                sx={{
                                    justifyContent: "space-between",
                                    gap: 1,
                                    "& .MuiFormControlLabel-root": {
                                        marginRight: 0,
                                        borderRadius: 3,
                                        px: 1.2,
                                        py: 0.5,
                                        flex: 1,
                                        border: "1px solid transparent",
                                    },
                                    "& .MuiFormControlLabel-root.Mui-checked": {
                                        borderColor: "gray",
                                    },
                                    "& .MuiRadio-root": {
                                        color: "#000000",
                                    },
                                    "& .MuiTypography-root": {
                                        color: "#000000",
                                        fontWeight: 500,
                                    },
                                }}
                            >
                                <FormControlLabel value="elder" control={<Radio />} label="🧓 Adulto mayor" />
                                <FormControlLabel value="familiar" control={<Radio />} label="🧑 Familiar" />
                            </RadioGroup>
                        </FormControl>
                        <FormHelperText sx={{ color: "#000000" }}>Si sos adulto mayor no cambies de opción</FormHelperText>
                    </Box>
                    {rol === "elder" ?
                        <InfoElder
                            tieneEnfermedad={tieneEnfermedad}
                            setTieneEnfermedad={setTieneEnfermedad}
                            enfermedad={enfermedad}
                            setEnfermedad={setEnfermedad}
                            tomaMedicamentos={tomaMedicamentos}
                            setTomaMedicamentos={setTomaMedicamentos}
                            medicamentos={medicamentos}
                            setMedicamentos={setMedicamentos}
                            tieneAlergias={tieneAlergias}
                            setTieneAlergias={setTieneAlergias}
                            alergias={alergias}
                            setAlergias={setAlergias}
                            molestias={molestias}
                            setMolestias={setMolestias}
                            gustos={gustos}
                            setGustos={setGustos}
                            errorTextFields={errorTextFields}
                            setErrorTextFields={setErrorTextFields}
                        />
                        : rol === "familiar" ?
                            <InfoFamiliar
                                nombreFamiliar={nombreFamiliar}
                                setNombreFamiliar={setNombreFamiliar}
                                emailFamiliar={emailFamiliar}
                                setEmailFamiliar={setEmailFamiliar}
                                numeroTelefono={numeroTelefono}
                                setNumeroTelefono={setNumeroTelefono}
                                tipoFamiliar={tipoFamiliar}
                                setTipoFamiliar={setTipoFamiliar}
                                errorTextFields={errorTextFields}
                                setErrorTextFields={setErrorTextFields}
                            />
                            : <InfoCuidador
                                geriatrico={geriatrico}
                                setGeriatrico={setGeriatrico}
                                numAdultos={numAdultos}
                                setNumAdultos={setNumAdultos}
                                infoEspecifica={infoEspecifica}
                                setInfoEspecifica={setInfoEspecifica}
                                sinGeriatrico={sinGeriatrico}
                                setSinGeriatrico={setSinGeriatrico}
                                errorTextFields={errorTextFields}
                                setErrorTextFields={setErrorTextFields}
                            />
                    }
                    <Divider sx={{
                        my: 0,
                        width: "100%",
                        "&::before, &::after": {
                            content: '""',
                            borderColor: "#000000",
                            borderTop: "1px solid #000000",
                            opacity: 1
                        },
                    }}>
                        <Typography variant="body1" sx={{ color: "#000000", fontWeight: 'bold' }}>∼</Typography>
                    </Divider>
                    <Box sx={{ width: "100%" }}>
                        <Button variant="contained" type="submit" fullWidth
                            sx={{
                                backgroundColor: "#7d745c",
                                borderRadius: 2,
                                boxShadow: 3,
                                color: "#ffffff",
                                textTransform: "none",
                                fontSize: "1rem",
                                "&:hover": {
                                    backgroundColor: "#67604d"
                                },
                                mr: 1,
                                mt: 1
                            }}>Guardar información
                        </Button>
                    </Box>
                </Paper>
            </Box>
        </>
    )
};

export default InformacionUsuarios;
