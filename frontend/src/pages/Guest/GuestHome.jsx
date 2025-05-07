import React from "react";
import { useNavigate } from "react-router-dom";
import GuestSidebar from "../../components/GuestSidebar.jsx";
// import sealImage from '../../assets/icons/KFUPM Seal White.png';
import bgImage from "../../assets/images/Illustration 1@4x.png";
import "../../stylesheets/GuestHome.css";

const GuestHome = () => {
  const navigate = useNavigate();
  const username = "john.doe"; // Replace with actual dynamic source later
  const [first, last] = username.split(".");
  const initials = `${first[0]}${last[0]}`.toUpperCase();
  const formattedName = `${first.charAt(0).toUpperCase() + first.slice(1)} ${last.charAt(0).toUpperCase() + last.slice(1)}`;
  const formattedFirstName = first.charAt(0).toUpperCase() + first.slice(1);

  return (
    <div className="guest-home">
      <GuestSidebar initials={initials} formattedName={formattedName} />

      <main className="main-content">
        <div className="bg-overlay"></div>
        <header className="topbar">
          <h1>
            Welcome to SOCCER@KFUPM,{" "}
            <span className="highlighted-name">{formattedFirstName}</span>
          </h1>
        </header>

        <section className="applications">
          <h2>Quick Access</h2>
          <div className="app-grid">
            <div
              className="app-item"
              onClick={() => navigate("/guest/tournament-table")}
            >
              View Tournament Table
            </div>
            <div
              className="app-item"
              onClick={() => navigate("/guest/match-results/tournaments")}
            >
              Browse Match Results
            </div>
            <div
              className="app-item"
              onClick={() => navigate("/guest/browse-teams")}
            >
              Browse Teams
            </div>
            <div
              className="app-item"
              onClick={() => navigate("/guest/detailed-match-stats")}
            >
              View Player Stats
            </div>
          </div>
        </section>
        {/* <img 
          src={sealImage} 
          alt="KFUPM Seal" 
          className="vertical-seal" 
        /> */}
      </main>
    </div>
  );
};

export default GuestHome;
