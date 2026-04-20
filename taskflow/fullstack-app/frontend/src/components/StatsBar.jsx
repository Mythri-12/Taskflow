import React from 'react';
import styles from './StatsBar.module.css';

export default function StatsBar({ stats }) {
  const pct = stats.total > 0 ? Math.round((stats.done / stats.total) * 100) : 0;

  return (
    <div className={styles.bar}>
      <div className={styles.stat}>
        <span className={styles.val}>{stats.total}</span>
        <span className={styles.lbl}>Total</span>
      </div>
      <div className={styles.divider} />
      <div className={styles.stat}>
        <span className={`${styles.val} ${styles.todo}`}>{stats.todo}</span>
        <span className={styles.lbl}>To Do</span>
      </div>
      <div className={styles.divider} />
      <div className={styles.stat}>
        <span className={`${styles.val} ${styles.progress}`}>{stats.inProgress}</span>
        <span className={styles.lbl}>In Progress</span>
      </div>
      <div className={styles.divider} />
      <div className={styles.stat}>
        <span className={`${styles.val} ${styles.done}`}>{stats.done}</span>
        <span className={styles.lbl}>Done</span>
      </div>

      <div className={styles.progressSection}>
        <div className={styles.progressTrack}>
          <div
            className={styles.progressFill}
            style={{ width: `${pct}%` }}
          />
        </div>
        <span className={styles.pct}>{pct}%</span>
      </div>
    </div>
  );
}
