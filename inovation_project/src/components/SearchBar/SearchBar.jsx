import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { buscar } from "../../services/buscaService";
import styles from "./SearchBar.module.css";

const TIPO_COLORS = {
  evento:   "#2E86C1",
  prova:    "#C0392B",
  feriado:  "#8E44AD",
  palestra: "#1E8449",
};

const CATEGORIAS_CONFIG = [
  { key: "avisos",   label: "📋 Avisos",            rota: "/"          },
  { key: "livros",   label: "📚 Biblioteca",         rota: "/biblioteca"},
  { key: "achados",  label: "🔍 Achados e Perdidos", rota: "/achados"   },
  { key: "talentos", label: "🌟 Banco de Talentos",  rota: "/talentos"  },
];

function useDebounce(value, delay) {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const timer = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);
  return debounced;
}

export default function SearchBar() {
  const [query, setQuery]     = useState("");
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const [aberto, setAberto]   = useState(false);
  const navigate              = useNavigate();
  const wrapperRef            = useRef();

  const debouncedQuery = useDebounce(query, 400);

  useEffect(() => {
    const handler = (e) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {
        setAberto(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  useEffect(() => {
    if (debouncedQuery.trim().length < 2) {
      setResults(null);
      setAberto(false);
      return;
    }
    setLoading(true);
    buscar(debouncedQuery)
      .then((res) => {
        setResults(res.data);
        setAberto(true);
      })
      .finally(() => setLoading(false));
  }, [debouncedQuery]);

  const total = results
    ? Object.values(results).reduce((acc, arr) => acc + arr.length, 0)
    : 0;

  const handleNavegar = (rota) => {
    setAberto(false);
    setQuery("");
    navigate(rota);
  };

  return (
    <div className={styles.wrapper} ref={wrapperRef}>
      <div className={styles.inputBox}>
        <span className={styles.icon}>🔍</span>
        <input
          className={styles.input}
          placeholder="Pesquisa universal — livros, avisos, achados, talentos..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => results && setAberto(true)}
        />
        {loading && <span className={styles.spinner}>⏳</span>}
        {query && (
          <button className={styles.clear}
            onClick={() => { setQuery(""); setResults(null); }}>✕</button>
        )}
      </div>

      {aberto && results && (
        <div className={styles.dropdown}>

          {total === 0 ? (
            <div className={styles.emptyState}>
              <p className={styles.emptyIcon}>🔍</p>
              <p className={styles.emptyText}>Nenhum resultado para "{query}"</p>
            </div>
          ) : (
            <>

              <div className={styles.dropdownHeader}>
                <span className={styles.totalLabel}>{total} resultado{total !== 1 ? "s" : ""} encontrado{total !== 1 ? "s" : ""}</span>
                <span className={styles.queryLabel}>"{query}"</span>
              </div>

              {CATEGORIAS_CONFIG.map(({ key, label, rota }) => {
                const items = results[key];
                if (!items?.length) return null;
                return (
                  <div key={key} className={styles.group}>
                    <div className={styles.groupHeader}>
                      <span className={styles.groupLabel}>{label}</span>
                      <button className={styles.groupVerTodos}
                        onClick={() => handleNavegar(rota)}>
                        Ver todos →
                      </button>
                    </div>

                    {items.map((item) => (
                      <button key={item.id} className={styles.resultItem}
                        onClick={() => handleNavegar(rota)}>

                        {key === "avisos" && (
                          <>
                            <span className={styles.badge}
                              style={{ background: TIPO_COLORS[item.tipo] ?? "#888" }}>
                              {item.tipo}
                            </span>
                            <div className={styles.resultInfo}>
                              <span className={styles.resultTitle}>{item.titulo}</span>
                              <span className={styles.resultSub}>📅 {item.data?.slice(0, 10)}</span>
                            </div>
                          </>
                        )}

                        {key === "livros" && (
                          <>
                            <span className={`${styles.badge} ${Boolean(item.disponivel) ? styles.disp : styles.emp}`}>
                              {Boolean(item.disponivel) ? "Disponível" : "Emprestado"}
                            </span>
                            <div className={styles.resultInfo}>
                              <span className={styles.resultTitle}>{item.titulo}</span>
                              <span className={styles.resultSub}>{item.autor} · {item.categoria}</span>
                            </div>
                          </>
                        )}

                        {key === "achados" && (
                          <>
                            <span className={`${styles.badge} ${item.retirado ? styles.emp : styles.disp}`}>
                              {item.retirado ? "Retirado" : "Aguardando"}
                            </span>
                            <div className={styles.resultInfo}>
                              <span className={styles.resultTitle}>{item.descricao}</span>
                              <span className={styles.resultSub}>📍 {item.sala}</span>
                            </div>
                          </>
                        )}

                        {key === "talentos" && (
                          <>
                            <span className={`${styles.badge} ${item.curso === "TI" ? styles.badgeTI : styles.badgeADM}`}>
                              {item.curso}
                            </span>
                            <div className={styles.resultInfo}>
                              <span className={styles.resultTitle}>{item.nome}</span>
                              <span className={styles.resultSub}>{item.habilidades?.split(",").slice(0,2).join(", ")}</span>
                            </div>
                          </>
                        )}

                        <span className={styles.arrow}>→</span>
                      </button>
                    ))}
                  </div>
                );
              })}
            </>
          )}
        </div>
      )}
    </div>
  );
}