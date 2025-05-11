import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import "../../stylesheets/GuestLogin.css";
import showPasswordIcon from "../../assets/icons/find_15067049.png";
import hidePasswordIcon from "../../assets/icons/see_4230235.png";
import sealImage from "../../assets/icons/KFUPM Seal White.png";
import axios from "axios";

function GuestLogin() {
  const [id, setid] = useState("");
  const [password, setPassword] = useState("");
  const [passwordVisible, setPasswordVisible] = useState(false); // State to toggle password visibility
  const [error, setError] = useState("");
  const navigate = useNavigate();

  // Predefined guest credentials for demo purposes
  // const guestid = "s20123456";
  // const guestPassword = "password123!";

  const handleLogin = async (e) => {
    e.preventDefault();

    // Check if the ID matches the expected format
    const idPattern = /^s20\d{7}$/;
    if (!idPattern.test(id)) {
      const errorMsg = "Invalid ID format. It should be in the form s20xxxxxxx.";
      setError(errorMsg);
      setTimeout(() => alert(errorMsg), 0);
      return;
    }

    try {
      const response = await axios.get(`http://localhost:5000/auth/login/guest/${id}`);

      if (response.data.success) {
        // Compare the fetched password with the entered password here
        if (response.data.guest_password === password) {
          // On successful password match, redirect to guest page
          navigate("/guest/home");
        } else {
          const errorMsg = "Invalid password!";
          setError(errorMsg);
          setTimeout(() => alert(errorMsg), 0);
        }
      } else {
        const errorMsg = response.data.message || "Invalid id!";
        setError(errorMsg);
        setTimeout(() => alert(errorMsg), 0);
      }
    } catch (err) {
      const errorMsg = "An error occurred during login.";
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
            <label>ID</label>
            <input
              type="text"
              value={id}
              onChange={(e) => setid(e.target.value)}
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
            <Link to="/admin/login">Login as an Admin</Link>
          </p>
        </form>
      </div>
    </div>
  );
}

export default GuestLogin;
