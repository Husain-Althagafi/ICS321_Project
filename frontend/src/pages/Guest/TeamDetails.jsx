import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import GuestSidebar from "../../components/GuestSidebar";
import DeleteTeamButton from "../../components/DeleteTeamButton";
// import sealImage from '../../assets/icons/KFUPM Seal White.png';
import bgImage from "../../assets/images/Illustration 1@4x.png";
import "../../stylesheets/TeamDetails.css";
import yellowCardIcon from "../../assets/icons/yellow_card.svg";
import redCardIcon from "../../assets/icons/red_card.png";

const TeamDetails = () => {
  const navigate = useNavigate();
  const { teamId } = useParams();
  const username = "john.doe"; // Replace with actual dynamic source later
  const [first, last] = username.split(".");
  const initials = `${first[0]}${last[0]}`.toUpperCase();
  const formattedName = `${first.charAt(0).toUpperCase() + first.slice(1)} ${last.charAt(0).toUpperCase() + last.slice(1)}`;

  const [teams, setTeams] = useState(() => {
    const stored = localStorage.getItem("teams");
    return stored ? JSON.parse(stored) : [];
  });
  const [teamName, setTeamName] = useState("");
  const [coachName, setCoachName] = useState("");
  const [managerName, setManagerName] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [players, setPlayers] = useState([]);
  const [newPlayer, setNewPlayer] = useState("");
  const [showPlayerModal, setShowPlayerModal] = useState(false);
  const [playerDetails, setPlayerDetails] = useState({
    id: "",
    name: "",
    jerseyNumber: "",
    position: "",
    isSubstitute: false,
  });
  const [playerError, setPlayerError] = useState("");
  const [viewPlayerModal, setViewPlayerModal] = useState(false);
  const [selectedPlayer, setSelectedPlayer] = useState(null);
  const [editPlayerModal, setEditPlayerModal] = useState(false);

  // Card modals state
  const [showYellowModal, setShowYellowModal] = useState(false);
  const [showRedModal, setShowRedModal] = useState(false);
  const [yellowCardPlayer, setYellowCardPlayer] = useState(null);
  const [redCardPlayer, setRedCardPlayer] = useState(null);

  // Match dropdown state for card modals
  const [teamMatches, setTeamMatches] = useState([]);
  const [selectedYellowMatch, setSelectedYellowMatch] = useState("");
  const [selectedRedMatch, setSelectedRedMatch] = useState("");

  // Carded players lists for modals
  const [yellowCardList, setYellowCardList] = useState([]);
  const [redCardList, setRedCardList] = useState([]);

  useEffect(() => {
    const storedTeams = JSON.parse(localStorage.getItem("teams")) || [];
    // Pull all matches from every tournament
    const tournaments = JSON.parse(localStorage.getItem("tournaments")) || [];
    const allMatches = tournaments.reduce((acc, tour) => {
      return acc.concat(tour.matches || []);
    }, []);
    const team = storedTeams.find((t) => String(t.team_id) === teamId);
    if (team) {
      setTeamName(team.team_name);
      setCoachName(team.coach_name);
      setManagerName(team.manager_name || "");
      setTeams(storedTeams);
      setPlayers(team.players || []);
      // Find all matches where this team played (as teamA or teamB)
      const playedMatches = allMatches.filter(
        (m) => String(m.teamA) === teamId || String(m.teamB) === teamId,
      );
      setTeamMatches(playedMatches);
    } else {
      navigate("/guest/teams");
    }
  }, [teamId, navigate]);

  const handleUpdateTeam = (e) => {
    e.preventDefault();
    if (!teamName || !coachName || !managerName) {
      const msg = "All fields are required.";
      setErrorMsg(msg);
      setTimeout(() => alert(msg), 0);
      return;
    }
    const updatedTeams = teams.map((t) =>
      String(t.team_id) === teamId
        ? {
            ...t,
            team_name: teamName,
            coach_name: coachName,
            manager_name: managerName,
            players,
          }
        : t,
    );
    localStorage.setItem("teams", JSON.stringify(updatedTeams));
    navigate("/guest/teams");
  };

  const handleAddPlayer = () => {
    if (newPlayer.trim() === "") return;
    setPlayers((prev) => [...prev, newPlayer.trim()]);
    setNewPlayer("");
  };

  const handleDeleteTeam = () => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this team?",
    );
    if (!confirmDelete) return;

    const updatedTeams = teams.filter((t) => String(t.team_id) !== teamId);
    localStorage.setItem("teams", JSON.stringify(updatedTeams));
    navigate("/guest/teams");
  };

  // Helper to format YYYY-MM-DD to DD/MM/YYYY
  const formatDateBR = (isoDate) => {
    const [year, month, day] = isoDate.split("-");
    return `${day}/${month}/${year}`;
  };

  // Helper to get a team name by ID
  const getTeamName = (id) => {
    const t = teams.find((team) => String(team.team_id) === String(id));
    return t ? t.team_name : id;
  };

  return (
    <div className="guest-home">
      <GuestSidebar initials={initials} formattedName={formattedName} />

      <main className="main-content">
        <div className="bg-overlay"></div>
        <header className="topbar">
          <h1>Teams</h1>
        </header>

        <section className="tournament-form">
          <div className="form-container">
            <button
              className="return-button"
              type="button"
              onClick={() => navigate("/guest/browse-teams")}
              style={{
                // background: "linear-gradient(135deg, #00713d, #00934f)",
                // WebkitBackgroundClip: "text",
                // WebkitTextFillColor: "transparent",
                border: "none",
                padding: "1rem",
                marginBottom: "0.5rem",
                cursor: "pointer",
                fontSize: "1rem",
                fontWeight: "bold",
                display: "flex",
                alignItems: "center",
                height: "3rem",
                width: "fit-content",
                marginLeft: "0rem",
                marginBottom: "0rem"
              }}
            >
              ← Back to Teams
            </button>
            <h2>Team Details</h2>
            <div className="edit-team-content">
              <form onSubmit={handleUpdateTeam} className="form-grid">
                <label>
                  Team ID:
                  <input
                    type="text"
                    value={teamId}
                    disabled
                    style={{
                      backgroundColor: "#e0e0e0",
                      color: "#666",
                      cursor: "not-allowed",
                    }}
                  />
                </label>
                <label>
                  Team Name:
                  <input
                    type="text"
                    value={teamName}
                    disabled
                    style={{
                      backgroundColor: "#e0e0e0",
                      color: "#666",
                      cursor: "not-allowed",
                    }}
                  />
                </label>
                <label>
                  Coach Name:
                  <input
                    type="text"
                    value={coachName}
                    disabled
                    style={{
                      backgroundColor: "#e0e0e0",
                      color: "#666",
                      cursor: "not-allowed",
                    }}
                  />
                </label>
                <label>
                  Manager Name:
                  <input
                    type="text"
                    value={managerName}
                    disabled
                    style={{
                      backgroundColor: "#e0e0e0",
                      color: "#666",
                      cursor: "not-allowed",
                    }}
                  />
                </label>
              </form>
              <div
                className="players-list"
                style={{
                  display: "flex",
                  flexDirection: "column",
                  height: "40vh",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "0.5rem",
                    marginBottom: "0.5rem",
                  }}
                >
                  <label>Players</label>
                  <button
                    type="button"
                    className="btn-yellow-card"
                    style={{ marginRight: "0rem" }}
                    onClick={() => {
                      setYellowCardPlayer(null);
                      setShowYellowModal(true);
                    }}
                  >
                    <img
                      src={yellowCardIcon}
                      alt="Yellow Card"
                      style={{ width: "1.5rem", height: "1.5rem" }}
                    />
                  </button>
                  <button
                    type="button"
                    className="btn-red-card"
                    style={{ marginRight: "0rem", marginLeft: "1rem" }}
                    onClick={() => {
                      setRedCardPlayer(null);
                      setShowRedModal(true);
                    }}
                  >
                    <img
                      src={redCardIcon}
                      alt="Red Card"
                      style={{ width: "1.5rem", height: "1.5rem" }}
                    />
                  </button>
                </div>

                <ul style={{ flexGrow: 1, overflowY: "auto" }}>
                  {players.map((p, idx) => (
                    <li
                      key={idx}
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                      }}
                    >
                      <span>
                        {p.name} ({p.position})
                        {p.isSubstitute && (
                          <span style={{ color: "red", fontWeight: "bold" }}>
                            &nbsp;Sub
                          </span>
                        )}
                      </span>
                      <div style={{ display: "flex", gap: "0.25rem" }}>
                        <button
                          type="button"
                          className="btn-view"
                          style={{
                            fontSize: "0.75rem",
                            padding: "0.25rem 0.5rem",
                            width: "4rem",
                          }}
                          onClick={() => {
                            setSelectedPlayer(p);
                            setViewPlayerModal(true);
                          }}
                        >
                          View
                        </button>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </section>
        {/* <img 
          src={sealImage} 
          alt="KFUPM Seal" 
          className="vertical-seal" 
        /> */}
      </main>
      {showPlayerModal && (
        <div className="security-modal">
          <div
            className="security-modal-content"
            style={{ position: "relative" }}
          >
            <button
              className="close-button"
              type="button"
              onClick={() => setShowPlayerModal(false)}
              //   style={{
              //     position: 'absolute',
              //     top: '0.5rem',
              //     right: '0.75rem',
              //     background: 'transparent',
              //     border: 'none',
              //     fontSize: '1.5rem',
              //     cursor: 'pointer',
              //     color: "white"
              //   }}
              aria-label="Close"
            >
              &times;
            </button>
            <h2>Add New Player</h2>
            <label>
              Team ID
              <input
                type="text"
                placeholder="Team ID"
                value={teamId}
                disabled
                style={{
                  backgroundColor: "#e0e0e0",
                  color: "#666",
                  cursor: "not-allowed",
                }}
              />
            </label>
            <label>
              Player ID
              <input
                type="text"
                placeholder="Player ID (e.g. s20xxxxxxx)"
                value={playerDetails.id}
                maxLength={10}
                onChange={(e) => {
                  const value = e.target.value;
                  if (value.length <= 10) {
                    setPlayerDetails({ ...playerDetails, id: value });
                  }
                }}
              />
            </label>

            <label>
              Player Name
              <input
                type="text"
                placeholder="Player Name"
                value={playerDetails.name}
                onChange={(e) =>
                  setPlayerDetails({ ...playerDetails, name: e.target.value })
                }
              />
            </label>

            <label>
              Jersey Number
              <input
                type="number"
                placeholder="Jersey Number"
                min="1"
                value={playerDetails.jerseyNumber}
                onChange={(e) => {
                  const value = e.target.value;
                  if (Number(value) >= 1 || value === "") {
                    setPlayerDetails({ ...playerDetails, jerseyNumber: value });
                  }
                }}
              />
            </label>

            <label>
              Player Position:
              <select
                value={playerDetails.position}
                onChange={(e) =>
                  setPlayerDetails({
                    ...playerDetails,
                    position: e.target.value,
                  })
                }
              >
                <option value="">Select Position</option>
                <option value="Goalkeeper">Goalkeeper</option>
                <option value="Right Back">Right Back</option>
                <option value="Left Back">Left Back</option>
                <option value="Center Back">Center Back</option>
                <option value="Defensive Midfielder">
                  Defensive Midfielder
                </option>
                <option value="Central Midfielder">Central Midfielder</option>
                <option value="Attacking Midfielder">
                  Attacking Midfielder
                </option>
                <option value="Right Winger">Right Winger</option>
                <option value="Left Winger">Left Winger</option>
                <option value="Striker">Striker</option>
                <option value="Second Striker">Second Striker</option>
              </select>
            </label>

            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "0.5rem",
                margin: "1rem 0",
              }}
            >
              <label style={{ margin: "0rem" }}>Substitute: </label>
              <input
                type="checkbox"
                style={{ width: "1rem", margin: "0rem" }}
                checked={playerDetails.isSubstitute}
                onChange={(e) =>
                  setPlayerDetails({
                    ...playerDetails,
                    isSubstitute: e.target.checked,
                  })
                }
              />
            </div>

            <div style={{ marginTop: "1rem" }}>
              <button
                type="button"
                onClick={() => {
                  if (!/^s20.{7}$/.test(playerDetails.id)) {
                    setPlayerError(
                      'Player ID must start with "s20" and be 10 characters long',
                    );
                    return;
                  }
                  if (
                    !playerDetails.id.trim() ||
                    !playerDetails.name.trim() ||
                    !playerDetails.jerseyNumber ||
                    !playerDetails.position.trim()
                  ) {
                    setPlayerError("All fields are required");
                    return;
                  }
                  setPlayers((prev) => [...prev, playerDetails]);
                  setPlayerDetails({
                    id: "",
                    name: "",
                    jerseyNumber: "",
                    position: "",
                    isSubstitute: false,
                  });
                  setPlayerError("");
                  setShowPlayerModal(false);
                }}
              >
                Add
              </button>
              {playerError && <p className="error">{playerError}</p>}
            </div>
          </div>
        </div>
      )}
      {viewPlayerModal && selectedPlayer && (
        <div className="security-modal">
          <div
            className="security-modal-content"
            style={{ position: "relative" }}
          >
            <button
              className="close-button"
              type="button"
              onClick={() => setViewPlayerModal(false)}
              aria-label="Close"
            >
              &times;
            </button>
            <h2>Player Details</h2>
            <p>
              <strong>ID:</strong> {selectedPlayer.id}
            </p>
            <p>
              <strong>Name:</strong> {selectedPlayer.name}
            </p>
            <p>
              <strong>Jersey Number:</strong> {selectedPlayer.jerseyNumber}
            </p>
            <p>
              <strong>Position:</strong> {selectedPlayer.position}
            </p>
            <p>
              <strong>Substitute:</strong>{" "}
              {selectedPlayer.isSubstitute ? "Yes" : "No"}
            </p>
          </div>
        </div>
      )}
      {editPlayerModal && (
        <div className="security-modal">
          <div
            className="security-modal-content"
            style={{ position: "relative" }}
          >
            <button
              className="close-button"
              type="button"
              onClick={() => setEditPlayerModal(false)}
              aria-label="Close"
            >
              &times;
            </button>
            <h2>Edit Player</h2>
            {/* Reuse the form structure here */}
            {/* Replace "Add" button with "Update" */}
            <label>
              Player ID
              <input type="text" value={playerDetails.id} disabled />
            </label>
            <label>
              Player Name
              <input
                type="text"
                value={playerDetails.name}
                onChange={(e) =>
                  setPlayerDetails({ ...playerDetails, name: e.target.value })
                }
              />
            </label>
            <label>
              Jersey Number
              <input
                type="number"
                value={playerDetails.jerseyNumber}
                onChange={(e) =>
                  setPlayerDetails({
                    ...playerDetails,
                    jerseyNumber: e.target.value,
                  })
                }
              />
            </label>
            <label>
              Player Position
              <select
                value={playerDetails.position}
                onChange={(e) =>
                  setPlayerDetails({
                    ...playerDetails,
                    position: e.target.value,
                  })
                }
              >
                <option value="">Select Position</option>
                <option value="Goalkeeper">Goalkeeper</option>
                <option value="Right Back">Right Back</option>
                <option value="Left Back">Left Back</option>
                <option value="Center Back">Center Back</option>
                <option value="Defensive Midfielder">
                  Defensive Midfielder
                </option>
                <option value="Central Midfielder">Central Midfielder</option>
                <option value="Attacking Midfielder">
                  Attacking Midfielder
                </option>
                <option value="Right Winger">Right Winger</option>
                <option value="Left Winger">Left Winger</option>
                <option value="Striker">Striker</option>
                <option value="Second Striker">Second Striker</option>
              </select>
            </label>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "0.5rem",
                margin: "1rem 0",
              }}
            >
              <label style={{ margin: "0rem" }}>Substitute: </label>
              <input
                type="checkbox"
                style={{ width: "1rem", margin: "0rem" }}
                checked={playerDetails.isSubstitute}
                onChange={(e) =>
                  setPlayerDetails({
                    ...playerDetails,
                    isSubstitute: e.target.checked,
                  })
                }
              />
            </div>
            <button
              type="button"
              onClick={() => {
                setPlayers((prev) =>
                  prev.map((p) =>
                    p.id === playerDetails.id ? playerDetails : p,
                  ),
                );
                setEditPlayerModal(false);
              }}
            >
              Update
            </button>
          </div>
        </div>
      )}
      {/* Yellow Card Modal */}
      {showYellowModal && (
        <div className="modal-overlay">
          <div className="modal">
            <button
              className="close-button"
              type="button"
              onClick={() => setShowYellowModal(false)}
            >
              &times;
            </button>
            <h2>Yellow Card</h2>
            <label htmlFor="yellow-match-select">Select Match:</label>
            <select
              id="yellow-match-select"
              value={selectedYellowMatch}
              onChange={(e) => {
                const matchId = e.target.value;
                setSelectedYellowMatch(matchId);
                const matchObj = teamMatches.find(
                  (m) => String(m.id) === matchId,
                );
                if (matchObj && matchObj.yellowCards) {
                  const list = Object.entries(matchObj.yellowCards)
                    .filter(([pid]) =>
                      players.some((p) => String(p.id) === String(pid)),
                    )
                    .map(([pid, times]) => {
                      const player = players.find(
                        (p) => String(p.id) === String(pid),
                      );
                      return {
                        name: player.name,
                        timings: Array.isArray(times) ? times : [times],
                      };
                    });
                  setYellowCardList(list);
                } else {
                  setYellowCardList([]);
                }
              }}
              style={{ margin: "0.5rem 0", width: "100%" }}
            >
              <option value="">-- Select a match --</option>
              {teamMatches.length > 0 ? (
                teamMatches.map((m) => (
                  <option key={m.id} value={m.id}>
                    {formatDateBR(m.date)}: {getTeamName(m.teamA)} vs{" "}
                    {getTeamName(m.teamB)}
                  </option>
                ))
              ) : (
                <option disabled>No matches available</option>
              )}
            </select>
            {/* Replace match with actual match object if available */}
            {yellowCardPlayer &&
              Array.isArray(match?.yellowCards?.[yellowCardPlayer.id]) &&
              match.yellowCards[yellowCardPlayer.id].length > 0 && (
                <div style={{ margin: "0.5rem 0", textAlign: "left" }}>
                  <p>
                    <strong>Player ID:</strong> {yellowCardPlayer.id}
                  </p>
                  <p>
                    <strong>Player:</strong>{" "}
                    {yellowCardPlayer.name.split(" ").slice(-1)[0]}
                  </p>
                  <p>
                    <strong>Yellow cards:</strong>{" "}
                    {match.yellowCards[yellowCardPlayer.id].length}
                  </p>
                  <p>
                    <strong>Timings:</strong>{" "}
                    {match.yellowCards[yellowCardPlayer.id]
                      .slice()
                      .sort((a, b) => a - b)
                      .map((t) => `${t}'`)
                      .join(", ")}
                  </p>
                </div>
              )}

            {selectedYellowMatch &&
              (yellowCardList.length > 0 ? (
                <div className="carded-players-list">
                  {yellowCardList.map((entry, idx) => (
                    <div
                      key={idx}
                      style={{
                        borderBottom:
                          idx !== yellowCardList.length - 1
                            ? "1px solid #ccc"
                            : "none",
                        padding: "0.25rem 0",
                      }}
                    >
                      {entry.name}:{" "}
                      {entry.timings
                        .sort((a, b) => a - b)
                        .map((t) => `${t}'`)
                        .join(", ")}
                    </div>
                  ))}
                </div>
              ) : (
                <p>No carded players found!</p>
              ))}
          </div>
        </div>
      )}
      {/* Red Card Modal */}
      {showRedModal && (
        <div className="modal-overlay">
          <div className="modal">
            <button
              className="close-button"
              type="button"
              onClick={() => setShowRedModal(false)}
            >
              &times;
            </button>
            <h2>Red Card</h2>
            <label htmlFor="red-match-select">Select Match:</label>
            <select
              id="red-match-select"
              value={selectedRedMatch}
              onChange={(e) => {
                const matchId = e.target.value;
                setSelectedRedMatch(matchId);
                const matchObj = teamMatches.find(
                  (m) => String(m.id) === matchId,
                );
                if (matchObj && matchObj.redCards) {
                  const list = Object.entries(matchObj.redCards)
                    .filter(([pid]) =>
                      players.some((p) => String(p.id) === String(pid)),
                    )
                    .map(([pid, time]) => {
                      const player = players.find(
                        (p) => String(p.id) === String(pid),
                      );
                      return {
                        name: player.name,
                        timings: [time],
                      };
                    });
                  setRedCardList(list);
                } else {
                  setRedCardList([]);
                }
              }}
              style={{ margin: "0.5rem 0", width: "100%" }}
            >
              <option value="">-- Select a match --</option>
              {teamMatches.length > 0 ? (
                teamMatches.map((m) => (
                  <option key={m.id} value={m.id}>
                    {formatDateBR(m.date)}: {getTeamName(m.teamA)} vs{" "}
                    {getTeamName(m.teamB)}
                  </option>
                ))
              ) : (
                <option disabled>No matches available</option>
              )}
            </select>
            {/* Replace match with actual match object if available */}
            {redCardPlayer &&
              Array.isArray(match?.redCards?.[redCardPlayer.id]) &&
              match.redCards[redCardPlayer.id].length > 0 && (
                <div style={{ margin: "0.5rem 0", textAlign: "left" }}>
                  <p>
                    <strong>Player ID:</strong> {redCardPlayer.id}
                  </p>
                  <p>
                    <strong>Player:</strong>{" "}
                    {redCardPlayer.name.split(" ").slice(-1)[0]}
                  </p>
                  <p>
                    <strong>Red cards:</strong>{" "}
                    {match.redCards[redCardPlayer.id].length}
                  </p>
                  <p>
                    <strong>Timings:</strong>{" "}
                    {match.redCards[redCardPlayer.id]
                      .slice()
                      .sort((a, b) => a - b)
                      .map((t) => `${t}'`)
                      .join(", ")}
                  </p>
                </div>
              )}

            {selectedRedMatch &&
              (redCardList.length > 0 ? (
                <div className="carded-players-list">
                  {redCardList.map((entry, idx) => (
                    <div
                      key={idx}
                      style={{
                        borderBottom:
                          idx !== redCardList.length - 1
                            ? "1px solid #ccc"
                            : "none",
                        padding: "0.25rem 0",
                      }}
                    >
                      {entry.name}:{" "}
                      {entry.timings.map((t) => `${t}'`).join(", ")}
                    </div>
                  ))}
                </div>
              ) : (
                <p>No carded players found!</p>
              ))}
          </div>
        </div>
      )}
      <style>
        {`
      .btn-view:hover {
        transform: scale(1.05);
        transition: transform 0.2s ease, background-color 0.2s ease;
    }
    `}
      </style>
    </div>
  );
};

export default TeamDetails;
