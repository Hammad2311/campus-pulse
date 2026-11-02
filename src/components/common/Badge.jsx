import React from 'react';
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

  if (cat.includes('tech')) variant = 'tech';
  else if (cat.includes('hackathon')) variant = 'hackathon';
  else if (cat.includes('cultur')) variant = 'cultural';
  else if (cat.includes('sport')) variant = 'sports';
  else if (cat.includes('work')) variant = 'workshop';
  else if (cat.includes('acad')) variant = 'academic';
  else if (cat.includes('soci')) variant = 'social';

  return (
    <Badge variant={variant} size={size}>
      {category}
    </Badge>
  );
}

export function EventTypeBadge({ type, size = 'sm' }) {
  const isUni = type === 'university';
  return (
    <Badge variant={isUni ? 'university' : 'external'} size={size}>
      {isUni ? '🏛️ Campus Event' : '🌐 External Event'}
    </Badge>
  );
}
