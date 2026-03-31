import { useState, useRef } from "react";
import { createTalento } from "../../services/talentosService";
import styles from "./Talentos.module.css";

const HABILIDADES_TI  = ["JavaScript", "Python", "React", "Node.js", "MySQL", "PHP", "Java", "Redes", "Hardware", "Linux", "CSS", "TypeScript"];
const HABILIDADES_ADM = ["Excel", "Word", "PowerPoint", "Gestão", "Marketing", "Contabilidade", "Finanças", "RH", "Logística", "Vendas", "Atendimento"];

export default function CadastroTalento({ onVoltar }) {
  const [form, setForm] = useState({
    nome: "", curso: "TI", ano: "1º",
    habilidades: [], linkedin: "", github: "",
  });
  const [foto, setFoto]           = useState(null);
  const [curriculo, setCurriculo] = useState(null);
  const [fotoPreview, setFotoPreview] = useState(null);
  const [enviado, setEnviado]     = useState(false);
  const [loading, setLoading]     = useState(false);
  const [erro, setErro]           = useState(null);
  const fotoRef                   = useRef();
  const curriculoRef              = useRef();

  const habilidadesOpts = form.curso === "TI" ? HABILIDADES_TI : HABILIDADES_ADM;

  const toggleHabilidade = (h) => {
    setForm((prev) => ({
      ...prev,
      habilidades: prev.habilidades.includes(h)
        ? prev.habilidades.filter((x) => x !== h)
        : [...prev.habilidades, h],
    }));
  };

  const handleEnviar = async () => {
    if (!form.nome || !form.habilidades.length) {
      setErro("Preencha nome e selecione ao menos uma habilidade.");
      return;
    }
    setLoading(true);
    setErro(null);
    try {
      const formData = new FormData();
      formData.append("nome",        form.nome);
      formData.append("curso",       form.curso);
      formData.append("ano",         form.ano);
      formData.append("habilidades", form.habilidades.join(", "));
      formData.append("linkedin",    form.linkedin);
      formData.append("github",      form.github);
      if (foto)      formData.append("foto",      foto);
      if (curriculo) formData.append("curriculo", curriculo);
      await createTalento(formData);
      setEnviado(true);
    } catch {
      setErro("Erro ao enviar. Tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  if (enviado) {
    return (
      <div>
        <button className={styles.btnVoltar} onClick={onVoltar}>← Voltar</button>
        <div className={styles.successCard}>
          <p className={styles.successIcon}>🎉</p>
          <p className={styles.successTitle}>Perfil enviado!</p>
          <p className={styles.successDesc}>
            Seu perfil está em análise e será publicado em breve pela equipe do colégio.
          </p>
          <button className={styles.btnCadastrar} onClick={onVoltar}>
            Ver banco de talentos
          </button>
        </div>
      </div>
    );
  }

  return (
    <div>
      <button className={styles.btnVoltar} onClick={onVoltar}>← Voltar</button>
      <h2 className="page-title">🌟 Cadastrar Perfil</h2>
      <p className="page-subtitle">Preencha suas informações para aparecer no Banco de Talentos.</p>

      <div className={styles.cadastroGrid}>

        <div className={styles.fotoCol}>
          <div
            className={styles.fotoUpload}
            onClick={() => fotoRef.current.click()}
          >
            {fotoPreview ? (
              <img src={fotoPreview} alt="preview" className={styles.fotoPreview} />
            ) : (
              <>
                <span className={styles.fotoIcon}>📷</span>
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
              if (f) { setFoto(f); setFotoPreview(URL.createObjectURL(f)); }
            }}
          />

          <div
            className={styles.curriculoUpload}
            onClick={() => curriculoRef.current.click()}
          >
            <span>{curriculo ? `📄 ${curriculo.name}` : "📄 Anexar currículo (PDF)"}</span>
          </div>
          <input
            ref={curriculoRef}
            type="file"
            accept="application/pdf"
            style={{ display: "none" }}
            onChange={(e) => setCurriculo(e.target.files[0] || null)}
          />
        </div>

        {/* Coluna direita — dados */}
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
                    className={`${styles.cursoBtn} ${form.curso === c ? styles.cursoBtnActive : ""}`}
                    onClick={() => setForm({ ...form, curso: c, habilidades: [] })}
                  >
                    {c === "TI" ? "💻 TI" : "📊 ADM"}
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
            <label className={styles.fieldLabel}>Habilidades * (selecione as que domina)</label>
            <div className={styles.habilidadesOpts}>
              {habilidadesOpts.map((h) => (
                <button
                  key={h}
                  className={`${styles.habBtn} ${form.habilidades.includes(h) ? styles.habBtnActive : ""}`}
                  onClick={() => toggleHabilidade(h)}
                >
                  {h}
                </button>
              ))}
            </div>
          </div>

          <div className={styles.rowGroup}>
            <div className={styles.fieldGroup}>
              <label className={styles.fieldLabel}>LinkedIn</label>
              <input
                className={styles.input}
                placeholder="https://linkedin.com/in/..."
                value={form.linkedin}
                onChange={(e) => setForm({ ...form, linkedin: e.target.value })}
              />
            </div>
            <div className={styles.fieldGroup}>
              <label className={styles.fieldLabel}>GitHub</label>
              <input
                className={styles.input}
                placeholder="https://github.com/..."
                value={form.github}
                onChange={(e) => setForm({ ...form, github: e.target.value })}
              />
            </div>
          </div>

          {erro && <p className={styles.erro}>{erro}</p>}

          <div className={styles.anonCard}>
            🔒 Seus dados passarão por moderação antes de serem publicados.
          </div>

          <button
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