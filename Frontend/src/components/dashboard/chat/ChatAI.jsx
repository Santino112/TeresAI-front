import { useState } from "react";
import { useNavigate } from 'react-router-dom';
import { enviarPrompt } from './exports/enviarPrompt.js';
import { Typography, Button, TextField, Box } from "@mui/material";

const ChatAI = () => {
    const navigate = useNavigate();
    const [prompt, setPrompt] = useState("");
    const [respuesta, setRespuesta] = useState("");

    const handleLogin = () => {
        navigate('/');
    }
    
    const mandarPrompt = async (e) => {
        e.preventDefault();
        await enviarPrompt(prompt, setRespuesta, setPrompt);
    }

    return (
        <>
            <Typography variant="h4" component="h1" gutterBottom>
                Chat AI Page
            </Typography>
            <Button variant='outlined' onClick={handleLogin}>Ir a login</Button>
            <Box sx={{ marginTop: 2, marginBottom: 2, padding: 2, border: '1px solid gray', borderRadius: 1, minHeight: '100px' }}>
                {respuesta && (<Typography variant="body1">{respuesta.text}</Typography>)}     
            </Box>
            <Box component='form' onSubmit={mandarPrompt}>
                <TextField
                    label="Escribe tu mensaje"
                    variant="outlined"
                    vakue={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    fullWidth
                    margin="normal"
                    InputLabelProps={{ required: false }}
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
                    }}
                />
                <Button variant="contained" color="primary" type="submit">Enviar</Button>
            </Box>
        </>
    );
};

export default ChatAI;