import React, { useState, useEffect } from 'react';
import { useEvents } from '../context/EventContext';
import { fetchUserEvents } from '../services/eventService';
import { EventCard } from '../components/events/EventCard';
import { 
  Bookmark, 
  CheckCircle2, 
  Calendar, 
  Compass, 
  Award, 
  Clock, 
  Sparkles,
  ArrowRight
} from 'lucide-react';
import './MyEventsPage.css';

export function MyEventsPage() {
  const { 
    savedEventIds, 
    registeredEventIds, 
    navigateTo 
  } = useEvents();

  const [activeTab, setActiveTab] = useState('registered'); // 'registered' | 'saved' | 'upcoming'
  const [userEvents, setUserEvents] = useState({
    registered: [],
    saved: [],
    upcoming: []
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadUserEventsData() {
      setLoading(true);
      try {
        const data = await fetchUserEvents();
        setUserEvents(data);
      } catch (err) {
        console.error('Failed to load user events', err);
      } finally {
        setLoading(false);
      }
    }
    loadUserEventsData();
  }, [savedEventIds, registeredEventIds]);

  const currentList = userEvents[activeTab] || [];

  // Calculate total anticipated activity points
  const totalActivityPoints = userEvents.registered.reduce((acc, curr) => {
    return acc + (curr.activityPoints || 0);
  }, 0);

  return (
    <div className="cp-my-events-page">
      <div className="container cp-my-events-container">
        {/* Header Profile Bar */}
        <div className="cp-my-events-header">
          <div>
            <div className="cp-page-tag">
              <Bookmark size={15} />
              <span>Student Experience Hub</span>
            </div>
            <h1 className="cp-my-events-title">My Event Schedule</h1>
            <p className="cp-my-events-subtitle">
              Manage your confirmed event registrations, bookmarked sessions, and upcoming timetable.
            </p>
          </div>

          {/* Quick Activity Points Summary Card */}
          <div className="cp-points-summary-card">
            <div className="cp-points-icon-wrap">
              <Award size={24} />
            </div>
            <div className="cp-points-meta">
              <span className="cp-points-label">Earnable Activity Points</span>
              <span className="cp-points-value">+{totalActivityPoints} Points</span>
            </div>
          </div>
        </div>

        {/* Status / Integration Banner */}
        <div className="cp-session-demo-notice">
          <Sparkles size={16} className="cp-notice-sparkle" />
          <span>
            <strong>Client Session Storage Active:</strong> Registrations and bookmarks are dynamically persisted in your local browser storage. Live cloud synchronization will connect with Hammad's Firebase Authentication & Cloud Firestore.
          </span>
        </div>

        {/* Tab Navigation */}
        <div className="cp-my-events-tabs">
          <button
            className={`cp-tab-btn ${activeTab === 'registered' ? 'active' : ''}`}
            onClick={() => setActiveTab('registered')}
          >
            <CheckCircle2 size={16} />
            <span>Registered Events</span>
            <span className="cp-tab-count">{userEvents.registered.length}</span>
          </button>

          <button
            className={`cp-tab-btn ${activeTab === 'saved' ? 'active' : ''}`}
            onClick={() => setActiveTab('saved')}
          >
            <Bookmark size={16} />
            <span>Saved & Bookmarks</span>
            <span className="cp-tab-count">{userEvents.saved.length}</span>
          </button>

          <button
            className={`cp-tab-btn ${activeTab === 'upcoming' ? 'active' : ''}`}
            onClick={() => setActiveTab('upcoming')}
          >
            <Calendar size={16} />
            <span>Upcoming Timeline</span>
            <span className="cp-tab-count">{userEvents.upcoming.length}</span>
          </button>
        </div>

        {/* Tab Content Display */}
        {loading ? (
          <div className="cp-my-events-loading">Loading your personalized schedule...</div>
        ) : currentList.length === 0 ? (
          <div className="card cp-my-events-empty">
            <div className="cp-empty-tab-icon">
              {activeTab === 'registered' ? <CheckCircle2 size={40} /> : <Bookmark size={40} />}
            </div>
            <h3 className="cp-empty-tab-title">
              {activeTab === 'registered'
                ? "No confirmed registrations yet"
                : activeTab === 'saved'
                ? "No saved events in your bookmarks"
                : "No upcoming events scheduled"}
            </h3>
            <p className="cp-empty-tab-desc">
              {activeTab === 'registered'
                ? "Browse through upcoming campus workshops and hackathons to reserve your seat and accumulate activity points."
                : "Click the bookmark icon on any event card across the platform to keep it in your personal shortlist."}
            </p>
            <button
              className="btn btn-primary cp-empty-explore-btn"
              onClick={() => navigateTo('explore')}
            >
              <Compass size={16} />
              <span>Explore All Events</span>
            </button>
          </div>
        ) : (
          <div className="cp-my-events-grid">
            {currentList.map(event => (
              <EventCard key={event.id} event={event} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
