import React from 'react';
import { useEvents } from '../../context/EventContext';
import { CategoryBadge, EventTypeBadge } from '../common/Badge';
import { 
  Calendar, 
  MapPin, 
  UserCheck, 
  Bookmark, 
  ArrowRight, 
  Award,
  Clock,
  ExternalLink
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

  // Format date and time from Date object
  const formatDateTime = (dateObj) => {
    if (!dateObj) return { date: '', time: '' };
    const date = dateObj instanceof Date ? dateObj : new Date(dateObj);
    if (isNaN(date.getTime())) return { date: '', time: '' };

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

  const { date: startDateStr, time: startTimeStr } = formatDateTime(event.startDateTime);

  const handleCardClick = (e) => {
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

  const organizerName = typeof event.organizer === 'string' 
    ? event.organizer 
    : event.organizer?.name || 'Campus Entity';

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
          src={event.imageUrl || "https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=1000&q=80"} 
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

        {/* Bookmark Toggle (Client-side only) */}
        <button
          className={`cp-card-bookmark-btn ${isSaved ? 'saved' : ''}`}
          onClick={handleBookmarkClick}
          title={isSaved ? "Remove from local bookmarks" : "Bookmark this event"}
          aria-label={isSaved ? "Remove from local bookmarks" : "Bookmark this event"}
        >
          <Bookmark size={16} fill={isSaved ? "#6366F1" : "none"} />
        </button>

        {/* Activity Points Tag (Strictly contract-backed, only if present) */}
        {event.activityPoints !== null && event.activityPoints > 0 && (
          <div className="cp-event-pts-badge" title="Official university activity points">
            <Award size={12} />
            <span>+{event.activityPoints} Activity Pts</span>
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

        {/* Description */}
        <p className="cp-event-description">
          {event.description}
        </p>

        {/* Venue Location */}
        <div className="cp-event-venue-row">
          <MapPin size={14} className="cp-venue-icon" />
          <span className="cp-venue-text" title={event.venueName}>
            {event.venueName}
          </span>
        </div>

        {/* Organizer */}
        <div className="cp-event-organizer-row">
          <UserCheck size={14} className="cp-organizer-icon" />
          <span className="cp-organizer-name">
            {organizerName}
          </span>
          {event.benefitsVerificationStatus === 'verified' && (
            <span className="cp-verified-check" title="Benefits Verified by Academic Authority">✓</span>
          )}
        </div>

        {/* Card Footer Actions (No fake capacity counters per Section 7) */}
        <div className="cp-event-card-footer">
          <div className="cp-registration-status-hint">
            {event.registrationRequired ? (
              <span className="cp-reg-tag required">Registration Required</span>
            ) : (
              <span className="cp-reg-tag open">Open Entry</span>
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
