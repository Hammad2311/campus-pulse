import React, { useState, useEffect } from 'react';
import { useEvents } from '../context/EventContext';
import {
  getOrganizerEvents,
  createEvent,
  updateEvent,
  cancelEvent
} from '../services/eventService';
import { EventFormModal } from '../components/dashboard/EventFormModal';
import { Badge, CategoryBadge, VerificationBadge } from '../components/common/Badge';
import { 
  LayoutDashboard, 
  Plus, 
  Edit3, 
  Ban, 
  Eye, 
  Calendar, 
  Sparkles, 
  Info,
  Search,
  Lock
} from 'lucide-react';
import './OrganizerDashboardPage.css';

export function OrganizerDashboardPage() {
  const { 
    organizerUser, 
    openEventDetails, 
    showToast 
  } = useEvents();

  const currentOrgId = organizerUser?.id;

  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('all'); // 'all' | 'draft' | 'published' | 'cancelled'
  const [searchQuery, setSearchQuery] = useState('');

  // Form Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState(null);

  const loadDashboardEvents = async () => {
    if (!currentOrgId) {
      setEvents([]);
      setLoading(false);
      return;
    }

    setLoading(true);

    try {
      const { data, error } = await getOrganizerEvents(currentOrgId);

      if (error) {
        showToast(error.message || 'Unable to load your events.', 'warning');
        setEvents([]);
      } else {
        setEvents(data || []);
      }
    } catch (error) {
      showToast(error.message || 'Unable to load your events.', 'warning');
      setEvents([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDashboardEvents();
  }, [currentOrgId]);

  const handleCreateNew = () => {
    setEditingEvent(null);
    setIsModalOpen(true);
  };

  const handleEdit = (event) => {
    if (event.status !== 'draft') {
      showToast('Only draft events can be edited by organizers. Published events are managed by administrators.', 'warning');
      return;
    }
    setEditingEvent(event);
    setIsModalOpen(true);
  };

  const handleFormSubmit = async (formData) => {
    try {
      const { error } = editingEvent
        ? await updateEvent(editingEvent.id, formData)
        : await createEvent(formData);

      if (error) {
        showToast(error.message || 'Unable to save event draft.', 'warning');
        return;
      }

      showToast(
        editingEvent
          ? `Draft updated: "${formData.title}"`
          : `Created draft: "${formData.title}"`,
        'success'
      );

      await loadDashboardEvents();
    } catch (error) {
      showToast(error.message || 'Unable to save event draft.', 'warning');
    }
  };

  const handleCancel = async (eventId, title) => {
    if (!window.confirm(`Are you sure you want to cancel "${title}"?`)) {
      return;
    }

    try {
      const { error } = await cancelEvent(eventId);

      if (error) {
        showToast(error.message || 'Unable to cancel event.', 'warning');
        return;
      }

      showToast(`Event cancelled: "${title}"`, 'info');
      await loadDashboardEvents();
    } catch (error) {
      showToast(error.message || 'Unable to cancel event.', 'warning');
    }
  };
  // Metrics for own events
  const totalEvents = events.length;
  const draftEvents = events.filter(e => e.status === 'draft');
  const publishedEvents = events.filter(e => e.status === 'published');
  const cancelledEvents = events.filter(e => e.status === 'cancelled');

  // Filtered list
  const filteredEvents = events.filter(e => {
    const matchesStatus = statusFilter === 'all' || e.status === statusFilter;
    const query = searchQuery.trim().toLowerCase();
    const matchesSearch = !query || 
      e.title.toLowerCase().includes(query) ||
      (e.venueName && e.venueName.toLowerCase().includes(query)) ||
      e.category.toLowerCase().includes(query);
    return matchesStatus && matchesSearch;
  });

  return (
    <div className="cp-dashboard-page">
      <div className="container cp-dashboard-container">
        {/* Top Header */}
        <div className="cp-dashboard-header">
          <div>
            <div className="cp-page-tag">
              <LayoutDashboard size={15} />
              <span>Organizer Workspace (V1 Scope)</span>
            </div>
            <h1 className="cp-dashboard-title">Organizer Event Management</h1>
            <p className="cp-dashboard-subtitle">
              Draft event listings, manage your organization's proposals, and track publication status.
            </p>
          </div>

          <div className="cp-dashboard-header-actions">
            <button 
              className="btn btn-primary"
              onClick={handleCreateNew}
            >
              <Plus size={18} />
              <span>Create Event Draft</span>
            </button>
          </div>
        </div>

        {/* Scope Notice */}
        <div className="cp-dashboard-alert">
          <Info size={18} className="cp-alert-sparkle" />
          <div className="cp-alert-body">
            <strong>Technical Contract V1 Scope:</strong> Organizers can create and edit their own draft events, or cancel existing events. Publishing events and verifying academic activity points are restricted to system administrators.
          </div>
        </div>

        {/* Overview Metric Cards (Strictly own events, no fake student registration counters) */}
        <div className="cp-metrics-grid">
          <div className="card cp-metric-card">
            <div className="cp-metric-icon bg-indigo">
              <Calendar size={22} />
            </div>
            <div className="cp-metric-info">
              <span className="cp-metric-label">Organization Events</span>
              <span className="cp-metric-number">{totalEvents}</span>
              <span className="cp-metric-sub">Hosted by {organizerUser?.name || 'Dept. of CSE'}</span>
            </div>
          </div>

          <div className="card cp-metric-card">
            <div className="cp-metric-icon bg-amber">
              <Edit3 size={22} />
            </div>
            <div className="cp-metric-info">
              <span className="cp-metric-label">Active Drafts</span>
              <span className="cp-metric-number">{draftEvents.length}</span>
              <span className="cp-metric-sub">Editable by your team</span>
            </div>
          </div>

          <div className="card cp-metric-card">
            <div className="cp-metric-icon bg-emerald">
              <Sparkles size={22} />
            </div>
            <div className="cp-metric-info">
              <span className="cp-metric-label">Published (Live)</span>
              <span className="cp-metric-number">{publishedEvents.length}</span>
              <span className="cp-metric-sub">Approved by campus administrators</span>
            </div>
          </div>
        </div>

        {/* Events Management Table Card */}
        <div className="card cp-mgmt-card">
          <div className="cp-mgmt-toolbar">
            <div className="cp-mgmt-title-group">
              <h3 className="cp-mgmt-title">My Organization's Events</h3>
              <span className="cp-mgmt-count">{filteredEvents.length} records</span>
            </div>

            {/* Filter Controls */}
            <div className="cp-mgmt-controls">
              <div className="cp-mgmt-search">
                <Search size={15} />
                <input
                  type="text"
                  placeholder="Filter events..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>

              <div className="cp-status-tabs">
                <button
                  className={`cp-status-tab-btn ${statusFilter === 'all' ? 'active' : ''}`}
                  onClick={() => setStatusFilter('all')}
                >
                  All ({totalEvents})
                </button>
                <button
                  className={`cp-status-tab-btn ${statusFilter === 'draft' ? 'active' : ''}`}
                  onClick={() => setStatusFilter('draft')}
                >
                  Drafts ({draftEvents.length})
                </button>
                <button
                  className={`cp-status-tab-btn ${statusFilter === 'published' ? 'active' : ''}`}
                  onClick={() => setStatusFilter('published')}
                >
                  Published ({publishedEvents.length})
                </button>
                <button
                  className={`cp-status-tab-btn ${statusFilter === 'cancelled' ? 'active' : ''}`}
                  onClick={() => setStatusFilter('cancelled')}
                >
                  Cancelled ({cancelledEvents.length})
                </button>
              </div>
            </div>
          </div>

          {/* Table */}
          <div className="cp-table-responsive">
            <table className="cp-dashboard-table">
              <thead>
                <tr>
                  <th>Event Name</th>
                  <th>Category</th>
                  <th>Start Date</th>
                  <th>Venue</th>
                  <th>Benefits Verification</th>
                  <th>Status</th>
                  <th className="text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredEvents.length === 0 ? (
                  <tr>
                    <td colSpan="7" className="cp-empty-table-cell">
                      No events matching the selected filters.
                    </td>
                  </tr>
                ) : (
                  filteredEvents.map(evt => {
                    const isDraft = evt.status === 'draft';
                    const isCancelled = evt.status === 'cancelled';
                    const startDateStr = evt.startDateTime instanceof Date 
                      ? evt.startDateTime.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
                      : '';

                    return (
                      <tr key={evt.id}>
                        <td className="cp-table-title-cell">
                          <div className="cp-table-title">{evt.title}</div>
                          <div className="cp-table-type">
                            {evt.eventType === 'internal' ? 'ðŸ›ï¸ Campus Internal' : 'ðŸŒ External Event'}
                          </div>
                        </td>
                        <td>
                          <CategoryBadge category={evt.category} size="xs" />
                        </td>
                        <td className="cp-table-date-cell">
                          <div>{startDateStr}</div>
                        </td>
                        <td className="cp-table-venue-cell" title={evt.venueName}>
                          {evt.venueName}
                        </td>
                        <td>
                          <VerificationBadge status={evt.benefitsVerificationStatus} size="xs" />
                        </td>
                        <td>
                          <span className={`cp-badge cp-badge-${evt.status} cp-badge-xs`}>
                            {evt.status.charAt(0).toUpperCase() + evt.status.slice(1)}
                          </span>
                        </td>
                        <td className="cp-table-actions-cell text-right">
                          <button
                            className="cp-action-btn view"
                            onClick={() => openEventDetails(evt)}
                            title="Preview event details"
                          >
                            <Eye size={15} />
                          </button>
                          
                          {/* Only Draft events can be edited per Section 6 */}
                          {isDraft ? (
                            <button
                              className="cp-action-btn edit"
                              onClick={() => handleEdit(evt)}
                              title="Edit draft event"
                            >
                              <Edit3 size={15} />
                            </button>
                          ) : (
                            <button
                              className="cp-action-btn disabled"
                              disabled
                              title="Published and completed events can only be modified by administrators."
                            >
                              <Lock size={15} />
                            </button>
                          )}

                          {/* Organizers can cancel their own events */}
                          {!isCancelled && (
                            <button
                              className="cp-action-btn cancel"
                              onClick={() => handleCancel(evt.id, evt.title)}
                              title="Cancel event"
                            >
                              <Ban size={15} />
                            </button>
                          )}
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Modal for Create / Edit (Drafts only) */}
        <EventFormModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onSubmit={handleFormSubmit}
          initialEvent={editingEvent}
        />
      </div>
    </div>
  );
}
