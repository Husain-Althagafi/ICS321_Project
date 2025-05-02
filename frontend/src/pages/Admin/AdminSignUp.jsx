import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import "../../stylesheets/AdminSignUp.css";
import showPasswordIcon from '../../assets/icons/find_15067049.png';
import hidePasswordIcon from '../../assets/icons/see_4230235.png';
import sealImage from '../../assets/icons/KFUPM Seal White.png';

function AdminSignUp() {
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
    // Simulate basic sign-up validation
    if (!username || !password) {
      const errorMsg = 'Please enter a username and password!';
      setError(errorMsg);
      setTimeout(() => alert(errorMsg), 0);
      return;
    }
    // Simulate a sign-up process (for demo, just log and redirect)
    console.log('New admin signed up:', username);
    setError('');
    navigate('/admin/home');
  };

  const togglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible);  // Toggle the visibility of the password
  };

  return (
    <div className="admin-background login-container">
      <div className="form-background">
        <img src={sealImage} alt="KFUPM Seal" className="seal-logo" />
        <header>KFUPM Admin Sign Up</header>
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
          <p className="admin-login-link">
            <Link to="/admin/login">Already have an account? Login as an Admin</Link>
          </p>
          <p className="guest-link">
            <Link to="/guest/login">Login as a Guest</Link>
          </p>
        </form>
      </div>
    </div>
  );
}


export default AdminSignUp;
