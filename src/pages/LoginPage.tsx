import { useState } from "react";
import { useAuthStore } from "../store/useAuthStore";
import { useNavigate } from "react-router-dom";
import { AtSign, Lock, LogIn, Sparkles } from "lucide-react";
import Loader from "../components/Loader";
import Button from "../components/Button";
import styles from "../styles/pages/LoginPage.module.css";

export default function LoginPage() {
  const login = useAuthStore((state) => state.login);
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState({ email: "", password: "" });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name as keyof typeof errors]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const validateForm = () => {
    const newErrors = { email: "", password: "" };
    let isValid = true;

    if (!formData.email) {
      newErrors.email = "O e-mail é obrigatório";
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Formato de e-mail inválido";
      isValid = false;
    }

    if (!formData.password) {
      newErrors.password = "A senha é obrigatória";
      isValid = false;
    } else if (formData.password.length < 6) {
      newErrors.password = "A senha deve ter no mínimo 6 caracteres";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsLoading(true);
    setTimeout(() => {
      login();
      navigate("/posts");
    }, 1000);
  };

  return (
    <div className={styles.container}>
      {isLoading && <Loader fullPage text="Autenticando..." />}
      <div className={styles.card}>
        <div className={styles.header}>
          <div className={styles.logo}>
            <Sparkles size={32} />
          </div>
          <h1 className={styles.title}>Bem-vindo de Volta</h1>
          <p className={styles.subtitle}>Acesse sua conta para continuar.</p>
        </div>

        <form onSubmit={handleSubmit} className={styles.form} noValidate>
          <div className={styles.fieldGroup}>
            <label htmlFor="email" className={styles.label}>E-mail</label>
            <div className={styles.inputContainer}>
              <AtSign className={styles.inputIcon} size={18} aria-hidden="true" />
              <input
                id="email"
                name="email"
                type="email"
                placeholder="seu@email.com"
                value={formData.email}
                onChange={handleInputChange}
                className={`${styles.input} ${errors.email ? styles.inputError : ""}`}
                aria-invalid={!!errors.email}
                aria-describedby="email-error"
                required
              />
            </div>
            {errors.email && (
              <p id="email-error" className={styles.errorMessage} role="alert">
                {errors.email}
              </p>
            )}
          </div>

          <div className={styles.fieldGroup}>
            <label htmlFor="password" className={styles.label}>Senha</label>
            <div className={styles.inputContainer}>
              <Lock className={styles.inputIcon} size={18} aria-hidden="true" />
              <input
                id="password"
                name="password"
                type="password"
                placeholder="••••••••"
                value={formData.password}
                onChange={handleInputChange}
                className={`${styles.input} ${errors.password ? styles.inputError : ""}`}
                aria-invalid={!!errors.password}
                aria-describedby="password-error"
                required
              />
            </div>
            {errors.password && (
              <p id="password-error" className={styles.errorMessage} role="alert">
                {errors.password}
              </p>
            )}
          </div>

          <Button type="submit" variant="primary" size="lg" className={styles.button} loading={isLoading} disabled={isLoading}>
            <LogIn size={18} />
            Entrar
          </Button>
        </form>

        <footer className={styles.footer}>
          <p className={styles.footerText}>
            Não tem uma conta?{" "}
            <a href="#" className={styles.footerLink}>
              Cadastre-se
            </a>
          </p>
        </footer>
      </div>
    </div>
  );
}