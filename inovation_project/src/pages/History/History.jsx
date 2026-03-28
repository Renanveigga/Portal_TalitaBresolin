import styles from "./History.module.css";
import { HISTORIAS } from "../../data/mockData";

export default function History() {
  return (
    <div>
      <h2 className="page-title">🏛️ Nossa História</h2>
      <p className="page-subtitle">
        Do passado ao futuro — conheça a trajetória do nosso colégio.
      </p>

      <div className={styles.timeline}>
        {HISTORIAS.map((item, i) => (
          <div key={i} className={styles.item}>

            <div
              className={styles.iconCircle}
              style={{
                background: item.cor + "20",
                color: item.cor,
                border: `2px solid ${item.cor}40`,
              }}
            >
              {item.icon}
            </div>

            <div className={styles.card}>
              <span className={styles.era} style={{ color: item.cor }}>
                {item.era}
              </span>
              <p className={styles.titulo}>{item.titulo}</p>
              <p className={styles.texto}>{item.texto}</p>
            </div>

          </div>
        ))}
      </div>
    </div>
  );
}