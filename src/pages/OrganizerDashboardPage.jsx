import React, { useState, useEffect } from 'react';
import { useEvents } from '../context/EventContext';
import { 
  fetchEvents, 
  createEventMock, 
  updateEventMock, 
  updateEventStatusMock 
} from '../services/eventService';
import { EventFormModal } from '../components/dashboard/EventFormModal';
import { Badge, CategoryBadge } from '../components/common/Badge';
import { 
  LayoutDashboard, 
  Plus, 
  Edit3, 
  Trash2, 
  Eye, 
  Users, 
  Calendar, 
  CheckCircle2, 
  AlertCircle, 
  Sparkles, 
  Layers, 
  Filter,
  ArrowUpRight,
  RefreshCw,
  Search
} from 'lucide-react';
import './OrganizerDashboardPage.css';

export function OrganizerDashboardPage() {
  const { 
    organizerUser, 
    navigateTo, 
    openEventDetails, 
    showToast 
  } = useEvents();

  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('all'); // 'all' | 'published' | 'draft' | 'cancelled'
  const [searchQuery, setSearchQuery] = useState('');

  // Form Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState(null);

  const loadDashboardEvents = async () => {
    setLoading(true);
    try {
      const data = await fetchEvents({
        status: 'all',
        includeDrafts: true
      });
      setEvents(data);
    } catch (err) {
      console.error('Failed to load organizer events', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDashboardEvents();
  }, []);

  const handleCreateNew = () => {
    setEditingEvent(null);
    setIsModalOpen(true);
  };

  const handleEdit = (event) => {
    setEditingEvent(event);
    setIsModalOpen(true);
  };

  const handleFormSubmit = async (formData) => {
    if (editingEvent) {
      const updated = await updateEventMock(editingEvent.id, formData);
      showToast(`Updated "${formData.title}" (Mock State)`, 'success');
    } else {
      const created = await createEventMock(formData);
      showToast(`Created new event "${formData.title}" (Mock State)`, 'success');
    }
    await loadDashboardEvents();
  };

  const handleStatusChange = async (eventId, newStatus) => {
    await updateEventStatusMock(eventId, newStatus);
    showToast(`Status changed to ${newStatus}`, 'info');
    await loadDashboardEvents();
  };

  // Metrics calculation
  const totalEvents = events.length;
  const publishedEvents = events.filter(e => e.status === 'published');
  const draftEvents = events.filter(e => e.status === 'draft');
  const cancelledEvents = events.filter(e => e.status === 'cancelled');

  const totalRegistrations = events.reduce((sum, e) => sum + (e.registeredCount || 0), 0);
  const totalCapacity = events.reduce((sum, e) => sum + (e.capacity || 0), 0);
  const avgOccupancy = totalCapacity > 0 ? Math.round((totalRegistrations / totalCapacity) * 100) : 0;

  // Filtered list
  const filteredEvents = events.filter(e => {
    const matchesStatus = statusFilter === 'all' || e.status === statusFilter;
    const query = searchQuery.trim().toLowerCase();
    const matchesSearch = !query || 
      e.title.toLowerCase().includes(query) ||
      e.venue.toLowerCase().includes(query) ||
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
              <span>Host & Club Admin Center</span>
            </div>
            <h1 className="cp-dashboard-title">Organizer Workspace</h1>
            <p className="cp-dashboard-subtitle">
              Manage university-hosted conferences, review registrations, and draft upcoming callouts.
            </p>
          </div>

          <div className="cp-dashboard-header-actions">
            <button 
              className="btn btn-primary"
              onClick={handleCreateNew}
            >
              <Plus size={18} />
              <span>Create Event</span>
            </button>
          </div>
        </div>

        {/* Firebase Backend Integration Status Banner */}
        <div className="cp-dashboard-alert">
          <Sparkles size={18} className="cp-alert-sparkle" />
          <div className="cp-alert-body">
            <strong>Frontend Simulation Notice:</strong> You are currently viewing the frontend prototype with localized client state. Full persistence, Firestore security rules enforcement, and role-based ACLs will be connected through Hammad Qubah's Cloud Firestore service.
          </div>
        </div>

        {/* Overview Metric Cards */}
        <div className="cp-metrics-grid">
          <div className="card cp-metric-card">
            <div className="cp-metric-icon bg-indigo">
              <Calendar size={22} />
            </div>
            <div className="cp-metric-info">
              <span className="cp-metric-label">Managed Events</span>
              <span className="cp-metric-number">{totalEvents}</span>
              <span className="cp-metric-sub">{publishedEvents.length} live • {draftEvents.length} drafts</span>
            </div>
          </div>

          <div className="card cp-metric-card">
            <div className="cp-metric-icon bg-emerald">
              <Users size={22} />
            </div>
            <div className="cp-metric-info">
              <span className="cp-metric-label">Total Student Bookings</span>
              <span className="cp-metric-number">{totalRegistrations}</span>
              <span className="cp-metric-sub">Across all campus listings</span>
            </div>
          </div>

          <div className="card cp-metric-card">
            <div className="cp-metric-icon bg-blue">
              <ArrowUpRight size={22} />
            </div>
            <div className="cp-metric-info">
              <span className="cp-metric-label">Capacity Utilization</span>
              <span className="cp-metric-number">{avgOccupancy}%</span>
              <span className="cp-metric-sub">{totalCapacity} total seat capacity</span>
            </div>
          </div>
        </div>

        {/* Events Management Table Card */}
        <div className="card cp-mgmt-card">
          <div className="cp-mgmt-toolbar">
            <div className="cp-mgmt-title-group">
              <h3 className="cp-mgmt-title">All Event Listings</h3>
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
                  className={`cp-status-tab-btn ${statusFilter === 'published' ? 'active' : ''}`}
                  onClick={() => setStatusFilter('published')}
                >
                  Published ({publishedEvents.length})
                </button>
                <button
                  className={`cp-status-tab-btn ${statusFilter === 'draft' ? 'active' : ''}`}
                  onClick={() => setStatusFilter('draft')}
                >
                  Drafts ({draftEvents.length})
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
                  <th>Event Name & Details</th>
                  <th>Category</th>
                  <th>Date & Time</th>
                  <th>Venue</th>
                  <th>Registration Status</th>
                  <th>Publish Status</th>
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
                  filteredEvents.map(evt => (
                    <tr key={evt.id}>
                      <td className="cp-table-title-cell">
                        <div className="cp-table-title">{evt.title}</div>
                        <div className="cp-table-type">
                          {evt.eventType === 'university' ? '🏛️ Campus Event' : '🌐 External Event'}
                        </div>
                      </td>
                      <td>
                        <CategoryBadge category={evt.category} size="xs" />
                      </td>
                      <td className="cp-table-date-cell">
                        <div>{new Date(evt.startDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</div>
                        <div className="cp-table-time">
                          {new Date(evt.startDate).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true })}
                        </div>
                      </td>
                      <td className="cp-table-venue-cell" title={evt.venue}>
                        {evt.venue}
                      </td>
                      <td>
                        <div className="cp-table-reg-progress">
                          <span><strong>{evt.registeredCount || 0}</strong> / {evt.capacity || 'Open'}</span>
                        </div>
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
                          title="View public event preview"
                        >
                          <Eye size={15} />
                        </button>
                        <button
                          className="cp-action-btn edit"
                          onClick={() => handleEdit(evt)}
                          title="Edit event details"
                        >
                          <Edit3 size={15} />
                        </button>
                        {evt.status !== 'cancelled' ? (
                          <button
                            className="cp-action-btn cancel"
                            onClick={() => handleStatusChange(evt.id, 'cancelled')}
                            title="Mark as Cancelled"
                          >
                            <Trash2 size={15} />
                          </button>
                        ) : (
                          <button
                            className="cp-action-btn restore"
                            onClick={() => handleStatusChange(evt.id, 'published')}
                            title="Re-publish event"
                          >
                            <RefreshCw size={15} />
                          </button>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Modal for Create / Edit */}
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
