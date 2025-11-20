// components/Header.js
import Link from 'next/link';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router'; // Import Next.js router
import useSWR from 'swr';
import MobileDrawer from './MobileDrawer'; // Import the new component
import styles from './Header.module.css'; // Import CSS Modules

const fetcher = (url) =>
  fetch(url, { credentials: 'same-origin' }).then(async (r) => {
    if (!r.ok) return null;
    return r.json();
  });

// Helper function
function initials(name) {
  if (!name) return 'U';
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) return parts[0][0].toUpperCase();
  return (parts[0][0] + parts[1][0]).toUpperCase();
}

export default function Header() {
  const { data, mutate, isValidating } = useSWR('/api/candidate/profile', fetcher, {
    revalidateOnFocus: true,
    shouldRetryOnError: false,
  });
  const router = useRouter(); // Initialize router
  const profile = data?.profile || null;

  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handler = () => mutate();
    window.addEventListener('auth-change', handler);
    const storageHandler = (e) => {
      if (e.key === 'auth-change') mutate();
    };
    window.addEventListener('storage', storageHandler);

    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('auth-change', handler);
      window.removeEventListener('storage', storageHandler);
      window.removeEventListener('scroll', handleScroll);
    };
  }, [mutate]);

  async function signOut() {
    try { await fetch('/api/auth/logout', { method: 'POST' }); } catch (e) {}
    mutate(); // Clear SWR cache
    // Clear local storage event trigger
    try { localStorage.setItem('auth-change', Date.now().toString()); } catch (e) {}
    
    // IMPORTANT: Redirect to home after logout
    router.push('/'); 
  }

  return (
    <>
      <header
        className={`${styles.header} ${scrolled ? styles.scrolled : ''}`}
        role="banner"
      >
        <div className={`${styles.container} ${styles.headerInner}`}>
          <div className={styles.headerLeft}>
            {/* Hamburger */}
            <button
              className={styles.mobileMenuButton}
              aria-label="Menu"
              onClick={() => setOpen(!open)}
              aria-expanded={open}
              aria-controls="mobile-menu" // A11y: Connects to the drawer
              type="button"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden>
                <path
                  d={open ? 'M6 18L18 6M6 6l12 12' : 'M4 6h16M4 12h16M4 18h16'}
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>

            {/* Brand */}
            <div className={styles.brand}>
              <Link href="/" className={styles.brandLink} aria-label="Homepage">
              <div className={styles.logoWrapper}>
                
                {/* LOGO IMAGE */}
                <div className={styles.logoIcon}>
                  <Image 
                    src="/logo.png" 
                    alt="HireFrontier Logo" 
                    width={40} 
                    height={40} 
                    priority
                  />
                </div>

                {/* BRAND TEXT */}
                <div className={styles.brandText}>
                  <div className={styles.title}>
                    <span className={styles.brandHighlight}>HireFrontier</span>
                  </div>
                  <div className={styles.tag}>Jobs, apply & track • Canada</div>
                </div>

              </div>
            </Link>
            </div>
          </div>

          {/* Desktop navigation */}
          <nav className={`${styles.nav} ${styles.navDesktop}`} aria-label="Main navigation">
            <Link href="/jobs" className={styles.navLink}>
              Find Jobs
            </Link>
            <Link href="/about" className={styles.navLink}>
              About
            </Link>
            <Link href="/contact" className={styles.navLink}>
              Contact
            </Link>
          </nav>

          {/* Right side (Desktop) */}
          <div className={styles.navRight}>
            {isValidating && !profile ? (
              <div className={styles.skeletonLoader} />
            ) : profile ? (
              <div className={styles.userAvatarWrapper}>
                <div className={styles.userAvatar}>{initials(profile.name)}</div>
              </div>
            ) : (
              <>
                <Link href="/register" className={`${styles.btn} ${styles.btnGhost}`}>
                  Register
                </Link>
                <Link href="/login" className={`${styles.btn} ${styles.btnPrimary}`}>
                  Login
                </Link>
              </>
            )}
          </div>
        </div>
      </header>

      {/* Mobile Drawer (Delegated) */}
      <MobileDrawer
        open={open}
        setOpen={setOpen}
        profile={profile}
        signOut={signOut}
        initials={initials}
      />
    </>
  );
}