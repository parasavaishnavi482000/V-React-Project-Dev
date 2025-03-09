import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Signup = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', username: '', email: '', password: '', confirmPassword: '', phone: '' });
  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};
    if (!/^(?![-_])(?!.*[-_]$)[a-zA-Z0-9-_]{8,16}$/.test(form.username)) newErrors.username = "Invalid username!";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) newErrors.email = "Invalid email!";
    if (!/^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,16}$/.test(form.password)) newErrors.password = "Weak password!";
    if (form.password !== form.confirmPassword) newErrors.confirmPassword = "Passwords do not match!";
    if (!/^[6-9]\d{9}$/.test(form.phone)) newErrors.phone = "Invalid phone!";
    
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
          {["Full Name", "Username", "Email", "Password", "Confirm Password", "Phone Number"].map((placeholder, i) => (
            <div key={i}>
              <input type={placeholder.includes("Password") ? "password" : "text"} className="form-control mb-2"
                placeholder={placeholder} onChange={(e) => setForm({ ...form, [placeholder.toLowerCase().replace(" ", "")]: e.target.value })} required />
              {errors[placeholder.toLowerCase().replace(" ", "")] && <small className="text-danger">{errors[placeholder.toLowerCase().replace(" ", "")]}</small>}
            </div>
          ))}
          <button type="submit" className="btn btn-success w-100">Signup</button>
        </form>
      </div>
    </div>
  );
};

export default Signup;
