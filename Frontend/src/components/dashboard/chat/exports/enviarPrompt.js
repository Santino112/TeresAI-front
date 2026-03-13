import api  from '../../../../api/axios';

export const enviarPrompt = async (prompt, conversationId) => {
  const { data } = await api.post('/ai/mandandoAlaIA', {
    prompt: `${prompt}`,
    conversationId
  });
  
  return data;
};
