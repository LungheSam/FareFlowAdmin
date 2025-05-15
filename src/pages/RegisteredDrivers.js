

import React, { useEffect, useState } from 'react';
import { collection, getDocs, updateDoc, deleteDoc, doc } from 'firebase/firestore';
import { db } from '../services/firebase';
import '../styles/RegisteredUsers.css';

const RegisteredDrivers = () => {
  const [drivers, setDrivers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [editingDriver, setEditingDriver] = useState(null);
  const [editForm, setEditForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
  });

  useEffect(() => {
    const fetchDrivers = async () => {
      const usersCollection = collection(db, 'drivers');
      const snapshot = await getDocs(usersCollection);
      const driverList = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setDrivers(driverList);
    };
    fetchDrivers();
  }, []);

  const handleBlock = async (id, currentStatus) => {
    try {
      const userRef = doc(db, 'drivers', id);
      await updateDoc(userRef, {
        blocked: !currentStatus,
      });

      setDrivers(drivers.map(driver =>
        driver.id === id ? { ...driver, blocked: !currentStatus } : driver
      ));

      alert(`Driver ${!currentStatus ? 'blocked' : 'unblocked'} successfully.`);
    } catch (error) {
      console.error('Error updating block status:', error);
      alert('Failed to update block status.');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      try {
        await deleteDoc(doc(db, 'drivers', id));
        setDrivers(drivers.filter(driver => driver.id !== id));
        alert('User deleted successfully.');
      } catch (error) {
        console.error('Error deleting user:', error);
        alert('Failed to delete user.');
      }
    }
  };

  const handleEdit = (driver) => {
    setEditingDriver(driver);
    setEditForm({
      firstName: driver.firstName,
      lastName: driver.lastName,
      email: driver.email,
      phone: driver.phone,
    });
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditForm({ ...editForm, [name]: value });
  };

  const handleSaveEdit = async () => {
    try {
      const userRef = doc(db, 'drivers', editingDriver.id);
      await updateDoc(userRef, {
        ...editForm,
        balance: parseFloat(editForm.balance),
      });

      setDrivers(drivers.map(driver =>
        driver.id === editingDriver.id ? { ...driver, ...editForm } : driver
      ));

      setEditingDriver(null);
      alert('Driver updated successfully.');
    } catch (error) {
      console.error('Error updating Driver:', error);
      alert('Failed to update Driver.');
    }
  };

  const filteredDrivers = drivers.filter(driver =>
    Object.values(driver)
      .join(' ')
      .toLowerCase()
      .includes(searchTerm.toLowerCase())
  );

  return (
    <section className="page registered-users">
      <h2>Registered Drivers</h2>
      <input
        type="text"
        placeholder="Search users..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
      <table>
        <thead>
          <tr>
            <th>Status</th>
            <th>First Name</th>
            <th>Last Name</th>
            <th>Email</th>
            <th>Phone</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody id="users-list">
          {filteredDrivers.map(driver => (
            <tr key={driver.id}>
              <td style={{ color: driver.blocked ? 'red' : 'green' }}>
                {driver.blocked ? 'Blocked' : 'Active'}
              </td>
              <td>{driver.firstName}</td>
              <td>{driver.lastName}</td>
              <td>{driver.email}</td>
              <td>{driver.phone}</td>
              <td>
                <button onClick={() => handleEdit(driver)}>Edit</button>
                <button onClick={() => handleBlock(driver.id, driver.blocked)}>
                  {driver.blocked ? 'Unblock' : 'Block'}
                </button>
                <button onClick={() => handleDelete(driver.id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {editingDriver && (
        <div className="edit-modal">
          <h3>Edit Driver: {editingDriver.firstName} {editingDriver.lastName}</h3>
          <div className="edit-form">
            <input
              name="firstName"
              value={editForm.firstName}
              onChange={handleEditChange}
              placeholder="First Name"
            />
            <input
              name="lastName"
              value={editForm.lastName}
              onChange={handleEditChange}
              placeholder="Last Name"
            />
            <input
              name="email"
              value={editForm.email}
              onChange={handleEditChange}
              placeholder="Email"
            />
            <input
              name="phone"
              value={editForm.phone}
              onChange={handleEditChange}
              placeholder="Phone"
            />
          </div>
          <button onClick={handleSaveEdit} className='btn-save'>Save</button>
          <button onClick={() => setEditingDriver(null)} className='btn-cancel'>Cancel</button>
        </div>
      )}
    </section>
  );
};

export default RegisteredDrivers;
