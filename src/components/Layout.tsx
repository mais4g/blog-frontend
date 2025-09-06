import { Outlet } from "react-router-dom";
import Header from "./Header";
import styles from "../styles/components/Layout.module.css";

export default function Layout() {
  return (
    <div className={styles.layout} data-theme="auto">
      <Header />
      <main className={styles.main} role="main">
        <div className={styles.container}>
          <div className={styles.content}>
            <Outlet />
          </div>
        </div>
      </main>
    </div>
  );
}