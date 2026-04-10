import { useEffect, useState, useRef } from "react";
import { enviarPrompt } from "../../exports/enviarPrompt.js";
import { Typography, Button, TextField, Box, Stack } from "@mui/material";
import { playTTS } from "../../exports/playTTS.js";
import { useWakeWord } from "../../exports/useWakeWord.js";
import { getMessages } from "../../exports/conversaciones.js";
import { InputAdornment, IconButton } from "@mui/material";
import { useAuth } from "../../../../auth/AuthContext.jsx";
import { tomarDatosPerfiles } from '../../exports/datosInicialesUsuarios.js';
import ReactMarkDown from 'react-markdown';
import BotonAudio from "../buttons/botonAudio.jsx";
import ArrowUpwardRoundedIcon from '@mui/icons-material/ArrowUpwardRounded';
import VolumeUpRoundedIcon from "@mui/icons-material/VolumeUpRounded";
import VolumeOffRoundedIcon from "@mui/icons-material/VolumeOffRounded";

const Chat = ({ activeConversationId, setActiveConversationId, addConversation }) => {
  const [prompt, setPrompt] = useState("");
  const [mensajes, setMensajes] = useState([]);
  const [respuesta, setRespuesta] = useState("");
  const [ttsEnabled, setTtsEnabled] = useState(true);
  const [profile, setProfile] = useState(null);
  const esPantallaInicial = mensajes.length === 0;
  const { user } = useAuth();
  const scrollRef = useRef(null);
  const bottomRef = useRef(null);

  const time = new Date().getHours();
  const isMorning = time >= 6 && time < 12;
  const isAfternoon = time >= 12 && time < 18;
  const isEvening = time >= 18 && time < 24;

  const frasesSaludo = [
    "Buenos días",
    "Buenas tardes",
    "Buenas noches"
  ];

  if (isMorning) {
    frasesSaludo[0] = "Buenos días";
  } else if (isAfternoon) {
    frasesSaludo[0] = "Buenas tardes";
  } else if (isEvening) {
    frasesSaludo[0] = "Buenas noches";
  }

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

  useEffect(() => {
    if (!user) return;

    const fetchInfoUser = async () => {
      const data = await tomarDatosPerfiles(user.id);
      if (data) setProfile(data);
    }
    fetchInfoUser();
  }, [user]);

  const enviarTexto = async (texto) => {
    if (!texto.trim()) return;

    let location = null;

    try {
      location = await new Promise((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(
          (pos) => {
            const coords = {
              lat: pos.coords.latitude,
              lng: pos.coords.longitude
            };
            console.log("Ubicación obtenida:", coords);
            resolve(coords);
          },
          (err) => {
            console.warn("No se pudo obtener ubicación:", err.message);
            resolve(null);
          },
          {
            enableHighAccuracy: true,
            timeout: 10000,
            maximumAge: 300000
          }
        );
      });
    } catch (error) {
      console.warn("Error al obtener ubicación:", error);
      location = null;
    }

    setMensajes(prev => [
      ...prev,
      {
        id: crypto.randomUUID(),
        role: 'user',
        content: texto
      }
    ]);

    const res = await enviarPrompt(texto, activeConversationId, location);
    console.log("Enviando al backend - prompt:", texto, "location:", location);

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
    if (res.shoppingListUpdated) {
      window.dispatchEvent(new Event("shoppingListUpdated"));
    };

    if (!activeConversationId && res.conversationId) {
      setActiveConversationId(res.conversationId);
      if (res.conversation) {
        addConversation(res.conversation);
      }
    };
  };

  const mandarPrompt = async () => {
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
    if (!activeConversationId) {
      setMensajes([]);
      setFraseActual(frases[Math.floor(Math.random() * frases.length)]);
      return;
    };
  }, [activeConversationId]);

  useEffect(() => {
    if (bottomRef.current) {
      bottomRef.current.scrollIntoView({ behavior: "smooth" });
      return;
    }

    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [mensajes]);

  return (
    <Box
      ref={scrollRef}
      sx={{
        flexGrow: 1,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        width: "100%",
        overflowY: "auto",
        overflowX: "hidden",
        minHeight: 0,
      }}
    >
      {esPantallaInicial ? (
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            flexGrow: 1,
            maxWidth: "800px",
            width: "100%",
            p: 2
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
          }}>{frasesSaludo[0]}, {profile?.username} </Typography>
          <Box
            component="form"
            onSubmit={(e) => {
              e.preventDefault();
              mandarPrompt();
            }}
            sx={{ width: "100%", boxShadow: 4, borderRadius: 4 }}
          >
            <Box sx={{
              backgroundColor: "#353A36",
              borderRadius: 4,
              p: 1,
            }}>
              <TextField
                placeholder={fraseActual}
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                fullWidth
                multiline
                maxRows={6}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    borderRadius: 4,
                    backgroundColor: "transparent",
                  },
                  "& .MuiInputBase-input": {
                    color: "#ffffff",
                    fontWeight: 600,
                  },
                  "& fieldset": { border: "none" },
                }}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    mandarPrompt();
                  }
                }}
              />
              <Box sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                gap: 1,
                px: 1,
                pb: 0.5,
              }}>
                <Box>
                  <IconButton
                    onClick={() => setTtsEnabled((v) => !v)}
                    sx={{
                      backgroundColor: ttsEnabled ? "#ffffff" : "transparent",
                      color: ttsEnabled ? "#2E2E2E" : "#ffffff",
                      "&:hover": { backgroundColor: "#b3b3b3", color: "#2E2E2E" }
                    }}
                  >
                    {ttsEnabled ? <VolumeUpRoundedIcon fontSize="medium" /> : <VolumeOffRoundedIcon fontSize="small" />}
                  </IconButton>
                </Box>
                <Box>
                  <BotonAudio
                    ref={audioRef}
                    onTranscription={recibirTextoDeAudio}
                    onStart={stopWake}
                    onStop={startWake}
                    sx={{ display: hayTexto ? "none" : "inline-flex" }}
                  />
                  {hayTexto && (
                    <IconButton type='submit' sx={{
                      backgroundColor: "#FFFFFF",
                      color: "#2E2E2E",
                      "&:hover": { backgroundColor: "#dcdcdc", color: "#2E2E2E" }
                    }}>
                      <ArrowUpwardRoundedIcon fontSize="medium" />
                    </IconButton>
                  )}
                </Box>
              </Box>
            </Box>
          </Box>
        </Box>
      ) : (
        <>
          <Box
            sx={{
              flexGrow: 1,
              display: "flex",
              flexDirection: "column",
              maxWidth: "800px",
              width: "100%",
              gap: 3,
              p: 2
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
                    backgroundColor: msg.role === "user" ? "#353A36" : "",
                    boxShadow: msg.role === "user" ? 3 : 0,
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
                          borderColor: "transparent"
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
            <Box ref={bottomRef} sx={{ height: 0 }} />
          </Box>
          <Box
            component="form"
            onSubmit={(e) => {
              e.preventDefault();
              mandarPrompt();
            }}
            sx={{
              width: "100%",
              maxWidth: "800px",
              position: "sticky",
              bottom: 0,
              zIndex: 1,
              my: 1,
              mb: { xs: 0, sm: 0, md: 1, lg: 2, xl: 2 },
              borderRadius: {
                xs: "16px 16px 0 0",
                sm: "16px 16px 0 0",
                md: 4,
                lg: 4,
                xl: 4
              },
              boxShadow: 4
            }}
          >
            <Box sx={{
              backgroundColor: "#353A36",
              borderRadius: {
                xs: "16px 16px 0 0",
                sm: "16px 16px 0 0",
                md: 4,
                lg: 4,
                xl: 4
              },
              p: 1,
            }}>
              <TextField
                placeholder={fraseActual}
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                multiline
                fullWidth
                maxRows={6}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    borderRadius: 4,
                    backgroundColor: "transparent",
                  },
                  "& .MuiInputBase-input": {
                    color: "#ffffff",
                    fontWeight: 500,
                  },
                  "& fieldset": { border: "none" },
                }}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    mandarPrompt();
                  }
                }}
              />
              <Box sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                gap: 1,
                px: 1,
                pb: 0.5,
              }}>
                <Box>
                  <IconButton
                    onClick={() => setTtsEnabled((v) => !v)}
                    sx={{
                      backgroundColor: ttsEnabled ? "#ffffff" : "transparent",
                      color: ttsEnabled ? "#2E2E2E" : "#ffffff",
                      "&:hover": { backgroundColor: "#b3b3b3", color: "#2E2E2E" }
                    }}
                  >
                    {ttsEnabled ? <VolumeUpRoundedIcon fontSize="medium" /> : <VolumeOffRoundedIcon fontSize="medium" />}
                  </IconButton>
                </Box>
                <Box>
                  <BotonAudio
                    ref={audioRef}
                    onTranscription={recibirTextoDeAudio}
                    onStart={stopWake}
                    onStop={startWake}
                    sx={{ display: hayTexto ? "none" : "inline-flex" }}
                  />
                  {hayTexto && (
                    <IconButton type='submit' sx={{
                      backgroundColor: "#FFFFFF",
                      color: "#2E2E2E",
                      ml: 1,
                      "&:hover": { backgroundColor: "#dcdcdc", color: "#2E2E2E" }
                    }}>
                      <ArrowUpwardRoundedIcon fontSize="medium" />
                    </IconButton>
                  )}
                </Box>
              </Box>
            </Box>
          </Box>
        </>
      )}
    </Box>
  );
};

export default Chat;