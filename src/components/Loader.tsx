import styles from "../styles/components/Loader.module.css";

export default function Loader() {
  return <div className={styles.loader} role="status" aria-label="Carregando"></div>;
}