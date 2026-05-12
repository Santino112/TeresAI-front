import Sudoku from "./sudoku.jsx";
import Crossword from "./crossword.jsx";
import fondoChatAI from "../../../../../assets/images/fondoChatAI.png";
import { Typography, Box, Paper, Divider, Grid } from "@mui/material";
import ExtensionRoundedIcon from '@mui/icons-material/ExtensionRounded';

const Games = () => {
    return (

        <Box
            sx={{
                flexGrow: 1,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                width: "100%",
                height: "100%",
                overflow: "auto",
                background: `url(${fondoChatAI})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
                backgroundRepeat: "no-repeat",
                p: 2,
            }}
        >
            <Paper
                sx={{
                    flexGrow: 0,
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "flex-start",
                    width: "%100",
                    p: { xs: 2, sm: 2, md: 2 },
                    borderRadius: 4,
                    background: "transparent",
                    boxShadow: 0,
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
                <Typography variant="h3" sx={{
                    display: "flex",
                    justifyContent: { xs: "center", sm: "center", md: "flex-start" },
                    alignItems: "center",
                    color: "#000000",
                    fontSize: {
                        xs: "1.5rem",
                        sm: "1.5rem",
                        md: "1.5rem",
                        lg: "1.7rem",
                        xl: "1.8rem"
                    },
                }}>Juegos mentales <ExtensionRoundedIcon fontSize="medium" sx={{ color: "#000000", ml: 1 }} />
                </Typography>
                <Typography variant="body2" sx={{
                    color: "#000000",
                    my: 1,
                    fontSize: {
                        xs: "1rem",
                        sm: "1rem",
                        md: "1.2rem",
                        lg: "1.3rem",
                        xl: "1.3rem",
                    },
                    lineHeight: 1.8,
                }}>En esta sección podras encontrar una serie de juegos que te ayudaran a pasar el rato. Juegos divertidos y de memoria
                    para ejercitar la mente y mejorar el bienestar propio.
                </Typography>
                <Divider sx={{ borderColor: "rgba(0,0,0,0.1)" }} />
                <Grid container spacing={2} sx={{
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
                }}>
                    <Grid size={{
                        xs: 12,
                        sm: 12,
                        md: 12,
                        lg: 12,
                        xl: 6
                    }}>
                        <Box sx={{ width: "100%", overflow: "hidden", margin: "0 auto" }}>
                            <Sudoku />
                        </Box>
                    </Grid>
                    <Grid size={{
                        xs: 12,
                        sm: 12,
                        md: 12,
                        lg: 12,
                        xl: 6
                    }}>
                        <Box sx={{ width: "100%", overflowX: "auto", margin: "0 auto" }}>
                            <Crossword />
                        </Box>
                    </Grid>
                </Grid>
            </Paper>
        </Box>
    )
};

export default Games;
