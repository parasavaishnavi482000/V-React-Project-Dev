import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
 
const Home= ({ setPage }) => {
  return (
    <div className="container mt-5">
      <h1>Welcome to the School Management System</h1>
      <p>This is the HomePage component.</p>
      <div className="d-flex gap-3 mt-4">
        <button className="btn btn-primary" onClick={() => setPage('Login')}>
          Login
        </button>
        <button className="btn btn-secondary" onClick={() => setPage('Signup')}>
          Sign Up
        </button>
      </div>
    </div>
  );
};
 
export default Home;
 