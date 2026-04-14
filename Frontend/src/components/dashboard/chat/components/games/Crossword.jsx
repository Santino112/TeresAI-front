import { useEffect, useState, useCallback } from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import CircularProgress from "@mui/material/CircularProgress";
import RefreshRoundedIcon from "@mui/icons-material/RefreshRounded";
import CheckRoundedIcon from "@mui/icons-material/CheckRounded";
import { getCrossword } from "../../exports/crossword.js";

const DIFFICULTIES = ["easy", "medium", "hard"];

const cloneGrid = (grid) => grid.map(row => [...row]);

export default function Crossword() {
  const [grid, setGrid] = useState(null);
  const [solution, setSolution] = useState(null);
  const [words, setWords] = useState([]);
  const [selected, setSelected] = useState(null);
  const [difficulty, setDifficulty] = useState("easy");
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
      
      setWords(data.words);
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
      gap: 2,
      overflowY: "auto",
      background: "transparent"
    }}>

      <Typography sx={{
        fontFamily: "'Lora', serif",
        fontSize: "2rem",
        color: "#E6E6E6"
      }}>
        Crucigrama
      </Typography>

      {/* Dificultad */}
      <Box sx={{ display: "flex", gap: 1 }}>
        {DIFFICULTIES.map(d => (
          <Button
            key={d}
            onClick={() => setDifficulty(d)}
            sx={{
              color: difficulty === d ? "#1a1f1a" : "#aaa",
              backgroundColor: difficulty === d ? "#918B76" : "transparent"
            }}
          >
            {d}
          </Button>
        ))}
      </Box>

      {/* GRID */}
      {loading ? (
        <CircularProgress />
      ) : grid && (
        <Box sx={{ display: "flex", flexDirection: "column" }}>
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
                      border: "1px solid #444",
                      backgroundColor: isBlocked
                        ? "#111"
                        : isSelected
                        ? "#918B76"
                        : isSameRowCol(r, c)
                        ? "rgba(145,139,118,0.2)"
                        : isError
                        ? "rgba(180,60,60,0.5)"
                        : "#262a25",
                      cursor: isBlocked ? "default" : "pointer"
                    }}
                  >
                    {/* 🔢 número */}
                    {number && (
                      <Typography
                        sx={{
                          position: "absolute",
                          top: 2,
                          left: 3,
                          fontSize: "0.6rem",
                          color: "#aaa"
                        }}
                      >
                        {number}
                      </Typography>
                    )}

                    <Typography sx={{ color: "#fff", fontSize: "1rem" }}>
                      {cell}
                    </Typography>
                  </Box>
                );
              })}
            </Box>
          ))}
        </Box>
      )}

      {/* INPUT LETRAS */}
      {!loading && !won && (
        <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1, maxWidth: 400 }}>
          {"ABCDEFGHIJKLMNÑOPQRSTUVWXYZ".split("").map(l => (
            <Button
              key={l}
              onClick={() => handleInput(l)}
              sx={{
                minWidth: 32,
                color: "#E6E6E6",
                backgroundColor: "#353A36"
              }}
            >
              {l}
            </Button>
          ))}
        </Box>
      )}

      {/* ACCIONES */}
      <Box sx={{ display: "flex", gap: 2 }}>
        <Button onClick={fetchCrossword} startIcon={<RefreshRoundedIcon />}>
          Nuevo
        </Button>

        <Button onClick={handleCheck} startIcon={<CheckRoundedIcon />}>
          Verificar
        </Button>
      </Box>

      {/* PISTAS ORGANIZADAS */}
      <Box sx={{ width: "100%", maxWidth: 600, mt: 2, maxHeight: 200, overflowY: "auto" }}>
        <Typography sx={{ color: "#aaa", mb: 1 }}>
          Horizontales
        </Typography>

        {acrossClues.map((c) => (
          <Typography key={c.number} sx={{ color: "#E6E6E6" }}>
            {c.number}. {c.clue}
          </Typography>
        ))}

        <Typography sx={{ color: "#aaa", mt: 2, mb: 1 }}>
          Verticales
        </Typography>

        {downClues.map((c) => (
          <Typography key={c.number} sx={{ color: "#E6E6E6" }}>
            {c.number}. {c.clue}
          </Typography>
        ))}
      </Box>

      {won && (
        <Typography sx={{ color: "#a8c5a0" }}>
          ¡Crucigrama completado!
        </Typography>
      )}
    </Box>
  );
}