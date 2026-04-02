import { useState, useEffect, useRef, useCallback } from "react";
import styles from "./Home.module.css";
import Hero from "../../components/Hero/Hero";
import AvisoCard from "../../components/AvisoCard/AvisoCard";
import StatCard from "../../components/StatCard/StatCard";
import FeedCard from "../../components/FeedCard/FeedCard";
import { getAvisos } from "../../services/avisosService";
import { getStats } from "../../services/statsService";
import { getFeed } from "../../services/feedService";

export default function Home() {
  const [avisos, setAvisos]       = useState([]);
  const [stats, setStats]         = useState(null);
  const [feed, setFeed]           = useState([]);
  const [page, setPage]           = useState(1);
  const [hasMore, setHasMore]     = useState(true);
  const [loadingFeed, setLoadingFeed] = useState(false);
  const [loadingInit, setLoadingInit] = useState(true);
  const [abaAtiva, setAbaAtiva]   = useState("feed");
  const observerRef               = useRef();
  const sentinelRef               = useRef();

  useEffect(() => {
    Promise.all([getAvisos(), getStats()])
      .then(([avisosRes, statsRes]) => {
        setAvisos(avisosRes.data);
        setStats(statsRes.data);
      })
      .finally(() => setLoadingInit(false));
  }, []);

  const carregarFeed = useCallback(async (pagina = 1) => {
    if (loadingFeed) return;
    setLoadingFeed(true);
    try {
      const res = await getFeed(pagina);
      setFeed((prev) => pagina === 1 ? res.data.items : [...prev, ...res.data.items]);
      setHasMore(res.data.hasMore);
      setPage(pagina);
    } finally {
      setLoadingFeed(false);
    }
  }, [loadingFeed]);

  useEffect(() => { carregarFeed(1); }, []);

  useEffect(() => {
    if (abaAtiva !== "feed") return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !loadingFeed) {
          carregarFeed(page + 1);
        }
      },
      { threshold: 0.1 }
    );
    if (sentinelRef.current) observer.observe(sentinelRef.current);
    observerRef.current = observer;
    return () => observer.disconnect();
  }, [hasMore, loadingFeed, page, abaAtiva]);

  return (
    <div>
      <Hero />

      {stats && (
        <div className={styles.statsGrid}>
          <StatCard icon="📚" label="Livros no acervo"
            value={stats.livros.total} sub={`${stats.livros.disponiveis} disponíveis`} cor="#2E86C1" />
          <StatCard icon="🔍" label="Achados e Perdidos"
            value={stats.achados.total} sub={`${stats.achados.pendentes} aguardando`} cor="#E67E22" />
          <StatCard icon="📋" label="Avisos publicados"
            value={stats.avisos.total} cor="#8E44AD" />
          <StatCard icon="🎓" label="Cursos técnicos"
            value={stats.cursos.total} sub={`${stats.cursos.professores} professores`} cor="#27AE60" />
        </div>
      )}

      <div className={styles.tabs}>
        <button
          className={`${styles.tab} ${abaAtiva === "feed" ? styles.tabActive : ""}`}
          onClick={() => setAbaAtiva("feed")}
        >
          🏠 Feed geral
        </button>
        <button
          className={`${styles.tab} ${abaAtiva === "avisos" ? styles.tabActive : ""}`}
          onClick={() => setAbaAtiva("avisos")}
        >
          📋 Avisos
        </button>
      </div>

      {abaAtiva === "feed" && (
        <div className={styles.feedSection}>
          <div className={styles.feedList}>
            {feed.map((item, i) => (
              <FeedCard key={`${item.tipo_feed}-${item.id}-${i}`} item={item} />
            ))}
          </div>

          <div ref={sentinelRef} className={styles.sentinel} />

          {loadingFeed && (
            <div className={styles.loadingFeed}>
              <div className={styles.loadingDots}>
                <span /><span /><span />
              </div>
            </div>
          )}

          {!hasMore && feed.length > 0 && (
            <p className={styles.feedFim}>✓ Você está em dia com tudo!</p>
          )}
        </div>
      )}

      {abaAtiva === "avisos" && (
        <div>
          {loadingInit && <p className="page-subtitle">Carregando...</p>}
          <div className={styles.avisosList}>
            {avisos.map((aviso) => (
              <AvisoCard key={aviso.id} aviso={aviso} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}