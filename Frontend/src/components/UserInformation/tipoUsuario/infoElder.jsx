import { Typography, Button, TextField, Box, Select, MenuItem, FormHelperText, Divider, Paper, Alert, Checkbox, FormControlLabel, InputAdornment } from "@mui/material";
import SickRoundedIcon from '@mui/icons-material/SickRounded';
import MedicationRoundedIcon from '@mui/icons-material/MedicationRounded';
import MasksRoundedIcon from '@mui/icons-material/MasksRounded';
import FavoriteRoundedIcon from '@mui/icons-material/FavoriteRounded';
import HeartBrokenRoundedIcon from '@mui/icons-material/HeartBrokenRounded';

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
                <Typography variant="body1" sx={{ color: "#000000" }}>¿Sufrís de alguna enfermedad?</Typography>
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
                    startAdornment={
                        <InputAdornment position="start">
                            <SickRoundedIcon fontSize="medium" sx={{ color: "#000000", mr: 1 }} />
                        </InputAdornment>
                    }
                    sx={{
                        backgroundColor: "#d7d6d6",
                        color: "#000000",
                        borderRadius: 3,
                        boxShadow: 3,
                        mb: 1,
                        // 1. Esto fuerza el borde a la raíz del Select cuando está enfocado
                        "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                            borderColor: "gray !important",
                            borderWidth: "2px !important",
                        },
                        // 2. Quitamos el borde por defecto y en hover
                        "& .MuiOutlinedInput-notchedOutline": {
                            borderColor: "transparent",
                        },
                        "&:hover .MuiOutlinedInput-notchedOutline": {
                            borderColor: "transparent",
                            borderWidth: "2px",
                        },
                        // Estilos del Input e Icono
                        "& .MuiInputBase-input": {
                            color: "#000000",
                            WebkitTextFillColor: "#000000",
                        },
                        "& .MuiSelect-icon": {
                            color: "#000000",
                        },
                        // Estilos del Label (opcional, para mantener el negro al enfocar)
                        "& .MuiInputLabel-root.Mui-focused": {
                            color: "#000000 !important",
                        },
                        // Corrección para el Start Adornment si fuera necesario
                        "& .MuiInputAdornment-root": {
                            color: "#000000",
                        }
                    }}
                >
                    <MenuItem value="seleccione" disabled>Seleccione</MenuItem>
                    <MenuItem value="si">Si</MenuItem>
                    <MenuItem value="no">No</MenuItem>
                </Select>
                {tieneEnfermedad === "si" && (
                    <Box sx={{ width: "100%" }}>
                        <Typography variant="body1" sx={{ color: "#000000"  }}>¿Cúal/es? Escribilas o decilas aquí abajo</Typography>
                        <TextField
                            error={errorTextFields}
                            placeholder="Escribilas o decilas aquí..."
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
                                "& .MuiInputBase-input::placeholder": {
                                    color: "#000000",
                                    opacity: 0.6,
                                },
                                "& .MuiFormHelperText-root": {
                                    color: "#000000",
                                    opacity: 0.8,
                                    fontWeight: 500,
                                },
                                "& .MuiOutlinedInput-root": {
                                    borderRadius: 3,
                                    alignItems: 'flex-start', // Alinea todo al techo
                                    paddingTop: 0,            // Quitamos el padding de MUI
                                    paddingLeft: 1.5,
                                    "& fieldset": { borderColor: "transparent" },
                                    "&:hover fieldset": { borderColor: "transparent" },
                                    "&.Mui-focused fieldset": { borderColor: "gray" },
                                },
                                "& .MuiInputBase-input": {
                                    color: "#000000",
                                    WebkitTextFillColor: "#000000",
                                    paddingTop: '14px', // Esto alinea el texto con el icono
                                },
                                "& textarea": {
                                    color: "#000000",
                                },
                                "& .MuiInputBase-input::placeholder": {
                                    color: "#000000",
                                    opacity: 0.6,
                                },
                            }}
                        ></TextField>
                    </Box>
                )}
            </Box>
            <Box sx={{ my: 0, width: "100%" }}>
                <Typography variant="body1" sx={{ color: "#000000"  }}>¿Tomás medicamentos?</Typography>
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
                    startAdornment={
                        <InputAdornment position="start">
                            <MedicationRoundedIcon fontSize="medium" sx={{ color: "#000000", mr: 1 }} />
                        </InputAdornment>
                    }
                    sx={{
                        backgroundColor: "#d7d6d6",
                        color: "#000000",
                        borderRadius: 3,
                        boxShadow: 3,
                        mb: 1,
                        // 1. Esto fuerza el borde a la raíz del Select cuando está enfocado
                        "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                            borderColor: "gray !important",
                            borderWidth: "2px !important",
                        },
                        // 2. Quitamos el borde por defecto y en hover
                        "& .MuiOutlinedInput-notchedOutline": {
                            borderColor: "transparent",
                        },
                        "&:hover .MuiOutlinedInput-notchedOutline": {
                            borderColor: "transparent",
                            borderWidth: "2px",
                        },
                        // Estilos del Input e Icono
                        "& .MuiInputBase-input": {
                            color: "#000000",
                            WebkitTextFillColor: "#000000",
                        },
                        "& .MuiSelect-icon": {
                            color: "#000000",
                        },
                        // Estilos del Label (opcional, para mantener el negro al enfocar)
                        "& .MuiInputLabel-root.Mui-focused": {
                            color: "#000000 !important",
                        },
                        // Corrección para el Start Adornment si fuera necesario
                        "& .MuiInputAdornment-root": {
                            color: "#000000",
                        }
                    }}
                >
                    <MenuItem value="seleccione" disabled>Seleccione</MenuItem>
                    <MenuItem value="si">Si</MenuItem>
                    <MenuItem value="no">No</MenuItem>
                </Select>
                {tomaMedicamentos === "si" && (
                    <Box sx={{ width: "100%" }}>
                        <Typography variant="body1" sx={{ color: "#000000"  }}>¿Cúal/es? Escribilos o decilos aquí abajo</Typography>
                        <TextField
                            error={errorTextFields}
                            placeholder="Escribilos o decilos aquí..."
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
                                "& .MuiInputBase-input::placeholder": {
                                    color: "#000000",
                                    opacity: 0.6,
                                },
                                "& .MuiFormHelperText-root": {
                                    color: "#000000",
                                    opacity: 0.8,
                                    fontWeight: 500,
                                },
                                "& .MuiOutlinedInput-root": {
                                    borderRadius: 3,
                                    alignItems: 'flex-start', // Alinea todo al techo
                                    paddingTop: 0,            // Quitamos el padding de MUI
                                    paddingLeft: 1.5,
                                    "& fieldset": { borderColor: "transparent" },
                                    "&:hover fieldset": { borderColor: "transparent" },
                                    "&.Mui-focused fieldset": { borderColor: "gray" },
                                },
                                "& .MuiInputBase-input": {
                                    color: "#000000",
                                    WebkitTextFillColor: "#000000",
                                    paddingTop: '14px', // Esto alinea el texto con el icono
                                },
                                "& textarea": {
                                    color: "#000000",
                                },
                                "& .MuiInputBase-input::placeholder": {
                                    color: "#000000",
                                    opacity: 0.6,
                                },
                            }}
                        ></TextField>
                    </Box>
                )}
            </Box>
            <Box sx={{ my: 0, width: "100%" }}>
                <Typography variant="body1" sx={{ color: "#000000"  }}>¿Sufrís de alergias?</Typography>
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
                    startAdornment={
                        <InputAdornment position="start">
                            <MasksRoundedIcon fontSize="medium" sx={{ color: "#000000", mr: 1 }} />
                        </InputAdornment>
                    }
                    sx={{
                        backgroundColor: "#d7d6d6",
                        color: "#000000",
                        borderRadius: 3,
                        boxShadow: 3,
                        mb: 1,
                        // 1. Esto fuerza el borde a la raíz del Select cuando está enfocado
                        "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                            borderColor: "gray !important",
                            borderWidth: "2px !important",
                        },
                        // 2. Quitamos el borde por defecto y en hover
                        "& .MuiOutlinedInput-notchedOutline": {
                            borderColor: "transparent",
                        },
                        "&:hover .MuiOutlinedInput-notchedOutline": {
                            borderColor: "transparent",
                            borderWidth: "2px",
                        },
                        // Estilos del Input e Icono
                        "& .MuiInputBase-input": {
                            color: "#000000",
                            WebkitTextFillColor: "#000000",
                        },
                        "& .MuiSelect-icon": {
                            color: "#000000",
                        },
                        // Estilos del Label (opcional, para mantener el negro al enfocar)
                        "& .MuiInputLabel-root.Mui-focused": {
                            color: "#000000 !important",
                        },
                        // Corrección para el Start Adornment si fuera necesario
                        "& .MuiInputAdornment-root": {
                            color: "#000000",
                        }
                    }}
                >
                    <MenuItem value="seleccione" disabled>Seleccione</MenuItem>
                    <MenuItem value="si">Si</MenuItem>
                    <MenuItem value="no">No</MenuItem>
                </Select>
                {tieneAlergias === "si" && (
                    <Box sx={{ width: "100%" }}>
                        <Typography variant="body1" sx={{ color: "#000000"  }}>¿Cúal/es? Escribilas o decilas aquí abajo</Typography>
                        <TextField
                            error={errorTextFields}
                            placeholder="Escribilas o decilas aquí..."
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
                                "& .MuiInputBase-input::placeholder": {
                                    color: "#000000",
                                    opacity: 0.6,
                                },
                                "& .MuiFormHelperText-root": {
                                    color: "#000000",
                                    opacity: 0.8,
                                    fontWeight: 500,
                                },
                                "& .MuiOutlinedInput-root": {
                                    borderRadius: 3,
                                    alignItems: 'flex-start', // Alinea todo al techo
                                    paddingTop: 0,            // Quitamos el padding de MUI
                                    paddingLeft: 1.5,
                                    "& fieldset": { borderColor: "transparent" },
                                    "&:hover fieldset": { borderColor: "transparent" },
                                    "&.Mui-focused fieldset": { borderColor: "gray" },
                                },
                                "& .MuiInputBase-input": {
                                    color: "#000000",
                                    WebkitTextFillColor: "#000000",
                                    paddingTop: '14px', // Esto alinea el texto con el icono
                                },
                                "& textarea": {
                                    color: "#000000",
                                },
                                "& .MuiInputBase-input::placeholder": {
                                    color: "#000000",
                                    opacity: 0.6,
                                },
                            }}
                        ></TextField>
                    </Box>
                )}
            </Box>
            <Box sx={{ my: 1, width: "100%" }}>
                <Typography variant="body1" sx={{ color: "#000000"  }}>¿Qué cosas te gustan hacer?</Typography>
                <TextField
                    placeholder="Escribilas..."
                    value={gustos}
                    onChange={(e) => setGustos(e.target.value)}
                    variant="outlined"
                    multiline
                    fullWidth
                    minRows={5}
                    margin="dense"
                    InputProps={{
                        startAdornment: (
                            <InputAdornment position="start" sx={{ alignSelf: 'flex-start', mt: 1.5, mr: 1 }}>
                                <FavoriteRoundedIcon sx={{ color: "#000000" }} />
                            </InputAdornment>
                        ),
                    }}
                    sx={{
                        backgroundColor: "#d7d6d6",
                        color: "#000000",
                        borderRadius: 3,
                        boxShadow: 3,
                        "& .MuiInputBase-input::placeholder": {
                            color: "#000000",
                            opacity: 0.6,
                        },
                        "& .MuiFormHelperText-root": {
                            color: "#000000",
                            opacity: 0.8,
                            fontWeight: 500,
                        },
                        "& .MuiOutlinedInput-root": {
                            borderRadius: 3,
                            alignItems: 'flex-start', // Alinea todo al techo
                            paddingTop: 0,            // Quitamos el padding de MUI
                            paddingLeft: 1.5,
                            "& fieldset": { borderColor: "transparent" },
                            "&:hover fieldset": { borderColor: "transparent" },
                            "&.Mui-focused fieldset": { borderColor: "gray" },
                        },
                        "& .MuiInputBase-input": {
                            color: "#000000",
                            WebkitTextFillColor: "#000000",
                            paddingTop: '14px', // Esto alinea el texto con el icono
                        },
                        "& textarea": {
                            color: "#000000",
                        },
                        "& .MuiInputBase-input::placeholder": {
                            color: "#000000",
                            opacity: 0.6,
                        },
                    }}
                ></TextField>
            </Box>
            <Box sx={{ my: 0, width: "100%" }}>
                <Typography variant="body1" sx={{ color: "#000000"  }}>¿Hay algo que no te guste o te moleste?</Typography>
                <TextField
                    placeholder="Escribilas..."
                    value={molestias}
                    onChange={(e) => setMolestias(e.target.value)}
                    variant="outlined"
                    multiline
                    minRows={5}
                    fullWidth
                    margin="dense"
                    InputProps={{
                        startAdornment: (
                            <InputAdornment position="start" sx={{ alignSelf: 'flex-start', mt: 1.5, mr: 1 }}>
                                <HeartBrokenRoundedIcon sx={{ color: "#000000" }} />
                            </InputAdornment>
                        ),
                    }}
                    sx={{
                        backgroundColor: "#d7d6d6",
                        color: "#000000",
                        borderRadius: 3,
                        boxShadow: 3,
                        "& .MuiFormHelperText-root": {
                            color: "#000000",
                            opacity: 0.8,
                            fontWeight: 500,
                        },
                        "& .MuiOutlinedInput-root": {
                            borderRadius: 3,
                            alignItems: 'flex-start', // Alinea todo al techo
                            paddingTop: 0,            // Quitamos el padding de MUI
                            paddingLeft: 1.5,
                            "& fieldset": { borderColor: "transparent" },
                            "&:hover fieldset": { borderColor: "transparent" },
                            "&.Mui-focused fieldset": { borderColor: "gray" },
                        },
                        "& .MuiInputBase-input": {
                            color: "#000000",
                            WebkitTextFillColor: "#000000",
                            paddingTop: '14px',
                        },
                        "& textarea": {
                            color: "#000000",
                        },
                        "& .MuiInputBase-input::placeholder": {
                            color: "#000000",
                            opacity: 0.6,
                        },
                    }}
                ></TextField>
            </Box>
        </>
    );
};

export default InfoElder;
