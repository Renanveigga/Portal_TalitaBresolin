import { useState } from "react";
import styles from "./Library.module.css";
import BookCard from "../../components/BookCard/BookCard";
import { BOOKS } from "../../data/mockData";

export default function Library() {
  const [search, setSearch] = useState("");

  const filtered = BOOKS.filter((b) =>
    b.titulo.toLowerCase().includes(search.toLowerCase()) ||
    b.autor.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div>
      <h2 className="page-title">📚 Biblioteca</h2>
      <p className="page-subtitle">
        Consulte o acervo de livros e materiais pedagógicos disponíveis.
      </p>

      <input
        className={styles.searchInput}
        placeholder="Buscar por título ou autor..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      {filtered.length === 0 ? (
        <p className={styles.empty}>Nenhum livro encontrado para "{search}".</p>
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