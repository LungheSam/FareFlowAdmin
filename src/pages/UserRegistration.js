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
  const [licenseNumber, setLicenseNumber] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const password = role === 'passenger' ? cardUID : licenseNumber;
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      const userData = {
        firstName,
        lastName,
        email,
        phone,
        role,
        blocked: false,
      };
      console.log(userData);
      if (role === 'passenger') {
        userData.cardUID = cardUID;
        userData.balance = parseFloat(balance);

        await setDoc(doc(db, 'users', cardUID), userData);
        console.log(userData)
        await fetch('https://fareflow-server.onrender.com/send-welcome-message', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            email,
            phone,
            firstName,
            lastName,
            cardUID,
            password: cardUID,
          }),
        });
        console.log("Request Sent....")
      } else {
        userData.licenseNumber = licenseNumber;
        console.log(userData)
        await setDoc(doc(db, 'drivers', user.uid), userData);

        await fetch('https://fareflow-server.onrender.com/send-welcome-message-driver', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            firstName,
            email,
            phone,
            licenseNumber,
            password: licenseNumber,
          }),
        });
        console.log("Request Sent....")
      }

      alert(`${role === 'driver' ? 'Driver' : 'Passenger'} registered successfully!`);

      // Reset form
      setFirstName('');
      setLastName('');
      setEmail('');
      setCardUID('');
      setBalance('');
      setPhone('');
      setLicenseNumber('');
      setRole('passenger');
    } catch (error) {
      console.error('Registration error:', error);
      alert('Error: ' + error.message);
    } finally {
      setLoading(false);
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
          <select
            id="role"
            value={role}
            onChange={(e) => setRole(e.target.value)}
            disabled={loading}
          >
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
              disabled={loading}
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
              disabled={loading}
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
            disabled={loading}
          />
        </div>

        {role === 'passenger' ? (
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="cardUID">Card UID:</label>
              <input
                type="text"
                id="cardUID"
                value={cardUID}
                onChange={(e) => setCardUID(e.target.value)}
                required
                disabled={loading}
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
                disabled={loading}
              />
            </div>
          </div>
        ) : (
          <div className="form-group">
            <label htmlFor="licenseNumber">License Number:</label>
            <input
              type="text"
              id="licenseNumber"
              value={licenseNumber}
              onChange={(e) => setLicenseNumber(e.target.value)}
              required
              disabled={loading}
            />
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
            disabled={loading}
          />
        </div>

        <button
          type="submit"
          className="user-registration-submit-btn"
          disabled={loading}
        >
          {loading
            ? `Registering ${role === 'driver' ? 'Driver' : 'Passenger'}...`
            : `Register ${role === 'driver' ? 'Driver' : 'Passenger'}`}
        </button>
      </form>
    </motion.section>
  );
};

export default UserRegistration;

