import React, { useState } from "react";
import Input from "./components/Input";
import { validateInput, validateForm } from "./Validators/namevalidator";
import "bootstrap/dist/css/bootstrap.min.css";
import axios from "axios";
 
const Signup = ({ setPage }) => {
  const [formData, setFormData] = useState({
    name: "",
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    phone: "",
  });
 
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
 
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
 
    if (touched[name]) {
      setErrors((prev) => ({ ...prev, [name]: validateInput(name, value) }));
    }
  };
 
  const handleBlur = (e) => {
    const { name, value } = e.target;
    setTouched((prev) => ({ ...prev, [name]: true }));
    setErrors((prev) => ({ ...prev, [name]: validateInput(name, value) }));
  };
 
  const handleSignup = async (e) => {
    e.preventDefault();
    const newErrors = validateForm(formData);
 
    
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }
 
    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return;
 
    setIsSubmitting(true);
 
   
    try {
      const { confirmPassword, ...SignupData } = formData; // Exclude confirmPassword before sending
      const response = await axios.post("http://localhost:5000/api/Signup", SignupData);
      alert(response.data.message);
      setPage("Login"); 
    } catch (error) {
      console.error("Error saving data:", error);
      alert("Signup failed!");
    } finally {
      setIsSubmitting(false);
    }
  };
 
  const fields = [
    { name: "name", type: "text", placeholder: "Full Name" },
    { name: "username", type: "text", placeholder: "Username" },
    { name: "email", type: "email", placeholder: "Email Address" },
    { name: "password", type: "password", placeholder: "Password" },
    { name: "confirmPassword", type: "password", placeholder: "Confirm Password" },
    { name: "phone", type: "tel", placeholder: "Phone Number" },
  ];
 
  return (
    <div className="container" style={{ maxWidth: "400px", marginTop: "50px" }}>
      <h2 className="mb-4 text-center">Sign Up</h2>
      <form onSubmit={handleSignup} className="p-3 border rounded shadow bg-white">
        {fields.map(({ name, type, placeholder }) => (
          <div key={name} className="mb-3">
            <Input
              type={type}
              name={name}
              value={formData[name]}
              placeholder={placeholder}
              error={errors[name]}
              onChange={handleChange}
              onBlur={handleBlur}
            />
          </div>
        ))}
        <button type="submit" className="btn btn-success w-100" disabled={isSubmitting}>
          {isSubmitting ? "Signing Up..." : "Sign Up"}
        </button>
      </form>
      <p className="mt-3 text-center">
        Already have an account?{" "}
        <button className="btn btn-link p-0 align-baseline" onClick={() => setPage("Login")}>
          Login
        </button>
      </p>
    </div>
  );
};
 
export default Signup;