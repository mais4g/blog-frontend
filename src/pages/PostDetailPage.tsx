import { useEffect, useState, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { api } from "../api/api";
import Loader from "../components/Loader";
import Button from "../components/Button";
import styles from "../styles/pages/PostDetailPage.module.css";
import { ArrowLeft, Calendar, User, MessageCircle, Send, FileWarning } from "lucide-react";

interface Post {
  id: number;
  title: string;
  body: string;
  userId: number;
}

interface Comment {
  id: number;
  name: string;
  email: string;
  body: string;
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

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [postRes, commentsRes] = await Promise.all([
        api.get(`/posts/${id}`),
        api.get(`/posts/${id}/comments`),
      ]);
      setPost(postRes.data);
      setComments(commentsRes.data);
    } catch {
      setError("Não foi possível carregar os detalhes do post.");
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleAddComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim() || isSubmitting) return;

    setIsSubmitting(true);
    try {
      const res = await api.post(`/posts/${id}/comments`, {
        body: newComment,
        name: "Usuário Anônimo", // Mock data
        email: "anonimo@email.com", // Mock data
      });
      setComments((prev) => [res.data, ...prev]);
      setNewComment("");
    } catch {
      // Aqui você poderia ter um estado de erro para o formulário
      alert("Erro ao enviar comentário.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) return <Loader fullPage text="Carregando post..." />;

  if (error || !post) {
    return (
      <div className={styles.container}>
        <div className={styles.errorState}>
          <FileWarning size={48} className={styles.errorIcon} />
          <h2 className={styles.errorTitle}>{error || "Post não encontrado"}</h2>
          <p className={styles.errorText}>
            {error ? "Tente recarregar a página." : "O post que você está procurando não existe ou foi movido."}
          </p>
          <Button variant="secondary" onClick={() => navigate('/posts')}>
            <ArrowLeft size={16} /> Voltar para Postagens
          </Button>
        </div>
      </div>
    );
  }
  
  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <Button variant="secondary" size="sm" onClick={() => navigate("/posts")}>
          <ArrowLeft size={16} />
          Voltar para Postagens
        </Button>
      </header>

      <article className={styles.article}>
        <header className={styles.articleHeader}>
          <h1 className={styles.title}>{post.title}</h1>
          <div className={styles.meta}>
            <span className={styles.metaItem}><Calendar size={16} /> Post #{post.id}</span>
            <span className={styles.metaItem}><User size={16} /> Autor #{post.userId}</span>
          </div>
        </header>
        <div className={styles.articleBody}>
          <p>{post.body}</p>
        </div>
      </article>

      <section className={styles.commentsSection} aria-labelledby="comments-title">
        <h2 id="comments-title" className={styles.subtitle}>
          <MessageCircle size={24} />
          Comentários ({comments.length})
        </h2>

        <form onSubmit={handleAddComment} className={styles.form}>
          <textarea
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Escreva um comentário..."
            className={styles.textarea}
            rows={3}
            required
          />
          <Button type="submit" loading={isSubmitting} disabled={!newComment.trim()}>
            <Send size={16} />
            Enviar Comentário
          </Button>
        </form>

        <div className={styles.commentList}>
          {comments.map((comment) => (
            <div key={comment.id} className={styles.comment}>
              <div className={styles.commentAvatar}>
                {comment.name.charAt(0).toUpperCase()}
              </div>
              <div className={styles.commentContent}>
                <p className={styles.commentAuthor}>{comment.name}</p>
                <p className={styles.commentText}>{comment.body}</p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}