import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import "../../stylesheets/GuestSignUp.css";
import showPasswordIcon from "../../assets/icons/find_15067049.png";
import hidePasswordIcon from "../../assets/icons/see_4230235.png";
import sealImage from "../../assets/icons/KFUPM Seal White.png";
import axios from 'axios'
function GuestSignUp() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");

  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordVisible, setPasswordVisible] = useState(false); // State to toggle password visibility
  const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  // const adminUsername = 'admin';
  // const adminPassword = 'password123';

  const handleSignUp = async (e) => {
    e.preventDefault();
    const usernamePattern = /^s20\d{7}$/i;
    if (!usernamePattern.test(username.trim())) {
      const errorMsg = "Username must be in the format s20XXXXXXX";
      setError(errorMsg);
      setTimeout(() => alert(errorMsg), 0);
      return;
    }
    if (password.trim() !== confirmPassword.trim()) {
      const errorMsg = "Passwords do not match!";
      setError(errorMsg);
      setTimeout(() => alert(errorMsg), 0);
      return;
    }
    // Add the guest data to the backend
    axios.post(`http://localhost:5000/auth/register/guest`, { guest_id: username, guest_firstname: firstName, guest_lastname: lastName, guest_password: password})
    .then((res) => {
      navigate("/guest/login");
    })
    .catch(err => console.error(err))
  };

  const togglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible); // Toggle the visibility of the password
  };

  const toggleConfirmPasswordVisibility = () => {
    setConfirmPasswordVisible(!confirmPasswordVisible);
  };

  return (
    <div className="guest-background login-container">
      <div className="form-background">
        <img src={sealImage} alt="KFUPM Seal" className="seal-logo" />
        <header>KFUPM Guest Sign Up</header>
        <form onSubmit={handleSignUp}>
          <div className="form-group">
            <label>First Name</label>
            <input
              type="text"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              placeholder="Enter your first name"
            />
          </div>
          <div className="form-group">
            <label>Last Name</label>
            <input
              type="text"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              placeholder="Enter your last name"
            />
          </div>
          <div className="form-group">
            <label>ID</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="For e.g. s20XXXXXXX"
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
          <p className="guest-login-link">
            <Link to="/guest/login">
              Already have an account? Login as a Guest
            </Link>
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
