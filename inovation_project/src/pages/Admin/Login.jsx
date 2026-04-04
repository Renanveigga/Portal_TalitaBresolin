import { useState } from "react";
import { login } from "../../services/authService";
import styles from "./Admin.module.css";

export default function Login({ onLogin }) {
  const [senha, setSenha] = useState("");
  const [erro, setErro] = useState(null);
  const [loading, setLoading] = useState(false);

 const handleSubmit = async () => {
  setLoading(true);
  try {
    const response = await login(senha);
 
    console.log("Resposta do Login:", response.data);
 
    const tokenGerado = response.data.token || response.data.dados?.token;
    
    if (tokenGerado) {
      localStorage.setItem("token", tokenGerado);
      onLogin();  
    } else {
      setErro("Erro: Servidor não enviou o token de acesso.");
    }
  } catch (err) {
    setErro("Senha incorreta.");
  } finally {
    setLoading(false);
  }
};

  return (
    <div className={styles.loginWrapper}>
      <div className={styles.loginCard}>
        <div className={styles.loginIcon}>🔐</div>
        <h2 className={styles.loginTitle}>Painel Admin</h2>
        <p className={styles.loginSub}>Digite a senha para acessar</p>

        <input
          className={styles.loginInput}
          type="password"
          placeholder="Senha"
          value={senha}
          onChange={(e) => setSenha(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
        />

        {erro && <p className={styles.loginErro}>{erro}</p>}

        <button
          className={styles.loginBtn}
          onClick={handleSubmit}
          disabled={loading}
        >
          {loading ? "Entrando..." : "Entrar"}
        </button>
      </div>
    </div>
  );
}