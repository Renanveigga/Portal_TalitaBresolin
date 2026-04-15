import { useState, useEffect, useRef } from "react";
import { getEsportes, createEsporte, deleteEsporte } from "../../services/esportesService";
import { 
  Trophy, 
  PlusCircle, 
  Trash, 
  Camera, 
  Image as ImageIcon, 
  CalendarEvent, 
  Dribbble,
  Award
} from "react-bootstrap-icons";
import styles from "./AdminEsportes.module.css";

const API_URL = "http://localhost:3000";

export default function AdminEsportes() {
  const [esportes, setEsportes] = useState([]);
  const [form, setForm] = useState({
    titulo: "", modalidade: "", resumo: "", medalha: "participacao", data_evento: "",
  });
  const [foto, setFoto] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const fileRef = useRef();

  const carregar = async () => {
    try {
      const r = await getEsportes();
      const lista = r.data?.dados || r.data || [];
      setEsportes(Array.isArray(lista) ? lista : []);
    } catch (err) {
      console.error("Erro ao carregar esportes:", err);
      setEsportes([]);
    }
  };

  useEffect(() => {
    carregar();
    return () => { if (preview) URL.revokeObjectURL(preview); };
  }, [preview]);

  const handleCreate = async () => {
    if (!form.titulo || !form.modalidade || !form.data_evento) {
      alert("Preencha todos os campos obrigatórios (*)");
      return;
    }

    setLoading(true);
    try {
      const formData = new FormData();
      Object.entries(form).forEach(([k, v]) => formData.append(k, v));
      if (foto) formData.append("foto", foto);

      await createEsporte(formData);

      setForm({ titulo: "", modalidade: "", resumo: "", medalha: "participacao", data_evento: "" });
      setFoto(null);
      setPreview(null);
      carregar();
    } catch (err) {
      alert("Erro ao salvar conquista esportiva.");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Remover esta conquista?")) return;
    try {
      await deleteEsporte(id);
      carregar();
    } catch (err) {
      alert("Erro ao excluir.");
    }
  };

  return (
    <div className={styles.section}>
      <h3 className={styles.sectionTitle}>
        <Trophy size={18} className="me-2" style={{ marginBottom: '-3px' }} /> Gestão de Esportes
      </h3>

      <div className={styles.formCard}>
        <p className={styles.formLabel}>Adicionar nova conquista</p>
        
        <div className={styles.formGrid}>
          <input className={styles.input} placeholder="Título (ex: Interclasse 2024) *"
            value={form.titulo} onChange={(e) => setForm({ ...form, titulo: e.target.value })} />

          <input className={styles.input} placeholder="Modalidade (ex: Futsal) *"
            value={form.modalidade} onChange={(e) => setForm({ ...form, modalidade: e.target.value })} />

          <select className={styles.input}
            value={form.medalha} onChange={(e) => setForm({ ...form, medalha: e.target.value })}>
            <option value="ouro">🥇 Ouro / 1º Lugar</option>
            <option value="prata">🥈 Prata / 2º Lugar</option>
            <option value="bronze">🥉 Bronze / 3º Lugar</option>
            <option value="participacao">🏅 Participação</option>
          </select>

          <input className={styles.input} type="date"
            value={form.data_evento} onChange={(e) => setForm({ ...form, data_evento: e.target.value })} />
          
          <div style={{ gridColumn: 'span 2' }}>
            <input className={styles.input} placeholder="Breve resumo (opcional)"
              value={form.resumo} onChange={(e) => setForm({ ...form, resumo: e.target.value })} />
          </div>
        </div>

        <div className={styles.uploadArea}>
          <input 
            type="file" 
            id="foto-esporte"
            className={styles.fileInput} 
            accept="image/*"
            onChange={(e) => {
              const f = e.target.files[0];
              if (f) {
                setFoto(f);
                setPreview(URL.createObjectURL(f));
              }
            }} 
          />
          <label htmlFor="foto-esporte" className={styles.fileLabel}>
            {preview ? <ImageIcon size={16} className="me-2" /> : <Camera size={16} className="me-2" />}
            {preview ? "Trocar Foto" : "Adicionar Foto"}
          </label>
          
          {preview && <img src={preview} className={styles.preview} alt="preview" />}
        </div>

        <button className={styles.btnAdd} onClick={handleCreate} disabled={loading}>
          {loading ? "Salvando..." : "+ Publicar Conquista"}
        </button>
      </div>

      <div className={styles.list}>
        <p className={styles.formLabel}>Histórico de Conquistas</p>
        
        {esportes.length > 0 ? esportes.map((e) => (
          <div key={e.id} className={styles.item}>
            <div className={styles.itemFoto}>
              {e.foto_url
                ? <img src={`${API_URL}${e.foto_url}`} className={styles.foto} alt={e.titulo} />
                : <div className={styles.semFoto}><Award size={24} color="var(--color-text-mid)" /></div>
              }
            </div>
            
            <div className={styles.itemInfo}>
              <p className={styles.itemTitle}>{e.titulo}</p>
              <p className={styles.itemMeta}>
                <Dribbble size={12} className="me-1" /> {e.modalidade} · {e.data_evento?.slice(0, 10)}
              </p>
              <span className={`${styles.btnStatus} ${styles.pendente}`} style={{ fontSize: '10px', marginTop: '4px', display: 'inline-block' }}>
                {e.medalha.toUpperCase()}
              </span>
            </div>
            
            <div className={styles.itemActions}>
              <button className={styles.btnDelete} onClick={() => handleDelete(e.id)}>
                <Trash size={14} />
              </button>
            </div>
          </div>
        )) : (
          <p className={styles.itemMeta} style={{ textAlign: 'center', padding: '20px' }}>Nenhuma conquista registrada ainda.</p>
        )}
      </div>
    </div>
  );
}