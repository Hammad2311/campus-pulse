import React from 'react';
import { CATEGORIES, INTEREST_TAGS } from '../../data/mockEvents';
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
    category = 'All',
    interest = 'All',
    eventType = 'all',
    upcomingOnly = false
  } = filters;

  const hasActiveFilters = 
    searchQuery.trim() !== '' || 
    category !== 'All' || 
    interest !== 'All' || 
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

      {/* Primary Category Pill Buttons */}
      <div className="cp-category-pills-scroll">
        {CATEGORIES.map((cat) => {
          const isSelected = category.toLowerCase() === cat.toLowerCase();
          return (
            <button
              key={cat}
              className={`cp-category-pill ${isSelected ? 'active' : ''}`}
              onClick={() => onFilterChange('category', cat)}
            >
              {cat}
            </button>
          );
        })}
      </div>

      {/* Advanced Filter Row (Event Type, Interest Tag, Upcoming Only Toggle) */}
      <div className="cp-sub-filter-row">
        {/* Event Type Filter (All / Campus / External) */}
        <div className="cp-segmented-control">
          <button
            className={`cp-segment-btn ${eventType === 'all' ? 'active' : ''}`}
            onClick={() => onFilterChange('eventType', 'all')}
          >
            All Events
          </button>
          <button
            className={`cp-segment-btn ${eventType === 'university' ? 'active' : ''}`}
            onClick={() => onFilterChange('eventType', 'university')}
          >
            🏛️ Campus Only
          </button>
          <button
            className={`cp-segment-btn ${eventType === 'external' ? 'active' : ''}`}
            onClick={() => onFilterChange('eventType', 'external')}
          >
            🌐 External & Hackathons
          </button>
        </div>

        {/* Focus Interest Area Dropdown */}
        <div className="cp-select-wrapper">
          <label htmlFor="interest-select" className="cp-select-label">
            <SlidersHorizontal size={14} />
            <span>Interest:</span>
          </label>
          <select
            id="interest-select"
            className="cp-filter-select"
            value={interest}
            onChange={(e) => onFilterChange('interest', e.target.value)}
          >
            <option value="All">All Topics</option>
            {INTEREST_TAGS.map((tag) => (
              <option key={tag} value={tag}>{tag}</option>
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
            {category !== 'All' && (
              <span className="cp-filter-chip">
                Category: {category}
                <X size={12} onClick={() => onFilterChange('category', 'All')} />
              </span>
            )}
            {interest !== 'All' && (
              <span className="cp-filter-chip">
                Topic: {interest}
                <X size={12} onClick={() => onFilterChange('interest', 'All')} />
              </span>
            )}
            {eventType !== 'all' && (
              <span className="cp-filter-chip">
                Type: {eventType === 'university' ? 'Campus Only' : 'External'}
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
