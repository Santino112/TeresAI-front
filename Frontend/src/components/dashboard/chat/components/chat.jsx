import { useEffect, useState, useRef } from "react";
import { enviarPrompt } from "../exports/enviarPrompt.js";
import { Typography, Button, TextField, Box, Stack } from "@mui/material";
import BotonAudio from "./botonAudio.jsx";
import { playTTS } from "../exports/playTTS.js";
import { useWakeWord } from "../exports/useWakeWord.js";
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

  return (
    <Stack
      spacing={3}
      flexDirection="column"
      justifyContent="space-between"
      sx={{
        flexGrow: 1,
        minHeight: 0,
        width: "100%",
        maxWidth: "1000px",
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
          p: 2,
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
                    p: 2,
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
        <Box sx={{ display: "flex", gap: 1 }}>
          <TextField
            label="Escribe tu mensaje"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            fullWidth
            multiline
            maxRows={4}
          />

          <BotonAudio
            ref={audioRef}
            onTranscription={recibirTextoDeAudio}
            onStart={stopWake}   
            onStop={startWake}  
          />

          <Button type="submit" variant="contained">
            <SendRoundedIcon />
          </Button>

          <Button
            variant={ttsEnabled ? "contained" : "outlined"}
            onClick={() => setTtsEnabled((v) => !v)}
          >
            {ttsEnabled ? <VolumeUpRoundedIcon /> : <VolumeOffRoundedIcon />}
          </Button>
        </Box>
      </Box>
    </Stack>
  );
};

export default Chat;