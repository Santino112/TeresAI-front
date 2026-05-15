import * as React from "react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getConversationsFamiliar } from "../../exports/conversacionesFamiliar.js";
import { deleteConversation } from "../../exports/eliminarConversacion.js";
import { useAuth } from "../../../../auth/useAuth.jsx";
import { supabase } from "../../../../../supabaseClient.js";
import MenuUsuario from "./menu.jsx";
import Inicio from "./inicio.jsx";
import Chat from "./chatIA/chat.jsx";
import Buscador from '../buscador/buscador.jsx';
import Perfil from "../profile/profile.jsx";
import Calendar from "../calendar/calendar.jsx";
import Familiar from "./familiar/familiar.jsx";
import Menu from "@mui/material/Menu";
import ManualFamiliar from '../manual/manualFamiliar.jsx';
import MenuItem from "@mui/material/MenuItem";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import CssBaseline from "@mui/material/CssBaseline";
import Paper from '@mui/material/Paper';
import Divider from "@mui/material/Divider";
import Drawer from "@mui/material/Drawer";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import Toolbar from "@mui/material/Toolbar";
import Skeleton from "@mui/material/Skeleton";
import Modal from "@mui/material/Modal";
import Backdrop from '@mui/material/Backdrop';
import Fade from '@mui/material/Fade';
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';
import StepContent from '@mui/material/StepContent';
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import SmartToyRoundedIcon from "@mui/icons-material/SmartToyRounded";
import HomeRoundedIcon from "@mui/icons-material/HomeRounded";
import StarRoundedIcon from "@mui/icons-material/StarRounded";
import EditRoundedIcon from "@mui/icons-material/EditRounded";
import QuestionAnswerRoundedIcon from "@mui/icons-material/QuestionAnswerRounded";
import ElderlyRoundedIcon from "@mui/icons-material/ElderlyRounded";
import CalendarMonthRoundedIcon from "@mui/icons-material/CalendarMonthRounded";
import AddRoundedIcon from "@mui/icons-material/AddRounded";
import MoreHorizRoundedIcon from "@mui/icons-material/MoreHorizRounded";
import DeleteRoundedIcon from "@mui/icons-material/DeleteRounded";
import SearchRoundedIcon from '@mui/icons-material/SearchRounded';
import ArrowUpwardRoundedIcon from '@mui/icons-material/ArrowUpwardRounded';
import VolumeOffRoundedIcon from "@mui/icons-material/VolumeOffRounded";
import MicOffRoundedIcon from "@mui/icons-material/MicOffRounded";

const drawerWidth = 290;

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: "90%",
  maxWidth: 500,
  color: '#000000',
  overflowY: "auto",
  maxHeight: '90dvh',
  bgcolor: "#ffffff",
  border: '2px solid #000000',
  borderRadius: 3,
  boxShadow: 24,
  p: { xs: 2, sm: 3, md: 4 },
};

const steps = [
  {
    label: "¿Qué puede hacer Teresa?",
    description: (
      <Box sx={{ color: '#000000' }}>
        <Typography variant='body1' sx={{ lineHeight: 1.6, mb: 2 }}>
          Teresa opera como una <strong>interfaz de monitoreo inteligente</strong> que centraliza la actividad diaria del adulto mayor para facilitar la gestión del familiar a cargo. Su funcionamiento se basa en el análisis técnico de tres ejes estratégicos:
        </Typography>

        <Box component="ul" sx={{ pl: 2, m: 0, '& li': { mb: 2 } }}>
          <li>
            <Typography variant="body1" component="span">
              <strong>1. Procesamiento de Datos del Usuario:</strong> Teresa recolecta y procesa continuamente la información de las interacciones, permitiendo la identificación de patrones, registro de incidentes y optimización del perfil asistencial.
            </Typography>
          </li>
          <li>
            <Typography variant="body1" component="span">
              <strong>2. Gestión Operativa:</strong> Como cuidadora profesional, transforma la información en acciones concretas (control de agenda médica, gestión de suministros y reportes de estado) para reducir la carga administrativa del entorno familiar.
            </Typography>
          </li>
          <li>
            <Typography variant="body1" component="span">
              <strong>3. Asistencia Preventiva 24/7:</strong> Disponibilidad técnica absoluta para mantener la estabilidad del entorno, garantizando intervención inmediata ante dudas operativas o cuadros de desorientación.
            </Typography>
          </li>
        </Box>
      </Box>
    )
  },
  {
    label: 'Emergencias',
    description: (
      <Typography variant='body1' sx={{ lineHeight: 1.8 }}>
        En caso de <strong>emergencia</strong>, Teresa puede notificar de inmediato a tu familiar o cuidador vinculado. Con solo pedírselo, ellos recibirán un aviso para estar al tanto de lo que sucede al instante
      </Typography>
    )

  },
  {
    label: 'Hablar con teresa',
    description: (
      <Typography variant='body1' sx={{ lineHeight: 1.8 }}>
        Para hablar con Teresa, utiliza el campo de texto centrado en pantalla. Aquí puedes escribir consultas, números o cualquier información.
        <br /><br />
        Debajo del campo de texto encontrarás tres herramientas principales:
        <br />
        • El botón <strong>enviar</strong> <ArrowUpwardRoundedIcon fontSize='small' sx={{ verticalAlign: "middle", mx: 0.5, color: '#f0750a' }} /> aparecerá al escribir y sirve para procesar tu mensaje.
        <br />
        • Si prefieres usar tu voz, mantén presionado el botón de <strong>audio</strong> <MicOffRoundedIcon fontSize='small' sx={{ verticalAlign: "middle", mx: 0.5, color: '#f0750a' }} /> y suéltalo al terminar de hablar.
        <br />
        • A la izquierda, el botón de <strong>voz</strong> <VolumeOffRoundedIcon fontSize='small' sx={{ verticalAlign: "middle", mx: 0.5, color: '#f0750a' }} /> permitirá que la IA lea sus respuestas en voz alta.
      </Typography>
    )
  },
  {
    label: "Control de tu familiar",
    description: (
      <Box sx={{ color: '#000000' }}>
        <Typography variant='body1' sx={{ lineHeight: 1.6, mb: 2 }}>
          Esta interfaz proporciona una <strong>auditoría analítica</strong> sobre el bienestar y la actividad del adulto mayor. A través de indicadores visuales avanzados, usted puede supervisar la evolución del servicio y el estado biopsicosocial del usuario de manera cuantitativa.
        </Typography>
        <Box component="ul" sx={{ pl: 2, m: 0, '& li': { mb: 2 } }}>
          <li>
            <Typography variant="body1" component="span">
              <strong>Análisis de Actividad y Uso:</strong> Reportes gráficos (barras y sectores) que desglosan el tiempo de interacción con Teresa. Permite monitorear la adherencia al sistema con comparativas semanales, mensuales y anuales.
            </Typography>
          </li>
          <li>
            <Typography variant="body1" component="span">
              <strong>Indicadores de Bienestar Emocional:</strong> Basándose en el análisis del lenguaje y el tono de las interacciones, el sistema genera métricas sobre el nivel de satisfacción y estabilidad emocional (Nivel de Felicidad) del usuario.
            </Typography>
          </li>
          <li>
            <Typography variant="body1" component="span">
              <strong>Detección de Tendencias:</strong> La visualización de datos facilita la identificación temprana de cambios en la rutina o en el estado de ánimo, funcionando como una herramienta de diagnóstico preventivo para el entorno familiar.
            </Typography>
          </li>
          <li>
            <Typography variant="body1" component="span">
              <strong>Resumen Ejecutivo de Gestión:</strong> Un tablero de control rápido diseñado para ofrecer una visión global del estado del adulto mayor en menos de un minuto, optimizando el tiempo de supervisión del familiar.
            </Typography>
          </li>
        </Box>
      </Box>
    )
  },
  {
    label: "Mucho más que un chat",
    description: (
      <Typography variant='body1' sx={{ lineHeight: 1.8 }}>
        Además de conversar con Teresa, tienes a tu disposición herramientas diseñadas para tu día a día:
        <br /><br />
        • <strong>Calendario</strong>: Consulta todos los eventos y recordatorios que le hayas pedido a Teresa agendar.
        <br />
        • <strong>Entrenamiento Mental</strong>: Una sección de juegos diseñada específicamente para ejercitar tu memoria.
        <br />
        • <strong>Noticias a medida</strong>: Accede a las novedades más destacadas, seleccionadas especialmente por Teresa para vos.
        <br />
        • <strong>Lista de Compras</strong>: Llevá el control de lo que necesitas, ya sea pidiéndoselo a Teresa o anotándolo vos mismo.
        <br />
        • <strong>Notas</strong>: Un espacio seguro para escribir cualquier detalle y que no se te olvide nada.
      </Typography>
    )
  }
];

function ResponsiveDrawer() {
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const [isClosing, setIsClosing] = React.useState(false);
  const [paginaActiva, setPaginaActiva] = useState("inicio");
  const [isLoading, setLoading] = useState(true);
  const [conversations, setConversations] = useState([]);
  const [activeConversationId, setActiveConversationId] = useState(null);
  const [menuAnchor, setMenuAnchor] = useState(null);
  const [menuConvId, setMenuConvId] = useState(null);
  const { user, loading: authLoading } = useAuth();

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
    setConversations((prev) => {
      const index = prev.findIndex((c) => c.id === newConversation.id);

      if (index !== -1) {
        if (prev[index].title === newConversation.title) {
          return prev;
        }

        const updatedConversations = [...prev];
        updatedConversations[index] = {
          ...updatedConversations[index],
          ...newConversation,
          title: newConversation.title || updatedConversations[index].title
        };
        return updatedConversations;
      }

      return [newConversation, ...prev];
    });
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

  useEffect(() => {
    if (typeof window === "undefined") return undefined;

    window.dispatchEvent(
      new CustomEvent("teresai:dashboard-sidebar", {
        detail: { open: mobileOpen },
      })
    );

    return () => {
      window.dispatchEvent(
        new CustomEvent("teresai:dashboard-sidebar", {
          detail: { open: false },
        })
      );
    };
  }, [mobileOpen]);

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

  const fetchData = async () => {
    setLoading(true);
    const data = await getConversationsFamiliar();
    setConversations(Array.isArray(data) ? data : []);
    setLoading(false);
  };

  useEffect(() => {
    if (authLoading) return;

    if (!user) {
      navigate("/");
      return;
    }

    fetchData();
  }, [user, authLoading, navigate]);

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
    const idABorrar = menuConvId;
    const success = await deleteConversation(idABorrar);

    if (success) {
      setConversations((prev) => prev.filter((c) => String(c.id) !== String(idABorrar)));
      if (activeConversationId === idABorrar) {
        setActiveConversationId(null);
      }
    }

    handleMenuClose();
  };

  const drawer = (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        height: "100dvh"
      }}
    >
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
                sx: { backdropFilter: "blur(3px)" },
              },
            }}
            sx={{
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
            <Fade in={open}>
              <Box sx={style}>
                <Typography variant='h6' sx={{ mb: 1, fontWeight: 600 }}>¿Cómo funciona la aplicación?</Typography>
                <Box sx={{ width: "100%", color: "#000000" }}>
                  <Stepper activeStep={activeStep} orientation="vertical">
                    {steps.map((step, index) => (
                      <Step key={step.label}>
                        <StepLabel sx={{
                          "& .MuiStepLabel-label": {
                            color: "#464545",
                            fontWeight: "medium",
                          },
                          "& .MuiStepLabel-label.Mui-active": {
                            color: "#000000",
                            fontWeight: "bold",
                          },
                          "& .MuiStepLabel-label.Mui-completed": {
                            color: "#7d745c",
                          },
                        }}
                          StepIconProps={{
                            sx: {
                              color: "#d7d6d6",
                              "&.Mui-active": {
                                color: "#7d745c",
                              },
                              "&.Mui-completed": {
                                color: "#67604d",
                              },
                              "& .MuiStepIcon-text": {
                                fill: "#ffffff",
                              },
                            },
                          }}>
                          <Typography sx={{ color: "#000000" }}>
                            {step.label}
                          </Typography>
                        </StepLabel>
                        <StepContent>
                          <Typography sx={{ color: "#000000" }}>{step.description}</Typography>
                          <Box sx={{ mb: 2 }}>
                            <Button
                              variant="contained"
                              onClick={handleNext}
                              sx={{
                                backgroundColor: "#7d745c",
                                borderRadius: 2,
                                color: "#ffffff",
                                textTransform: "none",
                                "&:hover": {
                                  backgroundColor: "#67604d"
                                },
                                fontSize: "1rem",
                                mr: 1,
                                mt: 1
                              }}
                            >
                              {index === steps.length - 1 ? 'Terminar' : 'Continuar'}
                            </Button>
                            <Button
                              disabled={index === 0}
                              onClick={handleBack}
                              sx={{
                                color: "#464545",
                                fontWeight: "bold",
                                borderRadius: 2,
                                textTransform: "none",
                                fontSize: "1rem",
                                mr: 1,
                                mt: 1,
                                "&:hover": { backgroundColor: "#e0e0e0" },
                              }}
                            >
                              Atras
                            </Button>
                          </Box>
                        </StepContent>
                      </Step>
                    ))}
                  </Stepper>
                  {activeStep === steps.length && (
                    <Paper square elevation={0} sx={{ mt: 2, bgcolor: "transparent", width: "100%", p: { xs: 0, sm: 0, md: 0 } }}>
                      <Typography variant='body1' sx={{ color: "#000000", mb: 1 }}>¿Quieres volver a repetir el paso a paso de las instrucciones?</Typography>
                      <Button variant="contained" onClick={handleCloseModal} sx={{
                        backgroundColor: "#7d745c",
                        color: "#ffffff",
                        borderRadius: 2,
                        textTransform: "none",
                        "&:hover": {
                          backgroundColor: "#67604d"
                        },
                        fontSize: "1rem",
                        mr: 1,
                        mt: 1
                      }}>
                        Empezar
                      </Button>
                      <Button onClick={handleReset} sx={{
                        color: "#464545",
                        fontWeight: "bold",
                        borderRadius: 2,
                        textTransform: "none",
                        ml: 1,
                        mt: 1,
                        fontSize: "1rem",
                        "&:hover": { backgroundColor: "#e0e0e0" },
                      }}>
                        Repetir
                      </Button>
                    </Paper>
                  )}
                </Box>
              </Box>
            </Fade>
          </Modal>
        </Box>
      )}
      <Toolbar
        sx={{
          display: "flex",
          justifyContent: "flex-start",
          flexShrink: 0,
          backgroundColor: "#eeeeee",
        }}
      >
        <Typography variant="h5" noWrap component="div" sx={{
          position: "relative",
          right: { xs: -5, sm: 3, md: 5, lg: 5, xl: 4 },
          mr: "auto",
          color: "#000000"
        }}>
          TeresAI
        </Typography>
      </Toolbar>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-start",
          overflowY: "auto",
          maxHeight: "320px",
          width: "100%",
          minHeight: "250px",
          p: 1,
          backgroundColor: "#eeeeee",
        }}
      >
        <Button
          fullWidth
          onClick={() => {
            setPaginaActiva("inicio");
          }}
          sx={{
            justifyContent: "flex-start",
            mb: 1,
            mt: 1,
            backgroundColor: "transparent",
            color: "#000000",
            "&:hover": {
              backgroundColor: "#e1e1e1",
            }
          }}
        >
          <HomeRoundedIcon sx={{ mr: 1 }} />Inicio
        </Button>
        <Button
          fullWidth
          onClick={() => {
            setPaginaActiva("familiar");
          }}
          sx={{
            justifyContent: "flex-start",
            backgroundColor: "transparent",
            mb: 1,
            color: "#000000",
            "&:hover": {
              backgroundColor: "#e1e1e1",
            }
          }}
        >
          <ElderlyRoundedIcon sx={{ mr: 1 }} />Mi familiar
        </Button>
        <Button
          fullWidth
          onClick={() => {
            setActiveConversationId(null);
            setPaginaActiva("chat");
          }}
          sx={{
            justifyContent: "flex-start",
            backgroundColor: "transparent",
            mb: 1,
            color: "#000000",
            "&:hover": {
              backgroundColor: "#e1e1e1",
            }
          }}
        >
          <QuestionAnswerRoundedIcon sx={{ mr: 1 }} />Nueva conversación
        </Button>
        <Button fullWidth onClick={() => {
          setPaginaActiva("buscador");
        }}
          sx={{
            justifyContent: "flex-start",
            mb: 1,
            backgroundColor: "transparent",
            color: "#000000",
            "&:hover": {
              backgroundColor: "#e1e1e1",
            }
          }}><SearchRoundedIcon sx={{ mr: 1 }} />Buscar conversaciones</Button>
        <Button
          fullWidth
          onClick={() => {
            setPaginaActiva("calendario");
          }}
          sx={{
            justifyContent: "flex-start",
            backgroundColor: "transparent",
            mb: 1,
            color: "#000000",
            "&:hover": {
              backgroundColor: "#e1e1e1",
            }
          }}
        >
          <CalendarMonthRoundedIcon sx={{ mr: 1 }} />Calendario
        </Button>
      </Box>
      <Box sx={{
        backgroundColor: "#eeeeee",
        p: 1
      }}>
        <Typography variant="body1" sx={{
          backgroundColor: "#eeeeee",
          color: "#000000",
          pl: 1
        }}>Conversaciones</Typography>
      </Box>
      <Box
        sx={{
          flexGrow: 1,
          overflowY: "auto",
          overflowX: "hidden",
          minHeight: 0,
          p: 1,
          width: "100%",
          backgroundColor: "#d7d6d6",
          scrollbarWidth: 'thin',
          scrollbarColor: '#8f8e8e transparent',
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
        {isLoading ? (
          Array.from(new Array(11)).map((_, index) => (
            <Skeleton key={index} variant="rectangular" animation="wave" width="100%" height={40} sx={{ mb: 1, borderRadius: 2, bgcolor: "#c1c1c1" }} />
          ))
        ) : Array.isArray(conversations) && conversations.length > 0 ? (
          conversations.map((conv) => {
            const isActive = conv.id === activeConversationId;
            return (
              <Box
                key={conv.id}
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 0.5,
                  width: "100%",
                  mb: 1,
                }}
              >
                <Button
                  fullWidth
                  onClick={() => {
                    setActiveConversationId(conv.id);
                    setPaginaActiva("chat");
                  }}
                  sx={{
                    flex: 1,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "flex-start",
                    gap: 1,
                    backgroundColor: isActive ? "#c1c1c1" : "transparent",
                    color: "#000000",
                    borderRadius: 2,
                    textTransform: 'none',
                    fontWeight: isActive ? 600 : 400,
                    overflow: "hidden",
                    minWidth: 0,
                    "&:hover": { backgroundColor: "#c1c1c1" }
                  }}
                >
                  <Typography
                    noWrap
                    sx={{
                      flexGrow: 1,
                      minWidth: 0,
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                      textAlign: "left"
                    }}
                  >
                    {conv.title}
                  </Typography>
                </Button>
                <IconButton
                  size="small"
                  onClick={(e) => {
                    handleMenuOpen(e, conv.id);
                    e.stopPropagation();
                  }}
                  sx={{ flexShrink: 0, color: "#000000", "&:hover": { color: "#999688" } }}
                >
                  <MoreHorizRoundedIcon fontSize="small" sx={{ color: "#000000" }} />
                </IconButton>
                <Menu
                  anchorEl={menuAnchor}
                  open={Boolean(menuAnchor) && menuConvId === conv.id}
                  onClose={handleMenuClose}
                  MenuListProps={{
                    sx: {
                      p: 1,
                      fontSize: "21px",
                      backgroundColor: "#eeeeee",
                      color: "#000000",
                      borderRadius: 3
                    }
                  }}
                  PaperProps={{
                    sx: {
                      backgroundColor: "#303030",
                      color: "#ffffff",
                      minWidth: "160px",
                      p: 0,
                      borderRadius: 3
                    }
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
              </Box>
            );
          })
        ) : (
          <Box sx={{ p: 2, textAlign: 'center' }}>
            <Typography sx={{ color: "#000000", fontSize: "1rem" }}>
              No hay conversaciones
            </Typography>
          </Box>
        )}
      </Box>
      <Box>
        <MenuUsuario setPaginaActiva={setPaginaActiva} />
      </Box>
    </Box>
  );

  return (
    <Box sx={{ display: "flex", width: "100%" }}>
      <CssBaseline />
      <AppBar
        position="fixed"
        sx={{
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          ml: { sm: `${drawerWidth}px` },
          backgroundColor: "#eeeeee",
          color: "#000000",
        }}
      >
        <Toolbar
          sx={{
            display: "flex",
            justifyContent: "space-between"
          }}
        >
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { sm: "none" } }}
          >
            <MenuIcon />
          </IconButton>
          {activeConversationId && paginaActiva === "chat" && (
            <Typography noWrap sx={{ fontSize: "1rem" }}>
              {Array.isArray(conversations)
                ? conversations.find((c) => c.id === activeConversationId)?.title || "Chat sin titulo"
                : "Chat sin titulo"}
            </Typography>
          )}
        </Toolbar>
      </AppBar>
      <Box component="nav" sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }} aria-label="mailbox folders">
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onTransitionEnd={handleDrawerTransitionEnd}
          onClose={handleDrawerClose}
          sx={{
            display: { xs: "block", sm: "none" },
            "& .MuiDrawer-paper": { boxSizing: "border-box", width: drawerWidth }
          }}
          slotProps={{
            root: {
              keepMounted: true
            }
          }}
        >
          {drawer}
        </Drawer>
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: 'none', sm: 'block' },
            '& .MuiDrawer-paper': {
              boxSizing: 'border-box',
              width: drawerWidth,
              borderRight: 'none',
              boxShadow: "6px 0px 10px -2px rgba(0, 0, 0, 0.1)",
              backgroundColor: '#f0eee6',
            },
          }}
          open
        >
          {drawer}
        </Drawer>
      </Box>
      <Box
        component="main"
        sx={{
          display: "flex",
          flexDirection: "column",
          height: "100dvh",
          maxHeight: "100dvh",
          width: {
            xs: "100%",
            sm: "100%",
            md: "1600px"
          },
          minWidth: 0,
          flexGrow: 1,
          overflowY: "hidden",
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
            backgroundColor: '#2f2f2f',
            borderRadius: '8px',
          },
          '&::-webkit-scrollbar-thumb:hover': {
            backgroundColor: '#444',
          },
        }}
      >
        <Box
          sx={{
            height: "60px",
            backgroundColor: "#f0eee6",
            flexShrink: 0,
          }}
        />
        {activeConversationId && paginaActiva === "chat" && (
          <Toolbar
            sx={{
              height: "60px",
              position: "fixed",
              backgroundColor: "#f0eee6",
              backdropFilter: "blur(30px)",
              zIndex: 1,
              fontWeight: 600,
            }}
          >
            {Array.isArray(conversations)
              ? conversations.find((c) => c.id === activeConversationId)?.title || "Chat sin titulo"
              : "Chat sin titulo"}
          </Toolbar>
        )}
        <Box
          sx={{
            flexGrow: 1,
            height: 0,
            minHeight: 0,
            display: "flex",
            overflowY: "hidden",
          }}
        >
          {paginaActiva === "chat" ? (
            <Chat
              activeConversationId={activeConversationId}
              setActiveConversationId={setActiveConversationId}
              addConversation={addConversation}
            />
          ) : paginaActiva === "perfil" ? (
            <Perfil />
          ) : paginaActiva === "calendario" ? (
            <Calendar />
          ) : paginaActiva === "familiar" ? (
            <Familiar />
          ) : paginaActiva === "buscador" ? (
            <Buscador
              activeConversationId={activeConversationId}
              setActiveConversationId={setActiveConversationId}
              setPaginaActiva={setPaginaActiva}
              conversations={conversations}
              setConversations={setConversations}
              isLoading={isLoading}
              setLoading={setLoading}
            />
          ) : paginaActiva === "manual" ? (
            <ManualFamiliar />
          ) : (
            <Inicio />
          )}
        </Box>
      </Box>
    </Box>
  );
}

export default ResponsiveDrawer;

