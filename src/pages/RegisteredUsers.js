

import React, { useEffect, useState } from 'react';
import { collection, getDocs, updateDoc, deleteDoc, doc } from 'firebase/firestore';
import { db } from '../services/firebase';
import '../styles/RegisteredUsers.css';

const RegisteredUsers = () => {
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [editingUser, setEditingUser] = useState(null);
  const [editForm, setEditForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    balance: '',
  });

  useEffect(() => {
    const fetchUsers = async () => {
      const usersCollection = collection(db, 'users');
      const snapshot = await getDocs(usersCollection);
      const userList = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setUsers(userList);
    };
    fetchUsers();
  }, []);

  const handleBlock = async (id, currentStatus) => {
    try {
      const userRef = doc(db, 'users', id);
      await updateDoc(userRef, {
        blocked: !currentStatus,
      });

      setUsers(users.map(user =>
        user.id === id ? { ...user, blocked: !currentStatus } : user
      ));

      alert(`User ${!currentStatus ? 'blocked' : 'unblocked'} successfully.`);
    } catch (error) {
      console.error('Error updating block status:', error);
      alert('Failed to update block status.');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      try {
        await deleteDoc(doc(db, 'users', id));
        setUsers(users.filter(user => user.id !== id));
        alert('User deleted successfully.');
      } catch (error) {
        console.error('Error deleting user:', error);
        alert('Failed to delete user.');
      }
    }
  };

  const handleEdit = (user) => {
    setEditingUser(user);
    setEditForm({
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      phone: user.phone,
      balance: user.balance,
    });
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditForm({ ...editForm, [name]: value });
  };

  const handleSaveEdit = async () => {
    try {
      const userRef = doc(db, 'users', editingUser.id);
      await updateDoc(userRef, {
        ...editForm,
        balance: parseFloat(editForm.balance),
      });

      setUsers(users.map(user =>
        user.id === editingUser.id ? { ...user, ...editForm } : user
      ));

      setEditingUser(null);
      alert('User updated successfully.');
    } catch (error) {
      console.error('Error updating user:', error);
      alert('Failed to update user.');
    }
  };

  const filteredUsers = users.filter(user =>
    Object.values(user)
      .join(' ')
      .toLowerCase()
      .includes(searchTerm.toLowerCase())
  );

  return (
    <section className="page registered-users">
      <h2>Registered Users</h2>
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
            <th>Card UID</th>
            <th>Balance (UGX)</th>
            <th>Phone</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody id="users-list">
          {filteredUsers.map(user => (
            <tr key={user.id}>
              <td style={{ color: user.blocked ? 'red' : 'green' }}>
                {user.blocked ? 'Blocked' : 'Active'}
              </td>
              <td>{user.firstName}</td>
              <td>{user.lastName}</td>
              <td>{user.email}</td>
              <td>{user.cardUID}</td>
              <td>{user.balance}</td>
              <td>{user.phone}</td>
              <td>
                <button onClick={() => handleEdit(user)}>Edit</button>
                <button onClick={() => handleBlock(user.id, user.blocked)}>
                  {user.blocked ? 'Unblock' : 'Block'}
                </button>
                <button onClick={() => handleDelete(user.id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {editingUser && (
        <div className="edit-modal">
          <h3>Edit User: {editingUser.firstName} {editingUser.lastName}</h3>
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
            <input
              name="balance"
              type="number"
              value={editForm.balance}
              onChange={handleEditChange}
              placeholder="Balance"
            />
          </div>
          <button onClick={handleSaveEdit} className='btn-save'>Save</button>
          <button onClick={() => setEditingUser(null)} className='btn-cancel'>Cancel</button>
        </div>
      )}
    </section>
  );
};

export default RegisteredUsers;
