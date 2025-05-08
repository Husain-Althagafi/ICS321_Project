import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
// import sealImage from '../../assets/icons/KFUPM Seal White.png';
import bgImage from "../../assets/images/Illustration 1@4x.png";
import "../../stylesheets/TournamentsTables.css";
import GuestSidebar from "../../components/GuestSidebar";

const TournamentsTables = () => {
  const navigate = useNavigate();
  const username = "john.doe"; // Replace with actual dynamic source later
  const [first, last] = username.split(".");
  const initials = `${first[0]}${last[0]}`.toUpperCase();
  const formattedName = `${first.charAt(0).toUpperCase() + first.slice(1)} ${last.charAt(0).toUpperCase() + last.slice(1)}`;

  const [tournaments, setTournaments] = useState([]);
  const [teamsList, setTeamsList] = useState([]);

  const { tournamentId } = useParams();
  const selectedTournament = tournaments.find(
    (t) => String(t.id) === String(tournamentId)
  );

  // Compute standings/stats for each team in the selected tournament
  const standings = selectedTournament?.teamIds.map((teamId) => {
    let played = 0, won = 0, draw = 0, lost = 0, gf = 0, ga = 0;
    (selectedTournament.matches || []).forEach((m) => {
      if (m.teamA === teamId || m.teamB === teamId) {
        if (m.scoreA != null && m.scoreB != null) {
          played++;
          const teamScore = m.teamA === teamId ? m.scoreA : m.scoreB;
          const oppScore = m.teamA === teamId ? m.scoreB : m.scoreA;
          gf += teamScore;
          ga += oppScore;
          if (teamScore > oppScore) won++;
          else if (teamScore < oppScore) lost++;
          else draw++;
        }
      }
    });
    return {
      teamId,
      played,
      won,
      draw,
      lost,
      gf,
      ga,
      gd: gf - ga,
      pts: won * 3 + draw,
    };
  }) || [];
  // Sort standings by points then goal difference then goals for
  standings.sort((a, b) => b.pts - a.pts || b.gd - a.gd || b.gf - a.gf);

  const allMatchesCompleted = selectedTournament?.matches?.every(
    (m) => m.scoreA != null && m.scoreB != null
  );

  useEffect(() => {
    const loadTournaments = () => {
      const stored = localStorage.getItem("tournaments");
      if (stored) {
        setTournaments(JSON.parse(stored));
      }
      setTeamsList(JSON.parse(localStorage.getItem("teams")) || []);
    };

    loadTournaments();

    window.addEventListener("focus", loadTournaments);
    return () => window.removeEventListener("focus", loadTournaments);
  }, []);

  // const handleDeleteTournament = (tournamentId) => {
  //   const confirmed = window.confirm(
  //     "Are you sure you want to delete this tournament?",
  //   );
  //   if (!confirmed) return;
  //   const updated = tournaments.filter(
  //     (t) => String(t.id) !== String(tournamentId),
  //   );
  //   localStorage.setItem("tournaments", JSON.stringify(updated));
  //   setTournaments(updated);
  // };

  return (
    <div className="guest-home">
      <GuestSidebar initials={initials} formattedName={formattedName} />

      <main className="main-content">
        <div className="bg-overlay"></div>
        <header className="topbar">
          <h1>View Tournament Table</h1>
        </header>
        <section className="tournament-list">
          {selectedTournament ? (
            <div style={{ marginBottom: "2rem" }}>
              <h2 style={{ margin: "0 0 1rem 0" }}>
                Tournament: <span className="tournament-name-gradient">{selectedTournament.name}</span>
              </h2>
              <button
              className="return-button-goalscorers"
              type="button"
              onClick={() => navigate("/guest/view-tournament-table")}
              style={{
                // background: "linear-gradient(135deg, #00713d, #00934f)",
                // WebkitBackgroundClip: "text",
                // WebkitTextFillColor: "transparent",
                border: "none",
                padding: "1rem",
                // marginBottom: "0.5rem",
                cursor: "pointer",
                fontSize: "1rem",
                fontWeight: "bold",
                display: "flex",
                alignItems: "center",
                height: "3rem",
                width: "fit-content",
                marginLeft: "0rem",
                marginBottom: "1rem",
              }}
            >
              ← Back to Tournaments
            </button>
              {selectedTournament.teamIds && selectedTournament.teamIds.length > 0 ? (
                <div className="table-container scrollable" style={{height: "70vh", overflowY: "auto", boxShadow: "0 0 10px rgba(0, 0, 0, 0.3)", borderRadius: "0.75rem"}}>
                  <table
                    className="league-table"
                    cellPadding="16"
                    style={{ width: "100%", borderCollapse: "collapse" }}
                  >
                    <thead>
                      <tr>
                        <th>Position</th>
                        <th>Team Name</th>
                        <th>P</th>
                        <th>W</th>
                        <th>D</th>
                        <th>L</th>
                        <th>GF</th>
                        <th>GA</th>
                        <th>GD</th>
                        <th>Pts</th>
                      </tr>
                    </thead>
                    <tbody>
                      {standings.map((row, index) => {
                        // Determine medal style for top 3 if all matches are done
                        let rowStyle = {};
                        if (allMatchesCompleted) {
                          if (index === 0) {
                            rowStyle = {
                              background: 'linear-gradient(135deg,rgb(255, 184, 3),rgb(255, 217, 4), #e2a202)',
                              color: 'white',
                              fontWeight: 'bold',
                              textShadow: '0px 0px 2px rgba(0,0,0,0.2)'
                            };
                          } else if (index === 1) {
                            rowStyle = {
                              background: 'linear-gradient(135deg,rgb(156, 156, 156),rgb(175, 174, 174), #7d7d7d)',
                              color: 'white',
                              fontWeight: 'bold',
                              textShadow: '0px 0px 2px rgba(0,0,0,0.2)'
                            };
                          } else if (index === 2) {
                            rowStyle = {
                              background: 'linear-gradient(135deg,rgb(167, 97, 36), #cd7f32,rgb(172, 88, 15))',
                              color: 'white',
                              fontWeight: 'bold',
                              textShadow: '0px 0px 2px rgba(0,0,0,0.2)'
                            };
                          }
                        }
                        const team = teamsList.find((t) => String(t.team_id) === String(row.teamId));
                        const name = team?.team_name || row.teamId;
                        return (
                          <tr key={row.teamId} style={rowStyle}>
                            <td>{index + 1}</td>
                            <td>{name}</td>
                            <td>{row.played}</td>
                            <td>{row.won}</td>
                            <td>{row.draw}</td>
                            <td>{row.lost}</td>
                            <td>{row.gf}</td>
                            <td>{row.ga}</td>
                            <td>{row.gd}</td>
                            <td>{row.pts}</td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              ) : (
                <p style={{ color: "black" }}>No teams in this tournament.</p>
              )}
            </div>
          ) : (
            <p style={{ color: "black" }}>Tournament not found.</p>
          )}
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

export default TournamentsTables;
