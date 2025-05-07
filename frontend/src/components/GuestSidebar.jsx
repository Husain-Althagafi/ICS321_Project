// guestSidebar.jsx
import React from "react";
import { useNavigate } from "react-router-dom";
import "./stylesheets/GuestSidebar.css";

const GuestSidebar = ({ initials, formattedName }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/guest/login");
  };

  return (
    <aside className="sidebar">
      <div className="profile-wrapper">
        <div className="profile">{initials}</div>
        <div className="guest-name">{formattedName}</div>
      </div>
      <nav>
        <ul>
          <li onClick={() => navigate("/guest/home")}>Home</li>
          <li onClick={() => navigate("/guest/tournaments")}>Tournaments</li>
          <li onClick={() => navigate("/guest/browse-teams")}>Teams</li>
          <li onClick={() => navigate("/guest/top-goalscorers")}>
            Top Scorers
          </li>
          <li onClick={handleLogout}>Logout</li>
        </ul>
      </nav>
    </aside>
  );
};

export default GuestSidebar;
