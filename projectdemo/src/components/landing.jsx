import React, { useState, useEffect, useCallback } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import { jwtDecode } from "jwt-decode";
import { FaSearch, FaCog, FaUserCircle } from "react-icons/fa";
import Roles from "./roles";
import RoleAssign from "./roleassign";
import Departments from "./departments";
import bootstrap from "bootstrap/dist/js/bootstrap.bundle.min.js";
import './landing.css';

const LandingPage = ({ setPage }) => {
  const [selectedView, setSelectedView] = useState("home");
  const [userDetails, setUserDetails] = useState({ username: "", email: "" });
  const [showProfileInfo, setShowProfileInfo] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [animationKey, setAnimationKey] = useState(0);

  const handleLogout = useCallback(() => {
    localStorage.removeItem("token");
    setPage("login");
  }, [setPage]);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return setPage("login");

    try {
      const decodedToken = jwtDecode(token);
      if (decodedToken.exp < Math.floor(Date.now() / 1000)) handleLogout();
      else setUserDetails({ username: decodedToken.username, email: decodedToken.email });
    } catch (error) {
      console.error("Error decoding token:", error);
      handleLogout();
    }
  }, [handleLogout, setPage]);

  return (
    <div className="d-flex flex-column min-vh-100 landing-container"
      style={{
        backgroundImage: "url('/office-bg.jpg')",
        backgroundSize: "cover",
        backgroundRepeat: "no-repeat",
        backgroundPosition: "center"
      }}>
    
      {/* Header */}
      <header className="bg-dark text-white p-2 d-flex justify-content-between align-items-center">
        <div className="d-flex align-items-center gap-3">
          <button className="btn btn-outline-light"
            onClick={() => {
              const sidebar = document.getElementById("offcanvasSidebar");
              bootstrap.Offcanvas.getOrCreateInstance(sidebar).toggle();
            }}>
            <i className="bi bi-list fs-4"></i>
          </button>
          <h2 className="m-0">Office Portal <i className="bi bi-circle-square"></i></h2>
        </div>

        <div className="d-flex align-items-center gap-3 position-relative">
          {/* Search */}
          <div className="input-group">
            <span className="input-group-text bg-white"><FaSearch /></span>
            <input
              type="text"
              className="form-control"
              placeholder="Search..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          {/* Refresh */}
          <button className="btn btn-outline-light" title="Refresh" onClick={() => {
            setSelectedView("home");
            setAnimationKey(prev => prev + 1);
          }}>
            <i className="bi bi-arrow-clockwise fs-5"></i>
          </button>

          {/* Settings/Profile Icons */}
          <FaCog size={24} style={{ cursor: "pointer" }} onClick={() => {
            setShowProfileInfo(false);
            setShowSettings(prev => !prev);
          }} />

          {/* profile icon hover */}
        <FaUserCircle
  size={28}
  style={{ cursor: "pointer" }}
  data-bs-toggle="tooltip"
  title={userDetails.username}
  onClick={() => {
    setShowSettings(false);
    setShowProfileInfo((prev) => !prev);
  }}
/>


          {/* Profile Box */}
          {showProfileInfo && (
            <div className="position-absolute top-100 end-0 bg-white text-dark p-3 mt-2 rounded shadow profile-info-box"
              style={{ minWidth: "200px", zIndex: 10 }}>
              <p className="mb-1"><strong>Username:</strong> {userDetails.username}</p>
              <p className="mb-1"><strong>Email:</strong> {userDetails.email}</p>
              <button className="btn btn-sm btn-outline-danger mt-2" onClick={handleLogout}>Logout</button>
            </div>
          )}

          {/* Settings Box */}
          {showSettings && (
            <div className="position-absolute top-100 end-0 bg-white text-dark p-3 mt-2 rounded shadow"
              style={{ minWidth: "250px", zIndex: 10 }}>
              <h6 className="text-center">Edit Profile</h6>
              <div className="mb-2">
                <label className="form-label">Username</label>
                <input type="text" className="form-control"
                  value={userDetails.username}
                  onChange={(e) => setUserDetails({ ...userDetails, username: e.target.value })}
                />
              </div>
              <div className="mb-2">
                <label className="form-label">Email</label>
                <input type="email" className="form-control"
                  value={userDetails.email}
                  onChange={(e) => setUserDetails({ ...userDetails, email: e.target.value })}
                />
              </div>
              <button className="btn btn-sm btn-primary w-100">Save Changes</button>
            </div>
          )}
        </div>
      </header>

      {/* Main Content */}
      <div className="flex-grow-1 p-4">
        {/* Sidebar */}
        <div className="offcanvas offcanvas-start text-bg-dark" tabIndex="-1" id="offcanvasSidebar"
          aria-labelledby="offcanvasSidebarLabel" style={{ width: "220px" }}>
          <div className="offcanvas-header">
            <h5 className="offcanvas-title" id="offcanvasSidebarLabel">Menu</h5>
            <button type="button" className="btn-close btn-close-white" data-bs-dismiss="offcanvas" aria-label="Close"></button>
          </div>
          <div className="offcanvas-body d-flex flex-column gap-3 px-2">
            {[
              { label: "Home", icon: "people-fill", view: "home" },
              { label: "Role", icon: "people-fill", view: "role" },
              { label: "Departments", icon: "diagram-3-fill", view: "departments" },
              { label: "Role Assignment", icon: "person-plus-fill", view: "roleAssignment" }
            ].map(({ label, icon, view }) => (
              <button key={view}
                className="btn btn-outline-light d-flex align-items-center gap-2"
                onClick={() => setSelectedView(view)} data-bs-dismiss="offcanvas">
                <i className={`bi bi-${icon}`}></i> {label}
              </button>
            ))}
          </div>
        </div>

        {/* Dynamic Views */}
        <div className="content-area">
          {selectedView === "home" && (
            <div key={animationKey} className="container-fluid p-4">
              {/* Hero Section */}
              <div className="row mb-4 align-items-center bg-light rounded-5 p-4 backline-style">
                <div className="col-md-6 animate-slide-left">
                  <h1 className="display-5 fw-bold">Welcome to Circle Square</h1>
                  <p className="lead">Simplifying your office experience with smart role and department management.</p>
                </div>
                <div className="col-md-6 text-center animate-from-right">
  <div className="ratio ratio-16x9 rounded overflow-hidden shadow disable-interaction">
    <iframe 
      title="YouTube welcome video"
      src="https://www.youtube.com/embed/k2maqlyUuVw?autoplay=1&mute=1&loop=1&playlist=k2maqlyUuVw&controls=0&showinfo=0&modestbranding=1"
      allow="autoplay; encrypted-media"
      allowFullScreen
    ></iframe>
  </div>
</div>
</div>

              {/* Info Section */}
              <div className="row align-items-center my-5">
                <div className="col-md-6 text-center order-md-2">
                  <p className="animate-from-right fs-5 px-3">
                    Efficiently assign roles, manage departments, and bring your organization together under one portal.
                  </p>
                </div>
                <div className="col-md-6 text-center animate-from-right">
  <div className="ratio ratio-16x9 rounded overflow-hidden shadow disable-interaction">
    <iframe 
      title="YouTube welcome video"
      src="https://www.youtube.com/embed/eTwC5VMM3CA?autoplay=1&mute=1&loop=1&playlist=eTwC5VMM3CA&controls=0&showinfo=0&modestbranding=1"
      allow="autoplay; encrypted-media"
      allowFullScreen
    ></iframe>
  </div>
</div>

      </div>

              {/* Cards Section */}
              <div className="row g-3 my-4">
                <div className="col-md-4 offset-md-1">
                  <div className="card shadow border-0 h-150 p-3">
                    <img src="/role-management.jpg" alt="Role" className="img-fluid rounded" style={{ maxHeight: "300px", objectFit: "cover" }} />
                    <h5 className="mt-3">Role Management</h5>
                    <p>Assign, edit and customize roles for various user levels in your system easily.</p>
                    <br />
                    <div className="symbols-large animate-slide-left">♔ ♕ ♖ ♖ ♘ ♙ ♚ ♤ </div>
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="card shadow border-0 h-100 p-3">
                    <img src="/chess.jpg" alt="Department" className="img-fluid rounded" style={{ maxHeight: "700px", objectFit: "cover" }} />
                    <h5 className="mt-4">Department Structuring</h5>
                    <p>Group users into departments and manage their hierarchy and responsibilities.</p>
                  </div>
                </div>
              </div>

              {/* Zig-Zag */}
              <div className="row my-5">
                <div className="col-md-6">
                  <div className="bg-light p-4 rounded shadow-sm h-100 d-flex align-items-center gap-3">
                    <img src="/quick-assign.jpg" alt="Quick Assign" style={{ width: "400px", height: "300px" }} />
                    <div>
                      <h4 className="fw-semibold">Quick Role Assignment</h4>
                      <p className="mb-0">Add or assign roles instantly. Changes are reflected across the system immediately.</p>
                    </div>
                  </div>
                </div>
                <div className="col-md-4 mt-3 mt-md-0">
                  <div className="bg-white border-start border-5 border-primary p-4 rounded shadow-sm h-100 d-flex align-items-center gap-3">
                    <img src="/dashboard-stats.jpg" alt="Dashboard" style={{ width: "300px", height: "150px" }}   />
                    <div>
                      <h4 className="text-large animate-slide-left fw-semibold">Activity Dashboard</h4>
                      <p className="text-large animate-slide-left mb-0">Visual insights into user access, departments, and role changes.</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Announcement */}
              <div className="row mt-5">
                <div className="col-md-12">
                  <div className="p-4 shadow rounded text-dark" style={{
                    background: "linear-gradient(135deg, #e0c3fc, #8ec5fc)",
                    borderRadius: "20px"
                  }}>
                    <h4 className="fw-bold mb-3">🚀 What's New at Circle Square?</h4>
                    <ul className="list-unstyled text-start mx-auto" style={{ maxWidth: "600px", fontSize: "1.1rem" }}>
                      <li>🌙 <strong>Dark Mode</strong> support is on the way.</li>
                      <li>📊 <strong>Profile Analytics</strong> to track changes.</li>
                      <li>🧪 <strong>Beta Features</strong> for early access.</li>
                      <li>🔔 <strong>Smart Notifications</strong> coming soon.</li>
                    </ul>
                    <p className="mt-3 fst-italic">Made by Vaishnavi — bringing better features, one step at a time! </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {selectedView === "role" && <Roles />}
          {selectedView === "roleAssignment" && <RoleAssign />}
          {selectedView === "departments" && <Departments />}
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-dark text-white text-center p-3 fixed-bottom">
         &copy; 2025 Circle Square. All rights reserved.
      </footer>
    </div>
  );
};

export default LandingPage;
