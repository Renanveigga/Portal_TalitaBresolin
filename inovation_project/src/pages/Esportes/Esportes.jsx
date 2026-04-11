import { useState, useEffect } from "react";
import { Trophy, Calendar2 } from 'react-bootstrap-icons';
import styles from "./Esportes.module.css";
import { getEsportes } from "../../services/esportesService";
import { TrophyFill } from "react-bootstrap-icons";

const API_URL = "http://localhost:3000";

const MEDALHA_CONFIG = {
  ouro:         { label: "🥇 Ouro",         cor: "#F1C40F", bg: "#FEF9E7" },
  prata:        { label: "🥈 Prata",        cor: "#95A5A6", bg: "#F2F3F4" },
  bronze:       { label: "🥉 Bronze",       cor: "#E67E22", bg: "#FDEBD0" },
  participacao: { label: "🏅 Participação", cor: "#3498DB", bg: "#EBF5FB" },
};

const MODALIDADE_ICONS = {
  "Futsal":    "⚽",
  "Vôlei":     "🏐",
  "Atletismo": "🏃",
  "Natação":   "🏊",
  "Basquete":  "🏀",
  "Handebol":  "🤾",
};

export default function Esportes() {
  const [esportes, setEsportes]   = useState([]);
  const [loading, setLoading]     = useState(true);
  const [filtroMed, setFiltroMed] = useState("");

  useEffect(() => {
    getEsportes()
      .then((r) => {
 
        const listaEsportes = r.data?.dados || r.data || [];
        setEsportes(listaEsportes);
      })
      .catch(err => console.error("Erro ao carregar esportes:", err))
      .finally(() => setLoading(false));
  }, []);
 
  const listaSegura = Array.isArray(esportes) ? esportes : [];

  const filtered = filtroMed
    ? listaSegura.filter((e) => e.medalha === filtroMed)
    : listaSegura;

  return (
    <div>
      <div className={styles.pageHeader}>
        <div>
          <h2 className="page-title"><TrophyFill style={{ fontSize: "14px" }} /> Esportes</h2>
          <p className="page-subtitle">
            Conquistas, campeonatos e eventos esportivos do colégio.
          </p>
        </div>
        <div className={styles.headerStats}>
          <div className={styles.headerStat}>
            <span className={styles.headerStatNum}>
              {listaSegura.filter((e) => e.medalha === "ouro").length}
            </span>
            <span className={styles.headerStatLabel}>🥇 Ouros</span>
          </div>
          <div className={styles.headerStat}>
            <span className={styles.headerStatNum}>
              {listaSegura.filter((e) => e.medalha === "prata").length}
            </span>
            <span className={styles.headerStatLabel}>🥈 Pratas</span>
          </div>
          <div className={styles.headerStat}>
            <span className={styles.headerStatNum}>
              {listaSegura.filter((e) => e.medalha === "bronze").length}
            </span>
            <span className={styles.headerStatLabel}>🥉 Bronzes</span>
          </div>
        </div>
      </div>

      <div className={styles.filtros}>
        {[
          { value: "",             label: "Todos"           },
          { value: "ouro",         label: "🥇 Ouro"        },
          { value: "prata",        label: "🥈 Prata"       },
          { value: "bronze",       label: "🥉 Bronze"      },
          { value: "participacao", label: "🏅 Participação" },
        ].map((f) => (
          <button
            key={f.value}
            className={`${styles.filtroBtn} ${filtroMed === f.value ? styles.filtroBtnActive : ""}`}
            onClick={() => setFiltroMed(f.value)}
          >
            {f.label}
          </button>
        ))}
      </div>

      {loading && <p className="page-subtitle">Carregando...</p>}

      <div className={styles.grid}>
        {filtered.map((e) => {
          const med = MEDALHA_CONFIG[e.medalha] ?? MEDALHA_CONFIG.participacao;
          const icon = MODALIDADE_ICONS[e.modalidade] ?? "🏅";
          return (
            <div key={e.id} className={styles.card}>
              <div className={styles.cardImg}>
                {e.foto_url ? (
                  <img src={`${API_URL}${e.foto_url}`} alt={e.titulo} className={styles.foto} />
                ) : (
                  <div className={styles.semFoto} style={{ background: med.bg }}>
                    <span className={styles.semFotoIcon}>{icon}</span>
                  </div>
                )}

                <span className={styles.medalBadge} style={{ background: med.cor }}>
                  {med.label}
                </span>
              </div>

              <div className={styles.cardBody}>
                <div className={styles.cardMeta}>
                  <span className={styles.modalidade}>
                    {icon} {e.modalidade}
                  </span>
                  <span className={styles.data}>
                    <Calendar2 size={11} />
                    {e.data_evento?.slice(0, 10) || "Data indefinida"}
                  </span>
                </div>
                <p className={styles.cardTitulo}>{e.titulo}</p>
                {e.resumo && <p className={styles.cardResumo}>{e.resumo}</p>}
              </div>
            </div>
          );
        })}
      </div>

      {filtered.length === 0 && !loading && (
        <div className={styles.empty}>
          <Trophy size={40} color="#ccc" />
          <p>Nenhum evento encontrado.</p>
        </div>
      )}
    </div>
  );
}