import { useState } from "react";
import axios from "axios";

const BotonAudio = ({ onTranscription }) => {
  const [recording, setRecording] = useState(false);
  const [mediaRecorder, setMediaRecorder] = useState(null);

  const startRecording = async () => {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    const recorder = new MediaRecorder(stream, {
      mimeType: "audio/webm;codecs=opus"
    });
    const chunks = [];

    recorder.ondataavailable = (event) => {
      chunks.push(event.data);
    };

    recorder.onstop = async () => {
      const audioBlob = new Blob(chunks, { type: "audio/webm" });
      await sendAudioToWhisper(audioBlob);
    };

    recorder.start();
    setMediaRecorder(recorder);
    setRecording(true);
  };

  const stopRecording = () => {
    mediaRecorder.stop();
    setRecording(false);
  };

  const sendAudioToWhisper = async (audioBlob) => {
    const formData = new FormData();
    formData.append("audio", audioBlob);

    const res = await axios.post("http://localhost:3000/api/ai/transcribe", formData);
    const data = res.data;

    if (data.text) {
      onTranscription(data.text);
    }
  };

  return (
    <button onClick={recording ? stopRecording : startRecording}>
      {recording ? "Detener grabación" : "Iniciar grabación"}
    </button>
  );
};

export default BotonAudio;