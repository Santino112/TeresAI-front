import { Typography, Button, Box, Select, MenuItem, FormHelperText, Divider, Paper, Alert, Checkbox, FormControlLabel } from "@mui/material";
import VoiceTextField from "../VoiceTextField.jsx";

const InfoCuidador = (
    {
         geriatrico,
         setGeriatrico,
         numAdultos,
         setNumAdultos,
         infoEspecifica,
         setInfoEspecifica,
         sinGeriatrico,
         setSinGeriatrico,
        errorTextFields
    }
) => {
    return (
        <>
            <Box sx={{ my: 0, width: "100%" }}>
                <Typography variant="body1" sx={{ fontFamily: "'Lora', serif", }}>¿En qué geriátrico trabajas?</Typography>
                <VoiceTextField
                    disabled={sinGeriatrico}
                    error={errorTextFields}
                    placeholder="Nombre"
                    value={geriatrico}
                    onChange={(e) => setGeriatrico(e.target.value)}
                    fullWidth
                    sx={{
                        backgroundColor: "#303030",
                        borderRadius: 3,
                        boxShadow: 3,
                        input: { color: "white" },
                        "& .MuiOutlinedInput-root": {
                            borderRadius: 3,
                            pr: 1,
                        },
                        "& fieldset": {
                            borderColor: "transparent"
                        },
                        "&:hover fieldset": {
                            borderColor: "transparent"
                        },
                        "&.Mui-focused fieldset": {
                            borderColor: "gray"
                        },
                        "& .MuiOutlinedInput-root.Mui-disabled fieldset": {
                            borderColor: "transparent",
                        }
                    }}
                />
            </Box>
            <Box sx={{ width: "100%" }}>
                <FormControlLabel
                    control={
                        <Checkbox
                            checked={sinGeriatrico}
                            onChange={(e) => {
                                setSinGeriatrico(e.target.checked);
                                e.target.checked ? setGeriatrico("No trabajo en un geriátrico") : setGeriatrico("");
                            }
                            }
                        />
                    }
                    label={
                        <Typography variant="body1" sx={{ fontFamily: "'Lora', serif" }}>No trabajo en un geriátrico</Typography>
                    }
                />
            </Box>
            <Box sx={{ my: 0, width: "100%" }}>
                <Typography variant="body1" sx={{ fontFamily: "'Lora', serif" }}>¿Cuántos adultos mayores tenes a tu cargo?</Typography>
                <VoiceTextField
                    error={errorTextFields}
                    placeholder=""
                    type="number"
                    value={numAdultos}
                    onChange={(e) => setNumAdultos(e.target.value)}
                    fullWidth
                    inputProps={{ inputMode: "numeric" }}
                    sx={{
                        backgroundColor: "#303030",
                        borderRadius: 3,
                        boxShadow: 3,
                        input: { color: "white" },
                        "& .MuiOutlinedInput-root": {
                            borderRadius: 3,
                            pr: 1,
                        },
                        "& fieldset": {
                            borderColor: "transparent"
                        },
                        "&:hover fieldset": {
                            borderColor: "transparent"
                        },
                        "&.Mui-focused fieldset": {
                            borderColor: "gray"
                        }
                    }}
                />
            </Box>

            <Box sx={{ my: 0, width: "100%" }}>
                <Typography variant="body1" sx={{ fontFamily: "'Lora', serif", }}>¿Hay algo especifico que necesites monitorear?</Typography>
                <VoiceTextField
                    error={errorTextFields}
                    placeholder="Escribilo..."
                    value={infoEspecifica}
                    onChange={(e) => setInfoEspecifica(e.target.value)}
                    fullWidth
                    multiline
                    minRows={4}
                    maxRows={4}
                    sx={{
                        backgroundColor: "#303030",
                        borderRadius: 3,
                        boxShadow: 3,
                        input: { color: "white" },
                        "& .MuiOutlinedInput-root": {
                            borderRadius: 3,
                            pr: 1,
                        },
                        "& fieldset": {
                            borderColor: "transparent"
                        },
                        "&:hover fieldset": {
                            borderColor: "transparent"
                        },
                        "&.Mui-focused fieldset": {
                            borderColor: "gray"
                        }
                    }}
                />
            </Box>
        </>
    );
};

export default InfoCuidador;
