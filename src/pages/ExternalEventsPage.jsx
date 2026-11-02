import React, { useState, useEffect } from 'react';
import { useEvents } from '../context/EventContext';
import { fetchEvents } from '../services/eventService';
import { EventCard } from '../components/events/EventCard';
import { 
  Globe2, 
  Search, 
  ExternalLink, 
  Sparkles, 
  Trophy, 
  Laptop, 
  Compass, 
  X,
  RotateCcw
} from 'lucide-react';
import './ExternalEventsPage.css';

export function ExternalEventsPage() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  useEffect(() => {
    async function loadExternal() {
      setLoading(true);
      try {
        const data = await fetchEvents({
          eventType: 'external',
          status: 'published'
        });
        setEvents(data);
      } catch (err) {
        console.error('Failed to load external events', err);
      } finally {
        setLoading(false);
      }
    }
    loadExternal();
  }, []);

  const filteredEvents = events.filter(e => {
    const matchesCat = selectedCategory === 'All' || e.category.toLowerCase() === selectedCategory.toLowerCase();
    const query = searchQuery.trim().toLowerCase();
    const matchesSearch = !query ||
      e.title.toLowerCase().includes(query) ||
      e.description.toLowerCase().includes(query) ||
      e.venue.toLowerCase().includes(query) ||
      e.organizer.name.toLowerCase().includes(query);
    return matchesCat && matchesSearch;
  });

  const categories = ['All', 'Hackathon', 'Technology', 'Social', 'Workshop'];

  return (
    <div className="cp-external-page">
      {/* Hero Banner for External Events */}
      <div className="cp-external-hero">
        <div className="container">
          <div className="cp-external-hero-content">
            <div className="cp-page-tag cp-external-tag">
              <Globe2 size={15} />
              <span>Inter-Collegiate & Global Opportunities</span>
            </div>
            <h1 className="cp-external-title">External Hackathons & Summits</h1>
            <p className="cp-external-desc">
              Broaden your horizons beyond our campus walls. Discover flagship 36-hour hackathons, nationwide entrepreneurship summits, and virtual developer sprints with international mentors and prize pools.
            </p>
          </div>
        </div>
      </div>

      <div className="container cp-external-body">
        {/* Filter & Search Bar */}
        <div className="cp-external-filter-bar">
          <div className="cp-external-search-wrap">
            <Search size={18} className="cp-external-search-icon" />
            <input
              type="text"
              placeholder="Search external hackathons, cities, or organizers..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="cp-external-search-input"
            />
            {searchQuery && (
              <button 
                className="cp-external-search-clear"
                onClick={() => setSearchQuery('')}
              >
                <X size={15} />
              </button>
            )}
          </div>

          <div className="cp-external-cat-tabs">
            {categories.map(cat => (
              <button
                key={cat}
                className={`cp-external-cat-pill ${selectedCategory === cat ? 'active' : ''}`}
                onClick={() => setSelectedCategory(cat)}
              >
                {cat}
              </button>
            ))}
          </div>

          {(searchQuery || selectedCategory !== 'All') && (
            <button
              className="btn btn-secondary btn-sm cp-external-reset-btn"
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory('All');
              }}
            >
              <RotateCcw size={14} />
              <span>Reset</span>
            </button>
          )}
        </div>

        {/* Results Header */}
        <div className="cp-external-results-header">
          <div className="cp-external-count">
            Found <strong>{filteredEvents.length}</strong> external events & national hackathons
          </div>
        </div>

        {/* Results Grid */}
        {loading ? (
          <div className="cp-external-loading-grid">
            {[1, 2, 3].map(i => (
              <div key={i} className="cp-skeleton-card"></div>
            ))}
          </div>
        ) : filteredEvents.length === 0 ? (
          <div className="card cp-empty-state">
            <Globe2 size={40} className="cp-empty-icon" />
            <h3 className="cp-empty-title">No external events found</h3>
            <p className="cp-empty-desc">
              We couldn't find any external listings matching your criteria. Try adjusting your search keywords.
            </p>
          </div>
        ) : (
          <div className="cp-external-grid">
            {filteredEvents.map(event => (
              <EventCard key={event.id} event={event} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
