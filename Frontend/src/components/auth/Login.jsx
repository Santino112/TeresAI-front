import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Typography, Button, TextField, Box, } from '@mui/material';

const Login = () => {
    const navigate = useNavigate();

    const handleRegister = () => {
        navigate('/register');
    }
 
    const handleChatAI = () => {
        navigate('/chatAI');
    }

    return (
        <>
            <Typography variant="h4" component="h1" gutterBottom>
                Login Page
            </Typography>
            <Button variant='outlined' onClick={handleChatAI}>Ir a chat</Button>
            <br />
            <Box component="form">
                <TextField label="Username" variant="outlined" margin="normal" sx={{
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
                <TextField label="Password" type="password" variant="outlined" margin="dense" sx={{
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
                <Button variant="contained" fullWidth sx={{marginBottom: 2}}>Login</Button>
                <br />
                <Button variant="outlined" onClick={handleRegister} fullWidth>Register</Button>
            </Box>
        </>
    )
};

export default Login;