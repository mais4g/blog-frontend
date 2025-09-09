import { Outlet } from "react-router-dom";
import Header from "./Header";
import styles from "../styles/components/Layout.module.css";

export default function Layout() {
  return (
    <div className={styles.layout}>
      <Header />
      <main className={styles.main}>
        {/* O Outlet renderiza o componente da rota ativa aqui */}
        <Outlet />
      </main>
    </div>
  );
}