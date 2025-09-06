import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { api } from "../api/api";
import Loader from "../components/Loader";
import Button from "../components/Button";
import styles from "../styles/pages/AlbumDetailPage.module.css";

interface Photo {
  id: number;
  title: string;
  thumbnailUrl: string;
  url: string;
}

export default function AlbumDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedPhoto, setSelectedPhoto] = useState<Photo | null>(null);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  useEffect(() => {
    const fetchPhotos = async () => {
      setError(null);
      try {
        const res = await api.get(`/albums/${id}/photos`);
        setPhotos(res.data);
      } catch {
        setError("Erro ao carregar fotos do álbum.");
      } finally {
        setLoading(false);
      }
    };
    fetchPhotos();
  }, [id]);

  const openPhotoModal = (photo: Photo) => {
    setSelectedPhoto(photo);
    document.body.style.overflow = 'hidden';
  };

  const closePhotoModal = () => {
    setSelectedPhoto(null);
    document.body.style.overflow = 'unset';
  };

  if (loading) return <Loader fullPage text="Carregando fotos..." />;
  if (error) return <ErrorMessage message={error} onRetry={() => window.location.reload()} />;

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <div className={styles.headerContent}>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate('/albums')}
            className={styles.backButton}
          >
            <span aria-hidden="true">←</span>
            Voltar
          </Button>
          
          <h1 className={styles.title}>
            <span aria-hidden="true">📷</span>
            Álbum {id}
          </h1>
          
          <div className={styles.headerActions}>
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
        </div>
      </header>

      <main className={styles.main}>
        {photos.length === 0 ? (
          <EmptyState
            icon="📸"
            title="Nenhuma foto encontrada"
            message="Este álbum ainda não tem fotos."
          />
        ) : (
          <div className={`${styles.gallery} ${styles[viewMode]}`} role="region" aria-label="Galeria de fotos">
            {photos.map((photo, index) => (
              <article
                key={photo.id}
                className={styles.photoCard}
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className={styles.photoWrapper}>
                  <img
                    src={photo.thumbnailUrl}
                    alt={photo.title}
                    className={styles.photo}
                    loading="lazy"
                    onClick={() => openPhotoModal(photo)}
                  />
                  <div className={styles.photoOverlay}>
                    <button
                      className={styles.viewButton}
                      onClick={() => openPhotoModal(photo)}
                      aria-label={`Ver foto ${photo.title} em tamanho real`}
                    >
                      <span aria-hidden="true">🔍</span>
                    </button>
                  </div>
                </div>
                <div className={styles.photoInfo}>
                  <h3 className={styles.photoTitle}>{photo.title}</h3>
                  <a
                    href={photo.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={styles.downloadLink}
                    aria-label={`Abrir foto ${photo.title} em nova aba`}
                  >
                    <span aria-hidden="true">🔗</span>
                    Abrir original
                  </a>
                </div>
              </article>
            ))}
          </div>
        )}
      </main>

      {/* Modal de visualização */}
      {selectedPhoto && (
        <div
          className={styles.modal}
          role="dialog"
          aria-modal="true"
          aria-labelledby="modal-title"
          onClick={closePhotoModal}
        >
          <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
            <header className={styles.modalHeader}>
              <h2 id="modal-title" className={styles.modalTitle}>{selectedPhoto.title}</h2>
              <button
                className={styles.closeButton}
                onClick={closePhotoModal}
                aria-label="Fechar modal"
              >
                <span aria-hidden="true">✕</span>
              </button>
            </header>
            <div className={styles.modalBody}>
              <img
                src={selectedPhoto.url}
                alt={selectedPhoto.title}
                className={styles.modalImage}
              />
            </div>
            <footer className={styles.modalFooter}>
              <a
                href={selectedPhoto.url}
                target="_blank"
                rel="noopener noreferrer"
                className={styles.externalLink}
              >
                <span aria-hidden="true">🔗</span>
                Abrir em nova aba
              </a>
            </footer>
          </div>
        </div>
      )}
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