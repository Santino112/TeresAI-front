import * as React from 'react';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getConversations } from '../exports/conversaciones.js';
import { supabase } from '../../../../supabaseClient.js';
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
import CalendarMonthRoundedIcon from '@mui/icons-material/CalendarMonthRounded';

const drawerWidth = 290;

function ResponsiveDrawer(props) {
    const navigate = useNavigate();
    const { window } = props;
    const [mobileOpen, setMobileOpen] = React.useState(false);
    const [isClosing, setIsClosing] = React.useState(false);
    const [conversations, setConversations] = useState([]);

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
        const loadConversations = async () => {
            const token = localStorage.getItem('token');

            if (!token) {
                navigate('/');
            }

            const data = await getConversations(token);
            console.log('DATOS:', data)
            setConversations(data);
        };

        loadConversations();
    }, []);

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
            <List>
                <Button><DrawRoundedIcon sx={{ mr: 1 }} />Nuevo chat</Button>
                <Button><SearchRoundedIcon sx={{ mr: 1 }} />Buscar chats</Button>
                <Button><CalendarMonthRoundedIcon sx={{ mr: 1 }} />Calendario</Button>
            </List>
            <Divider />
            <Box sx={{
                flexGrow: 1,
                overflowY: 'auto',
                minHeight: 0,
                p: 1,
                width: '100%',
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
                {Array.isArray(conversations) && conversations.map(conv => (
                    <Button key={conv.id} variant='outlined' fullWidth sx={{ mb: 1, }}>
                        {conv.title}
                    </Button>
                ))}
            </Box>
            <Divider />
            <List>
                <Menu />
            </List>
        </Box>
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
                {/* The implementation can be swapped with js to avoid SEO duplication of links. */}
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
                            keepMounted: true, // Better open performance on mobile.
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
                <Chat />
            </Box>
        </Box>
    );
}

export default ResponsiveDrawer;
