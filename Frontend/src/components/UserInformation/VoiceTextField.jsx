import { useState, useRef } from "react";
import { TextField, IconButton, Box, CircularProgress, Tooltip } from "@mui/material";
import MicRoundedIcon from "@mui/icons-material/MicRounded";
import MicOffRoundedIcon from "@mui/icons-material/MicOffRounded";
import api from "../../api/axios.js";

const SILENCE_THRESHOLD = 0.02;
const SILENCE_DURATION_MS = 1400;
const MAX_WAIT_FOR_VOICE_MS = 6000;

const VoiceTextField = ({
  value,
  onChange,
  placeholder,
  multiline,
  minRows,
  maxRows,
  fullWidth = true,
  sx,
  error,
  type = "text",
  helperText,
  disabled = false,
  inputProps,
  ...textFieldProps
}) => {
  const [recording, setRecording] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const mediaRecorderRef = useRef(null);
  const streamRef = useRef(null);
  const audioContextRef = useRef(null);
  const analyserRef = useRef(null);
  const animationFrameRef = useRef(null);
  const silenceSinceRef = useRef(null);
  const speechDetectedRef = useRef(false);
  const chunksRef = useRef([]);
  const startTimeRef = useRef(null);

  const cleanupMonitoring = () => {
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
      animationFrameRef.current = null;
    }
    silenceSinceRef.current = null;
    speechDetectedRef.current = false;
    if (audioContextRef.current) {
      audioContextRef.current.close().catch(() => {});
      audioContextRef.current = null;
    }
    analyserRef.current = null;
  };

  const stopTracks = () => {
    streamRef.current?.getTracks().forEach((track) => track.stop());
    streamRef.current = null;
  };

  const startMonitoring = () => {
    if (!streamRef.current) return;

    try {
      audioContextRef.current = new (window.AudioContext || window.webkitAudioContext)();
      analyserRef.current = audioContextRef.current.createAnalyser();
      const source = audioContextRef.current.createMediaStreamSource(streamRef.current);
      source.connect(analyserRef.current);

      const dataArray = new Uint8Array(analyserRef.current.frequencyBinCount);
      silenceSinceRef.current = Date.now();
      speechDetectedRef.current = false;

      const checkAudio = () => {
        analyserRef.current.getByteFrequencyData(dataArray);
        const average = dataArray.reduce((a, b) => a + b) / dataArray.length;

        if (average > SILENCE_THRESHOLD) {
          silenceSinceRef.current = Date.now();
          speechDetectedRef.current = true;
        }

        const silenceDuration = Date.now() - silenceSinceRef.current;
        const totalDuration = Date.now() - startTimeRef.current;

        if (
          speechDetectedRef.current &&
          silenceDuration > SILENCE_DURATION_MS &&
          totalDuration > 500
        ) {
          stopRecording("silence");
          return;
        }

        if (totalDuration > MAX_WAIT_FOR_VOICE_MS && !speechDetectedRef.current) {
          stopRecording("no_voice");
          return;
        }

        animationFrameRef.current = requestAnimationFrame(checkAudio);
      };

      checkAudio();
    } catch (error) {
      console.error("Error inicializando monitoreo:", error);
      stopRecording("error");
    }
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;
      chunksRef.current = [];
      startTimeRef.current = Date.now();

      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          chunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = async () => {
        cleanupMonitoring();
        stopTracks();

        const audioBlob = new Blob(chunksRef.current, { type: "audio/webm" });
        await sendAudioToWhisper(audioBlob);
        chunksRef.current = [];
      };

      mediaRecorder.start();
      setRecording(true);
      startMonitoring();
    } catch (error) {
      console.error("Error iniciando grabación:", error);
      setRecording(false);
    }
  };

  const stopRecording = async (reason = "manual") => {
    void reason;
    cleanupMonitoring();

    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== "inactive") {
      try {
        mediaRecorderRef.current.stop();
      } catch (error) {
        console.error("Error deteniendo grabación:", error);
      }
    }

    stopTracks();
    setRecording(false);
  };

  const sendAudioToWhisper = async (audioBlob) => {
    if (audioBlob.size < 100) return;

    setIsProcessing(true);
    try {
      const formData = new FormData();
      formData.append("audio", audioBlob, "recording.webm");

      const res = await api.post("/ai/transcribe", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      const textoLimpio = res.data?.text?.trim();

      if (textoLimpio && textoLimpio.length > 1) {
        // Append to existing value if there's text, or replace if empty
        if (value) {
          onChange({ target: { value: value + " " + textoLimpio } });
        } else {
          onChange({ target: { value: textoLimpio } });
        }
      }
    } catch (error) {
      console.error("Error transcribiendo audio:", error);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleMicClick = () => {
    if (recording) {
      stopRecording("manual");
    } else {
      startRecording();
    }
  };

  return (
    <Box sx={{ display: "flex", gap: 1, alignItems: "flex-start", width: fullWidth ? "100%" : "auto" }}>
      <TextField
        error={error}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        variant="outlined"
        multiline={multiline}
        minRows={minRows}
        maxRows={maxRows}
        fullWidth={fullWidth}
        type={type}
        helperText={helperText}
        disabled={disabled || isProcessing}
        inputProps={inputProps}
        {...textFieldProps}
        sx={{
          backgroundColor: "#d7d6d6",
          color: "#000000",
          borderRadius: 3,
          boxShadow: 3,
          "& .MuiInputBase-input": {
            color: "#000000",
            WebkitTextFillColor: "#000000",
          },
          "& textarea": {
            color: "#000000",
          },
          "& .MuiOutlinedInput-root": {
            borderRadius: 3,
            pr: 1,
          },
          "& fieldset": {
            borderColor: "transparent",
          },
          "& .MuiInputBase-input::placeholder": {
            color: "#000000",
            opacity: 0.6,
          },
          "&:hover fieldset": {
            borderColor: "transparent",
          },
          "&.Mui-focused fieldset": {
            borderColor: "gray",
          },
          "& .MuiFormHelperText-root": {
            color: "#000000",
            opacity: 0.8,
            fontWeight: 500,
          },
          ...sx,
        }}
      />
      <Tooltip title={recording ? "Detener grabación" : "Grabar con voz"}>
        <IconButton
          onClick={handleMicClick}
          aria-label={recording ? "Detener grabación por voz" : "Grabar texto por voz"}
          disabled={isProcessing}
          sx={{
            mt: multiline ? 0.5 : 0,
            color: recording ? "#d32f2f" : "#000000",
            backgroundColor: recording ? "rgba(211, 47, 47, 0.1)" : "transparent",
            "&:hover": {
              backgroundColor: recording ? "rgba(211, 47, 47, 0.2)" : "rgba(0, 0, 0, 0.1)",
            },
          }}
        >
          {isProcessing ? (
            <CircularProgress size={24} />
          ) : recording ? (
            <MicOffRoundedIcon />
          ) : (
            <MicRoundedIcon />
          )}
        </IconButton>
      </Tooltip>
    </Box>
  );
};

export default VoiceTextField;
