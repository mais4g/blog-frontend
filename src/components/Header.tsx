import { Link } from "react-router-dom";
import styles from "../styles/components/Header.module.css";

export default function Header() {
  return (
    <header className={styles.header}>
      <nav>
        <ul className={styles.navList}>
          <li><Link to="/posts">Posts</Link></li>
          <li><Link to="/albums">Álbuns</Link></li>
          <li><Link to="/admin">Admin</Link></li>
          <li><Link to="/">Logout</Link></li>
        </ul>
      </nav>
    </header>
  );
}