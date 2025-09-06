import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { api } from "../api/api";
import type { User, UserFormData } from "../types/User";
import Loader from "../components/Loader";
import Button from "../components/Button";
import styles from "../styles/pages/AdminPage.module.css";

// Schema de validação com Yup
const schema = yup.object({
  name: yup.string().required("O nome é obrigatório").min(3, "Mínimo 3 caracteres"),
  email: yup
    .string()
    .email("Digite um email válido")
    .required("O email é obrigatório"),
  phone: yup
    .string()
    .required("O telefone é obrigatório")
    .matches(/^\d{10,11}$/, "Digite um telefone válido (10 ou 11 dígitos)"),
});

export default function AdminPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [message, setMessage] = useState<{ text: string; type: "error" | "success" } | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<UserFormData>({
    resolver: yupResolver(schema),
    mode: "onBlur",
  });

  // Buscar usuários
  useEffect(() => {
    const fetchUsers = async () => {
      setMessage(null);
      try {
        const res = await api.get("/users");
        setUsers(res.data);
      } catch {
        setMessage({ text: "Erro ao carregar usuários.", type: "error" });
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, []);

  // Criar usuário
  const handleCreate = async (data: UserFormData) => {
    try {
      const res = await api.post("/users", data);
      const newUser: User = { ...res.data, id: users.length + 1 };
      setUsers([...users, newUser]);
      reset();
      setMessage({ text: "Usuário criado com sucesso! 🎉", type: "success" });
    } catch {
      setMessage({ text: "Erro ao criar usuário.", type: "error" });
    }
  };

  // Atualizar usuário
  const handleUpdate = async (data: UserFormData) => {
    if (!editingUser) return;
    try {
      const res = await api.put(`/users/${editingUser.id}`, data);
      const updatedUser: User = { ...editingUser, ...res.data };
      setUsers(users.map((u) => (u.id === editingUser.id ? updatedUser : u)));
      setEditingUser(null);
      reset();
      setMessage({ text: "Usuário atualizado com sucesso! ✨", type: "success" });
    } catch {
      setMessage({ text: "Erro ao atualizar usuário.", type: "error" });
    }
  };

  // Excluir usuário
  const handleDelete = async (id: number) => {
    if (!confirm("Tem certeza que deseja excluir este usuário?")) return;
    
    try {
      await api.delete(`/users/${id}`);
      setUsers(users.filter((u) => u.id !== id));
      setMessage({ text: "Usuário excluído com sucesso! 🗑️", type: "success" });
    } catch {
      setMessage({ text: "Erro ao excluir usuário.", type: "error" });
    }
  };

  if (loading) return <Loader fullPage />;

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h1 className={styles.title}>
          <span aria-hidden="true">⚙️</span>
          Painel Administrativo
        </h1>
        <p className={styles.subtitle}>Gerencie os usuários do sistema</p>
      </header>

      {/* Mensagens de feedback */}
      {message && (
        <div 
          className={`${styles.message} ${styles[message.type]}`}
          role="alert"
          aria-live="polite"
        >
          <span className={styles.messageIcon}>
            {message.type === 'success' ? '✅' : '❌'}
          </span>
          {message.text}
          <button
            className={styles.closeButton}
            onClick={() => setMessage(null)}
            aria-label="Fechar mensagem"
          >
            ✕
          </button>
        </div>
      )}

      {/* Formulário */}
      <section className={styles.formSection} aria-label="Formulário de usuário">
        <form
          onSubmit={handleSubmit(editingUser ? handleUpdate : handleCreate)}
          className={styles.form}
          noValidate
        >
          <div className={styles.formGrid}>
            <div className={styles.fieldGroup}>
              <label htmlFor="name" className={styles.label}>
                Nome completo
              </label>
              <input
                id="name"
                type="text"
                placeholder="João Silva"
                {...register("name")}
                className={`${styles.input} ${errors.name ? styles.error : ''}`}
                aria-invalid={!!errors.name}
                aria-describedby={errors.name ? 'name-error' : undefined}
              />
              {errors.name && (
                <p id="name-error" className={styles.errorMessage} role="alert">
                  {errors.name.message}
                </p>
              )}
            </div>

            <div className={styles.fieldGroup}>
              <label htmlFor="email" className={styles.label}>
                Email
              </label>
              <input
                id="email"
                type="email"
                placeholder="joao@exemplo.com"
                {...register("email")}
                className={`${styles.input} ${errors.email ? styles.error : ''}`}
                aria-invalid={!!errors.email}
                aria-describedby={errors.email ? 'email-error' : undefined}
              />
              {errors.email && (
                <p id="email-error" className={styles.errorMessage} role="alert">
                  {errors.email.message}
                </p>
              )}
            </div>

            <div className={styles.fieldGroup}>
              <label htmlFor="phone" className={styles.label}>
                Telefone
              </label>
              <input
                id="phone"
                type="tel"
                placeholder="11999999999"
                {...register("phone")}
                className={`${styles.input} ${errors.phone ? styles.error : ''}`}
                aria-invalid={!!errors.phone}
                aria-describedby={errors.phone ? 'phone-error' : undefined}
              />
              {errors.phone && (
                <p id="phone-error" className={styles.errorMessage} role="alert">
                  {errors.phone.message}
                </p>
              )}
            </div>
          </div>

          <div className={styles.formActions}>
            <Button
              type="submit"
              variant="primary"
              disabled={isSubmitting}
              loading={isSubmitting}
            >
              {editingUser ? "Atualizar usuário" : "Adicionar usuário"}
            </Button>

            {editingUser && (
              <Button
                type="button"
                variant="secondary"
                onClick={() => {
                  setEditingUser(null);
                  reset();
                }}
              >
                Cancelar
              </Button>
            )}
          </div>
        </form>
      </section>

      {/* Lista de usuários */}
      <section className={styles.tableSection} aria-label="Lista de usuários">
        <div className={styles.tableHeader}>
          <h2 className={styles.tableTitle}>
            <span aria-hidden="true">👥</span>
            Usuários cadastrados
          </h2>
          <span className={styles.count}>{users.length} usuário(s)</span>
        </div>

        {users.length === 0 ? (
          <div className={styles.emptyState} role="status">
            <span className={styles.emptyIcon}>📭</span>
            <p className={styles.emptyTitle}>Nenhum usuário encontrado</p>
            <p className={styles.emptyText}>Comece adicionando um novo usuário</p>
          </div>
        ) : (
          <div className={styles.tableWrapper} role="region" aria-label="Tabela de usuários">
            <table className={styles.table}>
              <thead>
                <tr>
                  <th scope="col">ID</th>
                  <th scope="col">Nome</th>
                  <th scope="col">Email</th>
                  <th scope="col">Telefone</th>
                  <th scope="col" className={styles.actionsHeader}>Ações</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user, index) => (
                  <tr key={user.id} style={{ animationDelay: `${index * 0.1}s` }}>
                    <td>{user.id}</td>
                    <td>
                      <div className={styles.userInfo}>
                        <div className={styles.userAvatar}>
                          {user.name.charAt(0).toUpperCase()}
                        </div>
                        <span className={styles.userName}>{user.name}</span>
                      </div>
                    </td>
                    <td>
                      <a href={`mailto:${user.email}`} className={styles.emailLink}>
                        {user.email}
                      </a>
                    </td>
                    <td>
                      <a href={`tel:${user.phone}`} className={styles.phoneLink}>
                        {user.phone.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3')}
                      </a>
                    </td>
                    <td>
                      <div className={styles.actions}>
                        <Button
                          variant="secondary"
                          size="sm"
                          onClick={() => {
                            setEditingUser(user);
                            reset(user);
                          }}
                          aria-label={`Editar usuário ${user.name}`}
                        >
                          <span aria-hidden="true">✏️</span>
                          Editar
                        </Button>
                        <Button
                          variant="danger"
                          size="sm"
                          onClick={() => handleDelete(user.id)}
                          aria-label={`Excluir usuário ${user.name}`}
                        >
                          <span aria-hidden="true">🗑️</span>
                          Excluir
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
}