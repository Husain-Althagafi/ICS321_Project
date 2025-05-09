import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import AdminSidebar from "../../components/AdminSidebar";
import DeleteTeamButton from "../../components/DeleteTeamButton";
// import sealImage from '../../assets/icons/KFUPM Seal White.png';
import bgImage from "../../assets/images/Illustration 1@4x.png";
import "../../stylesheets/EditTeam.css";
import axios from 'axios'
const EditTeam = () => {
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
    player_id: "",
    player_name: "",
    jersey_number: "",
    position: "",
    is_substitute: false,
  });
  const [playerError, setPlayerError] = useState("");
  const [viewPlayerModal, setViewPlayerModal] = useState(false);
  const [selectedPlayer, setSelectedPlayer] = useState(null);
  const [editPlayerModal, setEditPlayerModal] = useState(false);
  const [team, setTeam] = useState({})

  useEffect(() => {
    
    //get team based on id
    axios.get(`http://localhost:5000/teams/${teamId}`)
    .then((res) => {
      setTeam(res.data.data)
    })
    .catch(err => console.error(err))


    axios.get(`http://localhost:5000/teams/${teamId}/players`)
    .then((res) => {
      setPlayers(res.data.data)
    })
    .catch(err => console.error(err))


    if (team) {
      setTeamName(team.team_name);
      setCoachName(team.coach_name);
      setManagerName(team.manager_name || "");
      setPlayers(team.players || []);
    } else {
      navigate("/admin/teams");
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

    axios.put(`http://localhost:5000/teams/${teamId}`, {
      team_name: teamName,
      coach_name: coachName,
      manager_name: managerName
    })
    .then((res) => {
      navigate("/admin/teams");
    })
    .catch(err => console.error(err))
  };

  // const handleAddPlayer = () => {
  //   axios.post(`http://localhost:5000/teams/${teamId}/players`, )

  //   if (newPlayer.trim() === "") return;
  //   setPlayers((prev) => [...prev, newPlayer.trim()]);
  //   setNewPlayer("");
  // };

  const handleDeleteTeam = () => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this team?",
    );
    if (!confirmDelete) return;

    const updatedTeams = teams.filter((t) => String(t.team_id) !== teamId);
    localStorage.setItem("teams", JSON.stringify(updatedTeams));
    navigate("/admin/teams");
  };

  return (
    <div className="admin-home">
      <AdminSidebar initials={initials} formattedName={formattedName} />

      <main className="main-content">
        <div className="bg-overlay"></div>
        <header className="topbar">
          <h1>Edit Team</h1>
        </header>

        <section className="tournament-form">
          <div className="form-container">
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
                <button type="submit">Save Changes</button>
              </form>
              <div
                className="players-list"
                style={{
                  display: "flex",
                  flexDirection: "column",
                  height: "40vh",
                }}
              >
                <label>Players</label>
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
                        {p.player_name} ({p.position})
                        {p.is_substitute && (
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
                        <button
                          type="button"
                          className="btn-edit"
                          style={{
                            fontSize: "0.75rem",
                            padding: "0.25rem 0.5rem",
                            width: "4rem",
                            backgroundColor: "orange",
                            color: "white",
                          }}
                          onClick={() => {
                            setPlayerDetails(p);
                            setEditPlayerModal(true);
                          }}
                        >
                          Edit
                        </button>
                        <button
                          type="button"
                          className="btn-delete"
                          style={{
                            fontSize: "0.75rem",
                            padding: "0.25rem 0.5rem",
                            width: "4rem",
                            backgroundColor: "red",
                            color: "white",
                          }}
                          onClick={() => {
                            if (
                              window.confirm(
                                "Are you sure you want to delete this player?",
                              )
                            ) {
                              //delete player
                              axios.delete(`http://localhost:5000/teams/${teamId}/${selectedPlayer.player_id}`)
                              .then((res) => {
                                setPlayers(players.filter(p => p.player_id !== selectedPlayer.player_id))
                              })
                              .catch(err => console.error(err))
                            }
                          }}
                        >
                          Delete
                        </button>
                      </div>
                    </li>
                  ))}
                </ul>
                <div className="add-player" style={{ flexShrink: 0 }}>
                  <button
                    type="button"
                    onClick={() => setShowPlayerModal(true)}
                  >
                    Add Player
                  </button>
                </div>
              </div>
            </div>
            <DeleteTeamButton onClick={handleDeleteTeam} />
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
                value={playerDetails.player_id}
                maxLength={10}
                onChange={(e) => {
                  const value = e.target.value;
                  if (value.length <= 10) {
                    setPlayerDetails({ ...playerDetails, player_id: value });
                  }
                }}
              />
            </label>

            <label>
              Player Name
              <input
                type="text"
                placeholder="Player Name"
                value={playerDetails.player_name}
                onChange={(e) =>
                  setPlayerDetails({ ...playerDetails, player_name: e.target.value })
                }
              />
            </label>

            <label>
              Jersey Number
              <input
                type="number"
                placeholder="Jersey Number"
                min="1"
                value={playerDetails.jersey_number}
                onChange={(e) => {
                  const value = e.target.value;
                  if (Number(value) >= 1 || value === "") {
                    setPlayerDetails({ ...playerDetails, jersey_number: value });
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
                checked={playerDetails.is_substitute}
                onChange={(e) =>
                  setPlayerDetails({
                    ...playerDetails,
                    is_substitute: e.target.checked,
                  })
                }
              />
            </div>

            <div style={{ marginTop: "1rem" }}>
              <button
                type="button"
                onClick={() => {
                  if (!/^s20.{7}$/.test(playerDetails.player_id)) {
                    setPlayerError(
                      'Player ID must start with "s20" and be 10 characters long',
                    );
                    return;
                  }
                  if (
                    !playerDetails.player_id.trim() ||
                    !playerDetails.player_name.trim() ||
                    !playerDetails.jersey_number ||
                    !playerDetails.position.trim()
                  ) {
                    setPlayerError("All fields are required");
                    return;
                  }

                  playerDetails.team_id = teamId


                  //add player to team with axios
                  

                  axios.post(`http://localhost:5000/teams/${teamId}/players`, playerDetails)
                  .then((res) => {
                    setPlayerDetails({
                      id: "",
                      name: "",
                      jerseyNumber: "",
                      position: "",
                      isSubstitute: false,
                      team_id: teamId
                    });
                    setPlayers((prev) => [...prev, playerDetails]);

                    setPlayerError("");
                    setShowPlayerModal(false);
                  })
                  .catch(err => console.error(err))
                  
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
              <strong>ID:</strong> {selectedPlayer.player_id}
            </p>
            <p>
              <strong>Name:</strong> {selectedPlayer.player_name}
            </p>
            <p>
              <strong>Jersey Number:</strong> {selectedPlayer.jersey_number}
            </p>
            <p>
              <strong>Position:</strong> {selectedPlayer.position}
            </p>
            <p>
              <strong>Substitute:</strong>{" "}
              {selectedPlayer.is_substitute ? "Yes" : "No"}
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
              <input type="text" value={playerDetails.player_id} disabled />
            </label>
            <label>
              Player Name
              <input
                type="text"
                value={playerDetails.player_name}
                onChange={(e) =>
                  setPlayerDetails({ ...playerDetails, player_name: e.target.value })
                }
              />
            </label>
            <label>
              Jersey Number
              <input
                type="number"
                value={playerDetails.jersey_number}
                onChange={(e) =>
                  setPlayerDetails({
                    ...playerDetails,
                    jersey_number: e.target.value,
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
                checked={playerDetails.is_substitute}
                onChange={(e) =>
                  setPlayerDetails({
                    ...playerDetails,
                    is_substitute: e.target.checked,
                  })
                }
              />
            </div>
            <button
              type="button"
              onClick={() => {

                const updatedPlayer = {
                  ...playerDetails,
                  team_id: teamId
                };
                axios.patch(`http://localhost:5000/teams/${teamId}/${updatedPlayer.player_id}`, updatedPlayer)
                .then((res) => {
                  const updatedPlayer = res.data.data
                  setPlayers(players.map(p =>
                    p.player_id === updatedPlayer.player_id ? updatedPlayer : p
                  ))
                  setEditPlayerModal(false);
                })
                .catch(err => console.error(err))
              }}
            >
              Update
            </button>
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

export default EditTeam;
