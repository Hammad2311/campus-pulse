import React from 'react';
import { useEvents } from '../../context/EventContext';
import { Compass, MapPin, Globe2, Bookmark, ShieldCheck, Heart } from 'lucide-react';
import './Footer.css';

export function Footer() {
  const { navigateTo } = useEvents();

  return (
    <footer className="cp-footer">
      <div className="container cp-footer-container">
        {/* Brand & Mission Column */}
        <div className="cp-footer-col cp-footer-brand-col">
          <div className="cp-brand cp-footer-brand">
            <div className="cp-brand-icon">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
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
              <span className="cp-brand-tag">Smart Event Discovery</span>
            </div>
          </div>
          <p className="cp-footer-desc">
            The premier centralized platform for university students to explore academic conferences, hackathons, cultural festivals, workshops, and sports tournaments across campus.
          </p>
          <div className="cp-footer-badge">
            <ShieldCheck size={14} className="cp-verified-icon" />
            <span>DevCampus 2026 Official Submission</span>
          </div>
        </div>

        {/* Quick Links Column */}
        <div className="cp-footer-col">
          <h4 className="cp-footer-heading">Platform Discovery</h4>
          <ul className="cp-footer-links">
            <li>
              <button onClick={() => navigateTo('explore')} className="cp-footer-link">
                <Compass size={14} /> Explore All Events
              </button>
            </li>
            <li>
              <button onClick={() => navigateTo('map')} className="cp-footer-link">
                <MapPin size={14} /> Interactive Campus Map
              </button>
            </li>
            <li>
              <button onClick={() => navigateTo('external')} className="cp-footer-link">
                <Globe2 size={14} /> External & National Hackathons
              </button>
            </li>
            <li>
              <button onClick={() => navigateTo('my-events')} className="cp-footer-link">
                <Bookmark size={14} /> Saved & Registered Events
              </button>
            </li>
          </ul>
        </div>

        {/* Categories Column */}
        <div className="cp-footer-col">
          <h4 className="cp-footer-heading">Event Categories</h4>
          <ul className="cp-footer-links">
            <li><button onClick={() => navigateTo('explore')} className="cp-footer-link">Technology & AI</button></li>
            <li><button onClick={() => navigateTo('explore')} className="cp-footer-link">Hackathons & Coding</button></li>
            <li><button onClick={() => navigateTo('explore')} className="cp-footer-link">Cultural & Music Festivals</button></li>
            <li><button onClick={() => navigateTo('explore')} className="cp-footer-link">Sports & Athletics</button></li>
            <li><button onClick={() => navigateTo('explore')} className="cp-footer-link">Hands-on Workshops</button></li>
          </ul>
        </div>

        {/* Team chaos.exe Attribution Column */}
        <div className="cp-footer-col">
          <h4 className="cp-footer-heading">Team chaos.exe</h4>
          <p className="cp-team-role"><strong>Hammad Qubah:</strong> Project Lead & Backend</p>
          <p className="cp-team-role"><strong>Vatsa:</strong> Frontend & UI Lead</p>
          <p className="cp-team-role"><strong>Chandrashekhar:</strong> Interactive Google Maps</p>
          <p className="cp-team-role"><strong>Kanishka:</strong> Creative Design & QA</p>
          <div className="cp-team-tag">
            <span>Built with <Heart size={12} className="cp-heart-icon" /> for DevCampus 2026</span>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="cp-footer-bottom">
        <div className="container cp-footer-bottom-container">
          <p className="cp-copyright">
            © 2026 Campus Pulse • Team chaos.exe • All university trademarks and club rights reserved.
          </p>
          <div className="cp-footer-meta">
            <span className="cp-meta-pill">React 18</span>
            <span className="cp-meta-pill">Vite</span>
            <span className="cp-meta-pill">Pure CSS3</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
