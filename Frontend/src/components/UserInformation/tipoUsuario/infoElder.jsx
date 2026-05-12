import { Typography, Button, Box, Select, MenuItem, FormHelperText, Divider, Paper, Alert, Checkbox, FormControlLabel } from "@mui/material";
import VoiceTextField from "../VoiceTextField.jsx";

const InfoElder = (
    {
        tieneEnfermedad,
        setTieneEnfermedad,
        enfermedad,
        setEnfermedad,
        tomaMedicamentos,
        setTomaMedicamentos,
        medicamentos,
        setMedicamentos,
        tieneAlergias,
        setTieneAlergias,
        alergias,
        setAlergias,
        molestias,
        setMolestias,
        gustos,
        setGustos,
        errorTextFields,
    }
) => {
    return (
        <>
            <Box sx={{ mb: 1, width: "100%" }}>
                <Typography variant="body1" sx={{ fontFamily: "'Lora', serif", }}>¿Sufrís de alguna enfermedad?</Typography>
                <Select
                    error={errorTextFields}
                    labelId="demo-simple-select-helper-label"
                    id="demo-simple-select-helper"
                    value={tieneEnfermedad}
                    fullWidth
                    onChange={(e) => {
                        setTieneEnfermedad(e.target.value)
                        e.target.value === "si" ? setEnfermedad("") : setEnfermedad("No")
                    }
                    }
                    MenuProps={{
                        PaperProps: {
                            sx: {
                                borderRadius: 3,
                                backgroundColor: "#303030",
                                color: "#ffffff",
                            }
                        },
                        MenuListProps: { sx: { p: 0 } }
                    }}
                    sx={{
                        backgroundColor: "#d7d6d6",
                        color: "#000000",
                        borderRadius: 3,
                        mt: 1,
                        boxShadow: 3,
                        input: { color: "#000000" },
                        "& .MuiOutlinedInput-root": {
                            borderRadius: 3,
                            pr: 1,
                        },
                        "& fieldset": {
                            borderColor: "transparent"
                        },
                        "& .MuiInputBase-input::placeholder": {
                            color: "#000000",
                            opacity: 0.6,
                        },
                        "&:hover fieldset": {
                            borderColor: "transparent"
                        },
                        "&.Mui-focused fieldset": {
                            borderColor: "gray"
                        },
                        "& .MuiSelect-icon": {
                            color: "#000000",
                        },
                        mb: 1
                    }}
                >
                    <MenuItem value="seleccione" disabled>Seleccione</MenuItem>
                    <MenuItem value="si">Si</MenuItem>
                    <MenuItem value="no">No</MenuItem>
                </Select>
                {tieneEnfermedad === "si" && (
                    <Box sx={{ width: "100%" }}>
                        <Typography variant="body1" sx={{ fontFamily: "'Lora', serif", }}>¿Cúal/es? Escribilas</Typography>
                        <VoiceTextField
                            error={errorTextFields}
                            placeholder="Escribilas..."
                            value={enfermedad}
                            onChange={(e) => setEnfermedad(e.target.value)}
                            variant="outlined"
                            multiline
                            minRows={4}
                            maxRows={4}
                            fullWidth
                            margin="dense"
                            sx={{
                                backgroundColor: "#d7d6d6",
                                color: "#000000",
                                borderRadius: 3,
                                boxShadow: 3,
                                "& .MuiInputBase-input": {
                                    color: "#000000",
                                    WebkitTextFillColor: "#000000",
                                },
                                "& textarea": {
                                    color: "#000000",
                                },
                                "& .MuiOutlinedInput-root": {
                                    borderRadius: 3,
                                    pr: 1,
                                },
                                "& fieldset": {
                                    borderColor: "transparent"
                                },
                                "& .MuiInputBase-input::placeholder": {
                                    color: "#000000",
                                    opacity: 0.6,
                                },
                                "&:hover fieldset": {
                                    borderColor: "transparent"
                                },
                                "&.Mui-focused fieldset": {
                                    borderColor: "gray"
                                },
                                "& .MuiFormHelperText-root": {
                                    color: "#000000",
                                    opacity: 0.8,
                                    fontWeight: 500,
                                },
                            }}
                        />
                    </Box>
                )}
            </Box>
            <Box sx={{ my: 0, width: "100%" }}>
                <Typography variant="body1" sx={{ fontFamily: "'Lora', serif", }}>¿Tomás medicamentos?</Typography>
                <Select
                    error={errorTextFields}
                    labelId="demo-simple-select-helper-label"
                    id="demo-simple-select-helper"
                    value={tomaMedicamentos}
                    fullWidth
                    onChange={(e) => {
                        setTomaMedicamentos(e.target.value);
                        e.target.value === "si" ? setMedicamentos("") : setMedicamentos("No")
                    }
                    }
                    MenuProps={{
                        PaperProps: {
                            sx: {
                                borderRadius: 3,
                                backgroundColor: "#303030",
                                color: "#ffffff",
                            }
                        },
                        MenuListProps: { sx: { p: 0 } }
                    }}
                    sx={{
                        backgroundColor: "#d7d6d6",
                        color: "#000000",
                        borderRadius: 3,
                        mt: 1,
                        boxShadow: 3,
                        input: { color: "#000000" },
                        "& .MuiOutlinedInput-root": {
                            borderRadius: 3,
                            pr: 1,
                        },
                        "& fieldset": {
                            borderColor: "transparent"
                        },
                        "& .MuiInputBase-input::placeholder": {
                            color: "#000000",
                            opacity: 0.6,
                        },
                        "&:hover fieldset": {
                            borderColor: "transparent"
                        },
                        "&.Mui-focused fieldset": {
                            borderColor: "gray"
                        },
                        "& .MuiSelect-icon": {
                            color: "#000000",
                        },
                        mb: 1
                    }}
                >
                    <MenuItem value="seleccione" disabled>Seleccione</MenuItem>
                    <MenuItem value="si">Si</MenuItem>
                    <MenuItem value="no">No</MenuItem>
                </Select>
                {tomaMedicamentos === "si" && (
                    <Box sx={{ width: "100%" }}>
                        <Typography variant="body1" sx={{ fontFamily: "'Lora', serif", }}>¿Cúal/es? Escribilos</Typography>
                        <VoiceTextField
                            error={errorTextFields}
                            placeholder="Escribilos..."
                            value={medicamentos}
                            onChange={(e) => setMedicamentos(e.target.value)}
                            variant="outlined"
                            multiline
                            minRows={4}
                            maxRows={4}
                            fullWidth
                            margin="dense"
                            sx={{
                                backgroundColor: "#d7d6d6",
                                color: "#000000",
                                borderRadius: 3,
                                boxShadow: 3,
                                "& .MuiInputBase-input": {
                                    color: "#000000",
                                    WebkitTextFillColor: "#000000",
                                },
                                "& textarea": {
                                    color: "#000000",
                                },
                                "& .MuiOutlinedInput-root": {
                                    borderRadius: 3,
                                    pr: 1,
                                },
                                "& fieldset": {
                                    borderColor: "transparent"
                                },
                                "& .MuiInputBase-input::placeholder": {
                                    color: "#000000",
                                    opacity: 0.6,
                                },
                                "&:hover fieldset": {
                                    borderColor: "transparent"
                                },
                                "&.Mui-focused fieldset": {
                                    borderColor: "gray"
                                },
                                "& .MuiFormHelperText-root": {
                                    color: "#000000",
                                    opacity: 0.8,
                                    fontWeight: 500,
                                },
                            }}
                        />
                    </Box>
                )}
            </Box>
            <Box sx={{ my: 0, width: "100%" }}>
                <Typography variant="body1" sx={{ fontFamily: "'Lora', serif", }}>¿Sufrís de alergias?</Typography>
                <Select
                    error={errorTextFields}
                    labelId="demo-simple-select-helper-label"
                    id="demo-simple-select-helper"
                    value={tieneAlergias}
                    fullWidth
                    onChange={(e) => {
                        setTieneAlergias(e.target.value)
                        e.target.value === "si" ? setAlergias("") : setAlergias("No")
                    }
                    }
                    MenuProps={{
                        PaperProps: {
                            sx: {
                                borderRadius: 3,
                                backgroundColor: "#303030",
                                color: "#ffffff",
                            }
                        },
                        MenuListProps: { sx: { p: 0 } }
                    }}
                    sx={{
                        backgroundColor: "#d7d6d6",
                        color: "#000000",
                        borderRadius: 3,
                        mt: 1,
                        boxShadow: 3,
                        input: { color: "#000000" },
                        "& .MuiOutlinedInput-root": {
                            borderRadius: 3,
                            pr: 1,
                        },
                        "& fieldset": {
                            borderColor: "transparent"
                        },
                        "& .MuiInputBase-input::placeholder": {
                            color: "#000000",
                            opacity: 0.6,
                        },
                        "&:hover fieldset": {
                            borderColor: "transparent"
                        },
                        "&.Mui-focused fieldset": {
                            borderColor: "gray"
                        },
                        "& .MuiSelect-icon": {
                            color: "#000000",
                        },
                        mb: 1
                    }}
                >
                    <MenuItem value="seleccione" disabled>Seleccione</MenuItem>
                    <MenuItem value="si">Si</MenuItem>
                    <MenuItem value="no">No</MenuItem>
                </Select>
                {tieneAlergias === "si" && (
                    <Box sx={{ width: "100%" }}>
                        <Typography variant="body1" sx={{ fontFamily: "'Lora', serif", }}>¿Cúal/es? Escribilas</Typography>
                        <VoiceTextField
                            error={errorTextFields}
                            placeholder="Escribilas..."
                            value={alergias}
                            onChange={(e) => setAlergias(e.target.value)}
                            variant="outlined"
                            multiline
                            minRows={4}
                            maxRows={4}
                            fullWidth
                            margin="dense"
                            sx={{
                                backgroundColor: "#d7d6d6",
                                color: "#000000",
                                borderRadius: 3,
                                boxShadow: 3,
                                "& .MuiInputBase-input": {
                                    color: "#000000",
                                    WebkitTextFillColor: "#000000",
                                },
                                "& textarea": {
                                    color: "#000000",
                                },
                                "& .MuiOutlinedInput-root": {
                                    borderRadius: 3,
                                    pr: 1,
                                },
                                "& fieldset": {
                                    borderColor: "transparent"
                                },
                                "& .MuiInputBase-input::placeholder": {
                                    color: "#000000",
                                    opacity: 0.6,
                                },
                                "&:hover fieldset": {
                                    borderColor: "transparent"
                                },
                                "&.Mui-focused fieldset": {
                                    borderColor: "gray"
                                },
                                "& .MuiFormHelperText-root": {
                                    color: "#000000",
                                    opacity: 0.8,
                                    fontWeight: 500,
                                },
                            }}
                        />
                    </Box>
                )}
            </Box>
            <Box sx={{ my: 1, width: "100%" }}>
                <Typography variant="body1" sx={{ fontFamily: "'Lora', serif", }}>¿Qué cosas te gustan hacer?</Typography>
                <VoiceTextField
                    placeholder="Escribilas..."
                    value={gustos}
                    onChange={(e) => setGustos(e.target.value)}
                    variant="outlined"
                    multiline
                    fullWidth
                    minRows={4}
                    maxRows={4}
                    margin="dense"
                    sx={{
                        backgroundColor: "#d7d6d6",
                        color: "#000000",
                        borderRadius: 3,
                        boxShadow: 3,
                        "& .MuiInputBase-input": {
                            color: "#000000",
                            WebkitTextFillColor: "#000000",
                        },
                        "& textarea": {
                            color: "#000000",
                        },
                        "& .MuiOutlinedInput-root": {
                            borderRadius: 3,
                            pr: 1,
                        },
                        "& fieldset": {
                            borderColor: "transparent"
                        },
                        "& .MuiInputBase-input::placeholder": {
                            color: "#000000",
                            opacity: 0.6,
                        },
                        "&:hover fieldset": {
                            borderColor: "transparent"
                        },
                        "&.Mui-focused fieldset": {
                            borderColor: "gray"
                        },
                        "& .MuiFormHelperText-root": {
                            color: "#000000",
                            opacity: 0.8,
                            fontWeight: 500,
                        },
                    }}
                />
            </Box>
            <Box sx={{ my: 0, width: "100%" }}>
                <Typography variant="body1" sx={{ fontFamily: "'Lora', serif", }}>¿Hay algo que no te guste o te moleste?</Typography>
                <VoiceTextField
                    placeholder="Escribilas..."
                    value={molestias}
                    onChange={(e) => setMolestias(e.target.value)}
                    variant="outlined"
                    multiline
                    minRows={4}
                    maxRows={4}
                    fullWidth
                    margin="dense"
                    sx={{
                        backgroundColor: "#d7d6d6",
                        color: "#000000",
                        borderRadius: 3,
                        boxShadow: 3,
                        "& .MuiInputBase-input": {
                            color: "#000000",
                            WebkitTextFillColor: "#000000",
                        },
                        "& textarea": {
                            color: "#000000",
                        },
                        "& .MuiOutlinedInput-root": {
                            borderRadius: 3,
                            pr: 1,
                        },
                        "& fieldset": {
                            borderColor: "transparent"
                        },
                        "& .MuiInputBase-input::placeholder": {
                            color: "#000000",
                            opacity: 0.6,
                        },
                        "&:hover fieldset": {
                            borderColor: "transparent"
                        },
                        "&.Mui-focused fieldset": {
                            borderColor: "gray"
                        },
                        "& .MuiFormHelperText-root": {
                            color: "#000000",
                            opacity: 0.8,
                            fontWeight: 500,
                        },
                    }}
                />
            </Box>
        </>
    );
};

export default InfoElder;
