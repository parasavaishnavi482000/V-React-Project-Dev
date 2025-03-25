import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
 

const Table = ({ headers, data, rowRenderer }) => (
  <table className="table table-bordered">
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

  const facultyDetails = [
    { id: 1, name: "John Doe", subject: "Mathematics", email: "john.doe@example.com", phone: "123-456-7890", address: "123 Main St, City A" },
    { id: 2, name: "Jane Smith", subject: "Science", email: "jane.smith@example.com", phone: "987-654-3210", address: "456 Elm St, City B" },
    { id: 3, name: "Emily Johnson", subject: "English", email: "emily.johnson@example.com", phone: "555-123-4567", address: "789 Oak St, City C" },
  ];
 
  const studentDetails = [
    { id: 1, name: "Alice", class: "10", section: "A", attendance: "95%" },
    { id: 2, name: "Bob", class: "10", section: "A", attendance: "90%" },
    { id: 3, name: "Charlie", class: "10", section: "B", attendance: "85%" },
    { id: 4, name: "David", class: "9", section: "C", attendance: "88%" },
  ];
 
  const studentAttendance = 90;
  const facultyAttendance = 98;
 

  const [selectedView, setSelectedView] = useState(null);
  const [userDetails, setUserDetails] = useState({ username: "", email: "", phone: "" });
 

  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem("userDetails"));
    if (userData) setUserDetails(userData);
  }, []);
 
  const handleLogout = () => {
    localStorage.removeItem("userDetails");
    setPage("Login");
  };
 
  return (
    <div className="container mt-4">
   
      <nav className="navbar navbar-expand-lg navbar-light bg-light mb-4">
        <h3 className="navbar-brand">School Management Dashboard</h3>
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
      
          <button className="btn btn-danger" onClick={handleLogout}>Logout</button>
        </div>
      </nav>
 
     
      <div className="mb-4">
        <button className={`btn mr-2 ${selectedView === "faculty" ? "btn-info" : "btn-outline-info"}`} onClick={() => setSelectedView("faculty")}>
          Faculty Details
        </button>
        <button className={`btn mr-2 ${selectedView === "student" ? "btn-info" : "btn-outline-info"}`} onClick={() => setSelectedView("student")}>
          Student Details
        </button>
        <button className={`btn mr-2 ${selectedView === "attendance" ? "btn-info" : "btn-outline-info"}`} onClick={() => setSelectedView("attendance")}>
          Attendance Summary
        </button>
      </div>
 
    
      {selectedView === "faculty" && (
        <section className="mb-5">
          <h2>Faculty Details</h2>
          <Table
            headers={["ID", "Name", "Subject", "Email", "Phone", "Address"]}
            data={facultyDetails}
            rowRenderer={(faculty) => (
              <tr key={faculty.id}>
                <td>{faculty.id}</td>
                <td>{faculty.name}</td>
                <td>{faculty.subject}</td>
                <td>{faculty.email}</td>
                <td>{faculty.phone}</td>
                <td>{faculty.address}</td>
              </tr>
            )}
          />
        </section>
      )}
 
      {selectedView === "student" && (
        <section className="mb-5">
          <h2>Student Details</h2>
          <Table
            headers={["Student ID", "Name", "Class", "Section", "Attendance"]}
            data={studentDetails}
            rowRenderer={(student) => (
              <tr key={student.id}>
                <td>{student.id}</td>
                <td>{student.name}</td>
                <td>{student.class}</td>
                <td>{student.section}</td>
                <td>{student.attendance}</td>
              </tr>
            )}
          />
        </section>
      )}
 
      {selectedView === "attendance" && (
        <section className="mb-5">
          <h2>Attendance Summary</h2>
          <div className="row">
            <div className="col-md-6">
              <div className="card text-white bg-info mb-3">
                <div className="card-body">
                  <h5 className="card-title">Student Attendance</h5>
                  <p className="card-text display-4">{studentAttendance}%</p>
                </div>
              </div>
            </div>
            <div className="col-md-6">
              <div className="card text-white bg-success mb-3">
                <div className="card-body">
                  <h5 className="card-title">Faculty Attendance</h5>
                  <p className="card-text display-4">{facultyAttendance}%</p>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}
    </div>
  );
};
 
export default LandingPage;