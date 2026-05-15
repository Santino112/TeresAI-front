import { useEffect, useState } from "react";
import {
  Alert,
  Fab,
  Box,
  Button,
  Snackbar,
  SwipeableDrawer,
  Tooltip,
  Typography,
  useMediaQuery
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import WarningRoundedIcon from "@mui/icons-material/WarningRounded";
import KeyboardArrowLeftRoundedIcon from "@mui/icons-material/KeyboardArrowLeftRounded";
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
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const [role, setRole] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
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

  const isVisible = !loading && Boolean(user?.id) && role === ELDER_ROLE;

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
        message: `Alerta de emergencia enviada. Se notificó a ${notifiedCount} familiar(es).`,
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

  const closeMobileDrawer = () => {
    setDrawerOpen(false);
  };

  const openMobileDrawer = () => {
    setDrawerOpen(true);
  };

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

  if (!isVisible) return null;

  const hideEmergencyTrigger = sidebarOpen;

  return (
    <>
      {!isMobile ? (
        !hideEmergencyTrigger && (
        <Tooltip title="Emergencia" placement="right">
          <Fab
            color="error"
            aria-label="emergencia"
            onClick={handleTriggerEmergency}
            disabled={submitting}
            sx={{
              position: "fixed",
              top: { xs: 88, md: "auto" },
              right: { xs: 16, md: 24 },
              bottom: { xs: "auto", md: 24 },
              left: "auto",
              zIndex: (theme) => theme.zIndex.modal + 2,
            }}
            >
              <WarningRoundedIcon />
          </Fab>
        </Tooltip>
        )
      ) : (
        <>
          {!hideEmergencyTrigger && !drawerOpen && (
            <Button
              onClick={openMobileDrawer}
              aria-label="abrir emergencia"
              sx={{
                position: "fixed",
                left: 0,
                top: "30%",
                transform: "translateY(-50%)",
                zIndex: (theme) => theme.zIndex.modal + 3,
                minWidth: 0,
                width: 34,
                height: 85,
                borderTopRightRadius: 18,
                borderBottomRightRadius: 18,
                borderTopLeftRadius: 0,
                borderBottomLeftRadius: 0,
                background: "linear-gradient(180deg, #b00020 0%, #7a0015 100%)",
                color: "#fff",
                boxShadow: "8px 0 22px rgba(176, 0, 32, 0.28)",
                p: 0,
                "&:hover": {
                  background: "linear-gradient(180deg, #c40027 0%, #8c0018 100%)",
                },
              }}
            >
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 0.5,
                }}
              >
                <WarningRoundedIcon sx={{ fontSize: 22 }} />
                <Typography
                  variant="caption"
                  sx={{
                    fontSize: "0.65rem",
                    fontWeight: 800,
                    lineHeight: 1,
                    letterSpacing: "0.08em",
                    writingMode: "vertical-rl",
                    transform: "rotate(180deg)",
                  }}
                >
                </Typography>
              </Box>
            </Button>
          )}

          <SwipeableDrawer
            anchor="left"
            open={drawerOpen}
            onOpen={openMobileDrawer}
            onClose={closeMobileDrawer}
            disableBackdropTransition={false}
            disableDiscovery={false}
            swipeAreaWidth={32}
            PaperProps={{
              sx: {
                width: 240,
                borderTopRightRadius: 20,
                borderBottomRightRadius: 20,
                background: "linear-gradient(180deg, #fff3f3 0%, #ffe1e1 100%)",
                boxShadow: "20px 0 40px rgba(0,0,0,0.18)",
                overflow: "visible",
              },
            }}
            ModalProps={{
              keepMounted: true,
            }}
          >
            <Box
              sx={{
                height: "100%",
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                gap: 2,
                p: 2,
              }}
            >
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  gap: 1,
                }}
              >
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <WarningRoundedIcon sx={{ color: "#b00020" }} />
                  <Typography variant="subtitle1" sx={{ fontWeight: 700, color: "#7a0015" }}>
                    Emergencia
                  </Typography>
                </Box>
                <Button
                  onClick={closeMobileDrawer}
                  size="small"
                  sx={{
                    minWidth: 0,
                    px: 1,
                    color: "#7a0015",
                  }}
                >
                  <KeyboardArrowLeftRoundedIcon />
                </Button>
              </Box>

              <Typography variant="body2" sx={{ color: "#5d0010", lineHeight: 1.6 }}>
                Deslizá desde el borde o tocá el botón para activar la alerta de emergencia.
              </Typography>

              <Button
                variant="contained"
                color="error"
                onClick={async () => {
                  await handleTriggerEmergency();
                  closeMobileDrawer();
                }}
                disabled={submitting}
                startIcon={<WarningRoundedIcon />}
                sx={{
                  borderRadius: 999,
                  py: 1.2,
                  textTransform: "none",
                  fontWeight: 700,
                  boxShadow: "0 12px 24px rgba(176, 0, 32, 0.25)",
                }}
              >
                Activar alerta
              </Button>
            </Box>
          </SwipeableDrawer>
        </>
      )}

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
