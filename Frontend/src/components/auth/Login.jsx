import { useState, useEffect } from 'react'; 
import { useNavigate } from 'react-router-dom';
import { Typography, Button} from '@mui/material';

const Login = () => {
    const navigate = useNavigate();

    const handleChatAI = () => {
        navigate('/chatAI');
    } 

    return (
    <>
        <Typography variant="h4" component="h1" gutterBottom>
            Login Page
        </Typography>
        <Button variant='outlined' onClick={handleChatAI}>Ir a chat</Button>
    </>
    )
};

export default Login;