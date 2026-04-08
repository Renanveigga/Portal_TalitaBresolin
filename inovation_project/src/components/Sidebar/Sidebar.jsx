import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { Sun, MoonStars, List, X } from "react-bootstrap-icons";
import styles from "./Sidebar.module.css";
import { NAV_ITEMS } from "../../data/mockData";

const ROUTE_MAP = {
  home:    "/",
  library: "/biblioteca",
  lost:    "/achados",
  courses: "/cursos",
  history: "/historia",
  talentos:"/talentos",
  esportes:"/esportes",
  admin:   "/admin",
};

export default function Sidebar({ onNavigate, dark, toggleTheme }) {
  const location = useLocation();
  const [aberta, setAberta] = useState(false);

  useEffect(() => { setAberta(false); }, [location.pathname]);

  useEffect(() => {
    document.body.style.overflow = aberta ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [aberta]);

  const isActive = (id) => {
    const route = ROUTE_MAP[id];
    if (id === "home") return location.pathname === "/";
    return location.pathname.startsWith(route);
  };

  const handleNav = (id) => {
    onNavigate(id);
    setAberta(false);
  };

  return (
    <>
      <button className={styles.hamburger} onClick={() => setAberta((p) => !p)} aria-label="Menu">
        {aberta ? <X size={22} /> : <List size={22} />}
      </button>

      {aberta && <div className={styles.overlay} onClick={() => setAberta(false)} />}

      <aside className={`${styles.sidebar} ${aberta ? styles.sidebarAberta : ""}`}>

        <div className={styles.logo}>
          <div className={styles.logoIcon}>校</div>
          <div style={{ flex: 1 }}>
            <p className={styles.logoTitle}>Portal Escolar</p>
            <p className={styles.logoSub}>Colégio Estadual</p>
          </div>
          <button className={styles.closeBtn} onClick={() => setAberta(false)} aria-label="Fechar">
            <X size={20} />
          </button>
        </div>

        <nav className={styles.nav}>
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                className={`${styles.navBtn} ${isActive(item.id) ? styles.active : ""}`}
                onClick={() => handleNav(item.id)}
              >
                <span className={styles.navIcon}>
                  {Icon && <Icon size={18} />}
                </span>
                {item.label}
              </button>
            );
          })}
        </nav>

        <div className={styles.themeToggle}>
          <span className={styles.themeLabel}>
            {dark ? <><Sun size={15} style={{marginRight:6}} /> Modo Claro</> : <><MoonStars size={15} style={{marginRight:6}} /> Modo Escuro</>}
          </span>
          <button className={`${styles.toggleBtn} ${dark ? styles.toggleDark : ""}`} onClick={toggleTheme}>
            <div className={styles.toggleThumb} />
          </button>
        </div>

        <div className={styles.footer}>
          Desenvolvido por alunos<br />1º e 3º ADM · 1º TI
        </div>
      </aside>
    </>
  );
}