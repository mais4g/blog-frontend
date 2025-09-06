import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { api } from "../api/api";
import Loader from "../components/Loader";
import styles from "../styles/pages/PostDetailPage.module.css";

interface Post {
  id: number;
  title: string;
  body: string;
}

interface Comment {
  id: number;
  body: string;
  userId: number;
}

export default function PostDetailPage() {
  const { id } = useParams();
  const [post, setPost] = useState<Post | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState("");
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

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
        postId: id,
        userId: 1, // simula usuário logado
        body: newComment,
      });
      setComments((prev) => [...prev, res.data]);
      setNewComment("");
    } catch {
      alert("Erro ao enviar comentário.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) return <Loader />;
  if (error) return <p className={styles.error}>{error}</p>;

  return (
    <main className={styles.container}>
      {post && (
        <article>
          <h1 className={styles.title}>{post.title}</h1>
          <p className={styles.body}>{post.body}</p>
        </article>
      )}

      <section aria-label="Comentários do post">
        <h2 className={styles.subtitle}>💬 Comentários</h2>
        <ul className={styles.commentList}>
          {comments.map((c) => (
            <li key={c.id} className={styles.comment}>
              <p>{c.body}</p>
            </li>
          ))}
        </ul>
      </section>

      <form
        onSubmit={handleAddComment}
        className={styles.form}
        aria-label="Adicionar comentário"
      >
        <textarea
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          placeholder="Escreva um comentário..."
          className={styles.textarea}
        />
        <button type="submit" className={styles.button} disabled={isSubmitting}>
          {isSubmitting ? "Enviando..." : "Adicionar Comentário"}
        </button>
      </form>
    </main>
  );
}