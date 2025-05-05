import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import AdminSidebar from "../../components/AdminSidebar";
// import sealImage from '../../assets/icons/KFUPM Seal White.png';
import bgImage from "../../assets/images/Illustration 1@4x.png";
import DeleteTournamentButton from "../../components/DeleteTournamentButton";
import deleteIcon from "../../assets/icons/delete-svgrepo-com.svg";
import "../../stylesheets/DeleteTournaments.css";
import axios from 'axios'
const DeleteTournaments = () => {
  const navigate = useNavigate();
  const username = "john.doe"; // Replace with actual dynamic source later
  const [first, last] = username.split(".");
  const initials = `${first[0]}${last[0]}`.toUpperCase();
  const formattedName = `${first.charAt(0).toUpperCase() + first.slice(1)} ${last.charAt(0).toUpperCase() + last.slice(1)}`;

  const [tournaments, setTournaments] = useState([]);

  useEffect(() => {
    const loadTournaments = () => {

      //load all tournaments
      axios.get('http://localhost:5000/tournaments')
      .then((res) => {
        if (res.data.data.length !== 0) {
          setTournaments(res.data.data)
        }
        throw new Error('There are no tournaments')
      })
      .catch(err => console.error(err))
    };

    loadTournaments();

    window.addEventListener("focus", loadTournaments);
    return () => window.removeEventListener("focus", loadTournaments);
  }, []);

  //delete a tournament
  const handleDeleteTournament = (tournamentId) => {

    //send request to delete tournament

    axios.delete(`http://localhost:5000/admin/tournaments/${tournamentId}`)


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
          <h1>Tournaments</h1>
        </header>
        <section className="tournament-list">
          <h2>Registered Tournaments</h2>
          <div className="tournament-grid scrollable">
            {tournaments.length > 0 ? (
              tournaments.map((tournament) => (
                <div key={tournament.tr_id} className="tournament-card">
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
                        {tournament.tr_name}
                      </span>
                    </h3>
                  </div>
                  <p>
                    <strong>Tournament ID:</strong> {tournament.tr_id}
                  </p>
                  <p>
                    <strong>Start Date:</strong>{" "}
                    {new Date(tournament.start_date).toLocaleDateString("en-GB")}
                  </p>
                  <p>
                    <strong>End Date:</strong>{" "}
                    {new Date(tournament.end_date).toLocaleDateString("en-GB")}
                  </p>
                  <div className="delete-button-wrapper">
                    <DeleteTournamentButton
                      className="delete-tournament-button"
                      tournamentId={tournament.tr_id}
                      onClick={() => {
                        const confirmed = window.confirm(
                          "Are you sure you want to delete this tournament?",
                        );
                        if (confirmed) handleDeleteTournament(tournament.tr_id);
                      }}
                    >
                      <img
                        src={deleteIcon}
                        alt="Delete"
                        className="delete-icon"
                        style={{
                          width: "1.2rem",
                          height: "1.2rem",
                          filter: "invert(1)",
                          objectFit: "contain",
                        }}
                      />
                    </DeleteTournamentButton>
                  </div>
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

export default DeleteTournaments;
