import { useEffect, useState, useRef } from "react";
import { enviarPrompt } from "../../exports/enviarPrompt.js";
import { Typography, TextField, Box, CircularProgress } from "@mui/material";
import { playTTS, stopTTS } from "../../exports/playTTS.js";
import { useWakeWord } from "../../exports/useWakeWord.js";
import { getMessages } from "../../exports/conversaciones.js";
import { InputAdornment, IconButton } from "@mui/material";
import { useAuth } from "../../../../auth/useAuth.jsx";
import { tomarDatosPerfiles } from '../../exports/datosInicialesUsuarios.js';
import fondoChatAI from "../../../../../assets/images/fondoChatAI.png";
import axios from "axios";
import ReactMarkDown from 'react-markdown';
import BotonAudio from "../buttons/BotonAudio.jsx";
import ArrowUpwardRoundedIcon from '@mui/icons-material/ArrowUpwardRounded';
import VolumeUpRoundedIcon from "@mui/icons-material/VolumeUpRounded";
import VolumeOffRoundedIcon from "@mui/icons-material/VolumeOffRounded";

const GEO_TIMEOUT_ERROR_CODE = 3;

const getCurrentLocation = async () => {
  if (!("geolocation" in navigator)) {
    console.info("Geolocation no disponible en este navegador.");
    return null;
  }

  const getPosition = (options) =>
    new Promise((resolve, reject) => {
      navigator.geolocation.getCurrentPosition(resolve, reject, options);
    });

  try {
    const quickPosition = await getPosition({
      enableHighAccuracy: false,
      timeout: 6000,
      maximumAge: 600000
    });

    return {
      lat: quickPosition.coords.latitude,
      lng: quickPosition.coords.longitude
    };
  } catch (firstError) {
    if (firstError?.code !== GEO_TIMEOUT_ERROR_CODE) {
      console.warn("No se pudo obtener ubicacion:", firstError?.message);
      return null;
    }
  }

  try {
    const retryPosition = await getPosition({
      enableHighAccuracy: true,
      timeout: 12000,
      maximumAge: 0
    });

    return {
      lat: retryPosition.coords.latitude,
      lng: retryPosition.coords.longitude
    };
  } catch (retryError) {
    console.warn("No se pudo obtener ubicacion tras reintento:", retryError?.message);
    return null;
  }
};
const Chat = ({ activeConversationId, setActiveConversationId, addConversation }) => {
  const [prompt, setPrompt] = useState("");
  const [mensajes, setMensajes] = useState([]);
  const [respuesta, setRespuesta] = useState("");
  const [ttsEnabled, setTtsEnabled] = useState(false);
  const [profile, setProfile] = useState(null);
  const [pensandoIA, setPensandoIA] = useState(null);
  const [loadingMessages, setLoadingMessages] = useState(false);
  const esPantallaInicial = mensajes.length === 0 && !loadingMessages && !activeConversationId;
  const { user } = useAuth();
  const activeConversationIdRef = useRef(activeConversationId);
  const scrollRef = useRef(null);
  const abortRef = useRef(null);

  let saludo = "";
  const time = new Date().getHours();
  {
    time >= 6 && time < 12 ? saludo = "Buenos días"
      : time >= 12 && time <= 19 ? saludo = "Buenas tardes"
        : saludo = "Buenas noches"
  };

  const frases = [
    "¿Qué haremos hoy?",
    "¿En qué te puedo ayudar?",
    "¡Hola! ¿Cómo estás hoy?",
    "¿Querés charlar un rato?",
    "¿Necesitás algo?",
  ];
  const [fraseActual, setFraseActual] = useState(frases[0]);

  const frasesParaIA = [
    "Pensando...",
    "Analizando...",
    "Generando ideas...",
    "Teresa lo está viendo..."
  ];
  const [fraseParaChat, setFraseParaChat] = useState(frasesParaIA[0]);

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
    if (!scrollRef.current) return;

    setTimeout(() => {
      scrollRef.current?.scrollTo({
        top: scrollRef.current.scrollHeight,
        behavior: "smooth"
      });
    }, 50);
  }, [mensajes, pensandoIA]);

  useEffect(() => {
    activeConversationIdRef.current = activeConversationId;
  }, [activeConversationId]);

  useEffect(() => {
    let intervalo;

    if (pensandoIA === activeConversationId) {
      intervalo = setInterval(() => {
        setFraseParaChat((prevFrase) => {
          const indiceActual = frasesParaIA.indexOf(prevFrase);
          const siguienteIndice = (indiceActual + 1) % frasesParaIA.length;
          return frasesParaIA[siguienteIndice];
        });
      }, 3000);
    } else {
      setFraseParaChat(frasesParaIA[0]);
    }

    return () => clearInterval(intervalo);
  }, [pensandoIA, activeConversationId]);

  useEffect(() => {

    if (!activeConversationId) {
      setMensajes([]);
      return;
    };

    const fetchMessages = async () => {
      setLoadingMessages(true);
      const data = await getMessages(activeConversationId);
      setMensajes(data);
      setLoadingMessages(false);
    }
    fetchMessages();
  }, [activeConversationId]);

  useEffect(() => {
    if (respuesta?.text && ttsEnabled) {
      playTTS(respuesta.text);
    }
  }, [respuesta]);

  useEffect(() => {
    if (!user?.id) return;

    const fetchInfoUser = async () => {
      try {
        if (profile) return;

        const data = await tomarDatosPerfiles(user.id);

        if (data) {
          setProfile(data);
        } else {
          console.warn("No se encontraron datos de perfil para este usuario.");
        }
      } catch (error) {
        console.error("Error al obtener perfil del usuario:", error);
      }
    };

    fetchInfoUser();
  }, [user?.id]);

  const enviarTexto = async (texto) => {
    if (!texto.trim()) return;
    let location = null;

    const conversationIdAlEnviar = activeConversationId;
    setPensandoIA(conversationIdAlEnviar);

    if (abortRef.current) abortRef.current.abort();
    abortRef.current = new AbortController();

    setMensajes(prev => [...prev, { id: crypto.randomUUID(), role: 'user', content: texto }]);
    setPensandoIA(conversationIdAlEnviar);

    try {
      location = await getCurrentLocation();
      if (location) {
        console.log("Ubicacion obtenida:", location);
      }
      const res = await enviarPrompt(texto, conversationIdAlEnviar, location, abortRef.current.signal);

      if (activeConversationIdRef.current === conversationIdAlEnviar) {
        setPensandoIA(null);
        setMensajes(prev => [...prev, { id: crypto.randomUUID(), role: "assistant", content: res.text }]);
        setRespuesta(res);
      }

      if (res.conversation) {
        addConversation(res.conversation);
        if (!conversationIdAlEnviar) {
          setActiveConversationId(res.conversation.id);
        }
      }
    } catch (error) {
      if (error.name === "AbortError" || error.name === "CanceledError" || axios.isCancel(error)) return;
      console.error("ERROR FATAL EN enviarTexto:", error);
      setPensandoIA(false);
    }
  };

  const mandarPrompt = async (e) => {
    if (e) e.preventDefault();
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

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        width: "100%",
        height: "100%",
        overflow: "hidden",
        background: `url(${fondoChatAI})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      {loadingMessages ? (
        <Box sx={{ p: 5, display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", gap: 2, flexGrow: 1 }}>
          <Typography variant="h2" sx={{ fontSize: "1rem", fontFamily: "'Lora', serif", color: "#000000" }}>Cargando mensajes...</Typography>
          <CircularProgress sx={{ color: "#000000" }} />
        </Box>
      ) : esPantallaInicial ? (
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
              xs: "1.5rem",
              sm: "2rem",
              md: "2rem",
              lg: "2.5rem",
              xl: "2.8rem"
            },
            fontFamily: "'Lora', serif",
            color: "#000000",
            mb: 2,

            textAlign: "center"
          }}>
            {saludo}, {profile?.username}
          </Typography>
          <Box
            component="form"
            onSubmit={(e) => {
              e.preventDefault();
              mandarPrompt();
            }}
            sx={{
              width: "100%",
              boxShadow: 4,
              borderRadius: 4,
              flexShrink: 0,
              p: 0,
              animation: "slideDown 0.4s ease",
              "@keyframes slideDown": {
                from: {
                  opacity: 0,
                  transform: "translateY(-40px)"
                },
                to: {
                  opacity: 1,
                  transform: "translateY(0)"
                }
              }
            }}
          >
            <Box sx={{
              backgroundColor: "#d7d6d6",
              borderRadius: 4,
              p: 1,
            }}>
              <TextField
                placeholder={fraseActual}
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                fullWidth
                multiline
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    mandarPrompt();
                  }
                }}
                maxRows={6}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    borderRadius: 4,
                    backgroundColor: "transparent",
                  },
                  "& .MuiInputBase-input": {
                    color: "#000000",
                    fontWeight: 500,
                  },
                  "& fieldset": { border: "none" },
                }}
              />
              <Box sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                gap: 1,
                px: 1,
                pb: 0.8,
              }}>
                <Box>
                  <IconButton
                    onClick={() => {
                      setTtsEnabled((prev) => {
                        const nuevoEstado = !prev;
                        if (!nuevoEstado) stopTTS();
                        return nuevoEstado;
                      });
                    }}
                    sx={{
                      backgroundColor: ttsEnabled ? "#c0beb9" : "transparent",
                      color: ttsEnabled ? "#000000" : "#000000",
                      "&:hover": { backgroundColor: "#c0beb9", color: "#000000" },
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
                      backgroundColor: "transparent",
                      color: "#000000",
                      "&:hover": { backgroundColor: "#7d745c", color: "#ffffff" }
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
          <Box sx={{
            display: "flex",
            flexDirection: "column",
            height: "100%",
            width: "100%",
            overflow: "hidden"
          }}>
            <Box
              ref={scrollRef}
              sx={{
                minHeight: 0,
                flexGrow: 1,
                overflowY: "auto",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                width: "100%",
                gap: 5,
                p: { xs: 2, sm: 2, md: 3, lg: 3, xl: 3 },
                scrollbarWidth: 'thin'
              }}
            >
              {mensajes.map((msg) => (
                <Box
                  key={msg.id}
                  sx={{
                    display: "flex",
                    maxWidth: "800px",
                    width: "100%",
                    justifyContent: msg.role === "user" ? "flex-end" : "flex-start",
                  }}
                >
                  <Box
                    sx={{
                      position: "relative",
                      maxWidth: msg.role === "user" ? "70%" : "100%",
                      p: 2,
                      borderRadius: "15px",
                      fontFamily: "Arial, sans-serif",
                      color: "#000000",
                      backgroundColor: msg.role === "user" ? "#cfcdc7" : "transparent",
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
                            borderColor: "transparent transparent transparent #cfcdc7"
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
                            color: "#000000",
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
                            color: "#000000",
                            textAlign: "left"
                          }}>
                            {children}
                          </Typography>
                        ),
                        li: ({ children }) => (
                          <li style={{
                            fontSize: "1.05rem",
                            lineHeight: 1.8,
                            color: "#000000",
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
              {pensandoIA === activeConversationId && (
                <Box sx={{ display: "flex", justifyContent: "flex-start", width: "100%", maxWidth: "800px", pl: 2 }}>
                  <Box sx={{
                    maxWidth: "800px",
                    width: "100%",
                    mb: 3,
                    color: "#000000",
                    fontStyle: "italic",
                    fontSize: "1.05rem",
                    fontFamily: "'Lora', serif"
                  }}>
                    {fraseParaChat}
                  </Box>
                </Box>
              )}
            </Box>
          </Box>
          <Box
            component="form"
            onSubmit={(e) => {
              e.preventDefault();
              mandarPrompt();
            }}
            sx={{
              display: "flex",
              justifyContent: "center",
              width: "100%",
              flexShrink: 0,
              my: 1,
              mb: { xs: 0, sm: 0, md: 1, lg: 2, xl: 2 },
            }}
          >
            <Box sx={{
              width: "100%",
              maxWidth: "800px",
              backgroundColor: "#cfcdc7",
              borderRadius: {
                xs: "16px 16px 0 0",
                sm: "16px 16px 0 0",
                md: 4,
                lg: 4,
                xl: 4
              },
              boxShadow: 4,
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
                    color: "#000000",
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
                pb: 1,
              }}>
                <Box>
                  <IconButton
                    onClick={() => {
                      setTtsEnabled((prev) => {
                        const nuevoEstado = !prev;
                        if (!nuevoEstado) stopTTS();
                        return nuevoEstado;
                      });
                    }}
                    sx={{
                      backgroundColor: ttsEnabled ? "#cfcdc7" : "transparent",
                      color: ttsEnabled ? "#000000" : "#000000",
                      "&:hover": { backgroundColor: "#dad7d7", color: "#000000" }
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
                      backgroundColor: ttsEnabled ? "#cfcdc7" : "transparent",
                      color: ttsEnabled ? "#000000" : "#000000",
                      "&:hover": { backgroundColor: "#7d745c", color: "#ffffff" },
                      mr: 1,
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
