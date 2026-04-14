import { useEffect, useState } from "react";
import api from "../../../../../api/axios";
import fondoChatAI from "../../../../../assets/images/fondoChatAI.png";
import { Box, Typography, Paper, List, ListItem, ListItemText, Checkbox, Button, Divider } from "@mui/material";

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
    <Box
      sx={{
        flexGrow: 1,
        display: "flex",
        flexDirection: "column",
        minHeight: 0,
      }}
    >
      <Box sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        flexGrow: 1,
        width: "100%",
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
        </Paper>
      </Box>
    </Box >
  );
}