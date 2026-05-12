import { Typography, TextField, Box, Select, MenuItem, FormHelperText, InputAdornment } from "@mui/material";
import ElderlyRoundedIcon from '@mui/icons-material/ElderlyRounded';
import EmailRoundedIcon from '@mui/icons-material/EmailRounded';
import ContactPhoneRoundedIcon from '@mui/icons-material/ContactPhoneRounded';
import FamilyRestroomRoundedIcon from '@mui/icons-material/FamilyRestroomRounded';

const InfoFamiliar = ({
    nombreFamiliar,
    setNombreFamiliar,
    emailFamiliar,
    setEmailFamiliar,
    numeroTelefono,
    setNumeroTelefono,
    tipoFamiliar,
    setTipoFamiliar,
    errorTextFields
}) => {

    return (
        <>
            <Box sx={{ my: 0, width: "100%" }}>
                <Typography variant="body1" sx={{ color: "#000000" }}>¿Cuál es el nombre de esa persona?</Typography>
                <TextField
                    error={errorTextFields}
                    placeholder="Nombre del adulto mayor"
                    value={nombreFamiliar}
                    onChange={(e) => setNombreFamiliar(e.target.value)}
                    fullWidth
                    margin="dense"
                    InputProps={{
                        startAdornment: (
                            <InputAdornment position="start">
                                <Box sx={{ display: "flex", alignItems: "center", justifyContent: "flex-start", color: "#ffffff" }}>
                                    <ElderlyRoundedIcon fontSize='medium' sx={{ mr: 1, color: "#000000" }} />
                                </Box>
                            </InputAdornment>
                        ),
                    }}
                    sx={{
                        backgroundColor: "#d7d6d6",
                        borderRadius: 3,
                        boxShadow: 3,
                        input: { color: "#000000" },
                        "& .MuiInputLabel-root": {
                            color: "#000000",
                            opacity: 0.8
                        },
                        "& .MuiInputLabel-root.Mui-focused": {
                            color: "#000000 !important"
                        },
                        "& .MuiInputBase-input::placeholder": {
                            color: "#000000",
                            opacity: 0.6,
                        },
                        "& .MuiOutlinedInput-root": {
                            borderRadius: 3,
                            pr: 1,
                            "& fieldset": {
                                borderColor: "transparent"
                            },
                            "&:hover fieldset": {
                                borderColor: "transparent"
                            },
                            "&.Mui-focused fieldset": {
                                borderColor: "gray"
                            },
                        },
                    }}
                />
            </Box>
            <Box sx={{ my: 0, width: "100%" }}>
                <Typography variant="body1" sx={{ color: "#000000" }}>¿Cuál es el email de esa persona?</Typography>
                <TextField
                    error={errorTextFields}
                    value={emailFamiliar}
                    onChange={(e) => setEmailFamiliar(e.target.value)}
                    placeholder="Email del adulto mayor"
                    variant="outlined"
                    fullWidth
                    margin="dense"
                    InputProps={{
                        startAdornment: (
                            <InputAdornment position="start">
                                <Box sx={{ display: "flex", alignItems: "center", justifyContent: "flex-start", color: "#ffffff" }}>
                                    <EmailRoundedIcon fontSize='medium' sx={{ mr: 1, color: "#000000" }} />
                                </Box>
                            </InputAdornment>
                        ),
                    }}
                    sx={{
                        backgroundColor: "#d7d6d6",
                        borderRadius: 3,
                        boxShadow: 3,
                        input: { color: "#000000" },
                        "& .MuiInputLabel-root": {
                            color: "#000000",
                            opacity: 0.8
                        },
                        "& .MuiInputLabel-root.Mui-focused": {
                            color: "#000000 !important"
                        },
                        "& .MuiInputBase-input::placeholder": {
                            color: "#000000",
                            opacity: 0.6,
                        },
                        "& .MuiOutlinedInput-root": {
                            borderRadius: 3,
                            pr: 1,
                            "& fieldset": {
                                borderColor: "transparent"
                            },
                            "&:hover fieldset": {
                                borderColor: "transparent"
                            },
                            "&.Mui-focused fieldset": {
                                borderColor: "gray"
                            },
                        },
                    }}
                ></TextField>
                <FormHelperText sx={{ color: "#000000" }}>Usa el email con el que él se registró. De esta manera podremos conectarlos a ambos.</FormHelperText>
            </Box>
            <Box sx={{ my: 0, width: "100%" }}>
                <Typography variant="body1" sx={{ color: "#000000" }}>¿Cúal es tu número de teléfono?</Typography>
                <TextField
                    error={errorTextFields}
                    value={numeroTelefono}
                    onChange={(e) => setNumeroTelefono(e.target.value)}
                    placeholder="Ej: +5491122334455"
                    fullWidth
                    margin="dense"
                    InputProps={{
                        startAdornment: (
                            <InputAdornment position="start">
                                <Box sx={{ display: "flex", alignItems: "center", justifyContent: "flex-start", color: "#ffffff" }}>
                                    <ContactPhoneRoundedIcon fontSize='medium' sx={{ mr: 1, color: "#000000" }} />
                                </Box>
                            </InputAdornment>
                        ),
                    }}
                    sx={{
                        backgroundColor: "#d7d6d6",
                        borderRadius: 3,
                        boxShadow: 3,
                        input: { color: "#000000" },
                        "& .MuiInputLabel-root": {
                            color: "#000000",
                            opacity: 0.8
                        },
                        "& .MuiInputLabel-root.Mui-focused": {
                            color: "#000000 !important"
                        },
                        "& .MuiInputBase-input::placeholder": {
                            color: "#000000",
                            opacity: 0.6,
                        },
                        "& .MuiOutlinedInput-root": {
                            borderRadius: 3,
                            pr: 1,
                            "& fieldset": {
                                borderColor: "transparent"
                            },
                            "&:hover fieldset": {
                                borderColor: "transparent"
                            },
                            "&.Mui-focused fieldset": {
                                borderColor: "gray"
                            },
                        },
                    }}
                ></TextField>
                <FormHelperText sx={{ color: "#000000" }}>Este número se usará para contactarte en caso de emergencias.</FormHelperText>
            </Box>
            <Box sx={{ my: 0, width: "100%" }}>
                <Typography variant="body1" sx={{ color: "#000000" }}>¿Cuál es tu relación con esa persona?</Typography>
                <Select
                    error={errorTextFields}
                    labelId="demo-simple-select-helper-label"
                    id="demo-simple-select-helper"
                    value={tipoFamiliar}
                    fullWidth
                    onChange={(e) => setTipoFamiliar(e.target.value)}
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
                            <FamilyRestroomRoundedIcon fontSize="medium" sx={{ color: "#000000", mr: 1 }} />
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
                    <MenuItem value="hijo">Hijo/a</MenuItem>
                    <MenuItem value="nieto">Nieto/a</MenuItem>
                    <MenuItem value="sobrino">Sobrino/a</MenuItem>
                    <MenuItem value="otro">Ninguno de los anteriores</MenuItem>
                </Select>
            </Box>
        </>
    );
};

export default InfoFamiliar;
