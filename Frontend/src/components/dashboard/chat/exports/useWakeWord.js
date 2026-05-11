import { useEffect, useRef, useState } from "react";
import axios from "axios";
import api from "../../../../api/axios.js";
import { WAKE_WORD_CONFIG } from "./wakeWordConfig.js";

const normalizeVoiceText = (value = "") =>
  value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9\s]/g, " ")
    .replace(/\s+/g, " ")
    .trim();

const matchesWakePhrase = (text) =>
  WAKE_WORD_CONFIG.wakePhrases.some((phrase) => text.includes(phrase));

const hasVoiceSupport = () =>
  typeof window !== "undefined" &&
  Boolean(navigator?.mediaDevices?.getUserMedia) &&
  Boolean(window.MediaRecorder);

const WAKE_WINDOW_MS = WAKE_WORD_CONFIG.wakeChunkMs * WAKE_WORD_CONFIG.wakeWindowChunks;

export const useWakeWord = ({ onWake } = {}) => {
  const streamRef = useRef(null);
  const recorderRef = useRef(null);
  const windowTimerRef = useRef(null);
  const activeRef = useRef(false);
  const keepAliveRef = useRef(false);
  const transcribeFailureRef = useRef(false);
  const wakeDetectedRef = useRef(false);
  const transcribingRef = useRef(false);
  const lastWakeAtRef = useRef(0);
  const [wakeListening, setWakeListening] = useState(false);
  const [wakeStatus, setWakeStatus] = useState("idle");
  const [voiceError, setVoiceError] = useState("");

  const stopWindowTimer = () => {
    if (windowTimerRef.current) {
      clearTimeout(windowTimerRef.current);
      windowTimerRef.current = null;
    }
  };

  const stopStream = () => {
    streamRef.current?.getTracks().forEach((track) => track.stop());
    streamRef.current = null;
  };

  const playWakeCue = async () => {
    if (typeof window === "undefined") return;

    const AudioContextImpl = window.AudioContext || window.webkitAudioContext;
    if (!AudioContextImpl) return;

    try {
      const audioContext = new AudioContextImpl();
      await audioContext.resume().catch(() => {});

      const makeTone = (frequency, startOffset, duration) => {
        const oscillator = audioContext.createOscillator();
        const gain = audioContext.createGain();
        const startTime = audioContext.currentTime + startOffset;
        const endTime = startTime + duration;

        oscillator.type = "sine";
        oscillator.frequency.value = frequency;
        gain.gain.setValueAtTime(0.0001, startTime);
        gain.gain.exponentialRampToValueAtTime(0.08, startTime + 0.015);
        gain.gain.exponentialRampToValueAtTime(0.0001, endTime);

        oscillator.connect(gain);
        gain.connect(audioContext.destination);
        oscillator.start(startTime);
        oscillator.stop(endTime + 0.03);
      };

      makeTone(880, 0, 0.12);
      makeTone(660, 0.16, 0.12);

      window.setTimeout(() => {
        audioContext.close().catch(() => {});
      }, 500);
    } catch {
      // ignore cue errors
    }
  };

  const clearRecording = () => {
    recorderRef.current = null;
    stopWindowTimer();
    transcribingRef.current = false;
  };

  const stopWake = ({ preserveKeepAlive = false } = {}) => {
    if (!preserveKeepAlive) {
      keepAliveRef.current = false;
      transcribeFailureRef.current = false;
    }

    wakeDetectedRef.current = false;
    setWakeStatus("idle");

    if (!activeRef.current) {
      stopStream();
      clearRecording();
      setWakeListening(false);
      return;
    }

    activeRef.current = false;
    setWakeListening(false);

    try {
      recorderRef.current?.stop();
    } catch {
      // ignore
    }

    stopStream();
    clearRecording();
  };

  const transcribeBlob = async (blob) => {
    const formData = new FormData();
    formData.append("audio", blob, "wake-word.webm");

    const res = await api.post("/ai/transcribe", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });

    return res.data?.text?.trim() || "";
  };

  const processWakeWindow = async (chunks) => {
    if (transcribingRef.current || wakeDetectedRef.current || transcribeFailureRef.current) {
      return;
    }

    const validChunks = chunks.filter((chunk) => chunk?.size > 0);
    if (!validChunks.length) {
      return;
    }

    transcribingRef.current = true;

    try {
      const windowBlob = new Blob(validChunks, { type: "audio/webm" });
      const transcript = normalizeVoiceText(await transcribeBlob(windowBlob));
      const now = Date.now();
      const isCooldownDone = now - lastWakeAtRef.current >= WAKE_WORD_CONFIG.wakeCooldownMs;

      if (transcript && isCooldownDone && matchesWakePhrase(transcript)) {
        lastWakeAtRef.current = now;
        wakeDetectedRef.current = true;
        keepAliveRef.current = false;
        setWakeListening(false);
        setWakeStatus("wake");
        await playWakeCue();
        onWake?.();
        return;
      }
    } catch (error) {
      transcribeFailureRef.current = true;
      keepAliveRef.current = false;

      if (axios.isAxiosError(error)) {
        setVoiceError("No se pudo analizar la palabra de activacion.");
      } else {
        setVoiceError("Error al procesar la escucha de activacion.");
      }
      return;
    } finally {
      transcribingRef.current = false;
    }
  };

  const startWake = async () => {
    if (!hasVoiceSupport()) {
      setVoiceError("Tu navegador no soporta captura de audio.");
      setWakeStatus("error");
      return;
    }

    if (activeRef.current) return;

    keepAliveRef.current = true;
    transcribeFailureRef.current = false;
    wakeDetectedRef.current = false;
    setVoiceError("");
    setWakeStatus("wake");

    try {
      const audioStream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true,
        },
      });

      const mimeType = MediaRecorder.isTypeSupported("audio/webm;codecs=opus")
        ? "audio/webm;codecs=opus"
        : "audio/webm";

      const recorder = new MediaRecorder(audioStream, { mimeType });
      const chunks = [];

      streamRef.current = audioStream;
      recorderRef.current = recorder;
      activeRef.current = true;
      setWakeListening(true);

      recorder.ondataavailable = (event) => {
        if (!event?.data || event.data.size === 0 || !activeRef.current) return;
        chunks.push(event.data);
      };

      recorder.onerror = (event) => {
        if (event?.error && event.error !== "aborted") {
          setVoiceError(`Error en la escucha de activacion: ${event.error}.`);
          setWakeStatus("error");
        }
      };

      recorder.onstop = async () => {
        activeRef.current = false;
        setWakeListening(false);
        stopStream();
        clearRecording();

        if (!keepAliveRef.current || transcribeFailureRef.current || wakeDetectedRef.current) {
          return;
        }

        await processWakeWindow(chunks);

        if (keepAliveRef.current && !wakeDetectedRef.current && !transcribeFailureRef.current) {
          setTimeout(() => {
            if (keepAliveRef.current && !activeRef.current) {
              startWake();
            }
          }, WAKE_WORD_CONFIG.wakeCooldownMs);
        }
      };

      recorder.start();
      stopWindowTimer();
      windowTimerRef.current = setTimeout(() => {
        if (activeRef.current && recorder.state === "recording") {
          try {
            recorder.stop();
          } catch {
            // ignore
          }
        }
      }, WAKE_WINDOW_MS);
    } catch (error) {
      activeRef.current = false;
      setWakeListening(false);
      setWakeStatus("error");
      stopStream();
      clearRecording();

      if (error?.name === "NotAllowedError") {
        setVoiceError("El acceso al micrófono está bloqueado.");
      } else {
        setVoiceError("No se pudo activar la escucha de activación.");
      }
    }
  };

  useEffect(() => {
    startWake();

    return () => {
      stopWake();
    };
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return undefined;

    const handleUserGesture = () => {
      if (keepAliveRef.current && !activeRef.current) {
        transcribeFailureRef.current = false;
        startWake();
      }
    };

    window.addEventListener("pointerdown", handleUserGesture, { passive: true });
    window.addEventListener("keydown", handleUserGesture);

    return () => {
      window.removeEventListener("pointerdown", handleUserGesture);
      window.removeEventListener("keydown", handleUserGesture);
    };
  }, []);

  return {
    startWake,
    stopWake,
    wakeListening,
    wakeStatus,
    speechSupported: hasVoiceSupport(),
    voiceError,
  };
};
