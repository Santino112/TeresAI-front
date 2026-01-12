import { useRef, useEffect } from "react";

export const useWakeWord = (onWake) => {
  const recognitionRef = useRef(null);
  const activeRef = useRef(false);

  const createRecognition = () => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) return null;

    const recognition = new SpeechRecognition();
    recognition.lang = "es-AR";
    recognition.continuous = true;
    recognition.interimResults = false;

    recognition.onresult = (event) => {
      const text =
        event.results[event.results.length - 1][0].transcript
          .toLowerCase()
          .normalize("NFD")
          .replace(/[\u0300-\u036f]/g, "")
          .trim();

      if (
        text === "hola, teresa." ||
        text === "hola teresa." ||
        text === "ok, teresa." ||
        text === "okay, teresa."
      ) {
        onWake();
      }
    };

    recognition.onerror = () => {
      activeRef.current = false;
    };

    recognition.onend = () => {
      activeRef.current = false;
    };

    return recognition;
  };

  const startWake = () => {
    if (activeRef.current) return;

    recognitionRef.current?.abort(); // matar zombie
    recognitionRef.current = createRecognition();

    if (!recognitionRef.current) return;

    try {
      recognitionRef.current.start();
      activeRef.current = true;
    } catch (e) {
      console.warn("Wake start falló:", e.message);
    }
  };

  const stopWake = () => {
    if (!activeRef.current) return;

    recognitionRef.current?.abort();
    recognitionRef.current = null;
    activeRef.current = false;
  };

  useEffect(() => {
    startWake();
    return () => stopWake();
  }, []);

  return { startWake, stopWake };
};