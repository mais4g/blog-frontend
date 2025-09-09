import { useEffect, useState, useCallback } from "react";
import { Link } from "react-router-dom";
import { api } from "../api/api";
import Loader from "../components/Loader";
import Button from "../components/Button";
import styles from "../styles/pages/PostsPage.module.css";
import { ArrowLeft, ArrowRight, BookOpen, Calendar, User, FileWarning, Search } from "lucide-react";

interface Post {
  id: number;
  title: string;
  body: string;
  userId: number;
}

export default function PostsPage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(true);

  const limit = 10;

  const fetchPosts = useCallback(async (pageNum: number) => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.get(`/posts?_page=${pageNum}&_limit=${limit}`);
      if (res.data.length === 0 && pageNum === 1) {
        setPosts([]);
        setHasMore(false);
      } else if (res.data.length < limit) {
        setPosts(res.data);
        setHasMore(false);
      } else {
        setPosts(res.data);
        setHasMore(true);
      }
    } catch {
      setError("Não foi possível carregar as postagens. Tente novamente mais tarde.");
      setPosts([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPosts(page);
  }, [page, fetchPosts]);

  const handlePageChange = (newPage: number) => {
    if (newPage < 1 || loading) return;
    setPage(newPage);
  };

  const renderContent = () => {
    if (loading) {
      return <Loader text="Carregando postagens..." />;
    }

    if (error) {
      return <div className={styles.errorState}>{error}</div>;
    }

    if (posts.length === 0) {
      return (
        <div className={styles.emptyState}>
          <FileWarning size={48} className={styles.emptyIcon} />
          <h2 className={styles.emptyTitle}>Nenhuma postagem encontrada</h2>
          <p className={styles.emptyText}>Parece que não há nada para mostrar aqui no momento.</p>
        </div>
      );
    }

    return (
      <>
        <div className={styles.grid}>
          {posts.map((post, index) => (
            <article key={post.id} className={styles.card} style={{ animationDelay: `${index * 50}ms` }}>
              <div className={styles.cardContent}>
                <div className={styles.cardMeta}>
                  <span className={styles.metaItem}><Calendar size={14} />Post #{post.id}</span>
                  <span className={styles.metaItem}><User size={14} />Autor #{post.userId}</span>
                </div>
                <h2 className={styles.cardTitle}>
                  <Link to={`/posts/${post.id}`}>{post.title}</Link>
                </h2>
                <p className={styles.cardBody}>{post.body.substring(0, 100)}...</p>
              </div>
              <footer className={styles.cardFooter}>
                <Link to={`/posts/${post.id}`} className={styles.readMoreLink}>
                  Continuar Lendo <ArrowRight size={16} />
                </Link>
              </footer>
            </article>
          ))}
        </div>

        <nav className={styles.pagination} role="navigation" aria-label="Paginação de posts">
          <Button variant="secondary" onClick={() => handlePageChange(page - 1)} disabled={page === 1 || loading}>
            <ArrowLeft size={16} /> Anterior
          </Button>
          <span className={styles.pageInfo}>Página {page}</span>
          <Button variant="secondary" onClick={() => handlePageChange(page + 1)} disabled={!hasMore || loading}>
            Próxima <ArrowRight size={16} />
          </Button>
        </nav>
      </>
    );
  };

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <div>
          <h1 className={styles.title}><BookOpen size={32} />Postagens Recentes</h1>
          <p className={styles.subtitle}>Explore os artigos e notícias mais recentes do nosso blog.</p>
        </div>
      </header>
      
      <main>
        {renderContent()}
      </main>
    </div>
  );
}