import styles from "./Badge.module.css";

export default function Badge({ tipo }) {
  const cls = styles[tipo] ?? styles.default;
  return (
    <span className={`${styles.badge} ${cls}`}>
      {tipo}
    </span>
  );
}