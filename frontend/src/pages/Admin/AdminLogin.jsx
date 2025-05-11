import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import "../../stylesheets/AdminLogin.css";
import showPasswordIcon from "../../assets/icons/find_15067049.png";
import hidePasswordIcon from "../../assets/icons/see_4230235.png";
import sealImage from "../../assets/icons/KFUPM Seal White.png";
import securityQuestionImage from "../../assets/images/security-question.png";
import axios from "axios";

function AdminLogin() {
  const [adminId, setAdminId] = useState("");
  const [password, setPassword] = useState("");
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const [showSecurityModal, setShowSecurityModal] = useState(false);
  const [securityAnswer, setSecurityAnswer] = useState("");
  const [securityError, setSecurityError] = useState("");
  const [securityAction, setSecurityAction] = useState("");
  const navigate = useNavigate();

  // Expected security answer
  const expectedSecurityAnswer = "0";

  const handleLogin = async (e) => {
    if (e) e.preventDefault();
    setError("");
    setLoading(true);

    // Validate username format: firstname.lastname.id
    const usernamePattern = /^[a-zA-Z]+\.[a-zA-Z]+\.\d+$/;
    if (!usernamePattern.test(adminId)) {
      setError("Username must be in the format firstname.lastname.id");
      setLoading(false);
      return;
    }

    // Extract numeric ID from username of form firstname.lastname.id
    const idParts = adminId.split(".");
    const id = idParts[idParts.length - 1];

    try {
      // First, verify the admin credentials with the backend
      const response = await axios.get(`/api/auth/login/admin/${id}`);
      
      // If admin exists, check password
      if (response.data.success) {
        const admin = response.data.data;
        
        // Verify password (in a real app, this should be done on the server)
        if (admin.admin_password === password) {
          // Show security question before completing login
          setSecurityAction("login");
          setShowSecurityModal(true);
        } else {
          throw new Error("Invalid password");
        }
      } else {
        throw new Error("Admin not found");
      }
    } catch (err) {
      console.error("Login error:", err);
      const errorMsg = err.response?.data?.message || err.message || "Invalid admin ID or password";
      setError(errorMsg);
      setTimeout(() => alert(errorMsg), 0);
    } finally {
      setLoading(false);
    }
  };

  const togglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible);
  };

  const handleSecuritySubmit = () => {
    const normalized = securityAnswer.replace(/\s+/g, "").toLowerCase();
    if (normalized === expectedSecurityAnswer) {
      setShowSecurityModal(false);
      setSecurityError("");
      
      if (securityAction === "signup") {
        navigate("/admin/signup");
      } else if (securityAction === "login") {
        // Set token or admin info in localStorage
        localStorage.setItem("adminId", adminId);
        navigate("/admin/home");
      }
    } else {
      const errorMsg = "Incorrect answer to the security question!";
      alert(errorMsg);
      setShowSecurityModal(false);
      setSecurityAnswer("");
      setSecurityError("");
    }
  };

  return (
    <div className="admin-background login-container">
      <div className={showSecurityModal ? "blurred" : ""}>
        <div className="form-background">
          <img src={sealImage} alt="KFUPM Seal" className="seal-logo" />
          <h2>KFUPM Admin Login</h2>
          <form onSubmit={handleLogin}>
            <div className="form-group">
              <label>Username</label>
              <input
                type="text"
                value={adminId}
                onChange={(e) => setAdminId(e.target.value)}
                placeholder="Enter your username"
                required
              />
            </div>
            <div className="password-container form-group">
              <label>Password</label>
              <div className="password-input-row">
                <input
                  type={passwordVisible ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  required
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
            <button type="submit" disabled={loading}>
              {loading ? "Logging in..." : "Login"}
            </button>
            <p className="admin-signup-link">
              <span
                onClick={() => {
                  setSecurityAction("signup");
                  setShowSecurityModal(true);
                }}
                style={{
                  cursor: "pointer",
                  textDecoration: "underline",
                  color: "white",
                }}
              >
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
            <img
              src={securityQuestionImage}
              alt="Security Question"
              style={{
                maxWidth: "100%",
                borderRadius: "0.5rem",
                marginTop: "1rem",
              }}
            />
            <input
              type="text"
              value={securityAnswer}
              onChange={(e) => setSecurityAnswer(e.target.value)}
            />
            <button type="button" onClick={handleSecuritySubmit}>
              Submit
            </button>
            {securityError && <p className="error">{securityError}</p>}
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminLogin;