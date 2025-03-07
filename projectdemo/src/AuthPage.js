import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { FaEye, FaEyeSlash } from "react-icons/fa";

const AuthPage = () => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    phone: "",
    password: "",
  });
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);

  const toggleForm = () => {
    setIsSignUp(!isSignUp);
    setFormData({ username: "", email: "", phone: "", password: "" });
    setErrors({});
  };

  const validate = () => {
    let newErrors = {};
    if (isSignUp && !/^[a-zA-Z0-9_]{3,15}$/.test(formData.username)) {
      newErrors.username = "Username must be 3-15 characters, letters, numbers, or underscores.";
    }
    if (!/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(formData.email)) {
      newErrors.email = "Invalid email format.";
    }
    if (!/^\d{10}$/.test(formData.phone)) {
      newErrors.phone = "Phone number must be 10 digits.";
    }
    if (!/^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/.test(formData.password)) {
      newErrors.password = "Password must be at least 6 characters, contain one capital letter, one number, and one special character.";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) {
      alert(`${isSignUp ? "Signup" : "Login"} successful!`);
    }
  };

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-6">
          <div className="card p-4 shadow-lg">
            <h2 className="text-center">{isSignUp ? "Sign Up" : "Login"}</h2>
            <form onSubmit={handleSubmit}>
              {isSignUp && (
                <div className="mb-3">
                  <label className="form-label">Username</label>
                  <input type="text" name="username" className="form-control" value={formData.username} onChange={handleChange} />
                  {errors.username && <div className="text-danger">{errors.username}</div>}
                </div>
              )}
              <div className="mb-3">
                <label className="form-label">Email</label>
                <input type="email" name="email" className="form-control" value={formData.email} onChange={handleChange} />
                {errors.email && <div className="text-danger">{errors.email}</div>}
              </div>
              {isSignUp && (
                <div className="mb-3">
                  <label className="form-label">Phone</label>
                  <input type="text" name="phone" className="form-control" value={formData.phone} onChange={handleChange} />
                  {errors.phone && <div className="text-danger">{errors.phone}</div>}
                </div>
              )}
              <div className="mb-3 position-relative">
                <label className="form-label">Password</label>
                <div className="input-group">
                  <input type={showPassword ? "text" : "password"} name="password" className="form-control" value={formData.password} onChange={handleChange} />
                  <button type="button" className="btn btn-outline-secondary" onClick={() => setShowPassword(!showPassword)}>
                    {showPassword ? <FaEyeSlash /> : <FaEye />}
                  </button>
                </div>
                {errors.password && <div className="text-danger">{errors.password}</div>}
              </div>
              <button type="submit" className="btn btn-primary w-100">
                {isSignUp ? "Sign Up" : "Login"}
              </button>
            </form>
            <div className="text-center mt-3">
              <button className="btn btn-link" onClick={toggleForm}>
                {isSignUp ? "Already have an account? Login" : "Don't have an account? Sign Up"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;
