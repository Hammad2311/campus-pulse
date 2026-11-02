import React, { useState } from 'react';
import { useEvents } from '../../context/EventContext';
import { 
  Compass, 
  MapPin, 
  Globe2, 
  Bookmark, 
  Calendar, 
  UserCheck, 
  Menu, 
  X, 
  Activity,
  LogOut
} from 'lucide-react';
import './Navbar.css';

export function Navbar() {
  const { 
    currentView, 
    navigateTo, 
    savedEventIds, 
    organizerUser, 
    logoutOrganizer 
  } = useEvents();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { id: 'landing', label: 'Home', icon: Activity },
    { id: 'explore', label: 'Explore Events', icon: Compass },
    { id: 'map', label: 'Campus Map', icon: MapPin },
    { id: 'external', label: 'External Events', icon: Globe2 },
    { 
      id: 'my-events', 
      label: 'My Events', 
      icon: Bookmark,
      badge: savedEventIds.length > 0 ? savedEventIds.length : null
    }
  ];

  const handleNavClick = (viewId) => {
    navigateTo(viewId);
    setMobileMenuOpen(false);
  };

  return (
    <header className="cp-header">
      <div className="container cp-navbar-container">
        {/* Brand Logo */}
        <div 
          className="cp-brand" 
          onClick={() => handleNavClick('landing')}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => e.key === 'Enter' && handleNavClick('landing')}
        >
          <div className="cp-brand-icon">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path 
                d="M3 12H7L10 4L14 20L17 12H21" 
                stroke="#FFFFFF" 
                strokeWidth="2.5" 
                strokeLinecap="round" 
                strokeLinejoin="round"
              />
            </svg>
          </div>
          <div className="cp-brand-text">
            <span className="cp-brand-name">Campus<span className="cp-brand-highlight">Pulse</span></span>
            <span className="cp-brand-tag">DevCampus 2026</span>
          </div>
        </div>

        {/* Desktop Navigation Links */}
        <nav className="cp-desktop-nav" aria-label="Main Navigation">
          {navLinks.map((link) => {
            const Icon = link.icon;
            const isActive = currentView === link.id;
            return (
              <button
                key={link.id}
                className={`cp-nav-link ${isActive ? 'active' : ''}`}
                onClick={() => handleNavClick(link.id)}
              >
                <Icon size={17} className="cp-nav-icon" />
                <span>{link.label}</span>
                {link.badge !== null && (
                  <span className="cp-nav-badge">{link.badge}</span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Organizer Hub Action */}
        <div className="cp-navbar-actions">
          {organizerUser ? (
            <div className="cp-user-menu">
              <button
                className={`btn btn-sm ${currentView === 'organizer-dashboard' ? 'btn-primary' : 'btn-secondary'}`}
                onClick={() => handleNavClick('organizer-dashboard')}
              >
                <Calendar size={15} />
                <span>Organizer Dashboard</span>
              </button>
              <button 
                className="btn btn-ghost btn-sm cp-logout-btn" 
                onClick={logoutOrganizer}
                title="Log out organizer demo"
              >
                <LogOut size={16} />
              </button>
            </div>
          ) : (
            <button
              className={`btn btn-sm ${currentView === 'organizer-login' ? 'btn-primary' : 'btn-outline'}`}
              onClick={() => handleNavClick('organizer-login')}
            >
              <UserCheck size={15} />
              <span>Organizer Portal</span>
            </button>
          )}

          {/* Mobile Hamburger Toggle */}
          <button 
            className="cp-mobile-toggle"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle navigation menu"
            aria-expanded={mobileMenuOpen}
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="cp-mobile-drawer">
          <div className="container cp-mobile-drawer-content">
            {navLinks.map((link) => {
              const Icon = link.icon;
              const isActive = currentView === link.id;
              return (
                <button
                  key={link.id}
                  className={`cp-mobile-link ${isActive ? 'active' : ''}`}
                  onClick={() => handleNavClick(link.id)}
                >
                  <div className="cp-mobile-link-left">
                    <Icon size={19} />
                    <span>{link.label}</span>
                  </div>
                  {link.badge !== null && (
                    <span className="cp-nav-badge">{link.badge}</span>
                  )}
                </button>
              );
            })}

            <div className="cp-mobile-divider"></div>

            {organizerUser ? (
              <div className="cp-mobile-organizer-group">
                <button
                  className="btn btn-primary btn-lg cp-w-full"
                  onClick={() => handleNavClick('organizer-dashboard')}
                >
                  <Calendar size={18} />
                  <span>Dashboard ({organizerUser.email.split('@')[0]})</span>
                </button>
                <button
                  className="btn btn-ghost cp-w-full"
                  onClick={logoutOrganizer}
                >
                  <LogOut size={16} />
                  <span>Log Out</span>
                </button>
              </div>
            ) : (
              <button
                className="btn btn-primary btn-lg cp-w-full"
                onClick={() => handleNavClick('organizer-login')}
              >
                <UserCheck size={18} />
                <span>Organizer Sign In</span>
              </button>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
