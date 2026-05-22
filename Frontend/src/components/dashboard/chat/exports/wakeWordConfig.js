export const WAKE_WORD_CONFIG = {
  language: "es-AR",
  wakePhrases: [
    "ey teresa",
    "hey teresa",
    "ayudame teresa",
    "ayuda me teresa",
    "hola teresa",
    "ok teresa",
    "okay teresa",
  ],
  // Ventana mas corta para que la activacion se sienta inmediata.
  // Si la bajamos demasiado, Whisper puede perder frases muy cortas o habladas lento.
  wakeChunkMs: 1000,
  wakeWindowChunks: 4,
  wakeCooldownMs: 500,
};
