import { useEffect, useState, useCallback } from "react";
import { Link } from "react-router-dom";
import { api } from "../api/api";
import Loader from "../components/Loader";
import Button from "../components/Button";
import styles from "../styles/pages/PostsPage.module.css";

interface Post {
  id: number;
  title: string;
  body: string;
  userId: number;
}

export default function PostsPage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState<'date' | 'title'>('date');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  const limit = 10;

  const fetchPosts = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.get(`/posts?_page=${page}&_limit=${limit}`);
      setPosts(res.data);
      setHasMore(res.data.length === limit);
    } catch {
      setError("Erro ao carregar posts. Tente novamente.");
    } finally {
      setLoading(false);
    }
  }, [page]);

  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

  const filteredPosts = posts.filter(post =>
    post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    post.body.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const sortedPosts = [...filteredPosts].sort((a, b) => {
    if (sortBy === 'title') {
      return a.title.localeCompare(b.title);
    }
    return b.id - a.id; // Mais recente primeiro
  });

  const handlePreviousPage = () => {
    if (page > 1) setPage(page - 1);
  };

  const handleNextPage = () => {
    if (hasMore) setPage(page + 1);
  };

  if (loading && posts.length === 0) return <Loader fullPage text="Carregando posts..." />;
  if (error && posts.length === 0) return <ErrorMessage message={error} onRetry={fetchPosts} />;

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <div className={styles.headerContent}>
          <h1 className={styles.title}>
            <span aria-hidden="true">📑</span>
            Lista de Postagens
          </h1>
          <p className={styles.subtitle}>
            {posts.length} postagens disponíveis
          </p>
        </div>

        <div className={styles.headerActions}>
          <div className={styles.searchContainer}>
            <label htmlFor="search" className={styles.srOnly}>
              Buscar posts
            </label>
            <input
              id="search"
              type="search"
              placeholder="Buscar posts..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className={styles.searchInput}
              aria-label="Buscar posts por título ou conteúdo"
            />
            <span className={styles.searchIcon} aria-hidden="true">🔍</span>
          </div>

          <div className={styles.sortContainer}>
            <label htmlFor="sort" className={styles.sortLabel}>
              Ordenar por:
            </label>
            <select
              id="sort"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as 'date' | 'title')}
              className={styles.sortSelect}
              aria-label="Ordenar posts"
            >
              <option value="date">Data</option>
              <option value="title">Título</option>
            </select>
          </div>

          <div className={styles.viewToggle} role="group" aria-label="Modo de visualização">
            <button
              className={`${styles.viewButton} ${viewMode === 'grid' ? styles.active : ''}`}
              onClick={() => setViewMode('grid')}
              aria-label="Visualização em grade"
              aria-pressed={viewMode === 'grid'}
            >
              <span aria-hidden="true">⊞</span>
            </button>
            <button
              className={`${styles.viewButton} ${viewMode === 'list' ? styles.active : ''}`}
              onClick={() => setViewMode('list')}
              aria-label="Visualização em lista"
              aria-pressed={viewMode === 'list'}
            >
              <span aria-hidden="true">☰</span>
            </button>
          </div>
        </div>
      </header>

      <main className={styles.main}>
        {sortedPosts.length === 0 && !loading ? (
          <EmptyState
            icon="📝"
            title={searchTerm ? "Nenhum post encontrado" : "Nenhum post disponível"}
            message={searchTerm ? "Tente buscar com outro termo" : "Não há posts para exibir no momento"}
          />
        ) : (
          <div className={`${styles.postsGrid} ${styles[viewMode]}`} role="region" aria-label="Grade de posts">
            {sortedPosts.map((post, index) => (
              <article
                key={post.id}
                className={styles.postCard}
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <header className={styles.postHeader}>
                  <div className={styles.postMeta}>
                    <span className={styles.postId}>#{post.id}</span>
                    <span className={styles.postAuthor}>
                      <span aria-hidden="true">👤</span>
                      Autor {post.userId}
                    </span>
                  </div>
                  <h2 className={styles.postTitle}>{post.title}</h2>
                </header>

                <div className={styles.postBody}>
                  <p>{post.body.substring(0, 150)}...</p>
                </div>

                <footer className={styles.postFooter}>
                  <Link
                    to={`/posts/${post.id}`}
                    className={styles.readMoreLink}
                    aria-label={`Ler mais sobre ${post.title}`}
                  >
                    <span>Ler mais</span>
                    <span aria-hidden="true">→</span>
                  </Link>
                </footer>
              </article>
            ))}
          </div>
        )}

        {loading && (
          <div className={styles.loadingMore}>
            <Loader size="sm" text="Carregando mais posts..." />
          </div>
        )}
      </main>

      <nav className={styles.pagination} role="navigation" aria-label="Paginação de posts">
        <Button
          variant="secondary"
          size="sm"
          onClick={handlePreviousPage}
          disabled={page === 1 || loading}
          aria-label="Página anterior"
        >
          <span aria-hidden="true">←</span>
          Anterior
        </Button>

        <div className={styles.pageInfo}>
          <span className={styles.currentPage}>{page}</span>
          <span className={styles.separator}>/</span>
          <span className={styles.totalPages}>?</span>
        </div>

        <Button
          variant="secondary"
          size="sm"
          onClick={handleNextPage}
          disabled={!hasMore || loading}
          aria-label="Próxima página"
        >
          Próxima
          <span aria-hidden="true">→</span>
        </Button>
      </nav>
    </div>
  );
}

// Componentes auxiliares
const ErrorMessage = ({ message, onRetry }: { message: string; onRetry: () => void }) => (
  <div className={styles.errorContainer} role="alert">
    <div className={styles.errorContent}>
      <span className={styles.errorIcon} aria-hidden="true">❌</span>
      <h3 className={styles.errorTitle}>Erro ao carregar</h3>
      <p className={styles.errorMessage}>{message}</p>
      <Button variant="primary" size="sm" onClick={onRetry}>
        Tentar novamente
      </Button>
    </div>
  </div>
);

const EmptyState = ({ icon, title, message }: { icon: string; title: string; message: string }) => (
  <div className={styles.emptyState} role="status">
    <div className={styles.emptyIcon} aria-hidden="true">{icon}</div>
    <h3 className={styles.emptyTitle}>{title}</h3>
    <p className={styles.emptyMessage}>{message}</p>
  </div>
);