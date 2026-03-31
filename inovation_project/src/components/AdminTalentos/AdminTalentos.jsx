import { useState, useEffect } from "react";
import { getTalentosAdmin, updateStatus, deleteTalento } from "../../services/talentosService";
import styles from "./AdminTalentos.module.css";

const API_URL = "http://localhost:3000";

function getInitials(nome) {
  const p = nome.split(" ");
  return (p[0]?.[0] ?? "") + (p[1]?.[0] ?? "");
}

export default function AdminTalentos() {
  const [talentos, setTalentos] = useState([]);
  const [filtro, setFiltro]     = useState("pendente");

  const carregar = () => getTalentosAdmin().then((r) => setTalentos(r.data));
  useEffect(() => { carregar(); }, []);

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
      <h3 className={styles.sectionTitle}>🌟 Banco de Talentos</h3>

      <div className={styles.filtros}>
        {[
          { value: "pendente",  label: "⏳ Pendentes"  },
          { value: "aprovado",  label: "✅ Aprovados"  },
          { value: "reprovado", label: "❌ Reprovados" },
          { value: "todos",     label: "Todos"          },
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
              <p className={styles.meta}>{t.curso} · {t.ano} ano</p>
              <p className={styles.habilidades}>{t.habilidades}</p>
            </div>

            <div className={styles.links}>
              {t.curriculo_url && (
                <a href={`${API_URL}${t.curriculo_url}`} target="_blank" rel="noreferrer" className={styles.linkBtn}>
                  📄 Currículo
                </a>
              )}
            </div>

            <div className={styles.acoes}>
              {t.status === "pendente" && (
                <>
                  <button className={styles.btnAprovar} onClick={() => handleStatus(t.id, "aprovado")}>
                    ✅ Aprovar
                  </button>
                  <button className={styles.btnReprovar} onClick={() => handleStatus(t.id, "reprovado")}>
                    ❌ Reprovar
                  </button>
                </>
              )}
              {t.status !== "pendente" && (
                <span className={`${styles.statusBadge} ${styles[t.status]}`}>
                  {t.status === "aprovado" ? "✅ Aprovado" : "❌ Reprovado"}
                </span>
              )}
              <button className={styles.btnDelete} onClick={() => handleDelete(t.id)}>
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