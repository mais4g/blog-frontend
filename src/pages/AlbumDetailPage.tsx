import { useEffect, useState, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { api } from "../api/api";
import Loader from "../components/Loader";
import Button from "../components/Button";
import styles from "../styles/pages/AlbumDetailPage.module.css";
import { ArrowLeft, Image as ImageIcon, FileWarning, Maximize, X } from "lucide-react";

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
  const [albumTitle, setAlbumTitle] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedPhoto, setSelectedPhoto] = useState<Photo | null>(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [albumRes, photosRes] = await Promise.all([
        api.get(`/albums/${id}`),
        api.get(`/albums/${id}/photos`),
      ]);
      setAlbumTitle(albumRes.data.title);
      setPhotos(photosRes.data);
    } catch {
      setError("Não foi possível carregar o álbum.");
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const openModal = (photo: Photo) => setSelectedPhoto(photo);
  const closeModal = () => setSelectedPhoto(null);

  if (loading) return <Loader fullPage text="Carregando álbum..." />;

  if (error) {
    return (
      <div className={styles.container}>
        <div className={styles.errorState}>
          <FileWarning size={48} className={styles.errorIcon} />
          <h2 className={styles.errorTitle}>{error}</h2>
          <Button variant="secondary" onClick={() => navigate('/albums')}>
            <ArrowLeft size={16} /> Voltar para Álbuns
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <Button variant="secondary" size="sm" onClick={() => navigate("/albums")}>
          <ArrowLeft size={16} />
          Voltar para Álbuns
        </Button>
        <div>
          <h1 className={styles.title}>{albumTitle}</h1>
          <p className={styles.subtitle}>
            {photos.length} foto(s) neste álbum
          </p>
        </div>
      </header>

      {photos.length === 0 ? (
        <div className={styles.emptyState}>
          <ImageIcon size={48} className={styles.emptyIcon} />
          <h2 className={styles.emptyTitle}>Álbum Vazio</h2>
          <p className={styles.emptyText}>Não há fotos para exibir aqui.</p>
        </div>
      ) : (
        <div className={styles.grid}>
          {photos.map((photo, index) => (
            <div
              key={photo.id}
              className={styles.card}
              style={{ animationDelay: `${index * 50}ms` }}
              onClick={() => openModal(photo)}
              onKeyDown={(e) => e.key === 'Enter' && openModal(photo)}
              tabIndex={0}
              role="button"
              aria-label={`Ver foto: ${photo.title}`}
            >
              <img src={photo.thumbnailUrl} alt={photo.title} className={styles.image} loading="lazy" />
              <div className={styles.overlay}>
                <p className={styles.photoTitle}>{photo.title}</p>
                <div className={styles.viewButton}>
                  <Maximize size={20} />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {selectedPhoto && (
        <div className={styles.modal} onClick={closeModal} role="dialog" aria-modal="true">
          <button className={styles.closeButton} onClick={closeModal} aria-label="Fechar">
            <X size={24} />
          </button>
          <img
            src={selectedPhoto.url}
            alt={selectedPhoto.title}
            className={styles.modalImage}
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}
    </div>
  );
}