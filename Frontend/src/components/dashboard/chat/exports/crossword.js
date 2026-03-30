import api from "../../../../api/axios";

export const getCrossword = async (difficulty) => {
  const { data } = await api.get("/crossword", {
    params: { difficulty }
  });
  return data;
};