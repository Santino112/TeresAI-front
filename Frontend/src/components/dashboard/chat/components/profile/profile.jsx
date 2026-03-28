import { Typography, Button, TextField, Box, Paper, Divider, Select, MenuItem, Alert } from "@mui/material";
import { tomarDatosPerfiles, tomarDatosElder } from "../../exports/datosInicialesUsuarios";

const Profile = () => {



    return (

        <Box
            sx={{
                flexGrow: 1,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                width: "100%",
                overflowY: "auto",
                overflowX: "hidden",
                minHeight: 0,
            }}
        >
            <Box
                sx={{
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                    alignItems: "center",
                    flexGrow: 1,
                    width: "100%",
                    backgroundColor: "#2f342d",
                    p: 5
                }}
            >
                <Paper
                    component="form"
                    elevation={6}
                    sx={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        width: {
                            xs: "100%",
                            sm: "80%",
                            md: "50%",
                            lg: "40%",
                            xl: "50%",
                        },
                        p: { xs: 2, sm: 3, md: 3 },
                        borderRadius: 4,
                        bgcolor: "#626C66",
                        gap: 1,
                    }}
                >
                    <Typography variant="h2" sx={{
                        mt: 2,
                        fontSize: {
                            xs: "1.5rem",
                            sm: "1.5rem",
                            md: "1.7rem",
                            lg: "1.7rem",
                            xl: "2rem"
                        },
                        fontFamily: "'Lora', serif",
                        textAlign: "center"
                    }}>Perfil</Typography>
                    <Typography variant="body2" sx={{
                        
                        fontSize: {
                            xs: "1rem",
                            sm: "1rem",
                            md: "1.2rem",
                            lg: "1.3rem",
                            xl: "1.3rem",
                        },
                        fontFamily: "'Lora', serif",
                        textAlign: "center",
                        lineHeight: 1.8,
                    }}>Aquí podras actualizar toda la información de tu usuario
                    </Typography>
                    <Divider sx={{

                        width: "100%",
                        "&::before, &::after": {
                            borderColor: "#ffffff",
                        }
                    }}>
                        <Typography variant="body1" sx={{ color: "#ffffff" }}>~</Typography>
                    </Divider>
                    <Box sx={{ my: 0, width: "100%" }}>
                        <Typography variant="body1" sx={{ fontFamily: "'Lora', serif", }}>¿Cómo te llamas?</Typography>
                        <TextField
                            placeholder="Nombre completo"
                            variant="outlined"
                            fullWidth
                            margin="dense"
                            sx={{
                                backgroundColor: "#484848",
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
                    <Box sx={{ mb: 1, width: "100%" }}>
                        <Typography variant="body1" sx={{ fontFamily: "'Lora', serif", }}>¿Sufris de alguna enfermedad?</Typography>
                        <Select
                            labelId="demo-simple-select-helper-label"
                            id="demo-simple-select-helper"
                            fullWidth
                            MenuProps={{
                                PaperProps: {
                                    sx: {
                                        borderRadius: 3,
                                        backgroundColor: "#534d4d",
                                        color: "#E6E6E6",
                                    }
                                },
                                MenuListProps: { sx: { p: 0 } }
                            }} sx={{
                                backgroundColor: "#484848",
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
                    </Box>

                    <Box sx={{ my: 0, width: "100%" }}>
                        <Typography variant="body1" sx={{ fontFamily: "'Lora', serif", }}>¿Tomas medicamentos?</Typography>
                        <Select
                      
                            labelId="demo-simple-select-helper-label"
                            id="demo-simple-select-helper"
                        
                            fullWidth
                         
                            MenuProps={{
                                PaperProps: {
                                    sx: {
                                        borderRadius: 3,
                                        backgroundColor: "#534d4d",
                                        color: "#E6E6E6",
                                    }
                                },
                                MenuListProps: { sx: { p: 0 } }
                            }} sx={{
                                backgroundColor: "#484848",
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
                    </Box>

                    <Box sx={{ my: 0, width: "100%" }}>
                        <Typography variant="body1" sx={{ fontFamily: "'Lora', serif", }}>¿Sufris de alergias?</Typography>
                        <Select
                            labelId="demo-simple-select-helper-label"
                            id="demo-simple-select-helper"
                            fullWidth
        
                            MenuProps={{
                                PaperProps: {
                                    sx: {
                                        borderRadius: 3,
                                        backgroundColor: "#534d4d",
                                        color: "#E6E6E6",
                                    }
                                },
                                MenuListProps: { sx: { p: 0 } }
                            }} sx={{
                                backgroundColor: "#484848",
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

                    </Box>

                    <Box sx={{ my: 0, width: "100%" }}>
                        <Typography variant="body1" sx={{ fontFamily: "'Lora', serif", }}>¿Hay algo que no te guste o te moleste?</Typography>
                        <TextField
                            placeholder="Escribilas..."
                        
                            variant="outlined"
                            multiline
                            minRows={4}
                            maxRows={4}
                            fullWidth
                            margin="dense"
                            sx={{
                                backgroundColor: "#484848",
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

                    <Box sx={{ my: 1, width: "100%" }}>
                        <Typography variant="body1" sx={{ fontFamily: "'Lora', serif", }}>¿Qué cosas te gustan hacer?</Typography>
                        <TextField
                            placeholder="Escribilas..."
                        
                            variant="outlined"
                            multiline
                            fullWidth
                            minRows={4}
                            maxRows={4}
                            margin="dense"
                            sx={{
                                backgroundColor: "#484848",
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
                    <Box sx={{ width: "90%" }}>
                        <Button variant="contained" type="submit" fullWidth
                            sx={{
                                boxShadow: 3,
                                color: "#ffffff",
                                backgroundColor: "#0978a0",
                                fontFamily: "'Lora', serif",
                                fontWeight: "bold",
                                "&:hover": {
                                    backgroundColor: "#066688",
                                }
                            }}>Guardar
                        </Button>
                    </Box>
                </Paper>
            </Box>
        </Box>
    );
};

export default Profile;