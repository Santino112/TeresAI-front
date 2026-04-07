import { useState, useEffect } from 'react';
import { useAuth } from '../../../../auth/AuthContext.jsx';
import { Typography, Button, TextField, Box, Paper, Menu, MenuItem, Divider, Skeleton, Input, InputAdornment } from "@mui/material";
import { deleteConversation } from '../../exports/eliminarConversacion.js';
import fondoChatAI from "../../../../../assets/images/fondoChatAI.png";
import MoreHorizRoundedIcon from "@mui/icons-material/MoreHorizRounded";
import AddRoundedIcon from '@mui/icons-material/AddRounded';
import SearchRoundedIcon from '@mui/icons-material/SearchRounded';
import StarRoundedIcon from "@mui/icons-material/StarRounded";
import IconButton from '@mui/material/IconButton';
import DeleteRoundedIcon from "@mui/icons-material/DeleteRounded";
import EditRoundedIcon from "@mui/icons-material/EditRounded";

const Buscador = ({ activeConversationId, setActiveConversationId, setPaginaActiva, conversations, setConversations, isLoading, setLoading }) => {
    const [menuAnchor, setMenuAnchor] = useState(null);
    const [menuConvId, setMenuConvId] = useState(null);
    const [busqueda, setBusqueda] = useState("");

    const conversacionesFiltradas = conversations.filter(conv =>
        conv.title.toLowerCase().includes(busqueda.toLowerCase())
    );

    const handleMenuOpen = (e, convId) => {
        e.stopPropagation();
        setMenuAnchor(e.currentTarget);
        setMenuConvId(convId);
    };

    const handleMenuClose = () => {
        setMenuAnchor(null);
        setMenuConvId(null);
    };

    const handleDelete = async () => {
        const success = await deleteConversation(menuConvId);
        if (success) {
            setConversations(prev => prev.filter(c => c.id !== activeConversationId));
            if (activeConversationId === menuConvId) setActiveConversationId(null);
        }
    };

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
                    background: `url(${fondoChatAI})`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                    backgroundRepeat: "no-repeat",
                    p: 2
                }}
            >
                <Paper
                    name="form-familiar"
                    sx={{
                        width: {
                            xs: "100%",
                            sm: "80%",
                            md: "70%",
                            lg: "75%",
                            xl: "70%",
                        },
                        p: { xs: 2, sm: 3, md: 3 },
                        borderRadius: 4,
                        background: "transparent",
                        flexGrow: 0,
                        scrollbarWidth: 'thin',
                        scrollbarColor: '#404040 transparent',

                        /* Chrome / Edge / Safari */
                        '&::-webkit-scrollbar': {
                            width: '6px',
                        },
                        '&::-webkit-scrollbar-track': {
                            background: 'transparent',
                        },
                        '&::-webkit-scrollbar-thumb': {
                            backgroundColor: '#2f2f2f',
                            borderRadius: '8px',
                        },
                        '&::-webkit-scrollbar-thumb:hover': {
                            backgroundColor: '#444',
                        },
                    }}
                >
                    <Typography variant="h2" sx={{
                        fontSize: {
                            xs: "1.5rem",
                            sm: "1.5rem",
                            md: "1.5rem",
                            lg: "1.7rem",
                            xl: "1.8rem"
                        },
                        fontFamily: "'Lora', serif",
                        textAlign: "center"
                    }}>Buscador de chats</Typography>
                    <Typography variant="body2" sx={{
                        my: 2,
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
                    }}>Aquí podrás buscar entre tus conversaciones anteriores para encontrar información relevante,
                        continuar una conversación previa o simplemente inciar una nueva conversacioón.
                    </Typography>
                    <Divider sx={{
                        my: 1,
                        width: "100%",
                        "&::before, &::after": {
                            borderColor: "#ffffff",
                        }
                    }}>
                        <Typography variant="body1" sx={{ color: "#ffffff" }}>~</Typography>
                    </Divider>
                    <Box sx={{
                        display: "flex",
                        flexDirection: {
                            xs: "column",
                            sm: "column",
                            md: "column",
                            lg: "row",
                            xl: "row"
                        },
                        alignItems: "stretch",
                        gap: 2,
                        width: "100%",
                        borderRadius: 4,
                        mt: 2,
                        mb: 2,
                    }}>
                        <Button variant="contained" onClick={() => {
                            setActiveConversationId(null);
                            setPaginaActiva("chat");
                        }}
                            sx={{
                                backgroundColor: "#303030",
                                borderRadius: 3,
                                fontSize: "0.9rem",
                                width: {
                                    xs: "100%",
                                    sm: "100%",
                                    md: "100%",
                                    lg: "35%",
                                    xl: "25%"
                                },
                                color: "#ffffff",
                                "&:hover": {
                                    backgroundColor: "#2b2b2b"
                                }
                            }}><AddRoundedIcon sx={{ mr: 1 }} />Nuevo chat</Button>
                        <TextField
                            value={busqueda}
                            onChange={(e) => setBusqueda(e.target.value)}
                            placeholder="Escribe el nombre de la conversación..."
                            fullWidth
                            variant="outlined"
                            slotProps={{
                                input: {
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <SearchRoundedIcon/>
                                        </InputAdornment>
                                    ),
                                },
                            }}
                            sx={{
                                flexGrow: 1,
                                borderRadius: 3,
                                backgroundColor: "#303030",
                                "& .MuiOutlinedInput-root": {
                                    borderRadius: 4,
                                    backgroundColor: "transparent",
                                },
                                "& .MuiInputBase-input": {
                                    color: "#ffffff",
                                    fontWeight: 500,
                                },
                                "& fieldset": { border: "none" },
                            }}
                        />
                    </Box>
                    <Box sx={{ maxHeight: "500px", minHeight: "500px", backgroundColor: "#303030", p: 1, overflowY: "auto", maxHeight: "500px", borderRadius: 3 }}>
                        {isLoading ? (
                            <>
                                <Skeleton animation="wave" variant="rectangular" height={40} sx={{ borderRadius: 2, mb: 1, bgcolor: "#4a4a4a" }} />
                                <Skeleton animation="wave" variant="rectangular" height={40} sx={{ borderRadius: 2, mb: 1, bgcolor: "#4a4a4a" }} />
                                <Skeleton animation="wave" variant="rectangular" height={40} sx={{ borderRadius: 2, mb: 1, bgcolor: "#4a4a4a" }} />
                                <Skeleton animation="wave" variant="rectangular" height={40} sx={{ borderRadius: 2, mb: 1, bgcolor: "#4a4a4a" }} />
                                <Skeleton animation="wave" variant="rectangular" height={40} sx={{ borderRadius: 2, mb: 1, bgcolor: "#4a4a4a" }} />
                                <Skeleton animation="wave" variant="rectangular" height={40} sx={{ borderRadius: 2, mb: 1, bgcolor: "#4a4a4a" }} />
                                <Skeleton animation="wave" variant="rectangular" height={40} sx={{ borderRadius: 2, mb: 1, bgcolor: "#4a4a4a" }} />
                                <Skeleton animation="wave" variant="rectangular" height={40} sx={{ borderRadius: 2, mb: 1, bgcolor: "#4a4a4a" }} />
                                <Skeleton animation="wave" variant="rectangular" height={40} sx={{ borderRadius: 2, mb: 1, bgcolor: "#4a4a4a" }} />
                                <Skeleton animation="wave" variant="rectangular" height={40} sx={{ borderRadius: 2, mb: 1, bgcolor: "#4a4a4a" }} />
                            </>
                        ) : conversacionesFiltradas.length === 0 ? (
                            <Typography sx={{
                                textAlign: "center",
                                color: "#ffffff",
                                mt: 4,
                                fontFamily: "'Lora', serif"
                            }}>
                                No se encontraron conversaciones
                            </Typography>
                        ) : (
                            conversacionesFiltradas.map(conv => {
                                const isActive = conv.id === activeConversationId;
                                return (
                                    <>
                                        <Button
                                            key={conv.id}
                                            fullWidth
                                            onClick={() => {
                                                setActiveConversationId(conv.id);
                                                setPaginaActiva("chat");
                                            }}
                                            sx={{
                                                backgroundColor: isActive ? "#444444" : "transparent",
                                                color: "#E6E6E6",
                                                mb: 1,
                                                borderRadius: 3,
                                                fontSize: "1rem",
                                                textTransform: 'none',
                                                fontWeight: isActive ? 600 : 400,
                                                "&:hover": {
                                                    backgroundColor: "#2b2b2b",
                                                }
                                            }}
                                        >
                                            {conv.title}
                                            <IconButton
                                                size="small"
                                                onClick={(e) => {
                                                    handleMenuOpen(e, conv.id);
                                                    e.stopPropagation();
                                                }}
                                                sx={{ ml: "auto", color: "#ffffff", "&:hover": { color: "#fff" } }}
                                            >
                                                <MoreHorizRoundedIcon fontSize="small" />
                                            </IconButton>
                                        </Button>
                                        <Menu
                                            anchorEl={menuAnchor}
                                            open={Boolean(menuAnchor) && menuConvId === conv.id}
                                            onClose={handleMenuClose}
                                            MenuListProps={{
                                                sx: {
                                                    p: 0,
                                                    fontSize: "21px",
                                                    backgroundColor: "#303030",
                                                    color: "#ffffff",
                                                    borderRadius: 3
                                                }
                                            }}
                                            PaperProps={{
                                                sx: { backgroundColor: "#303030", color: "#E6E6E6", minWidth: "160px", p: 0, borderRadius: 3 }
                                            }}
                                        >
                                            <MenuItem onClick={(e) => { e.stopPropagation(); handleMenuClose(); }}>
                                                <StarRoundedIcon fontSize="small" sx={{ mr: 1 }} /> Favorito
                                            </MenuItem>
                                            <MenuItem onClick={(e) => { e.stopPropagation(); handleMenuClose(); }}>
                                                <EditRoundedIcon fontSize="small" sx={{ mr: 1 }} /> Renombrar
                                            </MenuItem>
                                            <MenuItem onClick={(e) => { e.stopPropagation(); handleDelete(); handleMenuClose(); }}
                                                sx={{ color: "#ff6b6b" }}
                                            >
                                                <DeleteRoundedIcon fontSize="small" sx={{ mr: 1 }} /> Eliminar
                                            </MenuItem>
                                        </Menu>
                                    </>
                                );
                            })
                        )}
                    </Box>
                </Paper>
            </Box>
        </Box>
    );
};

export default Buscador;