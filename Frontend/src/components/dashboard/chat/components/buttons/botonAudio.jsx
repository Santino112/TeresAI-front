import { useState, forwardRef, useImperativeHandle, useRef } from "react";
import { InputAdornment, IconButton } from "@mui/material";
import axios from 'axios';
import Alert from "@mui/material/Alert";
import MicRoundedIcon from "@mui/icons-material/MicRounded";
import MicOffRoundedIcon from "@mui/icons-material/MicOffRounded";

const BotonAudio = forwardRef(({ onTranscription, onStart, onStop, ...props }, ref) => {
  const [errorAlert, setErrorAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [severity, setSeverity] = useState("");
  const [recording, setRecording] = useState(false);
  const [mediaRecorder, setMediaRecorder] = useState(null);
  const [stream, setStream] = useState(null);
  const abortarEnvioRef = useRef(false);
  const startTimeRef = useRef(null);

  const startRecording = async () => {
    if (recording) return;

    try {
      const audioStream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true
        }
      });

      const recorder = new MediaRecorder(audioStream, {
        mimeType: "audio/webm;codecs=opus",
      });

      if (navigator.vibrate) {
        navigator.vibrate(60);
      }

      setStream(audioStream);
      const chunks = [];

      recorder.ondataavailable = (event) => {
        chunks.push(event.data);
      };

      recorder.onstop = async () => {
        const audioBlob = new Blob(chunks, { type: "audio/webm" });
        await sendAudioToWhisper(audioBlob);
      };

      abortarEnvioRef.current = false;
      startTimeRef.current = Date.now();
      recorder.start();
      setMediaRecorder(recorder);
      setRecording(true);
      onStart?.();
    } catch (err) {
      if (err.name === 'NotAllowedError') {
        setErrorAlert(true);
        setSeverity("info");
        setAlertMessage("No podemos escucharte porque el acceso al micrófono está bloqueado. Por favor, habilítalo en la configuración de tu navegador.");
        setTimeout(() => {
          setErrorAlert(false);
        }, 7000)
      } else {
        setErrorAlert(true);
        setSeverity("error");
        setAlertMessage("Error al acceder al micrófono:", err);
        setTimeout(() => {
          setErrorAlert(false);
        }, 5000)
      }
    }
  };

  const stopRecording = () => {
    if (!mediaRecorder || mediaRecorder.state == "inactive") return;

    const duration = Date.now() - startTimeRef.current;

    if (duration < 1000) {
      stream?.getTracks().forEach(track => track.stop());
      setRecording(false);
      abortarEnvioRef.current = true;
      mediaRecorder.stop();
      onStop?.();
      return;
    };
    mediaRecorder.stop();
    abortarEnvioRef.current = false;
    stream?.getTracks().forEach(track => track.stop());
    setRecording(false);
    onStop?.();
  };

  useImperativeHandle(ref, () => ({
    startRecording,
    stopRecording,
  }));

  const sendAudioToWhisper = async (audioBlob) => {
    if (abortarEnvioRef.current) return; // Si fue muy corta, no enviamos nada

    try {
      const formData = new FormData();
      formData.append("audio", audioBlob, "recording.webm");

      const res = await axios.post(
        "http://localhost:3000/api/ai/transcribe",
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );
      const textoLimpio = res.data?.text?.trim();

      // VALIDACIÓN: ¿El texto tiene contenido real?
      // Whisper a veces devuelve "." o " " cuando no entiende nada
      if (textoLimpio && textoLimpio.length > 1) {
        onTranscription(textoLimpio);
      } else {
        console.log("Whisper no detectó palabras claras.");
      }
    } catch (error) {
      console.error("Error enviando audio:", error);
    }
  };

  return (
    <>
      {errorAlert ?
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
              xl: "auto"
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
        >{alertMessage}</Alert>
        :
        null
      }
      <IconButton
        {...props}
        onMouseDown={startRecording}
        onMouseUp={stopRecording}
        onMouseLeave={recording ? stopRecording : undefined}
        onTouchStart={(e) => {
          e.preventDefault();
          startRecording();
        }
        }
        onTouchEnd={stopRecording}
        sx={{
          transform: recording ? "scale(1.2)" : "scale(1)",
          transition: "transform 0.2s ease-in-out ",
          backgroundColor: recording ? "#c0beb9" : "transparent",
          color: recording ? "#000000" : "#000000",
          "&:hover": {
            backgroundColor: recording ? "#c0beb9" : "rgba(0, 0, 0, 0.1)",
          },
          mr: 1,
          ...props.sx
        }}
      >
        {recording ? <MicRoundedIcon fontSize="medium" /> : <MicOffRoundedIcon fontSize="medium" />}
      </IconButton>
    </>
  );
});

export default BotonAudio;