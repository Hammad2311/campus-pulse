/**
 * Campus Pulse — Interactive Campus Map
 * 
 * MAP INTEGRATION BOUNDARY (Chandrashekhar):
 * This component reserves the dedicated full-viewport Google Maps JavaScript API container
 * and adheres strictly to the required contract:
 * 
 * <CampusMap
 *   events={events}
 *   selectedEventId={selectedEventId}
 *   onSelectEvent={handleSelectEvent}
 * />
 * 
 * CONTRACT COMPLIANCE:
 * - SelectedEventId is controlled strictly by the parent.
 * - Clicking a venue marker / chip triggers `onSelectEvent(id)` to open event details.
 * - Safe handling of events without physical GPS coordinates.
 * - Chandrashekhar will attach `new google.maps.Map(...)` to `#campus-pulse-google-map-container`.
 */

import React from 'react';
import { MapPin, Layers, Info, Compass } from 'lucide-react';
import { CategoryBadge } from '../common/Badge';
import './CampusMap.css';

export function CampusMap({ 
  events = [], 
  selectedEventId = null, 
  onSelectEvent 
}) {
  const selectedEvent = events.find(e => e.id === selectedEventId) || null;

  return (
    <div className="cp-map-full-viewport">
      {/* Primary Google Maps Mount Container */}
      <div 
        className="cp-map-canvas-full" 
        id="campus-pulse-google-map-container"
        tabIndex={0}
        aria-label="Campus Pulse Google Map"
      >
        {/* Placeholder Stage awaiting Chandrashekhar's Google Maps API initialization */}
        <div className="cp-map-stage-overlay">
          <div className="cp-map-boundary-pill">
            <span className="cp-status-dot pulse"></span>
            <span>Google Maps JavaScript API Boundary • Chandrashekhar</span>
          </div>

          <div className="cp-map-placeholder-hero">
            <div className="cp-placeholder-radar">
              <Compass size={40} className="cp-compass-icon" />
            </div>
            <h2 className="cp-map-lead-title">Interactive Campus Map</h2>
            <p className="cp-map-lead-desc">
              Select any campus venue below to inspect event details, schedules, and official registration requirements.
            </p>

            {/* Event Markers & Venue Pins for Testing Interaction */}
            <div className="cp-map-venues-grid">
              {events.map((evt) => {
                const isSelected = evt.id === selectedEventId;
                const hasCoords = typeof evt.latitude === 'number' && typeof evt.longitude === 'number';

                return (
                  <button
                    key={evt.id}
                    className={`cp-venue-marker-card ${isSelected ? 'active' : ''}`}
                    onClick={() => onSelectEvent && onSelectEvent(evt.id)}
                    title={`Click to inspect ${evt.title}`}
                  >
                    <div className="cp-venue-marker-top">
                      <div className="cp-marker-pin-icon">
                        <MapPin size={16} />
                      </div>
                      <CategoryBadge category={evt.category} size="xs" />
                    </div>
                    <div className="cp-venue-card-title">{evt.title}</div>
                    <div className="cp-venue-card-location">{evt.venueName}</div>
                    {hasCoords ? (
                      <span className="cp-venue-coords-tag">
                        [{evt.latitude.toFixed(3)}, {evt.longitude.toFixed(3)}]
                      </span>
                    ) : (
                      <span className="cp-venue-no-coords">Campus / Virtual</span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
