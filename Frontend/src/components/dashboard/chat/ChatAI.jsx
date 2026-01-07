import { supabase } from "../../../supabaseClient.js"
import { useState } from "react";
import { useNavigate } from 'react-router-dom';
import { enviarPrompt } from './exports/enviarPrompt.js';
import { Typography, Button, TextField, Box } from "@mui/material";

const ChatAI = () => {
    const navigate = useNavigate();
    const [prompt, setPrompt] = useState("");
    const [promptVisible, setPromptVisible] = useState(null);
    const [respuesta, setRespuesta] = useState("");
    const [conversationId, setConversationId] = useState(null);

    const handleLogOut = async () => {
        await supabase.auth.signOut();
        const { data } = await supabase.auth.getSession()
        console.log(data.session)
        navigate('/');
    }

    const mandarPrompt = async (e) => {
        e.preventDefault();
        const promptActual = prompt;
        setPrompt("");
        setTimeout(() => {
            setPromptVisible(prompt);
        }, 200);
        await enviarPrompt(promptActual, conversationId, setRespuesta, setConversationId);
    }

    return (
        <>
            <Typography variant="h4" component="h1" gutterBottom>
                Chat AI Page
            </Typography>
            <Button variant='outlined' onClick={handleLogin}>Ir a login</Button>
            <Box sx={{ marginTop: 2, marginBottom: 1, padding: 2, border: '1px solid gray', borderRadius: 1, minHeight: '100px' }}>
                {promptVisible && (
                    <Typography variant="body1">{promptVisible}</Typography>
                )}
                {respuesta && (
                    <Typography variant="body1">{respuesta.text}</Typography>
                )}
            </Box>
            <Box component='form' onSubmit={mandarPrompt}>
                <TextField
                    label="Escribe tu mensaje"
                    variant="outlined"
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    fullWidth
                    margin="normal"
                    multiline
                    minRows={1}
                    maxRows={4}
                    InputLabelProps={{ required: false }}
                    sx={{
                        marginBottom: 2,
                        textarea: { color: "white" },
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
                <Button variant="contained" color="primary" type="submit" fullWidth sx={{ marginBottom: 2 }}>Enviar</Button>
                <Button variant="outlined" onClick={handleLogOut} fullWidth>LogOut</Button>
            </Box>
        </>
    );
};

export default ChatAI;