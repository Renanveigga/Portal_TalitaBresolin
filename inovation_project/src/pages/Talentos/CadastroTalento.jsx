import { useState, useRef } from "react";
import { createTalento } from "../../services/talentosService";
import styles from "./Talentos.module.css";
import { marked } from "marked";
import { 
  CameraFill, Laptop, SuitcaseLgFill, LaptopFill, 
  StarFill, FileEarmarkRichtextFill, PatchCheckFill, 
  EyeFill, PencilFill, ArrowLeft 
} from "react-bootstrap-icons";

const HABILIDADES_TI = ["JavaScript", "Python", "React", "Node.js", "MySQL", "PHP", "Java", "Redes", "Hardware", "Linux", "CSS", "TypeScript", "Git", "Docker"];
const HABILIDADES_ADM = ["Excel", "Word", "PowerPoint", "Gestão", "Marketing", "Contabilidade", "Finanças", "RH", "Logística", "Vendas", "Atendimento", "SAP"];

const REDES = [
  { key: "linkedin", label: "LinkedIn", placeholder: "https://linkedin.com/in/...", icon: <SuitcaseLgFill /> },
  { key: "github", label: "GitHub", placeholder: "https://github.com/...", icon: <Laptop /> },
  { key: "instagram", label: "Instagram", placeholder: "https://instagram.com/...", icon: <CameraFill /> },
];

export default function CadastroTalento({ onVoltar }) {
  const [form, setForm] = useState({
    nome: "", curso: "TI", ano: "1º",
    habilidades: [],
    habPersonalizada: "",
    linkedin: "", github: "", instagram: "", email: "",
    bio: "",
  });

  const [foto, setFoto] = useState(null);
  const [curriculo, setCurriculo] = useState(null);
  const [fotoPreview, setFotoPreview] = useState(null);
  const [enviado, setEnviado] = useState(false);
  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState(null);
  const [bioPreview, setBioPreview] = useState(false);
  
  const fotoRef = useRef();
  const curriculoRef = useRef();

  const habilidadesOpts = form.curso === "TI" ? HABILIDADES_TI : HABILIDADES_ADM;

  const toggleHabilidade = (h) => {
    setForm((prev) => ({
      ...prev,
      habilidades: prev.habilidades.includes(h)
        ? prev.habilidades.filter((x) => x !== h)
        : [...prev.habilidades, h],
    }));
  };

  const addHabPersonalizada = () => {
    const h = form.habPersonalizada.trim();
    if (!h || form.habilidades.includes(h)) return;
    setForm((prev) => ({
      ...prev,
      habilidades: [...prev.habilidades, h],
      habPersonalizada: "",
    }));
  };

  const removeHabilidade = (h) => {
    setForm((prev) => ({
      ...prev,
      habilidades: prev.habilidades.filter((x) => x !== h),
    }));
  };

  const handleEnviar = async (e) => {
    if (e) e.preventDefault();
    
    if (!form.nome || form.habilidades.length === 0) {
      setErro("Preencha o nome e selecione ao menos uma habilidade.");
      return;
    }

    setLoading(true);
    setErro(null);

    try {
      const formData = new FormData();
 
      formData.append("nome", form.nome.trim());
      formData.append("curso", form.curso);
      formData.append("ano", form.ano);
      formData.append("habilidades", form.habilidades.join(", "));
 
      if (form.linkedin) formData.append("linkedin", form.linkedin.trim());
      if (form.github) formData.append("github", form.github.trim());
      if (form.instagram) formData.append("instagram", form.instagram.trim());
      if (form.email) formData.append("email", form.email.trim());
      if (form.bio) formData.append("bio", form.bio);
 
      if (foto) formData.append("foto", foto);
      if (curriculo) formData.append("curriculo", curriculo);

      const response = await createTalento(formData);
      console.log("Sucesso:", response.data);
      setEnviado(true);
    } catch (err) {
 
      console.error("Erro completo do Axios:", err);
      const mensagemErro = err.response?.data?.mensagem || err.response?.data?.error || "Erro interno no servidor (500).";
      setErro(mensagemErro);
    } finally {
      setLoading(false);
    }
  };

  if (enviado) {
    return (
      <div className={styles.container}>
        <button className={styles.btnVoltar} onClick={onVoltar}>← Voltar</button>
        <div className={styles.successCard}>
          <p className={styles.successIcon}><PatchCheckFill /></p>
          <p className={styles.successTitle}>Perfil enviado!</p>
          <p className={styles.successDesc}>
            Seu perfil está em análise e será publicado em breve.
          </p>
          <button className={styles.btnCadastrar} onClick={onVoltar}>
            Ver banco de talentos
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <button className={styles.btnVoltar} onClick={onVoltar}>← Voltar</button>
      <h2 className="page-title"><StarFill /> Cadastrar Perfil</h2>
      <p className="page-subtitle">
        Preencha suas informações para aparecer no Banco de Talentos.
      </p>

      <div className={styles.cadastroGrid}>
 
        <div className={styles.fotoCol}>
          <div className={styles.fotoUpload} onClick={() => fotoRef.current.click()}>
            {fotoPreview ? (
              <img src={fotoPreview} alt="preview" className={styles.fotoPreview} />
            ) : (
              <>
                <span className={styles.fotoIcon}><CameraFill /></span>
                <p className={styles.fotoText}>Clique para adicionar foto</p>
                <p className={styles.fotoSub}>JPG, PNG — máx 3MB</p>
              </>
            )}
          </div>
          <input 
            ref={fotoRef} 
            type="file" 
            accept="image/*" 
            style={{ display: "none" }}
            onChange={(e) => {
              const f = e.target.files[0];
              if (f) { 
                setFoto(f); 
                setFotoPreview(URL.createObjectURL(f)); 
              }
            }}
          />

          <div className={styles.curriculoUpload} onClick={() => curriculoRef.current.click()}>
            <FileEarmarkRichtextFill /> {curriculo ? curriculo.name : "Anexar currículo (PDF)"}
          </div>
          <input 
            ref={curriculoRef} 
            type="file" 
            accept="application/pdf"
            style={{ display: "none" }}
            onChange={(e) => setCurriculo(e.target.files[0] || null)}
          />
        </div>
 
        <div className={styles.dadosCol}>
          <div className={styles.fieldGroup}>
            <label className={styles.fieldLabel}>Nome completo *</label>
            <input 
              className={styles.input} 
              placeholder="Seu nome completo"
              value={form.nome} 
              onChange={(e) => setForm({ ...form, nome: e.target.value })} 
            />
          </div>

          <div className={styles.rowGroup}>
            <div className={styles.fieldGroup}>
              <label className={styles.fieldLabel}>Curso *</label>
              <div className={styles.cursoBtns}>
                {["TI", "ADM"].map((c) => (
                  <button 
                    key={c}
                    type="button"
                    className={`${styles.cursoBtn} ${form.curso === c ? styles.cursoBtnActive : ""}`}
                    onClick={() => setForm({ ...form, curso: c, habilidades: [] })}
                  >
                    {c === "TI" ? <LaptopFill style={{ marginRight: '8px' }} /> : <SuitcaseLgFill style={{ marginRight: '8px' }} />}
                    {c}
                  </button>
                ))}
              </div>
            </div>
            <div className={styles.fieldGroup}>
              <label className={styles.fieldLabel}>Ano *</label>
              <div className={styles.cursoBtns}>
                {["1º", "2º", "3º"].map((a) => (
                  <button 
                    key={a}
                    type="button"
                    className={`${styles.cursoBtn} ${form.ano === a ? styles.cursoBtnActive : ""}`}
                    onClick={() => setForm({ ...form, ano: a })}
                  >
                    {a}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className={styles.fieldGroup}>
            <label className={styles.fieldLabel}>Habilidades *</label>
            <div className={styles.habilidadesOpts}>
              {habilidadesOpts.map((h) => (
                <button 
                  key={h}
                  type="button"
                  className={`${styles.habBtn} ${form.habilidades.includes(h) ? styles.habBtnActive : ""}`}
                  onClick={() => toggleHabilidade(h)}
                >
                  {h}
                </button>
              ))}
            </div>
          </div>

          <div className={styles.fieldGroup}>
            <label className={styles.fieldLabel}>Adicionar habilidade personalizada</label>
            <div className={styles.habCustomRow}>
              <input
                className={styles.input}
                placeholder="Ex: Photoshop, Inglês..."
                value={form.habPersonalizada}
                onChange={(e) => setForm({ ...form, habPersonalizada: e.target.value })}
                onKeyDown={(e) => e.key === "Enter" && addHabPersonalizada()}
              />
              <button type="button" className={styles.btnAddHab} onClick={addHabPersonalizada}>
                + Adicionar
              </button>
            </div>

            {form.habilidades.length > 0 && (
              <div className={styles.habSelecionadas}>
                <div className={styles.habilidades}>
                  {form.habilidades.map((h) => (
                    <span key={h} className={styles.habTagRemovivel}>
                      {h}
                      <button type="button" className={styles.habRemove} onClick={() => removeHabilidade(h)}>×</button>
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className={styles.fieldGroup}>
            <div className={styles.bioHeader}>
              <label className={styles.fieldLabel}>Bio (suporta Markdown)</label>
              <button
                type="button"
                className={styles.bioToggle}
                onClick={() => setBioPreview((p) => !p)}
              >
                {bioPreview ? <><PencilFill style={{ marginRight: '8px' }} />Editar</> : <><EyeFill style={{ marginRight: '8px' }} />Preview</>}
              </button>
            </div>

            {bioPreview ? (
              <div
                className={styles.bioPreview}
                dangerouslySetInnerHTML={{
                  __html: form.bio ? marked.parse(form.bio) : "<p>Nada para mostrar...</p>",
                }}
              />
            ) : (
              <textarea
                className={styles.textarea}
                placeholder="Fale sobre suas experiências..."
                value={form.bio}
                onChange={(e) => setForm({ ...form, bio: e.target.value })}
                rows={6}
              />
            )}
          </div>

          <div className={styles.fieldGroup}>
            <label className={styles.fieldLabel}>E-mail de contato</label>
            <input 
              className={styles.input} 
              placeholder="seu@email.com" 
              type="email"
              value={form.email} 
              onChange={(e) => setForm({ ...form, email: e.target.value })} 
            />
          </div>

          <div className={styles.fieldGroup}>
            <label className={styles.fieldLabel}>Redes sociais</label>
            <div className={styles.redesGrid}>
              {REDES.map((r) => (
                <div key={r.key} className={styles.redeItem}>
                  <span className={styles.redeIcon}>{r.icon}</span>
                  <input
                    className={styles.input}
                    placeholder={r.placeholder}
                    value={form[r.key]}
                    onChange={(e) => setForm({ ...form, [r.key]: e.target.value })}
                  />
                </div>
              ))}
            </div>
          </div>

          {erro && <p className={styles.erro}>{erro}</p>}

          <div className={styles.anonCard}>
            <SuitcaseLgFill style={{ marginRight: '10px' }} />
            Dados passarão por moderação antes de serem publicados.
          </div>

          <button
            type="button"
            className={styles.btnEnviarCadastro}
            onClick={handleEnviar}
            disabled={loading}
          >
            {loading ? "Enviando..." : "Enviar para aprovação"}
          </button>
        </div>
      </div>
    </div>
  );
}