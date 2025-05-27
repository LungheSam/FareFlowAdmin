import { useState } from 'react';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { auth, db } from '../../services/firebase';
import { useNavigate } from 'react-router-dom';
import '../../styles/Login.css';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  // const handleSubmit = async (e) => {

  //   e.preventDefault();
  //   setIsLoading(true);
  //   setError('');

  //   try {
  //     // 1. Authenticate user
  //     const userCredential = await signInWithEmailAndPassword(auth, email, password);
  //     // 2. Check admin status in Firestore
  //     const userDoc = await getDoc(doc(db, 'admins', userCredential.user.uid));
      
  //     if (!userDoc.exists() || userDoc.data().role !== 'admin') {
  //       await auth.signOut(); // Immediately log out non-admin users
  //       throw new Error('Access denied. Admin privileges required.');
  //     }
   
  //     // 3. Redirect to admin dashboard
  //     navigate('/');
  //   } catch (error) {
  //     console.error('Login error:', error);
  //     setError(getErrorMessage(error));
  //   } finally {
  //     setIsLoading(false);
  //   }
  // };

  // Better error messages for users
  const handleSubmit = async (e) => {
  e.preventDefault();
  setIsLoading(true);
  setError('');

  try {
    // Step 1: Sign in with email & password
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const uid = userCredential.user.uid;

    // Step 2: Check if the user is an admin
    const adminDocRef = doc(db, 'admins', uid);
    const adminDocSnap = await getDoc(adminDocRef);

    if (adminDocSnap.exists() && adminDocSnap.data().role === 'admin') {
      navigate('/'); // Admin dashboard
      return;
    }

    // // Step 3: If not admin, check if the user is a driver
    // const driverDocRef = doc(db, 'drivers', uid);
    // const driverDocSnap = await getDoc(driverDocRef);

    // if (driverDocSnap.exists() && driverDocSnap.data().role === 'driver') {
    //   navigate('/driver-dashboard'); // Driver dashboard
    //   return;
    // }

    // Step 4: If neither admin nor driver, deny access
    await auth.signOut();
    throw new Error('Access denied. Only admins and drivers are allowed.');
    
  } catch (error) {
    console.error('Login error:', error);
    setError(getErrorMessage(error));
  } finally {
    setIsLoading(false);
  }
};

  const getErrorMessage = (error) => {
    switch (error.code) {
      case 'auth/invalid-email':
        return 'Invalid email address';
      case 'auth/user-disabled':
        return 'Account disabled';
      case 'auth/user-not-found':
      case 'auth/wrong-password':
        return 'Invalid email or password';
      case 'auth/too-many-requests':
        return 'Too many attempts. Try again later';
      default:
        return error.message || 'Login failed. Please try again';
    }
  };

  return (
    <div className="login-container">
      <div className='login-box'>
      <form onSubmit={handleSubmit}>
        <h1 className='login-title'>Fare<span>Flow</span> </h1>
        <h2>Admin Portal Login</h2>
        {error && <div className="error-message">{error}</div>}
        
        <div className="form-group">
          <label htmlFor="email">Email:</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            disabled={isLoading}
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="password">Password:</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            disabled={isLoading}
          />
        </div>
        
        <button type="submit" disabled={isLoading} className='login-button'>
          {isLoading ? 'Logging in...' : 'Login'}
        </button>
      </form>
      </div>
    </div>
  );
};

export default Login;