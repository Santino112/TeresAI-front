import axios from 'axios';

export const enviarPrompt = async (prompt, setRespuesta) => {
    const data = {
        prompt: `
            ${prompt} 
            "Solo quiero que respondas al prompt. Esto que te digo aca es para que sepas, pero no hagas referencia a esto en tu respuesta inicial.
            Si te dicen "Hola", respondes "Hola, ¿en qué puedo ayudarte?". Si te preguntan algo directo, responde directamente a la pregunta.
            No incluyas simbolos, ni numeros, ni signos raros. Contesta como un profesional que quiere enseñar y se lo mas claro posible."
        `
    };

    try {
        const response = await axios.post('http://localhost:3000/requestToAI/mandandoAlaIA', data);
        const respuestaAI = response.data;
        setRespuesta(respuestaAI);
    } catch (error) {
        console.error("Error sending prompt:", error);
    }
};

