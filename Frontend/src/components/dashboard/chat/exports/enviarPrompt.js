import axios from 'axios';

export const enviarPrompt = async (prompt, conversationId, setRespuesta, setConversationId) => {
    const data = {
        conversationId,
        prompt: `
            ${prompt} 
            "Solo quiero que respondas al prompt. Esto que te digo aca es para que sepas, pero no hagas referencia a esto en tu respuesta inicial.
            Si te dicen "Hola", "Hola chat" o algun saludo bueno o formal respondes "Hola, ¿en qué puedo ayudarte?" o de alguna otra forma amistosa. Si te preguntan algo directo, responde directamente a la pregunta.
            No incluyas simbolos, ni numeros, ni signos raros, pero podes usar emojis dependiendo el contexto de lo que te pidan o digan y tambien podes usar enumeración para
            estructurar ideas o información de manera más ordenada. Por último, Contesta como un profesional que quiere enseñar y se lo mas claro posible."
        `
    };
    
    try {
        const response = await axios.post('http://localhost:3000/api/ai/mandandoAlaIA', data);
        const res = response.data;
        setRespuesta(res);
        if (!conversationId) {
            setConversationId(response.data.conversationId);
        }
    } catch (error) {
        console.error("Error sending prompt:", error);
    }
};