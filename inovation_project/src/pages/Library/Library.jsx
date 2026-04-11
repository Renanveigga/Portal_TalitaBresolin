import { useState, useEffect } from "react";
import styles from "./Library.module.css";
import BookCard from "../../components/BookCard/BookCard";
import { getLivros } from "../../services/livrosService";
import { CATEGORIAS } from "../../data/categorias";
import { Collection, Check2, XLg } from "react-bootstrap-icons";

export default function Library() {
  const [livros, setLivros]         = useState([]);
  const [loading, setLoading]       = useState(true);
  const [search, setSearch]         = useState("");
  const [categoria, setCategoria]   = useState("Todas");
  const [disponivel, setDisponivel] = useState("todos");

  useEffect(() => {
    getLivros()
      .then((res) => {
 
        const listaLivros = res.data?.dados || res.data || [];
        setLivros(listaLivros);
      })
      .catch(err => console.error("Erro ao carregar livros:", err))
      .finally(() => setLoading(false));
  }, []);

 
  const filtered = (Array.isArray(livros) ? livros : []).filter((b) => {
 
    const titulo = b.titulo || "";
    const autor = b.autor || "";

    const matchSearch = titulo.toLowerCase().includes(search.toLowerCase()) ||
                        autor.toLowerCase().includes(search.toLowerCase());
    
    const matchCat    = categoria === "Todas" || b.categoria === categoria;
 
    const disp        = Boolean(b.disponivel);
    
    const matchDisp   = disponivel === "todos" ||
                        (disponivel === "disponivel" && disp) ||
                        (disponivel === "emprestado" && !disp);

    return matchSearch && matchCat && matchDisp;
  });

  const limparFiltros = () => {
    setSearch("");
    setCategoria("Todas");
    setDisponivel("todos");
  };

  const temFiltro = search || categoria !== "Todas" || disponivel !== "todos";

  return (
    <div>
      <h2 className="page-title"><Collection style={{ fontSize: "14px" }} /> Biblioteca</h2>
      <p className="page-subtitle">
        Consulte o acervo de livros e materiais pedagógicos disponíveis.
      </p>

      <input
        className={styles.searchInput}
        placeholder="Buscar por título ou autor..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      <div className={styles.filters}>
        <div className={styles.filterGroup}>
          <p className={styles.filterLabel}>Categoria</p>
          <select
            className={styles.filterSelect}
            value={categoria}
            onChange={(e) => setCategoria(e.target.value)}
          >
            <option value="Todas">Todas</option>
            {CATEGORIAS.map((cat) => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>

        <div className={styles.filterGroup}>
          <p className={styles.filterLabel}>Disponibilidade</p>
          <div className={styles.filterBtns}>
            {[
              { value: "todos",      label: "Todos"        },
              { value: "disponivel", label: <><Check2 style={{ fontSize: "10px", marginRight: "4px" }}/>Disponível </> },
              { value: "emprestado", label: <><XLg style={{ fontSize: "10px", marginRight: "4px" }}/>Emprestado </> },
            ].map((op) => (
              <button
                key={op.value}
                className={`${styles.filterBtn} ${disponivel === op.value ? styles.filterBtnActive : ""}`}
                onClick={() => setDisponivel(op.value)}
              >
                {op.label}
              </button>
            ))}
          </div>
        </div>

        {temFiltro && (
          <button className={styles.clearBtn} onClick={limparFiltros}>
            ✕ Limpar filtros
          </button>
        )}
      </div>

      <p className={styles.contador}>
        {loading
          ? "Carregando..."
          : `${filtered.length} livro${filtered.length !== 1 ? "s" : ""} encontrado${filtered.length !== 1 ? "s" : ""}`}
      </p>

      {filtered.length === 0 && !loading ? (
        <p className={styles.empty}>Nenhum livro encontrado com esses filtros.</p>
      ) : (
        <div className={styles.grid}>
          {filtered.map((book) => (
            <BookCard key={book.id} book={book} />
          ))}
        </div>
      )}
    </div>
  );
}