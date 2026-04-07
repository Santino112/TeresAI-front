import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Typography, Button, TextField, Box, InputAdornment, Divider, IconButton, Alert, Card } from '@mui/material';
import { supabase } from '../../supabaseClient.js';
import fondoLogin from "../../assets/images/fondoLogin.png"
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
            alignItems: "center",
            minHeight: "100dvh",
            width: "100%",
            minWidth: 0,
            overflow: "hidden",
            background: `url(${fondoLogin})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat",
            px: { xs: 2, sm: 0 },
            py: { xs: 4, sm: 0 },
        }}>
            <Box sx={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
                minHeight: "560px",
                width: "100%",
                maxWidth: { xs: 440, sm: 440, md: 900, lg: 600 },
                overflowY: "hidden",
            }}>
                <Card
                    elevation={0}
                    sx={{
                        flex: 1,
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        justifyContent: "center",
                        p: { xs: 3 },
                        borderRadius: 0,
                        background: "transparent",
                        borderRadius: 3,
                    }}
                >
                    <Typography variant="h4" component="h1" sx={{
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
                        my: 1,
                        width: "100%",
                        "&::before, &::after": {
                            borderColor: "#ffffff",
                        }
                    }}>
                        <Typography variant="body1" sx={{ color: "#ffffff" }}>~</Typography>
                    </Divider>
                    <Typography variant='body1' sx={{
                        mb: 1,
                        fontFamily: "'Lora', serif",
                    }}>Ingresa o registrate con Google</Typography>
                    <GoogleLogin
                        onSuccess={async (credentialResponse) => {
                            const { data, error } = await supabase.auth.signInWithIdToken({
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
                            color: "#ffffff",
                            "&:after": {
                                borderColor: "#ffffff"
                            },
                            "&:before": {
                                borderColor: "#ffffff"
                            },
                        }}>
                            <Typography variant="body2">O</Typography>
                        </Divider>
                        {errorAlert ?
                            <Alert severity="error" sx={{ boxShadow: 1, borderRadius: 3, fontSize: "1rem", fontFamily: "'Lora', serif" }}>{alertMessage}</Alert>
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
                                backgroundColor: "#303030",
                                borderRadius: 3,
                                boxShadow: 3,
                                my: 1,
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
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <Box sx={{ display: "flex", alignItems: "center", justifyContent: "flex-start", color: "#ffffff" }}>
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
                                backgroundColor: "#303030",
                                borderRadius: 3,
                                boxShadow: 3,
                                my: 1,
                                mb: 2,
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
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <Box sx={{ display: "flex", alignItems: "center", justifyContent: "flex-start", color: "#ffffff" }}>
                                            <PasswordRoundedIcon fontSize="medium" sx={{ mr: 1 }}></PasswordRoundedIcon>
                                        </Box>
                                    </InputAdornment>
                                ),
                                endAdornment: (
                                    <InputAdornment position="end">
                                        <Box sx={{ display: "flex", alignItems: "center", justifyContent: "flex-end", color: "#ffffff" }}>
                                            <IconButton onClick={handleShowPassword}>
                                                {showPassword ? <VisibilityIcon /> : <VisibilityOffRoundedIcon />}
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
                                color: "#ffffff",
                                backgroundColor: "#918B76",
                                fontFamily: "'Lora', serif",
                                fontWeight: "bold",
                                "&:hover": {
                                    backgroundColor: "#7a7664",
                                }
                            }}>Ingresar
                        </Button>
                        <br />
                        <Typography variant='body1' sx={{
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
                                boxShadow: 2,
                                backgroundColor: "#7a7664",
                                fontFamily: "'Lora', serif",
                                fontWeight: "bold",
                                "&:hover": {
                                    backgroundColor: "#676456",
                                }
                            }}>Registrate
                        </Button>
                    </Box>
                </Card>
            </Box>
            <Box sx={{
                display: {
                    xs: "none",
                    sm: "none",
                    md: "block"
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