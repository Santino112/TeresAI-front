import axios from 'axios';

export const getConversations = async (accessToken) => {

    const response = await axios.get('/api/ai/conversacionesDeUser', 
        {
            headers: {
                Authorization: `Bearer ${accessToken}`
            }
        }
    );
    return response.data;
};