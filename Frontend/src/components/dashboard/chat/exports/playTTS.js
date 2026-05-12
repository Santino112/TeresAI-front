import axios from "axios";
import { API_BASE_URL } from "../../../../config/api.js";

let currentAudio = null;

export const playTTS = async (text) => {
  if (currentAudio) {
    currentAudio.pause();
    currentAudio = null;
  }

  const response = await axios.post(`${API_BASE_URL}/api/ai/tts`,
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
