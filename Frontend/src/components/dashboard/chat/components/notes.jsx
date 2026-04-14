import { useCallback, useEffect, useMemo, useState } from "react";
import {
  Box,
  Typography,
  Grid,
  Card,
  CardActionArea,
  Stack,
  Chip,
  Modal,
  Fade,
  Backdrop,
  Divider,
  Button,
  Skeleton,
  useTheme,
} from "@mui/material";
import StickyNote2RoundedIcon from "@mui/icons-material/StickyNote2Rounded";
import api from "../../../../api/axios.js";

const formatDate = (value) => {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  return date.toLocaleString("es-AR", {
    dateStyle: "long",
    timeStyle: "short",
  });
};

const getSnippet = (text) => {
  if (!text) return "";
  const lines = text.split("\n").map((line) => line.trim()).filter(Boolean);
  const preview = lines.splice(0, 3).join(" ");
  if (preview.length <= 180) {
    return preview;
  }
  return `${preview.slice(0, 180).trim()}…`;
};

export default function NotesDashboard() {
  const theme = useTheme();
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedNote, setSelectedNote] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);

  const fetchNotes = useCallback(async () => {
    setLoading(true);
    try {
      const response = await api.get("/notes");
      setNotes(response.data.items || []);
    } catch (error) {
      console.error("Error cargando notas:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchNotes();

    const handler = () => fetchNotes();
    window.addEventListener("notesUpdated", handler);
    return () => {
      window.removeEventListener("notesUpdated", handler);
    };
  }, [fetchNotes]);

  const openNote = (note) => {
    setSelectedNote(note);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setSelectedNote(null);
  };

  const handleDeleteNote = async () => {
    if (!selectedNote) return;
    setActionLoading(true);
    try {
      await api.delete(`/notes/${selectedNote.id}`);
      closeModal();
      fetchNotes();
    } catch (error) {
      console.error("Error eliminando nota:", error);
    } finally {
      setActionLoading(false);
    }
  };

  const notesCountChip = useMemo(() => {
    const label = loading ? "Cargando..." : `${notes.length} nota${notes.length === 1 ? "" : "s"}`;
    return <Chip icon={<StickyNote2RoundedIcon />} label={label} color="secondary" />;
  }, [loading, notes.length]);

  return (
    <Box
      sx={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        p: { xs: 2, sm: 3, md: 4 },
        gap: 2,
      }}
    >
      <Stack
        direction={{ xs: "column", sm: "row" }}
        alignItems="center"
        justifyContent="space-between"
        spacing={2}
      >
        <Stack direction="row" alignItems="center" spacing={1}>
          <StickyNote2RoundedIcon fontSize="large" color="secondary" />
          <Typography variant="h4" sx={{ fontWeight: 600 }}>
            Notas
          </Typography>
        </Stack>
        {notesCountChip}
      </Stack>
      <Typography variant="body1" color="text.secondary" maxWidth={720}>
        Guarda tus recordatorios, ideas o lo que quieras registrar con Teresa.
        Cada nota se muestra como una tarjeta interactiva; hacé click para verla en detalle.
      </Typography>

      <Grid container spacing={3} sx={{ flexGrow: 1 }}>
        {loading
          ? Array.from({ length: 6 }).map((_, index) => (
              <Grid key={index} item xs={12} sm={6} md={4}>
                <Skeleton variant="rounded" height={200} />
              </Grid>
            ))
          : notes.length === 0
          ? (
            <Grid item xs={12}>
              <Box
                sx={{
                  borderRadius: 3,
                  border: `1px solid ${theme.palette.divider}`,
                  p: 3,
                  textAlign: "center",
                }}
              >
                <Typography variant="h6" sx={{ mb: 1 }}>
                  Todavía no hay notas guardadas
                </Typography>
                <Typography color="text.secondary">
                  Utilizá la herramienta para agregar nuevas notas y aparecerán aquí automáticamente.
                </Typography>
              </Box>
            </Grid>
          )
          : notes.map((note) => (
              <Grid key={note.id} item xs={12} sm={6} md={4}>
                <Card
                  elevation={2}
                  sx={{
                    borderRadius: 3,
                    height: "100%",
                    background: theme.palette.mode === "dark" ? "#1e1f1d" : "#fff",
                  }}
                >
                  <CardActionArea
                    sx={{
                      height: "100%",
                      p: 2,
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "flex-start",
                      justifyContent: "flex-start",
                    }}
                    onClick={() => openNote(note)}
                  >
                    <Stack direction="row" justifyContent="space-between" width="100%">
                      <Typography variant="subtitle1" noWrap sx={{ fontWeight: 600 }}>
                        {note.text?.split("\n")[0] || "Nota sin título"}
                      </Typography>
                      <Chip label="Ver" size="small" />
                    </Stack>
                    <Typography variant="caption" color="text.secondary" sx={{ mt: 1, mb: 2 }}>
                      {formatDate(note.created_at)}
                    </Typography>
                    <Typography variant="body2" color="text.primary">
                      {getSnippet(note.text)}
                    </Typography>
                  </CardActionArea>
                </Card>
              </Grid>
            ))}
      </Grid>

      <Modal
        open={modalOpen}
        onClose={closeModal}
        closeAfterTransition
        slots={{ backdrop: Backdrop }}
        slotProps={{
          backdrop: {
            sx: { backdropFilter: "blur(3px)" },
          },
        }}
      >
        <Fade in={modalOpen}>
          <Box
            sx={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              width: { xs: "90%", sm: 600 },
              bgcolor: theme.palette.background.paper,
              borderRadius: 3,
              boxShadow: 24,
              p: { xs: 3, sm: 4 },
              outline: "none",
              maxHeight: "90vh",
              overflowY: "auto",
            }}
          >
            <Stack direction="row" justifyContent="space-between" alignItems="center" mb={1}>
              <Typography variant="h5" fontWeight={600}>
                {selectedNote?.text?.split("\n")[0] || "Nota"}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                {formatDate(selectedNote?.created_at)}
              </Typography>
            </Stack>
            <Divider sx={{ mb: 2 }} />
            <Typography variant="body1" sx={{ whiteSpace: "pre-line", lineHeight: 1.8, mb: 3 }}>
              {selectedNote?.text}
            </Typography>
            <Stack direction="row" spacing={2} justifyContent="flex-end">
              <Button variant="outlined" onClick={closeModal}>
                Cerrar
              </Button>
              <Button
                variant="contained"
                color="error"
                onClick={handleDeleteNote}
                disabled={actionLoading}
              >
                Eliminar nota
              </Button>
            </Stack>
          </Box>
        </Fade>
      </Modal>
    </Box>
  );
}
