import { BrowserRouter, Routes, Route } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import PostsPage from "./pages/PostsPage";
import AlbumsPage from "./pages/AlbumsPage";
import AdminPage from "./pages/AdminPage"; 
import PostDetailPage from "./pages/PostDetailPage";
import AlbumDetailPage from "./pages/AlbumDetailPage";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/posts" element={<PostsPage />} />
        <Route path="/albums" element={<AlbumsPage />} />
        <Route path="/admin" element={<AdminPage />} />
        <Route path="/posts/:id" element={<PostDetailPage />} />
        <Route path="/albums/:id" element={<AlbumDetailPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;