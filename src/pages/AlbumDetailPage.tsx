import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { api } from "../api/api";
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

  useEffect(() => {
    api.get(`/albums/${id}/photos`).then((res) => {
      setPhotos(res.data);
      setLoading(false);
    });
  }, [id]);

  if (loading) return <p className={styles.loading}>Carregando fotos...</p>;

  return (
    <main className={styles.container}>
      <h1 className={styles.title}>📷 Fotos do Álbum {id}</h1>
      <Link to="/albums" className={styles.backButton} aria-label="Voltar para lista de álbuns">
        Voltar para Álbuns
      </Link>

      <div className={styles.grid} role="list">
        {photos.map((photo) => (
          <div key={photo.id} className={styles.card} role="listitem">
            <img
              src={photo.thumbnailUrl}
              alt={photo.title}
              className={styles.image}
            />
            <div className={styles.info}>
              <p className={styles.photoTitle}>{photo.title}</p>
              <a
                href={photo.url}
                target="_blank"
                rel="noopener noreferrer"
                className={styles.link}
                aria-label={`Abrir foto ${photo.title} em tamanho real`}
              >
                Ver em tamanho real
              </a>
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}