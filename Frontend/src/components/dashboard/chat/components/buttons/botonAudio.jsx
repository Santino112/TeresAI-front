import { useEffect, useState, forwardRef, useImperativeHandle, useRef } from "react";
import { IconButton } from "@mui/material";
import axios from "axios";
import Alert from "@mui/material/Alert";
import MicRoundedIcon from "@mui/icons-material/MicRounded";
import MicOffRoundedIcon from "@mui/icons-material/MicOffRounded";
import { API_BASE_URL } from "../../../../../config/api.js";

const SILENCE_THRESHOLD = 0.02;
const SILENCE_DURATION_MS = 1400;
const MAX_WAIT_FOR_VOICE_MS = 6000;
const AUTO_MIN_DURATION_MS = 500;
const MANUAL_MIN_DURATION_MS = 1000;

const BotonAudio = forwardRef(({ onTranscription, onStart, onStop, ...props }, ref) => {
  const [errorAlert, setErrorAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [severity, setSeverity] = useState("");
  const [recording, setRecording] = useState(false);
  const [mediaRecorder, setMediaRecorder] = useState(null);
  const [stream, setStream] = useState(null);
  const abortarEnvioRef = useRef(false);
  const startTimeRef = useRef(null);
  const recordingRef = useRef(false);
  const autoStopRef = useRef(false);
  const streamRef = useRef(null);
  const mediaRecorderRef = useRef(null);
  const audioContextRef = useRef(null);
  const analyserRef = useRef(null);
  const animationFrameRef = useRef(null);
  const silenceSinceRef = useRef(null);
  const speechDetectedRef = useRef(false);

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
    setStream(null);
  };

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

    if (!AudioContextImpl) return;

    try {
      const audioContext = new AudioContextImpl();
      await audioContext.resume().catch(() => {});

      const source = audioContext.createMediaStreamSource(streamRef.current);
      const analyser = audioContext.createAnalyser();
      analyser.fftSize = 2048;
      source.connect(analyser);

      audioContextRef.current = audioContext;
      analyserRef.current = analyser;
      animationFrameRef.current = requestAnimationFrame(sampleAudioLevel);
    } catch (error) {
      console.warn("No se pudo iniciar la deteccion de silencio:", error?.message || error);
      cleanupMonitoring();
    }
  };

  const startRecording = async (options = {}) => {
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

      if (navigator.vibrate) {
        navigator.vibrate(60);
      }

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

        await sendAudioToWhisper(audioBlob);
      };

      recorder.start();
      onStart?.();

      if (autoStopRef.current) {
        await startMonitoringSilence();
      }
    } catch (err) {
      recordingRef.current = false;
      setRecording(false);

      if (err.name === "NotAllowedError") {
        setErrorAlert(true);
        setSeverity("info");
        setAlertMessage("No podemos escucharte porque el acceso al micrófono está bloqueado. Por favor, habilítalo en la configuración de tu navegador.");
        setTimeout(() => {
          setErrorAlert(false);
        }, 7000);
      } else {
        setErrorAlert(true);
        setSeverity("error");
        setAlertMessage("Error al acceder al micrófono:");
        setTimeout(() => {
          setErrorAlert(false);
        }, 5000);
      }
    }
  };

  const stopRecording = (reason = "manual") => {
    const recorder = mediaRecorderRef.current;

    if (!recorder || recorder.state === "inactive") return;

    const duration = Date.now() - (startTimeRef.current || Date.now());
    const minimumDuration = autoStopRef.current ? AUTO_MIN_DURATION_MS : MANUAL_MIN_DURATION_MS;
    const shouldSend = reason !== "no_voice" && duration >= minimumDuration;

    abortarEnvioRef.current = !shouldSend;
    cleanupMonitoring();

    recordingRef.current = false;
    setRecording(false);

    try {
      recorder.stop();
    } catch (error) {
      console.warn("No se pudo detener la grabacion:", error?.message || error);
      stopTracks();
      mediaRecorderRef.current = null;
      setMediaRecorder(null);
    }

    onStop?.();
  };

  useImperativeHandle(ref, () => ({
    startRecording,
    stopRecording,
  }));

  const sendAudioToWhisper = async (audioBlob) => {
    if (abortarEnvioRef.current) return;

    try {
      const formData = new FormData();
      formData.append("audio", audioBlob, "recording.webm");

      const res = await axios.post(
        `${API_BASE_URL}/api/ai/transcribe`,
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );

      const textoLimpio = res.data?.text?.trim();

      if (textoLimpio && textoLimpio.length > 1) {
        onTranscription(textoLimpio);
      } else {
        console.log("Whisper no detectó palabras claras.");
      }
    } catch (error) {
      console.error("Error enviando audio:", error);
    }
  };

  useEffect(() => {
    return () => {
      cleanupMonitoring();
      stopTracks();
      if (mediaRecorderRef.current && mediaRecorderRef.current.state !== "inactive") {
        try {
          mediaRecorderRef.current.stop();
        } catch {
          // ignore
        }
      }
    };
  }, []);

  return (
    <>
      {errorAlert ? (
        <Alert
          variant="filled"
          severity={severity}
          sx={{
            position: "fixed",
            width: {
              xs: "85%",
              sm: "auto",
              md: "auto",
              lg: "auto",
              xl: "auto",
            },
            top: 20,
            left: "50%",
            color: "#ffffff",
            transform: "translateX(-50%)",
            zIndex: 9999,
            boxShadow: 4,
            borderRadius: 3,
            fontSize: "1rem",
            fontFamily: "'Lora', serif",
          }}
        >
          {alertMessage}
        </Alert>
      ) : null}
      <IconButton
        {...props}
        onMouseDown={() => startRecording()}
        onMouseUp={() => stopRecording("manual")}
        onMouseLeave={recording ? () => stopRecording("manual") : undefined}
        onTouchStart={(e) => {
          e.preventDefault();
          startRecording();
        }}
        onTouchEnd={() => stopRecording("manual")}
        sx={{
          transform: recording ? "scale(1.2)" : "scale(1)",
          transition: "transform 0.2s ease-in-out ",
          backgroundColor: recording ? "#c0beb9" : "transparent",
          color: recording ? "#000000" : "#000000",
          "&:hover": {
            backgroundColor: recording ? "#c0beb9" : "rgba(0, 0, 0, 0.1)",
          },
          mr: 1,
          ...props.sx,
        }}
      >
        {recording ? <MicRoundedIcon fontSize="medium" /> : <MicOffRoundedIcon fontSize="medium" />}
      </IconButton>
    </>
  );
});

export default BotonAudio;
