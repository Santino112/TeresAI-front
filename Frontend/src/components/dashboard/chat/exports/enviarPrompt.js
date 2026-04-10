import api  from '../../../../api/axios';

export const enviarPrompt = async (prompt, conversationId, location) => {
  console.log("enviarPrompt recibió - prompt:", prompt, "conversationId:", conversationId, "location:", location);
  const { data } = await api.post('/ai/mandandoAlaIA', {
    prompt,
    conversationId,
    location
  });

  return data;
};