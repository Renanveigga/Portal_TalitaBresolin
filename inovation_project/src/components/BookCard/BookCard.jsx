import styles from "./BookCard.module.css";

export default function BookCard({ book }) {
  return (
    <div className={styles.card}>
      <div className={styles.badges}>
        <span className={`${styles.statusBadge} ${book.disp ? styles.disponivel : styles.emprestado}`}>
          {book.disp ? "Disponível" : "Emprestado"}
        </span>
        <span className={styles.catBadge}>{book.cat}</span>
      </div>
      <p className={styles.titulo}>{book.titulo}</p>
      <p className={styles.autor}>{book.autor}</p>
    </div>
  );
}