import Sudoku from "./Sudoku.jsx";
import Trivia from "./Trivia.jsx";
import { Typography, Button, TextField, Box, Stack } from "@mui/material";

const Games = () => {
    return (
        <Box
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
            <Box
                sx={{
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                    alignItems: "center",
                    flexGrow: 1,
                    width: "100%",
                    backgroundColor: "#2f342d",
                    p: 2
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
                <Box sx={{width: "900px"}}>
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
                </Box>
                <Box sx={{ my: 2, width: "800px", }}>
                    <Sudoku />
                </Box>
                <Box sx={{ mb: 2, my: 1, width: "800px" }}>
                    <Trivia />
                </Box>
            </Box>
        </Box>
    )
};

export default Games;