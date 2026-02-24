import * as React from 'react';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getConversations } from '../exports/conversaciones.js';
import Chat from './chat.jsx';
import Menu from './menu.jsx';
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
import BotonCalendar from './botonCalendar.jsx';
import CircularProgress from '@mui/material/CircularProgress';
import { useAuth } from '../../../auth/AuthContext';

const drawerWidth = 290;

function ResponsiveDrawer(props) {
    const navigate = useNavigate();
    const { window } = props;
    const [mobileOpen, setMobileOpen] = React.useState(false);
    const [isClosing, setIsClosing] = React.useState(false);
    const [conversations, setConversations] = useState([]);
    const [activeConversationId, setActiveConversationId] = useState(null);
    const [isLoading, setLoading] = useState(true);
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

    const drawer = (
        <Box sx={{
            display: 'flex',
            flexDirection: 'column',
            height: '100dvh'
        }}>
            <Toolbar sx={{
                display: 'flex',
                justifyContent: 'flex-start',
                flexShrink: 0
            }}>
                <Typography variant="h6" noWrap component="div">
                    <SmartToyRoundedIcon fontSize='large' sx={{ marginTop: 1.5 }}></SmartToyRoundedIcon>
                </Typography>
            </Toolbar>
            <Divider />
            <Box sx={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                p: 1,
                flexGrow: 1,
                backgroundColor: "#434A42",
            }}>
                <Button onClick={() => setActiveConversationId(null)}  sx={{
                    mb: 1,
                    backgroundColor: "transparent",
                    color: "#E6E6E6",
                    "&:hover": {
                        backgroundColor: "#565E58"
                    }
                }}><DrawRoundedIcon sx={{ mr: 1 }} />Nuevo chat</Button>
                <Button sx={{
                    mb: 1,
                    backgroundColor: "transparent",
                    color: "#E6E6E6",
                    "&:hover": {
                        backgroundColor: "#565E58"
                    }
                }}><SearchRoundedIcon sx={{ mr: 1 }} />Buscar chats</Button>
                <Button sx={{
                    mb: 1,
                    backgroundColor: "transparent",
                    color: "#E6E6E6",
                    "&:hover": {
                        backgroundColor: "#565E58"
                    }
                }}><GamesRoundedIcon sx={{ mr: 1 }} />Juegos</Button>
                <BotonCalendar />
            </Box>
            <Divider />
            <Box sx={{
                flexGrow: 1,
                overflowY: 'auto',
                minHeight: 0,
                p: 1,
                width: '100%',
                backgroundColor: "#2b2f2a",
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
                            <Button
                                key={conv.id}
                                fullWidth
                                onClick={() => setActiveConversationId(conv.id)}
                                sx={{
                                    backgroundColor: isActive ? "#565E58" : "transparent",
                                    color: "#E6E6E6",
                                    mb: 1.3,
                                    borderRadius: 2,
                                    textTransform: 'none',
                                    fontWeight: isActive ? 600 : 400,
                                    transition: "all 0.2s ease",
                                    "&:hover": {
                                        backgroundColor: "#565E58"
                                    }
                                }}
                            >
                                {conv.title}
                            </Button>
                        );
                    })
                )}
            </Box>
            <Divider />
            <Box>
                <Menu />
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
                    <Typography variant="h6" noWrap component="div">
                        TeresAI
                    </Typography>
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
                    <Chat
                        activeConversationId={activeConversationId}
                        setActiveConversationId={setActiveConversationId}
                        addConversation={addConversation}
                    />
                </Box>
            </Box>
        </Box>
    );
}

export default ResponsiveDrawer;
