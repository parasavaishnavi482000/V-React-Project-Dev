import React, { useState } from "react";
import Input from "./components/Input";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
 
const Login = ({ setPage }) => {
  const [formData, setFormData] = useState({
    identifier: "",
    password: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
 
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };
 
   const handleLogin = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError("");
    try {
      const response = await axios.post("http://localhost:5000/api/Login", {
        identifier: formData.identifier,
        password: formData.password,
      });
 
      if (response.status === 200) {
        
        localStorage.setItem("userDetails", JSON.stringify(response.data.user));
 
        alert("Login Successful!");
        setPage("landing");  
      }
    } catch (error) {
      alert("Invalid credentials. Please try again.");
      console.error("Login error:", error);
    }
  };
 
 
 
  return (
    <div className="container" style={{ maxWidth: "400px", marginTop: "50px" }}>
      <h2 className="mb-4 text-center">Login</h2>
      <form onSubmit={handleLogin} className="p-3 border rounded shadow bg-white">
        <div className="mb-3">
          <Input
            type="text"
            name="identifier"
            value={formData.identifier}
            placeholder="Username or Email"
            onChange={handleChange}
          />
        </div>
        <div className="mb-3">
          <Input
            type="password"
            name="password"
            value={formData.password}
            placeholder="Password"
            onChange={handleChange}
          />
        </div>
        {error && <p className="text-danger text-center">{error}</p>}
        <button type="submit" className="btn btn-primary w-100" disabled={isSubmitting}>
          {isSubmitting ? "Logging In..." : "Login"}
        </button>
      </form>
      <p className="mt-3 text-center">
        Don’t have an account?{" "}
        <button className="btn btn-link p-0 align-baseline" onClick={() => setPage("Signup")}>
          Sign Up
        </button>
      </p>
    </div>
  );
};
 
export default Login;
 
 