import { Box, Typography } from "@mui/material";
import GraphicEqRoundedIcon from "@mui/icons-material/GraphicEqRounded";
import MicRoundedIcon from "@mui/icons-material/MicRounded";

const modeConfig = {
  wake: {
    label: "Di: Ey Teresa",
    background: "rgba(192, 190, 185, 0.72)",
    color: "#111111",
    icon: GraphicEqRoundedIcon,
  },
  dictation: {
    label: "Escuchando tu mensaje",
    background: "rgba(125, 116, 92, 0.9)",
    color: "#ffffff",
    icon: MicRoundedIcon,
  },
  thinking: {
    label: "Pensando...",
    background: "rgba(70, 69, 69, 0.9)",
    color: "#ffffff",
    icon: MicRoundedIcon,
  },
};

function VoiceStatusPill({ mode, supported = true, sx = {} }) {
  if (!supported || !modeConfig[mode]) return null;

  const { label, background, color, icon: Icon } = modeConfig[mode];

  return (
    <Box
      sx={{
        display: "inline-flex",
        alignItems: "center",
        gap: 1,
        px: 1.25,
        py: 0.75,
        borderRadius: 999,
        background,
        color,
        boxShadow: 2,
        backdropFilter: "blur(6px)",
        width: "fit-content",
        ...sx,
      }}
    >
      <Box
        sx={{
          width: 9,
          height: 9,
          borderRadius: "50%",
          bgcolor: color,
          animation: "voicePulse 1.6s ease-in-out infinite",
          "@keyframes voicePulse": {
            "0%": { transform: "scale(0.92)", opacity: 0.6 },
            "50%": { transform: "scale(1.2)", opacity: 1 },
            "100%": { transform: "scale(0.92)", opacity: 0.6 },
          },
        }}
      />
      <Icon fontSize="small" />
      <Typography
        component="span"
        sx={{
          fontSize: "0.8rem",
          fontWeight: 700,
          letterSpacing: 0.2,
          lineHeight: 1,
        }}
      >
        {label}
      </Typography>
    </Box>
  );
}

export default VoiceStatusPill;
