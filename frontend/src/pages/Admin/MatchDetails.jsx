import React from "react";
import { useNavigate } from "react-router-dom";
import "../../stylesheets/MatchDetails.css";

const MatchDetails = ({ initials, formattedName }) => {
  const navigate = useNavigate();

  return (
    <aside className="sidebar">
      <div className="profile-wrapper">
        <div className="profile">{initials}</div>
        <div className="admin-name">{formattedName}</div>
      </div>
      <nav>
        <ul>
          <li onClick={() => navigate("/admin/home")}>Home</li>
          <li onClick={() => navigate("/admin/tournaments")}>Tournaments</li>
          <li onClick={() => navigate("/admin/teams")}>Teams</li>
          <li onClick={() => navigate("/admin/venues")}>Venues</li>
          <li onClick={() => navigate("/admin/login")}>Logout</li>
        </ul>
      </nav>
    </aside>
  );
};

export default MatchDetails;
