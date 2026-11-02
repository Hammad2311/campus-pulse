/**
 * Campus Pulse - Interactive Campus Map Component
 * 
 * INTEGRATION NOTICE FOR CHANDRASHEKHAR:
 * This component defines the exact frontend integration boundary for the Google Maps JavaScript API.
 * 
 * Component Interface Contract:
 * <CampusMap
 *   events={visibleEvents}
 *   selectedEventId={selectedEventId}
 *   onSelectEvent={handleSelectEvent}
 * />
 * 
 * Ownership Rules:
 * - Chandrashekhar owns the Google Maps API loader, API keys, map styles, and native markers.
 * - Frontend owns `selectedEventId` and propagates selection to and from cards.
 * - This file provides the interactive placeholder and marker state sync boundary.
 */

import React from 'react';
import { MapPin, Navigation, Compass, Layers, Info, CheckCircle2 } from 'lucide-react';
import { CategoryBadge } from '../common/Badge';
import './CampusMap.css';

export function CampusMap({ 
  events = [], 
  selectedEventId = null, 
  onSelectEvent 
}) {
  const selectedEvent = events.find(e => e.id === selectedEventId);

  // Default campus landmarks for spatial demonstration
  const campusZones = [
    { name: "Academic Quadrangle", x: "32%", y: "38%", type: "academic" },
    { name: "Innovation Hub & Labs", x: "65%", y: "30%", type: "tech" },
    { name: "Amphitheatre & Arts Wing", x: "28%", y: "68%", type: "cultural" },
    { name: "Central Sports Arena", x: "72%", y: "70%", type: "sports" }
  ];

  // Helper to distribute events across a mock 2D campus grid for interactive demo
  const getMarkerCoords = (index, total) => {
    // Generate clean spread coordinates inside the campus canvas (percentages)
    const positions = [
      { x: "35%", y: "42%" }, // Sarabhai Hall
      { x: "68%", y: "32%" }, // Innovation Hub
      { x: "30%", y: "65%" }, // Amphitheatre
      { x: "74%", y: "68%" }, // Sports Complex
      { x: "48%", y: "35%" }, // Turing Lab
      { x: "42%", y: "52%" }, // Raman Auditorium
      { x: "82%", y: "25%" }, // Downtown Metro (External)
      { x: "55%", y: "46%" }, // Cyber Block
      { x: "25%", y: "55%" }  // Student Plaza
    ];
    return positions[index % positions.length];
  };

  return (
    <div className="cp-map-wrapper">
      {/* Top Map Control Bar */}
      <div className="cp-map-controls-bar">
        <div className="cp-map-status-pill">
          <span className="cp-status-dot pulse"></span>
          <span>Google Maps API Integration Boundary Ready</span>
        </div>
        <div className="cp-map-stats">
          <MapPin size={14} className="cp-map-stat-icon" />
          <span>{events.length} mapped campus events</span>
        </div>
      </div>

      {/* Interactive Map Visual Stage (Awaiting Chandrashekhar's Google Maps canvas) */}
      <div className="cp-map-canvas" id="campus-pulse-google-map-container">
        {/* Architectural Blueprint Campus Grid Background */}
        <div className="cp-map-grid-overlay"></div>
        <div className="cp-map-roads-svg">
          <svg width="100%" height="100%" viewBox="0 0 800 500" preserveAspectRatio="none">
            <path d="M 0 250 Q 250 200 400 250 T 800 250" stroke="rgba(99, 102, 241, 0.15)" strokeWidth="18" fill="none" />
            <path d="M 400 0 L 400 500" stroke="rgba(99, 102, 241, 0.15)" strokeWidth="14" fill="none" />
            <path d="M 150 100 L 650 400" stroke="rgba(99, 102, 241, 0.1)" strokeWidth="10" strokeDasharray="6 6" fill="none" />
            <circle cx="400" cy="250" r="80" stroke="rgba(99, 102, 241, 0.12)" strokeWidth="4" fill="rgba(238, 242, 255, 0.3)" />
          </svg>
        </div>

        {/* Campus Landmark Labels */}
        {campusZones.map((zone, idx) => (
          <div 
            key={idx} 
            className="cp-campus-zone-label"
            style={{ left: zone.x, top: zone.y }}
          >
            <span>{zone.name}</span>
          </div>
        ))}

        {/* Event Markers placed on campus space */}
        {events.map((evt, index) => {
          const isSelected = evt.id === selectedEventId;
          const pos = getMarkerCoords(index, events.length);

          return (
            <div
              key={evt.id}
              className={`cp-map-marker ${isSelected ? 'active' : ''}`}
              style={{ left: pos.x, top: pos.y }}
              onClick={() => onSelectEvent && onSelectEvent(evt.id)}
              role="button"
              tabIndex={0}
              aria-label={`Select event: ${evt.title}`}
              title={`${evt.title} @ ${evt.venue}`}
            >
              <div className="cp-marker-pin">
                <MapPin size={isSelected ? 26 : 20} />
                <span className="cp-marker-index">{index + 1}</span>
              </div>

              {/* Marker Tooltip / Hover Card */}
              <div className={`cp-marker-popup ${isSelected ? 'visible' : ''}`}>
                <div className="cp-popup-category">{evt.category}</div>
                <div className="cp-popup-title">{evt.title}</div>
                <div className="cp-popup-venue">{evt.venue}</div>
              </div>
            </div>
          );
        })}

        {/* Overlay Notice for Team Members */}
        <div className="cp-map-integration-banner">
          <div className="cp-banner-icon">
            <Layers size={16} />
          </div>
          <div className="cp-banner-text">
            <strong>Interactive Map Container:</strong> Dedicated canvas configured for Chandrashekhar's Google Maps JS API component.
          </div>
        </div>
      </div>

      {/* Bottom Selected Event Quick Bar */}
      {selectedEvent ? (
        <div className="cp-map-selected-footer">
          <div className="cp-selected-info">
            <CategoryBadge category={selectedEvent.category} size="xs" />
            <span className="cp-selected-title">{selectedEvent.title}</span>
            <span className="cp-selected-venue">• {selectedEvent.venue}</span>
            {selectedEvent.coordinates && (
              <span className="cp-selected-coords">
                [{selectedEvent.coordinates.lat.toFixed(4)}, {selectedEvent.coordinates.lng.toFixed(4)}]
              </span>
            )}
          </div>
          <button 
            className="btn btn-sm btn-primary"
            onClick={() => onSelectEvent && onSelectEvent(selectedEvent.id)}
          >
            Highlight on List
          </button>
        </div>
      ) : (
        <div className="cp-map-selected-footer empty">
          <Navigation size={14} />
          <span>Click any campus marker above to focus the corresponding event in the listing.</span>
        </div>
      )}
    </div>
  );
}
