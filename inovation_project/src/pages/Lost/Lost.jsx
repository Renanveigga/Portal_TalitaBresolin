import { useState, useEffect } from "react";
import { GeoAlt, Clock } from "react-bootstrap-icons";
import styles from "./Lost.module.css";
import { getAchados } from "../../services/achadosService";
import { Search } from "react-bootstrap-icons"; 

const API_URL = "http://localhost:3000";

export default function Lost() {
  const [achados, setAchados]   = useState([]);
  const [loading, setLoading]   = useState(true);
  const [filtro, setFiltro]     = useState("todos");

  useEffect(() => {
    getAchados()
      .then((res) => {
 
        const listaAchados = res.data?.dados || res.data || [];
        setAchados(listaAchados);
      })
      .catch(err => console.error("Erro ao carregar achados:", err))
      .finally(() => setLoading(false));
  }, []);
 
  const listaSegura = Array.isArray(achados) ? achados : [];

  const filtered = listaSegura.filter((a) => {
    if (filtro === "pendente")  return !a.retirado;
    if (filtro === "retirado")  return a.retirado;
    return true;
  });

  return (
    <div>
      <div className={styles.pageHeader}>
        <div>
          <h2 className="page-title"><Search style={{ fontSize: "14px" }}/> Achados e Perdidos</h2>
          <p className="page-subtitle">
            Perdeu algo? Encontre seu item e dirija-se à sala indicada.
          </p>
        </div>
        <div className={styles.headerStats}>
          <div className={styles.headerStat}>
            <span className={styles.headerStatNum}>
              {listaSegura.filter((a) => !a.retirado).length}
            </span>
            <span className={styles.headerStatLabel}>Aguardando</span>
          </div>
          <div className={styles.headerStat}>
            <span className={styles.headerStatNum}>
              {listaSegura.filter((a) => a.retirado).length}
            </span>
            <span className={styles.headerStatLabel}>Retirados</span>
          </div>
        </div>
      </div>

      <div className={styles.filtros}>
        {[
          { value: "todos",    label: "Todos"       },
          { value: "pendente", label: "🔴 Aguardando"},
          { value: "retirado", label: "🟢 Retirados" },
        ].map((f) => (
          <button
            key={f.value}
            className={`${styles.filtroBtn} ${filtro === f.value ? styles.filtroBtnActive : ""}`}
            onClick={() => setFiltro(f.value)}
          >
            {f.label}
          </button>
        ))}
      </div>

      {loading && <p className="page-subtitle">Carregando...</p>}

      <div className={styles.grid}>
        {filtered.map((item) => (
          <div
            key={item.id}
            className={`${styles.card} ${item.retirado ? styles.cardRetirado : ""}`}
          >

            <div className={styles.cardImg}>
              {item.foto_url ? (
                <img
                  src={`${API_URL}${item.foto_url}`}
                  alt={item.descricao}
                  className={styles.foto}
                />
              ) : (
                <div className={styles.semFoto}>
                  <span className={styles.semFotoIcon}>📦</span>
                </div>
              )}

              <span className={`${styles.statusBadge} ${item.retirado ? styles.badgeRetirado : styles.badgePendente}`}>
                {item.retirado ? "✓ Retirado" : "● Aguardando"}
              </span>
            </div>

            <div className={styles.cardBody}>
              <p className={styles.cardTitulo}>{item.descricao}</p>
              <div className={styles.cardMeta}>
                <span className={styles.metaItem}>
                  <GeoAlt size={11} />
                  {item.sala || "Não informada"}
                </span>
                <span className={styles.metaItem}>
                  <Clock size={11} />
 
                  {(item.encontrado_em || item.criado_em || "").slice(0, 10)}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filtered.length === 0 && !loading && (
        <p className={styles.empty}>Nenhum item encontrado.</p>
      )}
    </div>
  );
}