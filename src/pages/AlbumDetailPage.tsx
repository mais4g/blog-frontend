import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { api } from "../api/api";
import Loader from "../components/Loader";
import styles from "../styles/pages/AlbumDetailPage.module.css";

interface Photo {
  id: number;
  title: string;
  thumbnailUrl: string;
  url: string;
}

export default function AlbumDetailPage() {
  const { id } = useParams();
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPhotos = async () => {
      setError(null);
      try {
        const res = await api.get(`/albums/${id}/photos`);
        setPhotos(res.data);
      } catch {
        setError("Erro ao carregar fotos.");
      } finally {
        setLoading(false);
      }
    };
    fetchPhotos();
  }, [id]);

  if (loading) return <Loader />;
  if (error) return <p className={styles.error}>{error}</p>;

  return (
    <main className={styles.container}>
      <h1 className={styles.title}>📷 Fotos do Álbum {id}</h1>
      <Link to="/albums" className={styles.backButton}>
        Voltar para Álbuns
      </Link>

      <div className={styles.grid}>
        {photos.map((photo) => (
          <div key={photo.id} className={styles.card}>
            <img src={photo.thumbnailUrl} alt={photo.title} className={styles.image} />
            <div className={styles.info}>
              <p className={styles.photoTitle}>{photo.title}</p>
              <a href={photo.url} target="_blank" rel="noopener noreferrer" className={styles.link}>
                Ver em tamanho real
              </a>
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}