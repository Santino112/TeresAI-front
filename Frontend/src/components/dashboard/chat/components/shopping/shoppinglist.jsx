import { useEffect, useState } from "react";
import api from "../../../../../api/axios";
import fondoChatAI from "../../../../../assets/images/fondoChatAI.png";
import { Box, Typography, TextField, Paper, List, ListItem, ListItemText, Checkbox, Button, Divider, useTheme, Dialog, DialogTitle, DialogContent, DialogActions, Stack, Alert, CircularProgress } from "@mui/material";
import ShoppingCartRoundedIcon from '@mui/icons-material/ShoppingCartRounded';
import AddRoundedIcon from '@mui/icons-material/AddRounded';
import DoneAllRoundedIcon from '@mui/icons-material/DoneAllRounded';

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
    if (!createForm.text.trim()) {
      setCreateError("Debes escribir el nombre del producto.");
      return;
    }

    setCreateLoading(true);
    setCreateError("");

    try {
      const quantity = createForm.quantity ? parseInt(createForm.quantity, 10) : 1;
      
      await api.post("/shopping-items", {
        text: createForm.text.trim(),
        quantity: isNaN(quantity) ? 1 : quantity,
      });

      setCreateModalOpen(false);
      await fetchItems();
      window.dispatchEvent(new Event("shoppingUpdated"));
    } catch (error) {
      setCreateError(error?.response?.data?.error || "No se pudo agregar el producto.");
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
                <Stack
          direction={{ xs: "column", sm: "row" }}
          spacing={1}
          justifyContent="space-between"
          alignItems={{ xs: "stretch", sm: "center" }}
          sx={{ mt: 2, mb: 1 }}
        >
          <Button
            variant="contained"
            onClick={handleOpenCreate}
            startIcon={<AddRoundedIcon />}
            sx={{
              borderRadius: 2,
              backgroundColor: "#7d745c",
              color: "#ffffff",
              fontFamily: "'Lora', serif",
              fontWeight: 700,
              "&:hover": { backgroundColor: "#6a5f49" }
            }}
          >
            Agregar producto
          </Button>
          <Stack direction={{ xs: "column", sm: "row" }} spacing={1}>
            <Button
              variant="outlined"
              onClick={markAllCompleted}
              disabled={actionLoading || pendingItems.length === 0}
              startIcon={<DoneAllRoundedIcon />}
              sx={{
                borderRadius: 2,
                borderColor: "#7d745c",
                color: "#7d745c",
                fontFamily: "'Lora', serif",
                fontWeight: 700,
                "&:hover": {
                  borderColor: "#6a5f49",
                  backgroundColor: "rgba(125, 116, 92, 0.08)"
                }
              }}
            >
              Marcar todo completado
            </Button>
          </Stack>
        </Stack>
        <Box
          sx={{
            my: 2,
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
            maxHeight: "500px",
            minHeight: 0,
            p: { xs: 2, sm: 3, md: 3 },
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
            <Typography variant="h7" sx={{
              color: "#000000",
              fontSize: {
                xs: "1.1rem",
                sm: "1.1rem",
                md: "1.2rem",
                lg: "1.3rem",
                xl: "1.3rem",
              },
            }}>
              Articulos pendientes de compra
            </Typography>
          </Box>
          <Box sx={{
            overflowY: "auto",
            flexGrow: 1,
            minHeight: 0,
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
            maxHeight: "400px",
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
              <Typography variant="h7" sx={{
                color: "#000000",
                fontSize: {
                  xs: "1.1rem",
                  sm: "1.1rem",
                  md: "1.2rem",
                  lg: "1.3rem",
                  xl: "1.3rem",
                },
                lineHeight: 1.8,
              }}>
                No hay artículos pendientes.
              </Typography>
            )}
          </Box>
        </Box>
        {completedItems.length > 0 && (
          <>
            <Box
              sx={{
                my: 2,
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
                maxHeight: "500px",
                minHeight: 0,
                p: { xs: 2, sm: 3, md: 3 },
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
                boxShadow: 3,
                mb: 2
              }}>
                <Typography variant="h6" sx={{
                  color: "#000000",
                  fontSize: {
                    xs: "1.1rem",
                    sm: "1.1rem",
                    md: "1.2rem",
                    lg: "1.3rem",
                    xl: "1.3rem",
                  },
                }}>
                  Articulos comprados
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
                maxHeight: "400px",
                width: "100%",
              }}>
                <List>
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
                          fontFamily: "'Lora', serif",
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
                  sx={{ my: 2, borderRadius: 2, ml: "auto", display: "block", width: { xs: "100%", sm: "auto" }, boxShadow: 3 }}
                  onClick={clearCompleted}
                  disabled={actionLoading}
                >
                  Eliminar artículos
                </Button>
              </Box>
            </Box>
          </>
        )}

        <Dialog open={createModalOpen} onClose={handleCloseCreate} fullWidth maxWidth="sm">
          <DialogTitle sx={{ fontFamily: "'Lora', serif", fontWeight: 700, bgcolor: "#d7d6d6", color: "#000000" }}>Agregar producto nuevo</DialogTitle>
          <DialogContent sx={{ bgcolor: "#d7d6d6" }}>
            <Stack spacing={2} sx={{ mt: 1 }}>
              {createError ? <Alert severity="error">{createError}</Alert> : null}
              <TextField
                label="Nombre del producto"
                value={createForm.text}
                onChange={(event) => setCreateForm((prev) => ({ ...prev, text: event.target.value }))}
                fullWidth
                required
                placeholder="Ej: Leche, Pan, Frutas..."
              />
              <TextField
                label="Cantidad (opcional)"
                value={createForm.quantity}
                onChange={(event) => setCreateForm((prev) => ({ ...prev, quantity: event.target.value }))}
                fullWidth
                type="number"
                inputProps={{ min: "1" }}
                placeholder="Ej: 2, 5, 10..."
              />
            </Stack>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseCreate} disabled={createLoading || actionLoading}>
              Cancelar
            </Button>
            <Button variant="contained" onClick={handleCreateItem} disabled={createLoading || actionLoading}>
              {createLoading ? "Agregando..." : "Agregar producto"}
            </Button>
          </DialogActions>
        </Dialog>
      </Paper>
    </Box>
  );
}
