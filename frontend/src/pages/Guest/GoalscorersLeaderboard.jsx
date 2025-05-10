import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import GuestSidebar from "../../components/GuestSidebar";
import "../../stylesheets/GoalscorersLeaderboard.css";
import downIcon from "../../assets/icons/down.png";

const GoalscorersLeaderboard = () => {
  const { tournamentId } = useParams();
  const navigate = useNavigate();
  const username = "john.doe"; // Replace with actual dynamic source later
  const [first, last] = username.split(".");
  const initials = `${first[0]}${last[0]}`.toUpperCase();
  const formattedName = `${first.charAt(0).toUpperCase() + first.slice(1)} ${last.charAt(0).toUpperCase() + last.slice(1)}`;

  const [matches, setMatches] = useState([]);
  const [availableTeams, setAvailableTeams] = useState([]);
  const [scorers, setScorers] = useState([]);
  const [expandedId, setExpandedId] = useState(null);

  // Sort order state for the goalscorers
  const [isAscending, setIsAscending] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [
          tournRes,
          matchesRes,
          matchGoalsRes,
          goalEventsRes,
          playersRes,
          teamsRes
        ] = await Promise.all([
          axios.get("http://localhost:5000/guest/tournaments"),
          axios.get("http://localhost:5000/guest/matches"),
          axios.get("http://localhost:5000/guest/match-goals"),
          axios.get("http://localhost:5000/guest/goal-events"),
          axios.get("http://localhost:5000/guest/players"),
          axios.get("http://localhost:5000/guest/teams"),
        ]);
        const tournaments = tournRes.data.success ? tournRes.data.data : [];
        const allMatches = matchesRes.data.success ? matchesRes.data.data : [];
        const matchGoals = matchGoalsRes.data.success ? matchGoalsRes.data.data : [];
        const goalEvents = goalEventsRes.data.success ? goalEventsRes.data.data : [];
        const playersData = playersRes.data.success ? playersRes.data.data : [];
        const teamsData = teamsRes.data.success ? teamsRes.data.data : [];

        // Build available teams with players
        const teamsWithPlayers = teamsData.map(team => ({
          ...team,
          players: playersData.filter(p => p.team_id === team.team_id)
            .map(p => ({
              id: p.player_id,
              name: p.player_name,
              jerseyNumber: p.jersey_number,
              position: p.position,
              isSubstitute: p.is_substitute,
              team_id: p.team_id,
            }))
        }));
        setAvailableTeams(teamsWithPlayers);

        // Build lookup maps for goals
        const goalTimesByMatch = goalEvents.reduce((acc, ev) => {
          acc[ev.match_id] = acc[ev.match_id] || {};
          acc[ev.match_id][ev.player_id] = acc[ev.match_id][ev.player_id] || [];
          acc[ev.match_id][ev.player_id].push(ev.event_time);
          return acc;
        }, {});
        const goalCountByMatch = matchGoals.reduce((acc, mg) => {
          acc[mg.match_id] = acc[mg.match_id] || {};
          acc[mg.match_id][mg.player_id] = mg.goal_count;
          return acc;
        }, {});

        // Filter matches for this tournament
        const tour = tournaments.find(t => String(t.tournament_id) === tournamentId);
        const tournamentMatches = tour
          ? allMatches.filter(m => String(m.tournament_id) === tournamentId)
          : [];
        const matchesWithEvents = tournamentMatches.map(m => ({
          ...m,
          goals: goalCountByMatch[m.match_id] || {},
          goalTimes: goalTimesByMatch[m.match_id] || {},
          teamA_name: m.teamA_name,
          teamB_name: m.teamB_name,
        }));
        setMatches(matchesWithEvents);
      } catch (err) {
        console.error("Error loading leaderboard data:", err);
      }
    };
    loadData();
  }, [tournamentId]);

  useEffect(() => {
    // Calculate top scorers whenever matches or teams change
    calculateTopScorers();
  }, [matches, availableTeams]);

  const calculateTopScorers = () => {
    // Aggregate goals across all matches
    const goalsMap = {};
    matches.forEach((m) => {
      Object.entries(m.goals || {}).forEach(([pid, count]) => {
        if (!goalsMap[pid]) goalsMap[pid] = 0;
        goalsMap[pid] += count;
      });
    });

    // Get player details
    const allPlayers = availableTeams.flatMap((t) => t.players || []);
    const playerList = Object.entries(goalsMap)
      .map(([pid, count]) => {
        const player = allPlayers.find((p) => p.id === pid);
        const team = availableTeams.find(
          (t) => t.players && t.players.some((p) => p.id === pid),
        );
        return {
          id: pid,
          name: player?.name || pid,
          teamName: team?.team_name || "Unknown Team",
          count,
        };
      })
      .sort((a, b) => b.count - a.count || a.name.localeCompare(b.name));

    setScorers(playerList);
  };

  // Toggle expanded details for a player
  const togglePlayerDetails = (playerId) => {
    setExpandedId(expandedId === playerId ? null : playerId);
  };

  return (
    <div className="admin-home">
      <GuestSidebar initials={initials} formattedName={formattedName} />

      <main className="main-content">
        <div className="bg-overlay"></div>
        <header className="topbar">
          <h1>Top Goalscorers</h1>
        </header>

        <section className="top-goalscorers-results-list">
          <div
            className="leaderboard-header"
            style={{
              marginBottom: "1rem",
            }}
          >
            <h2>Players</h2>
            <div className="return-button-goalscorers-wrapper">
              <button
                className="return-button-goalscorers"
                type="button"
                onClick={() => navigate("/guest/top-goalscorers")}
              >
                ← Back to Tournaments
              </button>
            </div>
          </div>

          <div className="top-goalscorers-grid scrollable">
            {scorers.length > 0 ? (
              // Sort scorers based on the current sorting preference
              [...scorers]
                .sort((a, b) =>
                  isAscending
                    ? a.count - b.count || a.name.localeCompare(b.name)
                    : b.count - a.count || a.name.localeCompare(b.name),
                )
                .map((player, idx) => (
                  <div key={player.id} className="top-goalscorers-card">
                    <div
                      className="top-goalscorers-card-header"
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        flexWrap: "nowrap",
                      }}
                    >
                      <div className="player-info">
                        <span className="player-name">
                          <strong
                            className={
                              idx === 0
                                ? "gold"
                                : idx === 1
                                  ? "silver"
                                  : idx === 2
                                    ? "bronze"
                                    : ""
                            }
                          >
                            {player.name}
                          </strong>{" "}
                          (Team: {player.teamName})
                        </span>
                      </div>

                      <div
                        className="right-side"
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "0.5rem",
                          flexShrink: 0,
                        }}
                      >
                        <strong>Goals: {player.count}</strong>
                        <button
                          type="button"
                          className="info-view-button"
                          style={{
                            padding: 0,
                            background: "none",
                            border: "none",
                            width: "2rem",
                            height: "2rem",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                          }}
                          onClick={() => togglePlayerDetails(player.id)}
                        >
                          <img
                            src={downIcon}
                            alt={
                              expandedId === player.id ? "Collapse" : "Expand"
                            }
                            style={{
                              width: "1.5rem",
                              height: "1.5rem",
                              transform:
                                expandedId === player.id
                                  ? "rotate(180deg)"
                                  : "rotate(0deg)",
                              transition: "transform 0.3s ease",
                            }}
                          />
                        </button>
                      </div>
                    </div>
                    <div
                      className="player-details-expanded"
                      style={{
                        padding:
                          expandedId === player.id ? "0.5rem 1rem" : "0 1rem",
                        maxHeight: expandedId === player.id ? "20rem" : "0",
                        overflow: "hidden",
                        transition: "max-height 0.5s ease, padding 0.5s ease",
                        color: "black",
                      }}
                    >
                      <h4>Goals Details:</h4>
                      <ul className="goal-details-list">
                        {matches
                          .filter(
                            (m) =>
                              m.goals &&
                              m.goals[player.id] &&
                              m.goals[player.id] > 0,
                          )
                          .map((match, index) => {
                            const teamA = availableTeams.find(
                              (t) => String(t.team_id) === String(match.teama_id),
                            );
                            const teamB = availableTeams.find(
                              (t) => String(t.team_id) === String(match.teamb_id),
                            );
                            const playerTeam =
                              teamA &&
                              teamA.players &&
                              teamA.players.some((p) => p.id === player.id)
                                ? teamA.team_name
                                : teamB &&
                                    teamB.players &&
                                    teamB.players.some(
                                      (p) => p.id === player.id,
                                    )
                                  ? teamB.team_name
                                  : "Unknown Team";

                            const matchTitle = `${match.teamA_name || teamA?.team_name || ""} vs ${match.teamB_name || teamB?.team_name || ""}`;
                            const goalCount = match.goals[player.id];
                            const goalTimes =
                              match.goalTimes && match.goalTimes[player.id]
                                ? match.goalTimes[player.id]
                                    .map((time) => `${time}'`)
                                    .join(", ")
                                : "N/A";

                            return (
                              <li key={index} className="goal-match-entry">
                                <div>
                                  <strong>Match:</strong> {matchTitle} (
                                  {new Date(match.match_date).toLocaleDateString(
                                    "en-GB",
                                  )}
                                  )
                                </div>
                                <div>
                                  <strong>Goals:</strong> {goalCount}
                                </div>
                                <div>
                                  <strong>Times:</strong> {goalTimes}
                                </div>
                              </li>
                            );
                          })}
                      </ul>
                    </div>
                  </div>
                ))
            ) : (
              <p style={{ color: "black" }}>No goalscorers recorded yet.</p>
            )}
          </div>
        </section>
      </main>
    </div>
  );
};

export default GoalscorersLeaderboard;
