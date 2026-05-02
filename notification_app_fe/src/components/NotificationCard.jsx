/**
 * NotificationCard Component
 * 
 * This component is responsible for rendering an individual notification.
 * It dynamically adjusts its icon, labeling, and "New" badge based on the 
 * notification's Type and its read status.
 */

import React from 'react';
import { Bell, Trophy, Calendar, CheckCircle2 } from 'lucide-react';
import './NotificationCard.css';

const NotificationCard = ({ notification, isNew }) => {
  // Destructure with support for the API's PascalCase response keys
  const { Type, Message, Timestamp } = notification;

  /**
   * getTypeConfig
   * Maps notification types to their corresponding visual icons and labels.
   */
  const getTypeConfig = () => {
    const normalizedType = Type ? Type.toLowerCase() : 'default';
    
    switch (normalizedType) {
      case 'placement':
        return { icon: <Trophy className="type-icon placement" />, label: 'Placement' };
      case 'result':
        return { icon: <CheckCircle2 className="type-icon result" />, label: 'Result' };
      case 'event':
        return { icon: <Calendar className="type-icon event" />, label: 'Event' };
      default:
        return { icon: <Bell className="type-icon default" />, label: 'Update' };
    }
  };

  const { icon, label } = getTypeConfig();
  
  /**
   * formatFriendlyDate
   * Converts a ISO timestamp into a user-friendly readable format.
   */
  const formatFriendlyDate = (dateStr) => {
    if (!dateStr) return 'Date unknown';
    const date = new Date(dateStr);
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  return (
    <article 
      className={`notification-card glass-card ${isNew ? 'new-status' : ''}`}
      aria-label={`${label} Notification`}
    >
      {/* Visual cue for unread notifications */}
      {isNew && <span className="new-badge">New</span>}
      
      <div className="card-header">
        <div className="type-tag">
          {icon}
          <span className={`type-label ${Type?.toLowerCase()}`}>{label}</span>
        </div>
        <time className="timestamp" dateTime={Timestamp}>
          {formatFriendlyDate(Timestamp)}
        </time>
      </div>
      
      <div className="card-body">
        <p className="message">{Message}</p>
      </div>
    </article>
  );
};

export default NotificationCard;
