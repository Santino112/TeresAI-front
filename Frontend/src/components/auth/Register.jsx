import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Typography, Button, TextField, Box } from "@mui/material";

const Register = () => {
    const navigate = useNavigate();
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleLogin = () => {
        navigate('/');
    }

    const handleRegister = async (e) => {
        e.preventDefault();
        const datosUsuario = {
            username,
            email,
            password
        };

        try {
            const response = await axios.post("http://localhost:3000/auth/register", datosUsuario);
            const res = response.data;
            alert(res.message);
        } catch (error) {
            console.error('Error durante el registro');
            console.error(error);
            res.status(500).json({ error: error.message });
        }
    };

    return (
        <>
            <Typography variant="h4" component="h1" gutterBottom>Register page</Typography>
            <Button variant='outlined' onClick={handleLogin}>Ir a login</Button>
            <Box component="form" onSubmit={handleRegister}>
                <TextField
                    label="Username"
                    variant="outlined"
                    margin="normal"
                    fullWidth
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    sx={{
                        input: { color: "white" },
                        label: { color: "white" },
                        "& label.Mui-focused": { color: "white" },
                        "& .MuiOutlinedInput-root": {
                            "& fieldset": {
                                borderColor: "gray",
                            },
                            "&.Mui-focused fieldset": {
                                borderColor: "white",
                            },
                        },
                    }}>
                </TextField>
                <br />
                <TextField
                    label="Email"
                    variant="outlined"
                    margin="normal"
                    fullWidth
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    sx={{
                        input: { color: "white" },
                        label: { color: "white" },
                        "& label.Mui-focused": { color: "white" },
                        "& .MuiOutlinedInput-root": {
                            "& fieldset": {
                                borderColor: "gray",
                            },
                            "&.Mui-focused fieldset": {
                                borderColor: "white",
                            },
                        },
                    }}>
                </TextField>
                <br />
                <TextField
                    label="Password"
                    type="password"
                    variant="outlined"
                    margin="normal"
                    fullWidth
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    sx={{
                        marginBottom: 2,
                        input: { color: "white" },
                        label: { color: "white" },
                        "& label.Mui-focused": { color: "white" },
                        "& .MuiOutlinedInput-root": {
                            "& fieldset": {
                                borderColor: "gray",
                            },
                            "&.Mui-focused fieldset": {
                                borderColor: "white",
                            },
                        },
                    }}>
                </TextField>
                <br />
                <Button variant="contained" type="submit" fullWidth>Register</Button>
            </Box>
        </>
    )
};

export default Register;