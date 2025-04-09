import React, { useState, useEffect } from "react";
import axios from "axios";
import { FaTrash } from "react-icons/fa";
import './departments.css';

const Departments = () => {
  const [departments, setDepartments] = useState([]);
  const [newDepartmentName, setNewDepartmentName] = useState("");
  const [selectedDeptIds, setSelectedDeptIds] = useState([]);
  const [showModal, setShowModal] = useState(false);

  // Fetch departments from the backend when component mounts
 
  useEffect(() => {
    // Fetch departments only once when component mounts
    fetchDepartments();
  }, []);
  
  useEffect(() => {
    // Add or remove class to blur background when modal is toggled
    if (showModal) {
      document.body.classList.add("modal-opened");
    } else {
      document.body.classList.remove("modal-opened");
    }
  }, [showModal]);
  
  const fetchDepartments = () => {
    axios
      .get("http://localhost:5000/departments")
      .then((response) => setDepartments(response.data))
      .catch((error) => console.error("Error fetching departments:", error));
  };

  // Add a new department from modal
  const handleSaveDepartment = () => {
    if (!newDepartmentName.trim()) return;
    axios
      .post("http://localhost:5000/departments", { departmentName: newDepartmentName })
      .then(() => {
        setNewDepartmentName("");
        setShowModal(false);
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

     <button className="btn btn-info mb-3" onClick={() => setShowModal(true)}>
    Add Department
  </button>
  <div className={showModal ? "blur-background" : ""}>

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

      {/* Add Department Modal */}
      {showModal && (
        <div className="modal show fade d-block" tabIndex="-1" role="dialog" style={{ backgroundColor: "rgba(0,0,0,0.5)" }}>
          <div className="modal-dialog" role="document">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Add New Department</h5>
              </div>
              <div className="modal-body">
                <input
                  type="text"
                  className="form-control"
                  placeholder="Enter department name"
                  value={newDepartmentName}
                  onChange={(e) => setNewDepartmentName(e.target.value)}
                />
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => {
                    setShowModal(false);
                    setNewDepartmentName("");
                  }}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={handleSaveDepartment}
                >
                  Save
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Departments;
