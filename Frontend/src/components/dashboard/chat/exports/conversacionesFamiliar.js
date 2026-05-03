import api from "../../../../api/axios.js";

export const getConversationsFamiliar = async () => {
  const { data } = await api.get("/ai/familiar/conversacionesDeUser");
  return data;
};

export const getMessagesFamiliar = async (conversationId) => {
  const { data } = await api.get(`/ai/familiar/mensajes/${conversationId}`);
  return data;
};
