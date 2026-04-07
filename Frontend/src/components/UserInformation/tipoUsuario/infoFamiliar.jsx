import { Typography, Button, TextField, Box, Select, MenuItem, FormHelperText, Divider, Paper, Alert, Checkbox, FormControlLabel } from "@mui/material";

const InfoFamiliar = (
    {
        nombreFamiliar,
        setNombreFamiliar,
        tipoFamiliar,
        setTipoFamiliar,
        errorTextFields,
        setErrorTextFields
    }
) => {

    return (
        <>
            <Box sx={{ my: 0, width: "100%" }}>
                <Typography variant="body1" sx={{ fontFamily: "'Lora', serif", }}>¿A que familiar cuidas?</Typography>
                <TextField
                    error={errorTextFields}
                    placeholder="Nombre"
                    value={nombreFamiliar}
                    onChange={(e) => setNombreFamiliar(e.target.value)}
                    variant="outlined"
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
            <Box sx={{ my: 0, width: "100%" }}>
                <Typography variant="body1" sx={{ fontFamily: "'Lora', serif", }}>¿Cual es tu relación con esa persona?</Typography>
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
                    <MenuItem value="hijo">Hijo</MenuItem>
                    <MenuItem value="nieto">Nieto</MenuItem>
                    <MenuItem value="sobrino">Sobrino</MenuItem>
                    <MenuItem value="otro">Ninguno de los anteriores</MenuItem>
                </Select>
            </Box>
        </>
    );
};

export default InfoFamiliar;