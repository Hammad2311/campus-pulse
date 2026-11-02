import React, { useState, useEffect } from 'react';
import { X, Calendar, MapPin, Tag, AlertCircle, Save, Check } from 'lucide-react';
import { CATEGORIES, INTEREST_TAGS } from '../../data/mockEvents';
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
    shortDescription: '',
    description: '',
    category: 'Technology',
    eventType: 'university',
    interests: [],
    startDate: '',
    endDate: '',
    venue: '',
    capacity: '',
    activityPoints: '',
    certificateAvailable: true,
    registrationUrl: '',
    image: '',
    status: 'published'
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (initialEvent) {
      setFormData({
        title: initialEvent.title || '',
        shortDescription: initialEvent.shortDescription || '',
        description: initialEvent.description || '',
        category: initialEvent.category || 'Technology',
        eventType: initialEvent.eventType || 'university',
        interests: initialEvent.interests || [],
        startDate: initialEvent.startDate ? initialEvent.startDate.slice(0, 16) : '',
        endDate: initialEvent.endDate ? initialEvent.endDate.slice(0, 16) : '',
        venue: initialEvent.venue || '',
        capacity: initialEvent.capacity || '',
        activityPoints: initialEvent.activityPoints !== undefined ? initialEvent.activityPoints : '',
        certificateAvailable: initialEvent.certificateAvailable ?? true,
        registrationUrl: initialEvent.registrationUrl || '',
        image: initialEvent.image || '',
        status: initialEvent.status || 'published'
      });
    } else {
      setFormData({
        title: '',
        shortDescription: '',
        description: '',
        category: 'Technology',
        eventType: 'university',
        interests: ['AI & Machine Learning'],
        startDate: '2026-11-20T10:00',
        endDate: '2026-11-20T17:00',
        venue: '',
        capacity: '100',
        activityPoints: '10',
        certificateAvailable: true,
        registrationUrl: 'https://campus-pulse.edu/register/',
        image: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=1000&q=80',
        status: 'published'
      });
    }
    setErrors({});
  }, [initialEvent, isOpen]);

  if (!isOpen) return null;

  const validate = () => {
    const errs = {};
    if (!formData.title.trim()) errs.title = 'Event title is required';
    if (!formData.shortDescription.trim()) errs.shortDescription = 'Brief summary is required';
    if (!formData.venue.trim()) errs.venue = 'Venue location is required';
    if (!formData.startDate) errs.startDate = 'Start date/time is required';
    if (!formData.endDate) errs.endDate = 'End date/time is required';
    if (formData.startDate && formData.endDate && new Date(formData.endDate) <= new Date(formData.startDate)) {
      errs.endDate = 'End date must be after the start date';
    }
    if (formData.capacity && Number(formData.capacity) <= 0) {
      errs.capacity = 'Capacity must be a positive number';
    }
    return errs;
  };

  const handleInterestToggle = (tag) => {
    setFormData(prev => {
      const exists = prev.interests.includes(tag);
      return {
        ...prev,
        interests: exists ? prev.interests.filter(t => t !== tag) : [...prev.interests, tag]
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
      await onSubmit({
        ...formData,
        capacity: formData.capacity ? Number(formData.capacity) : 100,
        activityPoints: formData.activityPoints !== '' ? Number(formData.activityPoints) : undefined
      });
      onClose();
    } catch (err) {
      setErrors({ form: err.message || 'Failed to save event' });
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
              {isEditing ? 'Edit Event Details' : 'Create New Campus Event'}
            </h2>
            <p className="cp-form-subtitle">
              Configure event parameters, scheduling, venue coordinates, and registration links.
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
              placeholder="e.g. Annual Autonomous Systems Robotics Hackathon 2026"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            />
            {errors.title && <span className="cp-input-error">{errors.title}</span>}
          </div>

          {/* Category and Event Type */}
          <div className="cp-form-row">
            <div className="cp-form-group">
              <label className="cp-form-label">Primary Category *</label>
              <select
                className="cp-form-select"
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              >
                {CATEGORIES.filter(c => c !== 'All').map(c => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>

            <div className="cp-form-group">
              <label className="cp-form-label">Hosting Jurisdiction *</label>
              <select
                className="cp-form-select"
                value={formData.eventType}
                onChange={(e) => setFormData({ ...formData, eventType: e.target.value })}
              >
                <option value="university">🏛️ University Event</option>
                <option value="external">🌐 External / Inter-Collegiate</option>
              </select>
            </div>

            <div className="cp-form-group">
              <label className="cp-form-label">Publish Status *</label>
              <select
                className="cp-form-select"
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
              >
                <option value="published">Published</option>
                <option value="draft">Draft (Private)</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>
          </div>

          {/* Short Description */}
          <div className="cp-form-group">
            <label className="cp-form-label">Short Summary (Preview Card) *</label>
            <input
              type="text"
              className={`cp-form-input ${errors.shortDescription ? 'error' : ''}`}
              placeholder="A punchy one-sentence summary for the event listing..."
              value={formData.shortDescription}
              onChange={(e) => setFormData({ ...formData, shortDescription: e.target.value })}
            />
            {errors.shortDescription && <span className="cp-input-error">{errors.shortDescription}</span>}
          </div>

          {/* Full Description */}
          <div className="cp-form-group">
            <label className="cp-form-label">Full Description & Agenda</label>
            <textarea
              className="cp-form-textarea"
              rows={4}
              placeholder="Detailed description, eligibility guidelines, deliverables, schedule, speaker bios..."
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            />
          </div>

          {/* Venue & Capacity */}
          <div className="cp-form-row">
            <div className="cp-form-group cp-flex-2">
              <label className="cp-form-label">Campus Venue / Location *</label>
              <input
                type="text"
                className={`cp-form-input ${errors.venue ? 'error' : ''}`}
                placeholder="e.g. Main Auditorium, Vikram Sarabhai Hall"
                value={formData.venue}
                onChange={(e) => setFormData({ ...formData, venue: e.target.value })}
              />
              {errors.venue && <span className="cp-input-error">{errors.venue}</span>}
            </div>

            <div className="cp-form-group cp-flex-1">
              <label className="cp-form-label">Seating Capacity</label>
              <input
                type="number"
                className="cp-form-input"
                placeholder="e.g. 250"
                value={formData.capacity}
                onChange={(e) => setFormData({ ...formData, capacity: e.target.value })}
              />
            </div>
          </div>

          {/* Scheduling Dates */}
          <div className="cp-form-row">
            <div className="cp-form-group">
              <label className="cp-form-label">Start Date & Time *</label>
              <input
                type="datetime-local"
                className={`cp-form-input ${errors.startDate ? 'error' : ''}`}
                value={formData.startDate}
                onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
              />
              {errors.startDate && <span className="cp-input-error">{errors.startDate}</span>}
            </div>

            <div className="cp-form-group">
              <label className="cp-form-label">End Date & Time *</label>
              <input
                type="datetime-local"
                className={`cp-form-input ${errors.endDate ? 'error' : ''}`}
                value={formData.endDate}
                onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
              />
              {errors.endDate && <span className="cp-input-error">{errors.endDate}</span>}
            </div>
          </div>

          {/* Academic Points & Certificate */}
          <div className="cp-form-row">
            <div className="cp-form-group">
              <label className="cp-form-label">University Activity Points</label>
              <input
                type="number"
                className="cp-form-input"
                placeholder="e.g. 15 (leave blank if none)"
                value={formData.activityPoints}
                onChange={(e) => setFormData({ ...formData, activityPoints: e.target.value })}
              />
            </div>

            <div className="cp-form-group cp-checkbox-group">
              <label className="cp-checkbox-label">
                <input
                  type="checkbox"
                  checked={formData.certificateAvailable}
                  onChange={(e) => setFormData({ ...formData, certificateAvailable: e.target.checked })}
                />
                <span>Participation Certificate Provided</span>
              </label>
            </div>
          </div>

          {/* Registration URL & Image */}
          <div className="cp-form-row">
            <div className="cp-form-group cp-flex-1">
              <label className="cp-form-label">Official Registration Link</label>
              <input
                type="url"
                className="cp-form-input"
                placeholder="https://..."
                value={formData.registrationUrl}
                onChange={(e) => setFormData({ ...formData, registrationUrl: e.target.value })}
              />
            </div>

            <div className="cp-form-group cp-flex-1">
              <label className="cp-form-label">Event Banner Image URL</label>
              <input
                type="url"
                className="cp-form-input"
                placeholder="https://images.unsplash.com/..."
                value={formData.image}
                onChange={(e) => setFormData({ ...formData, image: e.target.value })}
              />
            </div>
          </div>

          {/* Interest Areas Selector */}
          <div className="cp-form-group">
            <label className="cp-form-label">Relevant Topic Tags</label>
            <div className="cp-tag-checkbox-wrap">
              {INTEREST_TAGS.map(tag => {
                const checked = formData.interests.includes(tag);
                return (
                  <button
                    type="button"
                    key={tag}
                    className={`cp-tag-toggle-btn ${checked ? 'active' : ''}`}
                    onClick={() => handleInterestToggle(tag)}
                  >
                    {tag}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Form Footer */}
          <div className="cp-form-footer">
            <div className="cp-form-notice">
              ⚠️ Note: Event changes are stored in client mock state. Production write operations will connect to Hammad's Cloud Firestore backend.
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
                <span>{isSubmitting ? 'Saving...' : isEditing ? 'Update Event' : 'Save Event'}</span>
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
