import { useEffect, useState, useRef } from "react";
import { Typography, TextField, Box, CircularProgress } from "@mui/material";
import fondoChatAI from "../../../../../assets/images/fondoChatAI.png";
import TeresaiLogo from '../../../../../assets/images/logo_teresAI.svg';

const Inicio = () => {
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
            <Box
                sx={{
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                    alignItems: "center",
                    flexGrow: 1,
                    maxWidth: "800px",
                    width: "100%",
                    p: 2,
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
                <Box
                    component="img"
                    src={TeresaiLogo}
                    alt="TERESAI Logo"
                    sx={{
                        height: "300px",
                        width: "auto",
                        cursor: "pointer",
                    }}
                />
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
                    TeresAI, tu compañera
                </Typography>
            </Box>
        </Box>
    )
};

export default Inicio;