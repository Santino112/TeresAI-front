import { useCallback, useEffect, useState } from "react";
import {
  Box,
  Paper,
  Typography,
  CircularProgress,
  Alert,
  Grid,
  Select,
  MenuItem,
  Stack,
  Divider,
  Card,
  CardContent,
  useMediaQuery,
  useTheme
} from "@mui/material";
import {
  BarChart,
  PieChart,
  LineChart,
} from "@mui/x-charts";
import { useAuth } from "../../../../../auth/useAuth.jsx";
import fondoChatAI from "../../../../../../assets/images/fondoChatAI.png";
import { API_BASE_URL } from "../../../../../../config/api.js";

const Familiar = () => {
  const { user, accessToken, loading: authLoading } = useAuth();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const isTablet = useMediaQuery(theme.breakpoints.down("md"));

  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedElder, setSelectedElder] = useState(null);
  const [elders, setElders] = useState([]);

  // Tamaños responsivos de gráficos
  const chartDimensions = {
    barChart: {
      width: isMobile ? 350 : isTablet ? 500 : 600,
      height: isMobile ? 300 : 350
    },
    pieChart: {
      width: isMobile ? 350 : isTablet ? 500 : 600,
      height: isMobile ? 300 : 350
    },
    lineChart: {
      width: isMobile ? 350 : isTablet ? 500 : 600,
      height: isMobile ? 280 : 300
    }
  };

  const fetchElders = useCallback(async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/family/dashboard/elders`, {
        method: "GET",
        headers: {
          "Authorization": `Bearer ${accessToken}`,
        },
      });

      if (!response.ok) throw new Error("Error al obtener adultos mayores");

      const data = await response.json();
      if (data.elders && data.elders.length > 0) {
        setElders(data.elders);
        setSelectedElder(data.defaultElderId);
      }
    } catch (err) {
      console.error("Error:", err);
      setError("No se pudieron cargar los adultos mayores vinculados");
    }
  }, [accessToken]);

  const fetchAnalytics = useCallback(async (elderId) => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        elderId: elderId,
        days: 180
      });

      const response = await fetch(`${API_BASE_URL}/family/dashboard/analytics?${params}`, {
        method: "GET",
        headers: {
          "Authorization": `Bearer ${accessToken}`,
        },
      });

      if (!response.ok) throw new Error("Error al obtener análisis");

      const data = await response.json();
      setAnalytics(data);
      setError(null);
    } catch (err) {
      console.error("Error:", err);
      setError("No se pudieron cargar las estadísticas");
    } finally {
      setLoading(false);
    }
  }, [accessToken]);

  useEffect(() => {
    if (authLoading) return;
    if (!user || !accessToken) return;
    fetchElders();
  }, [authLoading, user, accessToken, fetchElders]);

  useEffect(() => {
    if (authLoading) return;
    if (!user || !accessToken) return;
    if (selectedElder) {
      fetchAnalytics(selectedElder);
    }
  }, [authLoading, user, accessToken, fetchAnalytics, selectedElder]);

  if (authLoading) return null;
  if (!user || !accessToken) return null;

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        width: "100%",
        height: "100%",
        background: `url(${fondoChatAI})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        overflow: "auto",
        p: { xs: 1, sm: 2, md: 3, lg: 3 }
      }}
    >
      <Paper
        sx={{
          background: "transparent",
          borderRadius: 3,
          border: "1px solid rgba(255, 255, 255, 0.1)",
          mb: { xs: 2, md: 3 },
          p: { xs: 2, sm: 2, md: 2 },
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
          spacing={{ xs: 1, md: 2 }}
          alignItems={{ xs: "stretch", sm: "center" }}
          justifyContent="space-between"
        >
          <Box>
            <Typography
              variant="h3"
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
                mb: 1
              }}
            >
              Estadísticas del Familiar
            </Typography>
            <Typography
              variant="body1"
              sx={{
                color: "#000000",
                fontSize: {
                  xs: "1rem",
                  sm: "1rem",
                  md: "1.2rem",
                  lg: "1.3rem",
                  xl: "1.3rem",
                },

                lineHeight: 1.6,
                textAlign: { xs: "center", sm: "center", md: "start" },
              }}
            >
              Análisis de últimos 180 días
            </Typography>
          </Box>
          {elders.length > 0 && (
            <Select
              value={selectedElder || ""}
              onChange={(e) => setSelectedElder(e.target.value)}
              sx={{
                backgroundColor: "#d7d6d6",
                mt: 1,
                color: "#000000",
                borderRadius: 3,
                boxShadow: 3,
                input: { color: "#000000" },
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
                mb: 1
              }}
            >
              {elders.map((elder) => (
                <MenuItem key={elder.id} value={elder.id}>
                  {elder.username}
                </MenuItem>
              ))}
            </Select>
          )}
        </Stack>
      </Paper>
      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

      {loading ? (
        <Box sx={{ p: 5, display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", gap: 2, flexGrow: 1 }}>
          <Typography variant="h2" sx={{ fontSize: "1rem", fontFamily: "'Lora', serif", color: "#000000" }}>Cargando información</Typography>
          <CircularProgress sx={{ color: "#000000" }} />
        </Box>
      ) : analytics ? (
        <Grid container spacing={{ xs: 1.5, sm: 2, md: 3 }} sx={{
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
          <Grid size={{ xs: 12, sm: 12, md: 6, lg: 6 }} sx={{ boxShadow: 3, }}>
            <Card
              sx={{
                height: "100%",
                backdropFilter: "blur(10px)",
                border: "1px solid rgba(255, 255, 255, 0.1)",
                borderRadius: 2,
              }}
            >
              <CardContent sx={{ p: { xs: 1.5, sm: 2, md: 2.5 }, height: "100%", display: "flex", flexDirection: "column" }}>
                <Typography
                  variant="h6"
                  sx={{
                    mb: { xs: 1, md: 2 },
                    fontWeight: 600,
                    fontSize: { xs: "1rem", sm: "1.1rem", md: "1.2rem" },
                  }}
                >
                  ⏰ Tiempo de Uso por Día
                </Typography>
                <Box sx={{ width: "100%", display: "flex", justifyContent: "center", overflowX: "auto" }}>
                  <BarChart
                    dataset={analytics.charts.usageByWeekday}
                    xAxis={[{
                      scaleType: "band",
                      dataKey: "day",
                      tickLabelStyle: { fill: '#ffffff' }
                    }]}
                    yAxis={[{
                      tickLabelStyle: { fill: '#ffffff' }
                    }]}
                    series={[{ dataKey: "hours", label: "Horas", color: "#4caf50" }]}
                    width={chartDimensions.barChart.width}
                    height={chartDimensions.barChart.height}
                    margin={{ top: 10, bottom: isMobile ? 40 : 50, left: 50, right: 10 }}
                    slotProps={{
                      legend: { hidden: false }
                    }}
                  />
                </Box>
                <Typography
                  variant="body2"
                  sx={{ mt: 1.5, opacity: 0.7, fontSize: { xs: "0.75rem", sm: "0.85rem" } }}
                >
                  Total: {analytics.charts.usageByWeekday.reduce((sum, d) => sum + d.hours, 0).toFixed(2)} horas |
                  Sesiones: {analytics.charts.usageByWeekday.reduce((sum, d) => sum + d.sessions, 0)}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid size={{ xs: 12, sm: 12, md: 6, lg: 6 }} sx={{ boxShadow: 3 }}>
            <Card
              sx={{
                height: "100%",
                backdropFilter: "blur(10px)",
                border: "1px solid rgba(255, 255, 255, 0.1)",
                borderRadius: 2,
              }}
            >
              <CardContent sx={{ p: { xs: 1.5, sm: 2, md: 2.5 }, height: "100%", display: "flex", flexDirection: "column" }}>
                <Typography
                  variant="h6"
                  sx={{
                    mb: { xs: 1, md: 2 },
                    fontWeight: 600,
                    fontSize: { xs: "1rem", sm: "1.1rem", md: "1.2rem" },
                  }}
                >
                  😊 Estados Emocionales
                </Typography>
                <Box sx={{ width: "100%", display: "flex", justifyContent: "center", overflowX: "auto" }}>
                  <PieChart
                    series={[
                      {
                        data: analytics.charts.emotionDistribution.items.map((item) => ({
                          id: item.id,
                          value: item.value,
                          label: `${item.label} (${item.percentage}%)`,
                        })),
                        highlightScope: { faded: "global", highlighted: "item" },
                        faded: { additionalRadius: -30, color: "gray" },
                      },
                    ]}
                    width={chartDimensions.pieChart.width}
                    height={chartDimensions.pieChart.height}
                    margin={{ top: 10, bottom: 10, left: 10, right: 10 }}
                    slotProps={{
                      legend: { hidden: true }
                    }}
                  />
                </Box>
                <Box sx={{ mt: 1.5 }}>
                  <Stack spacing={0.5}>
                    {analytics.charts.emotionDistribution.items.map((emotion, idx) => {
                      const colors = ["#4caf50", "#9c27b0", "#f44336", "#ff9800", "#2196f3"];
                      return (
                        <Typography
                          key={emotion.id}
                          variant="body2"
                          sx={{
                            fontSize: { xs: "0.75rem", sm: "0.85rem" },
                            color: "#ffffff !important", // Forzamos el color negro
                            display: "flex",
                            alignItems: "center",
                            fontWeight: 500, // Un poco más de grosor para que resalte
                            opacity: 1 // Quitamos la opacidad para que no se vea gris
                          }}
                        >
                          <span style={{
                            color: colors[idx],
                            fontSize: "18px",
                            marginRight: "8px",
                            lineHeight: 0
                          }}>●</span>
                          {emotion.label} ({emotion.percentage}%)
                        </Typography>
                      );
                    })}
                  </Stack>
                </Box>
              </CardContent>
            </Card>
          </Grid>

          <Grid size={{ xs: 12, sm: 12, md: 6, lg: 6 }}>
            <Card
              sx={{
                height: "100%",
                backdropFilter: "blur(10px)",
                border: "1px solid rgba(255, 255, 255, 0.1)",
                borderRadius: 2
              }}
            >
              <CardContent sx={{ p: { xs: 1.5, sm: 2, md: 2.5 } }}>
                <Typography
                  variant="h6"
                  sx={{
                    mb: { xs: 1, md: 2 },
                    fontWeight: 600,
                    fontSize: { xs: "1rem", sm: "1.1rem", md: "1.2rem" }
                  }}
                >
                  🚨 Nivel de Alertas
                </Typography>
                <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center", mb: 2, minHeight: isMobile ? 160 : 200 }}>
                  <Box sx={{ textAlign: "center" }}>
                    <Box
                      sx={{
                        width: isMobile ? 120 : 150,
                        height: isMobile ? 120 : 150,
                        borderRadius: "50%",
                        background: `conic-gradient(
                          ${analytics.charts.importantAlerts.score >= 80 ? "#f44336" :
                            analytics.charts.importantAlerts.score >= 60 ? "#ff9800" :
                              analytics.charts.importantAlerts.score >= 35 ? "#ffc107" :
                                "#4caf50"} 0deg ${(analytics.charts.importantAlerts.score / 100) * 360}deg,
                          rgba(255,255,255,0.1) ${(analytics.charts.importantAlerts.score / 100) * 360}deg 360deg
                        )`,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        mx: "auto",
                        mb: 1.5,
                        position: "relative"
                      }}
                    >
                      <Box
                        sx={{
                          width: isMobile ? 100 : 130,
                          height: isMobile ? 100 : 130,
                          borderRadius: "50%",
                          background: "rgba(20, 20, 30, 0.9)",
                          display: "flex",
                          flexDirection: "column",
                          alignItems: "center",
                          justifyContent: "center"
                        }}
                      >
                        <Typography
                          variant="h3"
                          sx={{
                            fontWeight: 700,
                            fontSize: { xs: "1.5rem", sm: "1.8rem", md: "2rem" }
                          }}
                        >
                          {analytics.charts.importantAlerts.score}
                        </Typography>
                        <Typography variant="caption" sx={{ opacity: 0.7, fontSize: { xs: "0.7rem", sm: "0.8rem" } }}>
                          /100
                        </Typography>
                      </Box>
                    </Box>
                    <Typography
                      variant="h6"
                      sx={{
                        color:
                          analytics.charts.importantAlerts.score >= 80 ? "#f44336" :
                            analytics.charts.importantAlerts.score >= 60 ? "#ff9800" :
                              analytics.charts.importantAlerts.score >= 35 ? "#ffc107" :
                                "#4caf50",
                        fontWeight: 600,
                        mt: 1,
                        fontSize: { xs: "0.9rem", sm: "1rem", md: "1.1rem" }
                      }}
                    >
                      {analytics.charts.importantAlerts.label}
                    </Typography>
                  </Box>
                </Box>
                <Divider sx={{ my: 1.5 }} />
                <Box>
                  <Typography
                    variant="body2"
                    sx={{ mb: 1, opacity: 0.8, fontSize: { xs: "0.75rem", sm: "0.85rem" } }}
                  >
                    Total alertas: {analytics.charts.importantAlerts.totalAlerts}
                  </Typography>
                  <Stack spacing={0.75}>
                    {analytics.charts.importantAlerts.severityBreakdown.map((item, idx) => (
                      <Box key={idx} sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 1 }}>
                        <Typography variant="body2" sx={{ fontSize: { xs: "0.75rem", sm: "0.85rem" }, minWidth: 50 }}>
                          {item.label}
                        </Typography>
                        <Box
                          sx={{
                            flex: 1,
                            height: 6,
                            backgroundColor: "rgba(255,255,255,0.1)",
                            borderRadius: 3,
                            overflow: "hidden"
                          }}
                        >
                          <Box
                            sx={{
                              height: "100%",
                              width: `${(item.count / Math.max(...analytics.charts.importantAlerts.severityBreakdown.map(i => i.count), 1)) * 100}%`,
                              backgroundColor: item.severity >= 4 ? "#f44336" : item.severity === 3 ? "#ff9800" : "#4caf50"
                            }}
                          />
                        </Box>
                        <Typography variant="body2" sx={{ minWidth: 25, textAlign: "right", fontSize: { xs: "0.75rem", sm: "0.85rem" } }}>
                          {item.count}
                        </Typography>
                      </Box>
                    ))}
                  </Stack>
                </Box>
              </CardContent>
            </Card>
          </Grid>

          {/* Detección de Soledad */}
          <Grid size={{ xs: 12, sm: 12, md: 6, lg: 6 }}>
            <Card
              sx={{
                height: "100%",
                backdropFilter: "blur(10px)",
                border: "1px solid rgba(255, 255, 255, 0.1)",
                borderRadius: 2
              }}
            >
              <CardContent sx={{ p: { xs: 1.5, sm: 2, md: 2.5 }, height: "100%", display: "flex", flexDirection: "column" }}>
                <Typography
                  variant="h6"
                  sx={{
                    mb: { xs: 1, md: 2 },
                    fontWeight: 600,
                    fontSize: { xs: "1rem", sm: "1.1rem", md: "1.2rem" }
                  }}
                >
                  💔 Detección de Soledad
                </Typography>
                {analytics.charts.lonelinessTrend.monthly.length > 0 ? (
                  <>
                    <Box sx={{ width: "100%", display: "flex", justifyContent: "center", overflowX: "auto" }}>
                      <LineChart
                        dataset={analytics.charts.lonelinessTrend.monthly}
                        xAxis={[{ scaleType: "point", dataKey: "label" }]}
                        series={[
                          {
                            dataKey: "count",
                            label: "Detecciones",
                            color: "#e74c3c",
                            curve: "natural",
                          },
                        ]}
                        width={chartDimensions.lineChart.width}
                        height={chartDimensions.lineChart.height}
                        margin={{ top: 10, bottom: isMobile ? 40 : 50, left: 50, right: 10 }}
                        slotProps={{
                          legend: { hidden: false }
                        }}
                      />
                    </Box>
                    <Typography
                      variant="body2"
                      sx={{ mt: 1.5, opacity: 0.7, fontSize: { xs: "0.75rem", sm: "0.85rem" } }}
                    >
                      Total de detecciones: {analytics.charts.lonelinessTrend.totalHits}
                    </Typography>
                  </>
                ) : (
                  <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center", minHeight: chartDimensions.lineChart.height }}>
                    <Typography variant="body2" sx={{ opacity: 0.7, fontSize: { xs: "0.85rem", sm: "0.95rem" } }}>
                      No se detectaron indicadores de soledad en el período
                    </Typography>
                  </Box>
                )}
              </CardContent>
            </Card>
          </Grid>
          <Grid size={12}>
            <Card
              sx={{
                backdropFilter: "blur(10px)",
                border: "1px solid rgba(255, 255, 255, 0.1)",
                borderRadius: 2
              }}
            >
              <CardContent sx={{ p: { xs: 1.5, sm: 2, md: 2.5 } }}>
                <Typography
                  variant="h6"
                  sx={{
                    mb: { xs: 1.5, md: 2 },
                    fontWeight: 600,
                    fontSize: { xs: "1rem", sm: "1.1rem", md: "1.2rem" }
                  }}
                >
                  📊 Resumen de Análisis
                </Typography>
                <Grid container spacing={{ xs: 1, sm: 1.5, md: 2 }}>
                  <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                    <Paper sx={{ p: { xs: 1.5, sm: 2 }, background: "rgba(76, 175, 80, 0.1)", border: "1px solid rgba(76, 175, 80, 0.3)", borderRadius: 2 }}>
                      <Typography
                        variant="body2"
                        sx={{ opacity: 0.8, fontSize: { xs: "0.75rem", sm: "0.85rem" } }}
                      >
                        Conversaciones
                      </Typography>
                      <Typography
                        variant="h5"
                        sx={{ fontWeight: 600, fontSize: { xs: "1.3rem", sm: "1.5rem" } }}
                      >
                        {analytics.summary.conversations}
                      </Typography>
                    </Paper>
                  </Grid>
                  <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                    <Paper sx={{ p: { xs: 1.5, sm: 2 }, background: "rgba(156, 39, 176, 0.1)", border: "1px solid rgba(156, 39, 176, 0.3)", borderRadius: 2 }}>
                      <Typography
                        variant="body2"
                        sx={{ opacity: 0.8, fontSize: { xs: "0.75rem", sm: "0.85rem" } }}
                      >
                        Mensajes Analizados
                      </Typography>
                      <Typography
                        variant="h5"
                        sx={{ fontWeight: 600, fontSize: { xs: "1.3rem", sm: "1.5rem" } }}
                      >
                        {analytics.summary.messagesAnalyzed}
                      </Typography>
                    </Paper>
                  </Grid>
                  <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                    <Paper sx={{ p: { xs: 1.5, sm: 2 }, background: "rgba(244, 67, 54, 0.1)", border: "1px solid rgba(244, 67, 54, 0.3)", borderRadius: 2 }}>
                      <Typography
                        variant="body2"
                        sx={{ opacity: 0.8, fontSize: { xs: "0.75rem", sm: "0.85rem" } }}
                      >
                        Día de Mayor Uso
                      </Typography>
                      <Typography
                        variant="h5"
                        sx={{ fontWeight: 600, fontSize: { xs: "1.3rem", sm: "1.5rem" } }}
                      >
                        {analytics.summary.dominantUsageDay || "N/A"}
                      </Typography>
                    </Paper>
                  </Grid>
                  <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                    <Paper sx={{ p: { xs: 1.5, sm: 2 }, background: "rgba(255, 152, 0, 0.1)", border: "1px solid rgba(255, 152, 0, 0.3)", borderRadius: 2 }}>
                      <Typography
                        variant="body2"
                        sx={{ opacity: 0.8, fontSize: { xs: "0.75rem", sm: "0.85rem" } }}
                      >
                        Emoción Dominante
                      </Typography>
                      <Typography
                        variant="h5"
                        sx={{ fontWeight: 600, fontSize: { xs: "1.3rem", sm: "1.5rem" } }}
                      >
                        {analytics.summary.dominantEmotion ?
                          analytics.summary.dominantEmotion.charAt(0).toUpperCase() + analytics.summary.dominantEmotion.slice(1)
                          : "N/A"}
                      </Typography>
                    </Paper>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      ) : (
        <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", flexGrow: 1 }}>
          <Typography variant="body1">No hay datos disponibles</Typography>
        </Box>
      )}
    </Box>
  );
};

export default Familiar;
