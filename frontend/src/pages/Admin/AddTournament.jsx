import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
// import sealImage from '../../assets/icons/KFUPM Seal White.png';
import bgImage from "../../assets/images/Illustration 1@4x.png";
import "../../stylesheets/AddTournament.css";
import AdminSidebar from "../../components/AdminSidebar";

//Import axios
import axios from 'axios'

const AddTournament = () => {
  const navigate = useNavigate();
  const username = "john.doe"; // Replace with actual dynamic source later
  const [first, last] = username.split(".");
  const initials = `${first[0]}${last[0]}`.toUpperCase();
  const formattedName = `${first.charAt(0).toUpperCase() + first.slice(1)} ${last.charAt(0).toUpperCase() + last.slice(1)}`;


  const [name, setName] = useState("");
  const [startDate, setStartDate] = useState("");
  const [numTeams, setNumTeams] = useState("2");
  const [endDate, setEndDate] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    if (startDate) {
      const sd = new Date(startDate);
      sd.setDate(sd.getDate() + parseInt(numTeams, 10) - 2);
      const iso = sd.toISOString().split("T")[0];
      setEndDate(iso);
    }
  }, [startDate, numTeams]);

  
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

    const newTournament = {
      tr_name: name,
      start_date: startDate,
      end_date: endDate,
      num_teams: parseInt(numTeams, 10),
    };

    axios.post(`http://localhost:5000/admin/tournaments`, newTournament)
    .catch(err => console.error(err))
    
    setName("");
    setStartDate("");
    setEndDate("");
    setNumTeams("2");
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
              
              {/* <label>                       dont need this since u dont fill in the tournament id
                Tournament ID:
                <input
                  type="text"
                  value={nextId}
                  disabled
                  style={{
                    backgroundColor: "#f0f0f0",
                    color: "#666",
                    cursor: "not-allowed",
                  }}
                />
              </label> */}



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
                <input type="date" value={endDate} disabled readOnly />
              </label>
              <label>
                Number of Teams:
                <select
                  value={numTeams}
                  onChange={(e) => setNumTeams(e.target.value)}
                  required
                >
                  {[2, 4, 6, 8, 10, 12].map((n) => (
                    <option key={n} value={String(n)}>
                      {n}
                    </option>
                  ))}
                </select>
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
