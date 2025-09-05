import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { api } from "../api/api";
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

  const limit = 10;

  useEffect(() => {
    setLoading(true);
    api.get(`/posts?_page=${page}&_limit=${limit}`)
      .then((res) => setPosts(res.data))
      .finally(() => setLoading(false));
  }, [page]);

  return (
    <main className={styles.container}>
      <h1 className={styles.title}>📑 Lista de Postagens</h1>

      {loading ? (
        <p>Carregando posts...</p>
      ) : (
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
        <button onClick={() => setPage((p) => Math.max(p - 1, 1))} disabled={page === 1}>
          Anterior
        </button>
        <span>Página {page}</span>
        <button onClick={() => setPage((p) => p + 1)}>Próxima</button>
      </nav>
    </main>
  );
}