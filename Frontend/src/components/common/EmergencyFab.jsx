import { useEffect, useState } from "react";
import {
  Alert,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Fab,
  Button,
  Snackbar,
  TextField,
  Tooltip,
} from "@mui/material";
import WarningRoundedIcon from "@mui/icons-material/WarningRounded";
import { useAuth } from "../auth/useAuth.jsx";
import { supabase } from "../../supabaseClient.js";
import api from "../../api/axios.js";

const ELDER_ROLE = "elder";

const getErrorMessage = (error) =>
  error?.response?.data?.error ||
  error?.message ||
  "No se pudo activar la alerta de emergencia.";

function EmergencyFab() {
  const { user, loading } = useAuth();
  const [role, setRole] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [reason, setReason] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    severity: "success",
    message: "",
  });

  useEffect(() => {
    let cancelled = false;

    const loadRole = async () => {
      if (!user?.id) {
        setRole(null);
        return;
      }

      const { data, error } = await supabase
        .schema("public")
        .from("profiles")
        .select("role")
        .eq("id", user.id)
        .maybeSingle();

      if (cancelled) return;

      if (error) {
        setRole(null);
        return;
      }

      setRole(String(data?.role || "").trim().toLowerCase() || null);
    };

    loadRole();

    return () => {
      cancelled = true;
    };
  }, [user?.id]);

  const isVisible = !loading && Boolean(user?.id) && role === ELDER_ROLE;

  const handleOpen = () => {
    setDialogOpen(true);
  };

  const handleClose = () => {
    if (submitting) return;
    setDialogOpen(false);
  };

  const handleSubmit = async () => {
    setSubmitting(true);

    try {
      const message = reason.trim();
      const { data } = await api.post("/emergency/trigger", {
        source: "panic_button",
        message,
      });

      const notifiedCount = data?.summary?.totalRecipients ?? 0;
      setSnackbar({
        open: true,
        severity: "success",
        message: `Alerta enviada. Se notifico a ${notifiedCount} familiar(es).`,
      });

      setReason("");
      setDialogOpen(false);
    } catch (error) {
      setSnackbar({
        open: true,
        severity: "error",
        message: getErrorMessage(error),
      });
    } finally {
      setSubmitting(false);
    }
  };

  if (!isVisible) return null;

  return (
    <>
      <Tooltip title="Emergencia" placement="left">
        <Fab
          color="error"
          aria-label="emergencia"
          onClick={handleOpen}
          sx={{
            position: "fixed",
            right: { xs: 16, md: 24 },
            bottom: { xs: 16, md: 24 },
            zIndex: (theme) => theme.zIndex.modal + 2,
          }}
        >
          <WarningRoundedIcon />
        </Fab>
      </Tooltip>

      <Dialog open={dialogOpen} onClose={handleClose} fullWidth maxWidth="sm">
        <DialogTitle sx={{ fontFamily: "'Lora', serif", fontWeight: 700 }}>
          Alerta de emergencia
        </DialogTitle>
        <DialogContent>
          <Alert severity="warning" sx={{ mb: 2 }}>
            Se enviara un SMS y se iniciara una llamada automatica a tus familiares vinculados.
          </Alert>
          <TextField
            label="Detalle opcional"
            placeholder="Ejemplo: me siento mareado y necesito ayuda"
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            multiline
            minRows={3}
            fullWidth
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} disabled={submitting}>
            Cancelar
          </Button>
          <Button
            onClick={handleSubmit}
            variant="contained"
            color="error"
            disabled={submitting}
          >
            {submitting ? "Enviando..." : "Enviar alerta"}
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={4500}
        onClose={() => setSnackbar((prev) => ({ ...prev, open: false }))}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          severity={snackbar.severity}
          variant="filled"
          onClose={() => setSnackbar((prev) => ({ ...prev, open: false }))}
          sx={{ width: "100%" }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </>
  );
}

export default EmergencyFab;
