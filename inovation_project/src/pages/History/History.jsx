import styles from "./History.module.css";
import { HISTORIAS, TALITA_BIO, DIRETORES } from "../../data/Mockdata";
import { HourglassSplit, PersonBadgeFill } from "react-bootstrap-icons";

export default function History() {
  return (
    <div>
      <h2 className="page-title" ><HourglassSplit style={{ fontSize: "14px" , marginRight: "6px" }}/> Nossa História</h2>
      <p className="page-subtitle">
        Do passado ao futuro — conheça a trajetória do nosso colégio.
      </p>

      <div className={styles.bioCard}>
        <span className={styles.bioPeriodo}>{TALITA_BIO.periodo}</span>
        <p className={styles.bioNome}>Quem foi {TALITA_BIO.nome}</p>
        <p className={styles.bioTexto}>{TALITA_BIO.texto}</p>
      </div>

      <h3 className={styles.sectionTitle}>Linha do tempo institucional</h3>

      <div className={styles.timeline}>
        {HISTORIAS.map((item, i) => {

          const Icon = item.icon;

          return (
            <div key={i} className={styles.item}>
              
              <div
                className={styles.iconCircle}
                style={{
                  background: item.cor + "20",
                  color: item.cor,
                  border: `2px solid ${item.cor}40`,
                }}
              >

                {Icon && <Icon size={24} />}
              </div>

              <div className={styles.card}>
                <span className={styles.era} style={{ color: item.cor }}>
                  {item.era}
                </span>
                <p className={styles.titulo}>{item.titulo}</p>
                <p className={styles.texto}>{item.texto}</p>
              </div>

            </div>
          );
        })}
      </div>

      <h3 className={styles.sectionTitle}>
        <PersonBadgeFill style={{ fontSize: "16px", marginRight: "6px" }} />
        Diretores e Diretoras
      </h3>
      <p className={styles.sectionSubtitle}>
        Quem esteve à frente da instituição desde 1966.
      </p>

      <div className={styles.diretoresList}>
        {DIRETORES.map((d, i) => (
          <div key={i} className={styles.diretorRow}>
            <span className={styles.diretorPeriodo}>{d.periodo}</span>
            <div className={styles.diretorInfo}>
              <span className={styles.diretorNome}>{d.nome}</span>
              {d.nota && <span className={styles.diretorNota}>{d.nota}</span>}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}