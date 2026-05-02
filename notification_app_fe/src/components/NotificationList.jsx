import React from 'react';
import NotificationCard from './NotificationCard';
import { Inbox } from 'lucide-react';
import './NotificationList.css';

const NotificationList = ({ notifications, loading }) => {
  if (loading) {
    return (
      <div className="list-status">
        <div className="loader"></div>
        <p>Fetching your updates...</p>
      </div>
    );
  }

  if (!notifications || notifications.length === 0) {
    return (
      <div className="list-status empty-state glass-card">
        <Inbox size={48} className="empty-icon" />
        <h3>All Quiet Here</h3>
        <p>We couldn't find any notifications. Try changing your filters.</p>
      </div>
    );
  }

  return (
    <div className="notification-list">
      {notifications.map((notification) => (
        <NotificationCard key={notification.id} notification={notification} />
      ))}
    </div>
  );
};

export default NotificationList;
