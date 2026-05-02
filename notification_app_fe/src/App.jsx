/**
 * Knotify - Main Application Shell
 */

import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link, NavLink } from 'react-router-dom';
import AllNotifications from './pages/AllNotifications';
import PriorityNotifications from './pages/PriorityNotifications';
import { Bell, Zap } from 'lucide-react';
import './App.css';

function App() {
  return (
    <Router>
      <div className="app-shell">
        <nav className="navbar glass-card" aria-label="Main Navigation">
          <div className="nav-container">
            <Link to="/" className="nav-logo" title="Knotify Home">
              <Bell className="logo-icon" />
              <span>Knotify</span>
            </Link>
            
            <div className="nav-links">
              <NavLink 
                to="/" 
                end 
                className={({ isActive }) => isActive ? 'nav-item active' : 'nav-item'}
              >
                Recent
              </NavLink>
              
              <NavLink 
                to="/priority" 
                className={({ isActive }) => isActive ? 'nav-item active' : 'nav-item'}
              >
                <Zap size={16} />
                Priority
              </NavLink>
            </div>
          </div>
        </nav>

        <main className="content">
          <Routes>
            <Route path="/" element={<AllNotifications />} />
            <Route path="/priority" element={<PriorityNotifications />} />
            <Route path="*" element={
              <div style={{ padding: '4rem', textAlign: 'center' }}>
                <h2>Page Not Found</h2>
                <Link to="/" className="btn-primary" style={{ marginTop: '1rem', display: 'inline-block' }}>
                  Back to Home
                </Link>
              </div>
            } />
          </Routes>
        </main>

        <footer className="footer">
          <p>&copy; {new Date().getFullYear()} Knotify System. Crafted with care for clear communication.</p>
        </footer>
      </div>
    </Router>
  );
}

export default App;
