import { useState } from "react";
import styles from "./Admin.module.css";
import { 
  Clipboard, 
  Book, 
  Search, 
  JournalBookmark, 
  Star, 
  Trophy, 
  Gear,
  BoxArrowRight 
} from "react-bootstrap-icons";

import AdminAvisos from "../../components/AdminAvisos/AdminAvisos";
import AdminLivros from "../../components/AdminLivros/AdminLivros";
import AdminAchados from "../../components/AdminAchados/AdminAchados";
import AdminEmprestimos from "../../components/AdminEmprestimos/AdminEmprestimos";
import AdminTalentos from "../../components/AdminTalentos/AdminTalentos";
import AdminEsportes from "../../components/AdminEsportes/AdminEsportes";

const TABS = [
  { id: "avisos", label: "Avisos", icon: Clipboard },
  { id: "livros", label: "Livros", icon: Book },
  { id: "achados", label: "Achados e Perdidos", icon: Search },
  { id: "emprestimos", label: "Empréstimos", icon: JournalBookmark },
  { id: "talentos", label: "Talentos", icon: Star },
  { id: "esportes", label: "Esportes", icon: Trophy },
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
          <div className={styles.headerIcon}>
            <Gear size={20} />
          </div>
          <span className={styles.headerTitle}>Painel Administrativo</span>
        </div>
        <button className={styles.btnLogout} onClick={handleLogout} style={{ display: 'flex', alignItems: 'center' }}>
          <BoxArrowRight size={15} style={{  marginRight: '8px' }} />
          Sair
        </button>
      </header>

      <div className={styles.tabsBar}>
        {TABS.map((t) => {
          const IconComponent = t.icon;  
          return (
            <button
              key={t.id}
              className={`${styles.tab} ${tab === t.id ? styles.activeTab : ""}`}
              onClick={() => setTab(t.id)}
            >
              <IconComponent size={18} style={{ marginRight: '8px' }} />
              {t.label}
            </button>
          );
        })}
      </div>

      <div className={styles.body}>
        <div className={styles.contentCard}>
          {tab === "avisos" && <AdminAvisos />}
          {tab === "livros" && <AdminLivros />}
          {tab === "achados" && <AdminAchados />}
          {tab === "emprestimos" && <AdminEmprestimos />}
          {tab === "talentos" && <AdminTalentos />}
          {tab === "esportes" && <AdminEsportes />}
        </div>
      </div>
    </div>
  );
}