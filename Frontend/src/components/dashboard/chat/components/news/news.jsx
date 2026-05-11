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
import Stack from "@mui/material/Stack";
import CircularProgress from "@mui/material/CircularProgress";
import fondoChatAI from "../../../../../assets/images/fondoChatAI.png";
import NewspaperRoundedIcon from '@mui/icons-material/NewspaperRounded';
import RefreshRoundedIcon from '@mui/icons-material/RefreshRounded';
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

    const res = await getNews({ query: "general", country: "ar" });

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
  }, []);

  const ActionButtons = ({ fetchNews, isMobile = false }) => (
    <Box
      sx={{
        display: isMobile ? { xs: "flex", md: "none" } : { xs: "none", md: "flex" },
        mt: isMobile ? 2 : 0,
        mb: isMobile ? 1 : 0,
        width: isMobile ? "100%" : "auto",
        mb: 2,
      }}
    >
      <Button
        variant="contained"
        color="primary"
        onClick={fetchNews}
        disabled={loading}
        sx={{
          borderRadius: 2,
          boxShadow: 3,
          backgroundColor: "#7d745c",
          color: "#ffffff",
          textTransform: "none",
          "&:hover": {
            backgroundColor: "#67604d"
          },
          fontSize: "1rem",
          width: { xs: "100%", sm: "100%", md: "fit-content" },
          minWidth: "auto",
          whiteSpace: "nowrap",
          px: 2,
          "&.Mui-disabled": {
            backgroundColor: "#5a5342",
            color: "#ffffff !important",
          }
        }}
      >
        {loading ? (
          <>
            <CircularProgress size={20} sx={{ color: "#ffffff", mr: 2 }} />
            Actualizando...
          </>
        ) :
          <>
            <RefreshRoundedIcon sx={{ mr: 1 }} />
            Actualizar noticias
          </>
        }
      </Button>
    </Box>
  );

  return (

    <Box
      sx={{
        flexGrow: 1,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        width: "100%",
        height: "100%",
        overflow: "auto",
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
        }}
      >
        <Stack
          direction={{ xs: "column", sm: "row" }}
          alignItems="center"
          justifyContent="space-between"
          spacing={2}
        >
          <Stack direction="row" alignItems="center" spacing={1}>
            <Typography variant="h3"
              sx={{
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
              Noticias del mundo <NewspaperRoundedIcon fontSize="medium" sx={{ color: "#000000", ml: 1 }} />
            </Typography>
          </Stack>
          <ActionButtons fetchNews={fetchNews} isMobile={false} />
        </Stack>
        <Typography sx={{
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
          Cinco titulares actuales con resumen y enlace directo para que te mantengas informado apenas entres.
        </Typography>
        <Divider sx={{ borderColor: "rgba(0,0,0,0.1)" }} />
        <ActionButtons fetchNews={fetchNews} isMobile={true} />
        {loading && (
          <Box sx={{ p: 5, display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", gap: 2, flexGrow: 1 }}>
            <Typography variant="h2" sx={{ fontSize: "1rem", fontFamily: "'Lora', serif", color: "#000000" }}>Cargando noticias...</Typography>
            <CircularProgress sx={{ color: "#000000" }} />
          </Box>
        )}
        {error && !loading && (
          <Typography variant="body2" color="error" sx={{
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
            {error}
          </Typography>
        )}
        {!loading && !error && (
          <Grid container spacing={2} sx={{
            flexGrow: 1,
            mt: { xs: 1, sm: 1, md: 2, lg: 2, xl: 2 },
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
            {articles.map((article, index) => (
              <Grid size={{ xs: 12, sm: 12, md: 12, lg: 6 }} key={`${article.url || index}-${index}`}>
                <Card
                  sx={{
                    height: "100%",
                    borderRadius: 3,
                    backgroundColor: "#d7d6d6",
                    display: "flex",
                    flexDirection: "column",
                    boxShadow: 3
                  }}
                >
                  <CardContent sx={{ flexGrow: 1 }}>
                    <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <Chip label={`#${index + 1}`} size="medium" sx={{ backgroundColor: "#7d745c" }} />
                      <Typography variant="caption" sx={{
                        color: "#000000",
                        my: 1,
                        fontSize: "0.90rem",
                        textAlign: { xs: "center", sm: "center", md: "start" },
                        lineHeight: 1.8,
                      }}
                      >
                        {article.source || "Fuente desconocida"}
                      </Typography>
                    </Box>
                    <Typography variant="h6" sx={{
                      mb: 1,
                      color: "#000000",
                      my: 1,
                      fontSize: {
                        xs: "1.1rem",
                        sm: "1.1rem",
                        md: "1.1rem",
                        lg: "1.2rem",
                        xl: "1.2rem",
                      },
                      fontWeight: 600,
                      textAlign: { xs: "center", sm: "center", md: "start" },
                      lineHeight: 1.8,
                    }}>
                      {article.title}
                    </Typography>
                    <Divider sx={{ borderColor: "rgba(0,0,0,0.1)" }} />
                    <Typography variant="body1" sx={{ color: "#000000", lineHeight: 1.8, my: 2 }}>
                      {summarize(article.description)}
                    </Typography>
                    <Divider sx={{ borderColor: "rgba(0,0,0,0.1)" }} />
                  </CardContent>
                  <CardActions sx={{ px: 3, py: 2 }}>
                    <Button
                      size="small"
                      href={article.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      sx={{ textTransform: "none" }}
                      endIcon={<span style={{ fontSize: "1.2rem" }}>↗</span>}
                      sx={{
                        borderRadius: 2,
                        display: "flex",
                        borderColor: "#ffbb00",
                        color: "#000000",
                        textTransform: "none",
                        width: { xs: "100%", sm: "auto" },
                        boxShadow: 3,
                        fontSize: "1rem",
                        px: 2,
                        ml: "auto",
                        "&:hover": {
                          borderColor: "#6a5f49",
                          backgroundColor: "rgba(125, 116, 92, 0.08)"
                        }
                      }}
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
  );
}
