import React, { useState, useEffect } from 'react';
import { useEvents } from '../context/EventContext';
import { getEvents } from '../services/mockEventService';
import { CampusMap } from '../components/map/CampusMap';
import { APPROVED_CATEGORIES, CATEGORY_LABELS } from '../data/mockEvents';
import { Search, X, MapPin } from 'lucide-react';
import './CampusMapPage.css';

export function CampusMapPage() {
  const { 
    selectedEventId, 
    handleSelectEvent, 
    openEventDetails 
  } = useEvents();

  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchFilter, setSearchFilter] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  useEffect(() => {
    async function loadMapEvents() {
      setLoading(true);
      try {
        const { data, error } = await getEvents({ status: 'published' });
        if (!error && data) {
          setEvents(data);
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
    const matchesCat = selectedCategory === 'all' || e.category === selectedCategory;
    const matchesSearch = !searchFilter || 
      e.title.toLowerCase().includes(searchFilter.toLowerCase()) ||
      (e.venueName && e.venueName.toLowerCase().includes(searchFilter.toLowerCase()));
    return matchesCat && matchesSearch;
  });

  // Clicking an event marker synchronizes selection and immediately opens Event Details
  const handleMarkerSelect = (eventId) => {
    handleSelectEvent(eventId);
    const targetEvent = events.find(e => e.id === eventId);
    if (targetEvent) {
      openEventDetails(targetEvent);
    }
  };

  return (
    <div className="cp-map-homepage-root">
      {/* Sleek Floating Filter Overlay on Map */}
      <div className="cp-map-floating-controls">
        <div className="cp-floating-search-bar">
          <Search size={16} className="cp-floating-search-icon" />
          <input
            type="text"
            placeholder="Search campus venues or events..."
            value={searchFilter}
            onChange={(e) => setSearchFilter(e.target.value)}
            className="cp-floating-search-input"
          />
          {searchFilter && (
            <button 
              className="cp-floating-search-clear"
              onClick={() => setSearchFilter('')}
              aria-label="Clear search"
            >
              <X size={14} />
            </button>
          )}
        </div>

        {/* Floating Category Pills */}
        <div className="cp-floating-category-scroll">
          <button
            className={`cp-floating-cat-chip ${selectedCategory === 'all' ? 'active' : ''}`}
            onClick={() => setSelectedCategory('all')}
          >
            All Events ({events.length})
          </button>
          {APPROVED_CATEGORIES.map(catKey => {
            const count = events.filter(e => e.category === catKey).length;
            if (count === 0) return null; // Show only active categories for a distraction-free map
            return (
              <button
                key={catKey}
                className={`cp-floating-cat-chip ${selectedCategory === catKey ? 'active' : ''}`}
                onClick={() => setSelectedCategory(catKey)}
              >
                {CATEGORY_LABELS[catKey]} ({count})
              </button>
            );
          })}
        </div>
      </div>

      {/* Dominant Full-Viewport Map Component */}
      <div className="cp-map-stage-container">
        <CampusMap
          events={visibleEvents}
          selectedEventId={selectedEventId}
          onSelectEvent={handleMarkerSelect}
        />
      </div>
    </div>
  );
}
