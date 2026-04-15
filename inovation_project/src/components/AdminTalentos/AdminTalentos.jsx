import { useState, useEffect } from "react";
import { getTalentosAdmin, updateStatus, deleteTalento } from "../../services/talentosService";
import styles from "./AdminTalentos.module.css";
import { 
  Star, 
  HourglassSplit, 
  CheckCircle, 
  XCircle, 
  ListUl, 
  FileEarmarkPdf, 
  Trash 
} from "react-bootstrap-icons";

const API_URL = "http://localhost:3000";

function getInitials(nome) {
  if (!nome) return "";
  const p = nome.split(" ");
  return (p[0]?.[0] ?? "") + (p[1]?.[0] ?? "");
}

export default function AdminTalentos() {
  const [talentos, setTalentos] = useState([]);
  const [filtro, setFiltro] = useState("pendente");
  
  useEffect(() => {
    carregar();
  }, []);  

  const carregar = async () => {
    try {
      const r = await getTalentosAdmin();
      const lista = r.data?.dados || r.data || [];
      setTalentos(Array.isArray(lista) ? lista : []);
    } catch (err) {
      console.error("Erro ao carregar talentos:", err);
      setTalentos([]); 
    }
  };
 
  const handleStatus = async (id, status) => {
    await updateStatus(id, status);
    carregar();
  };

  const handleDelete = async (id) => {
    if (!confirm("Remover este perfil?")) return;
    await deleteTalento(id);
    carregar();
  };

  const filtrados = talentos.filter((t) => filtro === "todos" || t.status === filtro);

  return (
    <div className={styles.section}>
      <h3 className={styles.sectionTitle}>
        <Star size={14} style={{ marginRight: '8px' }} /> 
        Banco de Talentos
      </h3>

      <div className={styles.filtros}>
        {[
          { value: "pendente",  label: "Pendentes",  icon: HourglassSplit },
          { value: "aprovado",  label: "Aprovados",  icon: CheckCircle },
          { value: "reprovado", label: "Reprovados", icon: XCircle },
          { value: "todos",     label: "Todos",      icon: ListUl },
        ].map((f) => {
          const Icon = f.icon;
          return (
            <button
              key={f.value}
              className={`${styles.filtroBtn} ${filtro === f.value ? styles.filtroBtnActive : ""}`}
              onClick={() => setFiltro(f.value)}
              style={{ fontSize: '14px' }}
            >
              <Icon size={14} style={{ marginRight: '6px' }} />
              {f.label}
            </button>
          );
        })}
      </div>

      <div className={styles.list}>
        {filtrados.map((t) => (
          <div key={t.id} className={styles.item}>

            <div className={`${styles.avatar} ${t.curso === "TI" ? styles.avatarTI : styles.avatarADM}`}>
              {t.foto_url
                ? <img src={`${API_URL}${t.foto_url}`} alt={t.nome} className={styles.avatarImg} />
                : <span>{getInitials(t.nome)}</span>
              }
            </div>

            <div className={styles.info}>
              <p className={styles.nome}>{t.nome}</p>
              <p className={styles.meta}>{t.curso} · {t.ano}º ano</p>
              <p className={styles.habilidades}>{t.habilidades}</p>
            </div>

            <div className={styles.links}>
              {t.curriculo_url && (
                <a 
                  href={`${API_URL}${t.curriculo_url}`} 
                  target="_blank" 
                  rel="noreferrer" 
                  className={styles.linkBtn}
                  style={{ fontSize: '14px' }}
                >
                  <FileEarmarkPdf size={14} style={{ marginRight: '6px' }} />
                  Currículo
                </a>
              )}
            </div>

            <div className={styles.acoes}>
              {t.status === "pendente" && (
                <>
                  <button className={styles.btnAprovar} onClick={() => handleStatus(t.id, "aprovado")}>
                    <CheckCircle size={14} style={{ marginRight: '5px' }} />
                    Aprovar
                  </button>
                  <button className={styles.btnReprovar} onClick={() => handleStatus(t.id, "reprovado")}>
                    <XCircle size={14} style={{ marginRight: '5px' }} />
                    Reprovar
                  </button>
                </>
              )}
              
              {t.status !== "pendente" && (
                <span className={`${styles.statusBadge} ${styles[t.status]}`}>
                  {t.status === "aprovado" ? (
                    <><CheckCircle size={12} style={{ marginRight: '4px' }} /> Aprovado</>
                  ) : (
                    <><XCircle size={12} style={{ marginRight: '4px' }} /> Reprovado</>
                  )}
                </span>
              )}

              <button className={styles.btnDelete} onClick={() => handleDelete(t.id)}>
                <Trash size={14} style={{ marginRight: '5px' }} />
                Excluir
              </button>
            </div>

          </div>
        ))}

        {filtrados.length === 0 && (
          <p className={styles.empty}>Nenhum perfil {filtro === "todos" ? "cadastrado" : filtro}.</p>
        )}
      </div>
    </div>
  );
}