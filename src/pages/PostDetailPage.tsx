import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { api } from "../api/api";
import Loader from "../components/Loader";
import Button from "../components/Button";
import styles from "../styles/pages/PostDetailPage.module.css";

interface Post {
  id: number;
  title: string;
  body: string;
  userId: number;
  createdAt?: string; // caso sua API tenha campo de data
}

interface Comment {
  id: number;
  body: string;
  userId: number;
  name: string;
  email: string;
}

export default function PostDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [post, setPost] = useState<Post | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState("");
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showComments, setShowComments] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setError(null);
      try {
        const [postRes, commentsRes] = await Promise.all([
          api.get(`/posts/${id}`),
          api.get(`/posts/${id}/comments`),
        ]);
        setPost(postRes.data);
        setComments(commentsRes.data);
      } catch {
        setError("Erro ao carregar post ou comentários.");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  const handleAddComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    setIsSubmitting(true);
    try {
      const res = await api.post("/comments", {
        postId: Number(id), // garante número
        userId: 1,
        body: newComment,
        name: "Usuário Atual",
        email: "usuario@email.com",
      });
      setComments([res.data, ...comments]);
      setNewComment("");
    } catch {
      setError("Erro ao enviar comentário.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat("pt-BR", {
      day: "2-digit",
      month: "long",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(date);
  };

  if (loading) return <Loader fullPage text="Carregando post..." />;
  if (error) return <ErrorMessage message={error} onRetry={() => window.location.reload()} />;
  if (!post) return <NotFoundMessage />;

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => navigate("/posts")}
          className={styles.backButton}
        >
          <span aria-hidden="true">←</span>
          Voltar
        </Button>
      </header>

      <article className={styles.post}>
        <header className={styles.postHeader}>
          <h1 className={styles.postTitle}>{post.title}</h1>
          <div className={styles.postMeta}>
            <span className={styles.postDate}>
              <span aria-hidden="true">📅</span>
              {post.createdAt
                ? formatDate(new Date(post.createdAt))
                : formatDate(new Date())}
            </span>
            <span className={styles.postAuthor}>
              <span aria-hidden="true">👤</span>
              Autor #{post.userId}
            </span>
          </div>
        </header>

        <div className={styles.postContent}>
          <p className={styles.postBody}>{post.body}</p>
        </div>

        <footer className={styles.postFooter}>
          <div className={styles.postActions}>
            <Button variant="secondary" size="sm">
              <span aria-hidden="true">❤️</span>
              Curtir
            </Button>
            <Button variant="secondary" size="sm">
              <span aria-hidden="true">🔖</span>
              Salvar
            </Button>
            <Button variant="secondary" size="sm">
              <span aria-hidden="true">📤</span>
              Compartilhar
            </Button>
          </div>
        </footer>
      </article>

      <section className={styles.commentsSection}>
        <header className={styles.commentsHeader}>
          <h2 className={styles.commentsTitle}>
            <span aria-hidden="true">💬</span>
            Comentários
            <span className={styles.commentsCount}>({comments.length})</span>
          </h2>
          <button
            className={styles.toggleComments}
            onClick={() => setShowComments(!showComments)}
            aria-expanded={showComments}
            aria-label={showComments ? "Ocultar comentários" : "Mostrar comentários"}
          >
            {showComments ? "Ocultar" : "Mostrar"}
          </button>
        </header>

        {showComments && (
          <>
            <div className={styles.commentsList} role="region" aria-label="Lista de comentários">
              {comments.length === 0 ? (
                <EmptyState
                  icon="💭"
                  title="Nenhum comentário ainda"
                  message="Seja o primeiro a comentar!"
                />
              ) : (
                comments.map((comment) => (
                  <article key={comment.id} className={styles.comment}>
                    <header className={styles.commentHeader}>
                      <div className={styles.commentAuthor}>
                        <div className={styles.commentAvatar}>
                          {comment.name.charAt(0).toUpperCase()}
                        </div>
                        <div className={styles.commentMeta}>
                          <h3 className={styles.commentName}>{comment.name}</h3>
                          <span className={styles.commentEmail}>{comment.email}</span>
                        </div>
                      </div>
                    </header>
                    <div className={styles.commentBody}>
                      <p>{comment.body}</p>
                    </div>
                  </article>
                ))
              )}
            </div>

            <form
              onSubmit={handleAddComment}
              className={styles.commentForm}
              aria-label="Adicionar comentário"
            >
              <div className={styles.formGroup}>
                <label htmlFor="comment" className={styles.srOnly}>
                  Seu comentário
                </label>
                <textarea
                  id="comment"
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  placeholder="Escreva um comentário..."
                  className={styles.textarea}
                  rows={3}
                  required
                  aria-required="true"
                />
              </div>
              <Button
                type="submit"
                variant="primary"
                size="sm"
                disabled={isSubmitting || !newComment.trim()}
                loading={isSubmitting}
              >
                {isSubmitting ? "Enviando..." : "Comentar"}
              </Button>
            </form>
          </>
        )}
      </section>
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

const NotFoundMessage = () => (
  <div className={styles.notFoundContainer} role="status">
    <div className={styles.notFoundContent}>
      <span className={styles.notFoundIcon} aria-hidden="true">🔍</span>
      <h3 className={styles.notFoundTitle}>Post não encontrado</h3>
      <p className={styles.notFoundMessage}>O post que você está procurando não existe.</p>
      <Link to="/posts" className={styles.backLink}>
        Voltar para posts
      </Link>
    </div>
  </div>
);
