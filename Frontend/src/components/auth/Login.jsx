import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Typography, Button, TextField, Box, InputAdornment, Divider, IconButton, Alert, Card, AppBar, Toolbar } from '@mui/material';
import { supabase } from '../../supabaseClient.js';
import fondoChatAI from "../../assets/images/fondoChatAI.png"
import TeresaiLogo from '../../assets/images/file.svg';
import imagenLogin from "../../assets/images/imagenLogin.jpg"
import EmailRoundedIcon from '@mui/icons-material/EmailRounded';
import PasswordRoundedIcon from '@mui/icons-material/PasswordRounded';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffRoundedIcon from '@mui/icons-material/VisibilityOffRounded';
import { GoogleLogin } from '@react-oauth/google';

const Login = () => {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [errorLogueo, setErrorLogueo] = useState(false);
    const [errorAlert, setErrorAlert] = useState(false);
    const [alertMessage, setAlertMessage] = useState("");

    const traducirError = (mensaje) => {
        const errores = {
            "Invalid login credentials": "Email o contraseña incorrectos.",
            "missing email or phone": "Debe ingresar un email o contraseña.",
            "Email not confirmed": "El email no esta confirmado. Confirmelo.",
            "Too many request": "Demasiados intentos, espera unos minutos.",
            "User not found": "No existe una cuenta con ese email asociado.",
            "Network request failed": "Error de conexión, revisá tu internet",
        };
        return errores[mensaje] || "Ocurrió un herror, intentelo de nuevo.";
    };

    const handleShowPassword = () => {
        setShowPassword((prev) => !prev);
    };

    const handleRegister = () => {
        navigate('/register');
    }

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
            {errorAlert ?
                <Alert variant='filled' severity="error" sx={{ position: "absolute", top: 16, left: 126, boxShadow: 1, borderRadius: 3, fontSize: "1rem", fontFamily: "'Lora', serif" }}>{alertMessage}</Alert>
                :
                null
            }
            <Box sx={{
                position: "relative",
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
                minHeight: "100dvh",
                width: { xs: "100%", md: "40%" },
                maxWidth: { xs: 440, sm: 440, md: 700, lg: 800 },
                overflowY: "hidden",
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

                        />
                    </Toolbar>
                </AppBar>
                <Card
                    sx={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        height: "auto",
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
                        fontFamily: "'Lora', serif"
                    }} >
                        Bienvenido de vuelta
                    </Typography>
                    <Divider sx={{
                        my: 0,
                        width: "100%", // Aseguramos que se estire horizontalmente
                        "&::before, &::after": {
                            content: '""', // Reforzamos que existan los pseudo-elementos
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
                        fontFamily: "'Lora', serif",
                    }}>Ingresa o registrate con Google</Typography>
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
                    <Box component="form" onSubmit={loginUser}>
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
                                borderRadius: 3,
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
                                borderRadius: 3,
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
                    sm: "block",
                    md: "block",
                    lg: "block",
                    xl: "block"
                },
                position: "relative",
                height: "100dvh",
                width: "60%",
                overflowY: "hidden",
                boxShadow: 7
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
