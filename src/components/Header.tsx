import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuthStore } from "../store/useAuthStore";
import { LayoutDashboard, Newspaper, Image, UserCog, LogOut, Menu, X, Sparkles } from "lucide-react";
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
    { path: "/posts", label: "Posts", icon: <Newspaper size={18} /> },
    { path: "/albums", label: "Álbuns", icon: <Image size={18} /> },
    { path: "/admin", label: "Admin", icon: <UserCog size={18} /> }
  ];

  const NavLink = ({ path, label, icon }: { path: string, label: string, icon: React.ReactNode }) => (
    <Link
      to={path}
      className={`${styles.navLink} ${location.pathname.startsWith(path) ? styles.active : ''}`}
      aria-current={location.pathname.startsWith(path) ? 'page' : undefined}
      onClick={() => setIsMenuOpen(false)}
    >
      {icon}
      {label}
    </Link>
  );

  return (
    <header className={styles.header} role="banner">
      <div className={styles.container}>
        <Link to="/posts" className={styles.logo} aria-label="Ir para a página de posts">
          <div className={styles.logoIcon}>
            <Sparkles size={20} />
          </div>
          <span className={styles.logoText}>BlogFrontend</span>
        </Link>

        <nav className={styles.nav} role="navigation" aria-label="Navegação principal">
          <ul className={styles.navList} role="list">
            {navItems.map((item) => (
              <li key={item.path}><NavLink {...item} /></li>
            ))}
          </ul>
        </nav>

        <div className={styles.userSection}>
          <button onClick={handleLogout} className={styles.logoutButton} aria-label="Sair da conta">
            <LogOut size={18} />
            <span className={styles.logoutText}>Sair</span>
          </button>
        </div>

        <button
          className={styles.mobileMenuButton}
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          aria-expanded={isMenuOpen}
          aria-label="Abrir menu de navegação"
          aria-controls="mobile-menu"
        >
          {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {isMenuOpen && (
        <div id="mobile-menu" className={styles.mobileMenu}>
          <nav>
            <ul className={styles.mobileNavList} role="list">
              {navItems.map((item) => (
                <li key={item.path}><NavLink {...item} /></li>
              ))}
            </ul>
          </nav>
        </div>
      )}
    </header>
  );
}