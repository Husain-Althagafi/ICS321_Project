import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import "../../stylesheets/TournamentsTables.css";
import GuestSidebar from "../../components/GuestSidebar";
import axios from "axios";

const TournamentsTables = () => {
  const navigate = useNavigate();
  const username = "john.doe"; // Replace with actual dynamic source later
  const [first, last] = username.split(".");
  const initials = `${first[0]}${last[0]}`.toUpperCase();
  const formattedName = `${first.charAt(0).toUpperCase() + first.slice(1)} ${last.charAt(0).toUpperCase() + last.slice(1)}`;

  const [tournaments, setTournaments] = useState([]);

  const { tournamentId } = useParams();
  const selectedTournament = tournaments[0];

  // Compute standings/stats for each team in the selected tournament
  const standings =
    selectedTournament?.teamIds.map((teamId) => {
      let played = 0,
        won = 0,
        draw = 0,
        lost = 0,
        gf = 0,
        ga = 0;
      (selectedTournament.matches || []).forEach((m) => {
        if (m.teama_id === teamId || m.teamb_id === teamId) {
          if (m.match_completed != null && m.match_completed != null) {
            played++;
            const teamScore = m.teama_id === teamId ? m.scorea : m.scoreb;
            const oppScore = m.teama_id === teamId ? m.scoreb : m.scorea;
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
    (m) => m.match_completed != null && m.match_completed != null,
  );

  useEffect(() => {
    const loadData = async () => {
      try {
        const [tournRes, tournTeamsRes, matchesRes] = await Promise.all([
          axios.get("http://localhost:5000/guest/tournaments"),
          axios.get("http://localhost:5000/guest/tournament-teams"),
          axios.get("http://localhost:5000/guest/matches"),
        ]);
        const tournData = tournRes.data.success ? tournRes.data.data : [];
        const tournTeamsData = tournTeamsRes.data.success ? tournTeamsRes.data.data : [];
        const matchesData = matchesRes.data.success ? matchesRes.data.data : [];
        setTournaments(tournData);
        // Filter tournament teams for this tournament
        const tournamentTeams = tournTeamsData.filter(
          (tt) => String(tt.tournament_id) === String(tournamentId)
        );
        const teamIds = tournamentTeams.map((tt) => tt.team_id);
        const teamNameMap = Object.fromEntries(
          tournamentTeams.map((tt) => [String(tt.team_id), tt.team_name])
        );
        // Filter matches for this tournament
        const tournamentMatches = matchesData.filter(
          (m) => String(m.tournament_id) === tournamentId
        );
        // Attach matches, teamIds and teamNameMap to selectedTournament-like object
        const tour = tournData.find(
          (t) => String(t.tournament_id) === String(tournamentId)
        ) || {};
        tour.matches = tournamentMatches;
        tour.teamIds = teamIds;
        tour.teamNameMap = teamNameMap;
        setTournaments([tour]); // so selectedTournament is from state
      } catch (err) {
        console.error("Error loading tournaments data:", err);
      }
    };
    loadData();
  }, [tournamentId]);
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
                Tournament:{" "}
                <span className="tournament-name-gradient">
                  {selectedTournament.name}
                </span>
              </h2>
              <div className="return-button-wrapper">
                <button
                  className="return-button-tables"
                  type="button"
                  onClick={() => navigate("/guest/view-tournament-table")}
                >
                  ← Back to Tournaments
                </button>
              </div>
              {selectedTournament.teamIds &&
              selectedTournament.teamIds.length > 0 ? (
                <div
                  className="table-container scrollable"
                  style={{
                    height: "65vh",
                    overflowY: "auto",
                    borderRadius: "0.75rem",
                    padding: "1rem",
                  }}
                >
                  <table
                    className="league-table"
                    cellPadding="16"
                    style={{
                      width: "100%",
                      borderCollapse: "collapse",
                      boxShadow: "0 0 10px rgba(0, 0, 0, 0.3)",
                    }}
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
                              background:
                                "linear-gradient(135deg,rgb(255, 184, 3),rgb(255, 217, 4), #e2a202)",
                              color: "white",
                              fontWeight: "bold",
                              textShadow: "0px 0px 2px rgba(0,0,0,0.2)",
                            };
                          } else if (index === 1) {
                            rowStyle = {
                              background:
                                "linear-gradient(135deg,rgb(156, 156, 156),rgb(175, 174, 174), #7d7d7d)",
                              color: "white",
                              fontWeight: "bold",
                              textShadow: "0px 0px 2px rgba(0,0,0,0.2)",
                            };
                          } else if (index === 2) {
                            rowStyle = {
                              background:
                                "linear-gradient(135deg,rgb(167, 97, 36), #cd7f32,rgb(172, 88, 15))",
                              color: "white",
                              fontWeight: "bold",
                              textShadow: "0px 0px 2px rgba(0,0,0,0.2)",
                            };
                          }
                        }
                        const name = selectedTournament.teamNameMap[String(row.teamId)] || row.teamId;
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
      </main>
    </div>
  );
};

export default TournamentsTables;
