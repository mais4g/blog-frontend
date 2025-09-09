# 📑 Blog Frontend Challenge

Este projeto foi desenvolvido como parte de uma **prova técnica para Desenvolvedor Frontend**.  
O objetivo é consumir a API pública [JSONPlaceholder](https://jsonplaceholder.typicode.com/) e construir um **blog** com funcionalidades de autenticação simples, CRUD de usuários, listagem de posts, comentários e galeria de álbuns.

---

## 🚀 Tecnologias Utilizadas

- **React 18 + Vite** → framework moderno e rápido para desenvolvimento frontend.  
- **TypeScript** → tipagem estática para maior segurança e produtividade.  
- **Zustand** → gerenciamento de estado global simples e minimalista.  
- **Axios** → consumo de API com suporte a interceptors e Promises.  
- **React Hook Form + Yup** → formulários com validação avançada.  
- **CSS Modules** → escopo local de estilos, evitando conflitos.  
- **Mobile First + Acessibilidade (A11Y)** → design responsivo e inclusivo.  
- **Vitest + React Testing Library** → testes unitários.  

---

## 📂 Estrutura do Projeto

```text
src/
 ├── api/              # Configuração do Axios
 ├── components/       # Componentes reutilizáveis (Button, Loader, Header, etc.)
 ├── pages/            # Páginas principais (Login, Posts, PostDetail, Albums, AlbumDetail, Admin)
 ├── store/            # Zustand (auth store)
 ├── styles/           # CSS Modules organizados por páginas e componentes
 ├── tests/            # Testes unitários (Vitest + RTL)
 ├── App.tsx           # Definição de rotas
 └── main.tsx          # Ponto de entrada
```

---

## ⚙️ Instalação e Execução

### 1. Clone o repositório
```bash
git clone https://github.com/seu-usuario/blog-frontend.git
cd blog-frontend
```

### 2. Instale as dependências
```bash
npm install
```

### 3. Execute em modo de desenvolvimento
```bash
npm run dev
```

Acesse em: [http://localhost:5173](http://localhost:5173)

### 4. Build para produção
```bash
npm run build
```

### 5. Rodar testes unitários
```bash
npm run test
```

---

## 🔑 Funcionalidades

### 🔹 Autenticação
- Tela de login simples (mockada com Zustand).  
- Rotas protegidas: `/posts`, `/albums`, `/admin`.  
- Logout funcional no Header.  

### 🔹 Painel Administrativo
- CRUD de usuários (listar, criar, editar, excluir).  
- Validações avançadas com Yup.  
- Tratamento de erros e feedback visual.  

### 🔹 Postagens
- Listagem de posts com paginação.  
- Detalhes de post com comentários.  
- Adicionar novo comentário (simulação com `userId: 1`).  
- Loader e mensagens de erro.  

### 🔹 Galeria de Álbuns
- Listagem de álbuns.  
- Exibição de fotos em grid responsivo.  
- Links para abrir fotos em tamanho real.  

---

## 🧪 Testes

### Unitários (Vitest + RTL)
- `LoginPage.test.tsx`: valida renderização e fluxo de login.  
- `AdminPage.test.tsx`: validações de formulário e criação de usuário.  

### E2E (Cypress) *(opcional, removido do projeto final)*  
- Fluxo de login.  
- CRUD de usuários.  

---

## 🛠️ Decisões Técnicas

- **React + Vite**: escolhido pela velocidade de build e simplicidade.  
- **Zustand**: gerenciamento de estado minimalista, sem boilerplate.  
- **CSS Modules**: escopo local de estilos, evitando conflitos.  
- **Axios**: consumo de API mais simples que `fetch`, com suporte a interceptors.  
- **React Hook Form + Yup**: melhor experiência para formulários com validação.  
- **Vitest + RTL**: integração nativa com Vite, rápido e confiável.  

---

## 📌 Melhorias Futuras

- Implementar **autenticação real** com JWT.  
- Adicionar **dark mode**.  
- Melhorar ainda mais a **acessibilidade (A11Y)**.  
- Implementar **testes E2E** com Cypress ou Playwright.  
- Deploy contínuo com CI/CD.  

---

## 👨‍💻 Autor

Desenvolvido por Maisa Gomes ✨