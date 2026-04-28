import api  from '../../../../api/axios';

export const enviarPrompt = async (prompt, conversationId, location, signal) => {
  const { data } = await api.post('/ai/mandandoAlaIA', {
    prompt,
    conversationId,
    location
  }, {
    signal
  });

  return data;
};