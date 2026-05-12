import { useEffect, useState } from "react";
import api from "../../../../../api/axios";
import fondoChatAI from "../../../../../assets/images/fondoChatAI.png";
import { Box, Typography, TextField, Paper, List, ListItem, ListItemText, Checkbox, Button, Divider, useTheme, Modal, Stack, Alert, CircularProgress, Grid, InputAdornment } from "@mui/material";
import ShoppingCartRoundedIcon from '@mui/icons-material/ShoppingCartRounded';
import AddRoundedIcon from '@mui/icons-material/AddRounded';
import DoneAllRoundedIcon from '@mui/icons-material/DoneAllRounded';
import AddShoppingCartRoundedIcon from '@mui/icons-material/AddShoppingCartRounded';
import DeleteRoundedIcon from '@mui/icons-material/DeleteRounded';
import LocalOfferRoundedIcon from '@mui/icons-material/LocalOfferRounded';
import PlusOneRoundedIcon from '@mui/icons-material/PlusOneRounded';
import PendingActionsRoundedIcon from '@mui/icons-material/PendingActionsRounded';
import InventoryRoundedIcon from '@mui/icons-material/InventoryRounded';

const styleModal = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: "90%",
  maxWidth: 500,
  color: '#000000',
  overflowY: "auto",
  bgcolor: "#eeeeee",
  border: '2px solid #000000',
  borderRadius: 3,
  boxShadow: 24,
  p: { xs: 3, sm: 3, md: 4 },
  outline: 'none'
};

export default function ShoppingList() {
  const theme = useTheme();
  const [items, setItems] = useState([]);
  const [loadingItems, setLoadingItems] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [createLoading, setCreateLoading] = useState(false);
  const [createError, setCreateError] = useState("");
  const [createForm, setCreateForm] = useState({
    text: "",
    quantity: "",
  });

  const fetchItems = async () => {
    setLoadingItems(true);
    try {
      const res = await api.get("/shopping-items");
      setItems(res.data.items || []);
    } catch (err) {
      console.error("Error cargando lista de compras", err);
    } finally {
      setLoadingItems(false);
    }
  };

  const toggleItem = async (itemId) => {
    try {
      setActionLoading(true);
      await api.post("/shopping-items/toggle", { itemId });
      await fetchItems();
    } catch (err) {
      console.error("Error actualizando item", err);
    } finally {
      setActionLoading(false);
    }
  };

  const clearCompleted = async () => {
    try {
      setActionLoading(true);
      await api.post("/shopping-items/clear-completed");
      await fetchItems();
    } catch (err) {
      console.error("Error limpiando completados", err);
    } finally {
      setActionLoading(false);
    }
  };

  const markAllCompleted = async () => {
    try {
      setActionLoading(true);
      await api.post("/shopping-items/mark-all-completed");
      await fetchItems();
      window.dispatchEvent(new Event("shoppingUpdated"));
    } catch (err) {
      console.error("Error marcando todo como completado", err);
    } finally {
      setActionLoading(false);
    }
  };

  const handleOpenCreate = () => {
    setCreateError("");
    setCreateForm({ text: "", quantity: "" });
    setCreateModalOpen(true);
  };

  const handleCloseCreate = () => {
    if (createLoading) return;
    setCreateModalOpen(false);
  };

  const handleCreateItem = async () => {
    const textValue = createForm.text.trim();

    if (!textValue) {
      setCreateError("Debes escribir el nombre del producto.");
      setTimeout(() => {
        setCreateError("");
      }, 7000);
      return;
    };

    const regex = /^[a-zA-ZñÑáéíóúÁÉÍÓÚüÜ\s]+$/;
    if (!regex.test(textValue)) {
      setCreateError("El nombre solo puede contener letras.");
      setTimeout(() => setCreateError(""), 5000);
      return;
    }

    setCreateLoading(true);
    setCreateError("");

    try {
      const quantity = createForm.quantity ? parseInt(createForm.quantity, 10) : 1;

      await api.post("/shopping-items", {
        text: textValue,
        quantity: isNaN(quantity) ? 1 : quantity,
      });

      setCreateForm({ text: "", quantity: "" });
      setCreateModalOpen(false);
      await fetchItems();
      window.dispatchEvent(new Event("shoppingUpdated"));
    } catch (error) {
      setCreateError(error?.response?.data?.error || "No se pudo agregar el producto.");
      setTimeout(() => {
        setCreateError("");
      }, 7000);
    } finally {
      setCreateLoading(false);
    }
  };

  useEffect(() => {
    fetchItems();

    const handleShoppingUpdate = () => {
      fetchItems();
    };

    window.addEventListener("shoppingUpdated", handleShoppingUpdate);

    return () => {
      window.removeEventListener("shoppingUpdated", handleShoppingUpdate);
    };
  }, []);

  const pendingItems = items.filter(i => !i.completed);
  const completedItems = items.filter(i => i.completed);

  const ActionButtons = ({ handleOpenCreate, isMobile = false }) => (
    <Box
      sx={{
        display: isMobile ? { xs: "flex", md: "none" } : { xs: "none", md: "flex" },
        mt: isMobile ? 2 : 0,
        mb: isMobile ? 1 : 0,
        width: isMobile ? "100%" : "auto",
        mb: 2,
      }}
    >
      <Button
        variant="contained"
        onClick={handleOpenCreate}
        sx={{
          borderRadius: 2,
          boxShadow: 3,
          backgroundColor: "#7d745c",
          color: "#ffffff",
          textTransform: "none",
          "&:hover": {
            backgroundColor: "#67604d"
          },
          fontSize: "1rem",
          width: { xs: "100%", sm: "100%", md: "fit-content" },
          minWidth: "auto",
          whiteSpace: "nowrap",
          px: 2,
        }}
      >
        <AddRoundedIcon fontSize="medium" sx={{ mr: 1 }} /> Agregar producto
      </Button>
    </Box>
  );

  return (
    <Box sx={{
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      flexGrow: 1,
      width: "100%",
      height: "100%",
      overflow: "auto",
      background: `url(${fondoChatAI})`,
      backgroundSize: "cover",
      backgroundPosition: "center",
      backgroundRepeat: "no-repeat",
      p: 2
    }}>
      <Paper
        sx={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "flex-start",
          width: "100%",
          p: { xs: 2, sm: 2, md: 2 },
          borderRadius: 4,
          background: "transparent",
          flexGrow: 1,
          boxShadow: 0,
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
        <Stack
          direction={{ xs: "column", sm: "row" }}
          alignItems="center"
          justifyContent="space-between"
          spacing={2}
        >
          <Stack direction="row" alignItems="center" spacing={1}>
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
            }}>
              Lista de compras <ShoppingCartRoundedIcon fontSize="medium" sx={{ color: "#000000", ml: 1 }} />
            </Typography>
          </Stack>
          <ActionButtons handleOpenCreate={handleOpenCreate} isMobile={false} />
        </Stack>
        <Typography variant="body2" sx={{
          color: "#000000",
          my: 1,
          fontSize: {
            xs: "1rem",
            sm: "1rem",
            md: "1.2rem",
            lg: "1.3rem",
            xl: "1.3rem",
          },
          textAlign: { xs: "center", sm: "center", md: "start" },
          lineHeight: 1.8,
        }}>
          Tu lista personal para que nunca olvides lo que necesitas. Planifica tus compras del día a día de forma sencilla.
        </Typography>
        <Divider sx={{ borderColor: "rgba(0,0,0,0.1)" }} />
        <Box>
          <ActionButtons handleOpenCreate={handleOpenCreate} isMobile={true} />
        </Box>
        <Grid container spacing={3} sx={{ mt: { xs: 1, sm: 1, md: 2, lg: 2, xl: 2 } }}>
          <Grid
            size={{
              xs: 12,
              sm: 12,
              md: 12,
              lg: 6
            }}
          >
            <Box
              sx={{
                flex: 1,
                width: "100%",
                height: "100%",
                overflow: "hidden",
                display: "flex",
                flexDirection: "column",
                borderRadius: 3,
                textAlign: "center",
                border: `1px solid ${theme.palette.divider}`,
                backgroundColor: "#d7d6d6",
                maxHeight: { xs: "500px", md: "80vh" },
                minHeight: { md: "600px" },
                boxShadow: 3,
                p: { xs: 2, sm: 2, md: 2 },
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
              <Box sx={{
                borderRadius: 3,
                border: `1px solid ${theme.palette.divider}`,
                p: 3,
                textAlign: "center",
                color: theme.palette.text.primary,
                mb: 2,
                boxShadow: 3
              }}>
                <Typography variant="h5" sx={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  color: "#000000",
                  fontSize: {
                    xs: "1rem",
                    sm: "1rem",
                    md: "1.2rem",
                    lg: "1.3rem",
                    xl: "1.3rem",
                  },
                }}>
                  <PendingActionsRoundedIcon fontSize="medium" sx={{ mr: 1 }} />Articulos pendientes de compra
                </Typography>
              </Box>
              <Box sx={{
                overflowY: "auto",
                flexGrow: 1,
                minHeight: 0,
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
                maxHeight: { xs: "400px", md: "none" },
                width: "100%",
              }}>
                <List sx={{ py: 0 }}>
                  {loadingItems ? (
                    <Box sx={{ display: "flex", justifyContent: "center", py: 4 }}>
                      <CircularProgress sx={{ color: "#000000" }} />
                    </Box>
                  ) : pendingItems.map((item) => (
                    <ListItem key={item.id} divider sx={{ backgroundColor: "#c1c1c1", borderRadius: 3, color: "#000000" }}>
                      <Checkbox
                        checked={item.completed}
                        onChange={() => toggleItem(item.id)}
                        disabled={actionLoading}
                        sx={{ color: "#000000" }}
                      />
                      <ListItemText
                        primary={`${item.text} ${item.quantity ? `(x${item.quantity})` : ""
                          }`}
                      />
                    </ListItem>
                  ))}
                </List>
                {!loadingItems && pendingItems.length === 0 && (
                  <>
                    <Typography variant="h6" sx={{
                      color: "#000000",
                      fontSize: {
                        xs: "1rem",
                        sm: "1rem",
                        md: "1rem",
                        lg: "1.1rem",
                        xl: "1.1rem",
                      },
                      lineHeight: 1.8,
                    }}>
                      No hay productos pendientes.
                    </Typography>
                    <Typography
                      variant="caption"
                      sx={{
                        color: "rgba(0, 0, 0, 0.6)",
                        display: "block",
                        lineHeight: 1.5,
                        textAlign: "center",
                        fontSize: {
                          xs: "0.75rem",
                          md: "1rem"
                        },
                        mt: 1
                      }}
                    >
                      Puedes agregar productos pidiéndoselo a Teresa o ingresando uno manualmente apretando el botón de "Agregar producto"
                    </Typography>
                  </>
                )}
              </Box>
              <Box>
                {pendingItems.length > 0 && (
                  <Button
                    variant="outlined"
                    onClick={markAllCompleted}
                    disabled={actionLoading}
                    sx={{
                      borderRadius: 2,
                      display: "flex",
                      borderColor: "#7d745c",
                      color: "#000000",
                      textTransform: "none",
                      width: { xs: "100%", sm: "auto" },
                      boxShadow: 3,
                      fontSize: "1rem",
                      my: 2,
                      ml: "auto",
                      "&:hover": {
                        borderColor: "#6a5f49",
                        backgroundColor: "rgba(125, 116, 92, 0.08)"
                      }
                    }}
                  >
                    <DoneAllRoundedIcon fontSize="small" sx={{ color: "#000000", mr: 1 }} /> Marcar todo completado
                  </Button>
                )}
              </Box>
            </Box>
          </Grid>
          <Grid
            size={{
              xs: 12,
              sm: 12,
              md: 12,
              lg: 6
            }}
          >
            {completedItems.length > 0 && (
              <Box
                sx={{
                  flex: 1,
                  width: "100%",
                  height: "100%",
                  overflow: "hidden",
                  display: "flex",
                  flexDirection: "column",
                  borderRadius: 3,
                  textAlign: "center",
                  border: `1px solid ${theme.palette.divider}`,
                  backgroundColor: "#d7d6d6",
                  maxHeight: { xs: "500px", md: "80vh" },
                  minHeight: { md: "600px" },
                  boxShadow: 3,
                  p: { xs: 2, sm: 2, md: 2 },
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
                <Box sx={{
                  borderRadius: 3,
                  border: `1px solid ${theme.palette.divider}`,
                  p: 3,
                  textAlign: "center",
                  color: theme.palette.text.primary,
                  mb: 2,
                  boxShadow: 3
                }}>
                  <Typography variant="h5" sx={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    color: "#000000",
                    fontSize: {
                      xs: "1rem",
                      sm: "1rem",
                      md: "1.2rem",
                      lg: "1.3rem",
                      xl: "1.3rem",
                    },
                  }}>
                    <InventoryRoundedIcon fontSize="medium" sx={{ mr: 1 }} />Articulos comprados
                  </Typography>
                </Box>
                <Box sx={{
                  overflowY: "auto",
                  flexGrow: 1,
                  minHeight: 0,
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
                  maxHeight: { xs: "400px", md: "none" },
                  width: "100%",
                }}>
                  <List sx={{ py: 0 }}>
                    {completedItems.map((item) => (
                      <ListItem key={item.id} divider sx={{ backgroundColor: "#c1c1c1", borderRadius: 3, color: "#000000" }}>
                        <Checkbox
                          checked={item.completed}
                          onChange={() => toggleItem(item.id)}
                          disabled={actionLoading}
                          sx={{
                            color: "#000000",
                            '&.Mui-checked': {
                              color: "#4c9eaa "
                            },
                          }}
                        />
                        <ListItemText
                          primary={`${item.text} ${item.quantity ? `(x${item.quantity})` : ""
                            }`}
                          sx={{
                            textDecoration: "line-through",
                            color: "#000000",
                            opacity: 0.6,
                            fontSize: "1rem"
                          }}
                        />
                      </ListItem>
                    ))}
                  </List>
                </Box>
                <Box>
                  <Button
                    variant="contained"
                    color="error"
                    sx={{
                      my: 2,
                      borderRadius: 2,
                      ml: "auto",
                      fontSize: "1rem",
                      display: "flex",
                      width: { xs: "100%", sm: "auto" },
                      boxShadow: 3,
                      textTransform: "none"
                    }}
                    onClick={clearCompleted}
                    disabled={actionLoading}
                  >
                    <DeleteRoundedIcon fontSize="small" sx={{ color: "#ffffff", mr: 1 }} /> Eliminar artículos
                  </Button>
                </Box>
              </Box>
            )}
          </Grid>
        </Grid>

        <Modal
          open={createModalOpen}
          onClose={handleCloseCreate}
          aria-labelledby="modal-title"
        >
          <Box sx={styleModal}>
            <Box sx={{ mb: 1, borderBottom: '1px solid rgba(0,0,0,0.1)' }}>
              <Typography
                id="modal-title"
                variant="h5"
                sx={{
                  display: "flex",
                  justifyContent: "flex-start",
                  alignItems: "center",
                  color: "#000000",
                  fontWeight: 600,
                  mb: 1
                }}
              >
                Agregar producto nuevo <AddShoppingCartRoundedIcon fontSize="medium" sx={{ color: "#000000", ml: 1 }} />
              </Typography>
            </Box>
            <Box sx={{ mt: 2 }}>
              <Stack spacing={3}>
                {createError ? <Alert variant="filled" severity="error" sx={{
                  boxShadow: 4,
                  borderRadius: 3,
                  fontSize: "1rem",
                }}>{createError}</Alert> : null}
                <Box sx={{ my: 0, width: "100%" }}>
                  <Typography variant="body1" sx={{ color: "#000000" }}>Nombre del producto</Typography>
                  <TextField
                    type="text"
                    value={createForm.text}
                    onChange={(event) => setCreateForm((prev) => ({ ...prev, text: event.target.value }))}
                    fullWidth
                    placeholder="Ej: Leche, Pan, Frutas..."
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <Box sx={{ display: "flex", alignItems: "center", justifyContent: "flex-start", color: "#ffffff" }}>
                            <LocalOfferRoundedIcon fontSize='medium' sx={{ mr: 1, color: "#000000" }} />
                          </Box>
                        </InputAdornment>
                      ),
                    }}
                    sx={{
                      backgroundColor: "#d7d6d6",
                      borderRadius: 3,
                      boxShadow: 3,
                      input: { color: "#000000" },
                      "& .MuiInputLabel-root": {
                        color: "#000000",
                        opacity: 0.8
                      },
                      "& .MuiInputLabel-root.Mui-focused": {
                        color: "#000000 !important"
                      },
                      "& .MuiInputBase-input::placeholder": {
                        color: "#000000",
                        opacity: 0.6,
                      },
                      "& .MuiOutlinedInput-root": {
                        borderRadius: 3,
                        pr: 1,
                        "& fieldset": {
                          borderColor: "transparent"
                        },
                        "&:hover fieldset": {
                          borderColor: "transparent"
                        },
                        "&.Mui-focused fieldset": {
                          borderColor: "gray"
                        },
                      },
                      "& .MuiFormHelperText-root": {
                        color: "#000000 !important",
                        opacity: 0.8,
                        fontWeight: 500,
                      },
                    }}
                  />
                </Box>
                <Box sx={{ my: 0, width: "100%" }}>
                  <Typography variant="body1" sx={{ color: "#000000" }}>Cantidad (opcional)</Typography>
                  <TextField
                    value={createForm.quantity}
                    onChange={(event) => setCreateForm((prev) => ({ ...prev, quantity: event.target.value }))}
                    fullWidth
                    type="number"
                    inputProps={{ min: "1" }}
                    placeholder="Ej: 2, 5, 10..."
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <Box sx={{ display: "flex", alignItems: "center", justifyContent: "flex-start", color: "#ffffff" }}>
                            <PlusOneRoundedIcon fontSize='medium' sx={{ mr: 1, color: "#000000" }} />
                          </Box>
                        </InputAdornment>
                      ),
                    }}
                    sx={{
                      backgroundColor: "#d7d6d6",
                      borderRadius: 3,
                      boxShadow: 3,
                      input: { color: "#000000" },
                      "& .MuiInputLabel-root": {
                        color: "#000000",
                        opacity: 0.8
                      },
                      "& .MuiInputLabel-root.Mui-focused": {
                        color: "#000000 !important"
                      },
                      "& .MuiInputBase-input::placeholder": {
                        color: "#000000",
                        opacity: 0.6,
                      },
                      "& .MuiOutlinedInput-root": {
                        borderRadius: 3,
                        pr: 1,
                        "& fieldset": {
                          borderColor: "transparent"
                        },
                        "&:hover fieldset": {
                          borderColor: "transparent"
                        },
                        "&.Mui-focused fieldset": {
                          borderColor: "gray"
                        },
                      },
                      "& .MuiFormHelperText-root": {
                        color: "#000000 !important",
                        opacity: 0.8,
                        fontWeight: 500,
                      },
                    }}
                  />
                </Box>
              </Stack>
            </Box>
            <Divider sx={{ borderColor: "rgba(0, 0, 0, 0.18)", my: 2 }} />
            <Box sx={{
              display: 'flex',
              justifyContent: 'flex-end',
              gap: 2,
            }}>
              <Button
                onClick={handleCloseCreate}
                disabled={createLoading || actionLoading}
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
                Cancelar
              </Button>
              <Button
                variant="contained"
                onClick={handleCreateItem}
                disabled={createLoading || actionLoading}
                sx={{
                  backgroundColor: "#7d745c",
                  borderRadius: 2,
                  color: "#ffffff",
                  textTransform: "none",
                  fontSize: "1rem",
                  "&:hover": {
                    backgroundColor: "#67604d"
                  },
                  "&.Mui-disabled": {
                    backgroundColor: "#5a5342",
                    color: "#ffffff !important",
                  },
                  mt: 1
                }}
              >
                {createLoading ? (
                  <>
                    <CircularProgress size={20} sx={{ color: "#ffffff", mr: 2 }} />
                    Agregando
                  </>
                ) : "Agregar producto"}
              </Button>
            </Box>
          </Box>
        </Modal>
      </Paper>
    </Box>
  );
}
