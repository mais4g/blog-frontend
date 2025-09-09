import { useEffect, useState, useCallback } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { api } from "../api/api";
import type { User, UserFormData } from "../types/User";
import Loader from "../components/Loader";
import Button from "../components/Button";
import styles from "../styles/pages/AdminPage.module.css";
import { UserCog, UserPlus, FileWarning, Trash2, Edit, X, CheckCircle, AlertCircle, Users } from "lucide-react";

// Validação do formulário
const schema = yup.object({
  name: yup.string().required("O nome é obrigatório").min(3, "O nome deve ter no mínimo 3 caracteres"),
  email: yup.string().email("Digite um e-mail válido").required("O e-mail é obrigatório"),
  phone: yup.string().matches(/^\d{10,11}$/, "Digite um telefone válido (ex: 11987654321)").required("O telefone é obrigatório"),
});

export default function AdminPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [feedback, setFeedback] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm<UserFormData>({
    resolver: yupResolver(schema),
    mode: "onBlur",
  });

  // Busca inicial dos dados
  const fetchUsers = useCallback(async () => {
    setLoading(true);
    try {
      const res = await api.get("/users");
      setUsers(res.data);
    } catch {
      setFeedback({ message: "Erro ao carregar usuários.", type: "error" });
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);
  
  // Função para submeter o formulário (criar ou editar)
  const handleFormSubmit = async (data: UserFormData) => {
    setFeedback(null);
    try {
      if (editingUser) {
        const res = await api.put(`/users/${editingUser.id}`, data);
        const updatedUser: User = { ...editingUser, ...res.data };
        setUsers(users.map((u) => (u.id === editingUser.id ? updatedUser : u)));
        setFeedback({ message: "Usuário atualizado com sucesso!", type: "success" });
      } else {
        const res = await api.post("/users", data);
        const newUser: User = { ...res.data, id: users.length + 1 + Math.random() }; // Mock ID
        setUsers((prev) => [newUser, ...prev]);
        setFeedback({ message: "Usuário criado com sucesso!", type: "success" });
      }
      reset();
      setEditingUser(null);
    } catch {
      setFeedback({ message: `Erro ao ${editingUser ? 'atualizar' : 'criar'} usuário.`, type: "error" });
    }
  };

  // Função para deletar
  const handleDelete = async (id: number) => {
    if (!window.confirm("Tem certeza que deseja excluir este usuário?")) return;
    setFeedback(null);
    try {
      await api.delete(`/users/${id}`);
      setUsers(users.filter((u) => u.id !== id));
      setFeedback({ message: "Usuário excluído com sucesso.", type: "success" });
    } catch {
      setFeedback({ message: "Erro ao excluir usuário.", type: "error" });
    }
  };
  
  // Funções para modo de edição
  const handleEdit = (user: User) => {
    setEditingUser(user);
    reset(user);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };
  
  const cancelEdit = () => {
    setEditingUser(null);
    reset({ name: '', email: '', phone: '' });
  };

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <div>
          <h1 className={styles.title}><UserCog size={32} />Painel Administrativo</h1>
          <p className={styles.subtitle}>Gerencie os usuários do sistema com facilidade.</p>
        </div>
      </header>
      
      <main className={styles.mainGrid}>
        <section className={styles.formSection}>
          <h2 className={styles.sectionTitle}>
            {editingUser ? <Edit size={20} /> : <UserPlus size={20} />}
            {editingUser ? `Editando: ${editingUser.name}` : "Adicionar Novo Usuário"}
          </h2>
          <form onSubmit={handleSubmit(handleFormSubmit)} noValidate className={styles.form}>
            <div className={styles.field}>
              <label htmlFor="name">Nome completo</label>
              <input id="name" {...register("name")} placeholder="João da Silva" aria-invalid={!!errors.name} />
              {errors.name && <p role="alert">{errors.name.message}</p>}
            </div>
            <div className={styles.field}>
              <label htmlFor="email">E-mail</label>
              <input id="email" {...register("email")} placeholder="joao.silva@email.com" aria-invalid={!!errors.email} />
              {errors.email && <p role="alert">{errors.email.message}</p>}
            </div>
            <div className={styles.field}>
              <label htmlFor="phone">Telefone</label>
              <input id="phone" {...register("phone")} placeholder="11987654321" aria-invalid={!!errors.phone} />
              {errors.phone && <p role="alert">{errors.phone.message}</p>}
            </div>
            <div className={styles.formActions}>
              {editingUser && <Button type="button" variant="secondary" onClick={cancelEdit}>Cancelar</Button>}
              <Button type="submit" loading={isSubmitting} disabled={isSubmitting}>{editingUser ? "Salvar Alterações" : "Adicionar Usuário"}</Button>
            </div>
          </form>
        </section>

        <section className={styles.listSection}>
          <h2 className={styles.sectionTitle}>
            <Users size={20} />
            Lista de Usuários ({users.length})
          </h2>

          {feedback && (
            <div className={`${styles.feedback} ${styles[feedback.type]}`} role="alert">
              {feedback.type === 'success' ? <CheckCircle size={20} /> : <AlertCircle size={20} />}
              <span>{feedback.message}</span>
              <button onClick={() => setFeedback(null)} aria-label="Fechar"><X size={18} /></button>
            </div>
          )}

          {loading ? <Loader /> : users.length === 0 ? (
            <div className={styles.emptyState}>
              <FileWarning size={48} />
              <p>Nenhum usuário cadastrado ainda.</p>
            </div>
          ) : (
            <div className={styles.tableWrapper}>
              <table className={styles.table}>
                <thead><tr><th>Usuário</th><th>Contato</th><th className={styles.actionsHeader}>Ações</th></tr></thead>
                <tbody>
                  {users.map(user => (
                    <tr key={user.id}>
                      <td data-label="Usuário">
                        <div className={styles.userCell}>
                          <div className={styles.avatar}>{user.name.charAt(0)}</div>
                          <div>
                            <p className={styles.userName}>{user.name}</p>
                            <p className={styles.userId}>ID: {user.id}</p>
                          </div>
                        </div>
                      </td>
                      <td data-label="Contato">
                        <p className={styles.userContact}>{user.email}</p>
                        <p className={styles.userContact}>{user.phone}</p>
                      </td>
                      <td data-label="Ações">
                        <div className={styles.actionsCell}>
                          <Button size="sm" variant="secondary" onClick={() => handleEdit(user)}><Edit size={14} /> Editar</Button>
                          <Button size="sm" variant="danger" onClick={() => handleDelete(user.id)}><Trash2 size={14} /> Excluir</Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </main>
    </div>
  );
}