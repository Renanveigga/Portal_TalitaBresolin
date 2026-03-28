import styles from "./Hero.module.css";

export default function Hero() {
  return (
    <div className={styles.hero}>
      <p className={styles.eyebrow}>Colégio Estadual</p>
      <h1 className={styles.title}>
        Portal da<br />Comunidade Escolar
      </h1>
      <p className={styles.desc}>
        Biblioteca, achados e perdidos, cursos técnicos e muito mais —
        tudo em um só lugar para alunos, professores e famílias.
      </p>
    </div>
  );
}