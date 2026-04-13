import { useEffect, useState } from "react";
import { getNews } from "../exports/getNews";

export default function News() {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchNews = async () => {
    setLoading(true);
    const res = await getNews();

    if (res.success) {
      setArticles(res.articles);
    }

    setLoading(false);
  };

  useEffect(() => {
    fetchNews();
  }, []);

  return (
    <div style={{ padding: "16px" }}>
      <h2>📰 Noticias del día</h2>

      {loading && <p>Cargando noticias...</p>}

      {!loading && articles.length === 0 && (
        <p>No hay noticias disponibles</p>
      )}

      {!loading &&
        articles.map((article, index) => (
          <div
            key={index}
            style={{
              marginBottom: "16px",
              padding: "12px",
              borderRadius: "12px",
              background: "#1e1e1e",
              color: "white"
            }}
          >
            <h3>{article.title}</h3>
            <p>{article.description}</p>

            <small>{article.source}</small>

            <br />

            <a
              href={article.url}
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: "#4da6ff" }}
            >
              Leer más
            </a>
          </div>
        ))}
    </div>
  );
}