import { useEffect, useState, useRef } from "react";
import { enviarPrompt } from "../exports/enviarPrompt.js";
import { Typography, Button, TextField, Box, Stack } from "@mui/material";
import { playTTS } from "../exports/playTTS.js";
import { useWakeWord } from "../exports/useWakeWord.js";
import { getConversations } from "../exports/conversaciones.js";
import BotonAudio from "./botonAudio.jsx";
import SendRoundedIcon from "@mui/icons-material/SendRounded";
import VolumeUpRoundedIcon from "@mui/icons-material/VolumeUpRounded";
import VolumeOffRoundedIcon from "@mui/icons-material/VolumeOffRounded";

const Chat = () => {
  const [prompt, setPrompt] = useState("");
  const [promptVisible, setPromptVisible] = useState(null);
  const [respuesta, setRespuesta] = useState("");
  const [conversationId, setConversationId] = useState(null);
  const [ttsEnabled, setTtsEnabled] = useState(true);

  const audioRef = useRef(null);

  const { startWake, stopWake } = useWakeWord(() => {
    console.log("🟢 Wake phrase detectada");
    audioRef.current?.startRecording();
  });

  useEffect(() => {
    startWake();
    return () => stopWake();
  }, []);

  useEffect(() => {
    if (ttsEnabled && respuesta?.text) {
      playTTS(respuesta.text);
    }
  }, [respuesta, ttsEnabled]);

  const mandarPrompt = async (e) => {
    e.preventDefault();
    if (!prompt.trim()) return;

    const promptActual = prompt;
    setPrompt("");
    setPromptVisible(promptActual);

    await enviarPrompt(
      promptActual,
      conversationId,
      setRespuesta,
      setConversationId
    );
  };

  const recibirTextoDeAudio = async (texto) => {
    if (!texto?.trim()) return;

    setPromptVisible(texto);

    await enviarPrompt(
      texto,
      conversationId,
      setRespuesta,
      setConversationId
    );
  };

  const mensajes = [
    { from: "user", text: promptVisible },
    { from: "ia", text: respuesta?.text },
  ];

  const hayTexto = prompt.trim().length > 0;
  const botonActivo = hayTexto ? 'enviar' : 'audio'

  const botones = [
    { tipo: botonActivo }
  ];

  return (
    <Stack
      spacing={3}
      flexDirection="column"
      justifyContent="space-between"
      sx={{
        flexGrow: 1,
        minHeight: 0,
        minWidth: 0,
        maxWidth: '1000px',
        minWidth: {
          xs: '100%',
          sm: '100%',
          md: '600px',
          lg: '900px',
          xl: '1000px'
        },
        width: "100%",
        mx: "auto",
        p: 3,
      }}
    >

      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          gap: 2,
          flexGrow: 1,
          overflowY: "auto",
          p: 0,
        }}
      >
        {mensajes.map(
          (msg, index) =>
            msg.text && (
              <Box
                key={index}
                sx={{
                  display: "flex",
                  justifyContent:
                    msg.from === "user" ? "flex-end" : "flex-start",
                }}

              >
                <Box
                  sx={{
                    maxWidth: "70%",
                    p: 1,
                    borderRadius: 2,
                    color: "white",
                    backgroundColor:
                      msg.from === "user" ? "#1976d2" : "#292929",
                    whiteSpace: "pre-wrap",
                  }}
                >
                  <Typography>{msg.text}</Typography>
                </Box>
              </Box>
            )
        )}
      </Box>

      <Box component="form" onSubmit={mandarPrompt}>
        <Box sx={{
          display: "flex",
          gap: {
            xs: 1,
            sm: 0,
            md: 1,
            lg: 1,
            xl: 1
          },
        }}>
          <TextField
            label="Escribe tu mensaje"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            fullWidth
            multiline
            maxRows={2}
          />
          <Box sx={{
            display: 'flex',
            gap: {
              xs: 1,
              sm: 0,
              md: 1,
              lg: 1,
              xl: 1
            },
          }}>

            {botones.map(b => {
              if (b.tipo === 'audio') {
                return (
                  <BotonAudio
                    key='audio'
                    ref={audioRef}
                    onTranscription={recibirTextoDeAudio}
                    onStart={stopWake}
                    onStop={startWake}
                  />
                )
              };

              return (
                <Button key='enviar' type='submit' variant='contained' >
                  <SendRoundedIcon />
                </Button>
              );
            })}

            <Button
              variant={ttsEnabled ? "contained" : "outlined"}
              onClick={() => setTtsEnabled((v) => !v)}
            >
              {ttsEnabled ? <VolumeUpRoundedIcon /> : <VolumeOffRoundedIcon />}
            </Button>
          </Box>
        </Box>
      </Box>
    </Stack>
  );
};

export default Chat;