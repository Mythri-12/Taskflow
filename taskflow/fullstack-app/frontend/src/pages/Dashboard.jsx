import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../hooks/useApi';
import Navbar from '../components/Navbar';
import TaskCard from '../components/TaskCard';
import TaskModal from '../components/TaskModal';
import StatsBar from '../components/StatsBar';
import styles from './Dashboard.module.css';

const FILTERS = ['all', 'todo', 'in-progress', 'done'];
const PRIORITY_ORDER = { high: 0, medium: 1, low: 2 };

export default function Dashboard() {
  const { user } = useAuth();
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [search, setSearch] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [editTask, setEditTask] = useState(null);
  const [toast, setToast] = useState(null);

  const showToast = (msg, type = 'success') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  const fetchTasks = useCallback(async () => {
    try {
      const res = await api.get('/tasks');
      setTasks(res.data.tasks);
    } catch {
      showToast('Failed to load tasks', 'error');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchTasks(); }, [fetchTasks]);

  const handleCreate = () => { setEditTask(null); setModalOpen(true); };
  const handleEdit = (task) => { setEditTask(task); setModalOpen(true); };

  const handleSave = async (data) => {
    try {
      if (editTask) {
        const res = await api.put(`/tasks/${editTask._id}`, data);
        setTasks(prev => prev.map(t => t._id === editTask._id ? res.data.task : t));
        showToast('Task updated');
      } else {
        const res = await api.post('/tasks', data);
        setTasks(prev => [res.data.task, ...prev]);
        showToast('Task created');
      }
      setModalOpen(false);
    } catch (err) {
      showToast(err.message, 'error');
    }
  };

  const handleDelete = async (id) => {
    try {
      await api.delete(`/tasks/${id}`);
      setTasks(prev => prev.filter(t => t._id !== id));
      showToast('Task deleted');
    } catch {
      showToast('Failed to delete task', 'error');
    }
  };

  const handleStatusChange = async (id, status) => {
    try {
      const res = await api.put(`/tasks/${id}`, { status });
      setTasks(prev => prev.map(t => t._id === id ? res.data.task : t));
    } catch {
      showToast('Failed to update status', 'error');
    }
  };

  const filtered = tasks
    .filter(t => filter === 'all' || t.status === filter)
    .filter(t => !search || t.title.toLowerCase().includes(search.toLowerCase()) || t.description?.toLowerCase().includes(search.toLowerCase()))
    .sort((a, b) => PRIORITY_ORDER[a.priority] - PRIORITY_ORDER[b.priority]);

  const stats = {
    total: tasks.length,
    todo: tasks.filter(t => t.status === 'todo').length,
    inProgress: tasks.filter(t => t.status === 'in-progress').length,
    done: tasks.filter(t => t.status === 'done').length,
  };

  return (
    <div className={styles.page}>
      <Navbar user={user} />

      <main className={styles.main}>
        <div className={styles.header}>
          <div>
            <h1 className={styles.greeting}>
              Good {getTimeOfDay()}, <span className={styles.name}>{user?.name?.split(' ')[0]}</span>
            </h1>
            <p className={styles.sub}>
              {stats.total === 0
                ? 'No tasks yet — create your first one.'
                : `${stats.done} of ${stats.total} tasks completed`}
            </p>
          </div>
          <button className={styles.createBtn} onClick={handleCreate}>
            <span className={styles.plus}>+</span>
            New Task
          </button>
        </div>

        <StatsBar stats={stats} />

        <div className={styles.toolbar}>
          <div className={styles.filters}>
            {FILTERS.map(f => (
              <button
                key={f}
                className={`${styles.filterBtn} ${filter === f ? styles.active : ''}`}
                onClick={() => setFilter(f)}
              >
                {f === 'in-progress' ? 'In Progress' : f.charAt(0).toUpperCase() + f.slice(1)}
                <span className={styles.badge}>
                  {f === 'all' ? tasks.length
                    : f === 'in-progress' ? stats.inProgress
                    : tasks.filter(t => t.status === f).length}
                </span>
              </button>
            ))}
          </div>

          <div className={styles.searchWrap}>
            <span className={styles.searchIcon}>⌕</span>
            <input
              className={styles.search}
              placeholder="Search tasks…"
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>
        </div>

        {loading ? (
          <div className={styles.loadingGrid}>
            {[1,2,3].map(i => <div key={i} className={styles.skeleton} />)}
          </div>
        ) : filtered.length === 0 ? (
          <div className={styles.empty}>
            <div className={styles.emptyIcon}>◈</div>
            <p className={styles.emptyTitle}>{search ? 'No tasks match your search' : 'No tasks here'}</p>
            <p className={styles.emptySub}>{search ? 'Try different keywords' : 'Hit "New Task" to get started'}</p>
          </div>
        ) : (
          <div className={styles.grid}>
            {filtered.map((task, i) => (
              <TaskCard
                key={task._id}
                task={task}
                style={{ animationDelay: `${i * 40}ms` }}
                onEdit={handleEdit}
                onDelete={handleDelete}
                onStatusChange={handleStatusChange}
              />
            ))}
          </div>
        )}
      </main>

      {modalOpen && (
        <TaskModal
          task={editTask}
          onClose={() => setModalOpen(false)}
          onSave={handleSave}
        />
      )}

      {toast && (
        <div className={`${styles.toast} ${styles[toast.type]}`}>
          {toast.type === 'success' ? '✓' : '✕'} {toast.msg}
        </div>
      )}
    </div>
  );
}

function getTimeOfDay() {
  const h = new Date().getHours();
  if (h < 12) return 'morning';
  if (h < 17) return 'afternoon';
  return 'evening';
}
