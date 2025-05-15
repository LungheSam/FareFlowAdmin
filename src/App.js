import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { auth } from './services/firebase';
import Login from './components/auth/Login';
import AdminLayout from './components/layout/AdminLayout';
import Dashboard from './pages/Dashboard';
import UserRegistration from './pages/UserRegistration';
import RegisteredUsers from './pages/RegisteredUsers';
import RegisteredDrivers from './pages/RegisteredDrivers';
import BusTracking from './pages/BusTracking';
import EarningsAnalysis from './pages/EarningsAnalysis';
function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((authUser) => {
      setUser(authUser);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/login"
          element={user ? <Navigate to="/" replace /> : <Login />}
        />
        <Route
          path="/"
          element={user ? <AdminLayout /> : <Navigate to="/login" replace />}
        >
          <Route index element={<Dashboard />} />
          <Route path="passengers" element={<RegisteredUsers />} />
          <Route path="drivers" element={<RegisteredDrivers />} />
          <Route path="register" element={<UserRegistration />} />
          <Route path="bustracking" element={<BusTracking />} />
          <Route path="earningsanalysis" element={<EarningsAnalysis />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;