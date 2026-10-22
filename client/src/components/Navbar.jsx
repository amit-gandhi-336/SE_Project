import React, { useState, useEffect } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { PawPrint, LogOut, Menu, X, LayoutDashboard, FileText, Settings, User } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import Badge from './Badge';

export function Navbar() {
  const { user, isAuthenticated, logout, isShelterWorker, isVolunteer, isAdopter } = useAuth();
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 15);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = async () => {
    await logout();
    setProfileDropdownOpen(false);
    setMobileMenuOpen(false);
    navigate('/');
  };

  const navLinkStyle = ({ isActive }) => ({
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '0.28rem',
    height: '35px',
    padding: '0 0.58rem',
    borderRadius: 'var(--radius-full)',
    fontSize: '0.85rem',
    fontWeight: isActive ? 650 : 500,
    color: isActive ? 'var(--color-sage-dark)' : 'var(--color-charcoal)',
    backgroundColor: isActive ? 'rgba(73, 107, 82, 0.14)' : 'transparent',
    border: isActive ? '1px solid rgba(73, 107, 82, 0.24)' : '1px solid transparent',
    transition: 'all var(--transition-fast)',
    whiteSpace: 'nowrap',
    textDecoration: 'none',
    flexShrink: 0
  });

  return (
    <header
      style={{
        position: 'sticky',
        top: '0.75rem',
        zIndex: 100,
        margin: '0 auto 1.5rem',
        paddingLeft: '1rem',
        paddingRight: '1rem',
        width: '100%',
        maxWidth: '1360px',
        boxSizing: 'border-box'
      }}
    >
      <div
        className="liquid-glass"
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          height: '66px',
          padding: '0 1.2rem',
          backgroundColor: scrolled ? 'rgba(255, 255, 255, 0.78)' : 'rgba(255, 255, 255, 0.68)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          boxShadow: scrolled
            ? '0 12px 32px -4px rgba(41, 45, 42, 0.08), inset 0 1px 1px 0 rgba(255, 255, 255, 0.95)'
            : '0 6px 20px -3px rgba(41, 45, 42, 0.05), inset 0 1px 1px 0 rgba(255, 255, 255, 0.95)',
          border: '1px solid rgba(255, 255, 255, 0.85)',
          borderRadius: 'var(--radius-full)',
          transition: 'all var(--transition-normal)'
        }}
      >
        {/* Left: Brand Logo & Name */}
        <Link
          to="/"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.55rem',
            textDecoration: 'none',
            flexShrink: 0
          }}
        >
          <div
            style={{
              width: 36,
              height: 36,
              borderRadius: '11px',
              backgroundColor: 'var(--color-sage)',
              color: 'var(--color-white)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 3px 10px rgba(73, 107, 82, 0.3)',
              flexShrink: 0
            }}
          >
            <PawPrint size={20} />
          </div>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <span
              style={{
                fontFamily: 'var(--font-heading)',
                fontSize: '1.2rem',
                fontWeight: 800,
                color: 'var(--color-charcoal)',
                lineHeight: 1.1,
                letterSpacing: '-0.02em',
                whiteSpace: 'nowrap'
              }}
            >
              Second <span style={{ color: 'var(--color-sage)' }}>Chance</span>
            </span>
            <span
              className="brand-subtitle"
              style={{
                fontSize: '0.64rem',
                fontWeight: 650,
                color: 'var(--color-charcoal-muted)',
                letterSpacing: '0.04em',
                textTransform: 'uppercase',
                whiteSpace: 'nowrap'
              }}
            >
              Rescue & Adoption
            </span>
          </div>
        </Link>

        {/* Center: Desktop Navigation Links (Middle Aligned) */}
        <nav
          className="desktop-nav"
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '0.2rem',
            flex: '1 1 auto',
            margin: '0 0.6rem',
            minWidth: 0
          }}
        >
          <NavLink to="/" style={navLinkStyle}>Home</NavLink>
          <NavLink to="/pets" style={navLinkStyle}>Browse Pets</NavLink>
          <NavLink to="/rescue-alerts" style={navLinkStyle}>
            Rescue Alerts
          </NavLink>

          {/* Adopter Navigation */}
          {isAuthenticated && isAdopter && (
            <NavLink to="/applications" style={navLinkStyle}>
              <FileText size={14} />
              My Applications
            </NavLink>
          )}

          {/* Shelter Worker Navigation */}
          {isAuthenticated && isShelterWorker && (
            <>
              <NavLink to="/shelter/dashboard" style={navLinkStyle}>
                <LayoutDashboard size={14} />
                Shelter Hub
              </NavLink>
              <NavLink to="/shelter/pets" style={navLinkStyle}>
                Manage Pets
              </NavLink>
              <NavLink to="/shelter/applications" style={navLinkStyle}>
                Review Apps
              </NavLink>
            </>
          )}

          {/* Volunteer Navigation */}
          {isAuthenticated && isVolunteer && (
            <NavLink to="/volunteer/dashboard" style={navLinkStyle}>
              <LayoutDashboard size={14} />
              Volunteer Hub
            </NavLink>
          )}

          <NavLink to="/about" style={navLinkStyle}>About</NavLink>
          <NavLink to="/contact" style={navLinkStyle}>Contact</NavLink>
        </nav>

        {/* Right: Auth / Profile Area (Inside Navbar, Stays Fully within Viewport) */}
        <div
          className="desktop-nav"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            flexShrink: 0
          }}
        >
          {isAuthenticated ? (
            <div style={{ position: 'relative', flexShrink: 0 }}>
              <button
                onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                aria-label="User account menu"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.45rem',
                  height: '36px',
                  padding: '0 0.75rem',
                  borderRadius: 'var(--radius-full)',
                  border: '1px solid rgba(73, 107, 82, 0.25)',
                  backgroundColor: 'rgba(255, 255, 255, 0.82)',
                  cursor: 'pointer',
                  backdropFilter: 'blur(8px)',
                  WebkitBackdropFilter: 'blur(8px)',
                  transition: 'all var(--transition-fast)',
                  flexShrink: 0,
                  maxWidth: '220px'
                }}
              >
                <div
                  style={{
                    width: 25,
                    height: 25,
                    borderRadius: '50%',
                    backgroundColor: 'rgba(73, 107, 82, 0.16)',
                    color: 'var(--color-sage)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: 700,
                    fontSize: '0.76rem',
                    flexShrink: 0
                  }}
                >
                  {user?.name?.[0] || 'U'}
                </div>
                <span
                  style={{
                    fontSize: '0.84rem',
                    fontWeight: 650,
                    color: 'var(--color-charcoal)',
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    maxWidth: '70px'
                  }}
                >
                  {user?.name?.split(' ')[0] || 'Account'}
                </span>
                <Badge variant={user?.role || 'neutral'} size="sm">
                  {user?.role === 'ShelterWorker' ? 'Staff' : user?.role}
                </Badge>
              </button>

              {/* Profile Dropdown */}
              {profileDropdownOpen && (
                <div
                  className="liquid-glass-strong"
                  style={{
                    position: 'absolute',
                    top: 'calc(100% + 0.6rem)',
                    right: 0,
                    width: '230px',
                    padding: '0.5rem',
                    borderRadius: 'var(--radius-md)',
                    backgroundColor: 'rgba(255, 255, 255, 0.96)',
                    backdropFilter: 'blur(16px)',
                    WebkitBackdropFilter: 'blur(16px)',
                    boxShadow: '0 16px 36px rgba(41, 45, 42, 0.15)',
                    zIndex: 200,
                    animation: 'scaleUp 0.15s ease-out',
                    border: '1px solid rgba(255, 255, 255, 0.9)'
                  }}
                >
                  <div style={{ padding: '0.6rem 0.8rem', borderBottom: '1px solid rgba(0,0,0,0.06)' }}>
                    <p style={{ fontSize: '0.86rem', fontWeight: 700, margin: 0, color: 'var(--color-charcoal)' }}>
                      {user?.name}
                    </p>
                    <p style={{ fontSize: '0.74rem', color: 'var(--color-charcoal-muted)', margin: 0 }}>
                      {user?.email}
                    </p>
                  </div>
                  <Link
                    to="/profile"
                    onClick={() => setProfileDropdownOpen(false)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.5rem',
                      padding: '0.6rem 0.8rem',
                      fontSize: '0.86rem',
                      color: 'var(--color-charcoal)',
                      borderRadius: 'var(--radius-sm)',
                      transition: 'background-color 0.15s'
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'rgba(73, 107, 82, 0.08)'}
                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                  >
                    <Settings size={14} /> Profile Details
                  </Link>

                  {isShelterWorker && (
                    <Link
                      to="/shelter/dashboard"
                      onClick={() => setProfileDropdownOpen(false)}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem',
                        padding: '0.6rem 0.8rem',
                        fontSize: '0.86rem',
                        color: 'var(--color-charcoal)',
                        borderRadius: 'var(--radius-sm)'
                      }}
                    >
                      <LayoutDashboard size={14} /> Shelter Operations
                    </Link>
                  )}

                  {isVolunteer && (
                    <Link
                      to="/volunteer/dashboard"
                      onClick={() => setProfileDropdownOpen(false)}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem',
                        padding: '0.6rem 0.8rem',
                        fontSize: '0.86rem',
                        color: 'var(--color-charcoal)',
                        borderRadius: 'var(--radius-sm)'
                      }}
                    >
                      <LayoutDashboard size={14} /> Volunteer Missions
                    </Link>
                  )}

                  <button
                    onClick={handleLogout}
                    style={{
                      width: '100%',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.5rem',
                      padding: '0.6rem 0.8rem',
                      fontSize: '0.86rem',
                      color: '#b52828',
                      backgroundColor: 'transparent',
                      border: 'none',
                      borderRadius: 'var(--radius-sm)',
                      cursor: 'pointer',
                      textAlign: 'left'
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'rgba(209, 67, 67, 0.08)'}
                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                  >
                    <LogOut size={14} /> Sign Out
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', flexShrink: 0 }}>
              <Link
                to="/login"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  height: '36px',
                  padding: '0 0.95rem',
                  fontSize: '0.86rem',
                  fontWeight: 650,
                  color: 'var(--color-charcoal)',
                  borderRadius: 'var(--radius-full)',
                  border: '1px solid rgba(73, 107, 82, 0.22)',
                  backgroundColor: 'rgba(255, 255, 255, 0.75)',
                  transition: 'all var(--transition-fast)'
                }}
              >
                Sign In
              </Link>
              <Link
                to="/register"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  height: '36px',
                  padding: '0 1.15rem',
                  fontSize: '0.86rem',
                  fontWeight: 650,
                  color: 'var(--color-white)',
                  borderRadius: 'var(--radius-full)',
                  backgroundColor: 'var(--color-sage)',
                  boxShadow: '0 3px 10px rgba(73, 107, 82, 0.3)',
                  transition: 'all var(--transition-fast)'
                }}
              >
                Join Us
              </Link>
            </div>
          )}
        </div>

        {/* Mobile Hamburger Button */}
        <button
          id="mobile-nav-toggle-btn"
          onClick={() => setMobileMenuOpen(prev => !prev)}
          aria-label="Toggle navigation menu"
          className="mobile-nav-toggle"
          style={{
            background: 'none',
            border: 'none',
            color: 'var(--color-charcoal)',
            cursor: 'pointer',
            padding: '0.5rem',
            borderRadius: 'var(--radius-sm)',
            display: 'none',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0
          }}
        >
          {mobileMenuOpen ? <X size={26} /> : <Menu size={26} />}
        </button>
      </div>

      {/* Mobile Drawer (Polished Responsive Menu) */}
      {mobileMenuOpen && (
        <div
          className="liquid-glass-strong"
          style={{
            marginTop: '0.75rem',
            padding: '1.25rem',
            display: 'flex',
            flexDirection: 'column',
            gap: '0.55rem',
            backgroundColor: 'rgba(255, 255, 255, 0.96)',
            backdropFilter: 'blur(20px)',
            WebkitBackdropFilter: 'blur(20px)',
            boxShadow: 'var(--glass-shadow-lg)',
            borderRadius: 'var(--radius-lg)',
            border: '1px solid rgba(255, 255, 255, 0.9)',
            animation: 'scaleUp 0.15s ease-out'
          }}
        >
          <NavLink to="/" onClick={() => setMobileMenuOpen(false)} style={navLinkStyle}>Home</NavLink>
          <NavLink to="/pets" onClick={() => setMobileMenuOpen(false)} style={navLinkStyle}>Browse Pets</NavLink>
          <NavLink to="/rescue-alerts" onClick={() => setMobileMenuOpen(false)} style={navLinkStyle}>
            Rescue Alerts
          </NavLink>
          {isAuthenticated && isAdopter && (
            <NavLink to="/applications" onClick={() => setMobileMenuOpen(false)} style={navLinkStyle}>
              <FileText size={14} /> My Applications
            </NavLink>
          )}
          {isAuthenticated && isShelterWorker && (
            <>
              <NavLink to="/shelter/dashboard" onClick={() => setMobileMenuOpen(false)} style={navLinkStyle}>
                <LayoutDashboard size={14} /> Shelter Hub
              </NavLink>
              <NavLink to="/shelter/pets" onClick={() => setMobileMenuOpen(false)} style={navLinkStyle}>
                Manage Pets
              </NavLink>
              <NavLink to="/shelter/applications" onClick={() => setMobileMenuOpen(false)} style={navLinkStyle}>
                Review Applications
              </NavLink>
            </>
          )}
          {isAuthenticated && isVolunteer && (
            <NavLink to="/volunteer/dashboard" onClick={() => setMobileMenuOpen(false)} style={navLinkStyle}>
              <LayoutDashboard size={14} /> Volunteer Hub
            </NavLink>
          )}
          <NavLink to="/about" onClick={() => setMobileMenuOpen(false)} style={navLinkStyle}>About Us</NavLink>
          <NavLink to="/contact" onClick={() => setMobileMenuOpen(false)} style={navLinkStyle}>Contact</NavLink>

          <div style={{ height: '1px', backgroundColor: 'rgba(0,0,0,0.08)', margin: '0.4rem 0' }} />

          {isAuthenticated ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span style={{ fontWeight: 700, color: 'var(--color-charcoal)' }}>{user?.name}</span>
                <Badge variant={user?.role}>{user?.role === 'ShelterWorker' ? 'Shelter Staff' : user?.role}</Badge>
              </div>
              <Link
                to="/profile"
                onClick={() => setMobileMenuOpen(false)}
                style={{
                  fontSize: '0.88rem',
                  color: 'var(--color-sage)',
                  fontWeight: 600,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.4rem'
                }}
              >
                <Settings size={14} /> View Profile Details
              </Link>
              <button
                onClick={handleLogout}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  padding: '0.5rem 0',
                  color: '#b52828',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  fontWeight: 600,
                  fontSize: '0.88rem'
                }}
              >
                <LogOut size={15} /> Sign Out
              </button>
            </div>
          ) : (
            <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.4rem' }}>
              <Link
                to="/login"
                onClick={() => setMobileMenuOpen(false)}
                style={{
                  flex: 1,
                  textAlign: 'center',
                  padding: '0.55rem',
                  borderRadius: 'var(--radius-full)',
                  border: '1px solid var(--color-sage)',
                  color: 'var(--color-sage)',
                  fontWeight: 650,
                  fontSize: '0.88rem'
                }}
              >
                Sign In
              </Link>
              <Link
                to="/register"
                onClick={() => setMobileMenuOpen(false)}
                style={{
                  flex: 1,
                  textAlign: 'center',
                  padding: '0.55rem',
                  borderRadius: 'var(--radius-full)',
                  backgroundColor: 'var(--color-sage)',
                  color: 'white',
                  fontWeight: 650,
                  fontSize: '0.88rem'
                }}
              >
                Register
              </Link>
            </div>
          )}
        </div>
      )}
    </header>
  );
}

export default Navbar;
