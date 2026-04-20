import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import styles from './Navbar.module.css';

export default function Navbar({ user }) {
  const { logout } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);

  const initials = user?.name
    ? user.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
    : '?';

  return (
    <nav className={styles.nav}>
      <div className={styles.inner}>
        <div className={styles.brand}>
          <div className={styles.logoIcon}>✦</div>
          <span className={styles.logoText}>TaskFlow</span>
        </div>

        <div className={styles.right}>
          <div className={styles.userWrap}>
            <button
              className={styles.avatar}
              onClick={() => setMenuOpen(o => !o)}
              aria-label="User menu"
            >
              {initials}
            </button>

            {menuOpen && (
              <>
                <div className={styles.backdrop} onClick={() => setMenuOpen(false)} />
                <div className={styles.dropdown}>
                  <div className={styles.dropUser}>
                    <div className={styles.dropAvatar}>{initials}</div>
                    <div>
                      <div className={styles.dropName}>{user?.name}</div>
                      <div className={styles.dropEmail}>{user?.email}</div>
                    </div>
                  </div>
                  <div className={styles.dropDivider} />
                  <button className={styles.dropItem} onClick={logout}>
                    <span>⎋</span> Sign out
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
