import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import GuestSidebar from "../../components/GuestSidebar";
import "../../stylesheets/MatchesResults.css";
import downIcon from "../../assets/icons/down.png";
import axios from "axios";

const MatchesResults = () => {
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
  const [venues, setVenues] = useState([]);
  const [expandedId, setExpandedId] = useState(null);
  const [hoveredYellowId, setHoveredYellowId] = useState(null);
  const [hoveredRedId, setHoveredRedId] = useState(null);
  // For score hover tooltips
  const [hoveredScoreAId, setHoveredScoreAId] = useState(null);
  const [hoveredScoreBId, setHoveredScoreBId] = useState(null);

  // Sort order state: false = descending (latest first), true = ascending (oldest first)
  const [isAscending, setIsAscending] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [
          matchesRes,
          teamsRes,
          venuesRes,
          playersRes,
          yellowRes,
          redRes,
          goalEventsRes,
          matchGoalsRes,
        ] = await Promise.all([
          axios.get("http://localhost:5000/guest/matches"),
          axios.get("http://localhost:5000/guest/teams"),
          axios.get("http://localhost:5000/guest/venues"),
          axios.get("http://localhost:5000/guest/players"),
          axios.get("http://localhost:5000/guest/cards/yellow"),
          axios.get("http://localhost:5000/guest/cards/red"),
          axios.get("http://localhost:5000/guest/goal-events"),
          axios.get("http://localhost:5000/guest/match-goals"),
        ]);

        const matchesData = matchesRes.data.success ? matchesRes.data.data : [];
        const teamsData = teamsRes.data.success ? teamsRes.data.data : [];
        const venuesData = venuesRes.data.success ? venuesRes.data.data : [];
        const playersData = playersRes.data.success ? playersRes.data.data : [];
        const yellowEvents = yellowRes.data.success ? yellowRes.data.data : [];
        const redEvents = redRes.data.success ? redRes.data.data : [];
        const goalEvents = goalEventsRes.data.success ? goalEventsRes.data.data : [];
        const matchGoals = matchGoalsRes.data.success ? matchGoalsRes.data.data : [];

        // Build teams with nested players
        const teamsWithPlayers = teamsData.map((team) => ({
          ...team,
          players: playersData.filter((p) => p.team_id === team.team_id),
        }));

        setAvailableTeams(teamsWithPlayers);
        setVenues(venuesData);

        // Build goalTimesByMatch: { [match_id]: { [player_id]: [event_time, ...] } }
        const goalTimesByMatch = goalEvents.reduce((acc, ev) => {
          acc[ev.match_id] = acc[ev.match_id] || {};
          acc[ev.match_id][ev.player_id] = acc[ev.match_id][ev.player_id] || [];
          acc[ev.match_id][ev.player_id].push(ev.event_time);
          return acc;
        }, {});
        // Build goalCountByMatch: { [match_id]: { [player_id]: goal_count } }
        const goalCountByMatch = matchGoals.reduce((acc, mg) => {
          acc[mg.match_id] = acc[mg.match_id] || {};
          acc[mg.match_id][mg.player_id] = mg.goal_count;
          return acc;
        }, {});

        // Filter matches for this tournament
        const tournamentMatches = matchesData.filter(
          (m) => String(m.tournament_id) === tournamentId
        );
        // Attach card events and goalTimes/goals to each match object
        const matchesWithEvents = tournamentMatches.map((m) => {
          const yellowCards = yellowEvents
            .filter((ev) => ev.match_id === m.match_id)
            .map((ev) => ev.event_time);
          const redCards = redEvents
            .filter((ev) => ev.match_id === m.match_id)
            .map((ev) => ev.event_time);
          return {
            ...m,
            yellowCards,
            redCards,
            goalTimes: goalTimesByMatch[m.match_id] || {},
            goals: goalCountByMatch[m.match_id] || {},
          };
        });
        setMatches(matchesWithEvents);

      } catch (err) {
        console.error("Error loading data:", err);
        navigate("/guest/match-results/tournaments");
      }
    };
    loadData();
  }, [tournamentId, navigate]);

  // Sort matches by date, then time; equal entries retain original order
  const sortedMatches = [...matches].sort((a, b) => {
    // Primary: match_date
    const dateDiff = isAscending
      ? (a.match_date || "").localeCompare(b.match_date || "")
      : (b.match_date || "").localeCompare(a.match_date || "");
    if (dateDiff !== 0) return dateDiff;
    // Secondary: start_time
    const timeA = a.start_time || "";
    const timeB = b.start_time || "";
    const timeDiff = isAscending
      ? timeA.localeCompare(timeB)
      : timeB.localeCompare(timeA);
    if (timeDiff !== 0) return timeDiff;
    // Tertiary: equal entries retain original order
    return 0;
  });
  const completedMatches = sortedMatches.filter(
    (m) => m.match_completed != null
  );

  return (
    <div className="admin-home">
      <GuestSidebar initials={initials} formattedName={formattedName} />

      <main className="main-content">
        <div className="bg-overlay"></div>
        <header className="topbar">
          <h1>Matches Results</h1>
        </header>

        <section className="match-results-results-list">
          <h2>Completed Matches</h2>
          <div className="top-buttons">
            <div className="return-button-matches-wrapper">
              <button
                className="return-button-matches"
                type="button"
                onClick={() => navigate("/guest/match-results/tournaments")}
              >
                ← Back to Tournaments
              </button>
            </div>
            <button
              className="sort-button"
              style={{
                marginBottom: "1rem",
                marginRight: "0",
                width: "fit-content",
              }}
              onClick={() => setIsAscending(!isAscending)}
            >
              Sorted by Date:{" "}
              <span className="winner-gradient">
                {isAscending ? "Oldest" : "Latest"}
              </span>
            </button>
          </div>
          <div className="match-results-grid scrollable">
            {completedMatches.length > 0 ? (
              completedMatches.map((m) => {
                const venueName =
                  venues.find((v) => String(v.venue_id) == String(m.venue_id))
                    ?.venue_name || "Unknown";
                let computedWinner;
                if (m.scorea == null && m.scoreb == null) {
                  computedWinner = "Draw";
                } else {
                  computedWinner =
                    m.winner_team_id
                      ? availableTeams.find(
                          (t) => String(t.team_id) === String(m.winner_team_id)
                        )?.team_name || m.winner_team_id
                      : (m.scorea > m.scoreb
                          ? availableTeams.find(
                              (t) => String(t.team_id) === String(m.teama_id),
                            )?.team_name || m.teama_id
                          : m.scoreb > m.scorea
                            ? availableTeams.find(
                                (t) => String(t.team_id) === String(m.teamb_id),
                              )?.team_name || m.teamb_id
                            : "Draw");
                }
                const motmName =
                  availableTeams
                    .flatMap((t) => t.players || [])
                    .find((p) => p.player_id === m.motm_player_id)?.player_name || "N/A";
                // Compute yellow card details and count
                let yellowDetails;
                let yellowCount;
                if (Array.isArray(m.yellowCards)) {
                  yellowDetails = m.yellowCards.map((t) => `(${t}')`);
                  yellowCount = m.yellowCards.length;
                } else {
                  yellowDetails = Object.entries(m.yellowCards || {}).flatMap(
                    ([pid, times]) =>
                      (times || []).map((t) => {
                        const player = availableTeams
                          .flatMap((team) => team.players || [])
                          .find((p) => p.id === pid);
                        return `${player?.name || pid} (${t}')`;
                      }),
                  );
                  yellowCount = Object.values(m.yellowCards || {}).flat()
                    .length;
                }
                const hasYellow = yellowCount > 0;
                // Compute red card details and count
                let redDetails;
                let redCount;
                if (Array.isArray(m.redCards)) {
                  redDetails = m.redCards.map((t) => `(${t}')`);
                  redCount = m.redCards.length;
                } else {
                  redDetails = Object.entries(m.redCards || {}).flatMap(
                    ([pid, times]) =>
                      (Array.isArray(times) ? times : [times]).map((t) => {
                        const player = availableTeams
                          .flatMap((team) => team.players || [])
                          .find((p) => p.id === pid);
                        return `${player?.name || pid} (${t}')`;
                      }),
                  );
                  redCount = Object.values(m.redCards || {}).flat().length;
                }
                const hasRed = redCount > 0;
                // Derive scorer player IDs for each team (for tooltip with goal times)
                const goalEntries = Object.entries(m.goals || {}); // [ [pid, count], ... ]
                // Get player IDs for each team
                const teamAPlayerIds = (
                  availableTeams.find(
                    (t) => String(t.team_id) === String(m.teama_id),
                  )?.players || []
                ).map((p) => p.id);

                const teamBPlayerIds = (
                  availableTeams.find(
                    (t) => String(t.team_id) === String(m.teamb_id),
                  )?.players || []
                ).map((p) => p.id);
                // Filter for player IDs with goals for each team
                const scorerNamesA = goalEntries
                  .filter(
                    ([pid, count]) => teamAPlayerIds.includes(pid) && count > 0,
                  )
                  .map(([pid]) => pid);
                const scorerNamesB = goalEntries
                  .filter(
                    ([pid, count]) => teamBPlayerIds.includes(pid) && count > 0,
                  )
                  .map(([pid]) => pid);
                return (
                  <div key={m.match_id} className="match-results-card">
                    <div
                      className="match-results-card-header"
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                      }}
                    >
                      <h3
                        className="match-results-teams"
                        style={{ marginTop: "1rem", marginBottom: "1rem" }}
                      >
                        <span className="team-left-gradient">
                          {availableTeams.find(
                            (t) => String(t.team_id) === String(m.teama_id),
                          )?.team_name || m.teama_id}
                        </span>{" "}
                        vs{" "}
                        <span className="team-right-gradient">
                          {availableTeams.find(
                            (t) => String(t.team_id) === String(m.teamb_id),
                          )?.team_name || m.teamb_id}
                        </span>{" "}
                        {computedWinner === "Match not completed" ? (
                          <> (Match Not Completed) </>
                        ) : (
                          <>
                            (Match Winner:{" "}
                            {computedWinner === "Draw" ? (
                              <span className="draw-gradient">
                                {computedWinner}
                              </span>
                            ) : (
                              <span className="winner-gradient">
                                {computedWinner}
                              </span>
                            )}
                            )
                          </>
                        )}
                      </h3>
                      <div
                        className="box-right-side"
                        style={{
                          width: "fit-content",
                          display: "flex",
                          alignItems: "center",
                          columnGap: "1rem",
                        }}
                      >
                        <span
                          className="match-date"
                          style={{ marginRight: "0.5rem", fontWeight: "bold" }}
                        >
                          {formatDate(m.match_date.split("T")[0])}
                        </span>
                        <button
                          type="button"
                          className="result-view-button"
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
                          onClick={() =>
                            setExpandedId(expandedId === m.match_id ? null : m.match_id)
                          }
                        >
                          <img
                            src={downIcon}
                            alt={expandedId === m.match_id ? "Collapse" : "Expand"}
                            style={{
                              width: "1.5rem",
                              height: "1.5rem",
                              transform:
                                expandedId === m.match_id
                                  ? "rotate(180deg)"
                                  : "rotate(0deg)",
                              transition: "transform 0.3s ease",
                            }}
                          />
                        </button>
                      </div>
                    </div>
                    <div
                      className="match-details-expanded"
                      style={{
                        padding: expandedId === m.match_id ? "0.5rem 1rem" : "0 1rem",
                        maxHeight: expandedId === m.match_id ? "20rem" : "0",
                        overflow: "hidden",
                        transition: "max-height 0.5s ease, padding 0.5s ease",
                        color: "black",
                      }}
                    >
                      <>
                        <p>
                          <strong>Venue:</strong> {venueName}
                        </p>
                        <p>
                          <strong>Time:</strong> {m.start_time} - {m.end_time}
                        </p>
                        <p>
                          <strong>Score:</strong> {/* Team A score */}
                          <div
                            style={{
                              display: "inline-block",
                              position: "relative",
                              marginRight: "0.25rem",
                            }}
                            onMouseEnter={() =>
                              m.scorea > 0 && setHoveredScoreAId(m.match_id)
                            }
                            onMouseLeave={() => setHoveredScoreAId(null)}
                          >
                            <span
                              style={{
                                textDecoration:
                                  m.scorea > 0 ? "underline" : "none",
                                cursor: m.scorea > 0 ? "help" : "default",
                              }}
                            >
                              {m.scorea || 0}
                            </span>
                            {hoveredScoreAId === m.match_id && (
                              <div
                                style={{
                                  position: "absolute",
                                  bottom: "100%",
                                  left: 0,
                                  backgroundColor: "white",
                                  border: "1px solid #ccc",
                                  borderRadius: "0.5rem",
                                  boxShadow: "0 0.25rem 0.5rem rgba(0,0,0,0.1)",
                                  padding: "0.5rem",
                                  zIndex: 10,
                                  color: "black",
                                  whiteSpace: "nowrap",
                                }}
                              >
                                <strong>Scorers:</strong>
                                <ul
                                  style={{
                                    margin: "0.25rem 0 0",
                                    paddingLeft: "1rem",
                                  }}
                                >
                                  {scorerNamesA.map((pid, i) => {
                                    const player = availableTeams
                                      .flatMap((team) => team.players || [])
                                      .find((p) => p.id === pid);
                                    const times = m.goalTimes?.[pid] || [];
                                    return (
                                      <li key={i}>
                                        {player?.name || pid} (
                                        {times.map((t) => `${t}'`).join(", ")})
                                      </li>
                                    );
                                  })}
                                </ul>
                              </div>
                            )}
                          </div>
                          – {/* separator */}
                          {/* Team B score */}
                          <div
                            style={{
                              display: "inline-block",
                              position: "relative",
                              marginLeft: "0.25rem",
                            }}
                            onMouseEnter={() =>
                              m.scoreb > 0 && setHoveredScoreBId(m.match_id)
                            }
                            onMouseLeave={() => setHoveredScoreBId(null)}
                          >
                            <span
                              style={{
                                textDecoration:
                                  m.scoreb > 0 ? "underline" : "none",
                                cursor: m.scoreb > 0 ? "help" : "default",
                              }}
                            >
                              {m.scoreb ||0}
                            </span>
                            {hoveredScoreBId === m.match_id && (
                              <div
                                style={{
                                  position: "absolute",
                                  bottom: "100%",
                                  left: 0,
                                  backgroundColor: "white",
                                  border: "1px solid #ccc",
                                  borderRadius: "0.5rem",
                                  boxShadow: "0 0.25rem 0.5rem rgba(0,0,0,0.1)",
                                  padding: "0.5rem",
                                  zIndex: 10,
                                  color: "black",
                                  whiteSpace: "nowrap",
                                }}
                              >
                                <strong>Scorers:</strong>
                                <ul
                                  style={{
                                    margin: "0.25rem 0 0",
                                    paddingLeft: "1rem",
                                  }}
                                >
                                  {scorerNamesB.map((pid, i) => {
                                    const player = availableTeams
                                      .flatMap((team) => team.players || [])
                                      .find((p) => p.id === pid);
                                    const times = m.goalTimes?.[pid] || [];
                                    return (
                                      <li key={i}>
                                        {player?.name || pid} (
                                        {times.map((t) => `${t}'`).join(", ")})
                                      </li>
                                    );
                                  })}
                                </ul>
                              </div>
                            )}
                          </div>
                        </p>
                        <p>
                          <strong>Winner:</strong> {computedWinner}
                        </p>
                        <p>
                          <strong>Yellow Cards:</strong>{" "}
                          <div
                            style={{
                              display: "inline-block",
                              position: "relative",
                            }}
                            onMouseEnter={() =>
                              hasYellow && setHoveredYellowId(m.match_id)
                            }
                            onMouseLeave={() =>
                              hasYellow && setHoveredYellowId(null)
                            }
                          >
                            <span
                              style={{
                                textDecoration: hasYellow
                                  ? "underline"
                                  : "none",
                                cursor: hasYellow ? "help" : "default",
                              }}
                            >
                              {yellowCount}
                            </span>
                            {hasYellow && hoveredYellowId === m.match_id && (
                              <div
                                style={{
                                  position: "absolute",
                                  bottom: "100%",
                                  top: "auto",
                                  left: 0,
                                  backgroundColor: "white",
                                  border: "1px solid #ccc",
                                  borderRadius: "0.5rem",
                                  boxShadow: "0 0.25rem 0.5rem rgba(0,0,0,0.1)",
                                  padding: "0.5rem",
                                  zIndex: 10,
                                  color: "black",
                                  maxHeight: "8rem",
                                  overflowY: "auto",
                                  whiteSpace: "nowrap",
                                }}
                              >
                                <strong>Yellow Cards Details:</strong>
                                <ul
                                  style={{
                                    margin: "0.5rem 0 0",
                                    paddingLeft: "1rem",
                                  }}
                                >
                                  {yellowDetails.map((d, idx) => (
                                    <li key={idx}>{d}</li>
                                  ))}
                                </ul>
                              </div>
                            )}
                          </div>
                        </p>
                        <p>
                          <strong>Red Cards:</strong>{" "}
                          <div
                            style={{
                              display: "inline-block",
                              position: "relative",
                            }}
                            onMouseEnter={() => hasRed && setHoveredRedId(m.match_id)}
                            onMouseLeave={() => hasRed && setHoveredRedId(null)}
                          >
                            <span
                              style={{
                                textDecoration: hasRed ? "underline" : "none",
                                cursor: hasRed ? "help" : "default",
                              }}
                            >
                              {redCount}
                            </span>
                            {hasRed && hoveredRedId === m.match_id && (
                              <div
                                style={{
                                  position: "absolute",
                                  bottom: "100%",
                                  left: 0,
                                  backgroundColor: "white",
                                  border: "1px solid #ccc",
                                  borderRadius: "0.5rem",
                                  boxShadow: "0 0.25rem 0.5rem rgba(0,0,0,0.1)",
                                  padding: "0.5rem",
                                  zIndex: 10,
                                  color: "black",
                                  maxHeight: "8rem",
                                  overflowY: "auto",
                                  whiteSpace: "nowrap",
                                }}
                              >
                                <strong>Red Cards Details:</strong>
                                <ul
                                  style={{
                                    margin: "0.5rem 0 0",
                                    paddingLeft: "1rem",
                                  }}
                                >
                                  {redDetails.map((d, idx) => (
                                    <li key={idx}>{d}</li>
                                  ))}
                                </ul>
                              </div>
                            )}
                          </div>
                        </p>
                        <p>
                          <strong>Man of the Match:</strong> {motmName}
                        </p>
                      </>
                    </div>
                  </div>
                );
              })
            ) : (
              <p style={{ color: "black" }}>
                No matches have been completed yet.
              </p>
            )}
          </div>
        </section>
      </main>
    </div>
  );
};

export default MatchesResults;
