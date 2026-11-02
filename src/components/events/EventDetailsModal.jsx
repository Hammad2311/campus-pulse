import React, { useEffect } from 'react';
import { useEvents } from '../../context/EventContext';
import { CategoryBadge, EventTypeBadge, Badge } from '../common/Badge';
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
  Users, 
  Mail, 
  Phone, 
  Bookmark,
  Share2,
  AlertCircle
} from 'lucide-react';
import './EventDetailsModal.css';

export function EventDetailsModal() {
  const { 
    activeModalEvent, 
    closeEventDetails, 
    savedEventIds, 
    handleToggleSave, 
    registeredEventIds, 
    handleRegister, 
    handleCancelRegistration,
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
  const isRegistered = registeredEventIds.includes(event.id);

  // Date formatting helpers
  const formatDateTimeRange = (startIso, endIso) => {
    if (!startIso) return { start: '', end: '' };
    const start = new Date(startIso);
    const end = endIso ? new Date(endIso) : null;

    const dateOptions = { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' };
    const timeOptions = { hour: 'numeric', minute: '2-digit', hour12: true };

    const startDateStr = start.toLocaleDateString('en-US', dateOptions);
    const startTimeStr = start.toLocaleTimeString('en-US', timeOptions);

    let endStr = '';
    if (end) {
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

  const { date: formattedDate, time: formattedTime } = formatDateTimeRange(event.startDate, event.endDate);

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
            src={event.image} 
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

              <div className="cp-modal-meta-card">
                <MapPin className="cp-modal-meta-icon" size={18} />
                <div className="cp-venue-action-wrap">
                  <div>
                    <div className="cp-meta-label">Venue</div>
                    <div className="cp-meta-value">{event.venue}</div>
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
                <Users className="cp-modal-meta-icon" size={18} />
                <div>
                  <div className="cp-meta-label">Attendance</div>
                  <div className="cp-meta-value">
                    {event.capacity ? (
                      <span>{event.registeredCount || 0} / {event.capacity} registered</span>
                    ) : (
                      <span>Open campus entry</span>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Interest Tags */}
            {event.interests && event.interests.length > 0 && (
              <div className="cp-modal-section">
                <h3 className="cp-section-title">Focus & Interest Areas</h3>
                <div className="cp-tag-list">
                  {event.interests.map((tag, idx) => (
                    <span key={idx} className="cp-interest-tag">
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Comprehensive Description */}
            <div className="cp-modal-section">
              <h3 className="cp-section-title">About the Event</h3>
              <p className="cp-section-text">{event.description}</p>
            </div>

            {/* Eligibility & Registration Requirements */}
            <div className="cp-modal-section">
              <h3 className="cp-section-title">Eligibility & Guidelines</h3>
              <div className="cp-info-box">
                <div className="cp-info-row">
                  <strong>Student Eligibility:</strong>
                  <span>{event.eligibility || 'Open to all students with active university identity.'}</span>
                </div>
                {event.registrationRequirements && (
                  <div className="cp-info-row">
                    <strong>Prerequisites:</strong>
                    <span>{event.registrationRequirements}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Academic Benefits, Activity Points & Certificates */}
            <div className="cp-modal-section">
              <h3 className="cp-section-title">Academic & Participation Benefits</h3>
              <div className="cp-benefits-grid">
                {/* Activity Points (Strictly hide or neutral if unavailable) */}
                <div className="cp-benefit-card">
                  <Award size={20} className="cp-benefit-icon" />
                  <div>
                    <div className="cp-benefit-title">Activity Points</div>
                    <div className="cp-benefit-desc">
                      {event.activityPoints !== undefined && event.activityPoints > 0 ? (
                        <span className="cp-benefit-highlight">
                          <strong>{event.activityPoints} University Activity Points</strong> credited upon attendance verification.
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
                      {event.certificateAvailable ? (
                        <span className="cp-benefit-highlight">
                          Digital verified completion/participation certificate provided.
                        </span>
                      ) : (
                        <span className="cp-text-muted">No participation certificate offered for this session.</span>
                      )}
                    </div>
                  </div>
                </div>

                {/* General attendance benefits if available */}
                {event.attendanceBenefits && (
                  <div className="cp-benefit-card cp-benefit-full">
                    <Sparkles size={20} className="cp-benefit-icon" />
                    <div>
                      <div className="cp-benefit-title">Perks & Deliverables</div>
                      <div className="cp-benefit-desc">{event.attendanceBenefits}</div>
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

          {/* Modal Sidebar / Action Column */}
          <aside className="cp-modal-sidebar">
            <div className="cp-sidebar-card">
              <h4 className="cp-sidebar-heading">Registration Actions</h4>
              
              {/* Registration Status */}
              <div className="cp-reg-status-badge">
                {event.status === 'cancelled' ? (
                  <span className="cp-status-cancelled">Registration Closed (Cancelled)</span>
                ) : isRegistered ? (
                  <span className="cp-status-registered">
                    <CheckCircle2 size={16} /> Registered for Event
                  </span>
                ) : event.isRegistrationOpen !== false ? (
                  <span className="cp-status-open">Registration Open</span>
                ) : (
                  <span className="cp-status-closed">Registration Closed</span>
                )}
              </div>

              {/* Primary Action Buttons */}
              <div className="cp-sidebar-actions">
                {isRegistered ? (
                  <button 
                    className="btn btn-secondary cp-w-full"
                    onClick={() => handleCancelRegistration(event.id, event.title)}
                  >
                    Cancel Registration
                  </button>
                ) : (
                  <button 
                    className="btn btn-primary cp-w-full"
                    onClick={() => handleRegister(event.id, event.title)}
                    disabled={event.status === 'cancelled' || event.isRegistrationOpen === false}
                  >
                    <span>Register Attendance</span>
                  </button>
                )}

                {/* External Registration Link using actual supplied URL */}
                {event.registrationUrl && (
                  <a 
                    href={event.registrationUrl} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="btn btn-outline cp-w-full cp-external-reg-link"
                  >
                    <span>Official Registration Portal</span>
                    <ExternalLink size={14} />
                  </a>
                )}

                <div className="cp-sidebar-utility-row">
                  <button 
                    className={`btn btn-secondary btn-sm cp-w-full ${isSaved ? 'cp-btn-saved' : ''}`}
                    onClick={() => handleToggleSave(event.id, event.title)}
                  >
                    <Bookmark size={15} fill={isSaved ? "#6366F1" : "none"} />
                    <span>{isSaved ? 'Saved' : 'Save Event'}</span>
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

              {/* Disclaimer */}
              <p className="cp-registration-disclaimer">
                Registration attendance updates local session state. Final attendance syncing will connect to Hammad's Cloud Firestore.
              </p>
            </div>

            {/* Organizer Profile Card */}
            <div className="cp-sidebar-card">
              <h4 className="cp-sidebar-heading">Organized By</h4>
              <div className="cp-organizer-profile">
                <div className="cp-organizer-avatar">
                  <UserCheck size={20} />
                </div>
                <div className="cp-organizer-meta">
                  <div className="cp-organizer-title">
                    <span>{event.organizer?.name || 'Authorized Campus Host'}</span>
                    {event.organizer?.isVerified && (
                      <span className="cp-verified-tag">Verified</span>
                    )}
                  </div>
                  {event.organizer?.email && (
                    <div className="cp-organizer-contact">
                      <Mail size={12} />
                      <a href={`mailto:${event.organizer.email}`}>{event.organizer.email}</a>
                    </div>
                  )}
                  {event.organizer?.contactPhone && (
                    <div className="cp-organizer-contact">
                      <Phone size={12} />
                      <span>{event.organizer.contactPhone}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
