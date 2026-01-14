import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Typography, Button, TextField, Box, } from '@mui/material';
import { supabase } from '../../supabaseClient.js';

const Login = () => {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

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
            alert(error.message);
            return;
        };

        navigate('/chatAI');
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