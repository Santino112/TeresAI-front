import axios from "axios";

let currentAudio = null;

export const playTTS = async (text) => {
  if (currentAudio) {
    currentAudio.pause();
    currentAudio = null;
  }

  const response = await axios.post("http://localhost:3000/api/ai/tts",
    { text },
    { responseType: "blob" }
  );

  const audioUrl = URL.createObjectURL(response.data);
  currentAudio = new Audio(audioUrl);
  currentAudio.play();
};

export const stopTTS = () => {
  if (currentAudio) {
    currentAudio.pause();
    currentAudio.currentTime = 0;
    currentAudio = null;
  }
};