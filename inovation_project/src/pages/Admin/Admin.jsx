import { useState } from "react";
import styles from "./Admin.module.css";
import AdminAvisos from "../../components/AdminAvisos/AdminAvisos";
import AdminLivros from "../../components/AdminLivros/AdminLivros";
import AdminAchados from "../../components/AdminAchados/AdminAchados";
import AdminEmprestimos from "../../components/AdminEmprestimos/AdminEmprestimos";
import AdminTalentos from "../../components/AdminTalentos/AdminTalentos";

const TABS = [
  { id: "avisos",      label: "📋 Avisos"            },
  { id: "livros",      label: "📚 Livros"             },
  { id: "achados",     label: "🔍 Achados e Perdidos" },
  { id: "emprestimos", label: "📖 Empréstimos"        },
  { id: "talentos",    label: "🌟 Talentos"           },
];

export default function Admin({ onLogout }) {
  const [tab, setTab] = useState("avisos");

  const handleLogout = () => {
    sessionStorage.removeItem("admin");
    onLogout();
  };

  return (
    <div className={styles.adminLayout}>

      <header className={styles.header}>
        <div className={styles.headerLeft}>
          <div className={styles.headerIcon}>⚙️</div>
          <span className={styles.headerTitle}>Painel Administrativo</span>
        </div>
        <button className={styles.btnLogout} onClick={handleLogout}>
          Sair
        </button>
      </header>

      <div className={styles.tabsBar}>
        {TABS.map((t) => (
          <button
            key={t.id}
            className={`${styles.tab} ${tab === t.id ? styles.activeTab : ""}`}
            onClick={() => setTab(t.id)}
          >
            {t.label}
          </button>
        ))}
      </div>

      <div className={styles.body}>
        <div className={styles.contentCard}>
          {tab === "avisos" && <AdminAvisos />}
          {tab === "livros" && <AdminLivros />}
          {tab === "achados" && <AdminAchados />}
          {tab === "emprestimos" && <AdminEmprestimos />}
          {tab === "talentos" && <AdminTalentos />}
        </div>
      </div>

    </div>
  );
}