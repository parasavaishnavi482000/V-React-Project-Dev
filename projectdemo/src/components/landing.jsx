import React, { useState, useEffect, useCallback } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { jwtDecode } from "jwt-decode";
import { FaBars, FaUserCircle, FaPlus, FaMinus, FaSearch, FaCog } from "react-icons/fa"; // Added icons

const LandingPage = ({ setPage }) => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [selectedView, setSelectedView] = useState(null);
  const [userDetails, setUserDetails] = useState({ username: "", email: "" });
  const [showProfile, setShowProfile] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [roles, setRoles] = useState([{ id: "", name: "" }]);
  const [roleAssignments, setRoleAssignments] = useState([{ assignment_id: "",  designation: "" }]);
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

  // Load roles from localStorage
useEffect(() => {
  const storedRoles = localStorage.getItem("roles");
  if (storedRoles) {
    setRoles(JSON.parse(storedRoles));
  }
}, []);

// Save roles to localStorage on change
useEffect(() => {
  localStorage.setItem("roles", JSON.stringify(roles));
}, [roles]);


  const handleRoleChange = (index, field, value) => {
    const updatedRoles = [...roles];
    updatedRoles[index][field] = value;
    setRoles(updatedRoles);
  };

  const handleRoleAssignmentChange = (index, field, value) => {
    const updatedAssignments = [...roleAssignments];
    updatedAssignments[index][field] = value;
    setRoleAssignments(updatedAssignments);
  };

  return (
    <div
      className="d-flex flex-column min-vh-100"
      style={{
        backgroundImage: "url('/office-bg.jpg')",
        backgroundSize: "cover",
        backgroundRepeat: "no-repeat",
        backgroundPosition: "center",
      }}
      >
      {/* Header */}
      <header className="bg-dark text-white p-2 d-flex justify-content-between align-items-center ">
  <h2 className="m-0">Office Portal</h2>
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

    {/* Settings Icon */}
    <FaCog
      size={24}
      style={{ cursor: "pointer" }}
      onClick={() => {
        setShowProfile(false);
        setShowSettings((prev) => !prev);
      }}
    />

    {/* Profile Icon */}
    <FaUserCircle
      size={28}
      style={{ cursor: "pointer" }}
      onClick={() => {
        setShowSettings(false);
        setShowProfile((prev) => !prev);
      }}
    />

    {/* Profile Dropdown */}
    {showProfile && (
      <div className="position-absolute top-100 end-0 bg-white text-dark p-3 mt-2 rounded shadow" style={{ minWidth: "200px", zIndex: 10 }}>
        <p className="mb-1"><strong>Username:</strong> {userDetails.username}</p>
        <p className="mb-1"><strong>Email:</strong> {userDetails.email}</p>
        <button className="btn btn-sm btn-outline-danger mt-2" onClick={handleLogout}>
          Logout
        </button>
      </div>
    )}

    {/* Settings Dropdown */}
    {showSettings && (
      <div className="position-absolute top-100 end-0 bg-white text-dark p-3 mt-2 rounded shadow" style={{ minWidth: "250px", zIndex: 10 }}>
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
      <div className="d-flex flex-grow-1">
        {/* Sidebar */}
        <div className={`bg-secondary text-white p-3 ${sidebarOpen ? "w-25" : "w-auto"} transition`}>
          <button className="btn btn-outline-light mb-3" onClick={() => setSidebarOpen(!sidebarOpen)}>
            <FaBars />
          </button>
          {sidebarOpen && (
            <>
              <button className="btn btn-light d-block w-100 mb-2" onClick={() => setSelectedView("role")}>
                Role
              </button>
              <button className="btn btn-light d-block w-100 mb-2" onClick={() => setSelectedView("roleAssignment")}>
                Role Assignment
              </button>
              <button className="btn btn-light d-block w-100 mb-2" onClick={() => setSelectedView("settings")}>
               Settings
              </button>
              <button className="btn btn-light d-block w-100" onClick={() => setSelectedView("about")}>
              About
             </button>
            </>
          )}
        </div>

        {/* Content */}
        <div className="flex-grow-1 p-4">
          {selectedView === "role" ? (
            <div className="bg-white p-4 shadow rounded">
              <h3 className="text-center">Role Management</h3>
              {roles
  .filter((role) =>
    role.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    role.name.toLowerCase().includes(searchTerm.toLowerCase())
  )
  .map((role, index) => (

                <div key={index} className="d-flex align-items-center gap-2 mb-2">
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Role ID"
                    value={role.id}
                    onChange={(e) => handleRoleChange(index, "id", e.target.value)}
                  />
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Role Name"
                    value={role.name}
                    onChange={(e) => handleRoleChange(index, "name", e.target.value)}
                  />
                  <button className="btn btn-primary" onClick={() => setRoles([...roles, { id: "", name: "" }])}>
                    <FaPlus />
                  </button>
                  {roles.length > 1 && (
                    <button className="btn btn-danger" onClick={() => setRoles(roles.filter((_, i) => i !== index))}>
                      <FaMinus />
                    </button>
                  )}
                </div>
              ))}
            </div>
          ) : selectedView === "roleAssignment" ? (
            <div className="bg-white p-4 shadow rounded">
              <h3 className="text-center">Role Assignment</h3>
              {roleAssignments
  .filter((assignment) =>
    assignment.assignment_id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    assignment.designation.toLowerCase().includes(searchTerm.toLowerCase())
  )
  .map((assignment, index) => (

                <div key={index} className="d-flex align-items-center gap-2 mb-2">
                  <input
                    type="text"
                    className="form-control"
                    placeholder="assignment_id"
                    value={assignment.assignment_id}
                    onChange={(e) => handleRoleAssignmentChange(index, "assignment_id", e.target.value)}
                  />
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Designation"
                    value={assignment.designation}
                    onChange={(e) => handleRoleAssignmentChange(index, "designation", e.target.value)}
                  />
                  <button
                    className="btn btn-primary"
                    onClick={() =>
                      setRoleAssignments([...roleAssignments, { id: "", name: "", designation: "" }])
                    }
                  >
                    <FaPlus />
                  </button>
                  {roleAssignments.length > 1 && (
                    <button
                      className="btn btn-danger"
                      onClick={() => setRoleAssignments(roleAssignments.filter((_, i) => i !== index))}
                    >
                      <FaMinus />
                    </button>
                  )}
                </div>
              ))}
            </div>
          ) : selectedView === "settings" ? (
            <div className="bg-white p-4 shadow rounded">
    <h3 className="text-center">Settings</h3>
    <p>Manage your preferences and account settings here.</p>
    {/* You can even reuse the same settings input fields from header if needed */}
  </div>
) : selectedView === "about" ? (
  <div className="bg-white p-4 shadow rounded">
    <h3 className="text-center">About</h3>
    <p>This portal is designed to manage office roles and assignments.</p>
    <p>Version: 1.0.0</p>
    <p>Developed by: Vaishu ✨</p>
  </div>
) : (
  <h3 className="text-center">Welcome to Office Management Dashboard</h3>
)}
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-dark text-white text-center p-3 mt-auto">
        &copy; 2025 Office Portal. All rights reserved.
      </footer>
    </div>
  );
};

export default LandingPage;
