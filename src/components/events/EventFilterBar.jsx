import React from 'react';
import { 
  APPROVED_CATEGORIES, 
  CATEGORY_LABELS, 
  APPROVED_INTEREST_AREAS, 
  INTEREST_AREA_LABELS 
} from '../../data/mockEvents';
import { Search, X, SlidersHorizontal, Calendar, RotateCcw } from 'lucide-react';
import './EventFilterBar.css';

export function EventFilterBar({
  filters,
  onFilterChange,
  onResetFilters,
  totalResults = 0,
  isSearching = false
}) {
  const {
    searchQuery = '',
    category = 'all',
    interestArea = 'all',
    eventType = 'all',
    upcomingOnly = false
  } = filters;

  const hasActiveFilters = 
    searchQuery.trim() !== '' || 
    category !== 'all' || 
    interestArea !== 'all' || 
    eventType !== 'all' || 
    upcomingOnly;

  return (
    <div className="cp-filter-bar-container">
      {/* Search Input Bar */}
      <div className="cp-search-row">
        <div className="cp-search-input-wrap">
          <Search size={18} className="cp-search-icon" />
          <input
            type="text"
            className="cp-search-input"
            placeholder="Search by event title, organizer, venue, or keywords..."
            value={searchQuery}
            onChange={(e) => onFilterChange('searchQuery', e.target.value)}
          />
          {searchQuery && (
            <button 
              className="cp-search-clear"
              onClick={() => onFilterChange('searchQuery', '')}
              aria-label="Clear search input"
            >
              <X size={15} />
            </button>
          )}
        </div>

        {/* Clear All Filters Button */}
        {hasActiveFilters && (
          <button 
            className="btn btn-secondary btn-sm cp-reset-filters-btn"
            onClick={onResetFilters}
          >
            <RotateCcw size={14} />
            <span>Reset All</span>
          </button>
        )}
      </div>

      {/* Primary Category Pill Buttons (Approved Contract Categories) */}
      <div className="cp-category-pills-scroll">
        <button
          className={`cp-category-pill ${category === 'all' ? 'active' : ''}`}
          onClick={() => onFilterChange('category', 'all')}
        >
          All Categories
        </button>
        {APPROVED_CATEGORIES.map((catKey) => {
          const isSelected = category === catKey;
          return (
            <button
              key={catKey}
              className={`cp-category-pill ${isSelected ? 'active' : ''}`}
              onClick={() => onFilterChange('category', catKey)}
            >
              {CATEGORY_LABELS[catKey]}
            </button>
          );
        })}
      </div>

      {/* Advanced Filter Row (Event Type, Interest Area, Upcoming Only Toggle) */}
      <div className="cp-sub-filter-row">
        {/* Event Type Filter (All / Campus Internal / External) */}
        <div className="cp-segmented-control">
          <button
            className={`cp-segment-btn ${eventType === 'all' ? 'active' : ''}`}
            onClick={() => onFilterChange('eventType', 'all')}
          >
            All Events
          </button>
          <button
            className={`cp-segment-btn ${eventType === 'internal' ? 'active' : ''}`}
            onClick={() => onFilterChange('eventType', 'internal')}
          >
            🏛️ Campus Internal
          </button>
          <button
            className={`cp-segment-btn ${eventType === 'external' ? 'active' : ''}`}
            onClick={() => onFilterChange('eventType', 'external')}
          >
            🌐 External & Hackathons
          </button>
        </div>

        {/* Focus Interest Area Dropdown (Approved Enums) */}
        <div className="cp-select-wrapper">
          <label htmlFor="interest-select" className="cp-select-label">
            <SlidersHorizontal size={14} />
            <span>Interest Area:</span>
          </label>
          <select
            id="interest-select"
            className="cp-filter-select"
            value={interestArea}
            onChange={(e) => onFilterChange('interestArea', e.target.value)}
          >
            <option value="all">All Topics</option>
            {APPROVED_INTEREST_AREAS.map((areaKey) => (
              <option key={areaKey} value={areaKey}>
                {INTEREST_AREA_LABELS[areaKey]}
              </option>
            ))}
          </select>
        </div>

        {/* Upcoming Events Only Toggle */}
        <label className="cp-toggle-label">
          <input
            type="checkbox"
            className="cp-toggle-checkbox"
            checked={upcomingOnly}
            onChange={(e) => onFilterChange('upcomingOnly', e.target.checked)}
          />
          <span className="cp-toggle-custom"></span>
          <Calendar size={14} className="cp-toggle-icon" />
          <span className="cp-toggle-text">Upcoming Only</span>
        </label>
      </div>

      {/* Results Count & Active Filter Tags Bar */}
      <div className="cp-filter-status-bar">
        <div className="cp-results-count">
          Showing <strong>{totalResults}</strong> {totalResults === 1 ? 'event' : 'events'}
          {isSearching && <span className="cp-searching-text">Updating...</span>}
        </div>

        {hasActiveFilters && (
          <div className="cp-active-tags-list">
            {category !== 'all' && (
              <span className="cp-filter-chip">
                Category: {CATEGORY_LABELS[category] || category}
                <X size={12} onClick={() => onFilterChange('category', 'all')} />
              </span>
            )}
            {interestArea !== 'all' && (
              <span className="cp-filter-chip">
                Topic: {INTEREST_AREA_LABELS[interestArea] || interestArea}
                <X size={12} onClick={() => onFilterChange('interestArea', 'all')} />
              </span>
            )}
            {eventType !== 'all' && (
              <span className="cp-filter-chip">
                Type: {eventType === 'internal' ? 'Campus Internal' : 'External'}
                <X size={12} onClick={() => onFilterChange('eventType', 'all')} />
              </span>
            )}
            {upcomingOnly && (
              <span className="cp-filter-chip">
                Upcoming Only
                <X size={12} onClick={() => onFilterChange('upcomingOnly', false)} />
              </span>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
