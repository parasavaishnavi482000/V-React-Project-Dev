import React, { useState, useEffect } from "react";
import axios from "axios";
import { FaSave } from "react-icons/fa";
 
const RoleAssign = () => {
  const [employees, setEmployees] = useState([]);
  const [roles, setRoles] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedEmployees, setSelectedEmployees] = useState([]);

 
  // Fetch login data, roles, and departments
  useEffect(() => {
    axios
      .get("http://localhost:5000/role-assign")
      .then((res) => setEmployees(res.data))
      .catch((err) => console.error("Error fetching employees:", err));
 
    axios
      .get("http://localhost:5000/roles")
      .then((res) => setRoles(res.data))
      .catch((err) => console.error("Error fetching roles:", err));
 
    axios
      .get("http://localhost:5000/departments")
      .then((res) => setDepartments(res.data))
      .catch((err) => console.error("Error fetching departments:", err));
  }, []);
 
  const handleRoleChange = (id, newRole) => {
    setEmployees((prev) =>
      prev.map((emp) => (emp.id === id ? { ...emp, roleName: newRole } : emp))
    );
  };

  const toggleEmployeeSelection = (id) => {
    setSelectedEmployees((prevSelected) =>
      prevSelected.includes(id)
        ? prevSelected.filter((empId) => empId !== id)
        : [...prevSelected, id]
    );
  };
  
 
  const handleDepartmentChange = (id, newDept) => {
    setEmployees((prev) =>
      prev.map((emp) => (emp.id === id ? { ...emp, department: newDept } : emp))
    );
  };
 
  const handleUpdate = (id) => {
    const emp = employees.find((e) => e.id === id);
    axios
      .put(`http://localhost:5000/role-assign/${id}`, {
        roleName: emp.roleName,
        department: emp.department,
      })
      .then(() => alert("Employee updated successfully!"))
      .catch((err) => {
        console.error("Error updating employee:", err);
        alert("Update failed.");
      });
  };
 
  return (
    <div className="container mt-4">
      <h3 className="text-center mb-4">Role Assignment</h3>
 
      <div className="mb-3">
        <input
          type="text"
          className="form-control"
          placeholder="Search employee..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
 
      <table className="table table-bordered">
        <thead className="thead-dark">
          <tr>
          <th style={{ width: "5%" }}>
            <input
                type="checkbox"
                onChange={(e) => {
                if (e.target.checked) {
                    setSelectedEmployees(employees.map((emp) => emp.id));
                } else {
                    setSelectedEmployees([]);
                }
                }}
                checked={selectedEmployees.length === employees.length && employees.length > 0}
            />
            </th>
            <th>Employee Name / Email</th>
            <th>Role</th>
            <th>Department</th>
            <th style={{ width: "10%" }}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {employees
            .filter(
              (emp) =>
                emp.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
                emp.email.toLowerCase().includes(searchTerm.toLowerCase())
            )
            .map((emp) => (
              <tr key={emp.id}>
               <td>
                        <input
                type="checkbox"
                checked={selectedEmployees.includes(emp.id)}
                onChange={() => toggleEmployeeSelection(emp.id)}
                />
                </td>
                <td>
                  <input
                    type="text"
                    className="form-control"
                    value={`${emp.username} / ${emp.email}`}
                    disabled
                  />
                </td>
                <td>
                  <select
                    className="form-control"
                    value={emp.roleName || ""}
                    onChange={(e) => handleRoleChange(emp.id, e.target.value)}
                  >
                    <option value="">Select Role</option>
                    {roles.map((role) => (
                      <option key={role.roleID} value={role.roleName}>
                        {role.roleName}
                      </option>
                    ))}
                  </select>
                </td>
                <td>
                  <select
                    className="form-control"
                    value={emp.department || ""}
                    onChange={(e) =>
                      handleDepartmentChange(emp.id, e.target.value)
                    }
                  >
                    <option value="">Select Department</option>
                    {departments.map((dept) => (
                      <option
                        key={dept.departmentID}
                        value={dept.departmentName}
                      >
                        {dept.departmentName}
                      </option>
                    ))}
                  </select>
                </td>
                <td>
                  <button
                    className="btn btn-success btn-sm"
                    onClick={() => handleUpdate(emp.id)}
                  >
                    <FaSave /> Update
                  </button>
                </td>
              </tr>
            ))}
        </tbody>
      </table>
    </div>
  );
};
 
export default RoleAssign;