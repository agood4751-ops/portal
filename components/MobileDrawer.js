// components/MobileDrawer.js
import Link from 'next/link';
import styles from './Header.module.css'; // Re-use the same style sheet

export default function MobileDrawer({ open, setOpen, profile, signOut, initials }) {
  if (!open) {
    return null; // Render nothing if closed
  }

  return (
    <div className={`${styles.mobileDrawer} ${open ? styles.open : ''}`} aria-hidden={!open}>
      <div className={styles.drawerBackdrop} onClick={() => setOpen(false)} />

      <aside
        className={styles.drawerPanel}
        role="dialog"
        aria-modal="true"
        id="mobile-menu" // A11y: Target for aria-controls
        aria-labelledby="drawer-title" // A11y: Labels the dialog
      >
        {/* Drawer header */}
        <div className={styles.drawerHeader}>
          <div className={styles.drawerBrand}>
            <div className={styles.logoIcon}>🇨🇦</div>
            <div className={styles.drawerBrandText}>
              <div className={styles.drawerTitle} id="drawer-title">
                Canada Jobs
              </div>
              <div className={styles.drawerSubtitle}>for Indians</div>
            </div>
          </div>
          <button
            aria-label="Close menu"
            onClick={() => setOpen(false)}
            className={styles.drawerClose}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <path
                d="M6 18L18 6M6 6l12 12"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        </div>

        {/* Drawer content */}
        <div className={styles.drawerContent}>
          <nav className={styles.drawerNav}>
            <div className={styles.navSection}>
              <div className={styles.navSectionLabel}>Navigation</div>

              <Link
                href="/jobs"
                className={styles.drawerLink}
                onClick={() => setOpen(false)}
              >
                <span className={styles.drawerLinkIcon}>💼</span>
                Find Jobs
              </Link>
              {/* ... other links ... */}
              <Link
                href="/about"
                className={styles.drawerLink}
                onClick={() => setOpen(false)}
              >
                <span className={styles.drawerLinkIcon}>ℹ️</span>
                About
              </Link>
              <Link
                href="/contact"
                className={styles.drawerLink}
                onClick={() => setOpen(false)}
              >
                <span className={styles.drawerLinkIcon}>📞</span>
                Contact
              </Link>
            </div>

            <div className={styles.navSection}>
              <div className={styles.navSectionLabel}>Account</div>
              {profile ? (
                <>
                  <Link
                    href="/candidate/dashboard"
                    className={styles.drawerLink}
                    onClick={() => setOpen(false)}
                  >
                    <span className={styles.drawerLinkIcon}>📊</span>
                    Dashboard
                  </Link>
                  <Link
                    href="/candidate/profile"
                    className={styles.drawerLink}
                    onClick={() => setOpen(false)}
                  >
                    <span className={styles.drawerLinkIcon}>👤</span>
                    Profile
                  </Link>
                  <button
                    onClick={() => {
                      setOpen(false);
                      signOut();
                    }}
                    className={`${styles.drawerLink} ${styles.drawerLinkButton}`}
                  >
                    <span className={styles.drawerLinkIcon}>🚪</span>
                    Sign out
                  </button>
                </>
              ) : (
                <>
                  <Link
                    href="/login"
                    className={styles.drawerLink}
                    onClick={() => setOpen(false)}
                  >
                    <span className={styles.drawerLinkIcon}>🔑</span>
                    Login
                  </Link>
                  <Link
                    href="/register"
                    className={styles.drawerLink}
                    onClick={() => setOpen(false)}
                  >
                    <span className={styles.drawerLinkIcon}>✨</span>
                    Register
                  </Link>
                </>
              )}
            </div>
          </nav>

          {profile && (
            <div className={styles.userInfo}>
              <div className={styles.userAvatarLarge}>{initials(profile.name)}</div>
              <div className={styles.userDetails}>
                <div className={styles.userName}>{profile.name}</div>
                <div className={styles.userEmail}>{profile.email}</div>
              </div>
            </div>
          )}
        </div>
      </aside>
    </div>
  );
}