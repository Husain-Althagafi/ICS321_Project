import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import AdminSidebar from "../../components/AdminSidebar";
// import sealImage from '../../assets/icons/KFUPM Seal White.png';
import bgImage from "../../assets/images/Illustration 1@4x.png";
import "../../stylesheets/AddTournament.css";

const AddTeam = () => {
  const navigate = useNavigate();
  const username = "john.doe"; // Replace with actual dynamic source later
  const [first, last] = username.split(".");
  const initials = `${first[0]}${last[0]}`.toUpperCase();
  const formattedName = `${first.charAt(0).toUpperCase() + first.slice(1)} ${last.charAt(0).toUpperCase() + last.slice(1)}`;

  const [tournaments, setTournaments] = useState(() => {
    const stored = localStorage.getItem("tournaments");
    return stored ? JSON.parse(stored) : [];
  });
  const [teams, setTeams] = useState(() => {
    const stored = localStorage.getItem("teams");
    return stored ? JSON.parse(stored) : [];
  });
  // Persistent team counter
  const [lastTeamNumber, setLastTeamNumber] = useState(() => {
    const storedNum = parseInt(localStorage.getItem("lastTeamNumber"), 10);
    if (!isNaN(storedNum)) return storedNum;
    const maxId = teams.length
      ? Math.max(...teams.map((t) => t.team_id || 0))
      : 0;
    localStorage.setItem("lastTeamNumber", maxId);
    return maxId;
  });
  const [teamName, setTeamName] = useState("");
  const [coachName, setCoachName] = useState("");
  const [managerName, setManagerName] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  const nextTeamId = lastTeamNumber + 1;

  const handleAddTeam = (e) => {
    e.preventDefault();
    if (!teamName || !coachName || !managerName) {
      const msg = "All fields are required.";
      setErrorMsg(msg);
      setTimeout(() => alert(msg), 0);
      return;
    }
    // Update persistent team counter
    localStorage.setItem("lastTeamNumber", nextTeamId);
    setLastTeamNumber(nextTeamId);

    const newTeam = {
      team_id: nextTeamId,
      team_name: teamName,
      coach_name: coachName,
      manager_name: managerName,
    };
    const updated = [...teams, newTeam];
    setTeams(updated);
    localStorage.setItem("teams", JSON.stringify(updated));
    setTeamName("");
    setCoachName("");
    setManagerName("");
    setErrorMsg("");
    alert("Team added!");
  };

  return (
    <div className="admin-home">
      <AdminSidebar initials={initials} formattedName={formattedName} />

      <main className="main-content">
        <div className="bg-overlay"></div>
        <header className="topbar">
          <h1>Add a new team</h1>
        </header>

        <section className="tournament-form">
          <div className="form-container">
            <h2>Team Details</h2>
            <form onSubmit={handleAddTeam} className="form-grid">
              <label>
                Team ID:
                <input
                  type="text"
                  value={nextTeamId}
                  disabled
                  style={{ backgroundColor: "#f0f0f0", cursor: "not-allowed" }}
                />
              </label>
              <label>
                Team Name:
                <input
                  type="text"
                  value={teamName}
                  onChange={(e) => setTeamName(e.target.value)}
                  required
                />
              </label>
              <label>
                Coach Name:
                <input
                  type="text"
                  value={coachName}
                  onChange={(e) => setCoachName(e.target.value)}
                  required
                />
              </label>
              <label>
                Manager Name:
                <input
                  type="text"
                  value={managerName}
                  onChange={(e) => setManagerName(e.target.value)}
                  required
                />
              </label>
              {errorMsg && <p className="form-error">{errorMsg}</p>}
              <button type="submit">Add Team</button>
            </form>
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

export default AddTeam;
