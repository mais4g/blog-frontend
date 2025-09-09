import { useEffect, useState, useCallback } from "react";
import { Link } from "react-router-dom";
import { api } from "../api/api";
import Loader from "../components/Loader";
import styles from "../styles/pages/AlbumsPage.module.css";
import { Image, FileWarning, ArrowRight } from "lucide-react";

interface Album {
  id: number;
  title: string;
  userId: number;
}

export default function AlbumsPage() {
  const [albums, setAlbums] = useState<Album[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAlbums = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.get("/albums");
      setAlbums(res.data);
    } catch {
      setError("Não foi possível carregar os álbuns. Tente novamente mais tarde.");
      setAlbums([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAlbums();
  }, [fetchAlbums]);

  const renderContent = () => {
    if (loading) {
      return <Loader text="Carregando álbuns..." />;
    }

    if (error) {
      return <div className={styles.errorState}>{error}</div>;
    }

    if (albums.length === 0) {
      return (
        <div className={styles.emptyState}>
          <FileWarning size={48} className={styles.emptyIcon} />
          <h2 className={styles.emptyTitle}>Nenhum álbum encontrado</h2>
          <p className={styles.emptyText}>Parece que não há álbuns para mostrar no momento.</p>
        </div>
      );
    }

    return (
      <div className={styles.grid}>
        {albums.map((album, index) => (
          <article key={album.id} className={styles.card} style={{ animationDelay: `${index * 50}ms` }}>
            <div className={styles.cardContent}>
              <div className={styles.cardIcon}>
                <Image size={24} />
              </div>
              <h2 className={styles.cardTitle}>
                <Link to={`/albums/${album.id}`}>{album.title}</Link>
              </h2>
            </div>
            <footer className={styles.cardFooter}>
              <Link to={`/albums/${album.id}`} className={styles.viewLink}>
                Ver fotos <ArrowRight size={16} />
              </Link>
            </footer>
          </article>
        ))}
      </div>
    );
  };

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <div>
          <h1 className={styles.title}>
            <Image size={32} />
            Galeria de Álbuns
          </h1>
          <p className={styles.subtitle}>Explore coleções de imagens e momentos.</p>
        </div>
      </header>
      <main>
        {renderContent()}
      </main>
    </div>
  );
}