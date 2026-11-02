import React, { useState, useEffect } from 'react';
import { X, Calendar, MapPin, AlertCircle, Save, Info } from 'lucide-react';
import { 
  APPROVED_CATEGORIES, 
  CATEGORY_LABELS, 
  APPROVED_INTEREST_AREAS, 
  INTEREST_AREA_LABELS 
} from '../../data/mockEvents';
import './EventFormModal.css';

export function EventFormModal({
  isOpen,
  onClose,
  onSubmit,
  initialEvent = null
}) {
  const isEditing = Boolean(initialEvent);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'technical_workshop',
    eventType: 'internal',
    interestArea: ['web_development'],
    startDateTime: '',
    endDateTime: '',
    venueName: '',
    venueAddress: '',
    latitude: '',
    longitude: '',
    organizer: 'Dept. of Computer Science & Engineering',
    eligibility: '',
    registrationRequired: true,
    registrationUrl: '',
    certificateAvailable: true,
    attendanceBenefit: '',
    activityPoints: '',
    imageUrl: ''
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (initialEvent) {
      const formatInputDate = (d) => {
        if (!d) return '';
        const dt = d instanceof Date ? d : new Date(d);
        if (isNaN(dt.getTime())) return '';
        const pad = (n) => String(n).padStart(2, '0');
        return `${dt.getFullYear()}-${pad(dt.getMonth() + 1)}-${pad(dt.getDate())}T${pad(dt.getHours())}:${pad(dt.getMinutes())}`;
      };

      setFormData({
        title: initialEvent.title || '',
        description: initialEvent.description || '',
        category: initialEvent.category || 'technical_workshop',
        eventType: initialEvent.eventType || 'internal',
        interestArea: initialEvent.interestArea || ['web_development'],
        startDateTime: formatInputDate(initialEvent.startDateTime),
        endDateTime: formatInputDate(initialEvent.endDateTime),
        venueName: initialEvent.venueName || '',
        venueAddress: initialEvent.venueAddress || '',
        latitude: initialEvent.latitude !== null && initialEvent.latitude !== undefined ? String(initialEvent.latitude) : '',
        longitude: initialEvent.longitude !== null && initialEvent.longitude !== undefined ? String(initialEvent.longitude) : '',
        organizer: initialEvent.organizer || 'Dept. of Computer Science & Engineering',
        eligibility: initialEvent.eligibility || '',
        registrationRequired: initialEvent.registrationRequired ?? true,
        registrationUrl: initialEvent.registrationUrl || '',
        certificateAvailable: initialEvent.certificateAvailable ?? true,
        attendanceBenefit: initialEvent.attendanceBenefit || '',
        activityPoints: initialEvent.activityPoints !== null && initialEvent.activityPoints !== undefined ? String(initialEvent.activityPoints) : '',
        imageUrl: initialEvent.imageUrl || ''
      });
    } else {
      setFormData({
        title: '',
        description: '',
        category: 'technical_workshop',
        eventType: 'internal',
        interestArea: ['web_development'],
        startDateTime: '2026-11-20T10:00',
        endDateTime: '2026-11-20T17:00',
        venueName: '',
        venueAddress: '',
        latitude: '12.9716',
        longitude: '77.5946',
        organizer: 'Dept. of Computer Science & Engineering',
        eligibility: 'Open to all enrolled students',
        registrationRequired: true,
        registrationUrl: 'https://campus-pulse.edu/register/',
        certificateAvailable: true,
        attendanceBenefit: '',
        activityPoints: '10',
        imageUrl: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=1000&q=80'
      });
    }
    setErrors({});
  }, [initialEvent, isOpen]);

  if (!isOpen) return null;

  const validate = () => {
    const errs = {};
    if (!formData.title.trim()) errs.title = 'Event title is required';
    if (!formData.description.trim()) errs.description = 'Event description is required';
    if (!formData.venueName.trim()) errs.venueName = 'Venue name is required';
    if (!formData.startDateTime) errs.startDateTime = 'Start date/time is required';
    if (!formData.endDateTime) errs.endDateTime = 'End date/time is required';
    if (formData.startDateTime && formData.endDateTime && new Date(formData.endDateTime) <= new Date(formData.startDateTime)) {
      errs.endDateTime = 'End date/time must be strictly after the start date/time';
    }
    return errs;
  };

  const handleInterestToggle = (areaKey) => {
    setFormData(prev => {
      const exists = prev.interestArea.includes(areaKey);
      return {
        ...prev,
        interestArea: exists ? prev.interestArea.filter(t => t !== areaKey) : [...prev.interestArea, areaKey]
      };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setIsSubmitting(true);
    try {
      const normalizedPayload = {
        title: formData.title.trim(),
        description: formData.description.trim(),
        category: formData.category,
        eventType: formData.eventType,
        interestArea: formData.interestArea.length > 0 ? formData.interestArea : ['other'],
        startDateTime: new Date(formData.startDateTime),
        endDateTime: new Date(formData.endDateTime),
        venueName: formData.venueName.trim(),
        venueAddress: formData.venueAddress.trim() || null,
        latitude: formData.latitude !== '' ? Number(formData.latitude) : null,
        longitude: formData.longitude !== '' ? Number(formData.longitude) : null,
        organizer: formData.organizer.trim(),
        eligibility: formData.eligibility.trim() || null,
        registrationRequired: Boolean(formData.registrationRequired),
        registrationUrl: formData.registrationUrl.trim() || null,
        certificateAvailable: formData.certificateAvailable ?? null,
        attendanceBenefit: formData.attendanceBenefit.trim() || null,
        activityPoints: formData.activityPoints !== '' ? Number(formData.activityPoints) : null,
        imageUrl: formData.imageUrl.trim() || null
      };

      await onSubmit(normalizedPayload);
      onClose();
    } catch (err) {
      setErrors({ form: err.message || 'Failed to save event draft' });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="cp-form-modal-backdrop" onClick={onClose}>
      <div 
        className="cp-form-modal-dialog"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
      >
        <div className="cp-form-modal-header">
          <div>
            <h2 className="cp-form-title">
              {isEditing ? 'Edit Draft Event' : 'Create New Event Draft'}
            </h2>
            <p className="cp-form-subtitle">
              Configure event parameters. Per Contract V1, organizers save listings as drafts pending admin verification.
            </p>
          </div>
          <button className="cp-form-close-btn" onClick={onClose} aria-label="Close">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="cp-event-form">
          {errors.form && (
            <div className="cp-form-alert error">
              <AlertCircle size={16} />
              <span>{errors.form}</span>
            </div>
          )}

          {/* Title */}
          <div className="cp-form-group">
            <label className="cp-form-label">Event Title *</label>
            <input
              type="text"
              className={`cp-form-input ${errors.title ? 'error' : ''}`}
              placeholder="e.g. Autonomous Agents & Machine Intelligence Symposium"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            />
            {errors.title && <span className="cp-input-error">{errors.title}</span>}
          </div>

          {/* Category and Event Type */}
          <div className="cp-form-row">
            <div className="cp-form-group cp-flex-1">
              <label className="cp-form-label">Approved Category *</label>
              <select
                className="cp-form-select"
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              >
                {APPROVED_CATEGORIES.map(catKey => (
                  <option key={catKey} value={catKey}>
                    {CATEGORY_LABELS[catKey]}
                  </option>
                ))}
              </select>
            </div>

            <div className="cp-form-group cp-flex-1">
              <label className="cp-form-label">Event Type *</label>
              <select
                className="cp-form-select"
                value={formData.eventType}
                onChange={(e) => setFormData({ ...formData, eventType: e.target.value })}
              >
                <option value="internal">🏛️ Campus Internal Event</option>
                <option value="external">🌐 External / Inter-Collegiate</option>
              </select>
            </div>
          </div>

          {/* Description */}
          <div className="cp-form-group">
            <label className="cp-form-label">Event Description *</label>
            <textarea
              className={`cp-form-textarea ${errors.description ? 'error' : ''}`}
              rows={4}
              placeholder="Provide a comprehensive description of the event agenda, speakers, objectives, and prerequisites..."
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            />
            {errors.description && <span className="cp-input-error">{errors.description}</span>}
          </div>

          {/* Venue Name & Address */}
          <div className="cp-form-row">
            <div className="cp-form-group cp-flex-1">
              <label className="cp-form-label">Venue Name *</label>
              <input
                type="text"
                className={`cp-form-input ${errors.venueName ? 'error' : ''}`}
                placeholder="e.g. Vikram Sarabhai Main Auditorium"
                value={formData.venueName}
                onChange={(e) => setFormData({ ...formData, venueName: e.target.value })}
              />
              {errors.venueName && <span className="cp-input-error">{errors.venueName}</span>}
            </div>

            <div className="cp-form-group cp-flex-1">
              <label className="cp-form-label">Venue Address (Optional)</label>
              <input
                type="text"
                className="cp-form-input"
                placeholder="e.g. Central Academic Block, University Campus"
                value={formData.venueAddress}
                onChange={(e) => setFormData({ ...formData, venueAddress: e.target.value })}
              />
            </div>
          </div>

          {/* GPS Coordinates (Optional numeric) */}
          <div className="cp-form-row">
            <div className="cp-form-group cp-flex-1">
              <label className="cp-form-label">Latitude (Optional numeric)</label>
              <input
                type="number"
                step="any"
                className="cp-form-input"
                placeholder="e.g. 12.9716"
                value={formData.latitude}
                onChange={(e) => setFormData({ ...formData, latitude: e.target.value })}
              />
            </div>

            <div className="cp-form-group cp-flex-1">
              <label className="cp-form-label">Longitude (Optional numeric)</label>
              <input
                type="number"
                step="any"
                className="cp-form-input"
                placeholder="e.g. 77.5946"
                value={formData.longitude}
                onChange={(e) => setFormData({ ...formData, longitude: e.target.value })}
              />
            </div>
          </div>

          {/* Scheduling Dates */}
          <div className="cp-form-row">
            <div className="cp-form-group">
              <label className="cp-form-label">Start Date & Time *</label>
              <input
                type="datetime-local"
                className={`cp-form-input ${errors.startDateTime ? 'error' : ''}`}
                value={formData.startDateTime}
                onChange={(e) => setFormData({ ...formData, startDateTime: e.target.value })}
              />
              {errors.startDateTime && <span className="cp-input-error">{errors.startDateTime}</span>}
            </div>

            <div className="cp-form-group">
              <label className="cp-form-label">End Date & Time *</label>
              <input
                type="datetime-local"
                className={`cp-form-input ${errors.endDateTime ? 'error' : ''}`}
                value={formData.endDateTime}
                onChange={(e) => setFormData({ ...formData, endDateTime: e.target.value })}
              />
              {errors.endDateTime && <span className="cp-input-error">{errors.endDateTime}</span>}
            </div>
          </div>

          {/* Academic Points & Certificate */}
          <div className="cp-form-row">
            <div className="cp-form-group cp-flex-1">
              <label className="cp-form-label">Requested Activity Points</label>
              <input
                type="number"
                className="cp-form-input"
                placeholder="e.g. 15 (leave blank if null)"
                value={formData.activityPoints}
                onChange={(e) => setFormData({ ...formData, activityPoints: e.target.value })}
              />
            </div>

            <div className="cp-form-group cp-checkbox-group cp-flex-1">
              <label className="cp-checkbox-label">
                <input
                  type="checkbox"
                  checked={formData.certificateAvailable}
                  onChange={(e) => setFormData({ ...formData, certificateAvailable: e.target.checked })}
                />
                <span>Certificate Available</span>
              </label>
            </div>
          </div>

          {/* Attendance Benefits */}
          <div className="cp-form-group">
            <label className="cp-form-label">Designated Attendance Benefit (Optional)</label>
            <input
              type="text"
              className="cp-form-input"
              placeholder="e.g. Academic attendance credit, workshop kit, food coupons..."
              value={formData.attendanceBenefit}
              onChange={(e) => setFormData({ ...formData, attendanceBenefit: e.target.value })}
            />
          </div>

          {/* Registration Required & Official URL */}
          <div className="cp-form-row">
            <div className="cp-form-group cp-flex-1">
              <label className="cp-form-label">Registration Requirement</label>
              <select
                className="cp-form-select"
                value={formData.registrationRequired ? 'true' : 'false'}
                onChange={(e) => setFormData({ ...formData, registrationRequired: e.target.value === 'true' })}
              >
                <option value="true">Registration Required</option>
                <option value="false">Open Entry / Walk-in</option>
              </select>
            </div>

            <div className="cp-form-group cp-flex-2">
              <label className="cp-form-label">Official Registration Portal URL</label>
              <input
                type="url"
                className="cp-form-input"
                placeholder="https://..."
                value={formData.registrationUrl}
                onChange={(e) => setFormData({ ...formData, registrationUrl: e.target.value })}
              />
            </div>
          </div>

          {/* Image URL & Eligibility */}
          <div className="cp-form-row">
            <div className="cp-form-group cp-flex-1">
              <label className="cp-form-label">Banner Image URL</label>
              <input
                type="url"
                className="cp-form-input"
                placeholder="https://images.unsplash.com/..."
                value={formData.imageUrl}
                onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
              />
            </div>

            <div className="cp-form-group cp-flex-1">
              <label className="cp-form-label">Eligibility Criteria</label>
              <input
                type="text"
                className="cp-form-input"
                placeholder="e.g. Open to all engineering students"
                value={formData.eligibility}
                onChange={(e) => setFormData({ ...formData, eligibility: e.target.value })}
              />
            </div>
          </div>

          {/* Approved Interest Areas Selector */}
          <div className="cp-form-group">
            <label className="cp-form-label">Approved Interest Areas (Contract Enums)</label>
            <div className="cp-tag-checkbox-wrap">
              {APPROVED_INTEREST_AREAS.map(areaKey => {
                const checked = formData.interestArea.includes(areaKey);
                return (
                  <button
                    type="button"
                    key={areaKey}
                    className={`cp-tag-toggle-btn ${checked ? 'active' : ''}`}
                    onClick={() => handleInterestToggle(areaKey)}
                  >
                    {INTEREST_AREA_LABELS[areaKey]}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Form Footer */}
          <div className="cp-form-footer">
            <div className="cp-form-notice">
              <Info size={14} />
              <span>
                <strong>Contract V1 Organizer Scope:</strong> Submitted events are saved as <code>draft</code> with <code>unverified</code> benefits. Only administrators can publish events and verify university points.
              </span>
            </div>

            <div className="cp-form-actions">
              <button
                type="button"
                className="btn btn-secondary"
                onClick={onClose}
                disabled={isSubmitting}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="btn btn-primary"
                disabled={isSubmitting}
              >
                <Save size={16} />
                <span>{isSubmitting ? 'Saving...' : isEditing ? 'Update Draft' : 'Save as Draft'}</span>
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
