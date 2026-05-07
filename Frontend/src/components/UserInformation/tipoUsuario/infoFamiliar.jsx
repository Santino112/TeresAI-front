import { Typography, TextField, Box, Select, MenuItem, FormHelperText } from "@mui/material";

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
                <Typography variant="body1" sx={{ fontFamily: "'Lora', serif" }}>Cual es el nombre de esa persona?</Typography>
                <TextField
                    error={errorTextFields}
                    placeholder="Nombre"
                    value={nombreFamiliar}
                    onChange={(e) => setNombreFamiliar(e.target.value)}
                    variant="outlined"
                    fullWidth
                    margin="dense"
                    sx={{
                        backgroundColor: "#d7d6d6",
                        color: "#000000",
                        borderRadius: 3,
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
                        "& .MuiFormHelperText-root": {
                            color: "#000000 !important",
                            opacity: 0.8,
                            fontWeight: 500,
                        },
                    }}
                ></TextField>
            </Box>
            <Box sx={{ my: 0, width: "100%" }}>
                <Typography variant="body1" sx={{ fontFamily: "'Lora', serif" }}>Cual es el email de esa persona?</Typography>
                <TextField
                    error={errorTextFields}
                    value={emailFamiliar}
                    onChange={(e) => setEmailFamiliar(e.target.value)}
                    placeholder="Email"
                    variant="outlined"
                    fullWidth
                    margin="dense"
                    sx={{
                        backgroundColor: "#d7d6d6",
                        color: "#000000",
                        borderRadius: 3,
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
                        "& .MuiFormHelperText-root": {
                            color: "#000000 !important",
                            opacity: 0.8,
                            fontWeight: 500,
                        },
                    }}
                ></TextField>
                <FormHelperText sx={{color: "#000000"}}>Usa el email con el que el se registro. De esta manera podremos conectarlos.</FormHelperText>
            </Box>
            <Box sx={{ my: 0, width: "100%" }}>
                <Typography variant="body1" sx={{ fontFamily: "'Lora', serif" }}>¿Cúal es tu número de teléfono?</Typography>
                <TextField
                    error={errorTextFields}
                    value={numeroTelefono}
                    onChange={(e) => setNumeroTelefono(e.target.value)}
                    placeholder="Ej: +5491122334455"
                    variant="outlined"
                    fullWidth
                    margin="dense"
                    sx={{
                        backgroundColor: "#d7d6d6",
                        color: "#000000",
                        borderRadius: 3,
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
                        "& .MuiFormHelperText-root": {
                            color: "#000000 !important",
                            opacity: 0.8,
                            fontWeight: 500,
                        },
                    }}
                ></TextField>
                <FormHelperText sx={{color: "#000000"}}>Este numero se usara para contactarte en emergencias.</FormHelperText>
            </Box>
            <Box sx={{ my: 0, width: "100%" }}>
                <Typography variant="body1" sx={{ fontFamily: "'Lora', serif" }}>Cual es tu relacion con esa persona?</Typography>
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
