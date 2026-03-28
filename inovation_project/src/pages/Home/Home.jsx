import styles from "./Home.module.css";
import Hero from "../../components/Hero/Hero";
import AvisoCard from "../../components/AvisoCard/AvisoCard";
import { AVISOS } from "../../data/mockData";

export default function Home() {
  return (
    <div>
      <Hero />

      <h2 className={styles.sectionTitle}>📋 Quadro de Avisos</h2>
      <div className={styles.avisosList}>
        {AVISOS.map((aviso) => (
          <AvisoCard key={aviso.id} aviso={aviso} />
        ))}
      </div>
    </div>
  );
}