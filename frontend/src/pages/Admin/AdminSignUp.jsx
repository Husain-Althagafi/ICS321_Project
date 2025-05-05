import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import "../../stylesheets/AdminSignUp.css";
import showPasswordIcon from "../../assets/icons/find_15067049.png";
import hidePasswordIcon from "../../assets/icons/see_4230235.png";
import sealImage from "../../assets/icons/KFUPM Seal White.png";
// import axios from 'axios'

function AdminSignUp() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false);

  const [error, setError] = useState("");
  const navigate = useNavigate();

  // Predefined Admin credentials for demo purposes
  const adminUsername = "admin";
  const adminPassword = "password123";

  const handleSignUp = (e) => {
    e.preventDefault();
    // Simulate basic sign-up validation
    if (!username || !password) {
      const errorMsg = "Please enter a username and password!";
      setError(errorMsg);
      setTimeout(() => alert(errorMsg), 0);
      return;
    }

    // Username validation for firstname.lastname format (all lowercase or all uppercase)
    const usernamePattern = /^([a-z]+\.[a-z]+|[A-Z]+\.[A-Z]+)$/;
    if (!usernamePattern.test(username.trim())) {
      const errorMsg =
        "Username must be in the format firstname.lastname (all lowercase or all uppercase)";
      setError(errorMsg);
      setTimeout(() => alert(errorMsg), 0);
      return;
    }
    if (password !== confirmPassword) {
      const errorMsg = "Passwords do not match!";
      setError(errorMsg);
      setTimeout(() => alert(errorMsg), 0);
      return;
    }
    // Simulate a sign-up process (for demo, just log and redirect)

    // axios.post('http://localhost:5000/auth/register/admin', {
    //   username: username,
    //   password: password
    // })
    // .then((res) => {
    //   localStorage.setItem('token', res.data.token)
    //   alert("Sign-up successful! Redirecting to Admin login page...");
    //   setError('');
    //   navigate('/admin/login');
    // })
    // .catch((err) => {
    //   setError(err)
    //   setTimeout(() => alert(errorMsg), 0);
    // })
    // Original hardcoded sign-up behavior
    setError("");
    alert("Sign-up successful! Redirecting to Admin login page...");
    navigate("/admin/login");
  };

  const togglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible);
  };

  const toggleConfirmPasswordVisibility = () => {
    setConfirmPasswordVisible(!confirmPasswordVisible);
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
              placeholder="Username format: firstname.lastname"
            />
          </div>
          <div className="password-container form-group">
            <label>Password</label>
            <div className="password-input-row">
              <input
                type={passwordVisible ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your new account's password"
              />
              <img
                src={passwordVisible ? hidePasswordIcon : showPasswordIcon}
                alt={passwordVisible ? "Hide password" : "Show password"}
                className="eye-icon"
                onClick={togglePasswordVisibility}
              />
            </div>
          </div>

          <div className="password-container form-group">
            <label>Confirm Password</label>
            <div className="password-input-row">
              <input
                type={confirmPasswordVisible ? "text" : "password"}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirm your password"
              />
              <img
                src={
                  confirmPasswordVisible ? hidePasswordIcon : showPasswordIcon
                }
                alt={confirmPasswordVisible ? "Hide password" : "Show password"}
                className="eye-icon"
                onClick={toggleConfirmPasswordVisibility}
              />
            </div>
          </div>
          {error && <p className="error">{error}</p>}
          <button type="submit">Sign Up</button>
          <p className="admin-login-link">
            <Link to="/admin/login">
              Already have an account? Login as an Admin
            </Link>
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
