import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
// import sealImage from '../../assets/icons/KFUPM Seal White.png';
import bgImage from "../../assets/images/Illustration 1@4x.png";
import "../../stylesheets/AddTournament.css";
import AdminSidebar from "../../components/AdminSidebar";

const AddTournament = () => {
  const navigate = useNavigate();
  const username = "john.doe"; // Replace with actual dynamic source later
  const [first, last] = username.split(".");
  const initials = `${first[0]}${last[0]}`.toUpperCase();
  const formattedName = `${first.charAt(0).toUpperCase() + first.slice(1)} ${last.charAt(0).toUpperCase() + last.slice(1)}`;

  const [tournaments, setTournaments] = useState(() => {
    const stored = localStorage.getItem("tournaments");
    return stored ? JSON.parse(stored) : [];
  });
  // Persistent tournament counter
  const [lastTournamentNumber, setLastTournamentNumber] = useState(() => {
    const storedNum = parseInt(
      localStorage.getItem("lastTournamentNumber"),
      10,
    );
    if (!isNaN(storedNum)) return storedNum;
    const maxId = tournaments.length
      ? Math.max(...tournaments.map((t) => t.id || 0))
      : 0;
    localStorage.setItem("lastTournamentNumber", maxId);
    return maxId;
  });
  const [name, setName] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  // Persistent nextId using lastTournamentNumber
  const nextId = lastTournamentNumber + 1;

  const handleAddTournament = (e) => {
    e.preventDefault();

    const today = new Date();
    today.setHours(0, 0, 0, 0); // normalize to midnight
    const start = new Date(startDate);
    const end = new Date(endDate);

    if (start < today || end < today) {
      const msg = "Start and End dates must be today or in the future!";
      setErrorMsg(msg);
      setTimeout(() => alert(msg), 0);
      return;
    }

    if (end <= start) {
      const msg = "End date must be after Start date!";
      setErrorMsg(msg);
      setTimeout(() => alert(msg), 0);
      return;
    }

    const newTournament = { id: nextId, name, startDate, endDate };
    // Update persistent counter
    localStorage.setItem("lastTournamentNumber", nextId);
    setLastTournamentNumber(nextId);
    const updated = [...tournaments, newTournament];
    setTournaments(updated);
    localStorage.setItem("tournaments", JSON.stringify(updated));
    setName("");
    setStartDate("");
    setEndDate("");
    setErrorMsg("");
    alert("Tournament added!");
  };

  return (
    <div className="admin-home">
      <AdminSidebar initials={initials} formattedName={formattedName} />

      <main className="main-content">
        <div className="bg-overlay"></div>
        <header className="topbar">
          <h1>Add a new tournament</h1>
        </header>

        <section className="tournament-form">
          <h2>Tournament Details</h2>
          <div className="form-container">
            <form onSubmit={handleAddTournament} className="form-grid">
              <label>
                Tournament ID:
                <input
                  type="text"
                  value={nextId}
                  disabled
                  style={{ backgroundColor: "#f0f0f0", cursor: "not-allowed" }}
                />
              </label>
              <label>
                Tournament Name:
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </label>
              <label>
                Start Date:
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  required
                />
              </label>
              <label>
                End Date:
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  required
                />
              </label>
              {errorMsg && <p className="form-error">{errorMsg}</p>}
              <button type="submit">Add Tournament</button>
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

export default AddTournament;
