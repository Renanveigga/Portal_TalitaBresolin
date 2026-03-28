import styles from "./ProfessorCard.module.css";

function getInitials(nome) {
  const parts = nome.split(" ");
  return (parts[1]?.[0] ?? "") + (parts[2]?.[0] ?? "");
}

export default function ProfessorCard({ professor, cor }) {
  return (
    <div className={styles.card}>

      <div
        className={styles.avatar}
        style={{ background: cor + "22", color: cor }}
      >
        {getInitials(professor.nome)}
      </div>

      <div>
        <p className={styles.nome}>{professor.nome}</p>
        <p className={styles.materia} style={{ color: cor }}>
          {professor.materia}
        </p>
        <p className={styles.formacao}>🎓 {professor.form}</p>
      </div>

    </div>
  );
}