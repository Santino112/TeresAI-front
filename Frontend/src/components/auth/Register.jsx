import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../supabaseClient.js';
import { Typography, Button, TextField, Box, InputAdornment, IconButton, Divider, Alert } from '@mui/material';
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
            alignItems: "center",
            minHeight: "100dvh",
            width: "100dvw",
            minWidth: 0,
            overflow: "hidden",
        }}>
            <Box sx={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
                minHeight: "100dvh",
                width: {
                    xs: "100%",
                    sm: "100%",
                    md: "55%",
                    lg: "40%",
                    xl: "40%"
                },
                backgroundColor: "#434a42",
                overflowY: "hidden"
            }}>
                <Box sx={{
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                    alignItems: "center",
                    maxWidth: {
                        xs: "300px",
                        sm: "370px",
                        md: "500px",
                        lg: "500px",
                        xl: "500px"
                    },
                    width: {
                        xs: "75%",
                        sm: "60%",
                        md: "60%",
                        lg: "50%",
                        xl: "50%"
                    },
                    backgroundColor: "#626C66",
                    p: 3,
                    borderRadius: 4,
                    boxShadow: 4
                }}>
                    <Typography variant="h4" component="h1" sx={{
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
                    <Typography variant="body1" sx={{
                        fontFamily: "'Lora', serif",
                        mb: 1
                    }} >
                        Forma parte de nosotros
                    </Typography>
                    <Box component="form" onSubmit={handleRegister}>
                        <Divider sx={{
                            my: 0,
                            color: "#ffffff",
                            "&:after": {
                                borderColor: "#ffffff"
                            },
                            "&:before": {
                                borderColor: "#ffffff"
                            }
                        }}>
                            <Typography variant="body1">~</Typography>
                        </Divider>
                        {errorAlert ?
                            <Alert variant="filled" severity="error" sx={{ boxShadow: 1, borderRadius: 3, fontSize: "1rem", fontFamily: "'Lora', serif" }}>{alertMessage}</Alert>
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
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <Box sx={{ display: "flex", alignItems: "center", justifyContent: "flex-start", color: "#ffffff" }}>
                                            <PersonRoundedIcon fontSize='medium' sx={{ mr: 1 }}></PersonRoundedIcon>
                                        </Box>
                                    </InputAdornment>
                                )
                            }}
                        >
                        </TextField>
                        <TextField
                            error={errorRegister}
                            placeholder="Correo electrónico"
                            variant="outlined"
                            margin="dense"
                            fullWidth
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
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
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <Box sx={{ display: "flex", alignItems: "center", justifyContent: "flex-start", color: "#ffffff" }}>
                                            <EmailRoundedIcon fontSize='medium' sx={{ mr: 1 }}></EmailRoundedIcon>
                                        </Box>
                                    </InputAdornment>
                                )
                            }}
                        >
                        </TextField>
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
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <Box sx={{ display: "flex", alignItems: "center", justifyContent: "flex-start", color: "#ffffff" }}>
                                            <PasswordRoundedIcon fontSize='medium' sx={{ mr: 1 }}></PasswordRoundedIcon>
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
                        >
                        </TextField>
                        <Button variant="contained" type="submit" fullWidth sx={{
                            mb: 1,
                            mt: 2,
                            boxShadow: 3,
                            color: "#ffffff",
                            fontWeight: "bold",
                            fontFamily: "Lora, serif",
                            backgroundColor: "#918B76",
                            "&:hover": {
                                backgroundColor: "#7a7664",
                            }
                        }}
                        >Registrarse</Button>
                    </Box>
                </Box>
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