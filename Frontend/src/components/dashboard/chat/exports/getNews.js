import api from "../../../../api/axios";

export const getNews = async ({ query = "", country, global = false } = {}) => {
  try {
    const payload = { query, global };

    if (country) {
      payload.country = country;
    }

    const response = await api.post("/news", payload);
    return response.data;
  } catch (error) {
    console.error("Error obteniendo noticias:", error);
    return { success: false, articles: [], error: error.message };
  }
};
