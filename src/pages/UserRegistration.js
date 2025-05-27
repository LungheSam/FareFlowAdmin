import React, { useState } from 'react';
import '../styles/UserRegistration.css';
import { motion } from 'framer-motion';
import { doc, setDoc } from 'firebase/firestore';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth, db } from '../services/firebase';

const UserRegistration = () => {
  const [role, setRole] = useState('passenger');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [cardUID, setCardUID] = useState('');
  const [balance, setBalance] = useState('');
  const [phone, setPhone] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {

      const userCredential = await createUserWithEmailAndPassword(auth, email, cardUID);
      const user = userCredential.user;

      const userData = {
        firstName,
        lastName,
        email,
        phone,
        role,
        blocked: false,
      };

      if (role === 'passenger') {
        userData.cardUID = cardUID;
        userData.balance = parseFloat(balance);
        await setDoc(doc(db, 'users', cardUID), userData);
        await fetch('https://fareflow-server.onrender.com/send-welcome-message', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ firstName, email, phone, cardUID, password: cardUID }),
      });
      } else {
        userData.role="driver";
        await setDoc(doc(db, 'drivers', user.uid), userData);
      }

      alert(`${role === 'driver' ? 'Driver' : 'Passenger'} registered successfully!`);

      // Reset
      setFirstName('');
      setLastName('');
      setEmail('');
      setCardUID('');
      setBalance('');
      setPhone('');
      setRole('passenger');
    } catch (error) {
      console.error('Registration error:', error);
      alert('Error: ' + error.message);
    }
  };

  return (
    <motion.section
      className="page user-registration"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <h2>{role === 'driver' ? 'Driver Registration' : 'Passenger Registration'}</h2>

      <form className="register-form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="role">Registering As:</label>
          <select id="role" value={role} onChange={(e) => setRole(e.target.value)}>
            <option value="passenger">Passenger</option>
            <option value="driver">Driver</option>
          </select>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="firstName">First Name:</label>
            <input
              type="text"
              id="firstName"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="lastName">Last Name:</label>
            <input
              type="text"
              id="lastName"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              required
            />
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="email">Email Address:</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        {role === 'passenger' && (
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="cardUID">Card UID:</label>
              <input
                type="text"
                id="cardUID"
                value={cardUID}
                onChange={(e) => setCardUID(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="balance">Initial Balance (UGX):</label>
              <input
                type="number"
                id="balance"
                value={balance}
                onChange={(e) => setBalance(e.target.value)}
                required
              />
            </div>
          </div>
        )}

        <div className="form-group">
          <label htmlFor="phone">Phone Number:</label>
          <input
            type="tel"
            id="phone"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            required
          />
        </div>

        <button type="submit" className='user-registration-submit-btn'>
          Register {role === 'driver' ? 'Driver' : 'Passenger'}
        </button>
      </form>
    </motion.section>
  );
};

export default UserRegistration;
