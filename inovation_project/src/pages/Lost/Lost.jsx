import styles from "./Lost.module.css";
import AchadoCard from "../../components/AchadoCard/AchadoCard";
import { ACHADOS } from "../../data/mockData";

export default function Lost() {
  return (
    <div>
      <h2 className="page-title">🔍 Achados e Perdidos</h2>
      <p className="page-subtitle">
        Perdeu algo? Veja os itens encontrados e dirija-se à sala indicada para retirada.
      </p>

      <div className={styles.list}>
        {ACHADOS.map((item) => (
          <AchadoCard key={item.id} item={item} />
        ))}
      </div>
    </div>
  );
}