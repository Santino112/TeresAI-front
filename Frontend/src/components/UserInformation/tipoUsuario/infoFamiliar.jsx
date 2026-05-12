import { Typography, Box, FormHelperText, InputAdornment, FormControl, FormLabel, RadioGroup, Radio, FormControlLabel } from "@mui/material";
import VoiceTextField from "../VoiceTextField.jsx";
import ElderlyRoundedIcon from '@mui/icons-material/ElderlyRounded';
import EmailRoundedIcon from '@mui/icons-material/EmailRounded';
import ContactPhoneRoundedIcon from '@mui/icons-material/ContactPhoneRounded';

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
                <VoiceTextField
                    error={errorTextFields}
                    placeholder="Nombre del adulto mayor"
                    value={nombreFamiliar}
                    onChange={(e) => setNombreFamiliar(e.target.value)}
                    fullWidth
                    type="text"
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
            <Box sx={{ my: 1, width: "100%" }}>
                <Typography variant="body1" sx={{ color: "#000000" }}>¿Cuál es el correo o teléfono de esa persona?</Typography>
                <VoiceTextField
                    error={errorTextFields}
                    value={emailFamiliar}
                    onChange={(e) => setEmailFamiliar(e.target.value)}
                    placeholder="Correo o teléfono del adulto mayor"
                    variant="outlined"
                    fullWidth
                    type="text"
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
                />
                <FormHelperText sx={{ color: "#000000" }}>Usa el correo o teléfono con el que él se registró. De esta manera podremos conectarlos a ambos.</FormHelperText>
            </Box>
            <Box sx={{ width: "100%" }}>
                <Typography variant="body1" sx={{ color: "#000000", width: "100%" }}>¿Cuál es tu número de teléfono?</Typography>
                <VoiceTextField
                    error={errorTextFields}
                    value={numeroTelefono}
                    onChange={(e) => setNumeroTelefono(e.target.value)}
                    placeholder="Ej: +5491122334455"
                    fullWidth
                    type="number"
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
                />
                <FormHelperText sx={{ color: "#000000" }}>Este número se usará para contactarte en caso de emergencias.</FormHelperText>
            </Box>
            <Box sx={{ width: "100%", display: "flex", flexDirection: "column", alignItems: "center" }}>
                <Typography variant="body1" sx={{ color: "#000000", mb: 1, width: "100%" }}>¿Cuál es tu relación con esa persona?</Typography>
                <FormControl
                    error={errorTextFields}
                    component="fieldset"
                    sx={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        width: "100%",
                        borderRadius: 3,
                        backgroundColor: "#d7d6d6",
                        boxShadow: 3,
                        overflow: "hidden"
                    }}
                >
                    <RadioGroup
                        value={tipoFamiliar}
                        onChange={(e) => setTipoFamiliar(e.target.value)}
                        sx={{
                            display: "grid",
                            gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" },
                            width: "100%",
                            flexWrap: "nowrap",
                            "& .MuiFormControlLabel-root": {
                                marginRight: 0,
                                marginLeft: 0,
                                borderRadius: 3,
                                py: 1,
                                flex: 1,
                                display: "flex",
                                justifyContent: "center",
                                border: "2px solid transparent",
                                transition: "all 0.3s ease",
                            },
                            "& .MuiFormControlLabel-root:has(.Mui-checked)": {
                                borderColor: "gray",
                                backgroundColor: "rgba(0,0,0,0.05)",
                            },
                            "& .MuiRadio-root": {
                                color: "#000000",
                                padding: "4px",
                            },
                            "& .MuiRadio-root.Mui-checked": {
                                color: "#000000 !important",
                            },
                            "& .MuiRadio-root:hover": {
                                backgroundColor: "rgba(0, 0, 0, 0.04)",
                            },
                            "& .MuiTypography-root": {
                                color: "#000000",
                                fontWeight: 500,
                                whiteSpace: "nowrap",
                            },
                        }}
                    >
                        <FormControlLabel value="hijo" control={<Radio />} label="Hijo/a" />
                        <FormControlLabel value="nieto" control={<Radio />} label="Nieto/a" />
                        <FormControlLabel value="sobrino" control={<Radio />} label="Sobrino/a" />
                        <FormControlLabel value="otro" control={<Radio />} label="Ninguno de los anteriores" />
                    </RadioGroup>
                </FormControl>
            </Box>
        </>
    );
};

export default InfoFamiliar;
