import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Typography, Button, TextField, Box, InputAdornment, Divider, IconButton, Link, Alert, Grid, Card, AppBar, Toolbar, Select, MenuItem, Accordion, AccordionSummary, AccordionDetails, Paper } from '@mui/material';
import { supabase } from '../../supabaseClient.js';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import fondoChatAI from "../../assets/images/fondoChatAI.png"
import logoTeresAI from "../../assets/images/logo_teresAI_noText.png"
import imagenLogin from "../../assets/images/imagenLogin.jpg"
import EmailRoundedIcon from '@mui/icons-material/EmailRounded';
import PasswordRoundedIcon from '@mui/icons-material/PasswordRounded';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffRoundedIcon from '@mui/icons-material/VisibilityOffRounded';
import { GoogleLogin } from '@react-oauth/google';
import DeviceUnknownRoundedIcon from '@mui/icons-material/DeviceUnknownRounded';
import ContactPhoneRoundedIcon from '@mui/icons-material/ContactPhoneRounded';
import SmsRoundedIcon from '@mui/icons-material/SmsRounded';
import { isStandaloneDisplayMode, promptInstallApp } from '../../pwa/installPrompt.js';
import { usePwaInstallPrompt } from '../../pwa/usePwaInstallPrompt.js';

const paises = [
    { codigo: 'AR', nombre: 'Argentina', prefijo: '+54' },
    { codigo: 'BR', nombre: 'Brasil', prefijo: '+55' },
    { codigo: 'CL', nombre: 'Chile', prefijo: '+56' },
    { codigo: 'UY', nombre: 'Uruguay', prefijo: '+598' },
];

const Login = () => {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [errorLogueo, setErrorLogueo] = useState(false);
    const [errorAlert, setErrorAlert] = useState(false);
    const [alertMessage, setAlertMessage] = useState("");
    const [phoneNumber, setPhoneNumber] = useState("");
    const [phoneCode, setPhoneCode] = useState("");
    const [phoneOtpSent, setPhoneOtpSent] = useState(false);
    const [phoneLoading, setPhoneLoading] = useState(false);
    const [phoneFeedback, setPhoneFeedback] = useState("");
    const [phoneFeedbackSeverity, setPhoneFeedbackSeverity] = useState("error");
    const [phoneFeedbackOpen, setPhoneFeedbackOpen] = useState(false);
    const [appInstalada, setAppInstalada] = useState(false);
    const deferredPrompt = usePwaInstallPrompt();
    const seccionPasosGoogle = useRef(null);
    const seccionPasosCodigo = useRef(null);
    const esIOS = /iphone|ipad|ipod/i.test(navigator.userAgent);
    const [countryCode, setCountryCode] = useState('+54');

    const irAPasosDetalladosGoogle = () => {
        seccionPasosGoogle.current?.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
        });
    };
    const irAPasosDetalladosCodigo = () => {
        seccionPasosCodigo.current?.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
        });
    };

    const traducirError = (mensaje) => {
        const errores = {
            "Invalid login credentials": "Email o contraseña incorrectos.",
            "missing email or phone": "Debe ingresar un email o contraseña.",
            "Email not confirmed": "El email no esta confirmado. Confirmelo.",
            "Too many request": "Demasiados intentos, espera unos minutos.",
            "User not found": "No existe una cuenta con ese email asociado.",
            "Network request failed": "Error de conexión, revisá tu internet",
            "Invalid phone number": "El número de teléfono no es válido.",
            "Token has expired or is invalid": "El código SMS no es válido o venció.",
            "SMS sending failed": "No se pudo enviar el código SMS.",
        };
        return errores[mensaje] || "Ocurrió un herror, intentelo de nuevo.";
    };

    const handleShowPassword = () => {
        setShowPassword((prev) => !prev);
    };

    const handleRegister = () => {
        navigate('/register');
    }

    const showPhoneFeedback = (message, severity = "error") => {
        setPhoneFeedback(message);
        setPhoneFeedbackSeverity(severity);
        setPhoneFeedbackOpen(true);
        window.setTimeout(() => {
            setPhoneFeedbackOpen(false);
        }, 6000);
    };

    const normalizePhoneNumber = (value) => String(value || "").trim().replace(/\s+/g, "");

    const handleSendPhoneOtp = async () => {
        const normalizedPhone = normalizePhoneNumber(countryCode + phoneNumber);

        if (!normalizedPhone) {
            showPhoneFeedback("Debes ingresár tu número de teléfono.", "error");
            return;
        }

        if (!normalizedPhone.startsWith("+")) {
            showPhoneFeedback("Usá formato internacional, por ejemplo +54911xxxxxxx.", "error");
            return;
        }

        setPhoneLoading(true);
        const { error } = await supabase.auth.signInWithOtp({
            phone: normalizedPhone,
            options: {
                channel: "sms",
            },
        });

        if (error) {
            showPhoneFeedback(traducirError(error.message), "error");
            setPhoneLoading(false);
            return;
        }

        setPhoneOtpSent(true);
        setPhoneCode("");
        showPhoneFeedback("Te enviaremos un código por SMS. Mira tus notificaciones", "success");
        setPhoneLoading(false);
    };

    const handleVerifyPhoneOtp = async () => {
        const normalizedPhone = normalizePhoneNumber(countryCode + phoneNumber);

        if (!phoneCode.trim()) {
            showPhoneFeedback("Debes ingresár el código que recibiste por SMS. Mira tus notificaciones", "error");
            return;
        }

        setPhoneLoading(true);
        const { error } = await supabase.auth.verifyOtp({
            phone: normalizedPhone,
            token: phoneCode.trim(),
            type: "sms",
        });

        if (error) {
            showPhoneFeedback(traducirError(error.message), "error");
            setPhoneLoading(false);
            return;
        }

        setPhoneFeedbackOpen(false);
        navigate('/infoUser');
        setPhoneLoading(false);
    };

    const loginUser = async (e) => {
        e.preventDefault();

        const { error } = await supabase.auth.signInWithPassword({
            email,
            password
        });

        if (error) {
            setErrorAlert(true);
            setErrorLogueo(true);
            setAlertMessage(traducirError(error.message));
            setTimeout(() => {
                setErrorAlert(false);
                setErrorLogueo(false);
            }, 7000);
            setEmail("");
            setPassword("");
            return;
        };
        navigate('/infoUser');
    };

    useEffect(() => {
        // Verificar si ya está instalada
        if (isStandaloneDisplayMode()) {
            setAppInstalada(true);
        }
    }, []);

    const handleInstalar = async () => {
        console.log("🔍 Verificando deferredPrompt:", deferredPrompt);

        if (!deferredPrompt) {
            console.log("❌ deferredPrompt es null - beforeinstallprompt no se capturó");
            // Fallback para iOS
            if (esIOS) {
                alert("En iOS: Toca Compartir (↑) → Agregar a pantalla de inicio");
            } else {
                alert("La app no está lista para instalar. Intenta recargar la página.");
            }
            return;
        }

        try {
            console.log("📱 Mostrando prompt de instalación...");
            const result = await promptInstallApp();
            if (!result) {
                alert("La app no está lista para instalar. Intenta recargar la página.");
                return;
            }

            const { outcome } = result;
            console.log(`✅ Usuario eligió: ${outcome}`);
        } catch (error) {
            console.error("❌ Error al instalar:", error);
            alert("Ocurrió un error al instalar la app. Intenta de nuevo.");
        }
    };

    return (
        <>
            <Box sx={{
                display: "flex",
                flexDirection: { xs: "column", sm: "row", md: "row" },
                justifyContent: { xs: "center", sm: "center", md: "center" },
                alignItems: { xs: "center", md: "center" },
                minHeight: "var(--app-height)",
                width: "100%",
                minWidth: 0,
                background: `url(${fondoChatAI})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
                backgroundRepeat: "no-repeat",
                px: { xs: 2, sm: 2, md: 0 },
                py: { xs: 2, md: 0 },
            }}>
                <Box sx={{
                    position: "relative",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: { xs: "flex-start", md: "center" },
                    alignItems: "center",
                    height: { xs: "auto", md: "90dvh" },
                    overflow: { xs: "visible", md: "hidden" },
                    width: { xs: "100%", sm: "100%", md: "45%" },
                    maxWidth: { xs: "100%", sm: 540, md: 700, lg: 800 },
                    p: { xs: 1, sm: 2, md: 2 },
                    mt: { xs: 2, md: 0 },

                }}>
                    <AppBar
                        elevation={0}
                        sx={{
                            background: "white",
                            backdropFilter: 'blur(16px)',
                            boxShadow: 3,
                            p: 0.35
                        }}
                    >
                        <Toolbar sx={{
                            display: 'flex',
                            height: "60px",
                            justifyContent: "space-between",
                            alignItems: "center",
                            px: { xs: 2, md: 6 },
                            py: 0.5
                        }}>
                            <Box
                                component="img"
                                alt="Imagen de abuelos"
                                src={logoTeresAI}
                                sx={{
                                    width: "auto",
                                    height: "65px",
                                }}>
                            </Box>
                            <Box>
                                <Button
                                    href="https://teresailanding.up.railway.app/"
                                    size='medium'
                                    sx={{
                                        color: "#464545",
                                        borderRadius: "100px",
                                        textTransform: "none",
                                        px: 1.2,

                                        mr: 1,
                                        "&:hover": { backgroundColor: "#e0e0e0" },
                                    }}
                                >
                                    Página oficial
                                </Button>
                                {!appInstalada && (
                                    esIOS ? (
                                        <Typography>Para instalar: Safari → compartir → "Agregar a pantalla de inicio"</Typography>
                                    ) : (
                                        <Button
                                            onClick={handleInstalar}
                                            sx={{
                                                display: 'inline-flex',
                                                backgroundColor: "#7d745c",
                                                borderRadius: "100px",
                                                px: 2.5,
                                                boxShadow: 3,
                                                color: "#ffffff",
                                                textTransform: "none",
                                                "&:hover": {
                                                    backgroundColor: "#67604d"
                                                },
                                            }}
                                        >
                                            Instalar app
                                        </Button>
                                    )
                                )}
                            </Box>
                        </Toolbar>
                    </AppBar>
                    <Card
                        sx={{
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "center",
                            maxHeight: { xs: "none", md: "100%" },
                            overflowY: { xs: "visible", md: "auto" },
                            width: '100%',
                            maxWidth: "550px",
                            background: "#ffffff",
                            p: { xs: 2 },
                            borderRadius: 3,
                            mt: { xs: "80px", md: 0 },
                            boxShadow: 5,
                            animation: "slideBounce 0.8s cubic-bezier(0.175, 0.885, 0.32, 1.275)",
                            "@keyframes slideBounce": {
                                from: {
                                    opacity: 0,
                                    transform: "translateY(-100px)"
                                },
                                to: {
                                    opacity: 1,
                                    transform: "translateY(0)"
                                }
                            }
                        }}
                    >
                        <Typography variant="h4" component="h1" sx={{
                            color: "#000000",
                            fontSize: {
                                xs: "1.6rem",
                                sm: "1.6rem",
                                md: "1.4rem",
                                lg: "1.5rem",
                                xl: "2rem"
                            },
                            mb:1
                        }} >
                            Bienvenido
                        </Typography>
                        <Typography
                            variant="caption"
                            sx={{
                                color: "rgb(0, 0, 0)",
                                display: "block",
                                lineHeight: 1.5,
                                textAlign: "center",
                                fontSize: {
                                    xs: "1rem",
                                    md: "1rem"
                                },
                            }}
                        >
                            Si eres el familiar a cargo primero registra al adulto mayor y luego registrate tú. Caso contrario, si eres el adulto mayor, simplemente registrate y empieza a usar a teresa.
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
                        <Typography variant='body1' sx={{
                            color: "#000000",
                            mb: 1,
                            textAlign: "center",
                            fontSize: {
                                xs: "1.2rem",
                                sm: "1.2rem",
                                md: "1.3rem",
                                lg: "1.3rem",
                                xl: "1.3rem"
                            },
                        }}>Ingresar con Google
                        </Typography>
                        <GoogleLogin
                            onSuccess={async (credentialResponse) => {
                                const { error } = await supabase.auth.signInWithIdToken({
                                    provider: 'google',
                                    token: credentialResponse.credential,
                                });
                                if (!error) navigate('/chatAI');
                            }}
                            onError={() => console.log('Error con Google')}
                            theme="filled_blue"
                            size="large"
                            shape="circle"
                            text="signin_with"
                            locale="es"
                            width="280"
                        />
                        <Typography
                            variant="caption"
                            sx={{
                                color: "rgb(0, 0, 0)",
                                display: "block",
                                lineHeight: 1.5,
                                textAlign: "center",
                                fontSize: {
                                    xs: "1rem",
                                    md: "1rem"
                                },
                                mt: 2
                            }}
                        >
                            Presiona el botón azul, selecciona la cuenta de email que quieras usar, acepta los terminos y condidiciones y listo. Para más información presiona en
                            <Link
                                onClick={irAPasosDetalladosGoogle}
                                component="button"
                                variant="body1"
                                sx={{
                                    ml: 1,
                                    color: '#4285F4',
                                    fontWeight: 'bold',
                                    verticalAlign: 'baseline',
                                    fontSize: 'inherit',
                                    fontFamily: 'inherit',
                                    cursor: 'pointer',
                                    textDecoration: 'underline',
                                    '&:hover': { color: '#357ae8' }
                                }}
                            >
                                Ayuda
                            </Link>
                        </Typography>
                        <Divider sx={{
                            my: 1,
                            width: "100%",
                            "&::before, &::after": {
                                content: '""',
                                borderColor: "#000000",
                                borderTop: "1px solid #000000",
                                opacity: 1
                            },
                        }}>
                            <Typography variant="body1" sx={{ color: "#000000" }}>O también puedes</Typography>
                        </Divider>
                        <Box sx={{
                            width: "100%",
                            borderRadius: 3,
                            boxShadow: 0,
                            textAlign: "center"
                        }}>
                            <Typography variant="body1" sx={{
                                color: "#000000",
                                mb: 1,
                                fontSize: {
                                    xs: "1.2rem",
                                    sm: "1.2rem",
                                    md: "1.3rem",
                                    lg: "1.3rem",
                                    xl: "1.3rem"
                                },
                            }}>
                                Ingresar con tú teléfono
                            </Typography>
                            <Typography
                                variant="caption"
                                sx={{
                                    color: "rgb(0, 0, 0)",
                                    display: "block",
                                    lineHeight: 1.5,
                                    textAlign: "center",
                                    fontSize: {
                                        xs: "1rem",
                                        md: "1rem"
                                    },
                                    my: 1
                                }}
                            >
                                Escribe tú número de teléfono e ingresa aquí el código que te enviaremos por SMS. Si no lo recibiste presiona en "Reenviar código". Para más información presiona en
                                <Link
                                    onClick={irAPasosDetalladosCodigo}
                                    component="button"
                                    variant="body1"
                                    sx={{
                                        ml: 1,
                                        color: '#4285F4',
                                        fontWeight: 'bold',
                                        verticalAlign: 'baseline',
                                        fontSize: 'inherit',
                                        fontFamily: 'inherit',
                                        cursor: 'pointer',
                                        textDecoration: 'underline',
                                        '&:hover': { color: '#357ae8' }
                                    }}
                                >
                                    Ayuda
                                </Link>
                            </Typography>
                            {phoneFeedbackOpen ? (
                                <Alert
                                    variant='filled'
                                    severity={phoneFeedbackSeverity}
                                    sx={{ mb: 1.5, borderRadius: 3, color: "#ffffff", fontSize: "1rem", boxShadow: 3 }}
                                >
                                    {phoneFeedback}
                                </Alert>
                            ) : null}
                            <TextField
                                label="Número de Teléfono"
                                value={phoneNumber}
                                onChange={(e) => setPhoneNumber(e.target.value)}
                                placeholder="9 353 244165"
                                fullWidth
                                margin="dense"
                                type="tel"
                                sx={{
                                    backgroundColor: "#d7d6d6",
                                    borderRadius: 3,
                                    boxShadow: 3,
                                    mb: 1,
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
                                    "& .MuiFormHelperText-root": {
                                        color: "#000000 !important",
                                        opacity: 0.8,
                                        fontWeight: 500,
                                    },
                                }}
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <Select
                                                value={countryCode}
                                                onChange={(e) => setCountryCode(e.target.value)}
                                                variant="standard"
                                                disableUnderline
                                                sx={{
                                                    color: "#000000",

                                                    "& .MuiSelect-select": {
                                                        paddingTop: 0,
                                                        paddingBottom: 0,
                                                        display: "flex",
                                                        alignItems: "center",
                                                        backgroundColor: "transparent",
                                                    },
                                                    "& .MuiSelect-icon": {
                                                        color: "#000000",
                                                    },
                                                    "& .MuiSelect-iconOpen": {
                                                        color: "#000000",
                                                    }
                                                }}
                                            >
                                                {paises.map((pais) => (
                                                    <MenuItem key={pais.codigo} value={pais.prefijo}>
                                                        {pais.codigo} ({pais.prefijo})
                                                    </MenuItem>
                                                ))}
                                            </Select>
                                        </InputAdornment>
                                    ),
                                }}
                            />
                            {phoneOtpSent ? (
                                <TextField
                                    value={phoneCode}
                                    onChange={(e) => setPhoneCode(e.target.value)}
                                    placeholder="Código SMS"
                                    fullWidth
                                    margin="dense"
                                    inputProps={{ inputMode: "numeric" }}
                                    sx={{
                                        backgroundColor: "#d7d6d6",
                                        borderRadius: 3,
                                        boxShadow: 3,
                                        my: 1,
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
                                        "& .MuiFormHelperText-root": {
                                            color: "#000000 !important",
                                            opacity: 0.8,
                                            fontWeight: 500,
                                        },
                                    }}
                                    InputProps={{
                                        startAdornment: (
                                            <InputAdornment position="start">
                                                <SmsRoundedIcon sx={{ color: "#000000", mr: 1 }} />
                                            </InputAdornment>
                                        ),
                                    }}
                                />
                            ) : null}
                            <Button
                                variant="contained"
                                fullWidth
                                disabled={phoneLoading}
                                onClick={phoneOtpSent ? handleVerifyPhoneOtp : handleSendPhoneOtp}
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
                                    "&.Mui-disabled": {
                                        backgroundColor: "#5a5342",
                                        color: "#ffffff !important",
                                    },
                                    my: 1,
                                }}
                            >
                                {phoneLoading ? "Procesando..." : phoneOtpSent ? "Verificar código" : "Enviar código"}
                            </Button>
                            {phoneOtpSent ? (
                                <Button
                                    variant="text"
                                    fullWidth
                                    onClick={handleSendPhoneOtp}
                                    disabled={phoneLoading}
                                    sx={{
                                        color: "#464545",
                                        fontWeight: "bold",
                                        borderRadius: 2,
                                        textTransform: "none",
                                        fontSize: "1rem",
                                        "&:hover": { backgroundColor: "#e0e0e0" },
                                    }}
                                >
                                    Reenviar código
                                </Button>
                            ) : null}
                        </Box>
                        <Box component="form" onSubmit={loginUser} sx={{ display: 'none' }}>
                            {errorAlert ?
                                <Alert variant="filled" severity="error" sx={{ my: 1, boxShadow: 1, borderRadius: 3, fontSize: "1rem", fontFamily: "'Lora', serif" }}>{alertMessage}</Alert>
                                :
                                null
                            }
                            <TextField
                                error={errorLogueo}
                                placeholder="Correo electrónico"
                                variant="outlined"
                                margin="dense"
                                fullWidth
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                sx={{
                                    backgroundColor: "#d7d6d6",
                                    color: "#000000",
                                    borderRadius: 3,
                                    boxShadow: 3,
                                    my: 1,
                                    input: { color: "black" },
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
                                    "& .MuiInputBase-input": {
                                        color: "#000000",
                                        fontWeight: 500,
                                    },
                                }}
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <Box sx={{ display: "flex", alignItems: "center", justifyContent: "flex-start", color: "#000000" }}>
                                                <EmailRoundedIcon fontSize='medium' sx={{ mr: 1 }}></EmailRoundedIcon>
                                            </Box>
                                        </InputAdornment>
                                    ),
                                }}
                            />
                        </Box>

                        {/* FORMULARIO DE LOGIN/REGISTRO COMENTADO - Mantener para referencia futura */}
                        <Box component="form" onSubmit={loginUser} sx={{ display: 'none' }}>
                            <Divider sx={{
                                my: 1,
                                color: "#000000",
                                "&:after": {
                                    borderColor: "#000000"
                                },
                                "&:before": {
                                    borderColor: "#000000"
                                },
                            }}>
                                <Typography variant="body1">O</Typography>
                            </Divider>
                            {errorAlert ?
                                <Alert variant="filled" severity="error" sx={{ my: 1, boxShadow: 1, borderRadius: 3, fontSize: "1rem", fontFamily: "'Lora', serif" }}>{alertMessage}</Alert>
                                :
                                null
                            }
                            <TextField
                                error={errorLogueo}
                                placeholder="Correo electrónico"
                                variant="outlined"
                                margin="dense"
                                fullWidth
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                sx={{
                                    backgroundColor: "#d7d6d6",
                                    color: "#000000",
                                    borderRadius: 3,
                                    boxShadow: 3,
                                    my: 1,
                                    input: { color: "black" },
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
                                    "& .MuiInputBase-input": {
                                        color: "#000000",
                                        fontWeight: 500,
                                    },
                                }}
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <Box sx={{ display: "flex", alignItems: "center", justifyContent: "flex-start", color: "#000000" }}>
                                                <EmailRoundedIcon fontSize='medium' sx={{ mr: 1 }}></EmailRoundedIcon>
                                            </Box>
                                        </InputAdornment>
                                    ),
                                }}
                            />
                            <br />
                            <TextField
                                error={errorLogueo}
                                placeholder="Contraseña"
                                type={showPassword ? "text" : "password"}
                                variant="outlined"
                                margin="dense"
                                fullWidth
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                sx={{
                                    backgroundColor: "#d7d6d6",
                                    color: "#000000",
                                    borderRadius: 3,
                                    boxShadow: 3,
                                    my: 1,
                                    mb: 2,
                                    input: { color: "black" },
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
                                    "& .MuiInputBase-input": {
                                        color: "#000000",
                                        fontWeight: 500,
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

                            />
                            <Button variant="contained" type="submit" fullWidth
                                sx={{
                                    mb: 2,
                                    boxShadow: 3,
                                    borderRadius: 2,
                                    backgroundColor: "#7d745c",
                                    color: "#ffffff",
                                    fontSize: "1rem",
                                    textTransform: "none",
                                    "&:hover": {
                                        backgroundColor: "#67604d"
                                    },
                                }}>Ingresar
                            </Button>
                            <br />
                            <Typography variant='body1' sx={{
                                color: "#000000",
                                my: 0,
                                fontFamily: "'Lora', serif",
                                textAlign: "center"
                            }}>¿No tienes una cuenta? crea una aquí!</Typography>
                            <Button variant="outlined" onClick={handleRegister} fullWidth
                                sx={{
                                    color: "#ffffff",
                                    mb: 1,
                                    mt: 1,
                                    border: "none",
                                    borderRadius: 2,
                                    boxShadow: 2,
                                    backgroundColor: "#67604d",
                                    fontSize: "1rem",
                                    textTransform: "none",
                                    "&:hover": {
                                        backgroundColor: "#514c3d"
                                    },
                                }}>Registrate
                            </Button>
                        </Box>
                    </Card>
                </Box>
                <Box sx={{
                    display: {
                        xs: "none",
                        sm: "none",
                        md: "block",
                        lg: "block",
                        xl: "block"
                    },
                    position: "relative",
                    height: "var(--app-height)",
                    width: "60%",
                    overflowY: "hidden",
                    boxShadow: 5,
                    mt: "60px"
                }}>
                    <Box
                        component="img"
                        alt="Imagen de abuelos"
                        src={imagenLogin}
                        sx={{
                            height: "100%",
                            width: "100%",
                            objectFit: "cover",
                        }}>
                    </Box>
                    <Box sx={{
                        position: "absolute",
                        inset: 0,
                        background: "linear-gradient(to bottom, rgba(0, 0, 0, 0.34) 40%, rgba(0, 0, 0, 0.7) 100%)",
                    }} />
                    <Box sx={{
                        position: "absolute",
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "center",
                        alignItems: "center",
                        top: "50%",
                        left: "55%",
                        transform: "translate(-50%,-50%)",
                        color: "#ffffff",
                        width: "60%"
                    }}>
                        <Box>
                            <Typography sx={{ fontSize: "2rem", fontStyle: "italic", fontWeight: 300 }}>
                                El acompañamiento que merecen,
                            </Typography>
                            <Typography sx={{ fontSize: "3rem", fontWeight: "bold" }}>
                                siempre cerca.
                            </Typography>

                            <Box sx={{ mt: 2 }}> {/* espacio entre los dos bloques */}
                                <Typography sx={{ fontSize: "2rem", fontStyle: "italic", fontWeight: 300 }}>
                                    Cuidado, compañía y memoria.
                                </Typography>
                                <Typography sx={{ fontSize: "3rem", fontWeight: "bold" }}>
                                    Todo en uno.
                                </Typography>
                            </Box>
                        </Box>
                    </Box>
                </Box>
            </Box >
            <Box ref={seccionPasosGoogle} sx={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: { xs: "center", md: "center" },
                minHeight: "var(--app-height)",
                width: "100%",
                minWidth: 0,
                background: `url(${fondoChatAI})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
                backgroundRepeat: "no-repeat",
                px: { xs: 2, sm: 2, md: 2 },
                py: { xs: 2, md: 0 }
            }}>
                <Box
                    sx={{
                        width: '100%',
                        margin: 'auto',
                        animation: 'slideDown 0.4s ease',
                        p: 1,
                        '@keyframes slideDown': {
                            from: {
                                opacity: 0,
                                transform: 'translateY(-40px)',
                            },
                            to: {
                                opacity: 1,
                                transform: 'translateY(0)',
                            },
                        },
                    }}
                >
                    <Box
                        sx={{
                            display: 'flex',
                            flexDirection: "column",
                            alignItems: 'center',
                            justifyContent: 'center',
                            my: 1,
                            borderRadius: 3,
                            p: 2,
                        }}
                    >
                        <Typography variant="h4" sx={{
                            color: "#000000",
                            fontSize: {
                                xs: "1.4rem",
                                sm: "1.4rem",
                                md: "1.4rem",
                                lg: "1.5rem",
                                xl: "1.8rem"
                            },
                            whiteSpace: "nowrap",
                        }} >
                            ¿Cómo ingresar a la aplicación?
                        </Typography>
                        <Typography
                            variant="caption"
                            sx={{
                                color: "rgb(0, 0, 0)",
                                display: "block",
                                lineHeight: 1.5,
                                textAlign: "center",
                                fontSize: {
                                    xs: "1rem",
                                    md: "1.1rem"
                                },
                                mt: 2
                            }}
                        >
                            En esta guia podrás encontrar el paso a paso de como ingresar con los 2 métodos de inicio de sesión que posee TeresAI.
                        </Typography>
                    </Box>
                    <Grid container spacing={3}>
                        <Grid size={{
                            xs: 12,
                            sm: 12,
                            md: 12,
                            lg: 6
                        }}>
                            <Paper
                                elevation={4}
                                sx={{
                                    display: "flex",
                                    flexDirection: "column",
                                    justifyContent: "flex-start",
                                    width: "100%",
                                    height: "100%",
                                    p: { xs: 2, sm: 3, md: 3 },
                                    borderRadius: 4,
                                    boxShadow: 5,
                                    background: "#ffffff",
                                    flexGrow: 0,
                                }}
                            >
                                <Box
                                    sx={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        bgcolor: '#d7d6d6',
                                        borderRadius: 3,
                                        p: 2,
                                        pl: 3,
                                    }}
                                >
                                    <Typography
                                        sx={{
                                            fontWeight: 500,
                                            fontSize: {
                                                xs: '1.2rem',
                                                sm: '1.2rem',
                                                md: '1.2rem',
                                                lg: '1.3rem',
                                                xl: '1.3rem',
                                            },
                                            color: '#000000',
                                            textAlign: "center"
                                        }}
                                    >
                                        ¿Cómo funciona el inicio de sesión con Google?
                                    </Typography>
                                </Box>
                                <Box sx={{ p: 3, display: 'flex', flexDirection: 'column', gap: 1.5 }}>

                                    {/* Paso 1 */}
                                    <Box
                                        sx={{
                                            p: 2,
                                            backgroundColor: 'rgba(255, 255, 255, 0.8)',
                                            borderRadius: 3,
                                            borderLeft: '4px solid #4285F4',
                                        }}
                                    >
                                        <Typography
                                            variant="caption"
                                            sx={{
                                                color: "rgb(0, 0, 0)",
                                                display: "block",
                                                lineHeight: 1.5,
                                                textAlign: "center",
                                                fontSize: {
                                                    xs: "1rem",
                                                    md: "1rem"
                                                },
                                                my: 1
                                            }}
                                        ></Typography>
                                        <Typography variant="subtitle2" sx={{
                                            color: '#4285F4', fontWeight: 'bold', mb: 0.5, fontSize: {
                                                xs: "1rem",
                                                md: "1rem"
                                            },
                                        }}>
                                            Paso 1: Haz clic en el botón azul
                                        </Typography>
                                        <Typography variant="body2" sx={{
                                            color: "rgb(0, 0, 0)",
                                            display: "block",
                                            lineHeight: 1.5,
                                            fontSize: {
                                                xs: "1rem",
                                                md: "1rem"
                                            },
                                            my: 1
                                        }}>
                                            Presiona el botón "Iniciar sesión con Google" o "Continuar con Google" para iniciar el proceso de autenticación.
                                        </Typography>
                                    </Box>

                                    {/* Paso 2 */}
                                    <Box
                                        sx={{
                                            p: 2,
                                            backgroundColor: 'rgba(255, 255, 255, 0.8)',
                                            borderRadius: 3,
                                            borderLeft: '4px solid #EA4335',
                                        }}
                                    >
                                        <Typography variant="subtitle2" sx={{
                                            color: '#EA4335', fontWeight: 'bold', mb: 0.5, fontSize: {
                                                xs: "1rem",
                                                md: "1rem"
                                            },
                                        }}>
                                            Paso 2: Selecciona tu cuenta
                                        </Typography>
                                        <Typography variant="body2" sx={{
                                            color: "rgb(0, 0, 0)",
                                            display: "block",
                                            lineHeight: 1.5,
                                            fontSize: {
                                                xs: "1rem",
                                                md: "1rem"
                                            },
                                            my: 1
                                        }}>
                                            Se abrirá una ventana emergente en la cual deberás seleccionar el email con el que vas a querer ingresar. Además, podrás agregar un email nuevo apretando el botón de "Usar otra cuenta". <br />
                                            Por otro lado, si no te deja seleccionar un email y, en cambio, te aparece una casilla vacia, entonces deberás escribir tu email y luego la contraseña de tu email manualmente para poder ingresar.
                                        </Typography>
                                    </Box>

                                    {/* Paso 3 */}
                                    <Box
                                        sx={{
                                            p: 2,
                                            backgroundColor: 'rgba(255, 255, 255, 0.8)',
                                            borderRadius: 3,
                                            borderLeft: '4px solid #FBBC04',
                                        }}
                                    >
                                        <Typography variant="subtitle2" sx={{
                                            color: '#FBBC04', fontWeight: 'bold', mb: 0.5, fontSize: {
                                                xs: "1rem",
                                                md: "1rem"
                                            },
                                        }}>
                                            Paso 3: Autoriza el acceso a tu cuenta
                                        </Typography>
                                        <Typography variant="body2" sx={{
                                            color: "rgb(0, 0, 0)",
                                            display: "block",
                                            lineHeight: 1.5,
                                            fontSize: {
                                                xs: "1rem",
                                                md: "1rem"
                                            },
                                            my: 1
                                        }}>
                                            Seleccionado tú email, Google te pedirá que TeresAI acceda a la información de tu cuenta (foto de perfíl, email, etc.). Es necesario que se acepte esto para poder disfrutar de todos los beneficios de la aplicación. <br />
                                            En caso de no ser un usuario nuevo, no se te pedirá esto y solamente tendrás que seleccionar tu email.
                                        </Typography>
                                    </Box>

                                    {/* Paso 4 */}
                                    <Box
                                        sx={{
                                            p: 2,
                                            backgroundColor: 'rgba(255, 255, 255, 0.8)',
                                            borderRadius: 3,
                                            borderLeft: '4px solid #34A853',
                                        }}
                                    >
                                        <Typography variant="subtitle2" sx={{
                                            color: '#34A853', fontWeight: 'bold', mb: 0.5, fontSize: {
                                                xs: "1rem",
                                                md: "1rem"
                                            },
                                        }}>
                                            Paso 4: ¡Listo!
                                        </Typography>
                                        <Typography variant="body2" sx={{
                                            color: "rgb(0, 0, 0)",
                                            display: "block",
                                            lineHeight: 1.5,
                                            fontSize: {
                                                xs: "1rem",
                                                md: "1rem"
                                            },
                                            my: 1
                                        }}>
                                            Una vez que el sistema haya validado tu email, la misma aplicación validará tu identidad y podrás ingresar sin inconvenientes.
                                        </Typography>
                                    </Box>
                                </Box>
                            </Paper>
                        </Grid>
                        <Grid size={{
                            xs: 12,
                            sm: 12,
                            md: 12,
                            lg: 6
                        }}>
                            <Paper
                                ref={seccionPasosCodigo}
                                elevation={4}
                                sx={{
                                    display: "flex",
                                    flexDirection: "column",
                                    justifyContent: "flex-start",
                                    width: "100%",
                                    height: "100%",
                                    p: { xs: 2, sm: 3, md: 3 },
                                    borderRadius: 4,
                                    boxShadow: 5,
                                    background: "#ffffff",
                                    flexGrow: 0,
                                }}
                            >
                                <Box
                                    sx={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        bgcolor: '#d7d6d6',
                                        borderRadius: 3,
                                        p: 2,
                                        pl: 3,
                                    }}
                                >
                                    <Typography
                                        sx={{
                                            fontWeight: 500,
                                            fontSize: {
                                                xs: '1.2rem',
                                                sm: '1.2rem',
                                                md: '1.3rem',
                                                lg: '1.3rem',
                                                xl: '1.3rem',
                                            },
                                            color: '#000000',
                                            textAlign: "center"
                                        }}
                                    >
                                        ¿Cómo funciona el inicio de sesión con código de teléfono?
                                    </Typography>
                                </Box>
                                <Box sx={{ p: 3, display: 'flex', flexDirection: 'column', gap: 1.5 }}>

                                    {/* Paso 1 */}
                                    <Box
                                        sx={{
                                            p: 2,
                                            backgroundColor: 'rgba(255, 255, 255, 0.8)',
                                            borderRadius: 3,
                                            borderLeft: '4px solid #4285F4',
                                        }}
                                    >
                                        <Typography
                                            variant="caption"
                                            sx={{
                                                color: "rgb(0, 0, 0)",
                                                display: "block",
                                                lineHeight: 1.5,
                                                textAlign: "center",
                                                fontSize: {
                                                    xs: "1rem",
                                                    md: "1rem"
                                                },
                                                my: 1
                                            }}
                                        ></Typography>
                                        <Typography variant="subtitle2" sx={{
                                            color: '#4285F4', fontWeight: 'bold', mb: 0.5, fontSize: {
                                                xs: "1rem",
                                                md: "1rem"
                                            },
                                        }}>
                                            Paso 1: Ingresar número de teléfono
                                        </Typography>
                                        <Typography variant="body2" sx={{
                                            color: "rgb(0, 0, 0)",
                                            display: "block",
                                            lineHeight: 1.5,
                                            fontSize: {
                                                xs: "1rem",
                                                md: "1rem"
                                            },
                                            my: 1
                                        }}>
                                            Presiona la casilla donde está el número teléfonico de ejemplo y escribe tú número teléfonico ahí. Este debe ser en formato nacional.
                                        </Typography>
                                    </Box>

                                    {/* Paso 2 */}
                                    <Box
                                        sx={{
                                            p: 2,
                                            backgroundColor: 'rgba(255, 255, 255, 0.8)',
                                            borderRadius: 3,
                                            borderLeft: '4px solid #EA4335',
                                        }}
                                    >
                                        <Typography variant="subtitle2" sx={{
                                            color: '#EA4335', fontWeight: 'bold', mb: 0.5, fontSize: {
                                                xs: "1rem",
                                                md: "1rem"
                                            },
                                        }}>
                                            Paso 2: Recibir código via notifiación
                                        </Typography>
                                        <Typography variant="body2" sx={{
                                            color: "rgb(0, 0, 0)",
                                            display: "block",
                                            lineHeight: 1.5,
                                            fontSize: {
                                                xs: "1rem",
                                                md: "1rem"
                                            },
                                            my: 1
                                        }}>
                                            Una vez hayas hecho eso, tendrás que apretar el botón de abajo que dice "Enviar código". Al hacer esto te llegará un código que deberás usar en el paso siguiente. <br />
                                            Si por algún motivo no recibiste un código en tu casilla de notificaciones, puedes presionar en "Reenviar código". Esto intentará mandarte el código nuevamente para que lo vuelvas a intentar.
                                        </Typography>
                                    </Box>

                                    {/* Paso 3 */}
                                    <Box
                                        sx={{
                                            p: 2,
                                            backgroundColor: 'rgba(255, 255, 255, 0.8)',
                                            borderRadius: 3,
                                            borderLeft: '4px solid #FBBC04',
                                        }}
                                    >
                                        <Typography variant="subtitle2" sx={{
                                            color: '#FBBC04', fontWeight: 'bold', mb: 0.5, fontSize: {
                                                xs: "1rem",
                                                md: "1rem"
                                            },
                                        }}>
                                            Paso 3: Escribir el código
                                        </Typography>
                                        <Typography variant="body2" sx={{
                                            color: "rgb(0, 0, 0)",
                                            display: "block",
                                            lineHeight: 1.5,
                                            fontSize: {
                                                xs: "1rem",
                                                md: "1rem"
                                            },
                                            my: 1
                                        }}>
                                            A este código lo deberás escribir en la casilla que aparecera abajo, con la leyenda "Código SMS". Aprietas la casilla y escribes el código.
                                        </Typography>
                                    </Box>

                                    {/* Paso 4 */}
                                    <Box
                                        sx={{
                                            p: 2,
                                            backgroundColor: 'rgba(255, 255, 255, 0.8)',
                                            borderRadius: 3,
                                            borderLeft: '4px solid #34A853',
                                        }}
                                    >
                                        <Typography variant="subtitle2" sx={{
                                            color: '#34A853', fontWeight: 'bold', mb: 0.5, fontSize: {
                                                xs: "1rem",
                                                md: "1rem"
                                            },
                                        }}>
                                            Paso 4: ¡Listo!
                                        </Typography>
                                        <Typography variant="body2" sx={{
                                            color: "rgb(0, 0, 0)",
                                            display: "block",
                                            lineHeight: 1.5,
                                            fontSize: {
                                                xs: "1rem",
                                                md: "1rem"
                                            },
                                            my: 1
                                        }}>
                                            Una vez que el sistema haya validado el código insertado, la misma aplicación validará tu identidad y podrás ingresar sin inconvenientes.
                                        </Typography>
                                    </Box>
                                </Box>
                            </Paper>
                        </Grid>
                    </Grid>
                    <Box
                        sx={{
                            p: 2,
                            bgcolor: '#d7d6d6',
                            borderRadius: 3,
                            my: 3,
                            boxShadow: 5,
                            textAlign: 'center',
                        }}
                    >
                        <Typography variant="caption" sx={{
                            color: "rgb(0, 0, 0)",
                            display: "block",
                            lineHeight: 1.5,
                            fontSize: {
                                xs: "1rem",
                                md: "1rem"
                            },
                            my: 1,
                            fontStyle: 'italic'
                        }}>
                            🔒 Tu información está protegida. Google nunca compartirá tus datos personales como contraseñas o datos sensibles con TeresAI.
                        </Typography>
                    </Box>
                </Box>
            </Box>
        </>
    )
};

export default Login;
