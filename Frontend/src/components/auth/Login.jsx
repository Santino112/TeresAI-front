import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Typography, Button, TextField, Box, } from '@mui/material';

const Login = () => {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleRegister = () => {
        navigate('/register');
    }

    const loginUser = async (e) => {
        e.preventDefault();

        const dataLogin = {
            email: email,
            password: password
        }

        try {
            const response = await axios.post('http://localhost:3000/auth/login', dataLogin);
            const res = response.data;
            alert(res.message);
            console.log(res.data);
            navigate('/chatAI');
        } catch (error) {
            console.error('Error durante el login');
            console.error(error);
            res.status(500).json({ error: error.message });
        }
    };


    return (
        <>
            <Typography variant="h4" component="h1" >
                Login Page
            </Typography>
            <br />
            <Box component="form" onSubmit={loginUser}>
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
                    }} />
                <br />
                <TextField
                    label="Password"
                    type="password"
                    variant="outlined"
                    margin="dense"
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
                    }} />
                <br />
                <Button variant="contained" type="submit" fullWidth sx={{ marginBottom: 2 }}>Login</Button>
                <br />
                <Button variant="outlined" onClick={handleRegister} fullWidth>Register</Button>
            </Box>
        </>
    )
};

export default Login;