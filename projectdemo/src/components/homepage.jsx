import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { motion } from 'framer-motion';

const HomePage = ({ setPage }) => {
  return (
    <div
    className="d-flex flex-column min-vh-100"
    style={{
      backgroundImage: "url('/homepage2.jpg')",
      backgroundSize: "cover",
      backgroundRepeat: "no-repeat",
      backgroundPosition: "center",
    }}
    >  {/* Header */}
      {/* <header className="bg-dark text-white text-center py-2">
        <h2>Office Portal</h2>
        <i className="bi bi-circle-square"></i>
      </header> */}
        <header className="bg-dark text-white  p-2 d-flex justify-content-between align-items-center ">
  <h2 className="m-0 d-flex align-items-center gap-2">
    Office Portal
    <i className="bi bi-circle-square"></i>
  </h2>
  </header>

      {/* Main Content */}
      <div className="container mt-5 text-center flex-grow-1 d-flex flex-column justify-content-center align-items-center">
        {/* Animated Heading */}
        <motion.h1
          initial={{ x: "-100vw", opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ type: "spring", stiffness: 60, damping: 12 }}
        >
          Welcome To My CircleSquare<i className="bi bi-circle-square"></i>
        </motion.h1>

        {/* Animated Buttons */}
        <motion.div
          className="d-flex justify-content-center gap-3 mt-4"
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.6, duration: 0.9, type: "spring", bounce: 0.6}}
        >
          <button className="btn btn-dark" onClick={() => setPage('login')}>
            Login
          </button>
          <button className="btn btn-dark" onClick={() => setPage('signup')}>
            Sign Up
          </button>
        </motion.div>
      </div>

      {/* Footer */}
      <footer className="bg-dark text-white text-center py-2 mt-auto">
        <p>&copy;   2025 Circle Square. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default HomePage;
