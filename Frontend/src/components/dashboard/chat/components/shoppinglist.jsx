import { useEffect, useState } from "react";
import api from "../../../../api/axios";
import {
  Box,
  Typography,
  Paper,
  List,
  ListItem,
  ListItemText,
  Checkbox,
  Button,
  Divider
} from "@mui/material";

export default function ShoppingList() {

  const [items, setItems] = useState([]);

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
    <Box sx={{ width: "100%", p: 3 }}>

      <Typography variant="h5" sx={{ mb: 2 }}>
        🛒 Lista de compras
      </Typography>

      <Paper sx={{ p: 2 }}>

        {/* ITEMS PENDIENTES */}

        <Typography variant="h6" sx={{ mb: 1 }}>
          Pendientes
        </Typography>

        <List>

          {pendingItems.map((item) => (
            <ListItem key={item.id} divider>

              <Checkbox
                checked={item.completed}
                onChange={() => toggleItem(item.id)}
              />

              <ListItemText
                primary={`${item.text} ${item.quantity ? `(x${item.quantity})` : ""}`}
              />

            </ListItem>
          ))}

        </List>

        {pendingItems.length === 0 && (
          <Typography sx={{ mt: 1 }}>
            No hay artículos pendientes.
          </Typography>
        )}

        {/* COMPLETADOS */}

        {completedItems.length > 0 && (
          <>
            <Divider sx={{ my: 3 }} />

            <Typography variant="h6" sx={{ mb: 1 }}>
              ✅ Comprados
            </Typography>

            <List>

              {completedItems.map((item) => (
                <ListItem key={item.id} divider>

                  <Checkbox
                    checked={item.completed}
                    onChange={() => toggleItem(item.id)}
                  />

                  <ListItemText
                    primary={`${item.text} ${item.quantity ? `(x${item.quantity})` : ""}`}
                    sx={{
                      textDecoration: "line-through",
                      color: "text.secondary"
                    }}
                  />

                </ListItem>
              ))}

            </List>

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

      </Paper>

    </Box>
  );
}