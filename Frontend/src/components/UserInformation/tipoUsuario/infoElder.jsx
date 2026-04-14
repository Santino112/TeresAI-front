import { Typography, Button, TextField, Box, Select, MenuItem, FormHelperText, Divider, Paper, Alert, Checkbox, FormControlLabel } from "@mui/material";

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
        setErrorTextFields,
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
                    }} sx={{
                        backgroundColor: "#303030",
                        borderRadius: 3,
                        boxShadow: 3,
                        mt: 1,
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
                        <TextField
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
                        ></TextField>
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
                    }} sx={{
                        backgroundColor: "#303030",
                        borderRadius: 3,
                        boxShadow: 3,
                        mt: 1,
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
                        <TextField
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
                        ></TextField>
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
                    }} sx={{
                        backgroundColor: "#303030",
                        borderRadius: 3,
                        boxShadow: 3,
                        mt: 1,
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
                        <TextField
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
                        ></TextField>
                    </Box>
                )}
            </Box>
            <Box sx={{ my: 1, width: "100%" }}>
                <Typography variant="body1" sx={{ fontFamily: "'Lora', serif", }}>¿Qué cosas te gustan hacer?</Typography>
                <TextField
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
                ></TextField>
            </Box>
            <Box sx={{ my: 0, width: "100%" }}>
                <Typography variant="body1" sx={{ fontFamily: "'Lora', serif", }}>¿Hay algo que no te guste o te moleste?</Typography>
                <TextField
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
                ></TextField>
            </Box>
        </>
    );
};

export default InfoElder;