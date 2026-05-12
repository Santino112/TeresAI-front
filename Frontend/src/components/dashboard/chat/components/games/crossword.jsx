import { useEffect, useState, useCallback } from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import CircularProgress from "@mui/material/CircularProgress";
import RefreshRoundedIcon from "@mui/icons-material/RefreshRounded";
import CheckRoundedIcon from "@mui/icons-material/CheckRounded";
import { getCrossword } from "../../exports/crossword.js";

const DIFFICULTIES = ["Fácil", "Medio", "Difícil"];

const cloneGrid = (grid) => grid.map(row => [...row]);

export default function Crossword() {
  const [grid, setGrid] = useState(null);
  const [solution, setSolution] = useState(null);
  const [selected, setSelected] = useState(null);
  const [difficulty, setDifficulty] = useState("Fácil");
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [won, setWon] = useState(false);
  const [clues, setClues] = useState([]);
  const [numbers, setNumbers] = useState(null);

  const fetchCrossword = useCallback(async () => {
    console.log("Fetch Crossword");

    setLoading(true);
    setWon(false);
    setErrors({});
    setSelected(null);

    try {
      const data = await getCrossword(difficulty);

      setSolution(data.grid);

      setGrid(
        data.grid.map(row =>
          row.map(cell => (cell !== null ? "" : null))
        )
      );

      setClues(data.clues || []);
      setNumbers(data.numbers || []);

    } catch (err) {
      console.error("Error cargando crucigrama", err);
    }

    setLoading(false);
  }, [difficulty]);

  useEffect(() => {
    fetchCrossword();
  }, [difficulty]);

  const handleCellClick = (row, col) => {
    if (!solution || solution[row][col] === null) return;
    setSelected({ row, col });
  };

  const handleInput = (letter) => {
    if (!selected) return;

    const { row, col } = selected;

    const newGrid = cloneGrid(grid);
    newGrid[row][col] = letter.toUpperCase();
    setGrid(newGrid);

    const nextCol = col + 1;

    if (solution[row]?.[nextCol]) {
      setSelected({ row, col: nextCol });
    }
  };

  const handleCheck = () => {
    const newErrors = {};
    let allCorrect = true;

    for (let r = 0; r < solution.length; r++) {
      for (let c = 0; c < solution[r].length; c++) {
        if (!solution[r][c]) continue;

        if (grid[r][c] !== solution[r][c]) {
          newErrors[`${r}-${c}`] = true;
          allCorrect = false;
        }
      }
    }

    setErrors(newErrors);
    if (allCorrect) setWon(true);
  };

  const isSameRowCol = (r, c) => {
    if (!selected) return false;
    return r === selected.row || c === selected.col;
  };

  // separar palabras
  const acrossClues = clues.filter(c => c.direction === "Horizontal");
  const downClues = clues.filter(c => c.direction === "Vertical");
  return (
    <Box sx={{
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      height: "100%",
      p: 2,
      gap: 3, // Un poco más de aire
      overflowY: "auto",
      background: "transparent"
    }}>

      <Typography sx={{
        fontSize: "2.2rem",
        fontWeight: 700,
        color: "#2c3e50"
      }}>
        Crucigrama
      </Typography>

      {/* Selectores de Dificultad */}
      <Box sx={{ display: "flex", gap: 1 }}>
        {DIFFICULTIES.map(d => (
          <Button
            key={d}
            onClick={() => setDifficulty(d)}
            sx={{
              borderRadius: 3,
              textTransform: "capitalize",
              fontSize: "1rem",
              px: 2,
              color: difficulty === d ? "#fff" : "#555",
              backgroundColor: difficulty === d ? "#7d745c" : "#f0f0f0",
              border: "1px solid",
              borderColor: difficulty === d ? "#7d745c" : "#ccc",
              "&:hover": {
                backgroundColor: difficulty === d ? "#6a624d" : "#e0e0e0"
              }
            }}
          >
            {d}
          </Button>
        ))}
      </Box>

      {/* GRID DEL CRUCIGRAMA */}
      {loading ? (
        <CircularProgress sx={{ color: "#7d745c" }} />
      ) : grid && (
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            border: "2px solid #7d745c", // Marco exterior
            borderRadius: 1,
            overflow: "hidden",
            boxShadow: "0 4px 20px rgba(0,0,0,0.08)"
          }}
        >
          {grid.map((row, r) => (
            <Box key={r} sx={{ display: "flex" }}>
              {row.map((cell, c) => {
                const isSelected = selected?.row === r && selected?.col === c;
                const isError = errors[`${r}-${c}`];
                const isBlocked = solution[r][c] === null;
                const number = numbers?.[r]?.[c];

                return (
                  <Box
                    key={c}
                    onClick={() => handleCellClick(r, c)}
                    sx={{
                      width: { xs: 34, sm: 40 },
                      height: { xs: 34, sm: 40 },
                      position: "relative",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      border: "0.5px solid #d1d5db", // Bordes de celda más finos
                      backgroundColor: isBlocked
                        ? "#2c3e50" // Bloques oscuros (azul grisáceo)
                        : isSelected
                          ? "#d9d2c2" // Color de selección (Sage claro)
                          : isSameRowCol(r, c)
                            ? "#f9f7f2" // Resaltado de línea
                            : isError
                              ? "#fee2e2" // Error suave
                              : "#fff",
                      cursor: isBlocked ? "default" : "pointer",
                      transition: "background-color 0.1s"
                    }}
                  >
                    {/* 🔢 Número de pista */}
                    {number && (
                      <Typography
                        sx={{
                          position: "absolute",
                          top: 1,
                          left: 2,
                          fontSize: "0.65rem",
                          fontWeight: 700,
                          color: isBlocked ? "#fff" : "#7d745c"
                        }}
                      >
                        {number}
                      </Typography>
                    )}

                    <Typography sx={{
                      color: isError ? "#dc2626" : "#1a1a1a",
                      fontSize: "1.1rem",
                      fontWeight: 600,
                      textTransform: "uppercase"
                    }}>
                      {cell}
                    </Typography>
                  </Box>
                );
              })}
            </Box>
          ))}
        </Box>
      )}

      {/* TECLADO DE LETRAS */}
      {!loading && !won && (
        <Box sx={{
          display: "flex",
          flexWrap: "wrap",
          gap: 0.5,
          maxWidth: 450,
          justifyContent: "center",
          mt: 1
        }}>
          {"ABCDEFGHIJKLMNÑOPQRSTUVWXYZ".split("").map(l => (
            <Button
              key={l}
              onClick={() => handleInput(l)}
              sx={{
                minWidth: { xs: 32, sm: 38 },
                height: 38,
                p: 0,
                fontSize: "0.9rem",
                fontWeight: 600,
                color: "#4b5563",
                backgroundColor: "#fff",
                border: "1px solid #d1d5db",
                "&:hover": {
                  backgroundColor: "#f3f4f6",
                  borderColor: "#9ca3af"
                }
              }}
            >
              {l}
            </Button>
          ))}
          <Button
            onClick={() => handleInput("")}
            sx={{
              minWidth: { xs: 32, sm: 38 },
              height: 38,
              backgroundColor: "#fff",
              fontSize: "1rem",
              border: "1px solid #d1d5db",
              color: "#9ca3af",
              "&:hover": { backgroundColor: "#fee2e2", color: "#dc2626" }
            }}
          >
            ✕
          </Button>
        </Box>
      )}

      {/* BOTONES DE ACCIÓN */}
      <Box sx={{ display: "flex", gap: 2, mt: 1 }}>
        <Button
          onClick={fetchCrossword}
          startIcon={<RefreshRoundedIcon />}
          sx={{
            color: "#555",
            fontSize: "1rem",
            textTransform: "none",
            px: 3,
             "&:hover": { backgroundColor: "#e0e0e0" },
          }}
        >
          Nuevo juego
        </Button>

        <Button
          onClick={handleCheck}
          variant="contained"
          startIcon={<CheckRoundedIcon />}
          sx={{
            color: "#fff",
            backgroundColor: "#7d745c",
            fontSize: "1rem",
            textTransform: "none",
            px: 3,
            "&:hover": { backgroundColor: "#6a624d" }
          }}
        >
          Verificar
        </Button>
      </Box>

      {/* PISTAS ORGANIZADAS */}
      <Box sx={{
        width: "100%",
        maxWidth: 600,
        mt: 2,
        p: 2,
        borderRadius: 2,
        backgroundColor: "rgba(255,255,255,0.5)", // Fondo sutil para las pistas
        maxHeight: 250,
        overflowY: "auto",
        border: "1px solid #e5e7eb"
      }}>
        <Typography variant="subtitle2" sx={{ color: "#7d745c", fontWeight: 800, mb: 1, textTransform: "uppercase" }}>
          Horizontales
        </Typography>
        {acrossClues.map((c) => (
          <Typography key={c.number} sx={{ color: "#374151", mb: 0.5, fontSize: "0.95rem" }}>
            <strong>{c.number}.</strong> {c.clue}
          </Typography>
        ))}

        <Typography variant="subtitle2" sx={{ color: "#7d745c", fontWeight: 800, mt: 3, mb: 1, textTransform: "uppercase" }}>
          Verticales
        </Typography>
        {downClues.map((c) => (
          <Typography key={c.number} sx={{ color: "#374151", mb: 0.5, fontSize: "0.95rem" }}>
            <strong>{c.number}.</strong> {c.clue}
          </Typography>
        ))}
      </Box>

      {won && (
        <Typography sx={{
          color: "#16a34a",
          fontWeight: 700,
          fontSize: "1.2rem",
          mt: 2
        }}>
          ¡Excelente! Crucigrama completado ✨
        </Typography>
      )}
    </Box>
  );
}
