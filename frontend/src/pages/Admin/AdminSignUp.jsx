import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import "../../stylesheets/AdminSignUp.css";
import showPasswordIcon from "../../assets/icons/find_15067049.png";
import hidePasswordIcon from "../../assets/icons/see_4230235.png";
import sealImage from "../../assets/icons/KFUPM Seal White.png";
import axios from "axios";

function AdminSignUp() {
  const [admin_username, setAdminUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSignUp = (e) => {
    e.preventDefault();
    // Validate username format: firstname.lastname.id (9-digit ID)
    const usernamePattern = /^[a-zA-Z]+\.[a-zA-Z]+\.\d{9}$/;
    if (!usernamePattern.test(admin_username)) {
      const errorMsg =
        "Username must be in the format firstname.lastname.id (where ID is exactly 9 digits)";
      setError(errorMsg);
      setTimeout(() => alert(errorMsg), 0);
      return;
    }
    if (!admin_username || !password) {
      const errorMsg = "Please enter a username and password!";
      setError(errorMsg);
      setTimeout(() => alert(errorMsg), 0);
      return;
    }

    // Extract admin_id from the admin_username (assumed format: firstname.lastname.id)
    const usernameParts = admin_username.split(".");
    if (
      usernameParts.length !== 3 ||
      isNaN(usernameParts[2]) ||
      usernameParts[2].length !== 9
    ) {
      const errorMsg =
        "Username must be in the format firstname.lastname.id (where id is a 9 digits long)";
      setError(errorMsg);
      setTimeout(() => alert(errorMsg), 0);
      return;
    }
    const admin_id = parseInt(usernameParts[2], 10); // Convert to integer

    if (password !== confirmPassword) {
      const errorMsg = "Passwords do not match!";
      setError(errorMsg);
      setTimeout(() => alert(errorMsg), 0);
      return;
    }
    // Backend API call to register the admin
    axios
      .post("http://localhost:5000/auth/register/admin", {
        admin_username: admin_username,
        admin_id: admin_id,
        password: password,
      })
      .then((res) => {
        alert("Sign-up successful! Redirecting to Admin login page...");
        setError("");
        navigate("/admin/login");
      })
      .catch((err) => {
        setError(err.response?.data?.message || "Error registering admin");
        setTimeout(() => alert(err.response?.data?.message || "Error"), 0);
      });
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
              value={admin_username}
              onChange={(e) => setAdminUsername(e.target.value)}
              placeholder="Username format: firstname.lastname.id"
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
