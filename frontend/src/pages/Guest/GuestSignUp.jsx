import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import "../../stylesheets/GuestSignUp.css";
import showPasswordIcon from '../../assets/icons/find_15067049.png';
import hidePasswordIcon from '../../assets/icons/see_4230235.png';
import sealImage from '../../assets/icons/KFUPM Seal White.png';

function GuestSignUp() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [passwordVisible, setPasswordVisible] = useState(false);  // State to toggle password visibility
  const [error, setError] = useState('');
  const navigate = useNavigate();

  // Predefined Admin credentials for demo purposes
  const adminUsername = 'admin';
  const adminPassword = 'password123';

  const handleSignUp = (e) => {
    e.preventDefault();
    if (username === adminUsername && password === adminPassword) {
      // On successful login, redirect to Admin page
      navigate('/guest/home');
    } else {
      const errorMsg = 'Invalid username or password!';
      setError(errorMsg);
      setTimeout(() => alert(errorMsg), 0);
    }
  };

  const togglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible);  // Toggle the visibility of the password
  };

  return (
    <div className="guest-background login-container">
      <div className="form-background">
        <img src={sealImage} alt="KFUPM Seal" className="seal-logo" />
        <header>KFUPM Guest Sign Up</header>
        <form onSubmit={handleSignUp}>
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
          <button type="submit">Sign Up</button>
          <p className="guest-login-link">
            <Link to="/guest/login">Already have an account? Login as a Guest</Link>
          </p>
          {/* <p className="admin-link">
            <Link to="/admin/login">Login as Admin</Link>
          </p> */}
        </form>
      </div>
    </div>
  );
}


export default GuestSignUp;
