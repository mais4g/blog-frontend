import styles from "../styles/components/Loader.module.css";

interface LoaderProps {
  size?: 'sm' | 'md' | 'lg';
  text?: string;
  fullPage?: boolean;
}

export default function Loader({ size = 'md', text = 'Carregando...', fullPage = false }: LoaderProps) {
  const LoaderContent = () => (
    <div className={`${styles.loader} ${styles[size]}`} role="status" aria-live="polite">
      <div className={styles.spinner} aria-hidden="true">
        <svg viewBox="0 0 50 50" className={styles.circular}>
          <circle
            className={styles.path}
            cx="25"
            cy="25"
            r="20"
            fill="none"
            strokeWidth="5"
          />
        </svg>
      </div>
      {text && <p className={styles.text}>{text}</p>}
    </div>
  );

  if (fullPage) {
    return (
      <div className={styles.fullPageLoader} role="status" aria-live="polite">
        <LoaderContent />
      </div>
    );
  }

  return <LoaderContent />;
}