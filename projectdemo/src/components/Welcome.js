import React from 'react';
import { useNavigate } from 'react-router-dom';

const Welcome = () => {
  const navigate = useNavigate();
  
  return (
    <div className="container text-center mt-5">
      <h2>Welcome to Office</h2>
      <button className="btn btn-danger mt-3" onClick={() => navigate('/')}>Logout</button>
    </div>
  );
};

export default Welcome;
