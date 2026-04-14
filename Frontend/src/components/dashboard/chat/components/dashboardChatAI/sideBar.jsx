import * as React from 'react';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getConversations } from '../../exports/conversaciones.js';
import { deleteConversation } from '../../exports/eliminarConversacion.js';
import { useAuth } from '../../../../auth/AuthContext.jsx';
import { supabase } from "../../../../../supabaseClient.js";
import Chat from './chat.jsx';
import Games from '../games/games.jsx';
import Buscador from '../buscador/buscador.jsx';
import Calendar from '../calendar/calendar.jsx';
import News from '../news/news.jsx';
import Shopping from '../shopping/shoppinglist.jsx';
import MenuUsuario from './menu.jsx';
import Perfil from '../profile/profile.jsx';
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Backdrop from '@mui/material/Backdrop';
import Modal from '@mui/material/Modal';
import Fade from '@mui/material/Fade';
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';
import StepContent from '@mui/material/StepContent';
import Paper from '@mui/material/Paper';
import Divider from '@mui/material/Divider';
import Drawer from '@mui/material/Drawer';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import Toolbar from '@mui/material/Toolbar';
import Skeleton from '@mui/material/Skeleton';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import SmartToyRoundedIcon from '@mui/icons-material/SmartToyRounded';
import AddRoundedIcon from '@mui/icons-material/AddRounded';
import SearchRoundedIcon from '@mui/icons-material/SearchRounded';
import GamesRoundedIcon from '@mui/icons-material/GamesRounded';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import CalendarMonthRoundedIcon from '@mui/icons-material/CalendarMonthRounded';
import NewspaperIcon from '@mui/icons-material/Newspaper';
import MoreHorizRoundedIcon from "@mui/icons-material/MoreHorizRounded";
import DeleteRoundedIcon from "@mui/icons-material/DeleteRounded";
import EditRoundedIcon from "@mui/icons-material/EditRounded";
import StarRoundedIcon from "@mui/icons-material/StarRounded";

const drawerWidth = 290;

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 500,
    bgcolor: '#030414',
    border: '2px solid #000',
    borderRadius: 3,
    boxShadow: 24,
    p: 4,
};

const steps = [
    {
        label: 'Escribe lo que quieras',
        description: `Teresa esta preparada para poder responderte preguntas de la vida diaria, mantener una conversación normal, 
        aconsejarte, escucharte y lo más importante de todo, actuar como cuidadora las 24 horas del dia, agendando eventos y recordando
        cosas importantes. `,
    },
    {
        label: 'Emergencias',
        description:
            `Ante casos de emergencia podes solicitarle a Teresa que envie una notificación a tu familiar o cuidador vinculado para que este se entere
            de lo que esta sucediendo, todo con una simple solicitud.`,
    },
    {
        label: 'Create an ad',
        description: `Try out different ad text to see what brings in the most customers,
              and learn how to enhance your ads using features like ad extensions.
              If you run into any problems with your ads, find out how to tell if
              they're running and how to resolve approval issues.`,
    },
];

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
    //Modal
    const [open, setOpen] = useState(false);
    const handleCloseModal = async () => {

        const { error } = await supabase
            .schema("public")
            .from('profiles')
            .update({ is_new_user: false })
            .eq('id', user.id);

        if (!error) {
            setOpen(false);
        } else {
            console.error("Error al actualizar estado de usuario:", error);
        }
    };
    //Stepper dentro del modal
    const [activeStep, setActiveStep] = useState(0);

    const handleNext = () => {
        setActiveStep((prevActiveStep) => prevActiveStep + 1);
    };

    const handleBack = () => {
        setActiveStep((prevActiveStep) => prevActiveStep - 1);
    };

    const handleReset = () => {
        setActiveStep(0);
    };

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
        if (authLoading || !user) return;

        if (!user) {
            navigate('/');
            return;
        };

        fetchData();
    }, [user, authLoading]);

    useEffect(() => {
        const fetchUserStatus = async () => {
            if (authLoading || !user) return;

            const { data, error } = await supabase
                .schema("public")
                .from('profiles')
                .select('is_new_user')
                .eq('id', user.id)
                .single();

            if (error) {
                console.error("Error de Supabase:", error);
                return;
            }

            if (data && data.is_new_user === true) {
                setOpen(true);
            } else {
                setOpen(false);
            }
        };

        fetchUserStatus();
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
            {open && (
                <Box>
                    <Modal
                        aria-labelledby="transition-modal-title"
                        aria-describedby="transition-modal-description"
                        open={open}
                        closeAfterTransition
                        slots={{ backdrop: Backdrop }}
                        slotProps={{
                            backdrop: {
                                timeout: 500,
                            },
                        }}
                    >
                        <Fade in={open}>
                            <Box sx={style}>
                                <Typography variant='h6' sx={{ fontFamily: "'Lora', serif", mb: 1 }}>¿Cómo funciona la aplicación?</Typography>
                                <Box sx={{ maxWidth: 400 }}>
                                    <Stepper activeStep={activeStep} orientation="vertical">
                                        {steps.map((step, index) => (
                                            <Step key={step.label}>
                                                <StepLabel
                                                    optional={
                                                        index === steps.length - 1 ? (
                                                            <Typography variant="caption">Last step</Typography>
                                                        ) : null
                                                    }
                                                >
                                                    {step.label}
                                                </StepLabel>
                                                <StepContent>
                                                    <Typography>{step.description}</Typography>
                                                    <Box sx={{ mb: 2 }}>
                                                        <Button
                                                            variant="contained"
                                                            onClick={handleNext}
                                                            sx={{ mt: 1, mr: 1 }}
                                                        >
                                                            {index === steps.length - 1 ? 'Terminar' : 'Continuar'}
                                                        </Button>
                                                        <Button
                                                            disabled={index === 0}
                                                            onClick={handleBack}
                                                            sx={{ mt: 1, mr: 1 }}
                                                        >
                                                            Atras
                                                        </Button>
                                                    </Box>
                                                </StepContent>
                                            </Step>
                                        ))}
                                    </Stepper>
                                    {activeStep === steps.length && (
                                        <Paper square elevation={0} sx={{ p: 3, bgcolor: "transparent" }}>
                                            <Typography variant='body1' sx={{ fontFamily: "'Lora', serif", mb: 1 }}>¿Quieres volver a repetir el paso a paso?</Typography>
                                            <Button variant="contained" onClick={handleReset} sx={{ mt: 1, mr: 1 }}>
                                                Reiniciar
                                            </Button>
                                            <Button onClick={handleCloseModal} sx={{ mt: 1, mr: 1 }}>
                                                Empezar a usar TeresAI
                                            </Button>
                                        </Paper>
                                    )}
                                </Box>
                            </Box>
                        </Fade>
                    </Modal>
                </Box>
            )}
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
                minHeight: "280px",
                p: 1,
                backgroundColor: "#030414",
            }}>
                <Button onClick={() => {
                    setActiveConversationId(null);
                    setPaginaActiva("chat");
                }}
                    sx={{
                        mt: 1,
                        mb: 1,
                        backgroundColor: "transparent",
                        color: "#ffffff",
                        "&:hover": {
                            backgroundColor: "#2b2b2b"
                        }
                    }}><AddRoundedIcon sx={{ mr: 1 }} />Nuevo chat</Button>
                <Button onClick={() => {
                    setPaginaActiva("buscador");
                }}
                    sx={{
                        mb: 1,
                        backgroundColor: "transparent",
                        color: "#ffffff",
                        "&:hover": {
                            backgroundColor: "#2b2b2b"
                        }
                    }}><SearchRoundedIcon sx={{ mr: 1 }} />Buscar chats</Button>
                <Button onClick={() => {
                    setPaginaActiva("calendario");
                }} sx={{
                    mb: 1,
                    backgroundColor: "transparent",
                    color: "#ffffff",
                    "&:hover": {
                        backgroundColor: "#2b2b2b"
                    }
                }}><CalendarMonthRoundedIcon sx={{ mr: 1 }} />Calendario</Button>
                <Button onClick={() => {
                    setPaginaActiva("juegos");
                }} sx={{
                    mb: 1,
                    backgroundColor: "transparent",
                    color: "#ffffff",
                    "&:hover": {
                        backgroundColor: "#2b2b2b"
                    }
                }}><GamesRoundedIcon sx={{ mr: 1 }} />Juegos</Button>
                <Button onClick={() => {
                    setPaginaActiva("Noticias");
                }} sx={{
                    mb: 1,
                    backgroundColor: "transparent",
                    color: "#E6E6E6",
                    "&:hover": {
                        backgroundColor: "#2b2b2b"
                    }
                }}><NewspaperIcon sx={{ mr: 1 }} />Noticias</Button>
                <Button onClick={() => {
                    setPaginaActiva("Lista de compras");
                }} sx={{
                    mb: 1,
                    backgroundColor: "transparent",
                    color: "#E6E6E6",
                    "&:hover": {
                        backgroundColor: "#2b2b2b"
                    }
                }}><ShoppingCartIcon sx={{ mr: 1 }} />Lista de compras</Button>
                <Divider />
            </Box>
            <Box sx={{
                backgroundColor: "#030414",
                p: 1
            }}>
                <Typography variant="body1" sx={{
                    backgroundColor: "#030414",
                    pl: 1
                }}>Conversaciones</Typography>
            </Box>
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
                        <Skeleton animation="wave" variant="rectangular" height={40} sx={{ borderRadius: 2, mb: 1, bgcolor: "#4a4a4a" }} />
                        <Skeleton animation="wave" variant="rectangular" height={40} sx={{ borderRadius: 2, mb: 1, bgcolor: "#4a4a4a" }} />
                        <Skeleton animation="wave" variant="rectangular" height={40} sx={{ borderRadius: 2, mb: 1, bgcolor: "#4a4a4a" }} />
                    </>
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
                                        backgroundColor: isActive ? "#444444" : "transparent",
                                        color: "#ffffff",
                                        mb: 1,
                                        borderRadius: 2,
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
                                        sx={{ ml: "auto", color: "#ffffff", "&:hover": { color: "#ffffff" } }}
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
                                            p: 1,
                                            fontSize: "21px",
                                            backgroundColor: "#303030",
                                            color: "#ffffff",
                                            borderRadius: 3
                                        }
                                    }}
                                    PaperProps={{
                                        sx: { backgroundColor: "#303030", color: "#ffffff", minWidth: "160px", p: 0, borderRadius: 3 }
                                    }}
                                >
                                    <MenuItem onClick={(e) => { e.stopPropagation(); handleMenuClose(); }} sx={{ borderRadius: 3 }}>
                                        <StarRoundedIcon fontSize="small" sx={{ mr: 1 }} /> Favorito
                                    </MenuItem>
                                    <MenuItem onClick={(e) => { e.stopPropagation(); handleMenuClose(); }} sx={{ borderRadius: 3 }}>
                                        <EditRoundedIcon fontSize="small" sx={{ mr: 1 }} /> Renombrar
                                    </MenuItem>
                                    <Divider sx={{
                                        width: "100%",
                                        "&::before, &::after": {
                                            borderColor: "#ffffff",
                                        },
                                        m: 0,
                                        p: 0
                                    }}></Divider>
                                    <MenuItem onClick={(e) => { e.stopPropagation(); handleDelete(); handleMenuClose(); }}
                                        sx={{
                                            color: "#ff6b6b",
                                            borderRadius: 3,
                                            "&:hover": {
                                                backgroundColor: "#6b2a2a",
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
            <Divider />
            <Box>
                <MenuUsuario setPaginaActiva={setPaginaActiva} />
            </Box>
        </Box >
    );

    const container = window !== undefined ? () => window().document.body : undefined;

    return (
        <Box sx={{ display: 'flex', width: "100%" }}>
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
                    {activeConversationId && paginaActiva === "chat" && (
                        <Typography noWrap sx={{ fontFamily: "'Lora', serif", fontSize: "1rem" }}>
                            {conversations.find(c => c.id === activeConversationId)?.title || "Chat sin título"}
                        </Typography>
                    )}
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
                    minHeight: '100dvh',
                    width: {
                        xs: "100%",
                        sm: "100%",
                        md: "1600px"
                    },
                    minWidth: 0,
                    flexGrow: 1,
                    overflowY: 'auto',
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
                    display: { xs: "block", sm: "block", md: "none", lg: "none", xl: "none" }
                }} />
                {activeConversationId && paginaActiva === "chat" && <Toolbar
                    sx={{
                        display: { xs: "none", sm: "none", md: "flex", lg: "flex", xl: "flex" },
                        position: "fixed",
                        boxShadow: "0px 1px 3px rgba(0, 0, 0, 0.2)",
                        backgroundColor: "#010215",
                        backdropFilter: "blur(30px)",
                        zIndex: 1,
                        fontWeight: 600
                    }} >
                    {conversations.find(c => c.id === activeConversationId)?.title || "Chat sin título"}
                </Toolbar>}
                <Box sx={{
                    flexGrow: 1,
                    minHeight: 0,
                    display: "flex",
                    overflowY: "hidden"
                }}>
                    {paginaActiva === "juegos" ? <Games />
                        : paginaActiva === "calendario" ? <Calendar />
                            : paginaActiva === "perfil" ? <Perfil />
                                : paginaActiva === "buscador" ? <Buscador
                                    activeConversationId={activeConversationId}
                                    setActiveConversationId={setActiveConversationId}
                                    setPaginaActiva={setPaginaActiva}
                                    conversations={conversations}
                                    setConversations={setConversations}
                                    isLoading={isLoading}
                                    setLoading={setLoading}
                                />
                                    : paginaActiva === "Noticias" ? <News />
                                        : paginaActiva === "Lista de compras" ? <Shopping />
                                            : paginaActiva === "perfil" ? <Perfil />
                                                : <Chat
                                                    activeConversationId={activeConversationId}
                                                    setActiveConversationId={setActiveConversationId}
                                                    addConversation={addConversation}
                                                />
                    }
                </Box>
            </Box>
        </Box>
    );
}

export default ResponsiveDrawer;
