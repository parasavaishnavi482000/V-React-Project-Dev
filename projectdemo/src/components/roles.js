import React, { useState, useEffect } from "react";
import axios from "axios";
import { FaTrash } from "react-icons/fa";
 
const Roles = () => {
  const [roles, setRoles] = useState([]);
  const [newRoleName, setNewRoleName] = useState("");
  const [selectedRoleIds, setSelectedRoleIds] = useState([]);
 
  // Fetch roles from the backend
  useEffect(() => {
    fetchRoles();
  }, []);
 
  const fetchRoles = () => {
    axios
      .get("http://localhost:5000/roles")
      .then((response) => setRoles(response.data))
      .catch((error) => console.error("Error fetching roles:", error));
  };
 
  // Add a new role
  const handleAddRole = (e) => {
    e.preventDefault();
    if (!newRoleName.trim()) return;
    axios
      .post("http://localhost:5000/roles", { roleName: newRoleName })
      .then((response) => {
        setNewRoleName("");
        fetchRoles();
      })
      .catch((error) => console.error("Error adding role:", error));
  };
 
  // Delete a single role
  const handleDeleteRole = (roleId) => {
    axios
      .delete(`http://localhost:5000/roles/${roleId}`)
      .then(() => fetchRoles())
      .catch((error) => {
        console.error("Error deleting role:", error);
        alert("This role may be assigned to an employee and cannot be deleted.");
      });
  };
 
  // Handle checkbox change for bulk deletion
  const handleCheckboxChange = (roleId, checked) => {
    if (checked) {
      setSelectedRoleIds([...selectedRoleIds, roleId]);
    } else {
      setSelectedRoleIds(selectedRoleIds.filter((id) => id !== roleId));
    }
  };
 
  // Bulk delete selected roles
  const handleBulkDelete = () => {
    Promise.all(
      selectedRoleIds.map((id) =>
        axios.delete(`http://localhost:5000/roles/${id}`)
      )
    )
      .then(() => {
        setSelectedRoleIds([]);
        fetchRoles();
      })
      .catch((error) => {
        console.error("Error bulk deleting roles:", error);
        alert("Some roles may be assigned and cannot be deleted.");
      });
  };
 
  return (
    <div className="container mt-4 p-4 rounded shadow" style={{ backgroundColor: "#f8f9fa" }}>
  <h3 className="text-center mb-4">Roles Management</h3>
 
      {/* Create Role Form */}
      <form className="mb-4" onSubmit={handleAddRole}>
        <div className="mb-3">
         <input
            type="text"
            id="roleName"
            className="form-control"
            placeholder="Role Name"
            value={newRoleName}
            onChange={(e) => setNewRoleName(e.target.value)}
          />
        </div>
        <button type="submit" className="btn btn-info">Add </button>
      </form>
 
      {/* Roles Table */}
      <table className="table table-bordered table-striped table-hover bg-white">
        <thead className="thead-dark">
          <tr>
            <th style={{ width: "5%" }}>
              <input
                type="checkbox"
                onChange={(e) => {
                  if (e.target.checked) {
                    setSelectedRoleIds(roles.map((role) => role.roleID));
                  } else {
                    setSelectedRoleIds([]);
                  }
                }}
                checked={roles.length > 0 && selectedRoleIds.length === roles.length}
              />
            </th>
            <th>Role Name</th>
            <th style={{ width: "15%" }}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {roles.map((role) => (
            <tr key={role.roleID}>
              <td>
                <input
                  type="checkbox"
                  onChange={(e) => handleCheckboxChange(role.roleID, e.target.checked)}
                  checked={selectedRoleIds.includes(role.roleID)}
                />
              </td>
              <td>{role.roleName}</td>
              <td>
                <button className="btn btn-danger btn-sm" onClick={() => handleDeleteRole(role.roleID)}>
                  <FaTrash />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
 
      {selectedRoleIds.length > 0 && (
        <button className="btn btn-danger" onClick={handleBulkDelete}>
          Delete Selected
        </button>
      )}
    </div>
  );
};
 
export default Roles;
 
 