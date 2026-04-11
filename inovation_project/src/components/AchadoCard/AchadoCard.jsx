import styles from "./AchadoCard.module.css";
import { CalendarEvent } from "react-bootstrap-icons";

const API_URL = "http://localhost:3000";

export default function AchadoCard({ item }) {
  const status = item.retirado ? "retirado" : "pendente";

  return (
    <div className={`${styles.card} ${item.retirado ? styles.retirado : ""}`}>

      <div className={styles.fotoBox}>
        {item.foto_url ? (
          <img
            src={`${API_URL}${item.foto_url}`}
            alt={item.desc}
            className={styles.foto}
          />
        ) : (
          <div className={styles.semFoto}>?</div>
        )}
      </div>

      <div className={styles.info}>
        <p className={styles.descricao}>{item.descricao}</p>
        <p className={styles.meta}>
          📍 {item.sala} &nbsp;·&nbsp; <CalendarEvent style={{ fontSize: "14px", marginRight: "4px" }} /> {item.encontrado_em?.slice(0, 10)}
        </p>
      </div>

      <span className={`${styles.statusBadge} ${styles[status]}`}>
        {item.retirado ? "Retirado" : "Aguardando"}
      </span>

    </div>
  );
}