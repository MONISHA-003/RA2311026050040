/**
 * AllNotifications Page
 * 
 * This page serves as the primary view for all campus updates. 
 * It handles the complex coordination of filtering, pagination, 
 * and tracking unread notifications via localStorage.
 */

import React, { useState, useEffect } from 'react';
import FilterBar from '../components/FilterBar';
import NotificationCard from '../components/NotificationCard';
import CustomPagination from '../components/Pagination';
import { fetchNotifications } from '../services/api';
import { Inbox } from 'lucide-react';
import './Pages.css';

const AllNotifications = () => {
  // --- STATE MANAGEMENT ---
  const [notifications, setNotifications] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState('All');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [readIds, setReadIds] = useState(new Set());
  
  const NOTIFICATIONS_PER_PAGE = 10;
  const LOCAL_STORAGE_KEY = 'read_notification_ids';

  /**
   * INITIAL LOAD
   * Pull the list of already-read IDs from the browser's local storage.
   */
  useEffect(() => {
    const savedIds = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (savedIds) {
      setReadIds(new Set(JSON.parse(savedIds)));
    }
  }, []);

  /**
   * DATA FETCHING & READ TRACKING
   * Triggered whenever filters or the page number changes.
   */
  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      try {
        const response = await fetchNotifications({ 
          limit: NOTIFICATIONS_PER_PAGE, 
          page: currentPage, 
          notification_type: activeFilter 
        });
        
        setNotifications(response.data);
        setTotalPages(response.totalPages);

        /**
         * AUTO-READ LOGIC
         * To simulate a realistic viewing experience, we mark visible notifications 
         * as "read" after they have been on the screen for 2 seconds.
         */
        const readTimer = setTimeout(() => {
          const updatedReadIds = new Set(readIds);
          response.data.forEach(item => updatedReadIds.add(item.ID));
          
          setReadIds(updatedReadIds);
          localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify([...updatedReadIds]));
        }, 2000);

        return () => clearTimeout(readTimer);
      } catch (error) {
        console.error("Failed to load notifications stream:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, [activeFilter, currentPage]);

  /**
   * INTERACTION HANDLERS
   */
  const onFilterSelect = (newFilter) => {
    setActiveFilter(newFilter);
    setCurrentPage(1); // Reset to page 1 on filter change for consistency
  };

  const onPageSelect = (event, newPage) => {
    setCurrentPage(newPage);
    window.scrollTo({ top: 0, behavior: 'smooth' }); // Visual comfort
  };

  return (
    <div className="page-container">
      <header className="page-header">
        <h1>All Notifications</h1>
        <p className="subtitle">Your complete stream of campus placements, results, and events.</p>
      </header>

      {/* Control Bar for Filtering */}
      <section className="controls">
        <FilterBar 
          currentFilter={activeFilter} 
          onFilterChange={onFilterSelect} 
        />
      </section>
      
      {/* Main Feed Content */}
      <main>
        {isLoading ? (
          <div className="list-status">
            <div className="loader" />
            <p>Gathering updates...</p>
          </div>
        ) : notifications.length === 0 ? (
          <div className="list-status empty-state glass-card">
            <Inbox size={48} className="empty-icon" />
            <h3>All Quiet Here</h3>
            <p>No notifications match your current selection. Check back later!</p>
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

        {/* Navigation Controls */}
        {!isLoading && notifications.length > 0 && (
          <CustomPagination 
            count={totalPages} 
            page={currentPage} 
            onChange={onPageSelect} 
          />
        )}
      </main>
    </div>
  );
};

export default AllNotifications;
