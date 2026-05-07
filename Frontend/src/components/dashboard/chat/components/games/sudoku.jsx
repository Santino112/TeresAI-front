import { useState, useEffect, useCallback } from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import CircularProgress from "@mui/material/CircularProgress";
import RefreshRoundedIcon from "@mui/icons-material/RefreshRounded";
import CheckRoundedIcon from "@mui/icons-material/CheckRounded";
import EmojiEventsRoundedIcon from "@mui/icons-material/EmojiEventsRounded";

const DIFFICULTIES = ["easy", "medium", "hard"];

const deepClone = (arr) => arr.map((row) => [...row]);

export default function Sudoku() {
  const [board, setBoard] = useState(null);
  const [solution, setSolution] = useState(null);
  const [original, setOriginal] = useState(null);
  const [selected, setSelected] = useState(null);
  const [difficulty, setDifficulty] = useState("easy");
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [won, setWon] = useState(false);
  const [checked, setChecked] = useState(false);

  const fetchBoard = useCallback(async () => {
    setLoading(true);
    setWon(false);
    setChecked(false);
    setErrors({});
    setSelected(null);
    try {
      const res = await fetch(
        `https://sudoku-api.vercel.app/api/dosuku?query={newboard(limit:1){grids{value,solution,difficulty}}}`
      );
      const data = await res.json();
      const grid = data.newboard.grids[0];
      setBoard(deepClone(grid.value));
      setSolution(grid.solution);
      setOriginal(deepClone(grid.value));
    } catch (e) {
      console.error("Error fetching sudoku:", e);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchBoard();
  }, []);

  const handleCellClick = (row, col) => {
    if (!original) return;
    if (original[row][col] !== 0) return; // no seleccionar celdas originales
    setSelected({ row, col });
  };

  const handleNumberInput = (num) => {
    if (!selected || !board) return;
    const { row, col } = selected;
    if (original[row][col] !== 0) return;

    const newBoard = deepClone(board);
    newBoard[row][col] = num;
    setBoard(newBoard);

    // limpiar error de esa celda
    const key = `${row}-${col}`;
    if (errors[key]) {
      const newErrors = { ...errors };
      delete newErrors[key];
      setErrors(newErrors);
    }
  };

  const handleCheck = () => {
    if (!board || !solution) return;
    const newErrors = {};
    let allCorrect = true;

    for (let r = 0; r < 9; r++) {
      for (let c = 0; c < 9; c++) {
        if (original[r][c] === 0) {
          if (board[r][c] === 0) {
            allCorrect = false;
          } else if (board[r][c] !== solution[r][c]) {
            newErrors[`${r}-${c}`] = true;
            allCorrect = false;
          }
        }
      }
    }

    setErrors(newErrors);
    setChecked(true);
    if (allCorrect) setWon(true);
  };

  const isSameGroup = (r, c) => {
    if (!selected) return false;
    const sameRow = r === selected.row;
    const sameCol = c === selected.col;
    const sameBox =
      Math.floor(r / 3) === Math.floor(selected.row / 3) &&
      Math.floor(c / 3) === Math.floor(selected.col / 3);
    return sameRow || sameCol || sameBox;
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
        p: 2,
        gap: 2,
        borderRadius: 4,
        backgroundColor: "transparent", // Se integra al fondo del Paper padre
        mb: 2
      }}
    >
      {/* Título */}
      <Typography
        sx={{
          fontFamily: "'Lora', serif",
          fontSize: { xs: "1.8rem", md: "2.2rem" },
          fontWeight: 700,
          color: "#2c3e50", // Azul grisáceo oscuro para mejor contraste
          letterSpacing: "0.05em",
        }}
      >
        Sudoku
      </Typography>

      {/* Selectores de dificultad */}
      <Box sx={{ display: "flex", gap: 1 }}>
        {DIFFICULTIES.map((d) => (
          <Button
            key={d}
            onClick={() => setDifficulty(d)}
            sx={{
              px: 2,
              borderRadius: 3,
              fontSize: "0.8rem",
              fontFamily: "'Lora', serif",
              textTransform: "capitalize",
              // Colores de modo claro
              color: difficulty === d ? "#fff" : "#555",
              backgroundColor: difficulty === d ? "#7d745c" : "#f0f0f0",
              border: "1px solid",
              borderColor: difficulty === d ? "#7d745c" : "#ccc",
              "&:hover": {
                backgroundColor: difficulty === d ? "#6a624d" : "#e0e0e0",
                borderColor: "#bbb"
              },
            }}
          >
            {d === "easy" ? "Fácil" : d === "medium" ? "Medio" : "Difícil"}
          </Button>
        ))}
      </Box>

      {/* Tablero */}
      {loading ? (
        <CircularProgress sx={{ color: "#7d745c" }} />
      ) : won ? (
        <Box sx={{ textAlign: "center", py: 4 }}>
          <EmojiEventsRoundedIcon sx={{ fontSize: "4rem", color: "#7d745c" }} />
          <Typography sx={{ fontFamily: "'Lora', serif", fontSize: "1.5rem", color: "#2c3e50", mt: 1 }}>
            ¡Felicitaciones, completaste el Sudoku!
          </Typography>
          <Button
            onClick={() => fetchBoard()}
            sx={{
              mt: 2,
              backgroundColor: "#7d745c",
              color: "#fff",
              fontFamily: "'Lora', serif",
              "&:hover": { backgroundColor: "#6a624d" }
            }}
          >
            Jugar de nuevo
          </Button>
        </Box>
      ) : board ? (
        <Box
          sx={{
            border: "3px solid #7d745c",
            borderRadius: 2,
            overflow: "hidden",
            boxShadow: "0 8px 24px rgba(0,0,0,0.1)", // Sombra más suave para modo claro
            backgroundColor: "#fff", // Fondo blanco para las celdas
          }}
        >
          {board.map((row, r) => (
            <Box key={r} sx={{ display: "flex" }}>
              {row.map((val, c) => {
                const isSelected = selected?.row === r && selected?.col === c;
                const isHighlighted = isSameGroup(r, c);
                const isOriginal = original?.[r][c] !== 0;
                const isError = errors[`${r}-${c}`];

                // Bordes internos ajustados
                const borderRight = (c + 1) % 3 === 0 && c !== 8 ? "2px solid #7d745c" : "1px solid #e0e0e0";
                const borderBottom = (r + 1) % 3 === 0 && r !== 8 ? "2px solid #7d745c" : "1px solid #e0e0e0";

                return (
                  <Box
                    key={c}
                    onClick={() => handleCellClick(r, c)}
                    sx={{
                      width: { xs: "36px", sm: "48px", md: "52px" },
                      height: { xs: "36px", sm: "48px", md: "52px" },
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      cursor: isOriginal ? "default" : "pointer",
                      borderRight,
                      borderBottom,
                      backgroundColor: isSelected
                        ? "#d9d2c2" // Selección clara
                        : isError
                          ? "#fee2e2" // Error suave (rojo pastel)
                          : isHighlighted
                            ? "#f9f7f2" // Resaltado de fila/columna muy tenue
                            : "#fff",
                      transition: "all 0.1s ease",
                      "&:hover": {
                        backgroundColor: isOriginal ? undefined : isSelected ? "#d9d2c2" : "#f0eee4",
                      },
                    }}
                  >
                    <Typography
                      sx={{
                        fontFamily: "'Lora', serif",
                        fontSize: { xs: "1rem", sm: "1.2rem", md: "1.4rem" },
                        fontWeight: isOriginal ? 700 : 400,
                        color: isError
                          ? "#dc2626" // Texto error
                          : isOriginal
                            ? "#1a1a1a" // Números fijos (negro fuerte)
                            : "#6b7280", // Números del usuario (gris)
                      }}
                    >
                      {val !== 0 ? val : ""}
                    </Typography>
                  </Box>
                );
              })}
            </Box>
          ))}
        </Box>
      ) : null}

      {/* Teclado numérico */}
      {!loading && !won && (
        <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap", justifyContent: "center", mt: 1 }}>
          {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((n) => (
            <Button
              key={n}
              onClick={() => handleNumberInput(n)}
              sx={{
                minWidth: { xs: "40px", sm: "48px" },
                height: { xs: "40px", sm: "48px" },
                borderRadius: 2,
                fontSize: "1.2rem",
                fontFamily: "'Lora', serif",
                fontWeight: 600,
                color: "#4b5563",
                backgroundColor: "#fff",
                border: "1px solid #d1d5db",
                boxShadow: "0 2px 4px rgba(0,0,0,0.05)",
                "&:hover": { backgroundColor: "#f3f4f6", borderColor: "#9ca3af" },
              }}
            >
              {n}
            </Button>
          ))}
          <Button
            onClick={() => handleNumberInput(0)}
            sx={{
              minWidth: { xs: "40px", sm: "48px" },
              height: { xs: "40px", sm: "48px" },
              borderRadius: 2,
              color: "#9ca3af",
              backgroundColor: "#fff",
              border: "1px solid #d1d5db",
              "&:hover": { backgroundColor: "#fee2e2", color: "#dc2626" },
            }}
          >
            ✕
          </Button>
        </Box>
      )}

      {/* Botones de acción */}
      {!loading && !won && (
        <Box sx={{ display: "flex", gap: 2, mt: 1 }}>
          <Button
            onClick={() => fetchBoard()}
            startIcon={<RefreshRoundedIcon />}
            sx={{
              color: "#555",
              fontFamily: "'Lora', serif",
              textTransform: "none",
              px: 3,
              "&:hover": { backgroundColor: "#e0e0e0" },
            }}
          >
            Nuevo juego
          </Button>
          <Button
            onClick={handleCheck}
            startIcon={<CheckRoundedIcon />}
            sx={{
              color: "#fff",
              backgroundColor: "#7d745c",
              fontFamily: "'Lora', serif",
              textTransform: "none",
              px: 3,
              "&:hover": { backgroundColor: "#6a624d" },
            }}
          >
            Verificar
          </Button>
        </Box>
      )}

      {checked && !won && Object.keys(errors).length === 0 && (
        <Typography sx={{ color: "#16a34a", fontFamily: "'Lora', serif", fontWeight: 500 }}>
          ¡Todo bien hasta ahora, seguí así!
        </Typography>
      )}
    </Box>
  );
}
