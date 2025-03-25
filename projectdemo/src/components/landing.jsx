import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
 
const Table = ({ headers, data, rowRenderer }) => (
  <table className="table table-bordered table-striped">
    <thead className="thead-dark">
      <tr>
        {headers.map((header, idx) => (
          <th key={idx}>{header}</th>
        ))}
      </tr>
    </thead>
    <tbody>{data.map(rowRenderer)}</tbody>
  </table>
);
 
const LandingPage = ({ setPage }) => {
  const [employeeDetails, setEmployeeDetails] = useState([]);
  const [selectedView, setSelectedView] = useState(null);
  const [userDetails, setUserDetails] = useState({ username: "", email: "", phone: "" });
  const [newEmployee, setNewEmployee] = useState({ name: "", department: "", email: "", phone: "", address: "" });
 
  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem("userDetails"));
    if (userData) setUserDetails(userData);
  }, []);
 
  const handleLogout = () => {
    localStorage.removeItem("userDetails");
    setPage("Login");
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewEmployee({ ...newEmployee, [name]: value });
  };

  const addEmployee = () => {
    if (newEmployee.name && newEmployee.department && newEmployee.email && newEmployee.phone && newEmployee.address) {
      setEmployeeDetails([...employeeDetails, { id: employeeDetails.length + 1, ...newEmployee }]);
      setNewEmployee({ name: "", department: "", email: "", phone: "", address: "" });
    }
  };
 
  return (
    <div className="container mt-4">
      <nav className="navbar navbar-expand-lg navbar-dark bg-dark p-3 rounded">
        <h3 className="navbar-brand">Office Management Dashboard</h3>
        <div className="ml-auto d-flex align-items-center">
          <div className="dropdown mr-3">
            <button className="btn btn-secondary dropdown-toggle" type="button" data-toggle="dropdown" aria-expanded="false">
              {userDetails.username || "Profile"}
            </button>
            <div className="dropdown-menu dropdown-menu-right">
              <p className="dropdown-item"><strong>Username:</strong> {userDetails.username}</p>
              <p className="dropdown-item"><strong>Email:</strong> {userDetails.email}</p>
              <p className="dropdown-item"><strong>Phone:</strong> {userDetails.phone}</p>
            </div>
          </div>
          <button type="button" className="btn btn-danger" onClick={handleLogout}> Logout</button>
        </div>
      </nav>
 
      <div className="mb-4 mt-3">
        <button className={`btn mr-2 ${selectedView === "employees" ? "btn-info" : "btn-outline-info"}`} onClick={() => setSelectedView("employees")}>
          Office Details
        </button>
      </div>
 
      {selectedView === "employees" && (
        <section className="mb-5">
          <h2>Employee Details</h2>
          <div className="mb-3">
            <input type="text" name="name" placeholder="Name" className="form-control mb-2" value={newEmployee.name} onChange={handleInputChange} />
            <input type="text" name="department" placeholder="Department" className="form-control mb-2" value={newEmployee.department} onChange={handleInputChange} />
            <input type="email" name="email" placeholder="Email" className="form-control mb-2" value={newEmployee.email} onChange={handleInputChange} />
            <input type="text" name="phone" placeholder="Phone" className="form-control mb-2" value={newEmployee.phone} onChange={handleInputChange} />
            <input type="text" name="address" placeholder="Address" className="form-control mb-2" value={newEmployee.address} onChange={handleInputChange} />
            <button className="btn btn-success" onClick={addEmployee}>Add Employee</button>
          </div>
          <Table
            headers={["ID", "Name", "Department", "Email", "Phone", "Address"]}
            data={employeeDetails}
            rowRenderer={(employee) => (
              <tr key={employee.id}>
                <td>{employee.id}</td>
                <td>{employee.name}</td>
                <td>{employee.department}</td>
                <td>{employee.email}</td>
                <td>{employee.phone}</td>
                <td>{employee.address}</td>
              </tr>
            )}
          />
        </section>
      )}
    </div>
  );
};
 
export default LandingPage;
