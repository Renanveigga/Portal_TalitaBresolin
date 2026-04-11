import styles from "./ProfessorCard.module.css";
import { MortarboardFill } from "react-bootstrap-icons";

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
        <p className={styles.formacao}><MortarboardFill style={{ fontSize: "14px", marginRight: "4px" }} /> {professor.form}</p>
      </div>

    </div>
  );
}