import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Dropdown, DropdownButton, Button, Modal, Form } from 'react-bootstrap';
import './Welcome.css';

const Welcome = () => {
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [username, setUsername] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [newData, setNewData] = useState({});
  const [data, setData] = useState({});
  const [allUsersData, setAllUsersData] = useState({});
  const isAdmin = username === 'admin';

  useEffect(() => {
    const storedUsername = localStorage.getItem('username');
    if (storedUsername) {
      setUsername(storedUsername);
      if (storedUsername === 'admin') {
        let usersData = {};
        Object.keys(localStorage).forEach(key => {
          if (key.startsWith('data_')) {
            usersData[key.replace('data_', '')] = JSON.parse(localStorage.getItem(key));
          }
        });
        setAllUsersData(usersData);
      } else {
        const storedData = JSON.parse(localStorage.getItem(`data_${storedUsername}`)) || {};
        setData(storedData);
      }
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('username');
    navigate('/');
  };

  const handleProfileSettings = () => {
    navigate('/profile-settings');
  };

  const handleShowModal = () => setShowModal(true);
  const handleCloseModal = () => setShowModal(false);

  const handleInputChange = (e) => {
    setNewData({ ...newData, [e.target.name]: e.target.value });
  };

  const handleSave = () => {
    if (!selectedCategory) return;
    const updatedData = {
      ...data,
      [selectedCategory]: [...(data[selectedCategory] || []), newData]
    };
    setData(updatedData);
    localStorage.setItem(`data_${username}`, JSON.stringify(updatedData));
    setNewData({});
    setShowModal(false);
  };

  const categories = [
    { id: 'employee', name: 'Employee Details' },
    { id: 'office', name: 'Office Details' },
    { id: 'interview', name: 'Interview Details' },
    { id: 'laptop', name: 'Laptop Details' },
    { id: 'salary', name: 'Salary Details' },
    { id: 'ceo', name: 'CEO Details' },
    { id: 'holiday', name: 'Holiday Details' }
  ];

  return (
    <div className="welcome-container">
      <nav className="navbar navbar-light bg-light px-4 d-flex justify-content-between">
        <h5>Welcome, {username}</h5>
        <DropdownButton id="dropdown-basic-button" title="Settings">
          <Dropdown.Item onClick={handleProfileSettings}>Profile Settings</Dropdown.Item>
          <Dropdown.Item onClick={handleLogout}>Logout</Dropdown.Item>
        </DropdownButton>
      </nav>
      <div className="container mt-5">
        <h2 className="text-center mb-4">Welcome to Office</h2>
        
        <div className="row">
          {categories.map((category) => (
            <div key={category.id} className="col-md-3 mb-3">
              <div className="card p-3 shadow text-center category-card" onClick={() => setSelectedCategory(category.id)}>
                <h6>{category.name}</h6>
              </div>
            </div>
          ))}
        </div>

        {selectedCategory && (
          <div className="mt-4">
            <h5>{categories.find(cat => cat.id === selectedCategory)?.name}</h5>
            <Button variant="primary" onClick={handleShowModal}>+</Button>
            <div className="mt-3">
              {isAdmin ? (
                Object.entries(allUsersData).map(([user, userData]) => (
                  <div key={user} className="mt-4">
                    <h6>{user}</h6>
                    {(userData[selectedCategory] || []).map((item, index) => (
                      <div key={index} className="card p-3 shadow mt-2">
                        {Object.entries(item).map(([key, value]) => (
                          <p key={key}><strong>{key}:</strong> {value}</p>
                        ))}
                      </div>
                    ))}
                  </div>
                ))
              ) : (
                (data[selectedCategory] || []).map((item, index) => (
                  <div key={index} className="card p-3 shadow mt-2">
                    {Object.entries(item).map(([key, value]) => (
                      <p key={key}><strong>{key}:</strong> {value}</p>
                    ))}
                  </div>
                ))
              )}
            </div>
          </div>
        )}
      </div>

      <footer className="text-center mt-5 p-3 bg-dark text-white">
        <p>&copy; 2025 Office Management System. All rights reserved.</p>
      </footer>

      <Modal show={showModal} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>Add {categories.find(cat => cat.id === selectedCategory)?.name}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group>
              <Form.Label>Detail</Form.Label>
              <Form.Control type="text" name="detail" onChange={handleInputChange} />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseModal}>Close</Button>
          <Button variant="primary" onClick={handleSave}>Save</Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default Welcome;
