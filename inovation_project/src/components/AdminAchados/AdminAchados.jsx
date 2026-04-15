import { useState, useEffect, useRef } from "react";
import { getAchados, createAchado, updateAchado, deleteAchado } from "../../services/achadosService";
import styles from "./AdminAchados.module.css";
import { 
  Search, 
  Camera, 
  Image, 
  PlusCircle, 
  BoxSeam, 
  GeoAlt, 
  CheckCircle, 
  ArrowCounterclockwise, 
  Trash 
} from "react-bootstrap-icons";

const API_URL = "http://localhost:3000";

export default function AdminAchados() {
  const [achados, setAchados] = useState([]);
  const [loading, setLoading] = useState(true);
  const [descricao, setDescricao] = useState("");
  const [sala, setSala] = useState("");
  const [foto, setFoto] = useState(null);
  const [preview, setPreview] = useState(null);
  const fileRef = useRef();

  const carregar = () => {
    setLoading(true);
    getAchados()
      .then((r) => {
        const listaAchados = r.data?.dados || r.data || [];
        setAchados(listaAchados);
      })
      .catch(err => console.error("Erro ao carregar achados:", err))
      .finally(() => setLoading(false));
  };

  useEffect(() => { carregar(); }, []);

  const handleFoto = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setFoto(file);
    setPreview(URL.createObjectURL(file));
  };

  const handleCreate = async () => {
    if (!descricao || !sala) {
      alert("Preencha descrição e sala.");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("descricao", descricao);
      formData.append("sala", sala);
      if (foto) formData.append("foto", foto);

      await createAchado(formData);
 
      setDescricao("");
      setSala("");
      setFoto(null);
      setPreview(null);
      if (fileRef.current) fileRef.current.value = "";
      
      carregar();
    } catch (err) {
      alert("Erro ao cadastrar item.");
    }
  };

  const handleRetirado = async (id, retiradoAtual) => {
    try {
      await updateAchado(id, { retirado: !Boolean(retiradoAtual) });
      carregar();
    } catch (err) {
      alert("Erro ao atualizar status.");
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Remover este item?")) return;
    try {
      await deleteAchado(id);
      carregar();
    } catch (err) {
      alert("Erro ao excluir item.");
    }
  };
 
  const listaSegura = Array.isArray(achados) ? achados : [];

  return (
    <div className={styles.section}>
      <h3 className={styles.sectionTitle}>
        <Search size={14} style={{ marginRight: '8px' }}/> 
        Gerenciar Achados e Perdidos
      </h3>

      <div className={styles.formCard}>
        <p className={styles.formLabel}>Cadastrar novo item</p>
        <div className={styles.formGrid}>
          <input
            className={styles.input}
            placeholder="Descrição do item *"
            value={descricao}
            onChange={(e) => setDescricao(e.target.value)}
          />
          <input
            className={styles.input}
            placeholder="Sala onde se encontra *"
            value={sala}
            onChange={(e) => setSala(e.target.value)}
          />
        </div>

        <div className={styles.uploadArea}>
          <input
            ref={fileRef}
            type="file"
            accept="image/*"
            onChange={handleFoto}
            className={styles.fileInput}
            id="fotoInput"
          />
          <label htmlFor="fotoInput" className={styles.fileLabel}>
            {preview ? (
              <><Image size={14} style={{ marginRight: '8px' }} /> Trocar foto</>
            ) : (
              <><Camera size={14} style={{ marginRight: '8px' }} /> Adicionar foto (opcional)</>
            )}
          </label>
          {preview && (
            <div className={styles.previewContainer}>
               <img src={preview} alt="preview" className={styles.preview} />
               <button className={styles.btnRemoveFoto} onClick={() => {setFoto(null); setPreview(null); fileRef.current.value="";}}>
                 <Trash size={12} /> Remover
               </button>
            </div>
          )}
        </div>

        <button className={styles.btnAdd} onClick={handleCreate}>
          <PlusCircle size={14} style={{ marginRight: '8px' }} />
          Cadastrar Item
        </button>
      </div>

      <div className={styles.list}>
        {loading && <p>Carregando itens...</p>}
        
        {!loading && listaSegura.length === 0 && (
          <p className={styles.empty}>Nenhum item registrado.</p>
        )}

        {listaSegura.map((a) => (
          <div key={a.id} className={`${styles.item} ${a.retirado ? styles.itemRetirado : ""}`}>
            <div className={styles.itemFoto}>
              {a.foto_url ? (
                <img
                  src={`${API_URL}${a.foto_url}`}
                  alt={a.descricao}
                  className={styles.foto}
                />
              ) : (
                <div className={styles.semFoto}>
                  <BoxSeam size={24} color="#ccc" />
                </div>
              )}
            </div>

            <div className={styles.itemInfo}>
              <p className={styles.itemTitle}>{a.descricao}</p>
              <p className={styles.itemMeta}>
                <GeoAlt size={12} style={{ marginRight: '4px' }} /> {a.sala}
              </p>
              {a.retirado && <span className={styles.badgeRetirado}>ITEM ENTREGUE</span>}
            </div>

            <div className={styles.itemActions}>
              <button
                className={`${styles.btnStatus} ${a.retirado ? styles.retirado : styles.pendente}`}
                onClick={() => handleRetirado(a.id, a.retirado)}
              >
                {a.retirado ? (
                  <><ArrowCounterclockwise size={14} style={{ marginRight: '5px' }} /> Reabrir</>
                ) : (
                  <><CheckCircle size={14} style={{ marginRight: '5px' }} /> Marcar retirado</>
                )}
              </button>
              <button className={styles.btnDelete} onClick={() => handleDelete(a.id)}>
                <Trash size={14} style={{ marginRight: '5px' }} />
                Excluir
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}