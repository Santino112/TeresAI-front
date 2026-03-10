import { useEffect, useState, useRef } from "react";
import { enviarPrompt } from "../exports/enviarPrompt.js";
import axios from 'axios';
import Sudoku from "./Sudoku.jsx";
import Trivia from "./Trivia.jsx";
import { Typography, Button, TextField, Box, Stack } from "@mui/material";
import { playTTS } from "../exports/playTTS.js";
import { useWakeWord } from "../exports/useWakeWord.js";
import { getMessages } from "../exports/conversaciones.js";
import { InputAdornment, IconButton } from "@mui/material";

const Games = () => {
    return (
        <Box
            sx={{
                flexGrow: 1,
                display: "flex",
                flexDirection: "column",
                minHeight: 0,
            }}
        >
            <Box
                sx={{
                    flexGrow: 1,
                    p: {
                        xs: 2,
                        md: 0
                    },
                    display: "flex",
                    flexDirection: "column",
                    overflowX: "hidden",
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
                <Typography variant="h2" sx={{
                    mt: 2,
                    fontSize: {
                        xs: "1.5rem",
                        sm: "1.5rem",
                        md: "1.7rem",
                        lg: "1.7rem",
                        xl: "2rem"
                    },
                    fontFamily: "'Lora', serif",
                    textAlign: "center"
                }}>Juegos mentales</Typography>
                <Typography variant="body2" sx={{
                    my: 2,
                    fontSize: {
                        xs: "1rem",
                        sm: "1rem",
                        md: "1.2rem",
                        lg: "1.3rem",
                        xl: "1.3rem",
                    },
                    fontFamily: "'Lora', serif",
                    textAlign: "center",
                    lineHeight: 1.8,
                }}>En esta sección podras encontrar una serie de juegos que te ayudaran a pasar el rato. Juegos divertidos y de memoria
                   para ejercitar la mente y mejorar el bienestar propio.
                </Typography>
                <Box sx={{my: 1}}>
                    <Sudoku />
                </Box>
                <Box sx={{mb: 3}}>
                    <Trivia />
                </Box>
            </Box>
        </Box>
    )
};

export default Games;