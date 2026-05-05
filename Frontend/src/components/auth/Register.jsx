import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../supabaseClient.js';
import { Typography, Button, TextField, Box, InputAdornment, Divider, IconButton, Alert, Card, AppBar, Toolbar } from '@mui/material';
import TeresaiLogo from '../../assets/images/file.svg';
import fondoChatAI from "../../assets/images/fondoChatAI.png"
import imagenRegister from "../../assets/images/imagenRegister.jpg"
import PersonRoundedIcon from '@mui/icons-material/PersonRounded';
import PasswordRoundedIcon from '@mui/icons-material/PasswordRounded';
import EmailRoundedIcon from '@mui/icons-material/EmailRounded';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffRoundedIcon from '@mui/icons-material/VisibilityOffRounded';


const Register = () => {
    const navigate = useNavigate();
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [errorRegister, setErrorRegister] = useState(false);
    const [errorAlert, setErrorAlert] = useState(false);
    const [alertMessage, setAlertMessage] = useState("");

    const traducirError = (mensaje) => {
        if (mensaje.includes("Password should contain")) {
            return "La contraseña debe tener al menos una minúscula, una mayúscula y un número";
        };

        const errores = {
            "Anonymous sign-ins are disabled": "Faltan llenar datos para registrarse.",
            "User already registered": "Ya existe una cuenta con ese email.",
            "Password should be at least 6 characters": "La contraseña debe tener al menos 6 caracteres.",
            "Unable to validate email address: invalid format": "El formato del email no es válido.",
            "Email rate limit exceeded": "Demasiados intentos, esperá unos minutos.",
            "Signup is disabled": "El registro está deshabilitado temporalmente.",
            "Network request failed": "Error de conexión, revisá tu internet.",
        };
        return errores[mensaje] || "Ocurrió un error, intentelo de nuevo.";
    }

    const handleShowPassword = () => {
        setShowPassword((prev) => !prev);
    };

    const handleRegister = async (e) => {
        e.preventDefault();

        const { data: perfilExistente } = await supabase
            .from('profiles')
            .select('username')
            .eq('username', username)
            .single();

        if (perfilExistente) {
            setErrorAlert(true);
            setErrorRegister(true);
            setAlertMessage("Ese nombre de usuario ya está en uso");
            setTimeout(() => {
                setErrorAlert(false);
                setErrorRegister(false);
            }, 7000);
            setUsername("");
            setEmail("");
            setPassword("");
            return;
        }

        const { data, error } = await supabase.auth.signUp({
            email,
            password,
            options: {
                data: {
                    username,
                    display_name: username,
                },
            },
        });

        if (error) {
            setErrorAlert(true);
            setErrorRegister(true);
            setAlertMessage(traducirError(error.message));
            setTimeout(() => {
                setErrorAlert(false);
                setErrorRegister(false);
            }, 7000);
            setUsername("");
            setEmail("");
            setPassword("");
            return;
        }

        if (data.user && data.user.identities?.length === 0) {
            setErrorAlert(true);
            setErrorRegister(true);
            setAlertMessage("Ya existe una cuenta con ese email");
            setTimeout(() => {
                setErrorAlert(false);
                setErrorRegister(false);
            }, 7000);
            setUsername("");
            setEmail("");
            setPassword("");
            return;
        }

        setUsername("");
        setEmail("");
        setPassword("");
        navigate('/');
    };

    return (
        <Box sx={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "center",
            alignItems: "center",
            minHeight: "100dvh",
            width: "100%",
            minWidth: 0,
            overflow: "hidden",
            background: `url(${fondoChatAI})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat",
            px: { xs: 2, sm: 0 },
            py: 0
        }}>
            <Box sx={{
                position: "relative",
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
                minHeight: "100dvh",
                width: { xs: "100%", md: "40%" },
                maxWidth: { xs: 440, sm: 440, md: 700, lg: 800 },
                overflowY: "hidden"
            }}>
                <AppBar
                    elevation={0}
                    sx={{
                        background: "transparent",
                        position: "absolute",
                        top: 0,
                        left: 0,
                        width: "100%",
                        zIndex: 1100
                    }}
                >
                    <Toolbar sx={{
                        display: 'flex',
                        justifyContent: 'flex-start',
                    }}>
                        <Box
                            component="img"
                            alt="TERESAI Logo"
                            sx={{
                                position: "relative",
                                right: {
                                    xs: 63,
                                    sm: 63,
                                    md: 45,
                                    lg: 45,
                                    xl: 45
                                },
                                height: "110px",
                                width: "auto",
                                imageRendering: "auto",
                                cursor: "pointer",
                            }}
                            onClick={() => navigate('/')}
                        />
                    </Toolbar>
                </AppBar>
                <Card
                    sx={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        justifyContent: "center",
                        p: { xs: 3 },
                        background: "transparent",
                        borderRadius: 3,
                        boxShadow: 4,
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
                            xs: "1.7rem",
                            sm: "1.7rem",
                            md: "1.4rem",
                            lg: "1.5rem",
                            xl: "2rem"
                        },
                        fontFamily: "'Lora', serif",
                    }} >
                        Registrate
                    </Typography>
                    <Typography variant="body2" sx={{
                        color: "#000000",
                        my: 1,
                        fontSize: {
                            xs: "1.2rem",
                            sm: "1.2rem",
                            md: "1.2rem",
                            lg: "1.3rem",
                            xl: "1.3rem",
                        },
                        fontFamily: "'Lora', serif",
                    }} >
                        Forma parte de nosotros
                    </Typography>
                    <Box component="form" onSubmit={handleRegister}>
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
                        {errorAlert ?
                            <Alert severity="error" sx={{ my: 1, boxShadow: 1, borderRadius: 3, fontSize: "1rem", fontFamily: "'Lora', serif" }}>{alertMessage}</Alert>
                            :
                            null
                        }
                        <TextField
                            error={errorRegister}
                            placeholder="Nombre"
                            variant="outlined"
                            margin="dense"
                            fullWidth
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
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
                                            <PersonRoundedIcon fontSize='medium' sx={{ mr: 1 }}></PersonRoundedIcon>
                                        </Box>
                                    </InputAdornment>
                                )
                            }}
                        />
                        <br />
                        <TextField
                            error={errorRegister}
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
                                )
                            }}
                        />
                        <br />
                        <TextField
                            error={errorRegister}
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
                                mb: 1,
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
                                            <PasswordRoundedIcon fontSize='medium' sx={{ mr: 1 }}></PasswordRoundedIcon>
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
                        <Button variant="contained" type="submit" fullWidth sx={{
                            mb: 1,
                            mt: 2,
                            boxShadow: 3,
                            backgroundColor: "#7d745c",
                            color: "#ffffff",
                            fontSize: "1rem",
                            textTransform: "none",
                            "&:hover": {
                                backgroundColor: "#67604d"
                            },
                        }}>Registrarse
                        </Button>
                    </Box>
                </Card>
            </Box>
            <Box sx={{
                position: "relative",
                display: {
                    xs: "none",
                    sm: "none",
                    md: "block"
                },
                height: "100dvh",
                width: "60%",
                overflowY: "hidden",
                boxShadow: 7
            }}>
                <Box
                    component="img"
                    alt="Imagen de abuelos"
                    src={imagenRegister}
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
                            Porque cuidar a quienes amamos,
                        </Typography>
                        <Typography sx={{ fontSize: "3rem", fontWeight: "bold" }}>
                            es lo más importante.
                        </Typography>
                        <Box sx={{ mt: 2 }}> {/* espacio entre los dos bloques */}
                            <Typography sx={{ fontSize: "2rem", fontStyle: "italic", fontWeight: 300 }}>
                                Una compañera inteligente.
                            </Typography>
                            <Typography sx={{ fontSize: "3rem", fontWeight: "bold" }}>
                                Disponible en todo momento.
                            </Typography>
                        </Box>
                    </Box>
                </Box>
            </Box>
        </Box>
    )
};

export default Register;
