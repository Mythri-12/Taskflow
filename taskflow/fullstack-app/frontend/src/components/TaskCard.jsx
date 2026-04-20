import React, { useState } from 'react';
import styles from './TaskCard.module.css';

const STATUS_META = {
  'todo':        { label: 'To Do',       color: styles.statusTodo },
  'in-progress': { label: 'In Progress', color: styles.statusProgress },
  'done':        { label: 'Done',        color: styles.statusDone },
};

const PRIORITY_META = {
  high:   { label: 'High',   color: styles.priorityHigh },
  medium: { label: 'Medium', color: styles.priorityMed },
  low:    { label: 'Low',    color: styles.priorityLow },
};

const STATUS_CYCLE = { 'todo': 'in-progress', 'in-progress': 'done', 'done': 'todo' };

export default function TaskCard({ task, onEdit, onDelete, onStatusChange, style }) {
  const [deleting, setDeleting] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  const handleDelete = async () => {
    if (!window.confirm('Delete this task?')) return;
    setDeleting(true);
    await onDelete(task._id);
  };

  const sm = STATUS_META[task.status];
  const pm = PRIORITY_META[task.priority];

  const dueDate = task.dueDate ? new Date(task.dueDate) : null;
  const overdue = dueDate && dueDate < new Date() && task.status !== 'done';

  return (
    <div
      className={`${styles.card} ${task.status === 'done' ? styles.done : ''} animate-in`}
      style={style}
    >
      {/* Priority stripe */}
      <div className={`${styles.stripe} ${pm.color}`} />

      <div className={styles.body}>
        <div className={styles.topRow}>
          <span className={`${styles.priority} ${pm.color}`}>{pm.label}</span>
          <div className={styles.menu}>
            <button
              className={styles.menuBtn}
              onClick={() => setMenuOpen(o => !o)}
              aria-label="Options"
            >
              ···
            </button>
            {menuOpen && (
              <>
                <div className={styles.menuBackdrop} onClick={() => setMenuOpen(false)} />
                <div className={styles.dropdown}>
                  <button className={styles.dropItem} onClick={() => { setMenuOpen(false); onEdit(task); }}>
                    ✎ Edit
                  </button>
                  <button
                    className={`${styles.dropItem} ${styles.danger}`}
                    onClick={() => { setMenuOpen(false); handleDelete(); }}
                    disabled={deleting}
                  >
                    ✕ Delete
                  </button>
                </div>
              </>
            )}
          </div>
        </div>

        <h3 className={`${styles.title} ${task.status === 'done' ? styles.striked : ''}`}>
          {task.title}
        </h3>

        {task.description && (
          <p className={styles.desc}>{task.description}</p>
        )}

        {dueDate && (
          <p className={`${styles.due} ${overdue ? styles.overdue : ''}`}>
            {overdue ? '⚠ ' : '◷ '}
            {dueDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
            {overdue && ' · Overdue'}
          </p>
        )}
      </div>

      <div className={styles.footer}>
        <button
          className={`${styles.statusBtn} ${sm.color}`}
          onClick={() => onStatusChange(task._id, STATUS_CYCLE[task.status])}
          title="Click to advance status"
        >
          {task.status === 'done' ? '✓ ' : task.status === 'in-progress' ? '⟳ ' : '○ '}
          {sm.label}
        </button>

        <span className={styles.date}>
          {new Date(task.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
        </span>
      </div>
    </div>
  );
}
