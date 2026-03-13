import { useEffect, useState, useRef } from "react";
import { enviarPrompt } from "../exports/enviarPrompt.js";
import { Typography, Button, TextField, Box, Stack } from "@mui/material";
import { playTTS } from "../exports/playTTS.js";
import { useWakeWord } from "../exports/useWakeWord.js";
import { getMessages } from "../exports/conversaciones.js";
import { InputAdornment, IconButton } from "@mui/material";
import ReactMarkDown from 'react-markdown';
import BotonAudio from "./botonAudio.jsx";
import SendRoundedIcon from "@mui/icons-material/SendRounded";
import VolumeUpRoundedIcon from "@mui/icons-material/VolumeUpRounded";
import VolumeOffRoundedIcon from "@mui/icons-material/VolumeOffRounded";

const Chat = ({ activeConversationId, setActiveConversationId, addConversation }) => {
  const [prompt, setPrompt] = useState("");
  const [mensajes, setMensajes] = useState([]);
  const [respuesta, setRespuesta] = useState("");
  const [ttsEnabled, setTtsEnabled] = useState(true);
  const esPantallaInicial = mensajes.length === 0;
  const bottomRef = useRef(null);

  const frases = [
    "¿Qué haremos hoy?",
    "¿En qué te puedo ayudar?",
    "¡Hola! ¿Cómo estás hoy?",
    "¿Querés charlar un rato?",
    "¿Necesitás algo?",
  ];
  const [fraseActual, setFraseActual] = useState(frases[0]);

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
    if (!activeConversationId) {
      setMensajes([]);
      return;
    };

    const fetchMessages = async () => {
      const data = await getMessages(activeConversationId);
      setMensajes(data);
    }
    fetchMessages();
  }, [activeConversationId]);

  useEffect(() => {
    if (ttsEnabled && respuesta?.text) {
      playTTS(respuesta.text);
    }
  }, [respuesta, ttsEnabled]);

  const enviarTexto = async (texto) => {
    if (!texto.trim()) return;

    setMensajes(prev => [
      ...prev,
      {
        id: crypto.randomUUID(),
        role: 'user',
        content: texto
      }
    ]);

    const res = await enviarPrompt(texto, activeConversationId);

    setMensajes(prev => [
      ...prev,
      {
        id: crypto.randomUUID(),
        role: "assistant",
        content: res.text
      }
    ]);

    setRespuesta(res);
    
    if (res.calendarEventCreated) {
      window.dispatchEvent(new Event("calendarUpdated"));
    };

    if (!activeConversationId && res.conversationId) {
      setActiveConversationId(res.conversationId);
      if (res.conversation) {
        addConversation(res.conversation);
      }
    };
  };

  const mandarPrompt = async (e) => {
    e.preventDefault();
    const texto = prompt;
    setPrompt("");
    await enviarTexto(texto);
  };

  const recibirTextoDeAudio = async (texto) => {
    await enviarTexto(texto);
  };

  const hayTexto = prompt.trim().length > 0;
  const botonActivo = hayTexto ? 'enviar' : 'audio'

  const botones = [
    { tipo: botonActivo }
  ];

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [mensajes]);

  useEffect(() => {
    if (!activeConversationId) {
      setMensajes([]);
      setFraseActual(frases[Math.floor(Math.random() * frases.length)]);
      return;
    };
  }, [activeConversationId]);

  return (
    <Box
      sx={{
        flexGrow: 1,
        display: "flex",
        flexDirection: "column",
        minHeight: 0,
      }}
    >
      {esPantallaInicial ? (
        <Box
          sx={{
            flexGrow: 1,
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            maxWidth: '1000px',
            minWidth: {
              xs: '390px',
              sm: '500px',
              md: '700px',
              lg: '900px',
              xl: '1000px'
            },
            width: "100%",
          }}
        >
          <Typography variant="h1" sx={{
            fontSize: {
              xs: "1.7rem",
              sm: "2rem",
              md: "2rem",
              lg: "2.5rem",
              xl: "2.5rem"
            },
            fontFamily: "monospace",
            mb: 2
          }}>{fraseActual}</Typography>
          <Box
            component="form"
            onSubmit={mandarPrompt}
            sx={{ width: "100%", maxWidth: "800px" }}
          >
            <Box fullWidth sx={{
              display: "flex",
              gap: {
                xs: 1,
                sm: 1,
                md: 1,
                lg: 1,
                xl: 1
              },
            }}>
              <TextField
                placeholder="Escribe tu mensaje"
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                fullWidth
                multiline
                maxRows={4}
                sx={{
                  backgroundColor: "#35353a",
                  borderRadius: 4,
                  boxShadow: 5,
                  "& .MuiOutlinedInput-root": {
                    borderRadius: 4,
                    pr: 1,
                  },
                  "& fieldset": {
                    border: "none"
                  },
                  "&:hover fieldset": {
                    border: "none"
                  },
                  "&.Mui-focused fieldset": {
                    border: "none"
                  }
                }}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    mandarPrompt();
                  }
                }}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>

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
                            <IconButton key='enviar' type='submit' variant='contained' sx={{
                              backgroundColor: "transparent",
                              color: "#ffffff",
                              "&:hover": {
                                backgroundColor: "#FFFFFF",
                                color: "#2E2E2E",
                              }
                            }}>
                              <SendRoundedIcon fontSize="small" />
                            </IconButton>
                          );
                        })}
                        <IconButton
                          variant={ttsEnabled ? "contained" : "outlined"}
                          onClick={() => setTtsEnabled((v) => !v)}
                          sx={{
                            backgroundColor: ttsEnabled ? "#ffffff" : "transparent",
                            color: ttsEnabled ? "#2E2E2E" : "#ffffff",
                            "&:hover": {
                              backgroundColor: "#b3b3b3",
                              color: "#2E2E2E"
                            }
                          }}
                        >
                          {ttsEnabled ? <VolumeUpRoundedIcon fontSize="small" /> : <VolumeOffRoundedIcon fontSize="small" />}
                        </IconButton>
                      </Box>
                    </InputAdornment>
                  )
                }}
              />
            </Box>
          </Box>
        </Box>
      ) : (
        <>
          <Box
            sx={{
              flexGrow: 1,
              overflowY: "auto",
              display: "flex",
              flexDirection: "column",
              maxWidth: '1000px',
              minWidth: {
                xs: '390px',
                sm: '500px',
                md: '700px',
                lg: '900px',
                xl: '1000px'
              },
              width: "100%",
              gap: 5,
              p: 3,
            }}
          >
            {mensajes.map((msg) => (
              <Box
                key={msg.id}
                sx={{
                  display: "flex",
                  justifyContent:
                    msg.role === "user" ? "flex-end" : "flex-start",
                }}
              >
                <Box
                  sx={{
                    position: "relative",
                    maxWidth: msg.role === "user" ? "70%" : "100%",
                    p: 2,
                    borderRadius: "15px",
                    fontFamily: "Arial, sans-serif",
                    color: "white",
                    backgroundColor: msg.role === "user" ? "#353A36" : "#262a25",
                    boxShadow: msg.role === "user" ? 4 : 1,
                    "&:after": {
                      content: '""',
                      position: "absolute",
                      top: "10px",
                      ...(msg.role === "user"
                        ? {
                          top: "6px",
                          right: "-7px",
                          left: "auto",
                          borderWidth: "10px 0 10px 10px",
                          borderColor: "transparent transparent transparent #353A36"
                        }
                        : {
                          top: "6px",
                          left: "-7px",
                          right: "auto",
                          borderWidth: "10px 10px 10px 0",
                          borderColor: "transparent #262a25 transparent transparent"
                        }),
                      borderStyle: "solid"
                    }
                  }}
                >
                  <ReactMarkDown
                    components={msg.role === "user" ? {
                      p: ({ children }) => (
                        <Typography sx={{
                          fontSize: "1.05rem",
                          lineHeight: 1.8,
                          color: "#E6E6E6",
                          m: 0,
                          textAlign: "left"
                        }}>
                          {children}
                        </Typography>
                      ),
                    } : {
                      p: ({ children }) => (
                        <Typography sx={{
                          fontSize: "1.05rem",
                          lineHeight: 1.8,
                          mb: 1,
                          color: "#E6E6E6",
                          textAlign: "left"
                        }}>
                          {children}
                        </Typography>
                      ),
                      li: ({ children }) => (
                        <li style={{
                          fontSize: "1.05rem",
                          lineHeight: 1.8,
                          color: "#E6E6E6",
                          textAlign: "left"
                        }}>
                          {children}
                        </li>
                      ),
                    }}
                  >
                    {msg.content}
                  </ReactMarkDown>
                </Box>
              </Box>
            ))}
            <div ref={bottomRef} />
          </Box>
          <Box component="form" onSubmit={mandarPrompt}>
            <Box sx={{
              display: "flex",
              gap: 1,
              p: 3
            }}>
              <TextField
                placeholder="Escribe tu mensaje"
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                fullWidth
                multiline
                maxRows={4}
                sx={{
                  backgroundColor: "#353A36",
                  borderRadius: 4,
                  boxShadow: 5,
                  "& .MuiOutlinedInput-root": {
                    borderRadius: 4,
                    pr: 1,
                  },
                  "& fieldset": {
                    border: "none"
                  },
                  "&:hover fieldset": {
                    border: "none"
                  },
                  "&.Mui-focused fieldset": {
                    border: "none"
                  }
                }}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>

                        {botones.map(b => {
                          if (b.tipo === 'audio') {
                            return (
                              <>
                                <BotonAudio
                                  ref={audioRef}
                                  onTranscription={recibirTextoDeAudio}
                                  onStart={stopWake}
                                  onStop={startWake}
                                  sx={{ display: hayTexto ? "none" : "inline-flex" }}
                                />
                                {hayTexto && (
                                  <IconButton type='submit' sx={{
                                    backgroundColor: "transparent",
                                    color: "#ffffff",
                                    "&:hover": { backgroundColor: "#FFFFFF", color: "#2E2E2E" }
                                  }}>
                                    <SendRoundedIcon fontSize="small" />
                                  </IconButton>
                                )}
                              </>
                            )
                          };
                          return (
                            <IconButton key='enviar' type='submit' variant='contained' sx={{
                              backgroundColor: "transparent",
                              color: "#ffffff",
                              "&:hover": {
                                backgroundColor: "#FFFFFF",
                                color: "#2E2E2E",
                              }
                            }}>
                              <SendRoundedIcon fontSize="small" />
                            </IconButton>
                          );
                        })}
                        <IconButton
                          variant={ttsEnabled ? "contained" : "outlined"}
                          onClick={() => setTtsEnabled((v) => !v)}
                          sx={{
                            backgroundColor: ttsEnabled ? "#ffffff" : "transparent",
                            color: ttsEnabled ? "#2E2E2E" : "#ffffff",
                            "&:hover": {
                              backgroundColor: "#b3b3b3",
                              color: "#2E2E2E",
                            }
                          }}
                        >
                          {ttsEnabled ? <VolumeUpRoundedIcon fontSize="small" /> : <VolumeOffRoundedIcon fontSize="small" />}
                        </IconButton>
                      </Box>
                    </InputAdornment>
                  )
                }}
              />
            </Box>
          </Box>
        </>
      )}
    </Box>
  );
};

export default Chat;

