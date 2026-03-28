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

  const fetchBoard = useCallback(async (diff = difficulty) => {
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
  }, [difficulty]);

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
        overflowY: "auto",
        borderRadius: 4,
        boxShadow: 1,
        background: "linear-gradient(160deg, #1a1f1a 0%, #2f342d 100%)"
      }}
    >
      {/* Título */}
      <Typography
        sx={{
          fontFamily: "'Lora', serif",
          fontSize: { xs: "1.8rem", md: "2.2rem" },
          fontWeight: 700,
          color: "#E6E6E6",
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

      {/* Tablero */}
      {loading ? (
        <CircularProgress sx={{ color: "#918B76" }} />
      ) : won ? (
        <Box sx={{ textAlign: "center", py: 4 }}>
          <EmojiEventsRoundedIcon sx={{ fontSize: "4rem", color: "#918B76" }} />
          <Typography sx={{ fontFamily: "'Lora', serif", fontSize: "1.5rem", color: "#E6E6E6", mt: 1 }}>
            ¡Felicitaciones, completaste el Sudoku!
          </Typography>
          <Button
            onClick={() => fetchBoard()}
            sx={{ mt: 2, backgroundColor: "#918B76", color: "#fff", fontFamily: "'Lora', serif", "&:hover": { backgroundColor: "#7a7664" } }}
          >
            Jugar de nuevo
          </Button>
        </Box>
      ) : board ? (
        <Box
          sx={{
            border: "3px solid #918B76",
            borderRadius: 2,
            overflow: "hidden",
            boxShadow: "0 8px 32px rgba(0,0,0,0.5)",
          }}
        >
          {board.map((row, r) => (
            <Box key={r} sx={{ display: "flex" }}>
              {row.map((val, c) => {
                const isSelected = selected?.row === r && selected?.col === c;
                const isHighlighted = isSameGroup(r, c);
                const isOriginal = original?.[r][c] !== 0;
                const isError = errors[`${r}-${c}`];
                const borderRight = (c + 1) % 3 === 0 && c !== 8 ? "2px solid #918B76" : "1px solid #3a3f3a";
                const borderBottom = (r + 1) % 3 === 0 && r !== 8 ? "2px solid #918B76" : "1px solid #3a3f3a";

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
                        ? "#918B76"
                        : isError
                        ? "rgba(180,60,60,0.35)"
                        : isHighlighted
                        ? "rgba(145,139,118,0.15)"
                        : "transparent",
                      transition: "background-color 0.15s ease",
                      "&:hover": {
                        backgroundColor: isOriginal ? undefined : isSelected ? "#918B76" : "rgba(145,139,118,0.25)",
                      },
                    }}
                  >
                    <Typography
                      sx={{
                        fontFamily: "'Lora', serif",
                        fontSize: { xs: "1rem", sm: "1.2rem", md: "1.4rem" },
                        fontWeight: isOriginal ? 700 : 400,
                        color: isSelected
                          ? "#1a1f1a"
                          : isError
                          ? "#ff6b6b"
                          : isOriginal
                          ? "#E6E6E6"
                          : "#a8c5a0",
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
        <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap", justifyContent: "center" }}>
          {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((n) => (
            <Button
              key={n}
              onClick={() => handleNumberInput(n)}
              sx={{
                minWidth: { xs: "36px", sm: "44px" },
                height: { xs: "36px", sm: "44px" },
                p: 0,
                borderRadius: 2,
                fontSize: "1.1rem",
                fontFamily: "'Lora', serif",
                fontWeight: 600,
                color: "#E6E6E6",
                backgroundColor: "#353A36",
                border: "1px solid #444",
                "&:hover": { backgroundColor: "#565E58" },
              }}
            >
              {n}
            </Button>
          ))}
          <Button
            onClick={() => handleNumberInput(0)}
            sx={{
              minWidth: { xs: "36px", sm: "44px" },
              height: { xs: "36px", sm: "44px" },
              p: 0,
              borderRadius: 2,
              fontSize: "0.75rem",
              fontFamily: "'Lora', serif",
              color: "#aaa",
              backgroundColor: "#353A36",
              border: "1px solid #444",
              "&:hover": { backgroundColor: "#565E58" },
            }}
          >
            ✕
          </Button>
        </Box>
      )}

      {/* Botones de acción */}
      {!loading && !won && (
        <Box sx={{ display: "flex", gap: 2 }}>
          <Button
            onClick={() => fetchBoard()}
            startIcon={<RefreshRoundedIcon />}
            sx={{
              color: "#E6E6E6",
              backgroundColor: "#353A36",
              fontFamily: "'Lora', serif",
              border: "1px solid #444",
              "&:hover": { backgroundColor: "#565E58" },
            }}
          >
            Nuevo
          </Button>
          <Button
            onClick={handleCheck}
            startIcon={<CheckRoundedIcon />}
            sx={{
              color: "#1a1f1a",
              backgroundColor: "#918B76",
              fontFamily: "'Lora', serif",
              "&:hover": { backgroundColor: "#7a7664" },
            }}
          >
            Verificar
          </Button>
        </Box>
      )}

      {checked && !won && Object.keys(errors).length === 0 && (
        <Typography sx={{ color: "#a8c5a0", fontFamily: "'Lora', serif" }}>
          ¡Todo bien hasta ahora, seguí así!
        </Typography>
      )}
    </Box>
  );
}
