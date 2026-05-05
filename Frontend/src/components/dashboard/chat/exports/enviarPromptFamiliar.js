import api from "../../../../api/axios";

export const enviarPromptFamiliar = async (prompt, conversationId, location, signal) => {
  const { data } = await api.post(
    "/ai/familiar/mandandoAlaIA",
    {
      prompt,
      conversationId,
      location
    },
    {
      signal
    }
  );

  return data;
};
