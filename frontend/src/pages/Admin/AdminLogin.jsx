import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import "../../stylesheets/AdminLogin.css";
import showPasswordIcon from '../../assets/icons/find_15067049.png';
import hidePasswordIcon from '../../assets/icons/see_4230235.png';
import sealImage from '../../assets/icons/KFUPM Seal White.png';

import securityQuestionImage from '../../assets/images/security-question.png';

import axios from 'axios'

function AdminLogin() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [passwordVisible, setPasswordVisible] = useState(false);  // State to toggle password visibility
  const [error, setError] = useState('');

  const [showSecurityModal, setShowSecurityModal] = useState(false);
  const [securityAnswer, setSecurityAnswer] = useState('');
  const [securityError, setSecurityError] = useState('');
  const [securityAction, setSecurityAction] = useState('');
  const navigate = useNavigate();

  const [token, setToken] = useState(null)

  // Predefined Admin credentials for demo purposes
  const adminUsername = 'admin';
  const adminPassword = 'password123';

  const expectedSecurityAnswer = '0';

  const handleLogin = (e) => {
    if (e) e.preventDefault();
    
    // axios.post('http://localhost:5000/auth/login/admin', {
    //   username: username,
    //   password: password
    // })
    // .then((res) => {
    //   setToken(res.data.token)
    //   setSecurityAction('login')
    //   setShowSecurityModal(true)
    //   setError('')
    // })
    // .catch((err) => {
    //   localStorage.removeItem('token')
    //   const errorMsg = err.response?.data?.message || 'Invalid username or password';
    //   setError(errorMsg);
    //   setTimeout(() => alert(errorMsg), 0);
    //   console.error("Login error:", err);
    // });

    // Original hardcoded login logic
    if (username === adminUsername && password === adminPassword) {
      setError('');
      setSecurityAction('login');
      setShowSecurityModal(true);
    } else {
      const errorMsg = 'Invalid username or password';
      setError(errorMsg);
      setTimeout(() => alert(errorMsg), 0);
    }
  };

  const togglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible);  // Toggle the visibility of the password
  };


  const handleSecuritySubmit = () => {
    const normalized = securityAnswer.replace(/\s+/g, '').toLowerCase();
    if (normalized === expectedSecurityAnswer) {
      setShowSecurityModal(false);
      setSecurityError('');
      if (securityAction === 'signup') {
        navigate('/admin/signup');
      } else if (securityAction === 'login') { 
        localStorage.setItem('token', token)
        navigate('/admin/home');
      }
    } else {
      localStorage.removeItem('token')
      const errorMsg = 'Incorrect answer to the security question!';
      alert(errorMsg);
      setShowSecurityModal(false);
      setSecurityAnswer('');
      setSecurityError('');
    }
  };

  return (
    <div className="admin-background login-container">
      <div className={showSecurityModal ? 'blurred' : ''}>
        <div className="form-background">
          <img src={sealImage} alt="KFUPM Seal" className="seal-logo" />
          <h2>KFUPM Admin Login</h2>
          <form onSubmit={handleLogin}>
            <div className="form-group">
              <label>Username</label>
              <input 
                type="text" 
                value={username} 
                onChange={(e) => setUsername(e.target.value)} 
              />
            </div>
            <div className="password-container form-group">
              <label>Password</label>
              <div className="password-input-row">
                <input 
                  type={passwordVisible ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)} 
                />
                <img 
                  src={passwordVisible ? hidePasswordIcon : showPasswordIcon} 
                  alt={passwordVisible ? "Hide password" : "Show password"} 
                  className="eye-icon"
                  onClick={togglePasswordVisibility}
                />
              </div>
            </div>
            {error && <p className="error">{error}</p>}
            <button type="submit">Login</button>
            <p className="admin-signup-link">
              <span onClick={() => {
                setSecurityAction('signup');
                setShowSecurityModal(true);
              }} style={{ cursor: 'pointer', textDecoration: 'underline', color: 'white' }}>
                Don't have an account? Sign up for an Admin account
              </span>
            </p>
            <p className="guest-link">
              <Link to="/guest/login">Login as a Guest</Link>
            </p>
          </form>
        </div>
      </div>
      {showSecurityModal && (
        <div className="security-modal">
          <div className="security-modal-content">
            <h2>Security Question</h2>
            <question>What is the derivative?</question>
            <img src={securityQuestionImage} alt="Security Question" style={{ maxWidth: '100%', borderRadius: '0.5rem', marginTop: '1rem' }} />
            <input 
              type="text"
              value={securityAnswer}
              onChange={(e) => setSecurityAnswer(e.target.value)}
            />
            <button type="button" onClick={handleSecuritySubmit}>Submit</button>
            {securityError && <p className="error">{securityError}</p>}
          </div>
        </div>
      )}
    </div>
  );
}


export default AdminLogin;
