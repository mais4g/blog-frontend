import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { api } from "../api/api";
import styles from "../styles/pages/PostDetailPage.module.css";

interface Post {
  id: number;
  title: string;
  body: string;
}

interface Comment {
  id: number;
  name: string;
  email: string;
  body: string;
}

export default function PostDetailPage() {
  const { id } = useParams();
  const [post, setPost] = useState<Post | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const [postRes, commentsRes] = await Promise.all([
          api.get(`/posts/${id}`),
          api.get(`/posts/${id}/comments`),
        ]);
        setPost(postRes.data);
        setComments(commentsRes.data);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [id]);

  const handleAddComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    const res = await api.post("/comments", {
      postId: id,
      name: "Usuário Teste",
      email: "teste@email.com",
      body: newComment,
    });

    setComments((prev) => [...prev, res.data]);
    setNewComment("");
  };

  if (loading) return <p className={styles.loading}>Carregando...</p>;

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
              <p className={styles.commentName}>{c.name}</p>
              <p className={styles.commentEmail}>{c.email}</p>
              <p>{c.body}</p>
            </li>
          ))}
        </ul>
      </section>

      <form onSubmit={handleAddComment} className={styles.form} aria-label="Adicionar comentário">
        <label htmlFor="comment" className={styles.label}>Novo comentário</label>
        <textarea
          id="comment"
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          placeholder="Escreva um comentário..."
          className={styles.textarea}
          aria-required="true"
        />
        <button type="submit" className={styles.button}>
          Adicionar Comentário
        </button>
      </form>
    </main>
  );
}