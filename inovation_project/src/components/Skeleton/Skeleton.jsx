import styles from "./Skeleton.module.css";

export function SkeletonLine({ width = "100%", height = "14px" }) {
  return <div className={styles.line} style={{ width, height }} />;
}

export function SkeletonCard() {
  return (
    <div className={styles.card}>
      <div className={styles.header}>
        <div className={styles.avatar} />
        <div className={styles.headerInfo}>
          <SkeletonLine width="140px" height="13px" />
          <SkeletonLine width="80px"  height="11px" />
        </div>
      </div>
      <div className={styles.image} />
      <div className={styles.body}>
        <SkeletonLine width="90%"  height="14px" />
        <SkeletonLine width="70%"  height="14px" />
        <SkeletonLine width="50%"  height="12px" />
      </div>
    </div>
  );
}