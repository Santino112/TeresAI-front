import { useState, forwardRef, useImperativeHandle } from "react";
import { InputAdornment, IconButton } from "@mui/material";
import axios from "axios";
import Button from "@mui/material/Button";
import MicRoundedIcon from "@mui/icons-material/MicRounded";
import MicOffRoundedIcon from "@mui/icons-material/MicOffRounded";

const BotonAudio = forwardRef(({ onTranscription, onStart, onStop }, ref) => {
  const [recording, setRecording] = useState(false);
  const [mediaRecorder, setMediaRecorder] = useState(null);
  const [stream, setStream] = useState(null);

  const startRecording = async () => {
    if (recording) return;

    onStart?.();

    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    const recorder = new MediaRecorder(stream, {
      mimeType: "audio/webm;codecs=opus",
    });

    const chunks = [];

    recorder.ondataavailable = (event) => {
      chunks.push(event.data);
    };

    recorder.onstop = async () => {
      const audioBlob = new Blob(chunks, { type: "audio/webm" });
      await sendAudioToWhisper(audioBlob);
      onStop?.();
    };

    recorder.start();
    setMediaRecorder(recorder);
    setRecording(true);
  };


  const stopRecording = () => {
    if (!mediaRecorder) return;
    mediaRecorder.stop();
    setRecording(false);
  };

  useImperativeHandle(ref, () => ({
    startRecording,
    stopRecording,
  }));

  const sendAudioToWhisper = async (audioBlob) => {
    try {
      const formData = new FormData();
      formData.append("audio", audioBlob);

      const res = await axios.post(
        "http://localhost:3000/api/ai/transcribe",
        formData
      );

      if (res.data?.text) {
        onTranscription(res.data.text);
      }
    } catch (error) {
      console.error("Error enviando audio a Whisper:", error);
    }
  };

  return (
    <IconButton
      variant="contained"
      color={recording ? "error" : "primary"}
      onClick={recording ? stopRecording : startRecording}
      sx={{
        backgroundColor: "transparent",
        color: "#ffffff",
        "&:hover": {
          backgroundColor: "#FFFFFF",
          color: "#2E2E2E",
        }
      }}
    >
      {recording ? <MicOffRoundedIcon fontSize="small" /> : <MicRoundedIcon fontSize="small" />}
    </IconButton>
  );
});

export default BotonAudio;