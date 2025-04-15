import React, { useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { motion } from 'framer-motion';

const HomePage = ({ setPage }) => {

  useEffect(() => {
    // Autoplay workaround for some browsers
    const video = document.getElementById('bg-video');
    if (video) {
      video.play().catch(() => {});
    }
  }, []);

  return (
    <div className="position-relative d-flex flex-column min-vh-100 overflow-hidden">
      {/* Background Video */}
      <iframe 
  title="YouTube background video"
  src="https://www.youtube.com/embed/h3fUgOKFMNU?autoplay=1&mute=1&loop=1&playlist=h3fUgOKFMNU&controls=0&showinfo=0&modestbranding=1" 
  frameBorder="0" 
  allow="autoplay; encrypted-media" 
  allowFullScreen
  className="position-absolute top-0 start-0 border-0"
  style={{
    width: '100vw',
    height: '145vh',
    zIndex: -1,
    pointerEvents: 'none'
  }}
></iframe>


      {/* Header */}
      <header className="bg-dark text-white p-2 d-flex justify-content-between align-items-center">
        <h2 className="m-0 d-flex align-items-center gap-2">
          Office Portal
          <i className="bi bi-circle-square"></i>
        </h2>
      </header>

      {/* Main Content */}
      <div className="container text-center flex-grow-1 d-flex flex-column justify-content-center align-items-center text-white">
        <motion.h1
          initial={{ x: "-100vw", opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ type: "spring", stiffness: 60, damping: 12 }}
          className="fw-bold display-6"
        >
          Welcome To My CircleSquare <i className="bi bi-circle-square"></i>
        </motion.h1>

        <motion.div
          className="d-flex justify-content-center gap-3 mt-4"
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.6, duration: 0.9, type: "spring", bounce: 0.6 }}
        >
          <button className="btn btn-light" onClick={() => setPage('login')}>Login</button>
          <button className="btn btn-light" onClick={() => setPage('signup')}>Sign Up</button>
        </motion.div>
      </div>

      {/* Footer */}
      <footer className="bg-dark text-white text-center py-2 mt-auto">
        <p>&copy; 2025 Circle Square. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default HomePage;
