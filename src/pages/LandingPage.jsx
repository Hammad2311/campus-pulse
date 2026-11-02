import React, { useState, useEffect } from 'react';
import { useEvents } from '../context/EventContext';
import { getEvents } from '../services/eventService';
import { EventCard } from '../components/events/EventCard';
import { 
  Compass, 
  MapPin, 
  Sparkles, 
  Award, 
  Calendar, 
  Users, 
  Zap, 
  CheckCircle, 
  ArrowRight,
  Shield,
  Code2,
  Music,
  Trophy,
  BookOpen
} from 'lucide-react';
import './LandingPage.css';

export function LandingPage() {
  const { navigateTo } = useEvents();
  const [featuredEvents, setFeaturedEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadFeatured() {
      try {
        const { data, error } = await getEvents({ status: 'published', upcomingOnly: true });
        if (!error && data) {
          setFeaturedEvents(data.slice(0, 3));
        }
      } catch (err) {
        console.error('Failed to load featured events', err);
      } finally {
        setLoading(false);
      }
    }
    loadFeatured();
  }, []);

  const categoryHighlights = [
    { name: "Technical Workshops", icon: Code2, count: "Hands-on Labs", cat: "technical_workshop", color: "#4F46E5", bg: "#EEF2FF" },
    { name: "Hackathons", icon: Zap, count: "Competitions", cat: "hackathon", color: "#7C3AED", bg: "#F5F3FF" },
    { name: "Cultural Programs", icon: Music, count: "Campus Fests", cat: "cultural_program", color: "#DB2777", bg: "#FDF2F8" },
    { name: "Sports Tournaments", icon: Trophy, count: "Athletics", cat: "sports_event", color: "#059669", bg: "#ECFDF5" },
    { name: "Guest Lectures & Seminars", icon: BookOpen, count: "Keynotes", cat: "guest_lecture", color: "#2563EB", bg: "#EFF6FF" }
  ];

  const valueProps = [
    {
      icon: Compass,
      title: "Centralized Discovery",
      description: "No more fragmented chats or outdated bulletin boards. Every legitimate university and inter-collegiate event in one clean timeline."
    },
    {
      icon: Award,
      title: "Verified Activity Points",
      description: "Discover official listings that carry verified university activity points and administrative e-certificates."
    },
    {
      icon: MapPin,
      title: "Campus Map Boundary",
      description: "Uses an image-based Alliance University campus map with mapped event venues."
    },
    {
      icon: Shield,
      title: "Authenticated Hosts",
      description: "Listings curated by verified campus clubs, academic departments, and recognized national hackathon organizers."
    }
  ];

  return (
    <div className="cp-landing-page">
      {/* Hero Section */}
      <section className="cp-hero-section">
        <div className="container cp-hero-container">
          <div className="cp-hero-badge">
            <span className="cp-hero-badge-dot"></span>
            <span>Welcome to DevCampus 2026 Hackathon Edition</span>
          </div>

          <h1 className="cp-hero-headline">
            Your Campus. Your Community. <br />
            <span className="cp-hero-gradient-text">Your Next Experience.</span>
          </h1>

          <p className="cp-hero-subtext">
            Discover cutting-edge hackathons, cultural festivals, academic guest lectures, 
            and intramural sports. Navigate university venues with ease and earn verified student activity points.
          </p>

          <div className="cp-hero-cta-group">
            <button 
              className="btn btn-primary btn-lg cp-hero-btn"
              onClick={() => navigateTo('explore')}
            >
              <Compass size={18} />
              <span>Explore Events</span>
            </button>

            <button 
              className="btn btn-secondary btn-lg cp-hero-btn"
              onClick={() => navigateTo('map')}
            >
              <MapPin size={18} />
              <span>Discover Campus Map</span>
            </button>
          </div>

          {/* Quick Metrics */}
          <div className="cp-hero-metrics">
            <div className="cp-metric-box">
              <span className="cp-metric-num">10+</span>
              <span className="cp-metric-label">Approved Event Domains</span>
            </div>
            <div className="cp-metric-sep"></div>
            <div className="cp-metric-box">
              <span className="cp-metric-num">100%</span>
              <span className="cp-metric-label">Contract V1 Aligned</span>
            </div>
            <div className="cp-metric-sep"></div>
            <div className="cp-metric-box">
              <span className="cp-metric-num">Interactive</span>
              <span className="cp-metric-label">Campus Geo-Boundary</span>
            </div>
          </div>
        </div>
      </section>

      {/* Categories Explorer Section */}
      <section className="cp-section cp-categories-section">
        <div className="container">
          <div className="cp-section-header">
            <div>
              <h2 className="cp-section-title">Explore by Domain</h2>
              <p className="cp-section-desc">Tailor your university experience around what inspires you.</p>
            </div>
            <button 
              className="btn btn-ghost btn-sm cp-header-link-btn"
              onClick={() => navigateTo('explore')}
            >
              <span>View All Categories</span>
              <ArrowRight size={15} />
            </button>
          </div>

          <div className="cp-category-grid">
            {categoryHighlights.map((cat, idx) => {
              const Icon = cat.icon;
              return (
                <div 
                  key={idx}
                  className="card cp-category-card"
                  onClick={() => navigateTo('explore')}
                  role="button"
                  tabIndex={0}
                >
                  <div className="cp-cat-icon-wrap" style={{ background: cat.bg, color: cat.color }}>
                    <Icon size={24} />
                  </div>
                  <h3 className="cp-cat-name">{cat.name}</h3>
                  <div className="cp-cat-count">{cat.count}</div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Featured Upcoming Events Section */}
      <section className="cp-section cp-featured-section">
        <div className="container">
          <div className="cp-section-header">
            <div>
              <div className="cp-section-tag">
                <Sparkles size={14} />
                <span>Handpicked Highlights</span>
              </div>
              <h2 className="cp-section-title">Featured Upcoming Experiences</h2>
              <p className="cp-section-desc">Premier university conferences and high-energy flagship events you cannot miss.</p>
            </div>
            <button 
              className="btn btn-outline btn-sm"
              onClick={() => navigateTo('explore')}
            >
              <span>Browse All Events</span>
              <ArrowRight size={14} />
            </button>
          </div>

          {loading ? (
            <div className="cp-loading-skeleton-grid">
              <div className="cp-skeleton-card"></div>
              <div className="cp-skeleton-card"></div>
              <div className="cp-skeleton-card"></div>
            </div>
          ) : (
            <div className="cp-events-grid">
              {featuredEvents.map(event => (
                <EventCard key={event.id} event={event} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Interactive Campus Map Introduction Featurette */}
      <section className="cp-section cp-map-intro-section">
        <div className="container">
          <div className="cp-map-feature-card">
            <div className="cp-map-feature-copy">
              <div className="cp-section-tag">
                <MapPin size={14} />
                <span>Interactive Geo-Navigation</span>
              </div>
              <h2 className="cp-map-feature-title">
                Never get lost on campus again.
              </h2>
              <p className="cp-map-feature-desc">
                From finding lecture halls in the Science Block to locating open-air amphitheatres during cultural fests, our interactive map coordinates events with campus venues in real-time.
              </p>

              <div className="cp-map-feature-checklist">
                <div className="cp-checklist-item">
                  <CheckCircle size={18} className="cp-check-icon" />
                  <span>Uses the supplied Alliance University campus directory image</span>
                </div>
                <div className="cp-checklist-item">
                  <CheckCircle size={18} className="cp-check-icon" />
                  <span>Supports safe handling of events without physical GPS coordinates</span>
                </div>
                <div className="cp-checklist-item">
                  <CheckCircle size={18} className="cp-check-icon" />
                  <span>Synchronized event card and marker selection flow</span>
                </div>
              </div>

              <div className="cp-map-feature-actions">
                <button 
                  className="btn btn-primary btn-lg"
                  onClick={() => navigateTo('map')}
                >
                  <MapPin size={18} />
                  <span>Launch Campus Map</span>
                </button>
              </div>
            </div>

            <div className="cp-map-feature-preview" onClick={() => navigateTo('map')}>
              <div className="cp-preview-visual">
                <div className="cp-radar-pulse"></div>
                <div className="cp-preview-pin pin-1">
                  <MapPin size={24} />
                  <span className="cp-pin-label">Sarabhai Hall</span>
                </div>
                <div className="cp-preview-pin pin-2">
                  <MapPin size={24} />
                  <span className="cp-pin-label">Innovation Hub</span>
                </div>
              </div>
              <div className="cp-preview-caption">
                <span>Click to open interactive campus map →</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Why Campus Pulse Section */}
      <section className="cp-section cp-why-section">
        <div className="container">
          <div className="cp-section-center-header">
            <div className="cp-section-tag">
              <Zap size={14} />
              <span>Built for Modern University Life</span>
            </div>
            <h2 className="cp-section-title">Why Students & Organizers Choose Campus Pulse</h2>
            <p className="cp-section-desc">Designed with elegance to solve the friction of campus communication.</p>
          </div>

          <div className="cp-values-grid">
            {valueProps.map((prop, idx) => {
              const Icon = prop.icon;
              return (
                <div key={idx} className="card cp-value-card">
                  <div className="cp-value-icon-box">
                    <Icon size={24} />
                  </div>
                  <h3 className="cp-value-title">{prop.title}</h3>
                  <p className="cp-value-desc">{prop.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Final Call to Action Banner */}
      <section className="cp-section cp-final-cta-section">
        <div className="container">
          <div className="cp-final-cta-card">
            <div className="cp-cta-content">
              <h2 className="cp-cta-heading">Ready to dive into campus life?</h2>
              <p className="cp-cta-subtext">
                Browse through upcoming hackathons, earn valuable academic credits, or draft your club's next major gathering.
              </p>
              <div className="cp-cta-actions">
                <button 
                  className="btn btn-primary btn-lg"
                  onClick={() => navigateTo('explore')}
                >
                  <Compass size={18} />
                  <span>Explore All Events</span>
                </button>
                <button 
                  className="btn btn-secondary btn-lg"
                  onClick={() => navigateTo('organizer-login')}
                >
                  <Users size={18} />
                  <span>Organizer Portal</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
