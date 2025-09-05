import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { api } from "../api/api";
import styles from "../styles/pages/AlbumsPage.module.css";

interface Album {
  id: number;
  title: string;
}

export default function AlbumsPage() {
  const [albums, setAlbums] = useState<Album[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get("/albums").then((res) => {
      setAlbums(res.data);
      setLoading(false);
    });
  }, []);

  if (loading) return <p className={styles.loading}>Carregando álbuns...</p>;

  return (
    <main className={styles.container}>
      <h1 className={styles.title}>🖼️ Galeria de Álbuns</h1>
      <ul className={styles.grid} aria-label="Lista de álbuns">
        {albums.map((album) => (
          <li key={album.id} className={styles.card}>
            <h2 className={styles.albumTitle}>{album.title}</h2>
            <Link
              to={`/albums/${album.id}`}
              className={styles.link}
              aria-label={`Ver fotos do álbum ${album.title}`}
            >
              Ver fotos
            </Link>
          </li>
        ))}
      </ul>
    </main>
  );
}