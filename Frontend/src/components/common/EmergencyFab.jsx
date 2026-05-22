import { useEffect, useState } from "react";
import { Alert, Box, Fab, Snackbar, Tooltip, useMediaQuery } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import CircularProgress from '@mui/material/CircularProgress';
import WarningRoundedIcon from "@mui/icons-material/WarningRounded";
import { useAuth } from "../auth/useAuth.jsx";
import { supabase } from "../../supabaseClient.js";
import api from "../../api/axios.js";

const ELDER_ROLE = "elder";

const getErrorMessage = (error) =>
  error?.response?.data?.error ||
  error?.message ||
  "No se pudo activar la alerta de emergencia.";

function EmergencyFab({ inline = false }) {
  const { user, loading } = useAuth();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const [role, setRole] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
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

  useEffect(() => {
    if (typeof window === "undefined") return undefined;

    const handleSidebarState = (event) => {
      setSidebarOpen(Boolean(event?.detail?.open));
    };

    window.addEventListener("teresai:dashboard-sidebar", handleSidebarState);

    return () => {
      window.removeEventListener("teresai:dashboard-sidebar", handleSidebarState);
    };
  }, []);

  const isVisible = !loading && Boolean(user?.id) && role === ELDER_ROLE;

  if (!isVisible) return null;
  if (!inline && isMobile) return null;
  if (sidebarOpen) return null;

  const handleTriggerEmergency = async () => {
    setSubmitting(true);

    try {
      const { data } = await api.post("/emergency/trigger", {
        source: "panic_button",
        message: "",
      });

      const notifiedCount = data?.summary?.totalRecipients ?? 0;
      setSnackbar({
        open: true,
        severity: "success",
        message: `Alerta de emergencia enviada. Se notificó a ${notifiedCount} familiar(es). Por favor, aguarde`,
      });
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

  const fabSx = inline
    ? {
      position: "static",
      width: 44,
      height: 44,
      minWidth: 44,
      flexShrink: 0,
      boxShadow: "0 10px 20px rgba(176, 0, 32, 0.25)",
    }
    : {
      position: "fixed",
      top: { xs: 88, md: "auto" },
      right: { xs: 16, md: 24 },
      bottom: { xs: "auto", md: 24 },
      left: "auto",
      zIndex: (themeValue) => themeValue.zIndex.modal + 2,
    };

  return (
    <>
      <Tooltip title="Emergencia" placement={inline ? "bottom" : "right"}>
        <Fab
          color="error"
          aria-label="emergencia"
          onClick={handleTriggerEmergency}
          disabled={submitting}
          size={inline ? "large" : "large"}
          sx={fabSx}
        > {submitting ? (
          <CircularProgress
            size={30}
            sx={{
              color: "#000000",
              marginRight: "10px"
            }}
          />
        )
          : (
            <WarningRoundedIcon sx={{ fontSize: inline ? 22 : 24 }} />
          )
          }
        </Fab>
      </Tooltip>

      {snackbar.open && (
        <Alert
          severity={snackbar.severity}
          variant="filled"
          onClose={() => setSnackbar((prev) => ({ ...prev, open: false }))}
          sx={{
            position: "fixed",
            top: 20,
            left: "50%",
            boxShadow: 4,
            borderRadius: 3,
            fontSize: "1rem",
            left: "50%",
            transform: "translateX(-50%)",
            zIndex: (theme) => theme.zIndex.modal + 3,
            width: { xs: "90%", sm: "auto" },
            color: "#ffffff"
          }}
        >
          {snackbar.message}
        </Alert>
      )}
    </>
  );
}

export default EmergencyFab;
