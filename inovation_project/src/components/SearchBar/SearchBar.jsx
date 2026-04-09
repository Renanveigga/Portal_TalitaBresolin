import { useState, useEffect, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../services/api";
import {
  Search,
  Megaphone,
  Book,
  HandIndexThumb,
  Stars,
  Trophy,
  X,
  ArrowClockwise,
  CalendarEvent,
  GeoAlt,
  ChevronRight,
  ExclamationCircle,
} from "react-bootstrap-icons";
import styles from "./SearchBar.module.css";

 

const TIPO_COLORS = {
  evento: "#2E86C1",
  prova: "#C0392B",
  feriado: "#8E44AD",
  palestra: "#1E8449",
};

const CATEGORIAS_CONFIG = [
  { key: "avisos", label: "Avisos", Icon: Megaphone, rota: "/" },
  { key: "livros", label: "Biblioteca", Icon: Book, rota: "/biblioteca" },
  { key: "achados", label: "Achados e Perdidos", Icon: HandIndexThumb, rota: "/achados" },
  { key: "talentos", label: "Banco de Talentos", Icon: Stars, rota: "/talentos" },
  { key: "esportes", label: "Esportes", Icon: Trophy, rota: "/esportes" },
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
  const [query, setQuery] = useState("");
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState(null);
  const [aberto, setAberto] = useState(false);
  const navigate = useNavigate();
  const wrapperRef = useRef();
  const inputRef = useRef();

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

const executarBusca = useCallback(async (termo) => {
 
  if (!termo || termo.trim().length < 1) {
    setResults(null);
    setAberto(false);
    setErro(null);
    return;
  }

  setLoading(true);
  setErro(null);

  try {
    
    const response = await api.get("/busca", {
      params: { q: termo.trim() }
    });
 
    const data = response.data.dados || response.data;
    
    setResults(data);
    setAberto(true);
  } catch (err) {
    console.error("Erro na busca:", err);
    setErro("Não foi possível carregar os resultados.");
    setResults(null);
  } finally {
    setLoading(false);
  }
}, []);

  useEffect(() => {
    executarBusca(debouncedQuery);
  }, [debouncedQuery, executarBusca]);

  const total = results
    ? Object.values(results).reduce((acc, arr) => acc + (Array.isArray(arr) ? arr.length : 0), 0)
    : 0;

  const handleNavegar = (rota) => {
    setAberto(false);
    setQuery("");
    setResults(null);
    navigate(rota);
  };

  const handleLimpar = () => {
    setQuery("");
    setResults(null);
    setErro(null);
    setAberto(false);
    inputRef.current?.focus();
  };

  return (
    <div className={styles.wrapper} ref={wrapperRef}>

      <div className={`${styles.inputBox} ${aberto ? styles.inputBoxAberto : ""}`}>
        <Search className={styles.searchIcon} size={16} />

        <input
          ref={inputRef}
          className={styles.input}
          placeholder="Buscar livros, avisos, achados, talentos..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => results && total > 0 && setAberto(true)}
          autoComplete="off"
          spellCheck={false}
        />

        {loading && (
          <ArrowClockwise className={styles.spinner} size={16} />
        )}

        {query && !loading && (
          <button className={styles.clear} onClick={handleLimpar} aria-label="Limpar busca">
            <X size={18} />
          </button>
        )}
      </div>

      {aberto && (
        <div className={styles.dropdown}>

          {erro && (
            <div className={styles.erroState}>
              <ExclamationCircle size={20} className={styles.erroIcon} />
              <p className={styles.erroText}>{erro}</p>
              <button className={styles.erroBtn} onClick={() => executarBusca(query)}>
                Tentar novamente
              </button>
            </div>
          )}

          {!erro && results && total === 0 && (
            <div className={styles.emptyState}>
              <Search size={32} className={styles.emptyIcon} />
              <p className={styles.emptyText}>Nenhum resultado para</p>
              <p className={styles.emptyQuery}>"{query}"</p>
            </div>
          )}

          {!erro && results && total > 0 && (
            <>
              <div className={styles.dropdownHeader}>
                <span className={styles.totalLabel}>
                  {total} resultado{total !== 1 ? "s" : ""}
                </span>
                <span className={styles.queryLabel}>"{query}"</span>
              </div>

              {CATEGORIAS_CONFIG.map(({ key, label, rota, Icon }) => {
                const items = results[key];
                if (!Array.isArray(items) || items.length === 0) return null;

                return (
                  <div key={key} className={styles.group}>
                    <div className={styles.groupHeader}>
                      <span className={styles.groupLabel}>
                        <Icon size={13} />
                        {label}
                      </span>
                      <button
                        className={styles.groupVerTodos}
                        onClick={() => handleNavegar(rota)}
                      >
                        Ver todos <ChevronRight size={11} />
                      </button>
                    </div>

                    {items.map((item) => (
                      <button
                        key={item.id}
                        className={styles.resultItem}
                        onClick={() => handleNavegar(rota)}
                      >
                        <ResultItemContent itemKey={key} item={item} />
                        <ChevronRight className={styles.arrow} size={12} />
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

function ResultItemContent({ itemKey, item }) {
  switch (itemKey) {

    case "avisos":
      return (
        <>
          <span
            className={styles.badge}
            style={{ background: TIPO_COLORS[item.tipo] ?? "#888" }}
          >
            {item.tipo}
          </span>
          <div className={styles.resultInfo}>
            <span className={styles.resultTitle}>{item.titulo}</span>
            <span className={styles.resultSub}>
              <CalendarEvent size={11} />
              {item.data?.slice(0, 10) ?? "—"}
            </span>
          </div>
        </>
      );

    case "livros": {
      const disp = Boolean(Number(item.disponivel));
      return (
        <>
          <span className={`${styles.badge} ${disp ? styles.disp : styles.emp}`}>
            {disp ? "Disponível" : "Emprestado"}
          </span>
          <div className={styles.resultInfo}>
            <span className={styles.resultTitle}>{item.titulo}</span>
            <span className={styles.resultSub}>
              {item.autor} · {item.categoria}
            </span>
          </div>
        </>
      );
    }

    case "achados":
      return (
        <>
          <span className={`${styles.badge} ${item.retirado ? styles.emp : styles.disp}`}>
            {item.retirado ? "Retirado" : "Aguardando"}
          </span>
          <div className={styles.resultInfo}>
            <span className={styles.resultTitle}>{item.descricao}</span>
            <span className={styles.resultSub}>
              <GeoAlt size={11} />
              {item.sala}
            </span>
          </div>
        </>
      );

    case "talentos":
      return (
        <>
          <span
            className={`${styles.badge} ${item.curso === "TI" ? styles.badgeTI : styles.badgeADM}`}
          >
            {item.curso}
          </span>
          <div className={styles.resultInfo}>
            <span className={styles.resultTitle}>{item.nome}</span>
            <span className={styles.resultSub}>
              {item.habilidades?.split(",").slice(0, 2).map((h) => h.trim()).join(", ")}
            </span>
          </div>
        </>
      );

    case "esportes":
      return (
        <>
          <span className={styles.badge} style={{ background: "#F1C40F", color: "#7D6608" }}>
            <Trophy size={11} />
          </span>
          <div className={styles.resultInfo}>
            <span className={styles.resultTitle}>{item.titulo}</span>
            <span className={styles.resultSub}>
              {item.modalidade} · {item.data_evento?.slice(0, 10)}
            </span>
          </div>
        </>
      );

    default:
      return null;
  }
}