import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import AdminSidebar from "../../components/AdminSidebar";
import "../../stylesheets/Matches_DetailedMatchStats.css";
import axios from 'axios'
const Matches_DetailedMatchStats = () => {
  // Helper to format yyyy-mm-dd to dd-mm-yyyy
  const formatDate = (dateString) => {
    if (!dateString) return "";
    const [y, m, d] = dateString.split("-");
    return `${d}-${m}-${y}`;
  };

  const { tournamentId } = useParams();
  const navigate = useNavigate();
  const username = "john.doe"; // Replace with actual dynamic source later
  const [first, last] = username.split(".");
  const initials = `${first[0]}${last[0]}`.toUpperCase();
  const formattedName = `${first.charAt(0).toUpperCase() + first.slice(1)} ${last.charAt(0).toUpperCase() + last.slice(1)}`;

  const [matches, setMatches] = useState([]);
  const [availableTeams, setAvailableTeams] = useState([]);

  useEffect(() => {

    // get all matches for this tournament
    axios.get(`http://localhost:5000/tournaments/${tournamentId}/matches`)
    .then((res) => {
      setMatches(res.data.data)
    })
    .catch(err=>console.error(err))


    //get all teams in the tournament
    //availableTeams is all the teams in the tournament
    axios.get(`http://localhost:5000/tournaments/${tournamentId}/teams`)
    .then((res) => {
      setAvailableTeams(res.data.data.teams)
    })
    .catch(err => console.error(err))

    setMatches(matches || []);
  }, [tournamentId]);

  return (
    <div className="admin-home">
      <AdminSidebar initials={initials} formattedName={formattedName} />

      <main className="main-content">
        <div className="bg-overlay"></div>
        <header className="topbar">
          <h1>Detailed Match Stats</h1>
        </header>

        <section className="match-list">
          <h2>Choose the Match</h2>
          <div className="match-grid scrollable">
            {matches.length > 0 ? (
              matches.map((m) => {
                const computedWinner =
                  m.winner ||
                  (m.scoreA > m.scoreB
                    ? availableTeams.find(
                        (t) => String(t.team_id) === String(m.teama_id),
                      )?.team_name || m.teama_id
                    : m.scoreB > m.scoreA
                      ? availableTeams.find(
                          (t) => String(t.team_id) === String(m.teamb_id),
                        )?.team_name || m.teamb_id
                      : "Draw");
                return (
                  <div key={m.match_id} className="match-card">
                    <div
                      className="match-card-header"
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                      }}
                    >
                      <h3 style={{ margin: 0 }}>
                        Match Id:{ ' '+m.match_id}
                        <span className="match-name-gradient">{m.id}</span>
                      </h3>
                    </div>
                    <p>
                      <strong>Teams:</strong>{" "}
                      {availableTeams.find(
                        (t) => String(t.team_id) === String(m.team1),
                      )?.team_name || m.team1}{" "}
                      vs{" "}
                      {availableTeams.find(
                        (t) => String(t.team_id) === String(m.team2),
                      )?.team_name || m.team2}
                    </p>
                    <p>
                      <strong>Date:</strong> {formatDate(m.match_date.split("T")[0])}
                    </p>
                    <p>
                      <strong>Time:</strong> {m.start_time || 'no time set'} - {m.end_time || 'no time set'}
                    </p>
                    {localStorage.getItem(`match-completed-${m.id}`) ===
                      "true" && (
                      <p>
                        <strong>Match Winner:</strong>{" "}
                        {computedWinner === "Draw" ? (
                          <span className="draw-gradient">
                            {computedWinner}
                          </span>
                        ) : (
                          <span className="winner-gradient">
                            {computedWinner}
                          </span>
                        )}
                      </p>
                    )}
                    <button
                      type="button"
                      className="edit-button"
                      onClick={() =>
                        navigate(
                          `/admin/detailed-match-stats/${tournamentId}/${m.match_id}/match-stats`,
                        )
                      }
                    >
                      View
                    </button>
                  </div>
                );
              })
            ) : (
              <p style={{ color: "black" }}>
                No matches have been registered yet.
              </p>
            )}
          </div>
        </section>
      </main>
    </div>
  );
};

export default Matches_DetailedMatchStats;
