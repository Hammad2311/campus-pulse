import React, { useState, useEffect } from 'react';
import { useEvents } from '../context/EventContext';
import { getPublishedEvents } from '../services/eventService';
import { CampusMap } from '../components/map/CampusMap';
import { APPROVED_CATEGORIES, CATEGORY_LABELS } from '../data/mockEvents';
import { Search, X } from 'lucide-react';
import './CampusMapPage.css';

export function CampusMapPage() {
  const { selectedEventId, handleSelectEvent, openEventDetails } = useEvents();

  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchFilter, setSearchFilter] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  useEffect(() => {
    let active = true;

    async function loadMapEvents() {
      setLoading(true);
      const { data, error } = await getPublishedEvents();

      if (!active) return;

      if (error) {
        console.error('Firestore events error:', error);
      } else {
        setEvents(data || []);
      }

      setLoading(false);
    }

    loadMapEvents();
    return () => { active = false; };
  }, []);

  const visibleEvents = events.filter(e => {
    const matchesCat = selectedCategory === 'all' || e.category === selectedCategory;
    const search = searchFilter.toLowerCase();

    const matchesSearch = !search ||
      (e.title || '').toLowerCase().includes(search) ||
      (e.venueName || '').toLowerCase().includes(search);

    return matchesCat && matchesSearch;
  });

  const handleMarkerSelect = (eventId) => {
    handleSelectEvent(eventId);
    const event = events.find(e => e.id === eventId);
    if (event) openEventDetails(event);
  };

  return (
    <div className="cp-map-homepage-root">
      <div className="cp-map-floating-controls">
        <div className="cp-floating-search-bar">
          <Search size={16} className="cp-floating-search-icon" />
          <input
            type="text"
            placeholder="Search campus venues or events..."
            value={searchFilter}
            onChange={e => setSearchFilter(e.target.value)}
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

        <div className="cp-floating-category-scroll">
          <button
            className={`cp-floating-cat-chip ${selectedCategory === 'all' ? 'active' : ''}`}
            onClick={() => setSelectedCategory('all')}
          >
            All Events ({events.length})
          </button>

          {APPROVED_CATEGORIES.map(cat => {
            const count = events.filter(e => e.category === cat).length;
            if (!count) return null;

            return (
              <button
                key={cat}
                className={`cp-floating-cat-chip ${selectedCategory === cat ? 'active' : ''}`}
                onClick={() => setSelectedCategory(cat)}
              >
                {CATEGORY_LABELS[cat]} ({count})
              </button>
            );
          })}
        </div>
      </div>

      <div className="cp-map-stage-container">
        <CampusMap
          events={visibleEvents}
          selectedEventId={selectedEventId}
          onSelectEvent={handleMarkerSelect}
        />
        {loading && (
          <div style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            background: 'white',
            padding: '12px 20px',
            borderRadius: '12px',
            boxShadow: '0 4px 20px #0002',
            zIndex: 10
          }}>
            Loading campus events...
          </div>
        )}
      </div>
    </div>
  );
}
