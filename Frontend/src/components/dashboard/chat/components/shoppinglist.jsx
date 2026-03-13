import { useEffect, useState } from "react";
import api from "../../../../api/axios";
import {
  Box,
  Typography,
  Paper,
  List,
  ListItem,
  ListItemText
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

  useEffect(() => {
    fetchItems();

    const handleShoppingUpdate = () => {
      console.log("Actualizando lista de compras...");
      fetchItems();
    };
    window.addEventListener("shoppingUpdated", handleShoppingUpdate);
    return () => {
      window.removeEventListener("shoppingUpdated", handleShoppingUpdate);
    };
  }, []);

  return (
    <Box sx={{ width: "100%", p: 3 }}>
      <Typography variant="h5" sx={{ mb: 2 }}>
        🛒 Lista de compras
      </Typography>

      <Paper sx={{ p: 2 }}>
        <List>
          {items.map((item) => (
            <ListItem key={item.id} divider>
              <ListItemText primary={item.text} />
            </ListItem>
          ))}
        </List>

        {items.length === 0 && (
          <Typography sx={{ mt: 2 }}>
            No hay artículos en la lista todavía.
          </Typography>
        )}
      </Paper>
    </Box>
  );
}