import { Typography, Box, FormControlLabel, InputAdornment, FormControl, FormLabel, RadioGroup, Radio } from "@mui/material";
import VoiceTextField from "../VoiceTextField.jsx";
import SickRoundedIcon from '@mui/icons-material/SickRounded';
import MedicationRoundedIcon from '@mui/icons-material/MedicationRounded';
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
                <FormControl
                    error={errorTextFields}
                    component="fieldset"
                    sx={{
                        width: "100%",
                        mt: 1,
                        p: 1.5,
                        borderRadius: 3,
                        backgroundColor: "#d7d6d6",
                        boxShadow: 3,
                    }}
                >
                    <RadioGroup
                        value={tieneEnfermedad}
                        onChange={(e) => {
                            setTieneEnfermedad(e.target.value);
                            e.target.value === "si" ? setEnfermedad("") : setEnfermedad("No");
                        }}
                        row
                        sx={{
                            gap: 1,
                            "& .MuiFormControlLabel-root": {
                                marginRight: 0,
                                borderRadius: 3,
                                px: 1.2,
                                py: 0.5,
                                flex: 1,
                                border: "1px solid transparent",
                            },
                            "& .MuiFormControlLabel-root.Mui-checked": {
                                borderColor: "gray",
                            },
                            "& .MuiRadio-root": {
                                color: "#000000",
                            },
                            "& .MuiTypography-root": {
                                color: "#000000",
                                fontWeight: 500,
                            },
                        }}
                    >
                        <FormControlLabel value="si" control={<Radio />} label="Si" />
                        <FormControlLabel value="no" control={<Radio />} label="No" />
                    </RadioGroup>
                </FormControl>
                {tieneEnfermedad === "si" && (
                    <Box sx={{ width: "100%" }}>
                        <Typography variant="body1" sx={{ color: "#000000"  }}>¿Cuál/es? Escribilas o decilas aquí abajo</Typography>
                        <VoiceTextField
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
                        />
                    </Box>
                )}
            </Box>
            <Box sx={{ my: 0, width: "100%" }}>
                <Typography variant="body1" sx={{ color: "#000000"  }}>¿Tomás medicamentos?</Typography>
                <FormControl
                    error={errorTextFields}
                    component="fieldset"
                    sx={{
                        width: "100%",
                        mt: 1,
                        p: 1.5,
                        borderRadius: 3,
                        backgroundColor: "#d7d6d6",
                        boxShadow: 3,
                    }}
                >
                    <RadioGroup
                        value={tomaMedicamentos}
                        onChange={(e) => {
                            setTomaMedicamentos(e.target.value);
                            e.target.value === "si" ? setMedicamentos("") : setMedicamentos("No");
                        }}
                        row
                        sx={{
                            gap: 1,
                            "& .MuiFormControlLabel-root": {
                                marginRight: 0,
                                borderRadius: 3,
                                px: 1.2,
                                py: 0.5,
                                flex: 1,
                                border: "1px solid transparent",
                            },
                            "& .MuiFormControlLabel-root.Mui-checked": {
                                borderColor: "gray",
                            },
                            "& .MuiRadio-root": {
                                color: "#000000",
                            },
                            "& .MuiTypography-root": {
                                color: "#000000",
                                fontWeight: 500,
                            },
                        }}
                    >
                        <FormControlLabel value="si" control={<Radio />} label="Si" />
                        <FormControlLabel value="no" control={<Radio />} label="No" />
                    </RadioGroup>
                </FormControl>
                {tomaMedicamentos === "si" && (
                    <Box sx={{ width: "100%" }}>
                        <Typography variant="body1" sx={{ color: "#000000"  }}>¿Cuál/es? Escribilos o decilos aquí abajo</Typography>
                        <VoiceTextField
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
                        />
                    </Box>
                )}
            </Box>
            <Box sx={{ my: 0, width: "100%" }}>
                <Typography variant="body1" sx={{ color: "#000000"  }}>¿Sufrís de alergias?</Typography>
                <FormControl
                    error={errorTextFields}
                    component="fieldset"
                    sx={{
                        width: "100%",
                        mt: 1,
                        p: 1.5,
                        borderRadius: 3,
                        backgroundColor: "#d7d6d6",
                        boxShadow: 3,
                    }}
                >
                    <RadioGroup
                        value={tieneAlergias}
                        onChange={(e) => {
                            setTieneAlergias(e.target.value)
                            e.target.value === "si" ? setAlergias("") : setAlergias("No")
                        }}
                        row
                        sx={{
                            gap: 1,
                            "& .MuiFormControlLabel-root": {
                                marginRight: 0,
                                borderRadius: 3,
                                px: 1.2,
                                py: 0.5,
                                flex: 1,
                                border: "1px solid transparent",
                            },
                            "& .MuiFormControlLabel-root.Mui-checked": {
                                borderColor: "gray",
                            },
                            "& .MuiRadio-root": {
                                color: "#000000",
                            },
                            "& .MuiTypography-root": {
                                color: "#000000",
                                fontWeight: 500,
                            },
                        }}
                    >
                        <FormControlLabel value="si" control={<Radio />} label="Si" />
                        <FormControlLabel value="no" control={<Radio />} label="No" />
                    </RadioGroup>
                </FormControl>
                {tieneAlergias === "si" && (
                    <Box sx={{ width: "100%" }}>
                        <Typography variant="body1" sx={{ color: "#000000"  }}>¿Cuál/es? Escribilas o decilas aquí abajo</Typography>
                        <VoiceTextField
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
                        />
                    </Box>
                )}
            </Box>
            <Box sx={{ my: 1, width: "100%" }}>
                <Typography variant="body1" sx={{ color: "#000000"  }}>¿Qué cosas te gustan hacer?</Typography>
                <VoiceTextField
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
                />
            </Box>
            <Box sx={{ my: 0, width: "100%" }}>
                <Typography variant="body1" sx={{ color: "#000000"  }}>¿Hay algo que no te guste o te moleste?</Typography>
                <VoiceTextField
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
                />
            </Box>
        </>
    );
};

export default InfoElder;
