import { useEffect, useState } from "react";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardActions from "@mui/material/CardActions";
import Button from "@mui/material/Button";
import Chip from "@mui/material/Chip";
import Divider from "@mui/material/Divider";
import CircularProgress from "@mui/material/CircularProgress";
import { getNews } from "../../exports/getNews";

const MAX_CARDS = 5;

const summarize = (text, length = 150) => {
  if (!text) return "Sin descripción disponible.";
  const cleaned = text.trim();
  if (cleaned.length <= length) return cleaned;
  return `${cleaned.slice(0, length).trim()}…`;
};

export default function News() {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchNews = async () => {
    setLoading(true);
    setError(null);

    const res = await getNews({ global: true, query: "general" });

    if (res.success) {
      setArticles((res.articles || []).slice(0, MAX_CARDS));
    } else {
      setArticles([]);
      setError(res.error || "No se pudieron cargar las noticias.");
    }

    setLoading(false);
  };

  useEffect(() => {
    fetchNews();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Box
      sx={{
        padding: 3,
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        gap: 3,
        background: "#090909"
      }}
    >
      <Box
        sx={{
          display: "flex",
          flexWrap: "wrap",
          gap: 2,
          justifyContent: "space-between",
          alignItems: "flex-start"
        }}
      >
        <Box>
          <Typography variant="caption" color="text.secondary" letterSpacing={1}>
            Actualizado automáticamente
          </Typography>
          <Typography variant="h4" sx={{ fontWeight: 600, mt: 1 }}>
            Noticias del mundo
          </Typography>
          <Typography color="text.secondary" sx={{ mt: 1, maxWidth: 520 }}>
            Cinco titulares actuales con resumen y enlace directo para que te mantengas informado apenas entres.
          </Typography>
        </Box>
        <Button
          variant="contained"
          color="primary"
          onClick={fetchNews}
          disabled={loading}
          startIcon={loading ? <CircularProgress size={18} color="inherit" /> : null}
          sx={{ borderRadius: 3, textTransform: "none", px: 3 }}
        >
          {loading ? "Actualizando..." : "Actualizar"}
        </Button>
      </Box>

      {loading && (
        <Typography variant="body2" color="text.secondary">
          Cargando noticias...
        </Typography>
      )}

      {error && !loading && (
        <Typography variant="body2" color="error">
          {error}
        </Typography>
      )}

      {!loading && !error && (
        <Grid container spacing={2} sx={{ flexGrow: 1 }}>
          {articles.map((article, index) => (
            <Grid item xs={12} sm={6} key={`${article.url || index}-${index}`}>
              <Card
                sx={{
                  height: "100%",
                  borderRadius: 3,
                  background: "#121212",
                  display: "flex",
                  flexDirection: "column",
                  boxShadow: "0 10px 20px rgba(0,0,0,0.5)"
                }}
              >
                <CardContent sx={{ flexGrow: 1 }}>
                  <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 1 }}>
                    <Chip label={`#${index + 1}`} color="primary" size="small" />
                    <Typography variant="caption" color="text.secondary">
                      {article.source || "Fuente desconocida"}
                    </Typography>
                  </Box>

                  <Typography variant="h6" sx={{ mb: 1, lineHeight: 1.3 }}>
                    {article.title}
                  </Typography>

                  <Typography variant="body2" sx={{ color: "text.secondary" }}>
                    {summarize(article.description)}
                  </Typography>
                </CardContent>
                <Divider sx={{ borderColor: "rgba(255,255,255,0.08)" }} />
                <CardActions sx={{ px: 3, py: 2 }}>
                  <Button
                    size="small"
                    href={article.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    sx={{ textTransform: "none" }}
                    endIcon={<span style={{ fontSize: "1rem" }}>↗</span>}
                  >
                    Leer la noticia completa
                  </Button>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}
    </Box>
  );
}
