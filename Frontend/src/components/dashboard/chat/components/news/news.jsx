import { useEffect, useState } from "react";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardActions from "@mui/material/CardActions";
import Button from "@mui/material/Button";
import Chip from "@mui/material/Chip";
import Paper from "@mui/material/Paper";
import Divider from "@mui/material/Divider";
import CircularProgress from "@mui/material/CircularProgress";
import fondoChatAI from "../../../../../assets/images/fondoChatAI.png";
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
        flexGrow: 1,
        display: "flex",
        flexDirection: "column",
        minHeight: 0,
      }}
    >
      <Box
        sx={{
            flexGrow: 1,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            width: "100%",
          background: `url(${fondoChatAI})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
          p: 2,
        }}
      >
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
          <Box>
            <Box sx={{
              display: "flex",
              flexDirection: {
                xs: "column",
                sm: "column",
                md: "row",
                lg: "row",
                xl: "row"
              },
              justifyContent: "space-between",
              alignItems: "stretch",
              gap: 2,
              width: "100%",
              borderRadius: 4,
            }}>
              <Typography variant="h3"
                sx={{
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
                Noticias del mundo 📰
              </Typography>
              <Button
                variant="contained"
                color="primary"
                onClick={fetchNews}
                disabled={loading}
                sx={{
                  boxShadow: 3,
                  color: "#ffffff",
                  backgroundColor: "#0978a0",
                  fontFamily: "'Lora', serif",
                  fontWeight: "bold",
                  "&:hover": {
                    backgroundColor: "#066688",
                  }
                }}
              >
                {loading ?
                  (
                    <>
                      <CircularProgress size={20} sx={{ color: "#ffffff", mr: 2 }} />
                      Guardando...
                    </>
                  )
                  : "Actualizar"}
              </Button>
            </Box>
            <Typography sx={{
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
              Cinco titulares actuales con resumen y enlace directo para que te mantengas informado apenas entres.
            </Typography>
            <Divider sx={{
              width: "100%",
              "&::before, &::after": {
                borderColor: "#ffffff",
              }
            }}>
              <Typography variant="body1" sx={{ color: "#ffffff" }}>~</Typography>
            </Divider>
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
        </Paper>
      </Box>
    </Box>
  );
}
