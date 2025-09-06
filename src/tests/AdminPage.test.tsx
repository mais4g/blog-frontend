import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import AdminPage from "../pages/AdminPage";
import { api } from "../api/api";

// Mock da API
vi.mock("../api/api", () => ({
  api: {
    get: vi.fn(),
    post: vi.fn(),
    put: vi.fn(),
    delete: vi.fn(),
  },
}));

describe("AdminPage", () => {
  beforeEach(() => {
    (api.get as any).mockResolvedValue({ data: [] }); // simula lista vazia
  });

  it("deve renderizar a tabela de usuários", async () => {
    render(<AdminPage />);
    expect(await screen.findByText("⚙️ Painel Administrativo")).toBeInTheDocument();
  });

  it("deve validar campos obrigatórios", async () => {
    render(<AdminPage />);

    // espera o loader sumir
    await waitFor(() => {
      expect(screen.queryByRole("status")).not.toBeInTheDocument();
    });

    fireEvent.click(screen.getByRole("button", { name: /adicionar usuário/i }));

    expect(await screen.findByText("O nome é obrigatório")).toBeInTheDocument();
    expect(await screen.findByText("O email é obrigatório")).toBeInTheDocument();
    expect(await screen.findByText("O telefone é obrigatório")).toBeInTheDocument();
  });

  it("deve criar um novo usuário", async () => {
    (api.post as any).mockResolvedValue({
      data: { id: 11, name: "João", email: "joao@email.com", phone: "11999999999" },
    });

    render(<AdminPage />);

    // espera o loader sumir
    await waitFor(() => {
      expect(screen.queryByRole("status")).not.toBeInTheDocument();
    });

    fireEvent.change(screen.getByPlaceholderText("Nome"), { target: { value: "João" } });
    fireEvent.change(screen.getByPlaceholderText("Email"), { target: { value: "joao@email.com" } });
    fireEvent.change(screen.getByPlaceholderText("Telefone (somente números)"), {
      target: { value: "11999999999" },
    });

    fireEvent.click(screen.getByRole("button", { name: /adicionar usuário/i }));

    await waitFor(() => {
      expect(screen.getByText("João")).toBeInTheDocument();
    });
  });
});