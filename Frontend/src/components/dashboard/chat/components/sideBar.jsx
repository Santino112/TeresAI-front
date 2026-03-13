import * as React from 'react';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getConversations } from '../exports/conversaciones.js';
import { deleteConversation } from '../exports/eliminarConversacion.js';
import Chat from './chat.jsx';
import Games from './games.jsx';
import Calendar from './calendar.jsx';
import ShoppingList from './shoppinglist.jsx';
import MenuUsuario from './menu.jsx';
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import CssBaseline from '@mui/material/CssBaseline';
import Divider from '@mui/material/Divider';
import Drawer from '@mui/material/Drawer';
import IconButton from '@mui/material/IconButton';
import List from '@mui/material/List';
import MenuIcon from '@mui/icons-material/Menu';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import SmartToyRoundedIcon from '@mui/icons-material/SmartToyRounded';
import DrawRoundedIcon from '@mui/icons-material/DrawRounded';
import SearchRoundedIcon from '@mui/icons-material/SearchRounded';
import GamesRoundedIcon from '@mui/icons-material/GamesRounded';
import CalendarMonthRoundedIcon from '@mui/icons-material/CalendarMonthRounded';
import CircularProgress from '@mui/material/CircularProgress';
import MoreHorizRoundedIcon from "@mui/icons-material/MoreHorizRounded";
import DeleteRoundedIcon from "@mui/icons-material/DeleteRounded";
import EditRoundedIcon from "@mui/icons-material/EditRounded";
import StarRoundedIcon from "@mui/icons-material/StarRounded";
import ShoppingCartRoundedIcon from '@mui/icons-material/ShoppingCartRounded';
import { useAuth } from '../../../auth/AuthContext';

const drawerWidth = 290;

function ResponsiveDrawer(props) {
    const navigate = useNavigate();
    const { window } = props;
    const [mobileOpen, setMobileOpen] = React.useState(false);
    const [isClosing, setIsClosing] = React.useState(false);
    const [conversations, setConversations] = useState([]);
    const [activeConversationId, setActiveConversationId] = useState(null);
    const [paginaActiva, setPaginaActiva] = useState("chat");
    const [isLoading, setLoading] = useState(true);
    const [menuAnchor, setMenuAnchor] = useState(null);
    const [menuConvId, setMenuConvId] = useState(null);
    const { user, loading: authLoading } = useAuth();

    const addConversation = (newConversation) => {
        setConversations(prev => [newConversation, ...prev]);
    };

    const handleDrawerClose = () => {
        setIsClosing(true);
        setMobileOpen(false);
    };

    const handleDrawerTransitionEnd = () => {
        setIsClosing(false);
    };

    const handleDrawerToggle = () => {
        if (!isClosing) {
            setMobileOpen(!mobileOpen);
        }
    };

    const fetchData = async () => {
        setLoading(true);
        const data = await getConversations();
        setConversations(data);
        setLoading(false);
    }

    useEffect(() => {
        console.log("ResponsiveDrawer mounted or deps changed");
        if (authLoading) return;

        if (!user) {
            navigate('/');
            return;
        };

        fetchData();
    }, [user, authLoading]);

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

    const drawer = (
        <Box sx={{
            display: 'flex',
            flexDirection: 'column',
            height: '100dvh'
        }}>
            <Toolbar sx={{
                display: 'flex',
                justifyContent: 'flex-start',
                flexShrink: 0,
                backgroundColor: "#313630",
            }}>
                <Typography variant="h6" noWrap component="div">
                    <SmartToyRoundedIcon fontSize='large' sx={{ verticalAlign: "bottom", mr: 1 }}/> TeresAI
                </Typography>
            </Toolbar>
            <Box sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'flex-start',
                p: 1,
                flexShrink: 0,
                backgroundColor: "#313630",
            }}>
                <Button onClick={() => {
                    setActiveConversationId(null);
                    setPaginaActiva("chat");
                }}
                    sx={{
                        mt: 1,
                        mb: 1,
                        backgroundColor: "transparent",
                        color: "#E6E6E6",
                        "&:hover": {
                            backgroundColor: "#3f4440"
                        }
                    }}><DrawRoundedIcon sx={{ mr: 1 }} />Nuevo chat</Button>
                <Button sx={{
                    mb: 1,
                    backgroundColor: "transparent",
                    color: "#E6E6E6",
                    "&:hover": {
                        backgroundColor: "#3f4440"
                    }
                }}><SearchRoundedIcon sx={{ mr: 1 }} />Buscar chats</Button>
                <Button onClick={() => {
                    setPaginaActiva("juegos");
                }} sx={{
                    mb: 1,
                    backgroundColor: "transparent",
                    color: "#E6E6E6",
                    "&:hover": {
                        backgroundColor: "#3f4440"
                    }
                }}><GamesRoundedIcon sx={{ mr: 1 }} />Juegos</Button>
                <Button onClick={() => {
                    setPaginaActiva("calendario");
                }} sx={{
                    mb: 1,
                    backgroundColor: "transparent",
                    color: "#E6E6E6",
                    "&:hover": {
                        backgroundColor: "#3f4440"
                    }
                }}><CalendarMonthRoundedIcon sx={{ mr: 1 }} />Calendario</Button>
                <Button
                    onClick={() => {
                        setPaginaActiva("shopping");
                    }}
                    sx={{
                        mb: 1,
                        backgroundColor: "transparent",
                        color: "#E6E6E6",
                        "&:hover": {
                        backgroundColor: "#3f4440"
                        }
                    }}
                >
                    <ShoppingCartRoundedIcon sx={{ mr: 1 }} /> Lista de compras
                </Button>
            </Box>
            <Divider />
            <Box sx={{
                flexGrow: 1,
                overflowY: "auto",
                overflowX: "hidden",
                minHeight: 0,
                p: 1,
                width: '100%',
                backgroundColor: "#262a25",
                borderRight: "1px solid #2f332f",
                /* Firefox */
                scrollbarWidth: 'thin',
                scrollbarColor: '#666 transparent',

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
            }}>
                {isLoading ? (
                    <Box sx={{ display: 'flex', justifyContent: "center", mt: 2 }}>
                        <CircularProgress color="inherit" />
                    </Box>
                ) : (
                    Array.isArray(conversations) && conversations.map(conv => {
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
                                        backgroundColor: isActive ? "#353A36" : "transparent",
                                        color: "#E6E6E6",
                                        mb: 1,
                                        borderRadius: 2,
                                        textTransform: 'none',
                                        fontWeight: isActive ? 600 : 400,
                                        "&:hover": {
                                            backgroundColor: "#353A36",
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
                                            p: 0
                                        }
                                    }}
                                    PaperProps={{
                                        sx: { backgroundColor: "#353A36", color: "#E6E6E6", minWidth: "160px", p: 0}
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
            <Divider />
            <Box>
                <MenuUsuario />
            </Box>
        </Box >
    );

    const container = window !== undefined ? () => window().document.body : undefined;

    return (
        <Box sx={{ display: 'flex' }}>
            <CssBaseline />
            <AppBar
                position="fixed"
                sx={{
                    width: { sm: `calc(100% - ${drawerWidth}px)` },
                    ml: { sm: `${drawerWidth}px` },
                    backgroundColor: "#262a25"
                }}
            >
                <Toolbar sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                }}>
                    <IconButton
                        color="inherit"
                        aria-label="open drawer"
                        edge="start"
                        onClick={handleDrawerToggle}
                        sx={{ mr: 2, display: { sm: 'none' } }}
                    >
                        <MenuIcon />
                    </IconButton>
                </Toolbar>
            </AppBar>
            <Box
                component="nav"
                sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
                aria-label="mailbox folders"
            >
                <Drawer
                    container={container}
                    variant="temporary"
                    open={mobileOpen}
                    onTransitionEnd={handleDrawerTransitionEnd}
                    onClose={handleDrawerClose}
                    sx={{
                        display: { xs: 'block', sm: 'none' },
                        '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
                    }}
                    slotProps={{
                        root: {
                            keepMounted: true,
                        },
                    }}
                >
                    {drawer}
                </Drawer>
                <Drawer
                    variant="permanent"
                    sx={{
                        display: { xs: 'none', sm: 'block' },
                        '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
                    }}
                    open
                >
                    {drawer}
                </Drawer>
            </Box>
            <Box
                component="main"
                sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    height: '100dvh',
                    width: '100%',
                    minWidth: 0,
                    overflowY: 'hidden',
                    scrollbarWidth: 'none',
                    scrollbarColor: '#666 transparent',

                    /* Chrome / Edge / Safari */
                    '&::-webkit-scrollbar': {
                        display: 'none'
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
                <Toolbar />
                
                <Box sx={{ flexGrow: 1, minHeight: 0, display: "flex" }}>
                    {paginaActiva === "juegos" ? (
                        <Games />
                    ) : paginaActiva === "calendario" ? (
                        <Calendar />
                    ) : paginaActiva === "shopping" ? (
                        <ShoppingList />
                    ) : (
                        <Chat
                            activeConversationId={activeConversationId}
                            setActiveConversationId={setActiveConversationId}
                            addConversation={addConversation}
                        />
                    )}
                </Box>
            </Box>
        </Box>
    );
}

export default ResponsiveDrawer;