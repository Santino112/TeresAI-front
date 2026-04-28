import { useEffect, useState, useRef } from "react";
import { Typography, TextField, Box, CircularProgress } from "@mui/material";
import { InputAdornment, IconButton } from "@mui/material";
import fondoChatAI from "../../../../../../assets/images/fondoChatAI.png";
import axios from "axios";
import ReactMarkDown from 'react-markdown';
import ArrowUpwardRoundedIcon from '@mui/icons-material/ArrowUpwardRounded';
import VolumeUpRoundedIcon from "@mui/icons-material/VolumeUpRounded";
import VolumeOffRoundedIcon from "@mui/icons-material/VolumeOffRounded";

const Chat = () => {

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
          <Typography variant="h2" sx={{ fontSize: "1rem", fontFamily: "'Lora', serif" }}>Cargando mensajes...</Typography>
          <CircularProgress sx={{ color: "#ffffff" }} />
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
            color: "#f0750a",
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
              backgroundColor: "#303030",
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
                    color: "#ffffff",
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
                      backgroundColor: ttsEnabled ? "#ffffff" : "transparent",
                      color: ttsEnabled ? "#303030" : "#ffffff",
                      "&:hover": { backgroundColor: "#dad7d7", color: "#303030" },
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
                      backgroundColor: "#ffffff",
                      color: "#303030",
                      "&:hover": { backgroundColor: "#dad7d7", color: "#303030" }
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
                      color: "white",
                      backgroundColor: msg.role === "user" ? "#303030" : "transparent",
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
                            borderColor: "transparent transparent transparent #303030"
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
              {pensandoIA === activeConversationId && (
                <Box sx={{ display: "flex", justifyContent: "flex-start", width: "100%", maxWidth: "800px", pl: 2 }}>
                  <Box sx={{
                    maxWidth: "800px",
                    width: "100%",
                    mb: 3,
                    color: "#ffffff",
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
              backgroundColor: "#303030",
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
                      backgroundColor: ttsEnabled ? "#ffffff" : "transparent",
                      color: ttsEnabled ? "#303030" : "#ffffff",
                      "&:hover": { backgroundColor: "#dad7d7", color: "#303030" }
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
                      backgroundColor: "#ffffff",
                      color: "#303030",
                      ml: 1,
                      "&:hover": { backgroundColor: "#dad7d7", color: "#303030" }
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