import { useState } from "react";
import styles from "./Courses.module.css";
import ProfessorCard from "../../components/ProfessorCard/ProfessorCard";
import { CURSOS } from "../../data/mockData";

export default function Courses() {
  const [activeId, setActiveId] = useState(CURSOS[0].id);
  const curso = CURSOS.find((c) => c.id === activeId);

  return (
    <div>
      <h2 className="page-title">🎓 Cursos Técnicos</h2>
      <p className="page-subtitle">
        Conheça os cursos técnicos oferecidos pela instituição.
      </p>

      {/* Tabs */}
      <div className={styles.tabs}>
        {CURSOS.map((c) => (
          <button
            key={c.id}
            className={`${styles.tabBtn} ${activeId === c.id ? styles.active : ""}`}
            style={
              activeId === c.id
                ? { background: c.cor, borderColor: c.cor }
                : {}
            }
            onClick={() => setActiveId(c.id)}
          >
            {c.sigla} — {c.nome.split(" ").slice(2).join(" ")}
          </button>
        ))}
      </div>

      {/* Banner */}
      {curso && (
        <>
          <div className={styles.courseBanner} style={{ background: curso.cor }}>
            <p className={styles.courseBannerEyebrow}>Curso Técnico</p>
            <h3 className={styles.courseBannerTitle}>{curso.nome}</h3>
            <p className={styles.courseBannerDesc}>{curso.desc}</p>
          </div>

          {/* Corpo docente */}
          <h4 className={styles.docenteTitle}>Corpo Docente</h4>
          <div className={styles.docenteGrid}>
            {curso.professores.map((prof, i) => (
              <ProfessorCard key={i} professor={prof} cor={curso.cor} />
            ))}
          </div>
        </>
      )}
    </div>
  );
}