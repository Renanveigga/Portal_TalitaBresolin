import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Heart, HeartFill, Share, BoxArrowUpRight,
  Trophy, Search, Book, Megaphone, GeoAlt
} from "react-bootstrap-icons";
import styles from "./FeedCard.module.css";
 
const BASE_URL = "https://portal-talitabresolin.onrender.com";

const TIPO_COLORS = {
  evento:   "#2E86C1",
  prova:    "#C0392B",
  feriado:  "#8E44AD",
  palestra: "#1E8449",
};

const FONTE_CONFIG = {
  aviso:   { label: "Coordenação",        icon: <Megaphone size={14} />,  cor: "#8E44AD" },
  livro:   { label: "Biblioteca",        icon: <Book size={14} />,       cor: "#2E86C1" },
  achado:  { label: "Achados & Perdidos",icon: <Search size={14} />,     cor: "#E67E22" },
  talento: { label: "Banco de Talentos", icon: "🌟",                     cor: "#27AE60" },
  esporte: { label: "Esportes",          icon: <Trophy size={14} />,     cor: "#F1C40F" },
};

const ROTAS = {
  aviso:   "/",
  livro:   "/biblioteca",
  achado:  "/achados",
  talento: "/talentos",
  esporte: "/esportes",
};

const MEDALHA_EMOJI = {
  ouro: "🥇", prata: "🥈", bronze: "🥉", participacao: "🏅",
};

function timeAgo(date) {
  const diff = Math.floor((Date.now() - new Date(date)) / 1000);
  if (diff < 60)    return "agora mesmo";
  if (diff < 3600)  return `${Math.floor(diff / 60)}min`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h`;
  return `${Math.floor(diff / 86400)}d`;
}

function getInitials(nome = "") {
  const p = nome.split(" ");
  return (p[0]?.[0] ?? "") + (p[1]?.[0] ?? "");
}
 
function formatImageUrl(url) {
  if (!url) return null;
  
  if (url.includes("localhost:3000")) {
    return url.replace("http://localhost:3000", BASE_URL);
  }
  
  if (url.startsWith("http://") || url.startsWith("https://")) {
    return url;
  }
 
  return `${BASE_URL}${url.startsWith("/") ? "" : "/"}${url}`;
}

export default function FeedCard({ item }) {
  const navigate = useNavigate();
  const [liked, setLiked]     = useState(false);
  const [likes, setLikes]     = useState(Math.floor(Math.random() * 30) + 1);
  const fonte = FONTE_CONFIG[item.tipo_feed] ?? FONTE_CONFIG.aviso;

  const handleLike = (e) => {
    e.stopPropagation();
    setLiked((p) => !p);
    setLikes((p) => (liked ? p - 1 : p + 1));
  };

  const handleShare = (e) => {
    e.stopPropagation();
    navigator.clipboard?.writeText(window.location.origin + ROTAS[item.tipo_feed]);
  };

  const fotoUrlFormatada = formatImageUrl(item.foto_url);

  return (
    <div className={styles.post}>

      <div className={styles.postHeader}>
        <div className={styles.postAvatar} style={{ background: fonte.cor + "22", color: fonte.cor }}>
          {typeof fonte.icon === "string" ? fonte.icon : fonte.icon}
        </div>
        <div className={styles.postHeaderInfo}>
          <p className={styles.postFonte}>{fonte.label}</p>
          <p className={styles.postTime}>{timeAgo(item.criado_em)}</p>
        </div>
        {item.tipo_feed === "aviso" && item.tipo && (
          <span className={styles.postTipoBadge}
            style={{ background: TIPO_COLORS[item.tipo] + "22", color: TIPO_COLORS[item.tipo] }}>
            {item.tipo}
          </span>
        )}
        {item.tipo_feed === "esporte" && item.medalha && (
          <span className={styles.postTipoBadge} style={{ background: "#FEF9E7", color: "#F39C12" }}>
            {MEDALHA_EMOJI[item.medalha]} {item.medalha}
          </span>
        )}
        {item.tipo_feed === "talento" && item.curso && (
          <span className={styles.postTipoBadge}
            style={{ background: item.curso === "TI" ? "#EBF5FB" : "#FEF9E7",
                     color:      item.curso === "TI" ? "#2E86C1" : "#F39C12" }}>
            {item.curso === "TI" ? "💻" : "📊"} {item.curso}
          </span>
        )}
      </div>

      {fotoUrlFormatada && (
        <div className={styles.postImage}>
          <img src={fotoUrlFormatada} alt={item.titulo} className={styles.postImg} />
        </div>
      )}

      {!fotoUrlFormatada && (
        <div className={styles.postBody}
          style={{ background: fonte.cor + "11", borderLeft: `3px solid ${fonte.cor}` }}>
          {item.tipo_feed === "talento" ? (
            <div className={styles.postTalentoBody}>
              <div className={styles.postTalentoAvatar}
                style={{ background: item.curso === "TI"
                  ? "linear-gradient(135deg,#1B4F72,#2E86C1)"
                  : "linear-gradient(135deg,#7D6608,#F39C12)" }}>
                {getInitials(item.titulo)}
              </div>
              <div>
                <p className={styles.postTalentoNome}>{item.titulo}</p>
                <p className={styles.postTalentoHabs}>
                  {item.habilidades?.split(",").slice(0, 3).join(" · ")}
                </p>
              </div>
            </div>
          ) : item.tipo_feed === "livro" ? (
            <div className={styles.postLivroBody}>
              <span className={styles.postLivroIcon}>📚</span>
              <div>
                <p className={styles.postLivroTitulo}>{item.titulo}</p>
                <p className={styles.postLivroAutor}>{item.descricao}</p>
                <span className={styles.postLivroCat}>{item.modalidade}</span>
              </div>
            </div>
          ) : (
            <p className={styles.postBodyText}>{item.titulo}</p>
          )}
        </div>
      )}

      <div className={styles.postFooter}>

        <div className={styles.postActions}>
          <button className={styles.postActionBtn} onClick={handleLike}>
            {liked
              ? <HeartFill size={20} color="#E74C3C" />
              : <Heart size={20} />
            }
            <span className={styles.postActionCount}>{likes}</span>
          </button>

          <button className={styles.postActionBtn} onClick={handleShare}>
            <Share size={18} />
          </button>

          <button
            className={`${styles.postActionBtn} ${styles.postVerMais}`}
            onClick={() => navigate(ROTAS[item.tipo_feed] ?? "/")}
          >
            <BoxArrowUpRight size={16} />
            <span>Ver mais</span>
          </button>
        </div>

        <div className={styles.postDesc}>
          {fotoUrlFormatada && <p className={styles.postDescTitle}>{item.titulo}</p>}
          {item.descricao && (
            <p className={styles.postDescText}>
              {item.descricao?.length > 100
                ? item.descricao.slice(0, 100) + "..."
                : item.descricao}
            </p>
          )}
          {item.tipo_feed === "achado" && item.sala && (
            <p className={styles.postDescMeta}>
              <GeoAlt size={11} /> {item.sala}
            </p>
          )}
          {item.tipo_feed === "esporte" && item.modalidade && (
            <p className={styles.postDescMeta}>🏅 {item.modalidade}</p>
          )}
        </div>
      </div>
    </div>
  );
}