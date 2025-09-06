import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { api } from "../api/api";
import type { User, UserFormData } from "../types/User";
import Loader from "../components/Loader";
import Button from "../components/Button";
import styles from "../styles/pages/AdminPage.module.css";

// ✅ Schema de validação com Yup
const schema = yup.object({
  name: yup.string().required("O nome é obrigatório"),
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

  // ✅ Configuração do react-hook-form
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<UserFormData>({
    resolver: yupResolver(schema),
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
      setMessage({ text: "Usuário criado com sucesso!", type: "success" });
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
      setMessage({ text: "Usuário atualizado com sucesso!", type: "success" });
    } catch {
      setMessage({ text: "Erro ao atualizar usuário.", type: "error" });
    }
  };

  // Excluir usuário
  const handleDelete = async (id: number) => {
    try {
      await api.delete(`/users/${id}`);
      setUsers(users.filter((u) => u.id !== id));
      setMessage({ text: "Usuário excluído com sucesso!", type: "success" });
    } catch {
      setMessage({ text: "Erro ao excluir usuário.", type: "error" });
    }
  };

  if (loading) return <Loader />;

  return (
    <main className={styles.container}>
      <h1 className={styles.title}>⚙️ Painel Administrativo</h1>

      {/* Mensagens de feedback */}
      {message && (
        <p className={`${styles.message} ${styles[message.type]}`}>{message.text}</p>
      )}

      {/* Formulário */}
      <form
        onSubmit={handleSubmit(editingUser ? handleUpdate : handleCreate)}
        className={styles.form}
        aria-label={
          editingUser
            ? "Formulário de edição de usuário"
            : "Formulário de criação de usuário"
        }
      >
        <label htmlFor="name" className={styles.label}>
          Nome
        </label>
        <input
          id="name"
          type="text"
          placeholder="Nome"
          {...register("name")}
          className={styles.input}
          aria-invalid={!!errors.name}
          aria-describedby="name-error"
        />
        {errors.name && (
          <p id="name-error" className={styles.error}>
            {errors.name.message}
          </p>
        )}

        <label htmlFor="email" className={styles.label}>
          Email
        </label>
        <input
          id="email"
          type="email"
          placeholder="Email"
          {...register("email")}
          className={styles.input}
          aria-invalid={!!errors.email}
          aria-describedby="email-error"
        />
        {errors.email && (
          <p id="email-error" className={styles.error}>
            {errors.email.message}
          </p>
        )}

        <label htmlFor="phone" className={styles.label}>
          Telefone
        </label>
        <input
          id="phone"
          type="text"
          placeholder="Telefone (somente números)"
          {...register("phone")}
          className={styles.input}
          aria-invalid={!!errors.phone}
          aria-describedby="phone-error"
        />
        {errors.phone && (
          <p id="phone-error" className={styles.error}>
            {errors.phone.message}
          </p>
        )}

        <Button type="submit" variant="primary">
          {editingUser ? "Salvar Alterações" : "Adicionar Usuário"}
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
      </form>

      {/* Lista de usuários */}
      <table
        className={styles.table}
        role="table"
        aria-label="Tabela de usuários"
      >
        <thead>
          <tr>
            <th scope="col">ID</th>
            <th scope="col">Nome</th>
            <th scope="col">Email</th>
            <th scope="col">Telefone</th>
            <th scope="col">Ações</th>
          </tr>
        </thead>
        <tbody>
          {users.length === 0 ? (
            <tr>
              <td colSpan={5} className={styles.empty}>
                Nenhum usuário encontrado.
              </td>
            </tr>
          ) : (
            users.map((u) => (
              <tr key={u.id}>
                <td>{u.id}</td>
                <td>{u.name}</td>
                <td>{u.email}</td>
                <td>{u.phone}</td>
                <td className={styles.actions}>
                  <Button
                    variant="secondary"
                    onClick={() => {
                      setEditingUser(u);
                      reset(u);
                    }}
                    aria-label={`Editar usuário ${u.name}`}
                  >
                    Editar
                  </Button>
                  <Button
                    variant="danger"
                    onClick={() => handleDelete(u.id)}
                    aria-label={`Excluir usuário ${u.name}`}
                  >
                    Excluir
                  </Button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </main>
  );
}