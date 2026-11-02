import { useEffect, useMemo, useRef, useState } from 'react';
import campusMapImage from '../../assets/alliance-university-campus-map.png';
import './CampusMap.css';

// Marker anchors correspond to the 19 entries in the supplied Alliance University campus directory.
// The Library marker uses the first clearly labelled #6 building; confirm this anchor with the team.
const CAMPUS_VENUES = [
  { id: 'security-office', name: 'Security Office', x: 29.23, y: 92.48 },
  { id: 'parking', name: 'Parking', x: 29.62, y: 82.23 },
  { id: 'administrative-block', name: 'Administrative Block', x: 47.14, y: 50.98 },
  { id: 'learning-centre-1', name: 'Learning Centre 1', x: 17.19, y: 68.95 },
  { id: 'learning-centre-2', name: 'Learning Centre 2', x: 21.22, y: 56.74 },
  { id: 'library', name: 'Library', x: 39.45, y: 24.12 },
  { id: 'volleyball-ground', name: 'Volleyball Ground', x: 27.41, y: 27.25 },
  { id: 'alfresco', name: 'Al Fresco (Event Space)', x: 28.13, y: 42.28 },
  { id: 'central-green', name: 'Central Green', x: 39.97, y: 41.21 },
  { id: 'academic-block', name: 'Academic Block', x: 45.70, y: 21.39 },
  { id: 'food-court', name: 'Food Court', x: 25.07, y: 70.80 },
  { id: 'temple', name: 'Temple', x: 50.78, y: 35.25 },
  { id: 'play-courts', name: 'Play Courts', x: 56.64, y: 49.02 },
  { id: 'university-parking', name: 'University Parking', x: 58.85, y: 18.55 },
  { id: 'service-gate', name: 'Service Gate', x: 33.40, y: 20.61 },
  { id: 'cricket-ground', name: 'Cricket Ground', x: 17.71, y: 36.62 },
  { id: 'learning-centre-3', name: 'Learning Centre 3', x: 37.43, y: 72.00 },
  { id: 'student-activity-centre', name: 'Student Activity Centre', x: 37.96, y: 84.57 },
  { id: 'innovation-activity-block', name: 'Innovation / Activity Block', x: 42.84, y: 52.83 },
];

const CATEGORY_MARKERS = {
  guest_lecture: { icon: '🎓', color: '#2563eb' },
  technical_workshop: { icon: '💻', color: '#7c3aed' },
  hackathon: { icon: '🚀', color: '#ea580c' },
  club_activity: { icon: '🎭', color: '#db2777' },
  competition: { icon: '🏆', color: '#ca8a04' },
  cultural_program: { icon: '🎨', color: '#c026d3' },
  sports_event: { icon: '⚽', color: '#16a34a' },
  seminar: { icon: '🎤', color: '#0891b2' },
  department_event: { icon: '🏛️', color: '#475569' },
  other: { icon: '📍', color: '#64748b' },
};

function normalizeVenue(value) {
  return String(value || '')
    .toLowerCase()
    .replace(/&/g, 'and')
    .replace(/[.,()/_-]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

// Match a normalized full directory name only. Partial or guessed matches stay unplaced.
function findVenue(event) {
  const venueName = normalizeVenue(event?.venueName);
  if (!venueName) return null;
  return CAMPUS_VENUES.find((venue) => normalizeVenue(venue.name) === venueName) || null;
}

function getCategoryMarker(category) {
  return CATEGORY_MARKERS[category] || CATEGORY_MARKERS.other;
}

export function CampusMap({ events = [], selectedEventId = null, onSelectEvent }) {
  const viewportRef = useRef(null);
  const dragRef = useRef(null);
  const [stageSize, setStageSize] = useState({ width: 0, height: 0 });
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);

  const safeEvents = Array.isArray(events) ? events : [];
  const positionedEvents = useMemo(() => safeEvents
    .map((event) => ({ event, venue: findVenue(event) }))
    .filter((item) => item.venue), [safeEvents]);
  const unlocatedEvents = useMemo(() => safeEvents.filter((event) => !findVenue(event)), [safeEvents]);

  useEffect(() => {
    const viewport = viewportRef.current;
    if (!viewport) return undefined;

    const updateStageSize = (width, height) => {
      const fittedWidth = Math.max(1, Math.min(width, height * 1.5));
      setStageSize({ width: fittedWidth, height: fittedWidth / 1.5 });
    };

    if (typeof ResizeObserver !== 'undefined') {
      const observer = new ResizeObserver(([entry]) => {
        updateStageSize(entry.contentRect.width, entry.contentRect.height);
      });
      observer.observe(viewport);
      return () => observer.disconnect();
    }

    const updateFromViewport = () => {
      const bounds = viewport.getBoundingClientRect();
      updateStageSize(bounds.width, bounds.height);
    };
    updateFromViewport();
    window.addEventListener('resize', updateFromViewport);
    return () => window.removeEventListener('resize', updateFromViewport);
  }, []);

  useEffect(() => {
    if (zoom === 1) setPan({ x: 0, y: 0 });
  }, [zoom]);

  const changeZoom = (amount) => {
    setZoom((current) => Math.min(3.5, Math.max(1, Number((current + amount).toFixed(2)))));
  };

  const resetView = () => {
    setZoom(1);
    setPan({ x: 0, y: 0 });
  };

  const handlePointerDown = (event) => {
    if (zoom <= 1 || event.target.closest('button, .cp-campus-map-unlocated')) return;
    dragRef.current = { pointerId: event.pointerId, x: event.clientX, y: event.clientY };
    event.currentTarget.setPointerCapture(event.pointerId);
    setIsDragging(true);
  };

  const handlePointerMove = (event) => {
    if (!dragRef.current || dragRef.current.pointerId !== event.pointerId) return;
    const deltaX = event.clientX - dragRef.current.x;
    const deltaY = event.clientY - dragRef.current.y;
    dragRef.current = { ...dragRef.current, x: event.clientX, y: event.clientY };
    setPan((current) => {
      const maxX = (stageSize.width * (zoom - 1)) / 2;
      const maxY = (stageSize.height * (zoom - 1)) / 2;
      return {
        x: Math.max(-maxX, Math.min(maxX, current.x + deltaX)),
        y: Math.max(-maxY, Math.min(maxY, current.y + deltaY)),
      };
    });
  };

  const stopDragging = () => {
    dragRef.current = null;
    setIsDragging(false);
  };

  const stageTransform = `translate(calc(-50% + ${pan.x}px), calc(-50% + ${pan.y}px)) scale(${zoom})`;

  return (
    <section className="cp-map-full-viewport" aria-label="Alliance University campus event map">
      <div
        ref={viewportRef}
        className={`cp-campus-map-viewport${isDragging ? ' is-dragging' : ''}`}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={stopDragging}
        onPointerCancel={stopDragging}
        onLostPointerCapture={stopDragging}
      >
        <div
          className="cp-campus-map-stage"
          style={{
            width: `${stageSize.width}px`,
            height: `${stageSize.height}px`,
            transform: stageTransform,
          }}
        >
          <img
            className="cp-campus-map-image"
            src={campusMapImage}
            alt="Alliance University campus directory showing 19 campus locations"
            draggable="false"
          />

          {positionedEvents.map(({ event, venue }, index) => {
            const marker = getCategoryMarker(event.category);
            const isSelected = event.id === selectedEventId;
            const sameVenueIndex = positionedEvents
              .slice(0, index)
              .filter((item) => item.venue.id === venue.id).length;
            const offset = sameVenueIndex === 0
              ? 0
              : (sameVenueIndex % 2 === 0 ? 1 : -1) * Math.ceil(sameVenueIndex / 2) * 17;

            return (
              <button
                key={event.id || `${venue.id}-${index}`}
                type="button"
                className={`cp-campus-event-marker${isSelected ? ' is-selected' : ''}`}
                style={{
                  left: `${venue.x}%`,
                  top: `${venue.y}%`,
                  '--event-marker-color': marker.color,
                  '--event-marker-offset': `${offset}px`,
                }}
                aria-label={`${event.title || 'Campus event'} at ${venue.name}`}
                aria-pressed={isSelected}
                title={`${event.title || 'Campus event'} — ${venue.name}`}
                onClick={() => {
                  if (event.id && typeof onSelectEvent === 'function') onSelectEvent(event.id);
                }}
              >
                <span aria-hidden="true">{marker.icon}</span>
              </button>
            );
          })}
        </div>
      </div>

      <div className="cp-campus-map-controls" aria-label="Map controls">
        <button type="button" onClick={() => changeZoom(0.25)} aria-label="Zoom in" title="Zoom in">+</button>
        <button type="button" onClick={() => changeZoom(-0.25)} aria-label="Zoom out" title="Zoom out">−</button>
        <button type="button" onClick={resetView} aria-label="Reset map view" title="Reset view">↺</button>
      </div>

      <div className="cp-campus-map-hint" aria-live="polite">
        {positionedEvents.length > 0
          ? `${positionedEvents.length} event${positionedEvents.length === 1 ? '' : 's'} placed on campus map`
          : 'Campus directory map'}
        {zoom > 1 && <span> · Drag to move</span>}
      </div>

      {unlocatedEvents.length > 0 && (
        <details className="cp-campus-map-unlocated">
          <summary>{unlocatedEvents.length} event{unlocatedEvents.length === 1 ? '' : 's'} with unmatched venue</summary>
          <ul>
            {unlocatedEvents.map((event, index) => (
              <li key={event.id || `${event.title || 'event'}-${index}`}>
                <button
                  type="button"
                  onClick={() => {
                    if (event.id && typeof onSelectEvent === 'function') onSelectEvent(event.id);
                  }}
                >
                  <span>{event.title || 'Untitled event'}</span>
                  <small>{event.venueName || 'Venue not specified'}</small>
                </button>
              </li>
            ))}
          </ul>
        </details>
      )}
    </section>
  );
}

export default CampusMap;
