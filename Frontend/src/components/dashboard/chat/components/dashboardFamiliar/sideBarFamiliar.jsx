import * as React from 'react';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import MenuUsuario from './Menu.jsx';
import Inicio from "./inicio.jsx";
import Chat from "./chatIA/Chat.jsx";
import Perfil from '../profile/Profile.jsx';
import Calendar from "../calendar/Calendar.jsx";
import Familiar from './familiar/Familiar.jsx';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import CssBaseline from '@mui/material/CssBaseline';
import Divider from '@mui/material/Divider';
import Drawer from '@mui/material/Drawer';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import SmartToyRoundedIcon from '@mui/icons-material/SmartToyRounded';
import HomeRoundedIcon from '@mui/icons-material/HomeRounded';
import QuestionAnswerRoundedIcon from '@mui/icons-material/QuestionAnswerRounded';
import ElderlyRoundedIcon from '@mui/icons-material/ElderlyRounded';
import DrawRoundedIcon from '@mui/icons-material/DrawRounded';
import SearchRoundedIcon from '@mui/icons-material/SearchRounded';
import GamesRoundedIcon from '@mui/icons-material/GamesRounded';
import CalendarMonthRoundedIcon from '@mui/icons-material/CalendarMonthRounded';
import CircularProgress from '@mui/material/CircularProgress';
import { useAuth } from '../../../../auth/useAuth.jsx';

const drawerWidth = 290;

function ResponsiveDrawer(props) {
    const navigate = useNavigate();
    const { window } = props;
    const [mobileOpen, setMobileOpen] = React.useState(false);
    const [isClosing, setIsClosing] = React.useState(false);
    const [paginaActiva, setPaginaActiva] = useState("inicio");
    const [isLoading, setLoading] = useState(true);
    const [menuAnchor, setMenuAnchor] = useState(null);
    const [menuConvId, setMenuConvId] = useState(null);
    const { user, loading: authLoading } = useAuth();

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

    useEffect(() => {
        if (authLoading) return;

        if (!user) {
            navigate('/');
            return;
        };
    }, [user, authLoading]);

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
                backgroundColor: "#030414",
            }}>
                <Typography variant="h6" noWrap component="div">
                    <SmartToyRoundedIcon fontSize='large' sx={{ verticalAlign: "bottom", mr: 1 }} /> TeresAI
                </Typography>
            </Toolbar>
            <Box sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'flex-start',
                overflowY: "auto",
                maxHeight: "500px",
                width: "100%",
                minHeight: "280px",
                p: 1,
                backgroundColor: "#030414",
            }}>
                <Button fullWidth onClick={() => {
                    setPaginaActiva("inicio");
                }} sx={{
                    justifyContent: "flex-start",
                    backgroundColor: "transparent",
                    mt: 1,
                    mb: 1,
                    color: "#ffffff",
                    "&:hover": {
                        backgroundColor: "#2b2b2b"
                    }
                }}><HomeRoundedIcon sx={{ mr: 1 }} />Inicio</Button>
                <Button fullWidth onClick={() => {setPaginaActiva("chat")}} sx={{
                    justifyContent: "flex-start",
                    backgroundColor: "transparent",
                    mt: 1,
                    mb: 1,
                    color: "#ffffff",
                    "&:hover": {
                        backgroundColor: "#2b2b2b"
                    }
                }}><QuestionAnswerRoundedIcon sx={{ mr: 1 }} />Chat</Button>
                <Button fullWidth onClick={() => { setPaginaActiva("familiar") }} sx={{
                    justifyContent: "flex-start",
                    backgroundColor: "transparent",
                    mt: 1,
                    mb: 1,
                    color: "#ffffff",
                    "&:hover": {
                        backgroundColor: "#2b2b2b"
                    }
                }}><ElderlyRoundedIcon sx={{ mr: 1 }} />Mi familiar</Button>
                <Button fullWidth onClick={() => { setPaginaActiva("calendario") }} sx={{
                    justifyContent: "flex-start",
                    backgroundColor: "transparent",
                    mt: 1,
                    mb: 1,
                    color: "#ffffff",
                    "&:hover": {
                        backgroundColor: "#2b2b2b"
                    }
                }}><CalendarMonthRoundedIcon sx={{ mr: 1 }} />Calendario</Button>
            </Box>
            <Divider />
            <Box sx={{
                flexGrow: 1,
                overflowY: "auto",
                overflowX: "hidden",
                minHeight: 0,
                p: 1,
                width: '100%',
                backgroundColor: "#030414",
                /* Firefox */
                scrollbarWidth: 'thin',
                scrollbarColor: '#323232 transparent',

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
            </Box>
            <Divider />
            <Box>
                <MenuUsuario setPaginaActiva={setPaginaActiva} />
            </Box>
        </Box >
    );

    return (
        <Box sx={{ display: 'flex', width: "100%" }}>
            <CssBaseline />
            <AppBar
                position="fixed"
                sx={{
                    width: { sm: `calc(100% - ${drawerWidth}px)` },
                    ml: { sm: `${drawerWidth}px` },
                    display: {
                        xs: "block",
                        sm: "block",
                        md: "none",
                        lg: "none",
                        xl: "none"
                    },
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
                    maxHeight: "100dvh",
                    width: {
                        xs: "100%",
                        sm: "100%",
                        md: "1600px"
                    },
                    minWidth: 0,
                    flexGrow: 1,
                    overflowY: 'hidden',
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
                }}
            >
                <Box sx={{
                    height: "60px",
                    backgroundColor: "#010215",
                    flexShrink: 0,
                    display: { xs: "block", sm: "block", md: "none", lg: "none", xl: "none" },
                }} />
                {paginaActiva === "inicio" && <Toolbar
                    sx={{
                        display: { xs: "none", sm: "none", md: "flex", lg: "flex", xl: "flex" },
                        position: "fixed",
                        boxShadow: "0px 1px 3px rgba(0, 0, 0, 0.2)",
                        backgroundColor: "#010215",
                        backdropFilter: "blur(30px)",
                        zIndex: 1,
                        fontWeight: 600
                    }} >
                </Toolbar>
                }
                <Box sx={{
                    flexGrow: 1,
                    height: 0,
                    minHeight: 0,
                    display: "flex",
                    overflowY: "hidden",
                }}>
                    {paginaActiva === "chat" ? <Chat />
                        : paginaActiva === "perfil" ? <Perfil />
                            : paginaActiva === "calendario" ? <Calendar />
                                : paginaActiva === "familiar" ? <Familiar />
                                    : <Inicio />
                    }
                </Box>
            </Box>
        </Box>
    );
}

export default ResponsiveDrawer;
