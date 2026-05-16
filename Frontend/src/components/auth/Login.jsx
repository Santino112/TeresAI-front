import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Typography, Button, TextField, Box, InputAdornment, Divider, IconButton, Alert, Card, AppBar, Toolbar, Accordion, AccordionSummary, AccordionDetails } from '@mui/material';
import { supabase } from '../../supabaseClient.js';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import fondoChatAI from "../../assets/images/fondoChatAI.png"
import logoTeresAI from "../../assets/images/logo_teresAI.png"
import imagenLogin from "../../assets/images/imagenLogin.jpg"
import EmailRoundedIcon from '@mui/icons-material/EmailRounded';
import PasswordRoundedIcon from '@mui/icons-material/PasswordRounded';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffRoundedIcon from '@mui/icons-material/VisibilityOffRounded';
import { GoogleLogin } from '@react-oauth/google';
import DeviceUnknownRoundedIcon from '@mui/icons-material/DeviceUnknownRounded';
import ContactPhoneRoundedIcon from '@mui/icons-material/ContactPhoneRounded';
import SmsRoundedIcon from '@mui/icons-material/SmsRounded';

const steps = [
    {
        id: 'panel1',
        icon: <DeviceUnknownRoundedIcon sx={{ mr: 2, color: '#7d745c' }} />,
        label: "¿Cómo funciona el inicio de sesión con Google?",
        description: (
            <Box sx={{ mt: 1, width: '100%' }}>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                    <Box sx={{
                        p: 2,
                        backgroundColor: 'rgba(255, 255, 255, 0.8)',
                        borderRadius: 3,
                        borderLeft: '4px solid #4285F4'
                    }}>
                        <Typography variant="subtitle2" sx={{
                            color: "#4285F4",
                            fontWeight: 'bold',
                            mb: 0.5
                        }}>Paso 1: Haz clic en el botón</Typography>
                        <Typography variant="body2" sx={{
                            color: "#000000",
                            fontSize: '0.9rem'
                        }}>Presiona el botón "Continuar con Google" para iniciar el proceso de autenticación.</Typography>
                    </Box>
                    {/* Paso 2 */}
                    <Box sx={{
                        p: 2,
                        backgroundColor: 'rgba(255, 255, 255, 0.8)',
                        borderRadius: 3,
                        borderLeft: '4px solid #EA4335'
                    }}>
                        <Typography variant="subtitle2" sx={{
                            color: "#EA4335",
                            fontWeight: 'bold',
                            mb: 0.5
                        }}>Paso 2: Selecciona tu cuenta</Typography>
                        <Typography variant="body2" sx={{
                            color: "#000000",
                            fontSize: '0.9rem'
                        }}>Se abrirá una ventana de Google donde podrás elegir la cuenta de correo que deseas usar.</Typography>
                    </Box>

                    {/* Paso 3 */}
                    <Box sx={{
                        p: 2,
                        backgroundColor: 'rgba(255, 255, 255, 0.8)',
                        borderRadius: 3,
                        borderLeft: '4px solid #FBBC04'
                    }}>
                        <Typography variant="subtitle2" sx={{
                            color: "#FBBC04",
                            fontWeight: 'bold',
                            mb: 0.5
                        }}>Paso 3: Autoriza el acceso</Typography>
                        <Typography variant="body2" sx={{
                            color: "#000000",
                            fontSize: '0.9rem'
                        }}>Google te pedirá que autorices que TeresAI acceda a tu información de perfil de forma segura.</Typography>
                    </Box>

                    {/* Paso 4 */}
                    <Box sx={{
                        p: 2,
                        backgroundColor: 'rgba(255, 255, 255, 0.8)',
                        borderRadius: 3,
                        borderLeft: '4px solid #34A853'
                    }}>
                        <Typography variant="subtitle2" sx={{
                            color: "#34A853",
                            fontWeight: 'bold',
                            mb: 0.5
                        }}>Paso 4: ¡Listo!</Typography>
                        <Typography variant="body2" sx={{
                            color: "#000000",
                            fontSize: '0.9rem'
                        }}>Una vez autenticado, accederás directamente a TeresAI sin necesidad de contraseña adicional.</Typography>
                    </Box>

                    {/* Nota de seguridad */}
                    <Box sx={{
                        p: 2,
                        backgroundColor: "#ffffff",
                        borderRadius: 3,
                        mt: 1,
                        textAlign: "center"
                    }}>
                        <Typography variant="caption" sx={{
                            color: "#000000",
                            fontSize: '0.85rem',
                            fontStyle: 'italic',
                        }}>🔒 Tu información está protegida. Google nunca compartirá tu contraseña con TeresAI.</Typography>
                    </Box>
                </Box>
            </Box>
        )
    }
]


const Login = () => {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [errorLogueo, setErrorLogueo] = useState(false);
    const [errorAlert, setErrorAlert] = useState(false);
    const [alertMessage, setAlertMessage] = useState("");
    const [expanded, setExpanded] = useState(false);
    const [phoneNumber, setPhoneNumber] = useState("");
    const [phoneCode, setPhoneCode] = useState("");
    const [phoneOtpSent, setPhoneOtpSent] = useState(false);
    const [phoneLoading, setPhoneLoading] = useState(false);
    const [phoneFeedback, setPhoneFeedback] = useState("");
    const [phoneFeedbackSeverity, setPhoneFeedbackSeverity] = useState("error");
    const [phoneFeedbackOpen, setPhoneFeedbackOpen] = useState(false);

    const handleChange = (panel) => (event, isExpanded) => {
        setExpanded(isExpanded ? panel : false);
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
        const normalizedPhone = normalizePhoneNumber(phoneNumber);

        if (!normalizedPhone) {
            showPhoneFeedback("Ingresá tu número de teléfono.", "error");
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
        showPhoneFeedback("Te enviamos un código por SMS.", "success");
        setPhoneLoading(false);
    };

    const handleVerifyPhoneOtp = async () => {
        const normalizedPhone = normalizePhoneNumber(phoneNumber);

        if (!phoneCode.trim()) {
            showPhoneFeedback("Ingresá el código que recibiste por SMS.", "error");
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

    return (
        <Box sx={{
            display: "flex",
            flexDirection: { xs: "column", sm: "row", md: "row" },
            justifyContent: { xs: "center", sm: "center", md: "center" },
            alignItems: { xs: "center", md: "center" },
            minHeight: "100dvh",
            width: "100%",
            minWidth: 0,
            background: `url(${fondoChatAI})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat",
            px: { xs: 2, sm: 0 },
            py: { xs: 2, md: 0 }
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
                        boxShadow: 3,
                        top: 0,
                        left: 0,
                        width: "100%",
                        zIndex: 1100,
                        height: "60px"
                    }}
                >
                    <Toolbar sx={{
                        display: 'flex',
                        height: "60px",
                        justifyContent: "space-between",
                        alignItems: "center"
                    }}>
                        <Box
                            component="img"
                            alt="Imagen de abuelos"
                            src={logoTeresAI}
                            sx={{
                                width: 35,
                                height: 50
                            }}>
                        </Box>
                        <Box>
                            <Button
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
                                Página oficial
                            </Button>
                        </Box>
                    </Toolbar>
                </AppBar>
                <Card
                    sx={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        maxHeight: { xs: "none", md: "100%" },
                        overflowY: { xs: "visible", md: "hidden" },
                        width: '100%',
                        maxWidth: "550px",
                        background: "#ffffff",
                        p: { xs: 2 },
                        borderRadius: 3,
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
                    }} >
                        Bienvenido de vuelta
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
                        fontSize: "1.3rem",
                        textAlign: "center",
                        fontSize: {
                            xs: "1.2rem",
                            sm: "1.2rem",
                            md: "1.3rem",
                            lg: "1.3rem",
                            xl: "1.3rem"
                        },
                    }}>Ingresa con Google
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
                            my: 2
                        }}
                    >Si no sabes como ingresar con Google, puedes leer el instructivo presionando el boton de abajo.
                    </Typography>
                    <Box sx={{
                        width: '100%', margin: 'auto', animation: "slideDown 0.4s ease",
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
                        {steps.map((step) => (
                            <Accordion
                                key={step.id}
                                expanded={expanded === step.id}
                                onChange={handleChange(step.id)}
                                sx={{
                                    mb: 1.5,
                                    borderRadius: '12px !important',
                                    '&:before': { display: 'none' },
                                    boxShadow: 4,
                                    overflow: 'hidden'
                                }}
                            >
                                <AccordionSummary
                                    expandIcon={<ExpandMoreIcon sx={{ color: '#7d745c' }} />}
                                    sx={{
                                        bgcolor: "#d7d6d6",
                                        '&:hover': { backgroundColor: '#c1c1c1' },
                                        color: '#000000',
                                        '& .MuiAccordionSummary-content': {
                                            justifyContent: 'center',
                                            margin: '12px 0 !important'
                                        }
                                    }}
                                >
                                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                        {step.icon}
                                        <Typography sx={{
                                            fontSize: {
                                                xs: "1rem",
                                                sm: "1.1rem",
                                                md: "1.1rem",
                                                lg: "1.2rem",
                                                xl: "1.2rem"
                                            },
                                            color: '#000000',
                                        }}>
                                            {step.label}
                                        </Typography>
                                    </Box>
                                </AccordionSummary>
                                <AccordionDetails sx={{ backgroundColor: '#eeeeee', borderTop: '1px solid #eee', p: 3 }}>
                                    {step.description}
                                </AccordionDetails>
                            </Accordion>
                        ))}
                    </Box>
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
                            Escribe tú número de teléfono e ingresa aquí el código que te enviaremos por SMS. Si no lo recibiste presiona en "Reenviar código".
                        </Typography>
                        {phoneFeedbackOpen ? (
                            <Alert
                                variant='filled'
                                severity={phoneFeedbackSeverity}
                                sx={{ mb: 1.5, borderRadius: 2 }}
                            >
                                {phoneFeedback}
                            </Alert>
                        ) : null}
                        <TextField
                            value={phoneNumber}
                            onChange={(e) => setPhoneNumber(e.target.value)}
                            placeholder="+549353244165"
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
                                        <ContactPhoneRoundedIcon fontSize="medium" sx={{ color: "#000000", mr: 1 }} />
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
                height: "100dvh",
                width: "60%",
                overflowY: "hidden",
                boxShadow: 7,
                mt: "60px"
            }}>
                <Box
                    component="img"
                    alt="Imagen de abuelos"
                    src={imagenLogin}
                    sx={{
                        height: "100%",
                        width: "100%",
                        objectFit: "cover"
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
    )
};

export default Login;
