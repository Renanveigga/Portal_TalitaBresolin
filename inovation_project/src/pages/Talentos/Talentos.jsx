import { useState, useEffect } from "react";
import styles from "./Talentos.module.css";
import { getTalent } from "../../services/talentosService";
import CadastroTalento from "./CadastroTalento";

const API_URL = "http://localhost:3000";

function getInitials(nome) {
  const p = nome.split(" ");
  return (p[0]?.[0] ?? "") + (p[1]?.[0] ?? "");
}

const HABILIDADES_SUGERIDAS = [
  "JavaScript", "Python", "React", "Node.js", "MySQL",
  "Excel", "Word", "Gestão", "Marketing", "Design",
  "Redes", "Hardware", "Linux", "Contabilidade",
];

export default function Talentos() {
  const [talentos, setTalentos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filtroCurso, setFiltroCurso] = useState("");
  const [filtroHab, setFiltroHab] = useState("");
  const [showCadastro, setShowCadastro] = useState(false);
  const [talentoAberto, setTalentoAberto] = useState(null);

  const carregar = (filtros = {}) => {
    setLoading(true);
    getTalent(filtros)
      .then((r) => setTalentos(r.data))
      .finally(() => setLoading(false));
  };

  useEffect(() => { carregar(); }, []);

  const handleFiltrar = () => {
    const filtros = {};
    if (filtroCurso) filtros.curso = filtroCurso;
    if (filtroHab) filtros.habilidade = filtroHab;
    carregar(filtros);
  };

  const handleLimpar = () => {
    setFiltroCurso("");
    setFiltroHab("");
    carregar();
  };

  if (showCadastro) {
    return <CadastroTalento onVoltar={() => { setShowCadastro(false); carregar(); }} />;
  }

  return (
    <div>

      <div className={styles.header}>
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
                <button
                  key={c}
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
            <input
              className={styles.filtroInput}
              placeholder="Ex: JavaScript, Excel..."
              value={filtroHab}
              onChange={(e) => setFiltroHab(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleFiltrar()}
            />
          </div>

          <div className={styles.filtroAcoes}>
            <button className={styles.btnFiltrar} onClick={handleFiltrar}>Buscar</button>
            {(filtroCurso || filtroHab) && (
              <button className={styles.btnLimpar} onClick={handleLimpar}>✕ Limpar</button>
            )}
          </div>

        </div>

        <div className={styles.tags}>
          <span className={styles.tagsLabel}>Populares:</span>
          {HABILIDADES_SUGERIDAS.map((h) => (
            <button
              key={h}
              className={`${styles.tag} ${filtroHab === h ? styles.tagActive : ""}`}
              onClick={() => { setFiltroHab(h); }}
            >
              {h}
            </button>
          ))}
        </div>
      </div>

      <p className={styles.contador}>
        {loading ? "Buscando talentos..." : `${talentos.length} talento${talentos.length !== 1 ? "s" : ""} encontrado${talentos.length !== 1 ? "s" : ""}`}
      </p>

      {talentos.length === 0 && !loading ? (
        <div className={styles.empty}>
          <p className={styles.emptyIcon}>🔍</p>
          <p className={styles.emptyText}>Nenhum talento encontrado com esses filtros.</p>
        </div>
      ) : (
        <div className={styles.grid}>
          {talentos.map((t) => (
            <div key={t.id} className={styles.card} onClick={() => setTalentoAberto(t)}>

              <div className={`${styles.cardHeader} ${t.curso === "TI" ? styles.headerTI : styles.headerADM}`}>
                <div className={styles.avatar}>
                  {t.foto_url ? (
                    <img src={`${API_URL}${t.foto_url}`} alt={t.nome} className={styles.avatarImg} />
                  ) : (
                    <span className={styles.avatarInitials}>{getInitials(t.nome)}</span>
                  )}
                </div>
                <span className={styles.cursoBadge}>{t.curso}</span>
              </div>

              <div className={styles.cardBody}>
                <p className={styles.cardNome}>{t.nome}</p>
                <p className={styles.cardAno}>{t.ano} ano</p>

                <div className={styles.habilidades}>
                  {t.habilidades.split(",").slice(0, 3).map((h, i) => (
                    <span key={i} className={styles.habilidadeTag}>
                      {h.trim()}
                    </span>
                  ))}
                  {t.habilidades.split(",").length > 3 && (
                    <span className={styles.habilidadeExtra}>
                      +{t.habilidades.split(",").length - 3}
                    </span>
                  )}
                </div>

                <div className={styles.links}>
                  {t.linkedin && <span className={styles.linkIcon} title="LinkedIn">💼</span>}
                  {t.github && <span className={styles.linkIcon} title="GitHub">💻</span>}
                  {t.curriculo_url && <span className={styles.linkIcon} title="Currículo">📄</span>}
                </div>
              </div>

            </div>
          ))}
        </div>
      )}

      {talentoAberto && (
        <div className={styles.modal} onClick={() => setTalentoAberto(null)}>
          <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
            <button className={styles.modalClose} onClick={() => setTalentoAberto(null)}>✕</button>

            {/* Header colorido */}
            <div className={`${styles.modalHeader} ${talentoAberto.curso === "TI" ? styles.headerTI : styles.headerADM}`}>
              <div className={styles.modalAvatar}>
                {talentoAberto.foto_url
                  ? <img src={`${API_URL}${talentoAberto.foto_url}`} alt={talentoAberto.nome} className={styles.avatarImg} />
                  : <span className={styles.avatarInitials}>{getInitials(talentoAberto.nome)}</span>
                }
              </div>
            </div>

            <div className={styles.modalBody}>
              <p className={styles.modalNome}>{talentoAberto.nome}</p>
              <p className={styles.modalInfo}>{talentoAberto.curso} · {talentoAberto.ano} ano</p>

              {/* Bio renderizada */}
              {talentoAberto.bio_html && (
                <div className={styles.modalSection}>
                  <p className={styles.modalLabel}>Sobre</p>
                  <div
                    className={styles.bioRendered}
                    dangerouslySetInnerHTML={{ __html: talentoAberto.bio_html }}
                  />
                </div>
              )}

              {/* Habilidades */}
              <div className={styles.modalSection}>
                <p className={styles.modalLabel}>Habilidades</p>
                <div className={styles.habilidades}>
                  {talentoAberto.habilidades.split(",").map((h, i) => (
                    <span key={i} className={styles.habilidadeTag}>{h.trim()}</span>
                  ))}
                </div>
              </div>

              {(talentoAberto.email || talentoAberto.linkedin || talentoAberto.github || talentoAberto.instagram) && (
                <div className={styles.modalSection}>
                  <p className={styles.modalLabel}>Contato</p>
                  <div className={styles.modalContatos}>
                    {talentoAberto.email && (
                      <a href={`mailto:${talentoAberto.email}`} className={styles.contatoItem}>
                        <span className={styles.contatoIcon}>📧</span>
                        <span>{talentoAberto.email}</span>
                      </a>
                    )}
                    {talentoAberto.linkedin && (
                      <a href={talentoAberto.linkedin} target="_blank" rel="noreferrer" className={styles.contatoItem}>
                        <span className={styles.contatoIcon}>💼</span>
                        <span>LinkedIn</span>
                      </a>
                    )}
                    {talentoAberto.github && (
                      <a href={talentoAberto.github} target="_blank" rel="noreferrer" className={styles.contatoItem}>
                        <span className={styles.contatoIcon}>💻</span>
                        <span>GitHub</span>
                      </a>
                    )}
                    {talentoAberto.instagram && (
                      <a href={talentoAberto.instagram} target="_blank" rel="noreferrer" className={styles.contatoItem}>
                        <span className={styles.contatoIcon}>📸</span>
                        <span>Instagram</span>
                      </a>
                    )}
                    {talentoAberto.curriculo_url && (
                      <a href={`${API_URL}${talentoAberto.curriculo_url}`} target="_blank" rel="noreferrer" className={styles.contatoItem}>
                        <span className={styles.contatoIcon}>📄</span>
                        <span>Ver Currículo</span>
                      </a>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}