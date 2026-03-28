import styles from "./AchadoCard.module.css";

export default function AchadoCard({ item }) {
  const status = item.retirado ? "retirado" : "pendente";

  return (
    <div className={`${styles.card} ${item.retirado ? styles.retirado : ""}`}>

      <div className={`${styles.iconBox} ${styles[status]}`}>
        {item.retirado ? "✓" : "?"}
      </div>

      <div className={styles.info}>
        <p className={styles.descricao}>{item.desc}</p>
        <p className={styles.meta}>
          📍 {item.sala} &nbsp;·&nbsp; 📅 {item.data}
        </p>
      </div>

      <span className={`${styles.statusBadge} ${styles[status]}`}>
        {item.retirado ? "Retirado" : "Aguardando"}
      </span>

    </div>
  );
}