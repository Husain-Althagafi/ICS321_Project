import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import AdminSidebar from "../../components/AdminSidebar";
// import sealImage from '../../assets/icons/KFUPM Seal White.png';
import bgImage from "../../assets/images/Illustration 1@4x.png";
import "../../stylesheets/AddTournament.css";

import axios from 'axios'


const AddTeam = () => {
  const navigate = useNavigate();
  const username = "john.doe"; // Replace with actual dynamic source later
  const [first, last] = username.split(".");
  const initials = `${first[0]}${last[0]}`.toUpperCase();
  const formattedName = `${first.charAt(0).toUpperCase() + first.slice(1)} ${last.charAt(0).toUpperCase() + last.slice(1)}`;

  
  const [teamName, setTeamName] = useState("");
  const [coachName, setCoachName] = useState("");
  const [managerName, setManagerName] = useState("");
  const [errorMsg, setErrorMsg] = useState("");


  const handleAddTeam = (e) => {
    e.preventDefault();
    if (!teamName || !coachName || !managerName) {
      const msg = "All fields are required.";
      setErrorMsg(msg);
      setTimeout(() => alert(msg), 0);
      return;
    }

    const newTeam = {
      team_name: teamName,
      coach_name: coachName,
      manager_name: managerName,
    };

    //Send request to add team 
    axios.post(`http://localhost:5000/admin/teams`, newTeam)
    .then((res)=> {

    // Update persistent team counter

      setTeamName("");
      setCoachName("");
      setManagerName("");
      setErrorMsg("");
      alert("Team added!");
    })
    .catch(err => console.error(err))
     
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
              {/* <label>
                Team ID:
                <input
                  type="text"
                  value={nextTeamId}
                  disabled
                  style={{ backgroundColor: "#f0f0f0", cursor: "not-allowed" }}
                />
              </label> */}
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
