import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import GuestSidebar from "../../components/GuestSidebar";
import "../../stylesheets/MatchesResults.css";
import downIcon from "../../assets/icons/down.png";

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
    const stored = JSON.parse(localStorage.getItem("tournaments")) || [];
    setAvailableTeams(JSON.parse(localStorage.getItem("teams")) || []);
    setVenues(JSON.parse(localStorage.getItem("venues")) || []);
    const tour = stored.find((t) => String(t.id) === tournamentId);
    setMatches(tour?.matches || []);
  }, [tournamentId]);

  // Sort matches by date, then time; equal entries retain original order
  const sortedMatches = [...matches].sort((a, b) => {
    // Primary: date
    const dateDiff = isAscending
      ? a.date.localeCompare(b.date)
      : b.date.localeCompare(a.date);
    if (dateDiff !== 0) return dateDiff;
    // Secondary: startTime
    const timeA = a.startTime || "";
    const timeB = b.startTime || "";
    const timeDiff = isAscending
      ? timeA.localeCompare(timeB)
      : timeB.localeCompare(timeA);
    if (timeDiff !== 0) return timeDiff;
    // Tertiary: equal entries retain original order
    return 0;
  });

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
            <button
              className="return-button-matches"
              type="button"
              onClick={() => navigate("/guest/match-results/tournaments")}
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
                marginBottom: "0rem",
              }}
            >
              ← Back to Tournaments
            </button>
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
            {matches.length > 0 ? (
              sortedMatches.map((m) => {
                const venueName =
                  venues.find((v) => String(v.id) === String(m.venueId))
                    ?.name || "Unknown";
                const computedWinner =
                  m.winner ||
                  (m.scoreA > m.scoreB
                    ? availableTeams.find(
                        (t) => String(t.team_id) === String(m.teamA),
                      )?.team_name || m.teamA
                    : m.scoreB > m.scoreA
                      ? availableTeams.find(
                          (t) => String(t.team_id) === String(m.teamB),
                        )?.team_name || m.teamB
                      : "Draw");
                const motmName =
                  availableTeams
                    .flatMap((t) => t.players || [])
                    .find((p) => p.id === m.motmPlayerId)?.name || "N/A";
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
                const teamAPlayerIds =
                  availableTeams
                    .find((t) => String(t.team_id) === String(m.teamA))
                    ?.players.map((p) => p.id) || [];
                const teamBPlayerIds =
                  availableTeams
                    .find((t) => String(t.team_id) === String(m.teamB))
                    ?.players.map((p) => p.id) || [];
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
                  <div key={m.id} className="match-results-card">
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
                            (t) => String(t.team_id) === String(m.teamA),
                          )?.team_name || m.teamA}
                        </span>{" "}
                        vs{" "}
                        <span className="team-right-gradient">
                          {availableTeams.find(
                            (t) => String(t.team_id) === String(m.teamB),
                          )?.team_name || m.teamB}
                        </span>{" "}
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
                          {formatDate(m.date)}
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
                            setExpandedId(expandedId === m.id ? null : m.id)
                          }
                        >
                          <img
                            src={downIcon}
                            alt={expandedId === m.id ? "Collapse" : "Expand"}
                            style={{
                              width: "1.5rem",
                              height: "1.5rem",
                              transform:
                                expandedId === m.id
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
                        padding: expandedId === m.id ? "0.5rem 1rem" : "0 1rem",
                        maxHeight: expandedId === m.id ? "20rem" : "0",
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
                          <strong>Time:</strong> {m.startTime} - {m.endTime}
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
                              m.scoreA > 0 && setHoveredScoreAId(m.id)
                            }
                            onMouseLeave={() => setHoveredScoreAId(null)}
                          >
                            <span
                              style={{
                                textDecoration:
                                  m.scoreA > 0 ? "underline" : "none",
                                cursor: m.scoreA > 0 ? "help" : "default",
                              }}
                            >
                              {m.scoreA}
                            </span>
                            {hoveredScoreAId === m.id && (
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
                              m.scoreB > 0 && setHoveredScoreBId(m.id)
                            }
                            onMouseLeave={() => setHoveredScoreBId(null)}
                          >
                            <span
                              style={{
                                textDecoration:
                                  m.scoreB > 0 ? "underline" : "none",
                                cursor: m.scoreB > 0 ? "help" : "default",
                              }}
                            >
                              {m.scoreB}
                            </span>
                            {hoveredScoreBId === m.id && (
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
                              hasYellow && setHoveredYellowId(m.id)
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
                            {hasYellow && hoveredYellowId === m.id && (
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
                            onMouseEnter={() => hasRed && setHoveredRedId(m.id)}
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
                            {hasRed && hoveredRedId === m.id && (
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
