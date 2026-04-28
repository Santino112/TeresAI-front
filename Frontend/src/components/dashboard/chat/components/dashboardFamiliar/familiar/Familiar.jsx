import { useEffect, useState, useRef } from "react";
import { Typography, Button, TextField, Box, Stack, Paper, Divider } from "@mui/material";
import fondoChatAI from "../../../../../../assets/images/fondoChatAI.png";

const Familiar = () => {
    return (
        <Box
            sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                flexGrow: 1,
                width: "100%",
                height: "100%",
                overflow: "auto",
                background: `url(${fondoChatAI})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
                backgroundRepeat: "no-repeat",
                p: 2
            }}
        >
            <Paper
                sx={{
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "flex-start",
                    width: "100%",
                    p: { xs: 2, sm: 3, md: 3 },
                    borderRadius: 4,
                    background: "transparent",
                    flexGrow: 0,
                }}
            >
                <Typography variant="h3" sx={{
                    fontSize: {
                        xs: "1.5rem",
                        sm: "1.5rem",
                        md: "1.5rem",
                        lg: "1.7rem",
                        xl: "1.8rem"
                    },
                    textAlign: { xs: "center", sm: "center", md: "start" },
                    fontFamily: "'Lora', serif",
                }}>Mi familiar 🧑‍🧑‍🧒‍🧒</Typography>
                <Typography variant="body2" sx={{
                    my: 1,
                    fontSize: {
                        xs: "1rem",
                        sm: "1rem",
                        md: "1.2rem",
                        lg: "1.2rem",
                        xl: "1.2rem",
                    },
                    textAlign: { xs: "center", sm: "center", md: "start" },
                    fontFamily: "'Lora', serif",
                    lineHeight: 1.8,
                }}>En esta sección podrás tener una visualización de todos tus eventos agendados con teresa. Puedes chequear por semana o mes.
                </Typography>
                <Divider sx={{
                    width: "100%",
                    "&::before, &::after": {
                        borderColor: "#ffffff",
                    }
                }}>
                    <Typography variant="body1" sx={{ color: "#ffffff" }}>~</Typography>
                </Divider>
            </Paper>
        </Box>
    );
};

export default Familiar;