const rawApiUrl = import.meta.env.VITE_API_URL || "http://localhost:3000";
console.log("VITE_API_URL:", import.meta.env.VITE_API_URL);
const ensureProtocol = (value) => {
  if (/^https?:\/\//i.test(value)) return value;

  if (value.includes("localhost") || value.startsWith("127.") || value.startsWith("0.0.0.0")) {
    return `http://${value}`;
  }

  return `https://${value}`;
};

const normalizedUrl = ensureProtocol(rawApiUrl).replace(/\/$/, "");

export const API_ORIGIN = normalizedUrl.replace(/\/api$/, "");
export const API_BASE_URL = API_ORIGIN.endsWith("/api") ? API_ORIGIN : `${API_ORIGIN}/api`;
