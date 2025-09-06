import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { api } from "../api/api";
import Loader from "../components/Loader";
import Button from "../components/Button";
import styles from "../styles/pages/AlbumsPage.module.css";

interface Album {
  id: number;
  title: string;
}

export default function AlbumsPage() {
  const [albums, setAlbums] = useState<Album[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

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

  const filteredAlbums = albums.filter(album =>
    album.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) return <Loader fullPage text="Carregando álbuns..." />;
  if (error) return <ErrorMessage message={error} onRetry={() => window.location.reload()} />;

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <div className={styles.headerContent}>
          <h1 className={styles.title}>
            <span aria-hidden="true">🖼️</span>
            Galeria de Álbuns
          </h1>
          <p className={styles.subtitle}>
            Explore nossa coleção de {albums.length} álbuns
          </p>
        </div>

        <div className={styles.headerActions}>
          <div className={styles.searchContainer}>
            <label htmlFor="search" className={styles.srOnly}>
              Buscar álbuns
            </label>
            <input
              id="search"
              type="search"
              placeholder="Buscar álbuns..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className={styles.searchInput}
              aria-label="Buscar álbuns por título"
            />
            <span className={styles.searchIcon} aria-hidden="true">🔍</span>
          </div>

          <div className={styles.viewToggle} role="group" aria-label="Modo de visualização">
            <button
              className={`${styles.viewButton} ${viewMode === 'grid' ? styles.active : ''}`}
              onClick={() => setViewMode('grid')}
              aria-label="Visualização em grade"
              aria-pressed={viewMode === 'grid'}
            >
              <span aria-hidden="true">⊞</span>
            </button>
            <button
              className={`${styles.viewButton} ${viewMode === 'list' ? styles.active : ''}`}
              onClick={() => setViewMode('list')}
              aria-label="Visualização em lista"
              aria-pressed={viewMode === 'list'}
            >
              <span aria-hidden="true">☰</span>
            </button>
          </div>
        </div>
      </header>

      <main className={styles.main}>
        {filteredAlbums.length === 0 ? (
          <EmptyState
            icon="📸"
            title={searchTerm ? "Nenhum álbum encontrado" : "Nenhum álbum disponível"}
            message={searchTerm ? "Tente buscar com outro termo" : "Não há álbuns para exibir no momento"}
          />
        ) : (
          <div className={`${styles.gallery} ${styles[viewMode]}`} role="region" aria-label="Galeria de álbuns">
            {filteredAlbums.map((album, index) => (
              <article
                key={album.id}
                className={styles.albumCard}
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className={styles.albumContent}>
                  <div className={styles.albumIcon} aria-hidden="true">📁</div>
                  <h2 className={styles.albumTitle}>{album.title}</h2>
                  <p className={styles.albumDescription}>
                    Álbum com fotos incríveis
                  </p>
                </div>
                <div className={styles.albumActions}>
                  <Link
                    to={`/albums/${album.id}`}
                    className={styles.viewLink}
                    aria-label={`Ver fotos do álbum ${album.title}`}
                  >
                    <span aria-hidden="true">📷</span>
                    Ver fotos
                  </Link>
                </div>
              </article>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}

// Componentes auxiliares
const ErrorMessage = ({ message, onRetry }: { message: string; onRetry: () => void }) => (
  <div className={styles.errorContainer} role="alert">
    <div className={styles.errorContent}>
      <span className={styles.errorIcon} aria-hidden="true">❌</span>
      <h3 className={styles.errorTitle}>Erro ao carregar</h3>
      <p className={styles.errorMessage}>{message}</p>
      <Button variant="primary" size="sm" onClick={onRetry}>
        Tentar novamente
      </Button>
    </div>
  </div>
);

const EmptyState = ({ icon, title, message }: { icon: string; title: string; message: string }) => (
  <div className={styles.emptyState} role="status">
    <div className={styles.emptyIcon} aria-hidden="true">{icon}</div>
    <h3 className={styles.emptyTitle}>{title}</h3>
    <p className={styles.emptyMessage}>{message}</p>
  </div>
);