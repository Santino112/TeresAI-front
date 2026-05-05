import { useCallback, useEffect, useMemo, useState } from "react";
import fondoChatAI from "../../../../../assets/images/fondoChatAI.png";
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
  Paper
} from "@mui/material";
import StickyNote2RoundedIcon from "@mui/icons-material/StickyNote2Rounded";
import api from "../../../../../api/axios";

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
    return <Chip icon={<StickyNote2RoundedIcon />} label={label} sx={{ backgroundColor: "#7d745c" }} />;
  }, [loading, notes.length]);

  return (
    <Box sx={{
      display: "flex",
      flexDirection: "column",
      alignItems: "stretch",
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
      <Paper sx={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "flex-start",
        width: "100%",
        p: { xs: 2, sm: 2, md: 2 },
        borderRadius: 4,
        background: "transparent",
        
        flexGrow: 0,
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
      }}>
        <Stack
          direction={{ xs: "column", sm: "row" }}
          alignItems="center"
          justifyContent="space-between"
          spacing={2}
        >
          <Stack direction="row" alignItems="center" spacing={1}>
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
              Notas <StickyNote2RoundedIcon fontSize="medium" sx={{ color: "#000000", ml: 1 }} />
            </Typography>
          </Stack>
          {notesCountChip}
        </Stack>
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
          Guarda tus recordatorios, ideas o lo que quieras registrar con Teresa.
          Cada nota se muestra como una tarjeta interactiva; hacé click para verla en detalle.
        </Typography>
        <Divider sx={{ borderColor: "rgba(0,0,0,0.1)" }} />
        <Grid container spacing={3} sx={{
          flexGrow: 1, mt: 1, animation: "slideDown 0.4s ease",
          mx: 0, 
          width: "100%",
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
        }}>
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
                      border: "2px dashed rgba(0,0,0,0.2)",
                      p: 3,
                      textAlign: "center",
                    }}
                  >
                    <Typography variant="h6" sx={{
                      color: "#000000",
                      mb: 1,
                    }}>
                      Todavía no hay notas guardadas
                    </Typography>
                    <Typography variant="body1" sx={{
                      color: "#000000",
                      lineHeight: 1.8,
                    }} >
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
                      background: theme.palette.mode === "dark" ? "#303030" : "#ffffff",
                    }}
                  >
                    <CardActionArea
                      sx={{
                        height: "100%",
                        p: 2,
                        width: "100%",
                       
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "flex-start",
                        justifyContent: "flex-start",
                        color: "#000000",
                        backgroundColor: "#d7d6d6"
                      }}
                      onClick={() => openNote(note)}
                    >
                      <Stack direction="row" justifyContent="space-between" width="100%">
                        <Typography variant="subtitle1" noWrap sx={{ fontWeight: 600, color: "#000000" }}>
                          {note.text?.split("\n")[0] || "Nota sin título"}
                        </Typography>
                        <Chip label="Ver" size="small" sx={{ color: "#000000", backgroundColor: "#ffffff" }} />
                      </Stack>
                      <Typography variant="caption" color="text.secondary" sx={{ mt: 1, mb: 2, color: "#000000" }}>
                        {formatDate(note.created_at)}
                      </Typography>
                      <Typography variant="body2" sx={{ color: "#000000" }}>
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
                width: "90%",
                maxWidth: 500,
                bgcolor: "#d7d6d6",
                color: "#000000",
                borderRadius: 3,
                boxShadow: 24,
                p: 3,
                outline: "none",
                maxHeight: "90vh",
                overflowY: "auto",
                border: '2px solid #000000',
              }}
            >
              <Stack direction={{ xs: "column", sm: "column", md: "row" }} justifyContent="space-between" alignItems="center" spacing={1}>
                <Typography variant="h5" fontWeight={600} sx={{ color: "#000000" }}>
                  {selectedNote?.text?.split("\n")[0] || "Nota"}
                </Typography>
                <Typography variant="body1" sx={{ color: "#000000" }}>
                  {formatDate(selectedNote?.created_at)}
                </Typography>
              </Stack>
              <Divider sx={{ borderColor: "rgba(0,0,0,0.1)", my: 2 }} />
              <Typography variant="body1" sx={{ whiteSpace: "pre-line", lineHeight: 1.8, color: "#000000", my: 2 }}>
                {selectedNote?.text}
              </Typography>
              <Divider sx={{ borderColor: "rgba(0,0,0,0.1)", my: 2 }} />
              <Stack direction="row" spacing={2} justifyContent="flex-end">
                <Button variant="outlined" onClick={closeModal} sx={{
                  border: "none",
                  color: "#464545",
                  fontWeight: "bold",
                  textTransform: "none",
                  ml: 1,
                  mt: 1,
                  "&:hover": { backgroundColor: "#e0e0e0" },
                }}>
                  Cerrar
                </Button>
                <Button
                  variant="contained"
                  color="error"
                  onClick={handleDeleteNote}
                  disabled={actionLoading}
                  sx={{
                    color: "#ffffff",
                    textTransform: "none",
                    "&:hover": {
                      backgroundColor: "#aa0e0e"
                    },
                    mr: 1,
                    mt: 1
                  }}
                >
                  Eliminar nota
                </Button>
              </Stack>
            </Box>
          </Fade>
        </Modal>
      </Paper>
    </Box>
  );
}
