import React, { useState, useEffect, useCallback } from 'react';
import { useEvents } from '../context/EventContext';
import { fetchEvents } from '../services/eventService';
import { EventFilterBar } from '../components/events/EventFilterBar';
import { EventCard } from '../components/events/EventCard';
import { 
  Compass, 
  SearchX, 
  AlertTriangle, 
  RefreshCw, 
  Sparkles, 
  Filter 
} from 'lucide-react';
import './ExploreEventsPage.css';

export function ExploreEventsPage() {
  const { selectedEventId, setSelectedEventId } = useEvents();

  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [filters, setFilters] = useState({
    searchQuery: '',
    category: 'All',
    interest: 'All',
    eventType: 'all', // 'all' | 'university' | 'external'
    upcomingOnly: false
  });

  const loadEvents = useCallback(async (currentFilters) => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchEvents(currentFilters);
      setEvents(data);
    } catch (err) {
      console.error('Error fetching events:', err);
      setError('Unable to load campus events. Please verify network status or try resetting filters.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadEvents(filters);
  }, [filters, loadEvents]);

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const handleResetFilters = () => {
    setFilters({
      searchQuery: '',
      category: 'All',
      interest: 'All',
      eventType: 'all',
      upcomingOnly: false
    });
  };

  return (
    <div className="cp-explore-page">
      <div className="container cp-explore-container">
        {/* Page Title & Subtitle */}
        <div className="cp-page-header">
          <div className="cp-page-tag">
            <Compass size={15} />
            <span>Campus Event Directory</span>
          </div>
          <h1 className="cp-page-title">Explore Campus Events</h1>
          <p className="cp-page-desc">
            Discover conferences, hackathons, guest lectures, cultural nights, and athletic tournaments happening across your university campus.
          </p>
        </div>

        {/* Multi-faceted Filter Bar */}
        <EventFilterBar
          filters={filters}
          onFilterChange={handleFilterChange}
          onResetFilters={handleResetFilters}
          totalResults={events.length}
          isSearching={loading}
        />

        {/* Content States: Loading, Error, Empty, and Results Grid */}
        {loading ? (
          <div className="cp-explore-loading-grid">
            {[1, 2, 3, 4, 5, 6].map(i => (
              <div key={i} className="cp-skeleton-card">
                <div className="cp-skeleton-thumb"></div>
                <div className="cp-skeleton-lines">
                  <div className="cp-skeleton-line short"></div>
                  <div className="cp-skeleton-line title"></div>
                  <div className="cp-skeleton-line"></div>
                </div>
              </div>
            ))}
          </div>
        ) : error ? (
          <div className="card cp-error-state">
            <div className="cp-error-icon-box">
              <AlertTriangle size={32} />
            </div>
            <h3 className="cp-error-title">Failed to load events</h3>
            <p className="cp-error-message">{error}</p>
            <button 
              className="btn btn-primary btn-sm"
              onClick={() => loadEvents(filters)}
            >
              <RefreshCw size={14} />
              <span>Retry</span>
            </button>
          </div>
        ) : events.length === 0 ? (
          <div className="card cp-empty-state">
            <div className="cp-empty-icon-box">
              <SearchX size={36} />
            </div>
            <h3 className="cp-empty-title">No events match your criteria</h3>
            <p className="cp-empty-desc">
              Try adjusting your search keywords, clearing selected category tags, or toggling between campus and external events.
            </p>
            <button 
              className="btn btn-secondary btn-sm"
              onClick={handleResetFilters}
            >
              <span>Clear All Filters</span>
            </button>
          </div>
        ) : (
          <div className="cp-explore-grid">
            {events.map(event => (
              <EventCard
                key={event.id}
                event={event}
                isSelected={event.id === selectedEventId}
                onSelect={(id) => setSelectedEventId(id)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
