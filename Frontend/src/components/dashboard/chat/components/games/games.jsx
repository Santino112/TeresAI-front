import Sudoku from "./Sudoku.jsx";
import Trivia from "./Trivia.jsx";
import Crossword from "./Crossword.jsx";
import { Typography, Button, TextField, Box, Stack, Divider } from "@mui/material";
import { InputAdornment, IconButton } from "@mui/material";
import fondoChatAI from "../../../../../assets/images/fondoChatAI.png"

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
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    width: "100%",
                    background: `url(${fondoChatAI})`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                    backgroundRepeat: "no-repeat",
                    p: 2,
                }}
            >
                <Paper
                    sx={{
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "flex-start",
                        width: "%100",
                        p: { xs: 2, sm: 3, md: 3 },
                        borderRadius: 4,
                        background: "transparent",
                        flexGrow: 0,
                    }}
                >
                    <Typography variant="h2" sx={{
                        fontSize: {
                            xs: "1.5rem",
                            sm: "1.5rem",
                            md: "1.5rem",
                            lg: "1.7rem",
                            xl: "1.8rem"
                        },
                        textAlign: {xs: "center", sm: "center", md: "start"},
                        fontFamily: "'Lora', serif",
                    }}>Juegos mentales</Typography>
                    <Typography variant="body2" sx={{
                        my: 1,
                        fontSize: {
                            xs: "1rem",
                            sm: "1rem",
                            md: "1.2rem",
                            lg: "1.3rem",
                            xl: "1.3rem",
                        },
                        textAlign: {xs: "center", sm: "center", md: "start"},
                        fontFamily: "'Lora', serif",
                        lineHeight: 1.8,
                    }}>En esta sección podras encontrar una serie de juegos que te ayudaran a pasar el rato. Juegos divertidos y de memoria
                        para ejercitar la mente y mejorar el bienestar propio.
                    </Typography>
                    <Divider sx={{
                        width: "100%",
                        "&::before, &::after": {
                            borderColor: "#ffffff",
                        }
                    }}>
                        <Typography variant="body1" sx={{ color: "#ffffff" }}>~</Typography>
                    </Divider>
                    <Box sx={{ width: "100%", overflow: "hidden", margin: "0 auto" }}>
                        <Sudoku />
                    </Box>
                    <Divider sx={{
                        width: "100%",
                        "&::before, &::after": {
                            borderColor: "#ffffff",
                        }
                    }}>
                        <Typography variant="body1" sx={{ color: "#ffffff" }}></Typography>
                    </Divider>
                    <Box sx={{ width: "100%", overflowX: "auto", margin: "0 auto" }}>
                        <Trivia />
                    </Box>
                    <Divider sx={{
                        width: "100%",
                        "&::before, &::after": {
                            borderColor: "#ffffff",
                        }
                    }}>
                        <Typography variant="body1" sx={{ color: "#ffffff" }}></Typography>
                    </Divider>
                    <Box sx={{ width: "100%", overflowX: "auto", margin: "0 auto" }}>
                        <Crossword />
                    </Box>
                </Paper>
            </Box>
        </Box>
    )
};

export default Games;