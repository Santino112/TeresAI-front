import api from "../../../../api/axios";

export const getNews = async ({ query = "", country = "ar" } = {}) => {
  try {
    const response = await api.post("/news", {
      query,
      country
    });
    return response.data;
  } catch (error) {
    console.error("Error obteniendo noticias:", error);
    return { success: false, articles: [], error: error.message };
  }
};