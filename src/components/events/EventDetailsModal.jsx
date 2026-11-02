import React, { useEffect } from 'react';
import { useEvents } from '../../context/EventContext';
import { CategoryBadge, EventTypeBadge, Badge, VerificationBadge } from '../common/Badge';
import { INTEREST_AREA_LABELS } from '../../data/mockEvents';
import { 
  X, 
  Calendar, 
  Clock, 
  MapPin, 
  UserCheck, 
  ExternalLink, 
  Award, 
  CheckCircle2, 
  FileCheck, 
  Sparkles, 
  Bookmark,
  Share2,
  AlertCircle,
  ShieldCheck
} from 'lucide-react';
import './EventDetailsModal.css';

export function EventDetailsModal() {
  const { 
    activeModalEvent, 
    closeEventDetails, 
    savedEventIds, 
    handleToggleSave, 
    navigateTo,
    showToast
  } = useEvents();

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        closeEventDetails();
      }
    };
    if (activeModalEvent) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.body.style.overflow = 'auto';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [activeModalEvent, closeEventDetails]);

  if (!activeModalEvent) return null;

  const event = activeModalEvent;
  const isSaved = savedEventIds.includes(event.id);

  // Date formatting helpers for JavaScript Date instances
  const formatDateTimeRange = (startObj, endObj) => {
    if (!startObj) return { date: '', time: '' };
    const start = startObj instanceof Date ? startObj : new Date(startObj);
    const end = endObj ? (endObj instanceof Date ? endObj : new Date(endObj)) : null;

    if (isNaN(start.getTime())) return { date: '', time: '' };

    const dateOptions = { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' };
    const timeOptions = { hour: 'numeric', minute: '2-digit', hour12: true };

    const startDateStr = start.toLocaleDateString('en-US', dateOptions);
    const startTimeStr = start.toLocaleTimeString('en-US', timeOptions);

    let endStr = '';
    if (end && !isNaN(end.getTime())) {
      const isSameDay = start.toDateString() === end.toDateString();
      if (isSameDay) {
        endStr = end.toLocaleTimeString('en-US', timeOptions);
      } else {
        endStr = `${end.toLocaleDateString('en-US', dateOptions)} at ${end.toLocaleTimeString('en-US', timeOptions)}`;
      }
    }

    return {
      date: startDateStr,
      time: endStr ? `${startTimeStr} - ${endStr}` : startTimeStr
    };
  };

  const { date: formattedDate, time: formattedTime } = formatDateTimeRange(event.startDateTime, event.endDateTime);

  const handleCopyLink = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.origin + '#' + event.id);
      showToast('Event link copied to clipboard!', 'info');
    }
  };

  const handleViewOnMap = () => {
    closeEventDetails();
    navigateTo('map', { selectedEventId: event.id });
  };

  const organizerName = typeof event.organizer === 'string' 
    ? event.organizer 
    : event.organizer?.name || 'Campus Entity';

  return (
    <div className="cp-modal-backdrop" onClick={closeEventDetails}>
      <div 
        className="cp-modal-dialog"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-event-title"
      >
        {/* Modal Close Button */}
        <button 
          className="cp-modal-close-btn"
          onClick={closeEventDetails}
          aria-label="Close modal"
        >
          <X size={20} />
        </button>

        {/* Modal Header Image */}
        <div className="cp-modal-banner-wrap">
          <img 
            src={event.imageUrl || "https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=1200&q=80"} 
            alt={event.title}
            className="cp-modal-banner"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = "https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=1200&q=80";
            }}
          />
          <div className="cp-modal-banner-gradient"></div>

          <div className="cp-modal-banner-content">
            <div className="cp-modal-badges">
              <CategoryBadge category={event.category} size="md" />
              <EventTypeBadge type={event.eventType} size="md" />
              <VerificationBadge status={event.benefitsVerificationStatus} size="sm" />
              {event.status === 'draft' && <Badge variant="draft">Draft (Private)</Badge>}
              {event.status === 'cancelled' && <Badge variant="cancelled">Cancelled</Badge>}
            </div>

            <h1 id="modal-event-title" className="cp-modal-title">
              {event.title}
            </h1>
          </div>
        </div>

        {/* Modal Content Grid */}
        <div className="cp-modal-body">
          <div className="cp-modal-main">
            {/* Quick Details Bar */}
            <div className="cp-modal-meta-grid">
              <div className="cp-modal-meta-card">
                <Calendar className="cp-modal-meta-icon" size={18} />
                <div>
                  <div className="cp-meta-label">Date</div>
                  <div className="cp-meta-value">{formattedDate}</div>
                </div>
              </div>

              <div className="cp-modal-meta-card">
                <Clock className="cp-modal-meta-icon" size={18} />
                <div>
                  <div className="cp-meta-label">Time</div>
                  <div className="cp-meta-value">{formattedTime}</div>
                </div>
              </div>

              <div className="cp-modal-meta-card cp-meta-venue-card">
                <MapPin className="cp-modal-meta-icon" size={18} />
                <div className="cp-venue-action-wrap">
                  <div>
                    <div className="cp-meta-label">Venue</div>
                    <div className="cp-meta-value">{event.venueName}</div>
                    {event.venueAddress && (
                      <div className="cp-meta-subvalue">{event.venueAddress}</div>
                    )}
                  </div>
                  <button 
                    className="btn btn-ghost btn-sm cp-map-link-btn"
                    onClick={handleViewOnMap}
                    title="Locate venue on Campus Map"
                  >
                    View on Map →
                  </button>
                </div>
              </div>

              <div className="cp-modal-meta-card">
                <UserCheck className="cp-modal-meta-icon" size={18} />
                <div>
                  <div className="cp-meta-label">Organized By</div>
                  <div className="cp-meta-value">{organizerName}</div>
                </div>
              </div>
            </div>

            {/* Interest Areas (Approved Contract Enums) */}
            {event.interestArea && event.interestArea.length > 0 && (
              <div className="cp-modal-section">
                <h3 className="cp-section-title">Focus & Interest Areas</h3>
                <div className="cp-tag-list">
                  {event.interestArea.map((tag, idx) => (
                    <span key={idx} className="cp-interest-tag">
                      #{INTEREST_AREA_LABELS[tag] || tag}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Description */}
            <div className="cp-modal-section">
              <h3 className="cp-section-title">About the Event</h3>
              <p className="cp-section-text">{event.description}</p>
            </div>

            {/* Eligibility & Guidelines */}
            <div className="cp-modal-section">
              <h3 className="cp-section-title">Eligibility & Registration</h3>
              <div className="cp-info-box">
                <div className="cp-info-row">
                  <strong>Eligibility:</strong>
                  <span>{event.eligibility || 'Open to all students with active university identity.'}</span>
                </div>
                <div className="cp-info-row">
                  <strong>Registration Required:</strong>
                  <span>{event.registrationRequired ? 'Yes — prior registration required.' : 'No — walk-in / open admission.'}</span>
                </div>
              </div>
            </div>

            {/* Academic Benefits, Activity Points & Certificates */}
            <div className="cp-modal-section">
              <h3 className="cp-section-title">Academic & Attendance Benefits</h3>
              <div className="cp-benefits-grid">
                {/* Activity Points */}
                <div className="cp-benefit-card">
                  <Award size={20} className="cp-benefit-icon" />
                  <div>
                    <div className="cp-benefit-title">Activity Points</div>
                    <div className="cp-benefit-desc">
                      {event.activityPoints !== null && event.activityPoints > 0 ? (
                        <span className="cp-benefit-highlight">
                          <strong>+{event.activityPoints} University Activity Points</strong> upon verified attendance.
                        </span>
                      ) : (
                        <span className="cp-text-muted">No official activity points designated for this event.</span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Certificates */}
                <div className="cp-benefit-card">
                  <FileCheck size={20} className="cp-benefit-icon" />
                  <div>
                    <div className="cp-benefit-title">Certificate Availability</div>
                    <div className="cp-benefit-desc">
                      {event.certificateAvailable === true ? (
                        <span className="cp-benefit-highlight">
                          Digital participation or completion certificate provided.
                        </span>
                      ) : event.certificateAvailable === false ? (
                        <span className="cp-text-muted">No participation certificate offered.</span>
                      ) : (
                        <span className="cp-text-muted">Certificate availability not specified.</span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Attendance Benefit */}
                {event.attendanceBenefit && (
                  <div className="cp-benefit-card cp-benefit-full">
                    <Sparkles size={20} className="cp-benefit-icon" />
                    <div>
                      <div className="cp-benefit-title">Designated Benefits</div>
                      <div className="cp-benefit-desc">{event.attendanceBenefit}</div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Cancellation Notice if applicable */}
            {event.status === 'cancelled' && (
              <div className="cp-notice-banner warning">
                <AlertCircle size={20} />
                <div>
                  <strong>Notice:</strong> This event has been marked as cancelled by the organizer.
                </div>
              </div>
            )}
          </div>

          {/* Modal Sidebar / Action Column (Per Section 7: registration uses external URL) */}
          <aside className="cp-modal-sidebar">
            <div className="cp-sidebar-card">
              <h4 className="cp-sidebar-heading">Event Registration</h4>

              {/* Status */}
              <div className="cp-reg-status-badge">
                {event.status === 'cancelled' ? (
                  <span className="cp-status-cancelled">Event Cancelled</span>
                ) : event.status === 'completed' ? (
                  <span className="cp-status-closed">Event Completed</span>
                ) : event.registrationRequired ? (
                  <span className="cp-status-open">Registration Required</span>
                ) : (
                  <span className="cp-status-registered">Open Entry / Walk-in</span>
                )}
              </div>

              {/* Primary Registration Action via Official External URL */}
              <div className="cp-sidebar-actions">
                {event.status !== 'cancelled' && event.registrationUrl ? (
                  <a 
                    href={event.registrationUrl} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="btn btn-primary cp-w-full cp-external-reg-link"
                  >
                    <span>Register on Official Portal</span>
                    <ExternalLink size={15} />
                  </a>
                ) : event.status !== 'cancelled' && !event.registrationRequired ? (
                  <div className="cp-free-entry-note">
                    <CheckCircle2 size={16} className="cp-check-green" />
                    <span>Free seating available on event day.</span>
                  </div>
                ) : (
                  <div className="cp-no-reg-note">
                    <span>Direct online registration not applicable.</span>
                  </div>
                )}

                <div className="cp-sidebar-utility-row">
                  <button 
                    className={`btn btn-secondary btn-sm cp-w-full ${isSaved ? 'cp-btn-saved' : ''}`}
                    onClick={() => handleToggleSave(event.id, event.title)}
                  >
                    <Bookmark size={15} fill={isSaved ? "#6366F1" : "none"} />
                    <span>{isSaved ? 'Bookmarked' : 'Bookmark Event'}</span>
                  </button>

                  <button 
                    className="btn btn-secondary btn-sm"
                    onClick={handleCopyLink}
                    title="Share event link"
                  >
                    <Share2 size={15} />
                  </button>
                </div>
              </div>

              {/* Notice per Contract V1 Section 7 */}
              <p className="cp-registration-disclaimer">
                Campus Pulse provides event discovery. External registration occurs directly on the organizer's verified portal.
              </p>
            </div>

            {/* Verification Status Card */}
            <div className="cp-sidebar-card">
              <h4 className="cp-sidebar-heading">Host Verification</h4>
              <div className="cp-verification-info">
                <div className="cp-verification-row">
                  <ShieldCheck size={18} className={event.benefitsVerificationStatus === 'verified' ? 'verified' : 'unverified'} />
                  <div>
                    <div className="cp-verification-status-label">
                      {event.benefitsVerificationStatus === 'verified' 
                        ? 'Authority Verified' 
                        : event.benefitsVerificationStatus === 'unverified'
                        ? 'Pending Authority Review'
                        : 'Not Applicable'}
                    </div>
                    <div className="cp-verification-status-desc">
                      {event.benefitsVerificationStatus === 'verified'
                        ? 'Academic credits and certificate validity verified by university administration.'
                        : 'Standard campus listing.'}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
