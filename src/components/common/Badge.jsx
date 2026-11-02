import React from 'react';
import { CATEGORY_LABELS } from '../../data/mockEvents';
import './Badge.css';

export function Badge({ children, variant = 'default', size = 'md', className = '' }) {
  return (
    <span className={`cp-badge cp-badge-${variant} cp-badge-${size} ${className}`}>
      {children}
    </span>
  );
}

export function CategoryBadge({ category, size = 'sm' }) {
  const cat = (category || '').toLowerCase();
  let variant = 'default';

  if (cat.includes('tech') || cat.includes('workshop')) variant = 'tech';
  else if (cat.includes('hackathon')) variant = 'hackathon';
  else if (cat.includes('cultur')) variant = 'cultural';
  else if (cat.includes('sport')) variant = 'sports';
  else if (cat.includes('guest') || cat.includes('seminar') || cat.includes('lecture')) variant = 'academic';
  else if (cat.includes('compet')) variant = 'competition';
  else if (cat.includes('club') || cat.includes('department')) variant = 'social';

  const label = CATEGORY_LABELS[category] || category || 'Event';

  return (
    <Badge variant={variant} size={size}>
      {label}
    </Badge>
  );
}

export function EventTypeBadge({ type, size = 'sm' }) {
  const isInternal = type === 'internal';
  return (
    <Badge variant={isInternal ? 'university' : 'external'} size={size}>
      {isInternal ? '🏛️ Campus Event' : '🌐 External Event'}
    </Badge>
  );
}

export function VerificationBadge({ status, size = 'xs' }) {
  if (status === 'verified') {
    return <Badge variant="published" size={size}>✓ Benefits Verified</Badge>;
  }
  if (status === 'unverified') {
    return <Badge variant="draft" size={size}>Pending Verification</Badge>;
  }
  return null;
}
