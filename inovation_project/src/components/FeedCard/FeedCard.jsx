import { useNavigate } from "react-router-dom";
import styles from "./FeedCard.module.css";

const API_URL = "http://localhost:3000";

const TIPO_COLORS = {
  evento:   "#2E86C1",
  prova:    "#C0392B",
  feriado:  "#8E44AD",
  palestra: "#1E8449",
};

const ROTAS = {
  aviso:   "/",
  livro:   "/biblioteca",
  achado:  "/achados",
  talento: "/talentos",
};

function timeAgo(date) {
  const diff = Math.floor((Date.now() - new Date(date)) / 1000);
  if (diff < 60)     return "agora mesmo";
  if (diff < 3600)   return `${Math.floor(diff / 60)}min atrás`;
  if (diff < 86400)  return `${Math.floor(diff / 3600)}h atrás`;
  return `${Math.floor(diff / 86400)}d atrás`;
}

function getInitials(nome = "") {
  const p = nome.split(" ");
  return (p[0]?.[0] ?? "") + (p[1]?.[0] ?? "");
}

export default function FeedCard({ item }) {
  const navigate = useNavigate();

  const handleClick = () => navigate(ROTAS[item.tipo_feed] ?? "/");

  return (
    <div className={styles.card} onClick={handleClick}>

      {item.tipo_feed === "aviso" && (
        <>
          <div className={styles.cardLeft}>
            <div className={styles.iconBox}
              style={{ background: TIPO_COLORS[item.tipo] + "22", color: TIPO_COLORS[item.tipo] }}>
              {item.tipo === "evento"   ? "🎉" :
               item.tipo === "prova"    ? "📝" :
               item.tipo === "feriado"  ? "🗓️" : "🎤"}
            </div>
          </div>
          <div className={styles.cardContent}>
            <div className={styles.cardMeta}>
              <span className={styles.badge}
                style={{ background: TIPO_COLORS[item.tipo], color: "#fff" }}>
                {item.tipo}
              </span>
              <span className={styles.time}>{timeAgo(item.criado_em)}</span>
            </div>
            <p className={styles.cardTitle}>{item.titulo}</p>
            {item.descricao && <p className={styles.cardDesc}>{item.descricao}</p>}
            {item.data && <p className={styles.cardSub}>📅 {item.data?.slice(0, 10)}</p>}
          </div>
        </>
      )}

      {item.tipo_feed === "livro" && (
        <>
          <div className={styles.cardLeft}>
            <div className={styles.iconBox} style={{ background: "#EBF5FB", color: "#2E86C1" }}>
              📚
            </div>
          </div>
          <div className={styles.cardContent}>
            <div className={styles.cardMeta}>
              <span className={`${styles.badge} ${Boolean(item.disponivel) ? styles.badgeDisp : styles.badgeEmp}`}>
                {Boolean(item.disponivel) ? "Disponível" : "Emprestado"}
              </span>
              <span className={styles.time}>{timeAgo(item.criado_em)}</span>
            </div>
            <p className={styles.cardTitle}>{item.titulo}</p>
            <p className={styles.cardSub}>{item.autor} · {item.categoria}</p>
          </div>
        </>
      )}

      {item.tipo_feed === "achado" && (
        <>
          <div className={styles.cardLeft}>
            {item.foto_url ? (
              <img src={`${API_URL}${item.foto_url}`} alt={item.titulo}
                className={styles.foto} />
            ) : (
              <div className={styles.iconBox} style={{ background: "#FEF9E7", color: "#F39C12" }}>
                🔍
              </div>
            )}
          </div>
          <div className={styles.cardContent}>
            <div className={styles.cardMeta}>
              <span className={`${styles.badge} ${styles.badgePendente}`}>Aguardando</span>
              <span className={styles.time}>{timeAgo(item.criado_em)}</span>
            </div>
            <p className={styles.cardTitle}>{item.titulo}</p>
            <p className={styles.cardSub}>📍 {item.sala}</p>
          </div>
        </>
      )}

      {item.tipo_feed === "talento" && (
        <>
          <div className={styles.cardLeft}>
            {item.foto_url ? (
              <img src={`${API_URL}${item.foto_url}`} alt={item.titulo}
                className={styles.foto} />
            ) : (
              <div className={`${styles.avatarBox} ${item.curso === "TI" ? styles.avatarTI : styles.avatarADM}`}>
                {getInitials(item.titulo)}
              </div>
            )}
          </div>
          <div className={styles.cardContent}>
            <div className={styles.cardMeta}>
              <span className={`${styles.badge} ${item.curso === "TI" ? styles.badgeTI : styles.badgeADM}`}>
                {item.curso}
              </span>
              <span className={styles.time}>{timeAgo(item.criado_em)}</span>
            </div>
            <p className={styles.cardTitle}>{item.titulo}</p>
            <p className={styles.cardSub}>
              {item.habilidades?.split(",").slice(0, 2).join(", ")}
            </p>
          </div>
        </>
      )}

      <span className={styles.cardArrow}>→</span>
    </div>
  );
}