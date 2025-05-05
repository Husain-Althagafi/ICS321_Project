import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import AdminSidebar from "../../components/AdminSidebar";
// import sealImage from '../../assets/icons/KFUPM Seal White.png';
import bgImage from "../../assets/images/Illustration 1@4x.png";
import "../../stylesheets/Tournaments_DetailedMatchStats.css";

const Tournaments_DetailedMatchStats = () => {
  const navigate = useNavigate();
  const username = "john.doe"; // Replace with actual dynamic source later
  const [first, last] = username.split(".");
  const initials = `${first[0]}${last[0]}`.toUpperCase();
  const formattedName = `${first.charAt(0).toUpperCase() + first.slice(1)} ${last.charAt(0).toUpperCase() + last.slice(1)}`;

  const [tournaments, setTournaments] = useState([]);

  useEffect(() => {
    const loadTournaments = () => {
      const stored = localStorage.getItem("tournaments");
      if (stored) {
        setTournaments(JSON.parse(stored));
      }
    };

    loadTournaments();

    window.addEventListener("focus", loadTournaments);
    return () => window.removeEventListener("focus", loadTournaments);
  }, []);

  const handleDeleteTournament = (tournamentId) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this tournament?",
    );
    if (!confirmed) return;
    const updated = tournaments.filter(
      (t) => String(t.id) !== String(tournamentId),
    );
    localStorage.setItem("tournaments", JSON.stringify(updated));
    setTournaments(updated);
  };

  return (
    <div className="admin-home">
      <AdminSidebar initials={initials} formattedName={formattedName} />

      <main className="main-content">
        <div className="bg-overlay"></div>
        <header className="topbar">
          <h1>Detailed Match Stats</h1>
        </header>
        <section className="tournament-list">
          <h2>Choose the Tournament</h2>
          <div className="tournament-grid scrollable">
            {tournaments.length > 0 ? (
              tournaments.map((tournament) => (
                <div key={tournament.id} className="tournament-card">
                  <div
                    className="tournament-card-header"
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    <h3 style={{ margin: 0 }}>
                      Tournament Name:{" "}
                      <span className="tournament-name-gradient">
                        {tournament.name}
                      </span>
                    </h3>
                  </div>
                  <p>
                    <strong>Tournament ID:</strong> {tournament.id}
                  </p>
                  <p>
                    <strong>Start Date:</strong>{" "}
                    {new Date(tournament.startDate).toLocaleDateString("en-GB")}
                  </p>
                  <p>
                    <strong>End Date:</strong>{" "}
                    {new Date(tournament.endDate).toLocaleDateString("en-GB")}
                  </p>
                  <button
                    type="button"
                    className="edit-button"
                    onClick={() =>
                      navigate(
                        `/admin/detailed-match-stats/${tournament.id}/matches`,
                      )
                    }
                  >
                    Select
                  </button>
                </div>
              ))
            ) : (
              <p style={{ color: "black" }}>
                No tournaments have been registered yet.
              </p>
            )}
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

export default Tournaments_DetailedMatchStats;
