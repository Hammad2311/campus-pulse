import React, { useState, useEffect } from 'react';
import { useEvents } from '../context/EventContext';
import { fetchEvents } from '../services/eventService';
import { CampusMap } from '../components/map/CampusMap';
import { CategoryBadge, EventTypeBadge } from '../components/common/Badge';
import { 
  MapPin, 
  List, 
  Map as MapIcon, 
  Calendar, 
  Clock, 
  ArrowRight, 
  Bookmark, 
  Layers, 
  Search,
  Award
} from 'lucide-react';
import './CampusMapPage.css';

export function CampusMapPage() {
  const { 
    selectedEventId, 
    handleSelectEvent, 
    openEventDetails, 
    savedEventIds, 
    handleToggleSave 
  } = useEvents();

  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchFilter, setSearchFilter] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  
  // Mobile View Toggle: 'map' or 'list'
  const [mobileActiveTab, setMobileActiveTab] = useState('map');

  useEffect(() => {
    async function loadMapEvents() {
      setLoading(true);
      try {
        const data = await fetchEvents({ status: 'published' });
        setEvents(data);
        // Default selectedEventId if none set yet
        if (!selectedEventId && data.length > 0) {
          handleSelectEvent(data[0].id);
        }
      } catch (err) {
        console.error('Error loading map events', err);
      } finally {
        setLoading(false);
      }
    }
    loadMapEvents();
  }, []);

  // Filter events displayed on map
  const visibleEvents = events.filter(e => {
    const matchesCat = selectedCategory === 'All' || e.category.toLowerCase() === selectedCategory.toLowerCase();
    const matchesSearch = !searchFilter || 
      e.title.toLowerCase().includes(searchFilter.toLowerCase()) ||
      e.venue.toLowerCase().includes(searchFilter.toLowerCase());
    return matchesCat && matchesSearch;
  });

  const selectedEvent = events.find(e => e.id === selectedEventId) || (visibleEvents.length > 0 ? visibleEvents[0] : null);

  const categories = ['All', 'Technology', 'Cultural', 'Sports', 'Workshop', 'Academic'];

  return (
    <div className="cp-map-page">
      <div className="container cp-map-page-container">
        {/* Header Bar */}
        <div className="cp-map-header">
          <div>
            <div className="cp-page-tag">
              <MapPin size={15} />
              <span>Spatial Campus Geolocation</span>
            </div>
            <h1 className="cp-map-title">Interactive Campus Map</h1>
            <p className="cp-map-subtitle">
              Explore university event venues, academic halls, and labs. Click any marker or card to synchronize selection.
            </p>
          </div>

          {/* Mobile View Toggle Bar */}
          <div className="cp-mobile-view-toggle">
            <button
              className={`cp-mobile-tab-btn ${mobileActiveTab === 'map' ? 'active' : ''}`}
              onClick={() => setMobileActiveTab('map')}
            >
              <MapIcon size={16} />
              <span>Map View</span>
            </button>
            <button
              className={`cp-mobile-tab-btn ${mobileActiveTab === 'list' ? 'active' : ''}`}
              onClick={() => setMobileActiveTab('list')}
            >
              <List size={16} />
              <span>Events List ({visibleEvents.length})</span>
            </button>
          </div>
        </div>

        {/* Quick Filter Bar */}
        <div className="cp-map-filter-strip">
          <div className="cp-map-search-wrap">
            <Search size={16} className="cp-map-search-icon" />
            <input
              type="text"
              placeholder="Filter venues or titles..."
              value={searchFilter}
              onChange={(e) => setSearchFilter(e.target.value)}
              className="cp-map-search-input"
            />
          </div>

          <div className="cp-map-category-tabs">
            {categories.map(cat => (
              <button
                key={cat}
                className={`cp-map-cat-pill ${selectedCategory === cat ? 'active' : ''}`}
                onClick={() => setSelectedCategory(cat)}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Main Split Grid: Map Canvas (Left/Top) and Event Directory (Right/Bottom) */}
        <div className="cp-map-split-layout">
          {/* Map Column (Chandrashekhar Google Maps integration boundary) */}
          <div className={`cp-map-col ${mobileActiveTab === 'map' ? 'mobile-visible' : 'mobile-hidden'}`}>
            <CampusMap
              events={visibleEvents}
              selectedEventId={selectedEventId}
              onSelectEvent={handleSelectEvent}
            />
          </div>

          {/* Event List Column (Frontend owns cards & synchronization) */}
          <div className={`cp-list-col ${mobileActiveTab === 'list' ? 'mobile-visible' : 'mobile-hidden'}`}>
            <div className="cp-list-header">
              <div className="cp-list-count">
                <span>Locations</span>
                <strong>{visibleEvents.length} Active Venues</strong>
              </div>
              <span className="cp-selection-hint">Click card to highlight marker</span>
            </div>

            <div className="cp-sidebar-events-scroll">
              {loading ? (
                <div className="cp-sidebar-loading">Loading campus events...</div>
              ) : visibleEvents.length === 0 ? (
                <div className="cp-sidebar-empty">
                  <MapPin size={28} className="cp-empty-pin" />
                  <p>No campus events match your search.</p>
                </div>
              ) : (
                visibleEvents.map((evt, idx) => {
                  const isSelected = evt.id === selectedEventId;
                  const isSaved = savedEventIds.includes(evt.id);

                  return (
                    <div
                      key={evt.id}
                      className={`card cp-map-event-item ${isSelected ? 'selected' : ''}`}
                      onClick={() => handleSelectEvent(evt.id)}
                      role="button"
                      tabIndex={0}
                    >
                      <div className="cp-item-top">
                        <div className="cp-item-index-badge">{idx + 1}</div>
                        <div className="cp-item-badges">
                          <CategoryBadge category={evt.category} size="xs" />
                          <EventTypeBadge type={evt.eventType} size="xs" />
                        </div>
                        <button
                          className={`cp-item-bookmark ${isSaved ? 'saved' : ''}`}
                          onClick={(e) => {
                            e.stopPropagation();
                            handleToggleSave(evt.id, evt.title);
                          }}
                          aria-label="Bookmark event"
                        >
                          <Bookmark size={14} fill={isSaved ? "#6366F1" : "none"} />
                        </button>
                      </div>

                      <h4 className="cp-item-title">{evt.title}</h4>

                      <div className="cp-item-venue-row">
                        <MapPin size={13} className="cp-venue-icon" />
                        <span className="cp-item-venue">{evt.venue}</span>
                      </div>

                      <div className="cp-item-meta-row">
                        <div className="cp-item-date">
                          <Calendar size={13} />
                          <span>{new Date(evt.startDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
                        </div>
                        {evt.activityPoints && (
                          <div className="cp-item-pts">
                            <Award size={12} />
                            <span>+{evt.activityPoints} Pts</span>
                          </div>
                        )}
                      </div>

                      <div className="cp-item-actions">
                        <button
                          className="btn btn-sm btn-ghost cp-item-detail-btn"
                          onClick={(e) => {
                            e.stopPropagation();
                            openEventDetails(evt);
                          }}
                        >
                          <span>Full Details</span>
                          <ArrowRight size={13} />
                        </button>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
