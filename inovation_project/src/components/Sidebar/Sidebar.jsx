import styles from "./Sidebar.module.css";
import { NAV_ITEMS } from "../../data/mockData";

export default function Sidebar({ currentPage, onNavigate }) {
  return (
    <aside className={styles.sidebar}>

      {/* Logo */}
      <div className={styles.logo}>
        <div className={styles.logoIcon}>🏫</div>
        <p className={styles.logoTitle}>Portal Escolar</p>
        <p className={styles.logoSub}>Colégio Estadual</p>
      </div>

      {/* Nav */}
      <nav className={styles.nav}>
        {NAV_ITEMS.map((item) => (
          <button
            key={item.id}
            className={`${styles.navBtn} ${currentPage === item.id ? styles.active : ""}`}
            onClick={() => onNavigate(item.id)}
          >
            <span className={styles.navIcon}>{item.icon}</span>
            {item.label}
          </button>
        ))}
      </nav>

      {/* Footer */}
      <div className={styles.footer}>
        Desenvolvido por alunos<br />
        1º e 3º ADM · 1º TI
      </div>

    </aside>
  );
}