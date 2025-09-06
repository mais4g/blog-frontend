import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuthStore } from "../store/useAuthStore";
import styles from "../styles/components/Header.module.css";

export default function Header() {
  const logout = useAuthStore((state) => state.logout);
  const navigate = useNavigate();
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const navItems = [
    { path: "/posts", label: "Posts", icon: "📝" },
    { path: "/albums", label: "Álbuns", icon: "🖼️" },
    { path: "/admin", label: "Admin", icon: "⚙️" }
  ];

  return (
    <header className={styles.header} role="banner">
      <div className={styles.container}>
        <Link to="/posts" className={styles.logo} aria-label="Ir para página inicial">
          <div className={styles.logoIcon}>✨</div>
          <span className={styles.logoText}>Meu App</span>
        </Link>

        <nav className={styles.nav} role="navigation" aria-label="Navegação principal">
          <ul className={styles.navList} role="list">
            {navItems.map((item) => (
              <li key={item.path}>
                <Link
                  to={item.path}
                  className={`${styles.navLink} ${location.pathname === item.path ? styles.active : ''}`}
                  aria-current={location.pathname === item.path ? 'page' : undefined}
                >
                  <span aria-hidden="true">{item.icon}</span>
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className={styles.userSection}>
          <button
            onClick={handleLogout}
            className={styles.logoutButton}
            aria-label="Sair da conta"
            title="Sair"
          >
            <span aria-hidden="true">🚪</span>
            <span className={styles.logoutText}>Sair</span>
          </button>
        </div>

        <button
          className={styles.mobileMenuButton}
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          aria-expanded={isMenuOpen}
          aria-label="Menu mobile"
          aria-controls="mobile-menu"
        >
          <span className={styles.hamburger}></span>
        </button>
      </div>

      {isMenuOpen && (
        <div id="mobile-menu" className={styles.mobileMenu}>
          <nav className={styles.mobileNav}>
            <ul className={styles.mobileNavList} role="list">
              {navItems.map((item) => (
                <li key={item.path}>
                  <Link
                    to={item.path}
                    className={`${styles.mobileNavLink} ${location.pathname === item.path ? styles.active : ''}`}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <span aria-hidden="true">{item.icon}</span>
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
            <button
              onClick={() => {
                handleLogout();
                setIsMenuOpen(false);
              }}
              className={styles.mobileLogoutButton}
            >
              <span aria-hidden="true">🚪</span>
              Sair
            </button>
          </nav>
        </div>
      )}
    </header>
  );
}