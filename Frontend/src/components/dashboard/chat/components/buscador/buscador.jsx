import { useState } from 'react';
import { Typography, Button, TextField, Box, Paper, Menu, MenuItem, Divider, Skeleton, Input, InputAdornment } from "@mui/material";
import { deleteConversation } from '../../exports/eliminarConversacion.js';
import fondoChatAI from "../../../../../assets/images/fondoChatAI.png";
import MoreHorizRoundedIcon from "@mui/icons-material/MoreHorizRounded";
import AddRoundedIcon from '@mui/icons-material/AddRounded';
import StarRoundedIcon from "@mui/icons-material/StarRounded";
import IconButton from '@mui/material/IconButton';
import DeleteRoundedIcon from "@mui/icons-material/DeleteRounded";
import EditRoundedIcon from "@mui/icons-material/EditRounded";
import SearchRoundedIcon from '@mui/icons-material/SearchRounded';

const Buscador = ({ activeConversationId, setActiveConversationId, setPaginaActiva, conversations, setConversations, isLoading }) => {
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
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "flex-start",
                        width: "100%",
                        p: { xs: 2, sm: 2, md: 2 },
                        borderRadius: 3,
                        boxShadow: 0,
                        background: "transparent",
                        flexGrow: 0,
                        scrollbarWidth: 'thin',
                        scrollbarColor: '#8f8e8e transparent',
                        /* Chrome / Edge / Safari */
                        '&::-webkit-scrollbar': {
                            width: '6px',
                        },
                        '&::-webkit-scrollbar-track': {
                            background: 'transparent',
                        },
                        '&::-webkit-scrollbar-thumb': {
                            backgroundColor: '#8f8e8e',
                            borderRadius: '8px',
                        },
                        '&::-webkit-scrollbar-thumb:hover': {
                            backgroundColor: '#444',
                        },
                        animation: "slideDown 0.4s ease",
                        "@keyframes slideDown": {
                            from: {
                                opacity: 0,
                                transform: "translateY(-40px)"
                            },
                            to: {
                                opacity: 1,
                                transform: "translateY(0)"
                            }
                        }
                    }}
                >
                    <Typography variant="h3" sx={{
                        display: "flex",
                        justifyContent: { xs: "center", sm: "center", md: "flex-start" },
                        alignItems: "center",
                        color: "#000000",
                        fontSize: {
                            xs: "1.5rem",
                            sm: "1.5rem",
                            md: "1.5rem",
                            lg: "1.7rem",
                            xl: "1.8rem"
                        },
                        textAlign: { xs: "center", sm: "center", md: "start" },
                    }}>Buscador de chats <SearchRoundedIcon fontSize="medium" sx={{ color: "#000000", ml: 1 }} /></Typography>
                    <Typography variant="body2" sx={{
                        my: 1,
                        color: "#000000",
                        fontSize: {
                            xs: "1rem",
                            sm: "1rem",
                            md: "1.2rem",
                            lg: "1.3rem",
                            xl: "1.3rem",
                        },
                        textAlign: { xs: "center", sm: "center", md: "start" },
                        lineHeight: 1.8,
                    }}>Aquí podrás buscar entre tus conversaciones anteriores para encontrar información relevante,
                        continuar una conversación previa o simplemente inciar una nueva conversacioón.
                    </Typography>
                    <Divider sx={{ borderColor: "rgba(0,0,0,0.1)" }} />
                    <Box sx={{
                        display: "flex",
                        flexDirection: {
                            xs: "column",
                            sm: "column",
                            md: "row",
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
                                borderRadius: 3,
                                boxShadow: 3,
                                backgroundColor: "#7d745c",
                                color: "#ffffff",
                                textTransform: "none",
                                "&:hover": {
                                    backgroundColor: "#67604d"
                                },
                                fontSize: "1.1rem",
                                width: { xs: "100%", sm: "100%", md: "fit-content" },
                                minWidth: "auto",
                                whiteSpace: "nowrap",
                                px: 2,
                                color: "#ffffff",
                            }}><AddRoundedIcon sx={{ mr: 1 }} />Nueva conversación</Button>
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
                                            <SearchRoundedIcon sx={{ color: "#000000" }} />
                                        </InputAdornment>
                                    ),
                                },
                            }}
                            sx={{
                                flexGrow: 1,
                                borderRadius: 3,
                                backgroundColor: "#d7d6d6",
                                "& .MuiOutlinedInput-root": {
                                    borderRadius: 4,
                                    backgroundColor: "transparent",
                                },
                                "& .MuiInputBase-input": {
                                    color: "#000000",
                                    fontWeight: 500,
                                },
                                "& fieldset": { border: "none" },
                            }}
                        />
                    </Box>
                    <Box sx={{
                        maxHeight: "500px", minHeight: "500px", backgroundColor: "#d7d6d6", p: 1, overflowY: "auto", borderRadius: 3, animation: "slideDown 0.4s ease",
                        "@keyframes slideDown": {
                            from: {
                                opacity: 0,
                                transform: "translateY(-40px)"
                            },
                            to: {
                                opacity: 1,
                                transform: "translateY(0)"
                            }
                        }
                    }}>
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
                                color: "#000000",
                                mt: 4,
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
                                                backgroundColor: isActive ? "#c1c1c1" : "transparent",
                                                color: "#000000",
                                                mb: 1,
                                                borderRadius: 3,
                                                fontSize: "1rem",
                                                textTransform: 'none',
                                                fontWeight: isActive ? 600 : 400,
                                                "&:hover": {
                                                    backgroundColor: "#c1c1c1",
                                                    color: "#000000"
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
                                                sx={{ ml: "auto", color: "#000000", "&:hover": { color: "#fff" } }}
                                            >
                                                <MoreHorizRoundedIcon fontSize="small" />
                                            </IconButton>
                                        </Button>
                                        <Menu
                                            anchorEl={menuAnchor}
                                            open={Boolean(menuAnchor) && menuConvId === conv.id}
                                            anchorOrigin={{
                                                vertical: 'bottom',
                                                horizontal: 'right',
                                            }}
                                            transformOrigin={{
                                                vertical: 'top',
                                                horizontal: 'right',
                                            }}
                                            onClose={handleMenuClose}
                                            MenuListProps={{
                                                sx: {
                                                    p: 0,
                                                    fontSize: "21px",
                                                    backgroundColor: "#eeeeee",
                                                    color: "#000000",
                                                    borderRadius: 3
                                                }
                                            }}
                                            PaperProps={{
                                                sx: { backgroundColor: "#000000", color: "#ffffff", minWidth: "160px", p: 0, borderRadius: 3 }
                                            }}
                                        >
                                            <MenuItem onClick={(e) => { e.stopPropagation(); handleMenuClose(); }} sx={{ borderRadius: 3, color: "#000000", "&:hover": { backgroundColor: "#e1e1e1" } }}>
                                                <StarRoundedIcon fontSize="small" sx={{ mr: 1 }} /> Favorito
                                            </MenuItem>
                                            <MenuItem onClick={(e) => { e.stopPropagation(); handleMenuClose(); }} sx={{ borderRadius: 3, color: "#000000", "&:hover": { backgroundColor: "#e1e1e1" } }}>
                                                <EditRoundedIcon fontSize="small" sx={{ mr: 1 }} /> Renombrar
                                            </MenuItem>
                                            <Divider sx={{
                                                width: "100%",
                                                color: "#000000",
                                                backgroundColor: "#9f9e9e",
                                                "&::before, &::after": {
                                                    borderColor: "#000000",
                                                },
                                                m: 0,
                                                p: 0
                                            }}></Divider>
                                            <MenuItem onClick={(e) => { e.stopPropagation(); handleDelete(); handleMenuClose(); }}
                                                sx={{
                                                    color: "#000000",
                                                    borderRadius: 3,
                                                    "&:hover": {
                                                        color: "#ff6b6b",
                                                    }
                                                }}
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
