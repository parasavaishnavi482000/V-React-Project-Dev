import React, { useState, useEffect, useCallback } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import { jwtDecode } from "jwt-decode";
import { FaSearch, FaCog, FaUserCircle } from "react-icons/fa";
import Roles from "./roles";
import RoleAssign from "./roleassign";
import Departments from "./departments";
import bootstrap from "bootstrap/dist/js/bootstrap.bundle.min.js";

 
const LandingPage = ({ setPage }) => {
  const [selectedView, setSelectedView] = useState("home");
  const [userDetails, setUserDetails] = useState({ username: "", email: "" });
  const [showProfileInfo, setShowProfileInfo] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
 
  const handleLogout = useCallback(() => {
    localStorage.removeItem("token");
    setPage("login");
  }, [setPage]);
 
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return setPage("login");
 
    try {
      const decodedToken = jwtDecode(token);
      const currentTime = Math.floor(Date.now() / 1000);
      if (decodedToken.exp < currentTime) {
        handleLogout();
      } else {
        setUserDetails({ username: decodedToken.username, email: decodedToken.email });
      }
    } catch (error) {
      console.error("Error decoding token:", error);
      handleLogout();
    }
  }, [handleLogout, setPage]);
 
  return (
    <div
      className="d-flex flex-column min-vh-100 landing-container"
      // Note: Update the image path as needed (it's recommended to place images in the public folder)
      style={{
        backgroundImage: "url('/office-bg.jpg')",
        backgroundSize: "cover",
        backgroundRepeat: "no-repeat",
        backgroundPosition: "center",
      }}
    >
   <header className="bg-dark text-white p-2 d-flex justify-content-between align-items-center">
  <div className="d-flex align-items-center gap-3">
    {/* Sidebar Toggle Button */}
    <button
      className="btn btn-outline-light"
      onClick={() => {
        const sidebar = document.getElementById("offcanvasSidebar");
        const bsSidebar = bootstrap.Offcanvas.getOrCreateInstance(sidebar);
        bsSidebar.toggle();
      }}
    >
      <i className="bi bi-list" style={{ fontSize: "1.5rem" }}></i>
    </button>

    <h2 className="m-0">Office Portal <i className="bi bi-circle-square"></i></h2>
  </div>

  <div className="d-flex align-items-center gap-3 position-relative">
    {/* Search */}
    <div className="input-group">
      <span className="input-group-text bg-white">
        <FaSearch />
      </span>
      <input
        type="text"
        className="form-control"
        placeholder="Search..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
    </div>
    <div className="d-flex align-items-center gap-3 position-relative">
    {/* 🔄 Refresh Button */}
    <button
      className="btn btn-outline-light"
      title="Refresh"
      onClick={() => setSelectedView("home")}
    >
      <i className="bi bi-arrow-clockwise" style={{ fontSize: "1.3rem" }}></i>
    </button>
    </div>

    {/* Settings Icon */}
    <FaCog
      size={24}
      style={{ cursor: "pointer" }}
      onClick={() => {
        setShowProfileInfo(false);
        setShowSettings((prev) => !prev);
      }}
    />

    {/* Profile Icon */}
    <FaUserCircle
      size={28}
      style={{ cursor: "pointer" }}
      onClick={() => {
        setShowSettings(false);
        setShowProfileInfo((prev) => !prev);
      }}
    />

    {/* Profile Dropdown */}
    {showProfileInfo && (
      <div
        className="position-absolute top-100 end-0 bg-white text-dark p-3 mt-2 rounded shadow profile-info-box"
        style={{ minWidth: "200px", zIndex: 10 }}
      >
        <p className="mb-1"><strong>Username:</strong> {userDetails.username}</p>
        <p className="mb-1"><strong>Email:</strong> {userDetails.email}</p>
        <button className="btn btn-sm btn-outline-danger mt-2" onClick={handleLogout}>
          Logout
        </button>
      </div>
    )}

    {/* Settings Dropdown */}
    {showSettings && (
      <div
        className="position-absolute top-100 end-0 bg-white text-dark p-3 mt-2 rounded shadow"
        style={{ minWidth: "250px", zIndex: 10 }}
      >
        <h6 className="text-center">Edit Profile</h6>
        <div className="mb-2">
          <label className="form-label">Username</label>
          <input
            type="text"
            className="form-control"
            value={userDetails.username}
            onChange={(e) => setUserDetails({ ...userDetails, username: e.target.value })}
          />
        </div>
        <div className="mb-2">
          <label className="form-label">Email</label>
          <input
            type="email"
            className="form-control"
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
        {/* Offcanvas Sidebar */}
        <div
          className="offcanvas offcanvas-start text-bg-dark"
          tabIndex="-1"
          id="offcanvasSidebar"
          aria-labelledby="offcanvasSidebarLabel"
          style={{ width: "220px" }}
        >
          <div className="offcanvas-header">
            <h5 className="offcanvas-title" id="offcanvasSidebarLabel">Menu</h5>
            <button
              type="button"
              className="btn-close btn-close-white"
              data-bs-dismiss="offcanvas"
              aria-label="Close"
            ></button>
          </div>
          <div className="offcanvas-body d-flex flex-column gap-3 px-2">
  <button className="btn btn-outline-light d-flex align-items-center gap-2" onClick={() => setSelectedView("role")} data-bs-dismiss="offcanvas">
    <i className="bi bi-people-fill"></i> Role
  </button>
  <button className="btn btn-outline-light d-flex align-items-center gap-2" onClick={() => setSelectedView("roleAssignment")} data-bs-dismiss="offcanvas">
    <i className="bi bi-person-plus-fill"></i> Role Assignment
  </button>
  <button className="btn btn-outline-light d-flex align-items-center gap-2" onClick={() => setSelectedView("departments")} data-bs-dismiss="offcanvas">
    <i className="bi bi-diagram-3-fill"></i> Departments
  </button>
</div>

        </div>
 
        {/* Content Area */}
        <div className="content-area">
          {selectedView === "home" && (
            <div className="welcome-message text-center p-5 text-white">
              <h1>Welcome to Cirlce Square</h1>
              </div>
          )}
          {selectedView === "role" && <Roles />}
          {selectedView === "roleAssignment" && <RoleAssign />}
          {selectedView === "departments" && <Departments />}
          {selectedView === "settings" && (
            <div className="bg-white p-4 shadow rounded">
              
            </div>
          )}
          {selectedView === "about" && (
            <div className="bg-white p-4 shadow rounded">
              
            </div>
          )}
        </div>
      </div>
 
      {/* Footer */}
      <footer className="bg-dark text-white text-center p-3 mt-auto">
        &copy; 2025 Circle Square. All rights reserved.
      </footer>
    </div>
  );
};
 
export default LandingPage;
 
 