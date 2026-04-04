import { useState, useEffect } from "react";
import {
  Linkedin, Github, Instagram, FileEarmarkPdf,
  Heart, HeartFill, Share, BoxArrowUpRight,
} from "react-bootstrap-icons";
import styles from "./Talentos.module.css";
import { getTalentos } from "../../services/talentosService";
import CadastroTalento from "./CadastroTalento";
import { SkeletonCard } from "../../components/Skeleton/Skeleton";

const API_URL = "http://localhost:3000";

const HABILIDADES_SUGERIDAS = [
  "JavaScript","Python","React","Node.js","MySQL",
  "Excel","Word","Gestão","Marketing","Design",
  "Redes","Hardware","Linux","Contabilidade",
];

function getInitials(nome = "") {
  const p = nome.split(" ");
  return (p[0]?.[0] ?? "") + (p[1]?.[0] ?? "");
}

function timeAgo(date) {
  if (!date) return "";
  try {
    const diff = Math.floor((Date.now() - new Date(date)) / 1000);
    if (diff < 60)    return "agora mesmo";
    if (diff < 3600)  return `${Math.floor(diff / 60)}min`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}h`;
    return `${Math.floor(diff / 86400)}d`;
  } catch (e) { return ""; }
}
 
function TalentoCard({ talento, onAbrir }) {
  const [liked, setLiked] = useState(false);
 
  const [likes, setLikes] = useState(Math.floor(Math.random() * 20) + 1);

  const handleLike = (e) => {
    e.stopPropagation();
    setLiked((p) => !p);
    setLikes((p) => liked ? p - 1 : p + 1);
  };

  const isTI = talento.curso === "TI";

  return (
    <div className={styles.post}>
 
      <div className={styles.postHeader}>
        <div className={styles.postAvatar}>
          {talento.foto_url ? (
            <img
              src={`${API_URL}${talento.foto_url}`}
              alt={talento.nome}
              className={styles.postAvatarImg}
            />
          ) : (
            <div
              className={styles.postAvatarInitials}
              style={{
                background: isTI
                  ? "linear-gradient(135deg,#1B4F72,#2E86C1)"
                  : "linear-gradient(135deg,#7D6608,#F39C12)",
              }}
            >
              {getInitials(talento.nome)}
            </div>
          )}
        </div>
        <div className={styles.postHeaderInfo}>
          <p className={styles.postNome}>{talento.nome}</p>
          <p className={styles.postTime}>{timeAgo(talento.criado_em)}</p>
        </div>
        <span
          className={styles.cursoBadge}
          style={{
            background: isTI ? "#EBF5FB" : "#FEF9E7",
            color:      isTI ? "#2E86C1" : "#F39C12",
          }}
        >
          {isTI ? "💻 TI" : "📊 ADM"} · {talento.ano}º ano
        </span>
      </div>
 
      {talento.foto_url && (
        <div className={styles.postCover}>
          <img
            src={`${API_URL}${talento.foto_url}`}
            alt={talento.nome}
            className={styles.postCoverImg}
          />
        </div>
      )}
 
      <div
        className={styles.postBody}
        style={{
          borderLeft: `3px solid ${isTI ? "#2E86C1" : "#F39C12"}`,
          background: isTI ? "#EBF5FB11" : "#FEF9E711",
        }}
      >
 
        <div className={styles.habilidades}>
 
          {(talento.habilidades || "").split(",").map((h, i) => (
            h.trim() && <span key={i} className={styles.habTag}>{h.trim()}</span>
          ))}
        </div>
 
        {talento.bio_html ? (
          <div
            className={styles.bio}
            dangerouslySetInnerHTML={{ __html: talento.bio_html }}
          />
        ) : (
          <p className={styles.bio}>{talento.bio || "Sem biografia disponível."}</p>
        )}
      </div>
 
      <div className={styles.postFooter}>
        <div className={styles.postActions}>
          <button className={styles.actionBtn} onClick={handleLike}>
            {liked
              ? <HeartFill size={20} color="#E74C3C" />
              : <Heart size={20} />
            }
            <span className={styles.actionCount}>{likes}</span>
          </button>

          <button className={styles.actionBtn}
            onClick={(e) => {
              e.stopPropagation();
              navigator.clipboard?.writeText(window.location.href);
              alert("Link copiado!");
            }}
          >
            <Share size={18} />
          </button>

          <button
            className={`${styles.actionBtn} ${styles.actionVerMais}`}
            onClick={() => onAbrir(talento)}
          >
            <BoxArrowUpRight size={15} />
            <span>Ver perfil</span>
          </button>
        </div>
 
        <div className={styles.postLinks}>
          {talento.linkedin && (
            <a href={talento.linkedin} target="_blank" rel="noreferrer"
              className={styles.postLink} onClick={(e) => e.stopPropagation()}>
              <Linkedin size={14} /> LinkedIn
            </a>
          )}
          {talento.github && (
            <a href={talento.github} target="_blank" rel="noreferrer"
              className={styles.postLink} onClick={(e) => e.stopPropagation()}>
              <Github size={14} /> GitHub
            </a>
          )}
          {talento.instagram && (
            <a href={talento.instagram} target="_blank" rel="noreferrer"
              className={styles.postLink} onClick={(e) => e.stopPropagation()}>
              <Instagram size={14} /> Instagram
            </a>
          )}
          {talento.curriculo_url && (
            <a href={`${API_URL}${talento.curriculo_url}`} target="_blank"
              rel="noreferrer" className={`${styles.postLink} ${styles.postLinkCurriculo}`}
              onClick={(e) => e.stopPropagation()}>
              <FileEarmarkPdf size={14} /> Currículo
            </a>
          )}
        </div>
      </div>
    </div>
  );
}
 
function TalentoModal({ talento, onFechar }) {
  if (!talento) return null;
  const isTI = talento.curso === "TI";

  return (
    <div className={styles.modal} onClick={onFechar}>
      <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
        <button className={styles.modalClose} onClick={onFechar}>✕</button>
 
        <div
          className={styles.modalHeader}
          style={{
            background: isTI
              ? "linear-gradient(135deg,#1B4F72,#2E86C1)"
              : "linear-gradient(135deg,#7D6608,#F39C12)",
          }}
        >
          <div className={styles.modalAvatar}>
            {talento.foto_url ? (
              <img src={`${API_URL}${talento.foto_url}`} alt={talento.nome}
                className={styles.modalAvatarImg} />
            ) : (
              <span className={styles.modalAvatarInitials}>{getInitials(talento.nome)}</span>
            )}
          </div>
        </div>

        <div className={styles.modalBody}>
          <p className={styles.modalNome}>{talento.nome}</p>
          <p className={styles.modalInfo}>{talento.curso} · {talento.ano}º ano</p>
 
          <div className={styles.modalSection}>
            <p className={styles.modalLabel}>Sobre</p>
            {talento.bio_html ? (
              <div className={styles.bioRendered}
                dangerouslySetInnerHTML={{ __html: talento.bio_html }} />
            ) : (
              <p className={styles.bio}>{talento.bio || "Sem descrição."}</p>
            )}
          </div>
 
          <div className={styles.modalSection}>
            <p className={styles.modalLabel}>Habilidades</p>
            <div className={styles.habilidades}>
              {(talento.habilidades || "").split(",").map((h, i) => (
                h.trim() && <span key={i} className={styles.habTag}>{h.trim()}</span>
              ))}
            </div>
          </div>
 
          {(talento.email || talento.linkedin || talento.github || talento.instagram || talento.curriculo_url) && (
            <div className={styles.modalSection}>
              <p className={styles.modalLabel}>Contato</p>
              <div className={styles.modalContatos}>
                {talento.email && (
                  <a href={`mailto:${talento.email}`} className={styles.contatoItem}>
                    📧 <span>{talento.email}</span>
                  </a>
                )}
                {talento.linkedin && (
                  <a href={talento.linkedin} target="_blank" rel="noreferrer" className={styles.contatoItem}>
                    <Linkedin size={14} /> <span>LinkedIn</span>
                  </a>
                )}
                {talento.github && (
                  <a href={talento.github} target="_blank" rel="noreferrer" className={styles.contatoItem}>
                    <Github size={14} /> <span>GitHub</span>
                  </a>
                )}
                {talento.instagram && (
                  <a href={talento.instagram} target="_blank" rel="noreferrer" className={styles.contatoItem}>
                    <Instagram size={14} /> <span>Instagram</span>
                  </a>
                )}
                {talento.curriculo_url && (
                  <a href={`${API_URL}${talento.curriculo_url}`} target="_blank"
                    rel="noreferrer" className={styles.contatoItem}>
                    <FileEarmarkPdf size={14} /> <span>Ver Currículo</span>
                  </a>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
 
export default function Talentos() {
  const [talentos, setTalentos]         = useState([]);
  const [loading, setLoading]           = useState(true);
  const [filtroCurso, setFiltroCurso]   = useState("");
  const [filtroHab, setFiltroHab]       = useState("");
  const [ordem, setOrdem]               = useState("recente");
  const [showCadastro, setShowCadastro] = useState(false);
  const [talentoAberto, setTalentoAberto] = useState(null);

  const carregar = (filtros = {}) => {
    setLoading(true);
    getTalentos(filtros)
      .then((r) => {
 
        setTalentos(r.data?.dados || r.data || []);
      })
      .catch(err => console.error("Erro ao carregar talentos:", err))
      .finally(() => setLoading(false));
  };

  useEffect(() => { carregar(); }, []);

  const handleFiltrar = () => {
    const filtros = {};
    if (filtroCurso) filtros.curso      = filtroCurso;
    if (filtroHab)   filtros.habilidade = filtroHab;
    if (ordem)       filtros.ordem      = ordem;
    carregar(filtros);
  };

  const handleLimpar = () => {
    setFiltroCurso(""); 
    setFiltroHab(""); 
    setOrdem("recente");
    carregar();
  };

  if (showCadastro) {
    return <CadastroTalento onVoltar={() => { setShowCadastro(false); carregar(); }} />;
  }
 
  const listaTalentos = Array.isArray(talentos) ? talentos : [];

  return (
    <div>
      <div className={styles.pageHeader}>
        <div>
          <h2 className="page-title">🌟 Banco de Talentos</h2>
          <p className="page-subtitle">
            Conectando alunos do colégio ao mercado de trabalho.
          </p>
        </div>
        <button className={styles.btnCadastrar} onClick={() => setShowCadastro(true)}>
          + Cadastrar meu perfil
        </button>
      </div>
 
      <div className={styles.filtrosCard}>
        <div className={styles.filtroRow}>
          <div className={styles.filtroGroup}>
            <label className={styles.filtroLabel}>Curso</label>
            <div className={styles.filtroBtns}>
              {["", "TI", "ADM"].map((c) => (
                <button key={c}
                  className={`${styles.filtroBtn} ${filtroCurso === c ? styles.filtroBtnActive : ""}`}
                  onClick={() => setFiltroCurso(c)}
                >
                  {c === "" ? "Todos" : c === "TI" ? "💻 TI" : "📊 ADM"}
                </button>
              ))}
            </div>
          </div>

          <div className={styles.filtroGroup}>
            <label className={styles.filtroLabel}>Competência</label>
            <input className={styles.filtroInput}
              placeholder="Ex: JavaScript, Excel..."
              value={filtroHab}
              onChange={(e) => setFiltroHab(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleFiltrar()}
            />
          </div>

          <div className={styles.filtroGroup}>
            <label className={styles.filtroLabel}>Ordenar por</label>
            <select className={styles.filtroSelect}
              value={ordem} onChange={(e) => setOrdem(e.target.value)}>
              <option value="recente">Mais recentes</option>
              <option value="relevancia">Mais completos</option>
            </select>
          </div>

          <div className={styles.filtroAcoes}>
            <button className={styles.btnFiltrar} onClick={handleFiltrar}>Buscar</button>
            {(filtroCurso || filtroHab || ordem !== "recente") && (
              <button className={styles.btnLimpar} onClick={handleLimpar}>✕ Limpar</button>
            )}
          </div>
        </div>
 
        <div className={styles.tags}>
          <span className={styles.tagsLabel}>Populares:</span>
          {HABILIDADES_SUGERIDAS.map((h) => (
            <button key={h}
              className={`${styles.tag} ${filtroHab === h ? styles.tagActive : ""}`}
              onClick={() => {
                setFiltroHab(h);
 
                const filtros = { habilidade: h };
                if (filtroCurso) filtros.curso = filtroCurso;
                carregar(filtros);
              }}
            >
              {h}
            </button>
          ))}
        </div>
      </div>
 
      <p className={styles.contador}>
        {loading 
          ? "Buscando talentos..." 
          : `${listaTalentos.length} talento(s) encontrado(s)`
        }
      </p>
 
      {loading ? (
        <div className={styles.feedList}>
 
          {[1, 2, 3].map((n) => <SkeletonCard key={n} />)}
        </div>
      ) : listaTalentos.length === 0 ? (
        <div className={styles.empty}>
          <p className={styles.emptyIcon}>🔍</p>
          <p className={styles.emptyText}>Nenhum talento encontrado com esses filtros.</p>
        </div>
      ) : (
        <div className={styles.feedList}>
          {listaTalentos.map((t) => (
            <TalentoCard key={t.id} talento={t} onAbrir={setTalentoAberto} />
          ))}
        </div>
      )}
 
      <TalentoModal talento={talentoAberto} onFechar={() => setTalentoAberto(null)} />
    </div>
  );
}