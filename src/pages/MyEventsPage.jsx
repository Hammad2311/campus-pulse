import React, { useState, useEffect } from 'react';
import { useEvents } from '../context/EventContext';
import { getEvents } from '../services/eventService';
import { EventCard } from '../components/events/EventCard';
import { 
  Bookmark, 
  Calendar, 
  Compass, 
  Sparkles,
  Info
} from 'lucide-react';
import './MyEventsPage.css';

export function MyEventsPage() {
  const { 
    savedEventIds, 
    navigateTo 
  } = useEvents();

  const [activeTab, setActiveTab] = useState('saved'); // 'saved' | 'upcoming'
  const [allEvents, setAllEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadEventsData() {
      setLoading(true);
      try {
        const { data, error } = await getEvents({ status: 'published' });
        if (!error && data) {
          setAllEvents(data);
        }
      } catch (err) {
        console.error('Failed to load events for student view', err);
      } finally {
        setLoading(false);
      }
    }
    loadEventsData();
  }, []);

  const savedEvents = allEvents.filter(e => savedEventIds.includes(e.id));
  const upcomingEvents = allEvents.filter(e => e.startDateTime >= new Date());

  const currentList = activeTab === 'saved' ? savedEvents : upcomingEvents;

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
            <h1 className="cp-my-events-title">Saved Events & Schedule</h1>
            <p className="cp-my-events-subtitle">
              Manage your bookmarked sessions and review upcoming campus happenings.
            </p>
          </div>

          <div className="cp-bookmarks-stat-card">
            <Bookmark size={20} className="cp-stat-bookmark-icon" />
            <div className="cp-stat-meta">
              <span className="cp-stat-label">Local Bookmarks</span>
              <span className="cp-stat-value">{savedEvents.length} Saved</span>
            </div>
          </div>
        </div>

        {/* Contract V1 Scope Notice */}
        <div className="cp-session-demo-notice">
          <Info size={18} className="cp-notice-sparkle" />
          <span>
            <strong>Local Bookmarking Active:</strong> Bookmarked events are stored locally in your browser for quick access. Per Contract V1, attendance records and official registrations occur directly on external organizer portals.
          </span>
        </div>

        {/* Tab Navigation (No fake attendance / registration records per Section 7) */}
        <div className="cp-my-events-tabs">
          <button
            className={`cp-tab-btn ${activeTab === 'saved' ? 'active' : ''}`}
            onClick={() => setActiveTab('saved')}
          >
            <Bookmark size={16} />
            <span>Saved & Bookmarks</span>
            <span className="cp-tab-count">{savedEvents.length}</span>
          </button>

          <button
            className={`cp-tab-btn ${activeTab === 'upcoming' ? 'active' : ''}`}
            onClick={() => setActiveTab('upcoming')}
          >
            <Calendar size={16} />
            <span>Upcoming Campus Timeline</span>
            <span className="cp-tab-count">{upcomingEvents.length}</span>
          </button>
        </div>

        {/* Tab Content Display */}
        {loading ? (
          <div className="cp-my-events-loading">Loading your personalized schedule...</div>
        ) : currentList.length === 0 ? (
          <div className="card cp-my-events-empty">
            <div className="cp-empty-tab-icon">
              <Bookmark size={40} />
            </div>
            <h3 className="cp-empty-tab-title">
              {activeTab === 'saved'
                ? "No saved events in your bookmarks"
                : "No upcoming events scheduled"}
            </h3>
            <p className="cp-empty-tab-desc">
              {activeTab === 'saved'
                ? "Click the bookmark icon on any event card across the platform to keep it in your local shortlist."
                : "Check back later for newly announced university seminars and hackathons."}
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
