import * as React from 'react';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import MenuUsuario from './menu.jsx';
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
import DrawRoundedIcon from '@mui/icons-material/DrawRounded';
import SearchRoundedIcon from '@mui/icons-material/SearchRounded';
import GamesRoundedIcon from '@mui/icons-material/GamesRounded';
import CalendarMonthRoundedIcon from '@mui/icons-material/CalendarMonthRounded';
import CircularProgress from '@mui/material/CircularProgress';
import { useAuth } from '../../../../auth/AuthContext.jsx';

const drawerWidth = 290;

function ResponsiveDrawer(props) {
    const navigate = useNavigate();
    const { window } = props;
    const [mobileOpen, setMobileOpen] = React.useState(false);
    const [isClosing, setIsClosing] = React.useState(false);
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

    const handleMenuOpen = (e, convId) => {
        e.stopPropagation();
        setMenuAnchor(e.currentTarget);
        setMenuConvId(convId);
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
                    <SmartToyRoundedIcon fontSize='large' sx={{ verticalAlign: "bottom", mr: 1 }} /> TeresAI
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
                <Button sx={{
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
                <Button sx={{
                    mb: 1,
                    backgroundColor: "transparent",
                    color: "#E6E6E6",
                    "&:hover": {
                        backgroundColor: "#3f4440"
                    }
                }}><GamesRoundedIcon sx={{ mr: 1 }} />Juegos</Button>
                <Button sx={{
                    mb: 1,
                    backgroundColor: "transparent",
                    color: "#E6E6E6",
                    "&:hover": {
                        backgroundColor: "#3f4440"
                    }
                }}><CalendarMonthRoundedIcon sx={{ mr: 1 }} />Calendario</Button>
                <Divider />
                <Typography variant="body1" sx={{
                    mt: 1,
                    ml: 1
                }}>Chats</Typography>
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
            </Box>
            <Divider />
            <Box>
                <MenuUsuario />
            </Box>
        </Box >
    );

    const container = window !== undefined ? () => window().document.body : undefined;

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
                    width: {
                        xs: "100%",
                        sm: "100%",
                        md: "1600px"
                    },
                    minWidth: 0,
                    flexGrow: 1,
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
                <Toolbar sx={{ boxShadow: "0px 4px 8px rgba(0,0,0,0.4)" }}>
                    <Typography>Estas en la pagina del cuidador</Typography>
                </Toolbar>
            </Box>
        </Box>
    );
}

export default ResponsiveDrawer;
