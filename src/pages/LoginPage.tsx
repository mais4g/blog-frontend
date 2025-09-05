import { useAuthStore } from "../store/useAuthStore";
import { useNavigate } from "react-router-dom";
import styles from "../styles/pages/LoginPage.module.css";

export default function LoginPage() {
  const login = useAuthStore((state) => state.login);
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    login();
    navigate("/posts");
  };

  return (
    <main className={styles.container}>
      <section className={styles.card} role="form" aria-label="Formulário de login">
        <h1 className={styles.title}>Login</h1>
        <form onSubmit={handleSubmit} className={styles.form}>
          <label htmlFor="email" className={styles.label}>Email</label>
          <input
            id="email"
            type="email"
            placeholder="Digite seu email"
            required
            className={styles.input}
            aria-required="true"
          />

          <label htmlFor="password" className={styles.label}>Senha</label>
          <input
            id="password"
            type="password"
            placeholder="Digite sua senha"
            required
            className={styles.input}
            aria-required="true"
          />

          <button type="submit" className={styles.button} aria-label="Entrar no sistema">
            Entrar
          </button>
        </form>
      </section>
    </main>
  );
}