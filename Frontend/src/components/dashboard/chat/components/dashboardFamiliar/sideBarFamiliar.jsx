import * as React from "react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getConversationsFamiliar } from "../../exports/conversacionesFamiliar.js";
import { deleteConversation } from "../../exports/eliminarConversacion.js";
import { useAuth } from "../../../../auth/useAuth.jsx";
import MenuUsuario from "./menu.jsx";
import Inicio from "./Inicio.jsx";
import Chat from "./chatIA/Chat.jsx";
import Buscador from '../buscador/Buscador.jsx';
import Perfil from "../profile/Profile.jsx";
import Calendar from "../calendar/calendar.jsx";
import Familiar from "./familiar/Familiar.jsx";
import Menu from "@mui/material/Menu";
import ManualFamiliar from '../manual/ManualFamiliar.jsx';
import MenuItem from "@mui/material/MenuItem";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import CssBaseline from "@mui/material/CssBaseline";
import Divider from "@mui/material/Divider";
import Drawer from "@mui/material/Drawer";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import Toolbar from "@mui/material/Toolbar";
import Skeleton from "@mui/material/Skeleton";
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

const drawerWidth = 290;

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

  const fetchData = async () => {
    setLoading(true);
    const data = await getConversationsFamiliar();
    setConversations(data || []);
    setLoading(false);
  };

  useEffect(() => {
    if (authLoading) return;

    if (!user) {
      navigate("/");
      return;
    }

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
        ) : conversations && conversations.length > 0 ? (
          conversations.map((conv) => {
            const isActive = conv.id === activeConversationId;
            return (
              <Box key={conv.id}>
                <Button
                  fullWidth
                  onClick={() => {
                    setActiveConversationId(conv.id);
                    setPaginaActiva("chat");
                  }}
                  sx={{
                    backgroundColor: isActive ? "#c1c1c1" : "transparent",
                    color: "#000000",
                    mb: 1,
                    borderRadius: 2,
                    textTransform: 'none',
                    fontWeight: isActive ? 600 : 400,
                    "&:hover": { backgroundColor: "#c1c1c1" }
                  }}
                >
                  {conv.title}
                  <IconButton
                    size="small"
                    onClick={(e) => {
                      handleMenuOpen(e, conv.id);
                      e.stopPropagation();
                    }}
                    sx={{ ml: "auto", color: "#000000", "&:hover": { color: "#999688" } }}
                  >
                    <MoreHorizRoundedIcon fontSize="small" sx={{ color: "#000000" }} />
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
              {conversations.find((c) => c.id === activeConversationId)?.title || "Chat sin titulo"}
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
            {conversations.find((c) => c.id === activeConversationId)?.title || "Chat sin titulo"}
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

