import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { api } from "../api/api";
import Loader from "../components/Loader";
import styles from "../styles/pages/AlbumsPage.module.css";

interface Album {
  id: number;
  title: string;
}

export default function AlbumsPage() {
  const [albums, setAlbums] = useState<Album[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAlbums = async () => {
      setError(null);
      try {
        const res = await api.get("/albums");
        setAlbums(res.data);
      } catch {
        setError("Erro ao carregar álbuns.");
      } finally {
        setLoading(false);
      }
    };
    fetchAlbums();
  }, []);

  if (loading) return <Loader />;
  if (error) return <p className={styles.error}>{error}</p>;

  return (
    <main className={styles.container}>
      <h1 className={styles.title}>🖼️ Galeria de Álbuns</h1>
      <ul className={styles.grid} aria-label="Lista de álbuns">
        {albums.map((album) => (
          <li key={album.id} className={styles.card}>
            <h2 className={styles.albumTitle}>{album.title}</h2>
            <Link to={`/albums/${album.id}`} className={styles.link}>
              Ver fotos
            </Link>
          </li>
        ))}
      </ul>
    </main>
  );
}