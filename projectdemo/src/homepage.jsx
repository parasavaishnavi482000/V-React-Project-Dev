import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

const HomePage = ({ setPage }) => {
  return (
    <div className="d-flex flex-column min-vh-100">
      {/* Header */}
      <header className="bg-dark text-white text-center py-2">
        <h2>Office Portal</h2>
      </header>
      
      {/* Main Content */}
      <div className="container mt-5 text-center flex-grow-1">
        <h1>Welcome to Office</h1>
        <p>This is the HomePage component.</p>
        <div className="d-flex justify-content-center gap-3 mt-4">
          <button className="btn btn-primary" onClick={() => setPage('login')}>
            Login
          </button>
          <button className="btn btn-secondary" onClick={() => setPage('signup')}>
            Sign Up
          </button>
        </div>
      </div>
      
      {/* Footer */}
      <footer className="bg-dark text-white text-center py-2 mt-auto">
        <p>&copy; 2025 Office Portal. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default HomePage;
