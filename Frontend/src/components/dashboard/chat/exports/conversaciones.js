import api from '../../../../api/axios.js';

export const getConversations = async () => {
  const { data } = await api.get('/ai/conversacionesDeUser');
  return data;
};

export const getMessages = async (conversationId) => {
  const { data } = await api.get(`/ai/mensajes/${conversationId}`);
  return data;
};