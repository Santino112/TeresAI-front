import { useState, useRef, useEffect } from "react";
import { TextField, IconButton, Box, CircularProgress, Tooltip, InputAdornment, Alert } from "@mui/material";
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
  helperText,
  disabled = false,
  InputProps,
  onStart,
  onStop,
  ...textFieldProps
}) => {
  // ESTADOS PARA ALERTS
  const [errorAlert, setErrorAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [severity, setSeverity] = useState("");

  const [recording, setRecording] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [stream, setStream] = useState(null);
  const [mediaRecorder, setMediaRecorder] = useState(null);

  // REFERENCIAS
  const mediaRecorderRef = useRef(null);
  const streamRef = useRef(null);
  const audioContextRef = useRef(null);
  const analyserRef = useRef(null);
  const animationFrameRef = useRef(null);
  const silenceSinceRef = useRef(null);
  const speechDetectedRef = useRef(false);
  const startTimeRef = useRef(null);
  const recordingRef = useRef(false);
  const autoStopRef = useRef(false);
  const abortarEnvioRef = useRef(false);

  const cleanupMonitoring = () => {
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
      animationFrameRef.current = null;
    }
    silenceSinceRef.current = null;
    speechDetectedRef.current = false;
    if (audioContextRef.current) {
      audioContextRef.current.close().catch(() => { });
      audioContextRef.current = null;
    }
    analyserRef.current = null;
  };

  const stopTracks = () => {
    streamRef.current?.getTracks().forEach((track) => track.stop());
    streamRef.current = null;
    setStream(null);
  };

  // Función de nivel de audio (del segundo JSX)
  const sampleAudioLevel = () => {
    const analyser = analyserRef.current;
    if (!analyser || !recordingRef.current) return;

    const buffer = new Uint8Array(analyser.fftSize);
    analyser.getByteTimeDomainData(buffer);

    let sumSquares = 0;
    for (let i = 0; i < buffer.length; i += 1) {
      const normalized = (buffer[i] - 128) / 128;
      sumSquares += normalized * normalized;
    }

    const rms = Math.sqrt(sumSquares / buffer.length);
    const elapsed = Date.now() - (startTimeRef.current || Date.now());

    if (rms >= SILENCE_THRESHOLD) {
      speechDetectedRef.current = true;
      silenceSinceRef.current = null;
    } else if (speechDetectedRef.current) {
      if (!silenceSinceRef.current) {
        silenceSinceRef.current = Date.now();
      }
      if (Date.now() - silenceSinceRef.current >= SILENCE_DURATION_MS) {
        stopRecording("silence");
        return;
      }
    } else if (elapsed >= MAX_WAIT_FOR_VOICE_MS) {
      stopRecording("no_voice");
      return;
    }

    animationFrameRef.current = requestAnimationFrame(sampleAudioLevel);
  };

  const startMonitoringSilence = async () => {
    const AudioContextImpl = window.AudioContext || window.webkitAudioContext;
    if (!AudioContextImpl || !streamRef.current) return;

    try {
      const audioContext = new AudioContextImpl();
      await audioContext.resume().catch(() => { });
      const source = audioContext.createMediaStreamSource(streamRef.current);
      const analyser = audioContext.createAnalyser();
      analyser.fftSize = 2048;
      source.connect(analyser);

      audioContextRef.current = audioContext;
      analyserRef.current = analyser;
      animationFrameRef.current = requestAnimationFrame(sampleAudioLevel);
    } catch (error) {
      console.warn("No se pudo iniciar la detección de silencio:", error);
      cleanupMonitoring();
    }
  };

  const startRecording = async (options = { autoStopOnSilence: true }) => {
    if (recordingRef.current) return;

    try {
      const audioStream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true,
        },
      });

      const recorder = new MediaRecorder(audioStream, {
        mimeType: "audio/webm;codecs=opus",
      });

      if (navigator.vibrate) navigator.vibrate(60);

      const chunks = [];
      autoStopRef.current = Boolean(options?.autoStopOnSilence);
      abortarEnvioRef.current = false;
      startTimeRef.current = Date.now();
      speechDetectedRef.current = false;
      silenceSinceRef.current = null;

      streamRef.current = audioStream;
      mediaRecorderRef.current = recorder;
      setStream(audioStream);
      setMediaRecorder(recorder);
      recordingRef.current = true;
      setRecording(true);

      recorder.ondataavailable = (event) => {
        chunks.push(event.data);
      };

      recorder.onstop = async () => {
        const audioBlob = new Blob(chunks, { type: "audio/webm" });
        cleanupMonitoring();
        stopTracks();
        mediaRecorderRef.current = null;
        setMediaRecorder(null);
        recordingRef.current = false;
        setRecording(false);
        if (!abortarEnvioRef.current) {
          await sendAudioToWhisper(audioBlob);
        }
      };

      recorder.start();
      onStart?.();

      if (autoStopRef.current) {
        await startMonitoringSilence();
      }
    } catch (err) {
      recordingRef.current = false;
      setRecording(false);

      // LÓGICA DE ALERTS IGUAL AL OTRO JSX
      if (err.name === "NotAllowedError" || err.name === "PermissionDeniedError") {
        setErrorAlert(true);
        setSeverity("info");
        setAlertMessage("No podemos escucharte porque el acceso al micrófono está bloqueado. Por favor, habilítalo en la configuración de tu navegador.");
        setTimeout(() => setErrorAlert(false), 7000);
      } else {
        setErrorAlert(true);
        setSeverity("error");
        setAlertMessage("Error al acceder al micrófono: " + (err.message || ""));
        setTimeout(() => setErrorAlert(false), 5000);
      }
    }
  };

  const stopRecording = (reason = "manual") => {
    const recorder = mediaRecorderRef.current;
    if (!recorder || recorder.state === "inactive") return;

    const duration = Date.now() - (startTimeRef.current || Date.now());
    // Evitar enviar si no hubo voz
    abortarEnvioRef.current = reason === "no_voice" || duration < 500;

    cleanupMonitoring();
    recordingRef.current = false;
    setRecording(false);

    try {
      recorder.stop();
    } catch (error) {
      console.warn("No se pudo detener la grabación:", error);
      stopTracks();
    }
    onStop?.();
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
        const newValue = value ? `${value} ${textoLimpio}` : textoLimpio;
        onChange({ target: { value: newValue } });
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

  // Limpieza al desmontar
  useEffect(() => {
    return () => {
      cleanupMonitoring();
      stopTracks();
    };
  }, []);

  return (
    <>
      {errorAlert && (
        <Alert
          variant="filled"
          severity={severity}
          sx={{
            position: "fixed",
            top: 20,
            left: "50%",
            transform: "translateX(-50%)",
            zIndex: 9999,
            width: { xs: "85%", sm: "auto" },
            borderRadius: 3,
            boxShadow: 4,
          }}
        >
          {alertMessage}
        </Alert>
      )}

      <TextField
        {...textFieldProps}
        value={value || ""}
        onChange={onChange}
        placeholder={placeholder}
        error={error}
        multiline={multiline}
        minRows={minRows}
        maxRows={maxRows}
        fullWidth={fullWidth}
        helperText={helperText}
        disabled={disabled || isProcessing}
        InputProps={{
          ...InputProps,
          endAdornment: (
            <InputAdornment position="end" sx={{ mt: multiline ? 1 : 0 }}>
              <Tooltip title={recording ? "Detener grabación" : "Grabar con voz"}>
                <IconButton
                  onClick={handleMicClick}
                  disabled={isProcessing}
                  size="small"
                  sx={{
                    backgroundColor: recording ? "#7d745c" : "transparent",
                    color: recording ? "#ffffff" : "#000000",
                    "&:hover": { backgroundColor: "#7d745c", color: "#ffffff" },
                    transition: "all 0.2s"
                  }}
                >
                  {isProcessing ? (
                    <CircularProgress size={20} sx={{ color: "#000000" }} />
                  ) : recording ? (
                    <MicRoundedIcon />
                  ) : (
                    <MicOffRoundedIcon />
                  )}
                </IconButton>
              </Tooltip>
            </InputAdornment>
          ),
        }}
        sx={{
          backgroundColor: "#d7d6d6",
          borderRadius: 3,
          boxShadow: 3,
          "& .MuiInputBase-input": {
            color: "#000000",
            WebkitTextFillColor: "#000000",
          },
          "& .MuiOutlinedInput-root": {
            borderRadius: 3,
            pr: 1,
            display: "flex",
            alignItems: "center", 
            "& fieldset": { borderColor: "transparent" },
            "&:hover fieldset": { borderColor: "transparent" },
            "&.Mui-focused fieldset": { borderColor: "gray" },
          },
          "& .MuiInputBase-input::placeholder": {
            color: "#000000",
            opacity: 0.6,
          },
          ...sx, 
        }}
      />
    </>
  );
};

export default VoiceTextField;