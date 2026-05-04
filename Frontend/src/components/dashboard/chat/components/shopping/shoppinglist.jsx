import { useEffect, useState } from "react";
import api from "../../../../../api/axios";
import fondoChatAI from "../../../../../assets/images/fondoChatAI.png";
import { Box, Typography, Paper, List, ListItem, ListItemText, Checkbox, Button, Divider, Dialog, DialogTitle, DialogContent, DialogActions, TextField, Stack, Alert } from "@mui/material";
import AddRoundedIcon from "@mui/icons-material/AddRounded";

export default function ShoppingList() {

  const [items, setItems] = useState([]);
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [createLoading, setCreateLoading] = useState(false);
  const [createError, setCreateError] = useState("");
  const [createForm, setCreateForm] = useState({
    text: "",
    quantity: "",
  });

  const fetchItems = async () => {
    try {
      const res = await api.get("/shopping-items");
      setItems(res.data.items || []);
    } catch (err) {
      console.error("Error cargando lista de compras", err);
    }
  };

  const toggleItem = async (itemId) => {
    try {
      await api.post("/shopping-items/toggle", { itemId });
      fetchItems();
    } catch (err) {
      console.error("Error actualizando item", err);
    }
  };

  const clearCompleted = async () => {
    try {
      await api.post("/shopping-items/clear-completed");
      fetchItems();
    } catch (err) {
      console.error("Error limpiando completados", err);
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
          p: { xs: 2, sm: 3, md: 3 },
          borderRadius: 4,
          background: "transparent",
          flexGrow: 0,
        }}
      >
        <Stack
          direction={{ xs: "column", sm: "row" }}
          alignItems="center"
          justifyContent="space-between"
          spacing={2}
          sx={{ mb: 1 }}
        >
          <Typography variant="h3" sx={{
            fontSize: {
              xs: "1.5rem",
              sm: "1.5rem",
              md: "1.5rem",
              lg: "1.7rem",
              xl: "1.8rem"
            },
            textAlign: { xs: "center", sm: "center", md: "start" },
            fontFamily: "'Lora', serif",
          }}>
            Lista de compras 🛒
          </Typography>
          <Button
            variant="contained"
            onClick={handleOpenCreate}
            startIcon={<AddRoundedIcon />}
            sx={{ fontFamily: "'Lora', serif", fontWeight: 700 }}
          >
            Agregar producto
          </Button>
        </Stack>
        <Typography variant="body2" sx={{
          my: 1,
          fontSize: {
            xs: "1rem",
            sm: "1rem",
            md: "1.2rem",
            lg: "1.3rem",
            xl: "1.3rem",
          },
          textAlign: { xs: "center", sm: "center", md: "start" },
          fontFamily: "'Lora', serif",
          lineHeight: 1.8,
        }}>
          Tu lista personal para que nunca olvides lo que necesitas. Planifica tus compras del día a día de forma sencilla.
        </Typography>
        <Divider sx={{
          width: "100%",
          "&::before, &::after": {
            borderColor: "#ffffff",
          }
        }}>
          <Typography variant="body1" sx={{ color: "#ffffff" }}>~</Typography>
        </Divider>
        <Typography variant="h7" sx={{
          textAlign: { xs: "center", sm: "center", md: "start" },
          fontFamily: "'Lora', serif",
        }}>
          Pendientes
        </Typography>
        <Box
          sx={{
            flex: 1,
            overflowY: "auto",

            minHeight: 0,
            pr: 1
          }}
        >
          <List>
            {pendingItems.map((item) => (
              <ListItem key={item.id} divider>
                <Checkbox
                  checked={item.completed}
                  onChange={() => toggleItem(item.id)}
                />
                <ListItemText
                  primary={`${item.text} ${item.quantity ? `(x${item.quantity})` : ""
                    }`}
                />
              </ListItem>
            ))}
          </List>
          {pendingItems.length === 0 && (
            <Typography variant="h7" sx={{
              textAlign: { xs: "center", sm: "center", md: "start" },
              fontFamily: "'Lora', serif",
              lineHeight: 1.8,
            }}>
              No hay artículos pendientes.
            </Typography>
          )}
        </Box>
        {completedItems.length > 0 && (
          <>
            <Divider sx={{ my: 2 }} />

            <Typography variant="h6" sx={{ mb: 1 }}>
              Comprados
            </Typography>

            <Box
              sx={{
                maxHeight: "30%",
                overflowY: "auto",
                minHeight: 0,
                pr: 1
              }}
            >
              <List>
                {completedItems.map((item) => (
                  <ListItem key={item.id} divider>
                    <Checkbox
                      checked={item.completed}
                      onChange={() => toggleItem(item.id)}
                    />
                    <ListItemText
                      primary={`${item.text} ${item.quantity ? `(x${item.quantity})` : ""
                        }`}
                      sx={{
                        textDecoration: "line-through",
                        color: "text.secondary"
                      }}
                    />
                  </ListItem>
                ))}
              </List>
            </Box>
            <Button
              variant="outlined"
              color="error"
              sx={{ mt: 2 }}
              onClick={clearCompleted}
            >
              Eliminar artículos comprados
            </Button>
          </>
        )}

        <Dialog open={createModalOpen} onClose={handleCloseCreate} fullWidth maxWidth="sm">
          <DialogTitle sx={{ fontFamily: "'Lora', serif", fontWeight: 700 }}>Agregar producto nuevo</DialogTitle>
          <DialogContent>
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
            <Button onClick={handleCloseCreate} disabled={createLoading}>
              Cancelar
            </Button>
            <Button variant="contained" onClick={handleCreateItem} disabled={createLoading}>
              {createLoading ? "Agregando..." : "Agregar producto"}
            </Button>
          </DialogActions>
        </Dialog>
      </Paper>
    </Box>
  );
}