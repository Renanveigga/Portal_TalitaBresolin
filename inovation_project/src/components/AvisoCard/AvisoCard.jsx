import styles from "./AvisoCard.module.css";
import Badge from "../Badge/Badge";
import { CalendarEvent } from "react-bootstrap-icons";

const TIPO_COLORS = {
  evento:   "#2E86C1",
  prova:    "#C0392B",
  feriado:  "#8E44AD",
  palestra: "#1E8449",
};

export default function AvisoCard({ aviso }) {
  const accentColor = TIPO_COLORS[aviso.tipo] ?? "#5D6D7E";

  return (
    <div
      className={styles.card}
      style={{ "--accent-color": accentColor }}
    >
      <div className={styles.header}>
        <Badge tipo={aviso.tipo} />
        <span className={styles.date}><CalendarEvent style={{ fontSize: "14px", marginRight: "4px" }} /> {aviso.data}</span>
      </div>
      <p className={styles.title}>{aviso.titulo}</p>
      <p className={styles.desc}>{aviso.desc}</p>
    </div>
  );
}