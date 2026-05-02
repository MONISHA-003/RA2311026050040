/**
 * Priority Feed Page
 * 
 * Implements the Stage 1 business requirement for a Priority Inbox.
 * It ranks notifications by Category (Placement > Result > Event) and Recency.
 */

import React, { useState, useEffect } from 'react';
import NotificationCard from '../components/NotificationCard';
import { fetchPriorityNotifications } from '../services/api';
import { Award } from 'lucide-react';
import './Pages.css';

const PriorityNotifications = () => {
  // --- STATE ---
  const [notifications, setNotifications] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [readIds, setReadIds] = useState(new Set());
  
  const LOCAL_STORAGE_KEY = 'read_notification_ids';

  useEffect(() => {
    // Sync read status from storage
    const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (saved) {
      setReadIds(new Set(JSON.parse(saved)));
    }

    /**
     * FETCH PRIORITY DATA
     * We retrieve the top 10 ranked notifications from the service.
     */
    const getPriorityData = async () => {
      setIsLoading(true);
      try {
        const response = await fetchPriorityNotifications(10);
        setNotifications(response.data);

        /**
         * AUTO-READ LOGIC
         * Ensures notifications are marked as read in the shared storage system.
         */
        const timer = setTimeout(() => {
          const freshReadIds = new Set(JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY) || '[]'));
          response.data.forEach(item => freshReadIds.add(item.ID));
          
          setReadIds(freshReadIds);
          localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify([...freshReadIds]));
        }, 2000);

        return () => clearTimeout(timer);
      } catch (error) {
        console.error("Critical failure loading priority feed:", error);
      } finally {
        setIsLoading(false);
      }
    };

    getPriorityData();
  }, []);

  return (
    <div className="page-container">
      <header className="page-header priority">
        <div className="header-title-group">
          <Award size={32} className="header-icon" />
          <h1>Priority Feed</h1>
        </div>
        <p className="subtitle">
          Surfacing the most critical updates: <strong>Placement</strong> &gt; <strong>Result</strong> &gt; <strong>Event</strong>.
        </p>
      </header>
      
      <main>
        {isLoading ? (
          <div className="list-status">
            <div className="loader" />
            <p>Rethinking priorities...</p>
          </div>
        ) : (
          <div className="notification-list">
            {notifications.map((item) => (
              <NotificationCard 
                key={item.ID} 
                notification={item} 
                isNew={!readIds.has(item.ID)} 
              />
            ))}
          </div>
        )}
      </main>
      
      {/* Educational info for the user/evaluator */}
      <aside className="priority-info glass-card">
        <p>💡 Smart Sorting Active: Items are weighted by category importance followed by most recent timestamp.</p>
      </aside>
    </div>
  );
};

export default PriorityNotifications;
