import React, { useState } from "react";
import Input from "./input";
import { validateInput, validateForm } from "../Validators/namevalidator";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";

const Login = ({ setPage }) => {
  const [formData, setFormData] = useState({
    identifier: "",
    password: "",
  });
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [formMessage, setFormMessage] = useState({ type: "", text: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (touched[name]) setErrors((prev) => ({ ...prev, [name]: validateInput(name, value) }));
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    setTouched((prev) => ({ ...prev, [name]: true }));
    setErrors((prev) => ({ ...prev, [name]: validateInput(name, value) }));
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setFormMessage({ type: "", text: "" });
   
    const newErrors = validateForm(formData);
    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) {
      setFormMessage({ type: "danger", text: "Please fix errors before submitting." });
      setIsSubmitting(false);
      return;
    }

    try {
      const response = await axios.post("http://localhost:5000/api/login", formData);
      if (response.status === 200) {
        const { token, user } = response.data;
        localStorage.setItem("token", token);
        localStorage.setItem("userDetails", JSON.stringify(user));
        setFormMessage({ type: "success", text: "Login Successful! Redirecting..." });
        setTimeout(() => setPage("landing"), 2000);
      }
    } catch (error) {
      setFormMessage({ type: "danger", text: "Invalid credentials. Please try again." });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
    className="d-flex flex-column min-vh-100"
    style={{
      backgroundImage: 'url("/table.jpg")',
      backgroundSize: "cover",
      backgroundPosition: "center",
      backgroundRepeat: "no-repeat",
    }}
  >
      {/* Header */}
      <header className="bg-dark text-white  p-2 d-flex justify-content-between align-items-center ">
  <h2 className="m-0 d-flex align-items-center gap-2">
    Office Portal
    <i className="bi bi-circle-square"></i>
  </h2>
  </header>
      
      {/* Main Content */}
      <div className="container flex-grow-1" style={{ maxWidth: "400px", marginTop: "50px" }}>
        <h2 className="mb-4 text-center">Login</h2>
        {formMessage.text && <div className={`alert alert-${formMessage.type}`} role="alert">{formMessage.text}</div>}
        <form
  onSubmit={handleLogin}
  className="p-3 "
  style={{
    backgroundColor: "rgba(232, 234, 226, 0)", 
    backdropFilter: "blur(5px)", 
    borderRadius: "15px", 
  }}
>
  <div className="mb-3 position-relative">
            <Input
              type="text"
              name="identifier"
              value={formData.identifier}
              placeholder="Username or Email"
              onChange={handleChange}
              onBlur={handleBlur}
              className={`form-control ${touched.identifier && errors.identifier ? "is-invalid" : ""}`}
            />
            {touched.identifier && errors.identifier && <div className="tooltip-error">{errors.identifier}</div>}
          </div>
   
          <div className="mb-3 position-relative">
            <Input
              type="password"
              name="password"
              value={formData.password}
              placeholder="Password"
              onChange={handleChange}
              onBlur={handleBlur}
              className={`form-control ${touched.password && errors.password ? "is-invalid" : ""}`}
            />
            {touched.password && errors.password && <div className="tooltip-error">{errors.password}</div>}
          </div>
   
          <button type="submit" className="btn btn-primary w-100" disabled={isSubmitting}>{isSubmitting ? "Logging In..." : "Login"}</button>
        </form>
        <p className="mt-3 text-center text-balck">
          Don’t have an account? <button className="btn btn-link p-0 align-baseline" onClick={() => setPage("signup")}>Sign Up</button>
        </p>
      </div>
      
      {/* Footer */}
      <footer className="bg-dark text-white text-center py-2 mt-auto">
        <p>&copy;   2025 Circle Square. All rights reserved.</p>
      </footer>
    </div>
  );
};
 
export default Login;
