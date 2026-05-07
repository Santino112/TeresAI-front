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
  Modal,
  Box,
  Typography,
  Divider,
  Stack
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

      <Modal
        open={dialogOpen}
        onClose={handleClose}
        aria-labelledby="modal-emergency-title"
      >
        <Box sx={styleModal}>
          <Typography id="modal-emergency-title" variant="h5" sx={{ fontWeight: 700, mb: 1 }}>
            Alerta de emergencia
          </Typography>
          <Divider sx={{ borderColor: "rgba(0,0,0,0.1)", mb: 2}} />
          <Stack spacing={3}>
            <Alert
              variant="filled"
              severity="warning"
              sx={{
                borderRadius: 2,
                fontWeight: 500
              }}
            >
              Se enviará un SMS y se iniciará una llamada automática a tus familiares vinculados.
            </Alert>
            <TextField
              placeholder="Ejemplo: me siento mareado y necesito ayuda"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              inputProps={{ maxLength: 2500 }}
              multiline
              minRows={5}
              maxRows={5}
              helperText={
                <span>500 caracteres</span>
              }
              fullWidth
              sx={{
                backgroundColor: "#d7d6d6",
                color: "#000000",
                borderRadius: 3,
                boxShadow: 3,
                "& .MuiInputBase-input": {
                  color: "#000000",
                  WebkitTextFillColor: "#000000",
                },
                "& textarea": {
                  color: "#000000",
                },
                "& .MuiOutlinedInput-root": {
                  borderRadius: 3,
                  pr: 1,
                },
                "& fieldset": {
                  borderColor: "transparent"
                },
                "& .MuiInputBase-input::placeholder": {
                  color: "#000000",
                  opacity: 0.6,
                },
                "&:hover fieldset": {
                  borderColor: "transparent"
                },
                "&.Mui-focused fieldset": {
                  borderColor: "gray"
                },
                "& .MuiFormHelperText-root": {
                  color: "#000000",
                  opacity: 0.8,
                  fontWeight: 500,
                },
              }}
            />

            <Box sx={{ mt: 2, display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
              <Button
                onClick={handleClose}
                disabled={submitting}
                sx={{
                  color: "#464545",
                  fontWeight: "bold",
                  borderRadius: 2,
                  textTransform: "none",
                  mr: 1,
                  mt: 1,
                  "&:hover": { backgroundColor: "#e0e0e0" },
                }}
              >
                Cancelar
              </Button>
              <Button
                onClick={handleSubmit}
                variant="contained"
                color="error" // Mantenemos el rojo para emergencias
                disabled={submitting}
                sx={{
                  borderRadius: 2,
                  textTransform: "none",
                  fontWeight: 600,
                  px: 3
                }}
              >
                {submitting ? "Enviando..." : "Enviar alerta"}
              </Button>
            </Box>
          </Stack>
        </Box>
      </Modal>

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
