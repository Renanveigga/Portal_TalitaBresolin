import { useState, useEffect } from "react";
import { getAvisos, createAviso, deleteAviso } from "../../services/avisosService";
import styles from "./AdminAvisos.module.css";
import { Clipboard } from "react-bootstrap-icons";

export default function AdminAvisos() {
  const [avisos, setAvisos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({ titulo: "", descricao: "", tipo: "evento", data_evento: "" });

  const carregar = () => {
    setLoading(true);
    getAvisos()
      .then((r) => {
 
        const listaAvisos = r.data?.dados || r.data || [];
        setAvisos(listaAvisos);
      })
      .catch(err => console.error("Erro ao carregar avisos:", err))
      .finally(() => setLoading(false));
  };

  useEffect(() => { carregar(); }, []);

  const handleCreate = async () => {
    if (!form.titulo || !form.data_evento) {
      alert("Preencha o título e a data.");
      return;
    }
    try {
      await createAviso(form);
      setForm({ titulo: "", descricao: "", tipo: "evento", data_evento: "" });
      carregar();
    } catch (err) {
      alert("Erro ao criar aviso.");
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Remover este aviso?")) return;
    try {
      await deleteAviso(id);
      carregar();
    } catch (err) {
      alert("Erro ao excluir aviso.");
    }
  };
 
  const listaSegura = Array.isArray(avisos) ? avisos : [];

  return (
    <div className={styles.section}>
      <h3 className={styles.sectionTitle}><Clipboard style={{ fontSize: "14px" }}/> Gerenciar Avisos</h3>
 
      <div className={styles.form}>
        <input
          className={styles.input}
          placeholder="Título"
          value={form.titulo}
          onChange={(e) => setForm({ ...form, titulo: e.target.value })}
        />
        <input
          className={styles.input}
          placeholder="Descrição"
          value={form.descricao}
          onChange={(e) => setForm({ ...form, descricao: e.target.value })}
        />
        <select
          className={styles.input}
          value={form.tipo}
          onChange={(e) => setForm({ ...form, tipo: e.target.value })}
        >
          <option value="evento">Evento</option>
          <option value="prova">Prova</option>
          <option value="feriado">Feriado</option>
          <option value="palestra">Palestra</option>
        </select>
        <input
          className={styles.input}
          type="date"
          value={form.data_evento}
          onChange={(e) => setForm({ ...form, data_evento: e.target.value })}
        />
        <button className={styles.btnAdd} onClick={handleCreate}>
          + Adicionar
        </button>
      </div>
 
      <div className={styles.list}>
        {loading && <p>Carregando avisos...</p>}
        
        {!loading && listaSegura.length === 0 && (
          <p className={styles.empty}>Nenhum aviso cadastrado.</p>
        )}

        {listaSegura.map((a) => (
          <div key={a.id} className={styles.item}>
            <div className={styles.itemContent}>
              <p className={styles.itemTitle}>{a.titulo}</p>
              <p className={styles.itemMeta}>
                <strong>{a.tipo.toUpperCase()}</strong> · {a.data_evento?.slice(0, 10)}
              </p>
              {a.descricao && <p className={styles.itemDesc}>{a.descricao}</p>}
            </div>
            <button className={styles.btnDelete} onClick={() => handleDelete(a.id)}>
              Excluir
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}