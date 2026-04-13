import api  from '../../../../api/axios';

export const getNews = async (query = "") => {
  try {
    const response = await api.post("/news", { query });
    return response.data;
  } catch (error) {
    console.error("Error obteniendo noticias:", error);
    return { success: false, articles: [] };
  }
};