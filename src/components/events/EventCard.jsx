import React from 'react';
import { useEvents } from '../../context/EventContext';
import { CategoryBadge, EventTypeBadge, Badge } from '../common/Badge';
import { 
  Calendar, 
  MapPin, 
  UserCheck, 
  Bookmark, 
  ArrowRight, 
  Award,
  Clock
} from 'lucide-react';
import './EventCard.css';

export function EventCard({ event, isSelected = false, onSelect }) {
  const { 
    openEventDetails, 
    savedEventIds, 
    handleToggleSave, 
    handleSelectEvent 
  } = useEvents();

  if (!event) return null;

  const isSaved = savedEventIds.includes(event.id);

  // Format date and time
  const formatDateTime = (isoString) => {
    if (!isoString) return '';
    const date = new Date(isoString);
    const dateFormatted = date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
    const timeFormatted = date.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
    return { date: dateFormatted, time: timeFormatted };
  };

  const { date: startDateStr, time: startTimeStr } = formatDateTime(event.startDate);

  const handleCardClick = (e) => {
    // If clicking bookmark button, don't trigger card selection/details
    if (e.target.closest('.cp-card-bookmark-btn')) return;

    if (onSelect) {
      onSelect(event.id);
    } else {
      handleSelectEvent(event.id);
    }
  };

  const handleViewDetails = (e) => {
    e.stopPropagation();
    openEventDetails(event);
  };

  const handleBookmarkClick = (e) => {
    e.stopPropagation();
    handleToggleSave(event.id, event.title);
  };

  return (
    <div 
      className={`card cp-event-card ${isSelected ? 'selected' : ''}`}
      onClick={handleCardClick}
      role="article"
      tabIndex={0}
      onKeyDown={(e) => e.key === 'Enter' && handleViewDetails(e)}
    >
      {/* Thumbnail Banner */}
      <div className="cp-event-thumb-wrap">
        <img 
          src={event.image} 
          alt={event.title}
          className="cp-event-thumb"
          loading="lazy"
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = "https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=1000&q=80";
          }}
        />
        <div className="cp-event-thumb-overlay"></div>

        {/* Badges on thumbnail */}
        <div className="cp-event-thumb-badges">
          <CategoryBadge category={event.category} size="xs" />
          <EventTypeBadge type={event.eventType} size="xs" />
        </div>

        {/* Bookmark Toggle */}
        <button
          className={`cp-card-bookmark-btn ${isSaved ? 'saved' : ''}`}
          onClick={handleBookmarkClick}
          title={isSaved ? "Remove from saved events" : "Save this event"}
          aria-label={isSaved ? "Remove from saved events" : "Save this event"}
        >
          <Bookmark size={16} fill={isSaved ? "#6366F1" : "none"} />
        </button>

        {/* Activity Points Chip if available */}
        {event.activityPoints !== undefined && event.activityPoints > 0 && (
          <div className="cp-event-pts-badge">
            <Award size={12} />
            <span>+{event.activityPoints} Pts</span>
          </div>
        )}
      </div>

      {/* Card Body */}
      <div className="cp-event-card-body">
        {/* Date and Time Row */}
        <div className="cp-event-meta-row">
          <div className="cp-meta-item cp-date-item">
            <Calendar size={14} className="cp-meta-icon" />
            <span>{startDateStr}</span>
          </div>
          <span className="cp-meta-sep">•</span>
          <div className="cp-meta-item cp-time-item">
            <Clock size={14} className="cp-meta-icon" />
            <span>{startTimeStr}</span>
          </div>
        </div>

        {/* Title */}
        <h3 className="cp-event-title" title={event.title}>
          {event.title}
        </h3>

        {/* Short Description */}
        <p className="cp-event-description">
          {event.shortDescription || event.description}
        </p>

        {/* Venue Location */}
        <div className="cp-event-venue-row">
          <MapPin size={14} className="cp-venue-icon" />
          <span className="cp-venue-text" title={event.venue}>
            {event.venue}
          </span>
        </div>

        {/* Organizer */}
        <div className="cp-event-organizer-row">
          <UserCheck size={14} className="cp-organizer-icon" />
          <span className="cp-organizer-name">
            {event.organizer?.name || 'Campus Organizer'}
          </span>
          {event.organizer?.isVerified && (
            <span className="cp-verified-check" title="Verified Campus Entity">✓</span>
          )}
        </div>

        {/* Card Footer Actions */}
        <div className="cp-event-card-footer">
          <div className="cp-capacity-indicator">
            {event.capacity ? (
              <span className="cp-capacity-text">
                <strong>{event.registeredCount || 0}</strong> / {event.capacity} registered
              </span>
            ) : (
              <span className="cp-capacity-text">Open seating</span>
            )}
          </div>
          <button 
            className="btn btn-sm btn-outline cp-details-btn"
            onClick={handleViewDetails}
          >
            <span>View Details</span>
            <ArrowRight size={14} />
          </button>
        </div>
      </div>
    </div>
  );
}
