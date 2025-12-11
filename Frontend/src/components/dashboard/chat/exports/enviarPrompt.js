import axios from 'axios';

export const enviarPrompt = async (prompt, setRespuesta, setPrompt) => {
    const data = {
        prompt: `
            ${prompt} 
            "No incluyas simbolos, ni numeros, ni signos raros. Contesta como un profesional que quiere enseñar
            y se lo mas claro posible."
        `
    };

    try {
        const response = await axios.post('http://localhost:3000/requestToAI/mandandoAlaIA', data);
        const respuestaAI = response.data;
        setRespuesta(respuestaAI);
    } catch (error) {
        console.error("Error sending prompt:", error);
    } finally {
        setPrompt("");
    }
};

