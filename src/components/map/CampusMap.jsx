/**
 * Campus Pulse — Interactive Campus Map Placeholder
 * 
 * MAP INTEGRATION BOUNDARY (Chandrashekhar):
 * This component reserves the dedicated Google Maps JavaScript API container
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
 * - No fake map markers, dummy campus landmarks, or invented coordinates.
 * - Events with null or non-numeric latitude/longitude are supported safely.
 * - Chandrashekhar will attach `new google.maps.Map(...)` to `#campus-pulse-google-map-container`.
 */

import React from 'react';
import { MapPin, Layers, Navigation, Info } from 'lucide-react';
import { CategoryBadge } from '../common/Badge';
import './CampusMap.css';

export function CampusMap({ 
  events = [], 
  selectedEventId = null, 
  onSelectEvent 
}) {
  const selectedEvent = events.find(e => e.id === selectedEventId) || null;

  // Validate coordinates
  const hasCoordinates = selectedEvent && 
    typeof selectedEvent.latitude === 'number' && 
    !isNaN(selectedEvent.latitude) &&
    typeof selectedEvent.longitude === 'number' && 
    !isNaN(selectedEvent.longitude);

  return (
    <div className="cp-map-wrapper">
      {/* Top Map Control Bar */}
      <div className="cp-map-controls-bar">
        <div className="cp-map-status-pill">
          <span className="cp-status-dot pulse"></span>
          <span>Google Maps API Integration Boundary</span>
        </div>
        <div className="cp-map-stats">
          <MapPin size={14} className="cp-map-stat-icon" />
          <span>{events.length} events listed</span>
        </div>
      </div>

      {/* Dedicated Google Maps Container awaiting Chandrashekhar's implementation */}
      <div 
        className="cp-map-canvas" 
        id="campus-pulse-google-map-container"
        tabIndex={0}
        aria-label="Google Maps Container"
      >
        <div className="cp-map-placeholder-stage">
          <div className="cp-map-placeholder-icon">
            <Layers size={36} />
          </div>
          <h3 className="cp-placeholder-title">Interactive Campus Map Container</h3>
          <p className="cp-placeholder-desc">
            Reserved DOM mount point (<code>#campus-pulse-google-map-container</code>) configured for Chandrashekhar's Google Maps JavaScript API integration.
          </p>

          <div className="cp-placeholder-contract-card">
            <div className="cp-contract-header">
              <Info size={15} />
              <span>Agreed Component Interface</span>
            </div>
            <pre className="cp-contract-code">
{`<CampusMap
  events={events}
  selectedEventId="${selectedEventId || 'none'}"
  onSelectEvent={handleSelectEvent}
/>`}
            </pre>
          </div>
        </div>
      </div>

      {/* Selected Event Context Bar */}
      {selectedEvent ? (
        <div className="cp-map-selected-footer">
          <div className="cp-selected-info">
            <CategoryBadge category={selectedEvent.category} size="xs" />
            <span className="cp-selected-title">{selectedEvent.title}</span>
            <span className="cp-selected-venue">• {selectedEvent.venueName}</span>
            {hasCoordinates ? (
              <span className="cp-selected-coords">
                [{selectedEvent.latitude.toFixed(4)}, {selectedEvent.longitude.toFixed(4)}]
              </span>
            ) : (
              <span className="cp-no-coords-badge">
                Coordinates not specified
              </span>
            )}
          </div>
        </div>
      ) : (
        <div className="cp-map-selected-footer empty">
          <Navigation size={14} />
          <span>Select an event from the listing to synchronize coordinates with the map boundary.</span>
        </div>
      )}
    </div>
  );
}
