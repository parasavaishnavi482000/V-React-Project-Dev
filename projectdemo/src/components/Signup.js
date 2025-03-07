import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Signup = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: '',
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
  });

  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const validateForm = () => {
    let newErrors = {};

    const usernameRegex = /^(?![-_])(?!.*[-_]$)[a-zA-Z0-9-_]{8,16}$/;
    if (!usernameRegex.test(form.username)) {
      newErrors.username = "Invalid username format!";
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(form.email)) {
      newErrors.email = "Invalid email format!";
    }

    const passwordRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,16}$/;
    if (!passwordRegex.test(form.password)) {
      newErrors.password = "Weak password! (1 Uppercase, 1 Special Char, 1 Number)";
    }

    if (form.password !== form.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match!";
    }

    const phoneRegex = /^[6-9]\d{9}$/;
    if (!phoneRegex.test(form.phone)) {
      newErrors.phone = "Invalid phone number!";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSignup = (e) => {
    e.preventDefault();
    if (validateForm()) {
      localStorage.setItem('user', JSON.stringify(form));
      alert("Signup Successful!");
      navigate('/login');
    }
  };

  return (
    <div className="d-flex justify-content-center align-items-center vh-100 bg-light">
      <div className="p-4 shadow-lg rounded bg-white" style={{ width: "350px" }}>
        <h3 className="text-center mb-3">Signup</h3>
        <form onSubmit={handleSignup}>
          <input type="text" className="form-control mb-2" placeholder="Full Name" 
            onChange={(e) => setForm({ ...form, name: e.target.value })} required />

          <input type="text" className="form-control mb-2" placeholder="Username"
            onChange={(e) => setForm({ ...form, username: e.target.value })} required />
          {errors.username && <small className="text-danger">{errors.username}</small>}

          <input type="email" className="form-control mb-2" placeholder="Email"
            onChange={(e) => setForm({ ...form, email: e.target.value })} required />
          {errors.email && <small className="text-danger">{errors.email}</small>}

          {/* Password Field with Toggle */}
          <div className="input-group mb-2">
            <input type={showPassword ? "text" : "password"} className="form-control" placeholder="Password"
              onChange={(e) => setForm({ ...form, password: e.target.value })} required />
            <button type="button" className="btn btn-outline-secondary" onClick={() => setShowPassword(!showPassword)}>
              <i className={showPassword ? "bi bi-eye-slash" : "bi bi-eye"}></i>
            </button>
          </div>
          {errors.password && <small className="text-danger">{errors.password}</small>}

          {/* Confirm Password Field with Toggle */}
          <div className="input-group mb-2">
            <input type={showConfirmPassword ? "text" : "password"} className="form-control" placeholder="Confirm Password"
              onChange={(e) => setForm({ ...form, confirmPassword: e.target.value })} required />
            <button type="button" className="btn btn-outline-secondary" onClick={() => setShowConfirmPassword(!showConfirmPassword)}>
              <i className={showConfirmPassword ? "bi bi-eye-slash" : "bi bi-eye"}></i>
            </button>
          </div>
          {errors.confirmPassword && <small className="text-danger">{errors.confirmPassword}</small>}

          <input type="text" className="form-control mb-2" placeholder="Phone Number"
            onChange={(e) => setForm({ ...form, phone: e.target.value })} required />
          {errors.phone && <small className="text-danger">{errors.phone}</small>}

          <button type="submit" className="btn btn-success w-100">Signup</button>
        </form>
      </div>
    </div>
  );
};

export default Signup;
