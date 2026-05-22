import axios from "axios";
import { API_BASE_URL } from "../../../../config/api.js";

let currentAudio = null;

export const playTTS = async (text) => {
  if (currentAudio) {
    currentAudio.pause();
    URL.revokeObjectURL(currentAudio.src);
    currentAudio = null;
  }

  try {
    const response = await axios.post(
      `${API_BASE_URL}/ai/tts`,
      { text },
      { responseType: "blob" }
    );

    const audioUrl = URL.createObjectURL(response.data);
    currentAudio = new Audio(audioUrl);
    await currentAudio.play();
  } catch (error) {
    if (currentAudio?.src?.startsWith("blob:")) {
      URL.revokeObjectURL(currentAudio.src);
    }
    currentAudio = null;
    console.error("Error reproduciendo TTS:", error);
    return false;
  }

  return true;
};

export const stopTTS = () => {
  if (currentAudio) {
    currentAudio.pause();
    URL.revokeObjectURL(currentAudio.src);
    currentAudio.currentTime = 0;
    currentAudio = null;
  }
};
