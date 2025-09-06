import { Link, useNavigate } from "react-router-dom";
import { useAuthStore } from "../store/useAuthStore";
import styles from "../styles/components/Header.module.css";

export default function Header() {
  const logout = useAuthStore((state) => state.logout);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <header className={styles.header}>
      <nav>
        <ul className={styles.navList}>
          <li><Link to="/posts">Posts</Link></li>
          <li><Link to="/albums">Álbuns</Link></li>
          <li><Link to="/admin">Admin</Link></li>
          <li>
            <button onClick={handleLogout} className={styles.logoutButton}>
              Logout
            </button>
          </li>
        </ul>
      </nav>
    </header>
  );
}