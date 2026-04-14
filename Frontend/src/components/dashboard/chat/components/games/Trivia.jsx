import { useState, useEffect } from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import CircularProgress from "@mui/material/CircularProgress";
import RefreshRoundedIcon from "@mui/icons-material/RefreshRounded";
import EmojiEventsRoundedIcon from "@mui/icons-material/EmojiEventsRounded";
import CheckCircleRoundedIcon from "@mui/icons-material/CheckCircleRounded";
import CancelRoundedIcon from "@mui/icons-material/CancelRounded";

const DIFFICULTIES = ["easy", "medium", "hard"];
const TOTAL_QUESTIONS = 10;

const shuffle = (arr) => [...arr].sort(() => Math.random() - 0.5);

const decodeHTML = (html) => {
  const txt = document.createElement("textarea");
  txt.innerHTML = html;
  return txt.value;
};

export default function Trivia() {
  const [questions, setQuestions] = useState([]);
  const [current, setCurrent] = useState(0);
  const [selected, setSelected] = useState(null);
  const [score, setScore] = useState(0);
  const [finished, setFinished] = useState(false);
  const [loading, setLoading] = useState(false);
  const [difficulty, setDifficulty] = useState("easy");
  const [options, setOptions] = useState([]);

  const fetchQuestions = async (diff = difficulty) => {
    setLoading(true);
    setScore(0);
    setCurrent(0);
    setSelected(null);
    setFinished(false);
    setQuestions([]);

    try {
      // primero pedís un token de sesión para evitar el rate limit
      const tokenRes = await fetch("https://opentdb.com/api_token.php?command=request");
      const tokenData = await tokenRes.json();
      const token = tokenData.token;

      const res = await fetch(
        `https://opentdb.com/api.php?amount=${TOTAL_QUESTIONS}&difficulty=${diff}&type=multiple&token=${token}`
      );
      const data = await res.json();

      // validación antes de usar los datos
      if (!data.results || data.results.length === 0) {
        console.error("No se obtuvieron preguntas");
        setLoading(false);
        return;
      }

      setQuestions(data.results);
      prepareOptions(data.results[0]);
    } catch (e) {
      console.error("Error fetching trivia:", e);
    }

    setLoading(false);
  };

  const prepareOptions = (question) => {
    if (!question) return;
    const opts = shuffle([
      question.correct_answer,
      ...question.incorrect_answers,
    ]);
    setOptions(opts);
  };

  useEffect(() => {
    fetchQuestions();
  }, []);

  const handleAnswer = (answer) => {
    if (selected !== null) return;
    setSelected(answer);
    if (answer === questions[current].correct_answer) {
      setScore((prev) => prev + 1);
    }
  };

  const handleNext = () => {
    const nextIndex = current + 1;
    if (nextIndex >= questions.length) {
      setFinished(true);
    } else {
      setCurrent(nextIndex);
      prepareOptions(questions[nextIndex]);
      setSelected(null);
    }
  };

  const getOptionStyle = (opt) => {
    if (selected === null) {
      return {
        color: "#E6E6E6",
        backgroundColor: "#353A36",
        border: "1px solid #444",
        "&:hover": { backgroundColor: "#565E58" },
      };
    }
    if (opt === questions[current].correct_answer) {
      return {
        color: "#1a1f1a",
        backgroundColor: "#4caf50",
        border: "1px solid #4caf50",
      };
    }
    if (opt === selected) {
      return {
        color: "#fff",
        backgroundColor: "#c62828",
        border: "1px solid #c62828",
      };
    }
    return {
      color: "#666",
      backgroundColor: "#2b2f2a",
      border: "1px solid #333",
    };
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        width: "100%",
        height: "100%",
        p: 3,
        gap: 2,
        overflowY: "auto",
        backgroundColor: "transparent",
        borderRadius: 4,
        boxShadow: 1,
      }}
    >
      {/* Título */}
      <Typography
        sx={{
          fontFamily: "'Lora', serif",
          fontSize: { xs: "1.8rem", md: "2.2rem" },
          fontWeight: 700,
          color: "#E6E6E6",
        }}
      >
        Trivia
      </Typography>

      {/* Dificultad */}
      <Box sx={{ display: "flex", gap: 1 }}>
        {DIFFICULTIES.map((d) => (
          <Button
            key={d}
            onClick={() => {
              setDifficulty(d);
              fetchQuestions(d);
            }}
            sx={{
              px: 2,
              py: 0.5,
              borderRadius: 3,
              fontSize: "0.8rem",
              fontFamily: "'Lora', serif",
              textTransform: "capitalize",
              color: difficulty === d ? "#1a1f1a" : "#aaa",
              backgroundColor: difficulty === d ? "#918B76" : "transparent",
              border: "1px solid",
              borderColor: difficulty === d ? "#918B76" : "#444",
              "&:hover": { backgroundColor: "#7a7664", color: "#fff" },
            }}
          >
            {d === "easy" ? "Fácil" : d === "medium" ? "Medio" : "Difícil"}
          </Button>
        ))}
      </Box>

      {loading ? (
        <CircularProgress sx={{ color: "#918B76" }} />
      ) : finished ? (
        // Pantalla final
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 2,
            textAlign: "center",
          }}
        >
          <EmojiEventsRoundedIcon sx={{ fontSize: "4rem", color: "#918B76" }} />
          <Typography
            sx={{
              fontFamily: "'Lora', serif",
              fontSize: "1.5rem",
              color: "#E6E6E6",
            }}
          >
            ¡Trivia completada!
          </Typography>
          <Typography
            sx={{
              fontFamily: "'Lora', serif",
              fontSize: "1.2rem",
              color: "#a8c5a0",
            }}
          >
            Puntaje: {score} / {TOTAL_QUESTIONS}
          </Typography>
          <Typography
            sx={{ fontFamily: "'Lora', serif", fontSize: "1rem", color: "#aaa" }}
          >
            {score === TOTAL_QUESTIONS
              ? "¡Perfecto, respondiste todo bien!"
              : score >= 7
                ? "¡Muy bien, excelente resultado!"
                : score >= 4
                  ? "Bien, pero podés mejorar."
                  : "No te rindas, intentalo de nuevo."}
          </Typography>
          <Button
            onClick={() => fetchQuestions()}
            startIcon={<RefreshRoundedIcon />}
            sx={{
              mt: 1,
              backgroundColor: "#918B76",
              color: "#1a1f1a",
              fontFamily: "'Lora', serif",
              fontWeight: 600,
              "&:hover": { backgroundColor: "#7a7664" },
            }}
          >
            Jugar de nuevo
          </Button>
        </Box>
      ) : questions.length > 0 ? (
        // Pregunta actual
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: 2,
            width: "100%",
            maxWidth: "600px",
          }}
        >
          {/* Progreso */}
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Typography sx={{ color: "#aaa", fontFamily: "'Lora', serif", fontSize: "0.9rem" }}>
              Pregunta {current + 1} de {TOTAL_QUESTIONS}
            </Typography>
            <Typography sx={{ color: "#918B76", fontFamily: "'Lora', serif", fontWeight: 600 }}>
              Puntaje: {score}
            </Typography>
          </Box>

          {/* Barra de progreso */}
          <Box sx={{ width: "100%", backgroundColor: "#353A36", borderRadius: 2, height: "6px" }}>
            <Box
              sx={{
                width: `${((current + 1) / TOTAL_QUESTIONS) * 100}%`,
                backgroundColor: "#918B76",
                borderRadius: 2,
                height: "6px",
                transition: "width 0.3s ease",
              }}
            />
          </Box>

          {/* Pregunta */}
          <Box
            sx={{
              backgroundColor: "#2b2f2a",
              borderRadius: 3,
              p: 3,
              border: "1px solid #3a3f3a",
              boxShadow: "0 4px 20px rgba(0,0,0,0.3)",
            }}
          >
            <Typography
              sx={{
                fontFamily: "'Lora', serif",
                fontSize: { xs: "1rem", md: "1.15rem" },
                color: "#E6E6E6",
                lineHeight: 1.6,
              }}
            >
              {decodeHTML(questions[current].question)}
            </Typography>
          </Box>

          {/* Opciones */}
          <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}>
            {options.map((opt, i) => (
              <Button
                key={i}
                fullWidth
                onClick={() => handleAnswer(opt)}
                startIcon={
                  selected !== null ? (
                    opt === questions[current].correct_answer ? (
                      <CheckCircleRoundedIcon />
                    ) : opt === selected ? (
                      <CancelRoundedIcon />
                    ) : null
                  ) : null
                }
                sx={{
                  justifyContent: "flex-start",
                  textAlign: "left",
                  textTransform: "none",
                  fontFamily: "'Lora', serif",
                  fontSize: "0.95rem",
                  borderRadius: 2,
                  px: 2,
                  py: 1.2,
                  transition: "all 0.2s ease",
                  ...getOptionStyle(opt),
                }}
              >
                {decodeHTML(opt)}
              </Button>
            ))}
          </Box>

          {/* Botón siguiente */}
          {selected !== null && (
            <Button
              onClick={handleNext}
              fullWidth
              sx={{
                mt: 1,
                backgroundColor: "#918B76",
                color: "#1a1f1a",
                fontFamily: "'Lora', serif",
                fontWeight: 600,
                borderRadius: 2,
                py: 1.2,
                "&:hover": { backgroundColor: "#7a7664" },
              }}
            >
              {current + 1 >= TOTAL_QUESTIONS ? "Ver resultado" : "Siguiente"}
            </Button>
          )}
        </Box>
      ) : null}
    </Box>
  );
}
