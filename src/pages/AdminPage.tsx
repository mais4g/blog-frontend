import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { api } from "../api/api";
import type { User, UserFormData } from "../types/User";
import styles from "../styles/pages/AdminPage.module.css";


const schema = yup.object({
  name: yup.string().required("O nome é obrigatório"),
  email: yup
    .string()
    .email("Digite um email válido")
    .required("O email é obrigatório"),
  phone: yup
    .string()
    .matches(/^\d{10,11}$/, "Digite um telefone válido (10 ou 11 dígitos)")
    .required("O telefone é obrigatório"),
});

export default function AdminPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingUser, setEditingUser] = useState<User | null>(null);

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
    api.get("/users").then((res) => {
      setUsers(res.data);
      setLoading(false);
    });
  }, []);

  // Criar usuário
  const handleCreate = async (data: UserFormData) => {
    const res = await api.post("/users", data);
    const newUser: User = { ...res.data, id: users.length + 1 };
    setUsers([...users, newUser]);
    reset();
  };

  // Atualizar usuário
  const handleUpdate = async (data: UserFormData) => {
    if (!editingUser) return;
    const res = await api.put(`/users/${editingUser.id}`, data);
    const updatedUser: User = { ...editingUser, ...res.data };
    setUsers(users.map((u) => (u.id === editingUser.id ? updatedUser : u)));
    setEditingUser(null);
    reset();
  };

  // Excluir usuário
  const handleDelete = async (id: number) => {
    await api.delete(`/users/${id}`);
    setUsers(users.filter((u) => u.id !== id));
  };

  if (loading) return <p className={styles.loading}>Carregando usuários...</p>;

  return (
    <main className={styles.container}>
      <h1 className={styles.title}>⚙️ Painel Administrativo</h1>

      {/* Formulário */}
      <form
        onSubmit={handleSubmit(editingUser ? handleUpdate : handleCreate)}
        className={styles.form}
        aria-label={editingUser ? "Formulário de edição de usuário" : "Formulário de criação de usuário"}
      >
        <label htmlFor="name" className={styles.label}>Nome</label>
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
          <p id="name-error" className={styles.error}>{errors.name.message}</p>
        )}

        <label htmlFor="email" className={styles.label}>Email</label>
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
          <p id="email-error" className={styles.error}>{errors.email.message}</p>
        )}

        <label htmlFor="phone" className={styles.label}>Telefone</label>
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
          <p id="phone-error" className={styles.error}>{errors.phone.message}</p>
        )}

        <button type="submit" className={styles.buttonPrimary}>
          {editingUser ? "Salvar Alterações" : "Adicionar Usuário"}
        </button>

        {editingUser && (
          <button
            type="button"
            onClick={() => {
              setEditingUser(null);
              reset();
            }}
            className={styles.buttonCancel}
          >
            Cancelar
          </button>
        )}
      </form>

      {/* Lista de usuários */}
      <table className={styles.table} role="table" aria-label="Tabela de usuários">
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
          {users.map((u) => (
            <tr key={u.id}>
              <td>{u.id}</td>
              <td>{u.name}</td>
              <td>{u.email}</td>
              <td>{u.phone}</td>
              <td className={styles.actions}>
                <button
                  onClick={() => {
                    setEditingUser(u);
                    reset(u);
                  }}
                  className={styles.buttonEdit}
                  aria-label={`Editar usuário ${u.name}`}
                >
                  Editar
                </button>
                <button
                  onClick={() => handleDelete(u.id)}
                  className={styles.buttonDelete}
                  aria-label={`Excluir usuário ${u.name}`}
                >
                  Excluir
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </main>
  );
}