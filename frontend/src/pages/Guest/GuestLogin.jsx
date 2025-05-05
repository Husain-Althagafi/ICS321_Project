import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import "../../stylesheets/GuestLogin.css";
import showPasswordIcon from "../../assets/icons/find_15067049.png";
import hidePasswordIcon from "../../assets/icons/see_4230235.png";
import sealImage from "../../assets/icons/KFUPM Seal White.png";

function GuestLogin() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [passwordVisible, setPasswordVisible] = useState(false); // State to toggle password visibility
  const [error, setError] = useState("");
  const navigate = useNavigate();

  // Predefined guest credentials for demo purposes
  const guestUsername = "s20123456";
  const guestPassword = "password123!";

  const handleLogin = (e) => {
    e.preventDefault();
    if (username === guestUsername && password === guestPassword) {
      // On successful login, redirect to guest page
      navigate("/guest/home");
    } else {
      const errorMsg = "Invalid username or password!";
      setError(errorMsg);
      setTimeout(() => alert(errorMsg), 0);
    }
  };

  const togglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible); // Toggle the visibility of the password
  };

  return (
    <div className="guest-background login-container">
      <div className="guest-form-background">
        <img src={sealImage} alt="KFUPM Seal" className="seal-logo" />
        <h2>KFUPM Guest Login</h2>
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

          <p className="guest-signup-link">
            <Link to="/guest/signup">Don't have an account? Sign up</Link>
          </p>
          <p className="guest-link">
            <Link to="/guest/login">Login as guest</Link>
          </p>
        </form>
      </div>
    </div>
  );
}

export default GuestLogin;
