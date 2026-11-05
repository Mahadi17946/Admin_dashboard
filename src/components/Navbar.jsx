'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const NAV_ITEMS = [
  { label: 'Overview', href: '/dashboard' },
  { label: 'Users', href: '/dashboard/users' },
  { label: 'Orders', href: '/dashboard/orders' },
  { label: 'Reports', href: '/dashboard/reports' },
  { label: 'Settings', href: '/dashboard/settings' },
];

const NOTIFICATIONS = [
  { id: 1, text: 'New user registered', time: '2m ago' },
  { id: 2, text: 'Order #1042 was paid', time: '18m ago' },
  { id: 3, text: 'Weekly report is ready', time: '1h ago' },
];

/** Closes a dropdown when the user clicks outside it or presses Escape. */
function useDismiss(open, close) {
  const ref = useRef(null);

  useEffect(() => {
    if (!open) return;
    const onClick = e => {
      if (ref.current && !ref.current.contains(e.target)) close();
    };
    const onKey = e => {
      if (e.key === 'Escape') close();
    };
    document.addEventListener('mousedown', onClick);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', onClick);
      document.removeEventListener('keydown', onKey);
    };
  }, [open, close]);

  return ref;
}

/**
 * Props:
 * - onToggleSidebar: called when the menu button is clicked (optional)
 * - userName, userEmail: shown in the profile dropdown
 */
export default function Navbar({
  onToggleSidebar,
  userName = 'Admin',
  userEmail = 'admin@example.com',
}) {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [bellOpen, setBellOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

  const bellRef = useDismiss(bellOpen, () => setBellOpen(false));
  const profileRef = useDismiss(profileOpen, () => setProfileOpen(false));

  // Close the mobile menu after navigating.
  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  const isActive = href =>
    href === '/dashboard' ? pathname === href : pathname.startsWith(href);

  const initials = userName
    .split(' ')
    .map(p => p[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

  return (
    <header className="sticky-top bg-white border-bottom">
      <nav
        className="navbar navbar-expand-lg px-3 px-lg-4"
        aria-label="Main navigation"
      >
        <div className="container-fluid p-0 gap-2">
          {onToggleSidebar && (
            <button
              type="button"
              className="btn btn-light border-0 d-none d-lg-inline-flex"
              onClick={onToggleSidebar}
              aria-label="Toggle sidebar"
            >
              <i className="bi bi-list fs-5" aria-hidden="true" />
            </button>
          )}

          <Link href="/dashboard" className="navbar-brand fw-semibold me-lg-4">
            Admin
          </Link>

          {/* Right-side actions that stay visible on mobile */}
          <div className="d-flex align-items-center gap-1 ms-auto order-lg-2">
            {/* Notifications */}
            <div className="position-relative" ref={bellRef}>
              <button
                type="button"
                className="btn btn-light border-0 position-relative"
                onClick={() => {
                  setBellOpen(v => !v);
                  setProfileOpen(false);
                }}
                aria-haspopup="true"
                aria-expanded={bellOpen}
                aria-label={`Notifications, ${NOTIFICATIONS.length} unread`}
              >
                <i className="bi bi-bell" aria-hidden="true" />
                <span
                  className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger"
                  style={{ fontSize: '0.65rem' }}
                >
                  {NOTIFICATIONS.length}
                </span>
              </button>

              {bellOpen && (
                <div
                  className="dropdown-menu dropdown-menu-end show shadow-sm p-0"
                  style={{ minWidth: 280 }}
                >
                  <div className="px-3 py-2 border-bottom fw-semibold">
                    Notifications
                  </div>
                  <ul className="list-unstyled mb-0">
                    {NOTIFICATIONS.map(n => (
                      <li key={n.id} className="px-3 py-2 border-bottom">
                        <div className="small">{n.text}</div>
                        <div
                          className="text-muted"
                          style={{ fontSize: '0.75rem' }}
                        >
                          {n.time}
                        </div>
                      </li>
                    ))}
                  </ul>
                  <Link
                    href="/dashboard/notifications"
                    className="d-block text-center small py-2"
                    onClick={() => setBellOpen(false)}
                  >
                    View all notifications
                  </Link>
                </div>
              )}
            </div>

            {/* Profile */}
            <div className="position-relative" ref={profileRef}>
              <button
                type="button"
                className="btn btn-light border-0 d-flex align-items-center gap-2"
                onClick={() => {
                  setProfileOpen(v => !v);
                  setBellOpen(false);
                }}
                aria-haspopup="true"
                aria-expanded={profileOpen}
              >
                <span
                  className="rounded-circle bg-primary text-white d-inline-flex align-items-center justify-content-center fw-semibold"
                  style={{ width: 30, height: 30, fontSize: '0.8rem' }}
                  aria-hidden="true"
                >
                  {initials}
                </span>
                <span className="d-none d-md-inline small">{userName}</span>
              </button>

              {profileOpen && (
                <div
                  className="dropdown-menu dropdown-menu-end show shadow-sm"
                  style={{ minWidth: 220 }}
                >
                  <div className="px-3 py-2">
                    <div className="fw-semibold small">{userName}</div>
                    <div className="text-muted" style={{ fontSize: '0.75rem' }}>
                      {userEmail}
                    </div>
                  </div>
                  <hr className="dropdown-divider" />
                  <Link
                    href="/dashboard/profile"
                    className="dropdown-item"
                    onClick={() => setProfileOpen(false)}
                  >
                    Your profile
                  </Link>
                  <Link
                    href="/dashboard/settings"
                    className="dropdown-item"
                    onClick={() => setProfileOpen(false)}
                  >
                    Settings
                  </Link>
                  <hr className="dropdown-divider" />
                  <button
                    type="button"
                    className="dropdown-item text-danger"
                    onClick={() => {
                      // TODO: replace with your real sign-out logic
                      console.log('sign out');
                    }}
                  >
                    Sign out
                  </button>
                </div>
              )}
            </div>

            {/* Mobile menu toggle */}
            <button
              type="button"
              className="navbar-toggler border-0 d-lg-none"
              onClick={() => setMobileOpen(v => !v)}
              aria-controls="admin-nav-links"
              aria-expanded={mobileOpen}
              aria-label="Toggle navigation"
            >
              <span className="navbar-toggler-icon" />
            </button>
          </div>

          {/* Links + search */}
          <div
            id="admin-nav-links"
            className={`collapse navbar-collapse order-lg-1 ${mobileOpen ? 'show' : ''}`}
          >
            <ul className="navbar-nav me-lg-auto mb-2 mb-lg-0">
              {NAV_ITEMS.map(item => (
                <li className="nav-item" key={item.href}>
                  <Link
                    href={item.href}
                    className={`nav-link ${isActive(item.href) ? 'active fw-semibold' : ''}`}
                    aria-current={isActive(item.href) ? 'page' : undefined}
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>

            <form
              role="search"
              className="d-flex my-2 my-lg-0 me-lg-3"
              onSubmit={e => e.preventDefault()}
            >
              <input
                type="search"
                className="form-control form-control-sm"
                placeholder="Search users, orders…"
                aria-label="Search"
              />
            </form>
          </div>
        </div>
      </nav>
    </header>
  );
}

