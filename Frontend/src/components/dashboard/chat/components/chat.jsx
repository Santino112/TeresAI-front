import { useEffect, useState } from "react";
import { enviarPrompt } from '../exports/enviarPrompt.js';
import { Typography, Button, TextField, Box, Stack } from "@mui/material";
import BotonAudio from "./botonAudio.jsx";
import { playTTS } from '../exports/playTTS.js';
import SendRoundedIcon from '@mui/icons-material/SendRounded';
import VolumeUpRoundedIcon from '@mui/icons-material/VolumeUpRounded';
import VolumeOffRoundedIcon from '@mui/icons-material/VolumeOffRounded';

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

    const mensajes = [
        { from: 'user', text: promptVisible },
        { from: 'ia', text: respuesta?.text }
    ]

    return (
        <Stack spacing={3} flexDirection="column" justifyContent='space-between' sx={{
            flexGrow: 1,
            minHeight: 0,
            minWidth: 0,
            width: '100%',
            minWidth: {
                xs: '100%',
                sm: '100%',
                md: '600px',
                lg: '900px',
                xl: '1000px'
            },
            maxWidth: '1000px',
            mx: 'auto',
            p: 3,
        }}>
            <Box sx={{
                display: 'flex',
                flexDirection: 'column',
                gap: 2,
                flexGrow: 1,
                minHeight: 0,
                overflowY: 'auto',
                padding: 2,
                borderRadius: 2,
                width: '100%',
            }}>
                {mensajes.map((msg, index) => (
                    <Box key={index} sx={{
                        display: 'flex',
                        justifyContent: msg.from === 'user' ? 'flex-end' : 'flex-start',
                        width: '100%',
                    }}>
                        <Box sx={{
                            maxWidth: msg.from === 'user' ? '70%': {xs: '100%', sm: '100%', md: '70%', lg: '70%', xl: '70%'} ,
                            p: 2,
                            borderRadius: 2,
                            color: 'white',
                            backgroundColor: msg.from === 'user' ? '#1976d2' : '#292929ff' ,
                            overflowWrap: 'break-word',
                            whiteSpace: 'pre-wrap'
                        }}>
                            <Typography variant="body1" sx={{
                                fontSize: {
                                    xs: '1.1rem',
                                    sm: '1.1rem',
                                    md: '1.1rem',
                                    ls: '1.2rem',
                                    xl: '1.2rem'
                                }
                            }}>
                                {msg.text}
                            </Typography>
                        </Box>
                    </Box>
                ))}
            </Box>
            <Box component='form' onSubmit={mandarPrompt}>
                <Box sx={{
                    display: "flex",
                    flexDirection: 'row',
                    justifyContent: 'center',
                    alignItems: 'stretch',
                    width: '100%',
                    height: 'fit-content',
                    backgroundColor: '#1f1f1fff',
                }}>
                    <TextField
                        label="Escribe tu mensaje"
                        variant="outlined"
                        value={prompt}
                        onChange={(e) => setPrompt(e.target.value)}
                        fullWidth
                        multiline
                        minRows={1}
                        maxRows={4}
                        InputLabelProps={{ required: false }}
                        sx={{
                            textarea: { color: "white" },
                            label: { color: "white" },
                            "& label.Mui-focused": { color: "white" },
                            "& .MuiOutlinedInput-root": {
                                "& fieldset": {
                                    borderColor: "",
                                },
                                "&.Mui-focused fieldset": {
                                    borderColor: "white",
                                },
                            },
                        }}
                    />
                    <BotonAudio onTranscription={recibirTextoDeAudio} />
                    <Button variant="contained" color="primary" type="submit">
                        <SendRoundedIcon fontSize="medium" />
                    </Button>
                    <Button
                        variant={ttsEnabled ? "contained" : "outlined"}
                        color="secondary"
                        onClick={() => setTtsEnabled(prev => !prev)}
                    >
                        {ttsEnabled ? <VolumeUpRoundedIcon /> : <VolumeOffRoundedIcon />}
                    </Button>
                </Box>
            </Box>
        </Stack>
    );
};

export default Chat;