import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({ username: '', password: '' });

  const handleLogin = (e) => {
    e.preventDefault();
    const storedUser = JSON.parse(localStorage.getItem('user'));

    if (storedUser && (storedUser.username === form.username || storedUser.email === form.username) 
        && storedUser.password === form.password) {
      alert("Login Successful!");
      navigate('/welcome');
    } else {
      alert("Invalid Credentials!");
    }
  };

  return (
    <div className="d-flex justify-content-center align-items-center vh-100 bg-light">
      <div className="p-4 shadow-lg rounded bg-white" style={{ width: "350px" }}>
        <h3 className="text-center mb-3">Login</h3>
        <form onSubmit={handleLogin}>
          <input type="text" className="form-control mb-2" placeholder="Username or Email"
            onChange={(e) => setForm({ ...form, username: e.target.value })} required />
          
          <input type="password" className="form-control mb-2" placeholder="Password"
            onChange={(e) => setForm({ ...form, password: e.target.value })} required />
          
          <button type="submit" className="btn btn-primary w-100">Login</button>
        </form>
      </div>
    </div>
  );
};

export default Login;
