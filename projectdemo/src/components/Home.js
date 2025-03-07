import React from "react";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const navigate = useNavigate();

  return (
    <div className="d-flex justify-content-center align-items-center vh-100 bg-light">
      <div className="p-5 shadow-lg rounded bg-white text-center" style={{ width: "350px" }}>
        <h2 className="mb-4">Office Authentication</h2>
        <button className="btn btn-primary w-100 mb-3" onClick={() => navigate('/login')}>
          Login
        </button>
        <button className="btn btn-success w-100" onClick={() => navigate('/signup')}>
          Signup
        </button>
      </div>
    </div>
  );
};

export default Home;
