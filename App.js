import React, { useState, useEffect } from "react";

const API_URL = "https://servicodados.ibge.gov.br/api/v3/noticias";

function App() {
  const [news, setNews] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [newsType, setNewsType] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Fetch notícias da API
  const fetchNews = async () => {
    setIsLoading(true);
    try {
      const url = new URL(API_URL);
      if (searchTerm) url.searchParams.append("busca", searchTerm);
      if (newsType) url.searchParams.append("tipo", newsType);
      url.searchParams.append("qtd", 10); // Limita a 10 resultados por página

      const response = await fetch(url);
      const data = await response.json();
      setNews(data.items || []);
    } catch (error) {
      console.error("Erro ao buscar notícias:", error);
      setNews([]);
    } finally {
      setIsLoading(false);
    }
  };

  // Manipula o envio do formulário
  const handleSearch = (event) => {
    event.preventDefault();
    fetchNews();
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.header}>Portal de Notícias IBGE</h1>
      <form onSubmit={handleSearch} style={styles.form}>
        <input
          type="text"
          placeholder="Buscar por termo"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={styles.input}
        />
        <select
          value={newsType}
          onChange={(e) => setNewsType(e.target.value)}
          style={styles.select}
        >
          <option value="">Todos</option>
          <option value="noticia">Notícias</option>
          <option value="release">Releases</option>
        </select>
        <button type="submit" style={styles.button}>
          Buscar
        </button>
      </form>
      {isLoading ? (
        <p style={styles.loading}>Carregando...</p>
      ) : (
        <ul style={styles.newsList}>
          {news.length === 0 ? (
            <p style={styles.noNews}>Nenhuma notícia encontrada.</p>
          ) : (
            news.map((item) => (
              <li key={item.id} style={styles.newsItem}>
                <h2 style={styles.title}>{item.titulo}</h2>
                <p style={styles.date}>
                  {new Date(item.data_publicacao).toLocaleDateString("pt-BR")}
                </p>
                <p>{item.introducao}</p>
                <a href={item.link} target="_blank" rel="noopener noreferrer">
                  Leia mais
                </a>
              </li>
            ))
          )}
        </ul>
      )}
    </div>
  );
}

const styles = {
  container: {
    maxWidth: "800px",
    margin: "20px auto",
    padding: "20px",
    backgroundColor: "#fff",
    borderRadius: "8px",
    boxShadow: "0 2px 5px rgba(0, 0, 0, 0.1)",
  },
  header: {
    textAlign: "center",
    color: "#333",
  },
  form: {
    display: "flex",
    gap: "10px",
    marginBottom: "20px",
  },
  input: {
    flex: "1",
    padding: "10px",
    border: "1px solid #ddd",
    borderRadius: "5px",
  },
  select: {
    padding: "10px",
    border: "1px solid #ddd",
    borderRadius: "5px",
  },
  button: {
    padding: "10px 15px",
    backgroundColor: "#007bff",
    color: "#fff",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
  },
  loading: {
    textAlign: "center",
    color: "#555",
  },
  noNews: {
    textAlign: "center",
    color: "#555",
  },
  newsList: {
    listStyle: "none",
    padding: "0",
  },
  newsItem: {
    borderBottom: "1px solid #ddd",
    padding: "10px 0",
  },
  title: {
    fontSize: "1.2em",
    marginBottom: "5px",
  },
  date: {
    fontSize: "0.9em",
    color: "#555",
    marginBottom: "10px",
  },
};

export default App;
