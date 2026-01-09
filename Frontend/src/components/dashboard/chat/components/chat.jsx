import { useEffect, useState } from "react";
import { enviarPrompt } from '../exports/enviarPrompt.js';
import { Typography, Button, TextField, Box } from "@mui/material";
import BotonAudio from "./botonAudio.jsx";
import { playTTS } from '../exports/playTTS.js';

const Chat = () => {
    const [prompt, setPrompt] = useState("");
    const [promptVisible, setPromptVisible] = useState(null);
    const [respuesta, setRespuesta] = useState("");
    const [conversationId, setConversationId] = useState(null);
    const [ttsEnabled, setTtsEnabled] = useState(true);

    useEffect(() => {
        if (ttsEnabled && respuesta?.text) {
            playTTS(respuesta.text);
        }
    }, [respuesta, ttsEnabled]);

    const mandarPrompt = async (e) => {
        e.preventDefault();
        const promptActual = prompt;
        setPrompt("");
        setPromptVisible(promptActual);
        console.log("SUBMIT disparado");
        await enviarPrompt(
            promptActual,
            conversationId,
            setRespuesta,
            setConversationId
        );
        console.log("MANDAR PROMPT:", promptActual);
    };

    const recibirTextoDeAudio = async (texto) => {
        setPrompt("");
        setPromptVisible(texto);

        console.log("AUDIO TRANSCRIPTO:", texto);

        await enviarPrompt(
            texto,
            conversationId,
            setRespuesta,
            setConversationId
        );
    };

    return (
        <Box sx={{borderColor: '2px solid red', padding: 4, marginTop: 4, marginLeft: 4, marginRight: 4}}>
            <Typography variant="h4" component="h1" gutterBottom>
                Chat AI Page
            </Typography>
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
                <BotonAudio onTranscription={recibirTextoDeAudio} />
                <Button
                    variant={ttsEnabled ? "contained" : "outlined"}
                    color="secondary"
                    onClick={() => setTtsEnabled(prev => !prev)}
                    sx={{ mb: 2 }}
                >
                    {ttsEnabled ? "Audio activado" : "Audio desactivado"}
                </Button>
            </Box>
        </Box>
    );
};

export default Chat;