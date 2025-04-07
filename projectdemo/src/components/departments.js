import React, { useState, useEffect } from "react";
import axios from "axios";
import { FaTrash } from "react-icons/fa";
 
const Departments = () => {
  const [departments, setDepartments] = useState([]);
  const [newDepartmentName, setNewDepartmentName] = useState("");
  const [selectedDeptIds, setSelectedDeptIds] = useState([]);
 
  // Fetch departments from the backend when component mounts
  useEffect(() => {
    fetchDepartments();
  }, []);
 
  const fetchDepartments = () => {
    axios
      .get("http://localhost:5000/departments")
      .then((response) => setDepartments(response.data))
      .catch((error) => console.error("Error fetching departments:", error));
  };
 
  // Add a new department
  const handleAddDepartment = (e) => {
    e.preventDefault();
    if (!newDepartmentName.trim()) return;
    axios
      .post("http://localhost:5000/departments", { departmentName: newDepartmentName })
      .then((response) => {
        setNewDepartmentName("");
        fetchDepartments();
      })
      .catch((error) => console.error("Error adding department:", error));
  };
 
  // Delete a single department
  const handleDeleteDepartment = (id) => {
    axios
      .delete(`http://localhost:5000/departments/${id}`)
      .then(() => fetchDepartments())
      .catch((error) => {
        console.error("Error deleting department:", error);
        alert("This department may be assigned to an employee and cannot be deleted.");
      });
  };
 
  // Handle checkbox change for bulk deletion
  const handleCheckboxChange = (id, checked) => {
    if (checked) {
      setSelectedDeptIds([...selectedDeptIds, id]);
    } else {
      setSelectedDeptIds(selectedDeptIds.filter((deptId) => deptId !== id));
    }
  };
 
  // Bulk delete selected departments
  const handleBulkDelete = () => {
    Promise.all(
      selectedDeptIds.map((id) =>
        axios.delete(`http://localhost:5000/departments/${id}`)
      )
    )
      .then(() => {
        setSelectedDeptIds([]);
        fetchDepartments();
      })
      .catch((error) => {
        console.error("Error bulk deleting departments:", error);
        alert("Some departments may be assigned and cannot be deleted.");
      });
  };
 
  return (
    <div className="container mt-4 p-4 rounded shadow" style={{ backgroundColor: "#f8f9fa" }}>
  <h3 className="text-center mb-4">Departments Management</h3>
 
      {/* Create Department Form */}
      <form className="mb-4" onSubmit={handleAddDepartment}>
        <div className="mb-3">
           <input
            type="text"
            id="departmentName"
            className="form-control"
            placeholder=" Department name"
            value={newDepartmentName}
            onChange={(e) => setNewDepartmentName(e.target.value)}
          />
        </div>
        <button type="submit" className="btn btn-info">Add </button>
      </form>
 
      {/* Departments Table */}
      <table className="table table-bordered table-striped table-hover bg-white">
      <thead className="thead-dark">
          <tr>
            <th style={{ width: "5%" }}>
              <input
                type="checkbox"
                onChange={(e) => {
                  if (e.target.checked) {
                    setSelectedDeptIds(departments.map((dept) => dept.departmentID));
                  } else {
                    setSelectedDeptIds([]);
                  }
                }}
                checked={departments.length > 0 && selectedDeptIds.length === departments.length}
              />
            </th>
            <th>Department Name</th>
            <th style={{ width: "15%" }}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {departments.map((dept) => (
            <tr key={dept.departmentID}>
              <td>
                <input
                  type="checkbox"
                  onChange={(e) => handleCheckboxChange(dept.departmentID, e.target.checked)}
                  checked={selectedDeptIds.includes(dept.departmentID)}
                />
              </td>
              <td>{dept.departmentName}</td>
              <td>
                <button className="btn btn-danger btn-sm" onClick={() => handleDeleteDepartment(dept.departmentID)}>
                  <FaTrash />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
 
      {selectedDeptIds.length > 0 && (
        <button className="btn btn-danger" onClick={handleBulkDelete}>
          Delete Selected
        </button>
      )}
    </div>
  );
};
 
export default Departments;
 
 
 