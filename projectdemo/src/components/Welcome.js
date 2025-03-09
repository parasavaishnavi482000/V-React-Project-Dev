import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Dropdown, DropdownButton, Button, Modal, Form } from 'react-bootstrap';
import './Welcome.css';

const Welcome = () => {
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [username] = useState(localStorage.getItem('username') || '');
  const [showModal, setShowModal] = useState(false);
  const [newData, setNewData] = useState({});
  const [data, setData] = useState({});
  const [allUsersData, setAllUsersData] = useState({});
  const isAdmin = username === 'admin';

  useEffect(() => {
    if (isAdmin) {
      const usersData = Object.keys(localStorage)
        .filter(key => key.startsWith('data_'))
        .reduce((acc, key) => ({ ...acc, [key.replace('data_', '')]: JSON.parse(localStorage.getItem(key)) }), {});
      setAllUsersData(usersData);
    } else {
      setData(JSON.parse(localStorage.getItem(`data_${username}`)) || {});
    }
  }, [username, isAdmin]);

  const handleLogout = () => {
    localStorage.removeItem('username');
    navigate('/');
  };

  const handleSave = () => {
    if (!selectedCategory) return;
    const updatedData = { ...data, [selectedCategory]: [...(data[selectedCategory] || []), newData] };
    setData(updatedData);
    localStorage.setItem(`data_${username}`, JSON.stringify(updatedData));
    setNewData({});
    setShowModal(false);
  };

  const categories = [
    { id: 'employee', name: 'Employee Details' }, { id: 'office', name: 'Office Details' },
    { id: 'interview', name: 'Interview Details' }, { id: 'laptop', name: 'Laptop Details' },
    { id: 'salary', name: 'Salary Details' }, { id: 'ceo', name: 'CEO Details' },
    { id: 'holiday', name: 'Holiday Details' }
  ];

  return (
    <div className="welcome-container">
      <nav className="navbar navbar-light bg-light px-4 d-flex justify-content-between">
        <h5>Welcome, {username}</h5>
        <DropdownButton id="dropdown-basic-button" title="Settings">
          <Dropdown.Item onClick={() => navigate('/profile-settings')}>Profile Settings</Dropdown.Item>
          <Dropdown.Item onClick={handleLogout}>Logout</Dropdown.Item>
        </DropdownButton>
      </nav>

      <div className="container mt-5 content text-center">
        <h2>Welcome to Office</h2>
        <div className="row">
          {categories.map(({ id, name }) => (
            <div key={id} className="col-md-3 mb-3">
              <div className="card p-3 shadow category-card" onClick={() => setSelectedCategory(id)}>
                <h6>{name}</h6>
              </div>
            </div>
          ))}
        </div>

        {selectedCategory && (
          <div className="mt-4">
            <h5>{categories.find(cat => cat.id === selectedCategory)?.name}</h5>
            <Button variant="primary" onClick={() => setShowModal(true)}>+</Button>
            <div className="mt-3">
              {(isAdmin ? Object.entries(allUsersData) : [[username, data]]).map(([user, userData]) => (
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
              ))}
            </div>
          </div>
        )}
      </div>

      <footer><p>&copy; 2025 Office Management System. All rights reserved.</p></footer>

      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Add {categories.find(cat => cat.id === selectedCategory)?.name}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Group>
            <Form.Label>Detail</Form.Label>
            <Form.Control type="text" name="detail" onChange={(e) => setNewData({ ...newData, detail: e.target.value })} />
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>Close</Button>
          <Button variant="primary" onClick={handleSave}>Save</Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default Welcome;
