import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { api } from "../api/api";
import Loader from "../components/Loader";
import styles from "../styles/pages/PostsPage.module.css";

interface Post {
  id: number;
  title: string;
  body: string;
}

export default function PostsPage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(true);

  const limit = 10;

  useEffect(() => {
    const fetchPosts = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await api.get(`/posts?_page=${page}&_limit=${limit}`);
        setPosts(res.data);
        setHasMore(res.data.length === limit); // se retornou menos que o limite, não há mais páginas
      } catch {
        setError("Erro ao carregar posts. Tente novamente.");
      } finally {
        setLoading(false);
      }
    };
    fetchPosts();
  }, [page]);

  return (
    <main className={styles.container}>
      <h1 className={styles.title}>📑 Lista de Postagens</h1>

      {loading && <Loader />}
      {error && <p className={styles.error}>{error}</p>}

      {!loading && !error && (
        <ul className={styles.list} aria-label="Lista de postagens">
          {posts.map((post) => (
            <article key={post.id} className={styles.card}>
              <h2 className={styles.postTitle}>{post.title}</h2>
              <p className={styles.postBody}>{post.body.substring(0, 100)}...</p>
              <Link
                to={`/posts/${post.id}`}
                className={styles.link}
                aria-label={`Ver detalhes do post ${post.title}`}
              >
                Ver detalhes
              </Link>
            </article>
          ))}
        </ul>
      )}

      <nav className={styles.pagination} role="navigation" aria-label="Paginação de posts">
        <button
          onClick={() => setPage((p) => Math.max(p - 1, 1))}
          disabled={page === 1 || loading}
        >
          Anterior
        </button>
        <span>Página {page}</span>
        <button
          onClick={() => setPage((p) => p + 1)}
          disabled={!hasMore || loading}
        >
          Próxima
        </button>
      </nav>
    </main>
  );
}