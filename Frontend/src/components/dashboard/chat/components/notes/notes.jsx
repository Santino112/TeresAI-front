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
  Paper,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Alert,
} from "@mui/material";
import StickyNote2RoundedIcon from "@mui/icons-material/StickyNote2Rounded";
import AddRoundedIcon from "@mui/icons-material/AddRounded";
import DeleteOutlineRoundedIcon from "@mui/icons-material/DeleteOutlineRounded";
import EditRoundedIcon from "@mui/icons-material/EditRounded";
import SaveRoundedIcon from "@mui/icons-material/SaveRounded";
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
  return `${preview.slice(0, 180).trim()}...`;
};

const getEditDraftFromNote = (note) => {
  const rawText = String(note?.text || "");
  const fallbackTitle = rawText.split("\n").find((line) => line.trim()) || "Nota sin titulo";
  const fallbackContent = rawText
    .split("\n")
    .slice(1)
    .join("\n")
    .trim();

  return {
    title: note?.title || fallbackTitle,
    content: note?.content || fallbackContent || rawText,
  };
};

export default function NotesDashboard() {
  const theme = useTheme();
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedNote, setSelectedNote] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);
  const [editingNote, setEditingNote] = useState(false);
  const [editError, setEditError] = useState("");
  const [editForm, setEditForm] = useState({
    title: "",
    content: "",
  });

  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [createLoading, setCreateLoading] = useState(false);
  const [createError, setCreateError] = useState("");
  const [createForm, setCreateForm] = useState({
    title: "",
    content: "",
  });

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
    setEditForm(getEditDraftFromNote(note));
    setEditError("");
    setEditingNote(false);
    setModalOpen(true);
  };

  const closeModal = () => {
    if (actionLoading) return;
    setModalOpen(false);
    setSelectedNote(null);
    setEditingNote(false);
    setEditError("");
  };

  const handleDeleteNote = async (noteId) => {
    const normalizedNoteId =
      typeof noteId === "object" && noteId !== null ? noteId.id : noteId;

    if (!normalizedNoteId) return;

    setActionLoading(true);
    try {
      await api.delete(`/notes/${normalizedNoteId}`);
      if (selectedNote?.id === normalizedNoteId) {
        closeModal();
      }
      await fetchNotes();
      window.dispatchEvent(new Event("notesUpdated"));
    } catch (error) {
      console.error("Error eliminando nota:", error);
    } finally {
      setActionLoading(false);
    }
  };

  const handleOpenCreate = () => {
    setCreateError("");
    setCreateForm({ title: "", content: "" });
    setCreateModalOpen(true);
  };

  const handleCloseCreate = () => {
    if (createLoading) return;
    setCreateModalOpen(false);
  };

  const handleStartEdit = () => {
    if (!selectedNote) return;

    setEditError("");
    setEditForm(getEditDraftFromNote(selectedNote));
    setEditingNote(true);
  };

  const handleCancelEdit = () => {
    if (actionLoading) return;

    setEditError("");
    setEditForm(getEditDraftFromNote(selectedNote));
    setEditingNote(false);
  };

  const handleEditNote = async () => {
    if (!selectedNote?.id) return;

    if (!editForm.content.trim()) {
      setEditError("Debes escribir el contenido de la nota.");
      return;
    }

    setActionLoading(true);
    setEditError("");

    try {
      const title = editForm.title.trim();
      const content = editForm.content.trim();

      await api.put(`/notes/${selectedNote.id}`, {
        title,
        content,
      });

      const updatedSelectedNote = {
        ...selectedNote,
        title: title || getEditDraftFromNote(selectedNote).title,
        content,
        text: title ? `${title}\n\n${content}` : content,
      };

      setSelectedNote(updatedSelectedNote);
      setEditingNote(false);
      await fetchNotes();
      window.dispatchEvent(new Event("notesUpdated"));
    } catch (error) {
      setEditError(error?.response?.data?.error || "No se pudo editar la nota.");
    } finally {
      setActionLoading(false);
    }
  };

  const handleCreateNote = async () => {
    if (!createForm.content.trim()) {
      setCreateError("Debes escribir el contenido de la nota.");
      return;
    }

    setCreateLoading(true);
    setCreateError("");

    try {
      await api.post("/notes", {
        title: createForm.title.trim(),
        content: createForm.content.trim(),
      });

      setCreateModalOpen(false);
      await fetchNotes();
      window.dispatchEvent(new Event("notesUpdated"));
    } catch (error) {
      setCreateError(error?.response?.data?.error || "No se pudo crear la nota.");
    } finally {
      setCreateLoading(false);
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
          <Stack direction="row" spacing={1} alignItems="center">
            {notesCountChip}
            <Button
              variant="contained"
              onClick={handleOpenCreate}
              startIcon={<AddRoundedIcon />}
              sx={{ fontFamily: "'Lora', serif", fontWeight: 700 }}
            >
              Nueva nota
            </Button>
          </Stack>
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
              <Grid key={index} size={{ xs: 12, sm: 6, md: 4 }}>
                <Skeleton variant="rounded" height={200} />
              </Grid>
            ))
              : notes.length === 0
              ? (
                <Grid size={12}>
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
                <Grid key={note.id} size={{ xs: 12, sm: 6, md: 4 }}>
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
                  {selectedNote?.title || selectedNote?.text?.split("\n")[0] || "Nota"}
                </Typography>
                <Typography variant="body1" sx={{ color: "#000000" }}>
                  {formatDate(selectedNote?.created_at)}
                </Typography>
              </Stack>
              <Divider sx={{ borderColor: "rgba(0,0,0,0.1)", my: 2 }} />
              {editingNote ? (
                <Stack spacing={2}>
                  {editError ? <Alert severity="error">{editError}</Alert> : null}
                  <TextField
                    label="Titulo"
                    value={editForm.title}
                    onChange={(event) => setEditForm((prev) => ({ ...prev, title: event.target.value }))}
                    fullWidth
                  />
                  <TextField
                    label="Contenido"
                    value={editForm.content}
                    onChange={(event) => setEditForm((prev) => ({ ...prev, content: event.target.value }))}
                    multiline
                    minRows={6}
                    fullWidth
                    required
                  />
                </Stack>
              ) : (
                <Typography variant="body1" sx={{ whiteSpace: "pre-line", lineHeight: 1.8, color: "#000000", my: 2 }}>
                  {selectedNote?.text}
                </Typography>
              )}
              <Divider sx={{ borderColor: "rgba(0,0,0,0.1)", my: 2 }} />
              <Stack direction="row" spacing={2} justifyContent="flex-end">
                {editingNote ? (
                  <>
                    <Button
                      variant="outlined"
                      onClick={handleCancelEdit}
                      disabled={actionLoading}
                      sx={{
                        border: "none",
                        color: "#464545",
                        fontWeight: "bold",
                        textTransform: "none",
                        ml: 1,
                        mt: 1,
                        "&:hover": { backgroundColor: "#e0e0e0" },
                      }}
                    >
                      Cancelar
                    </Button>
                    <Button
                      variant="contained"
                      onClick={handleEditNote}
                      disabled={actionLoading}
                      startIcon={<SaveRoundedIcon />}
                      sx={{
                        color: "#ffffff",
                        textTransform: "none",
                        backgroundColor: "#7d745c",
                        "&:hover": {
                          backgroundColor: "#6a5f49"
                        },
                        mr: 1,
                        mt: 1
                      }}
                    >
                      {actionLoading ? "Guardando..." : "Guardar cambios"}
                    </Button>
                  </>
                ) : (
                  <>
                    <Button
                      variant="outlined"
                      onClick={closeModal}
                      sx={{
                        border: "none",
                        color: "#464545",
                        fontWeight: "bold",
                        textTransform: "none",
                        ml: 1,
                        mt: 1,
                        "&:hover": { backgroundColor: "#e0e0e0" },
                      }}
                    >
                      Cerrar
                    </Button>
                    <Button
                      variant="outlined"
                      onClick={handleStartEdit}
                      disabled={actionLoading}
                      startIcon={<EditRoundedIcon />}
                      sx={{
                        borderColor: "#7d745c",
                        color: "#7d745c",
                        textTransform: "none",
                        mt: 1,
                        "&:hover": {
                          borderColor: "#6a5f49",
                          backgroundColor: "rgba(125, 116, 92, 0.08)"
                        }
                      }}
                    >
                      Editar
                    </Button>
                    <Button
                      variant="contained"
                      color="error"
                      onClick={() => handleDeleteNote(selectedNote?.id)}
                      disabled={actionLoading || !selectedNote?.id}
                      startIcon={<DeleteOutlineRoundedIcon />}
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
                  </>
                )}
              </Stack>
            </Box>
          </Fade>
        </Modal>

        <Dialog open={createModalOpen} onClose={handleCloseCreate} fullWidth maxWidth="sm" sx={{borderRadius: 3}}>
          <DialogTitle sx={{ color: "#000000", fontWeight: 600,  bgcolor: "#d7d6d6" }}>Agregar nota nueva</DialogTitle>
          <DialogContent sx={{ bgcolor: "#d7d6d6",}}>
            <Stack spacing={2} sx={{ mt: 1 }}>
              {createError ? <Alert severity="error">{createError}</Alert> : null}
              <TextField
                label="Titulo"
                value={createForm.title}
                onChange={(event) => setCreateForm((prev) => ({ ...prev, title: event.target.value }))}
                fullWidth
                helperText="Opcional: si lo dejas vacio se usa una version corta del contenido"
              />
              <TextField
                label="Contenido"
                value={createForm.content}
                onChange={(event) => setCreateForm((prev) => ({ ...prev, content: event.target.value }))}
                multiline
                minRows={6}
                fullWidth
                required
                helperText={`${createForm.content.length} caracteres`}
              />
            </Stack>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseCreate} disabled={createLoading}>
              Cancelar
            </Button>
            <Button variant="contained" onClick={handleCreateNote} disabled={createLoading}>
              {createLoading ? "Guardando..." : "Guardar nota"}
            </Button>
          </DialogActions>
        </Dialog>
      </Paper>
    </Box>
  );
}
