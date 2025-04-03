import React, { useState, useEffect, useCallback } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { jwtDecode } from "jwt-decode";
import { FaBars, FaUserCircle, FaPlus, FaMinus } from "react-icons/fa";
import "./LandingPage.css";

const LandingPage = ({ setPage }) => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [selectedView, setSelectedView] = useState(null);
  const [userDetails, setUserDetails] = useState({ username: "", email: "" });
  const [showProfile, setShowProfile] = useState(false);
  const [roles, setRoles] = useState([{ id: "", name: "" }]); // Role management
  const [roleAssignments, setRoleAssignments] = useState([{ id: "", name: "", designation: "" }]); // Role Assignment

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

  // Add a new role row
  const addRole = () => {
    setRoles([...roles, { id: "", name: "" }]);
  };

  // Remove a specific role row
  const removeRole = (index) => {
    setRoles(roles.filter((_, i) => i !== index));
  };

  // Handle Role ID and Name change
  const handleRoleChange = (index, field, value) => {
    const updatedRoles = [...roles];
    updatedRoles[index][field] = value;
    setRoles(updatedRoles);
  };

  // Add a new role assignment row
  const addRoleAssignment = () => {
    setRoleAssignments([...roleAssignments, { id: "", name: "", designation: "" }]);
  };

  // Remove a specific role assignment row
  const removeRoleAssignment = (index) => {
    setRoleAssignments(roleAssignments.filter((_, i) => i !== index));
  };

  // Handle Role Assignment input changes
  const handleRoleAssignmentChange = (index, field, value) => {
    const updatedAssignments = [...roleAssignments];
    updatedAssignments[index][field] = value;
    setRoleAssignments(updatedAssignments);
  };

  return (
    <div className="container">
      {/* Header Section */}
      <header className="header">
        <h2 className="header-title">Office Portal</h2>
        <div className="header-actions">
          {/* Profile Button */}
          <div className="profile-section">
            <FaUserCircle className="profile-icon" onClick={() => setShowProfile(!showProfile)} />
            {showProfile && (
              <div className="profile-dropdown">
                <p><strong>{userDetails.username}</strong></p>
                <p>{userDetails.email}</p>
                <button className="logout-btn" onClick={handleLogout}>Logout</button>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Content Section */}
      <div className="content">
        {/* Sidebar */}
        <div className={`sidebar ${sidebarOpen ? "open" : "closed"}`}>
          <button className="toggle-btn" onClick={() => setSidebarOpen(!sidebarOpen)}>
            <FaBars />
          </button>
          {sidebarOpen && (
            <>
              <button className="btn-sm" onClick={() => setSelectedView("role")}>Role</button>
              <button className="btn-sm" onClick={() => setSelectedView("roleAssignment")}>Role Assignment</button>
            </>
          )}
        </div>

        {/* Main Content */}
        <div className="main-content">
          {selectedView === "role" ? (
            <div className="role-management">
              <h3 className="text-center">Role Management</h3>
              {roles.map((role, index) => (
                <div key={index} className="role-row">
                  <input
                    type="text"
                    placeholder="Role ID"
                    value={role.id}
                    onChange={(e) => handleRoleChange(index, "id", e.target.value)}
                    className="role-input"
                  />
                  <input
                    type="text"
                    placeholder="Role Name"
                    value={role.name}
                    onChange={(e) => handleRoleChange(index, "name", e.target.value)}
                    className="role-input"
                  />
                  <button className="plus-btn" onClick={addRole}>
                    <FaPlus />
                  </button>
                  {roles.length > 1 && (
                    <button className="minus-btn" onClick={() => removeRole(index)}>
                      <FaMinus />
                    </button>
                  )}
                </div>
              ))}
            </div>
          ) : selectedView === "roleAssignment" ? (
            <div className="role-management">
              <h3 className="text-center">Role Assignment</h3>
              {roleAssignments.map((assignment, index) => (
                <div key={index} className="role-row">
                  <input
                    type="text"
                    placeholder="ID"
                    value={assignment.id}
                    onChange={(e) => handleRoleAssignmentChange(index, "id", e.target.value)}
                    className="role-input"
                  />
                  <input
                    type="text"
                    placeholder="Role Name"
                    value={assignment.name}
                    onChange={(e) => handleRoleAssignmentChange(index, "name", e.target.value)}
                    className="role-input"
                  />
                  <input
                    type="text"
                    placeholder="Designation"
                    value={assignment.designation}
                    onChange={(e) => handleRoleAssignmentChange(index, "designation", e.target.value)}
                    className="role-input"
                  />
                  <button className="plus-btn" onClick={addRoleAssignment}>
                    <FaPlus />
                  </button>
                  {roleAssignments.length > 1 && (
                    <button className="minus-btn" onClick={() => removeRoleAssignment(index)}>
                      <FaMinus />
                    </button>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <h3 className="text-center">Welcome to Office Management Dashboard</h3>
          )}
        </div>
      </div>

      {/* Footer Section */}
      <footer className="footer">
        <p>&copy; 2025 Office Portal. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default LandingPage;
