import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import AdminSidebar from "../../components/AdminSidebar";
import DeleteTournamentButton from "../../components/DeleteTournamentButton";
// import sealImage from '../../assets/icons/KFUPM Seal White.png';
import bgImage from "../../assets/images/Illustration 1@4x.png";
import "../../stylesheets/EditTournament.css";

// Generate round-robin schedule: assign only IDs, teams, and dates; leave captains & venue/time blank
const scheduleRoundRobin = (teamIds, dateOptions, tournamentId) => {
  const matches = [];
  let slotIndex = 0;
  // For each unique pair
  for (let i = 0; i < teamIds.length; i++) {
    for (let j = i + 1; j < teamIds.length; j++) {
      // Cycle through dates
      const date = dateOptions[slotIndex % dateOptions.length];
      matches.push({
        id: `${tournamentId}_${slotIndex + 1}`,
        teamA: teamIds[i],
        teamB: teamIds[j],
        date,
        startTime: "",
        endTime: "",
        venueId: "",
        captainA: "",
        captainB: "",
      });
      slotIndex++;
    }
  }
  return matches;
};

const EditTournament = () => {
  // Helper to format yyyy-mm-dd to dd-mm-yyyy
  const formatDate = (dateString) => {
    if (!dateString) return "";
    const [y, m, d] = dateString.split("-");
    return `${d}-${m}-${y}`;
  };

  // Helper to convert dd-mm-yyyy to yyyy-mm-dd
  const reverseFormatDate = (dateString) => {
    if (!dateString) return "";
    const [d, m, y] = dateString.split("-");
    return `${y}-${m}-${d}`;
  };

  const navigate = useNavigate();
  const { tournamentId } = useParams();
  const username = "john.doe"; // Replace with actual dynamic source later
  const [first, last] = username.split(".");
  const initials = `${first[0]}${last[0]}`.toUpperCase();
  const formattedName = `${first.charAt(0).toUpperCase() + first.slice(1)} ${last.charAt(0).toUpperCase() + last.slice(1)}`;

  const [tournaments, setTournaments] = useState([]);
  const [tournamentName, setTournamentName] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [numTeams, setNumTeams] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [players, setPlayers] = useState([]);
  const [matches, setMatches] = useState([]);
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
  const [showMatchModal, setShowMatchModal] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [viewMatchModal, setViewMatchModal] = useState(false);
  const [selectedMatch, setSelectedMatch] = useState(null);
  const [teams, setTeams] = useState([])
  const [tournament, setTournament] = useState({})
  const [captains, setCaptains] = useState([])

  const [matchDetails, setMatchDetails] = useState({
    id: "",
    teamA: "",
    teamB: "",
    date: "",
    startTime: "",
    endTime: "",
    captainA: "",
    captainB: "",
    venueId: "",
  });
  const isEditing = Boolean(matchDetails.id);
  const [availableTeams, setAvailableTeams] = useState([]);
  const [listType, setListType] = useState("matches");
  const [isConfirmed, setIsConfirmed] = useState(false);
  // Helper to retrieve a team's player roster
  const getTeamPlayers = (teamId) => {

    axios.get(`http://localhost:5000/teams/${teamId}/players`)
    .then((res) => {
      setPlayers(res.data.data)
    })
    .catch(err=> console.error(err))

    // const team = availableTeams.find(
    //   (t) => String(t.team_id) === String(teamId),
    // );
    // return team?.players || [];
  };



  useEffect(() => {
    // const storedTournaments =
    //   JSON.parse(localStorage.getItem("tournaments")) || [];
    // const allTeams = JSON.parse(localStorage.getItem("teams")) || [];

    //get all matches in tournaments
    axios.get(`http://localhost:5000/tournaments/${tournamentId}/matches`)
    .then((res) => {
      setMatches(res.data.data)
    })
    .catch(err => console.error(err))

    //get all teams in tournament
    axios.get(`http://localhost:5000/tournaments/${tournamentId}/teams`)
    .then((res) => {
      setTeams(res.data.data.teams)
    })
    .catch(err => console.error(err))

    // setAvailableTeams(allTeams);


    //get tournement
    axios.get(`http://localhost:5000/tournaments/${tournamentId}`)
    .then((res) => {
      setTournament(res.data.data[0])
    })
    .catch(err => console.error(err))


    // get tournaments
    axios.get(`http://localhost:5000/tournaments`)
    .then((res) => {
      setTournaments(res.data.data)
    })
    .catch(err => console.error(err))

    axios.get(`http://localhost:5000/tournaments/${tournamentId}/players`)
    .then((res) => {
      setPlayers(res.data.data)
    })
    .catch(err => console.error(err)) 
    
    if (tournament) {
      setTournamentName(tournament.name);
      setStartDate(tournament.startDate);
      setEndDate(tournament.endDate);
      setNumTeams(tournament.numTeams || "");
      setTournaments(storedTournaments);
      setPlayers(tournament.players || []);
      setMatches(tournament.matches || []);
      // Initialize persistent match counter if missing
      // if (tournament.lastMatchNumber == null) {
      //   const existing = matches || [];
      //   const maxSuffix = existing.reduce((max, m) => {
      //     const parts = m.id.split("_");
      //     const num = parseInt(parts[1], 10);
      //     return Math.max(max, isNaN(num) ? 0 : num);
      //   }, 0);
      //   tournament.lastMatchNumber = maxSuffix;
      //   // Update tournaments array and persist
      //   const updatedAll = storedTournaments.map((t) =>
      //     String(t.id) === tournamentId
      //       ? { ...t, lastMatchNumber: maxSuffix }
      //       : t,
      //   );
      //   localStorage.setItem("tournaments", JSON.stringify(updatedAll));
      //   setTournaments(updatedAll);
      // }
    } else {
      navigate("/admin/tournaments");
    }
  }, [tournamentId, navigate]);

  useEffect(() => {
    if (startDate && numTeams) {
      const sd = new Date(startDate);
      sd.setDate(sd.getDate() + parseInt(numTeams, 10) - 2);
      setEndDate(sd.toISOString().split("T")[0]);
    }
  }, [startDate, numTeams]);

  const handleUpdateTeam = (e) => {
    e.preventDefault();
    if (!tournamentName || !startDate || !endDate) {
      const msg = "All fields are required.";
      setErrorMsg(msg);
      setTimeout(() => alert(msg), 0);
      return;
    }
    const today = new Date().setHours(0, 0, 0, 0);
    const start = new Date(startDate).setHours(0, 0, 0, 0);
    const end = new Date(endDate).setHours(0, 0, 0, 0);

    if (start > end) {
      const msg = "Start date cannot be after end date.";
      setErrorMsg(msg);
      setTimeout(() => alert(msg), 0);
      return;
    }
    if (start < today || end < today) {
      const msg = "Start and end dates cannot be in the past.";
      setErrorMsg(msg);
      setTimeout(() => alert(msg), 0);
      return;
    }
    const updatedTournaments = tournaments.map((t) =>
      String(t.id) === tournamentId
        ? {
            ...t,
            name: tournamentName,
            startDate,
            endDate,
            numTeams: parseInt(numTeams, 10),
            players,
          }
        : t,
    );
    localStorage.setItem("tournaments", JSON.stringify(updatedTournaments));
    navigate("/admin/tournaments");
  };

  const handleAddPlayer = () => {
    if (newPlayer.trim() === "") return;
    setPlayers((prev) => [...prev, newPlayer.trim()]);
    setNewPlayer("");
  };

  const handleDeleteTournament = () => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this tournament?",
    );
    if (!confirmDelete) return;


    axios.delete(`http://localhost:5000/tournaments/${tournamentId}`)
    .then((res) => {
      navigate("/admin/tournaments");
    })
    .catch(err => console.error(err))
    
  };

  // Utility function to get date options between start and end
  const getDateOptions = (start, end) => {
    const dates = [];
    if (!start || !end) return dates;
    let current = new Date(start);
    const endDate = new Date(end);
    while (current <= endDate) {
      const day = String(current.getDate()).padStart(2, "0");
      const month = String(current.getMonth() + 1).padStart(2, "0");
      const year = current.getFullYear();
      dates.push(`${day}-${month}-${year}`);
      current.setDate(current.getDate() + 1);
    }
    return dates;
  };

  // Check if two time ranges overlap
  const hasTimeOverlap = (start1, end1, start2, end2) => {
    return start1 < end2 && start2 < end1;
  };

  // Helper to convert time string to minutes for easier comparison
  const timeToMinutes = (timeStr) => {
    const [hours, minutes] = timeStr.split(":").map(Number);
    return hours * 60 + minutes;
  };

  // returns only the venues that are free for the new match's date & time
  const getAvailableVenues = () => {
    const {
      date: newDateStr,
      startTime: newStart,
      endTime: newEnd,
      id: editingId,
    } = matchDetails;
    const allVenues = JSON.parse(localStorage.getItem("venues")) || [];

    // If date, start time, or end time is not selected yet, don't perform filtering
    if (!newDateStr || !newStart || !newEnd) {
      return allVenues.filter((v) => v.status === "Available");
    }

    // Convert new match details to comparable formats
    const newDateFormatted = reverseFormatDate(newDateStr); // Convert dd-mm-yyyy to yyyy-mm-dd
    const newStartMins = timeToMinutes(newStart);
    const newEndMins = timeToMinutes(newEnd);

    // Get all matches from all tournaments
    const allTournaments =
      JSON.parse(localStorage.getItem("tournaments")) || [];
    const allMatches = allTournaments.flatMap((t) => t.matches || []);

    // Filter venues to exclude those with time conflicts
    return allVenues.filter((venue) => {
      // Always include available venues
      if (venue.status === "Available") return true;

      // For reserved venues, check if there's any conflict with existing matches
      const venueMatches = allMatches.filter(
        (m) =>
          String(m.venueId) === String(venue.id) &&
          // Skip the match we're currently editing
          !(isEditing && m.id === editingId),
      );

      // Check each match for this venue for conflicts
      return !venueMatches.some((match) => {
        // If not on the same date, no conflict
        if (match.date !== newDateFormatted) return false;

        // Convert match times to minutes for comparison
        const matchStartMins = timeToMinutes(match.startTime);
        const matchEndMins = timeToMinutes(match.endTime);

        // Check for time overlap
        return hasTimeOverlap(
          newStartMins,
          newEndMins,
          matchStartMins,
          matchEndMins,
        );
      });
    });
  };

  // Prepare venues available times per date
  const dateOptions = getDateOptions(startDate, endDate);
  const allVenues = JSON.parse(localStorage.getItem("venues")) || [];
  const venuesByDate = {};
  dateOptions.forEach((date) => {
    // For each date, filter venues that are Available
    const avail = allVenues.filter((v) => v.status === "Available");
    venuesByDate[date] = avail.map((v) => ({
      id: v.id,
      availableTimes: ["09:00", "11:00", "13:00", "15:00"], // example fixed slots
    }));
  });

  return (
    <div className="admin-home">
      <AdminSidebar initials={initials} formattedName={formattedName} />

      <main className="main-content">
        <div className="bg-overlay"></div>
        <header className="topbar">
          <h1>Edit Tournament</h1>
        </header>

        <section className="tournament-form">
          <div className="form-container-tournament">
            <h2 className="tournament-edit-h2">Tournament Details</h2>
            <div className="edit-team-content">
              <form onSubmit={handleUpdateTeam} className="form-grid">
                <label>
                  Tournament ID:
                  <input
                    type="text"
                    value={tournament.tr_id}
                    disabled
                    style={{
                      backgroundColor: "#f0f0f0",
                      color: "#666",
                      cursor: "not-allowed",
                    }}
                  />
                </label>
                <label>
                  Tournament Name:
                  <input
                    type="text"
                    value={tournament.tr_name}
                    onChange={(e) => setTournamentName(e.target.value)}
                    required
                  />
                </label>
                <label>
                  Start Date:
                  <input
                    type="date"
                    value={tournament.start_date}
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
                    disabled
                    style={{
                      backgroundColor: "#f0f0f0",
                      color: "#666",
                      cursor: "not-allowed",
                    }}
                  >
                    {[2, 4, 6, 8, 10, 12].map((n) => (
                      <option key={n} value={String(n)}>
                        {n}
                      </option>
                    ))}
                  </select>
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
                <label>
                  <select
                    className="matches-dropdown"
                    value={listType}
                    onChange={(e) => setListType(e.target.value)}
                  >
                    <option value="matches">Matches</option>
                    <option value="teams">Teams</option>
                  </select>
                </label>
                <ul style={{ flexGrow: 1, overflowY: "auto" }}>
                  {listType === "matches"
                    ? matches.map((m, idx) => {
                        const teamAName =
                          availableTeams.find(
                            (t) => String(t.team_id) === String(m.teamA),
                          )?.team_name || m.teamA;
                        const teamBName =
                          availableTeams.find(
                            (t) => String(t.team_id) === String(m.teamB),
                          )?.team_name || m.teamB;
                        return (
                          <li
                            key={idx}
                            style={{
                              display: "flex",
                              justifyContent: "space-between",
                              alignItems: "center",
                            }}
                          >
                            <span>
                              <strong>{teamAName}</strong> vs{" "}
                              <strong>{teamBName}</strong> ({m.startTime} -{" "}
                              {m.endTime}, {m.date.replace(/-/g, "/")})
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
                                  setSelectedMatch(m);
                                  setViewMatchModal(true);
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
                                  // Pre-fill match details, use m.date as is (already in dd-mm-yyyy format)
                                  setMatchDetails({
                                    ...m,
                                    date: m.date,
                                    captainA: m.captainA || "",
                                    captainB: m.captainB || "",
                                  });
                                  setShowMatchModal(true);
                                }}
                              >
                                Edit
                              </button>
                            </div>
                          </li>
                        );
                      })
                    : availableTeams.map((team) => (
                        <li
                          key={team.team_id}
                          style={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                            padding: "0.75rem 1rem",
                            fontSize: "0.875rem", // smaller text
                          }}
                        >
                          <strong>{team.team_name}</strong>
                          <div style={{ display: "flex", gap: "0.5rem" }}>
                            <button
                              type="button"
                              className="btn-add-team"
                              onClick={() => {
                                if (
                                  players.length < Number(numTeams) &&
                                  !players.includes(team.team_id) &&
                                  !isConfirmed
                                ) {
                                  setPlayers((prev) => [...prev, team.team_id]);
                                }
                              }}
                              disabled={
                                players.length >= Number(numTeams) ||
                                players.includes(team.team_id) ||
                                isConfirmed
                              }
                              style={{
                                whiteSpace: "nowrap",
                                background:
                                  "linear-gradient(135deg, #28a745, #218838)",
                                color: "white",
                                border: "none",
                                padding: "0.25rem 0.75rem",
                                borderRadius: "1rem",
                                fontSize: "0.875rem",
                                textAlign: "center",
                                opacity:
                                  players.length >= Number(numTeams) ||
                                  players.includes(team.team_id) ||
                                  isConfirmed
                                    ? 0.5
                                    : 1,
                                cursor:
                                  players.length >= Number(numTeams) ||
                                  players.includes(team.team_id) ||
                                  isConfirmed
                                    ? "not-allowed"
                                    : "pointer",
                              }}
                            >
                              Add Team
                            </button>
                            <button
                              type="button"
                              className="btn-remove-team"
                              onClick={() => {
                                if (!isConfirmed) {
                                  setPlayers((prev) =>
                                    prev.filter((id) => id !== team.team_id),
                                  );
                                }
                              }}
                              disabled={
                                !players.includes(team.team_id) || isConfirmed
                              }
                              style={{
                                whiteSpace: "nowrap",
                                background:
                                  "linear-gradient(135deg, #dc3545, #c82333)",
                                color: "white",
                                border: "none",
                                padding: "0.25rem 0.75rem",
                                borderRadius: "1rem",
                                fontSize: "0.75rem",
                                textAlign: "center",
                                opacity:
                                  !players.includes(team.team_id) || isConfirmed
                                    ? 0.5
                                    : 1,
                                cursor:
                                  !players.includes(team.team_id) || isConfirmed
                                    ? "not-allowed"
                                    : "pointer",
                              }}
                            >
                              Remove Team
                            </button>
                          </div>
                        </li>
                      ))}
                </ul>
                <div className="add-player" style={{ flexShrink: 0 }}>
                  {listType === "matches" && isConfirmed ? (
                    <button
                      type="button"
                      className="btn-save-match-details"
                      onClick={() => {
                        const updatedTournaments = tournaments.map((t) =>
                          String(t.id) === tournamentId ? { ...t, matches } : t,
                        );
                        setTournaments(updatedTournaments);
                        localStorage.setItem(
                          "tournaments",
                          JSON.stringify(updatedTournaments),
                        );
                        alert("Match details saved.");
                      }}
                      style={{
                        cursor: "pointer",
                      }}
                    >
                      Save Match Details
                    </button>
                  ) : listType === "teams" ? (
                    <button
                      type="button"
                      className="btn-create-matches"
                      disabled={
                        players.length < Number(numTeams) || isConfirmed
                      }
                      onClick={() => {
                        setMatchDetails({
                          id: "",
                          teamA: "",
                          teamB: "",
                          date: "",
                          startTime: "",
                          endTime: "",
                          captainA: "",
                          captainB: "",
                          venueId: "",
                        });
                        setShowConfirmModal(true);
                      }}
                      style={{
                        opacity:
                          players.length < Number(numTeams) || isConfirmed
                            ? 0.5
                            : 1,
                        cursor:
                          players.length < Number(numTeams) || isConfirmed
                            ? "not-allowed"
                            : "pointer",
                      }}
                    >
                      Create Matches
                    </button>
                  ) : null}
                </div>
              </div>
            </div>
            <DeleteTournamentButton onClick={handleDeleteTournament} />
          </div>
        </section>
        {/* <img 
          src={sealImage} 
          alt="KFUPM Seal" 
          className="vertical-seal" 
        /> */}
      </main>
      {showConfirmModal && (
        <div className="security-modal">
          <div
            className="security-modal-content"
            style={{ position: "relative" }}
          >
            <button
              className="close-button"
              type="button"
              onClick={() => setShowConfirmModal(false)}
              aria-label="Close"
              style={{
                position: "absolute",
                top: "0.5rem",
                right: "0.5rem",
                background: "none",
                border: "none",
                fontSize: "1.5rem",
                cursor: "pointer",
              }}
            >
              &times;
            </button>
            <h2>Confirm Teams</h2>
            <p>
              Once you confirm, you will not be able to change the participating
              teams for this tournament.
            </p>
            <div
              style={{
                display: "flex",
                justifyContent: "flex-end",
                gap: "0.5rem",
              }}
            >
              <button
                type="button"
                className="btn-confirm-create-matches"
                onClick={() => {
                  setShowConfirmModal(false);
                  setIsConfirmed(true);
                  // Auto-generate matches
                  const generated = scheduleRoundRobin(
                    players,
                    dateOptions,
                    tournamentId,
                  );
                  setMatches(generated);
                  setListType("matches");
                  // Persist to localStorage
                  const selectedTeamIds = players;
                  const updated = tournaments.map((t) =>
                    String(t.id) === tournamentId
                      ? {
                          ...t,
                          teamIds: selectedTeamIds,
                          matches: generated,
                          lastMatchNumber: generated.length,
                        }
                      : t,
                  );
                  setTournaments(updated);
                  localStorage.setItem("tournaments", JSON.stringify(updated));
                  // Open match modal only if manual editing is desired, else skip
                  setShowMatchModal(false);
                }}
                style={{
                  padding: "0.5rem 1rem",
                  background: "white",
                  color: "#28a745",
                  border: "none",
                  borderRadius: "1.5rem",
                }}
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
      {showMatchModal && (
        <div className="security-modal">
          <div
            className="security-modal-content"
            style={{ position: "relative" }}
          >
            <button
              className="close-button"
              type="button"
              onClick={() => setShowMatchModal(false)}
              aria-label="Close"
            >
              &times;
            </button>
            <h2>{isEditing ? "Edit Match" : "Add New Match"}</h2>
            <div
              style={{
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
                gap: "0.25rem",
                marginBottom: "0.5rem",
              }}
            >
              <label>Match No:</label>
              <input
                type="text"
                value={
                  isEditing
                    ? matchDetails.id
                    : (() => {
                        const current = tournaments.find(
                          (t) => String(t.id) === tournamentId,
                        );
                        const nextNum = (current?.lastMatchNumber || 0) + 1;
                        return `${tournamentId}_${nextNum}`;
                      })()
                }
                disabled
                style={{
                  backgroundColor: "#e0e0e0",
                  color: "#666",
                  cursor: "not-allowed",
                }}
              />
            </div>
            <label
              style={{
                display: "flex",
                alignItems: "center",
                gap: "0.5rem",
                marginBottom: "1rem",
              }}
            >
              Team A:
              <select
                style={{
                  flex: 1,
                  backgroundColor: "#e0e0e0",
                  color: "#666666",
                  borderRadius: "0.5rem",
                  padding: "0.5rem 0.25rem",
                  height: "2.5rem",
                  border: "1px solid #ccc",
                  fontFamily: "Poppins, sans-serif",
                }}
                value={matchDetails.teamA}
                onChange={(e) =>
                  setMatchDetails({ ...matchDetails, teamA: e.target.value })
                }
                disabled={isEditing}
              >
                <option value="">Select Team A</option>
                {availableTeams
                  .filter((team) => team.team_id !== matchDetails.teamB)
                  .map((team) => (
                    <option key={team.team_id} value={team.team_id}>
                      {team.team_name}
                    </option>
                  ))}
              </select>
            </label>
            <label
              style={{
                display: "flex",
                alignItems: "center",
                gap: "0.5rem",
                marginBottom: "1rem",
              }}
            >
              Team B:
              <select
                style={{
                  flex: 1,
                  backgroundColor: "#e0e0e0",
                  color: "#666666",
                  borderRadius: "0.5rem",
                  padding: "0.5rem 0.25rem",
                  height: "2.5rem",
                  border: "1px solid #ccc",
                  fontFamily: "Poppins, sans-serif",
                }}
                value={matchDetails.teamB}
                onChange={(e) =>
                  setMatchDetails({ ...matchDetails, teamB: e.target.value })
                }
                disabled={isEditing}
              >
                <option value="">Select Team B</option>
                {availableTeams
                  .filter((team) => team.team_id !== matchDetails.teamA)
                  .map((team) => (
                    <option key={team.team_id} value={team.team_id}>
                      {team.team_name}
                    </option>
                  ))}
              </select>
            </label>
            <label
              style={{
                display: "flex",
                alignItems: "center",
                gap: "0.5rem",
                marginBottom: "1rem",
              }}
            >
              Captain A:
              <select
                style={{
                  flex: 1,
                  backgroundColor: "white",
                  color: "black",
                  borderRadius: "0.5rem",
                  padding: "0.5rem 0.25rem",
                  height: "2.5rem",
                  border: "1px solid #ccc",
                  fontFamily: "Poppins, sans-serif",
                }}
                value={matchDetails.captainA}
                onChange={(e) =>
                  setMatchDetails({ ...matchDetails, captainA: e.target.value })
                }
                disabled={!matchDetails.teamA}
              >
                <option value="">Select Captain</option>
                {getTeamPlayers(matchDetails.teamA).map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name}
                  </option>
                ))}
              </select>
            </label>
            <label
              style={{
                display: "flex",
                alignItems: "center",
                gap: "0.5rem",
                marginBottom: "1rem",
              }}
            >
              Captain B:
              <select
                style={{
                  flex: 1,
                  backgroundColor: "white",
                  color: "black",
                  borderRadius: "0.5rem",
                  padding: "0.5rem 0.25rem",
                  height: "2.5rem",
                  border: "1px solid #ccc",
                  fontFamily: "Poppins, sans-serif",
                }}
                value={matchDetails.captainB}
                onChange={(e) =>
                  setMatchDetails({ ...matchDetails, captainB: e.target.value })
                }
                disabled={!matchDetails.teamB}
              >
                <option value="">Select Captain</option>
                {getTeamPlayers(matchDetails.teamB).map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name}
                  </option>
                ))}
              </select>
            </label>
            <label
              style={{
                display: "flex",
                alignItems: "center",
                gap: "0.5rem",
                marginBottom: "1rem",
              }}
            >
              Date:
              <select
                style={{
                  flex: 1,
                  backgroundColor: "#f0f0f0",
                  color: "#666",
                  borderRadius: "0.5rem",
                  padding: "0.5rem 0.25rem",
                  height: "2.5rem",
                  border: "1px solid #ccc",
                  fontFamily: "Poppins, sans-serif",
                  cursor: "not-allowed",
                }}
                value={matchDetails.date}
                disabled
              >
                <option value="">Select a Date</option>
                {getDateOptions(startDate, endDate).map((date) => (
                  <option key={date} value={date}>
                    {date}
                  </option>
                ))}
              </select>
            </label>

            <div
              style={{
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
                gap: "0.25rem",
              }}
            >
              <label>Start Time:</label>
              <input
                type="time"
                style={{ flex: 1, marginBottom: "0rem", marginTop: "0rem" }}
                value={matchDetails.startTime || ""}
                onChange={(e) => {
                  // When start time changes, reset venue selection
                  setMatchDetails({
                    ...matchDetails,
                    startTime: e.target.value,
                    venueId: "",
                  });
                }}
              />
            </div>
            <div
              style={{
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
                gap: "0.25rem",
              }}
            >
              <label>End Time:</label>
              <input
                type="time"
                style={{ flex: 1 }}
                value={matchDetails.endTime || ""}
                onChange={(e) => {
                  // When end time changes, reset venue selection
                  setMatchDetails({
                    ...matchDetails,
                    endTime: e.target.value,
                    venueId: "",
                  });
                }}
              />
            </div>
            {/* Venue dropdown inserted after date & time fields */}
            <label
              style={{
                display: "flex",
                alignItems: "center",
                gap: "0.5rem",
                marginBottom: "1rem",
              }}
            >
              Venue:
              <select
                style={{
                  flex: 1,
                  backgroundColor: "white",
                  color: "black",
                  borderRadius: "0.5rem",
                  padding: "0.5rem 0.25rem",
                  height: "2.5rem",
                  border: "1px solid #ccc",
                  fontFamily: "Poppins, sans-serif",
                }}
                value={matchDetails.venueId || ""}
                onChange={(e) =>
                  setMatchDetails({ ...matchDetails, venueId: e.target.value })
                }
                disabled={
                  !matchDetails.date ||
                  !matchDetails.startTime ||
                  !matchDetails.endTime ||
                  matchDetails.startTime >= matchDetails.endTime
                }
              >
                <option value="">Select a Venue</option>
                {getAvailableVenues().map((venue) => (
                  <option key={venue.id} value={venue.id}>
                    {venue.id} ({venue.name})
                  </option>
                ))}
              </select>
            </label>
            <div style={{ marginTop: "1rem" }}>
              <button
                type="button"
                onClick={() => {
                  if (
                    !matchDetails.teamA ||
                    !matchDetails.teamB ||
                    !matchDetails.date ||
                    !matchDetails.startTime ||
                    !matchDetails.endTime ||
                    !matchDetails.venueId
                  ) {
                    alert("All fields are required for the match");
                    return;
                  }
                  if (matchDetails.teamA === matchDetails.teamB) {
                    alert("Team A and Team B must be different");
                    return;
                  }
                  if (matchDetails.endTime <= matchDetails.startTime) {
                    alert("End time must be after start time");
                    return;
                  }
                  // If date is today, ensure start time is after now
                  const [day, month, year] = matchDetails.date.split("-");
                  const selectedDate = new Date(`${year}-${month}-${day}`);
                  const today = new Date();
                  const isToday =
                    selectedDate.toDateString() === today.toDateString();
                  if (isToday) {
                    const [sh, sm] = matchDetails.startTime
                      .split(":")
                      .map(Number);
                    const matchStart = new Date();
                    matchStart.setHours(sh, sm, 0, 0);
                    if (matchStart <= today) {
                      alert(
                        "Start time must be in the future for today's matches",
                      );
                      return;
                    }
                  }
                  // --- Captain validations ---
                  if (!matchDetails.captainA) {
                    alert("Please select a captain for Team A");
                    return;
                  }
                  if (!matchDetails.captainB) {
                    alert("Please select a captain for Team B");
                    return;
                  }
                  // --- End captain validations ---
                  const isNew = !isEditing;
                  const currentTournament = tournaments.find(
                    (t) => String(t.id) === tournamentId,
                  );
                  let newNum = matchDetails.id;
                  if (isNew) {
                    newNum = (currentTournament?.lastMatchNumber || 0) + 1;
                  }
                  const matchId = isEditing
                    ? matchDetails.id
                    : `${tournamentId}_${newNum}`;
                  // Convert dd-mm-yyyy back to yyyy-mm-dd
                  const [d, m, y] = matchDetails.date.split("-");
                  const formattedDate = `${y}-${m}-${d}`;
                  const newMatch = {
                    ...matchDetails,
                    id: matchId,
                    date: formattedDate,
                    venueId: matchDetails.venueId,
                  };
                  // Prevent duplicate match (same teams, date, and time)
                  const duplicateMatch = matches.some(
                    (m) =>
                      m.teamA === newMatch.teamA &&
                      m.teamB === newMatch.teamB &&
                      m.date === newMatch.date &&
                      m.startTime === newMatch.startTime &&
                      m.endTime === newMatch.endTime &&
                      (!isEditing || m.id !== matchId), // Skip the current match when editing
                  );
                  if (duplicateMatch) {
                    alert(
                      "This match already exists with the same teams, date, and time.",
                    );
                    return;
                  }
                  // Set venue status to Reserved if it was Available
                  const venues =
                    JSON.parse(localStorage.getItem("venues")) || [];
                  const updatedVenues = venues.map((v) =>
                    String(v.id) === String(matchDetails.venueId) &&
                    v.status === "Available"
                      ? { ...v, status: "Reserved" }
                      : v,
                  );
                  localStorage.setItem("venues", JSON.stringify(updatedVenues));
                  const updatedTournaments = tournaments.map((t) => {
                    if (String(t.id) !== tournamentId) return t;
                    const updatedMatches = isEditing
                      ? t.matches.map((m) => (m.id === matchId ? newMatch : m))
                      : [...(t.matches || []), newMatch];
                    return {
                      ...t,
                      matches: updatedMatches,
                      lastMatchNumber: isNew ? newNum : t.lastMatchNumber,
                    };
                  });
                  localStorage.setItem(
                    "tournaments",
                    JSON.stringify(updatedTournaments),
                  );
                  setTournaments(updatedTournaments);
                  setMatches(
                    updatedTournaments.find(
                      (t) => String(t.id) === tournamentId,
                    ).matches,
                  );
                  setShowMatchModal(false);
                  setMatchDetails({
                    id: "",
                    teamA: "",
                    teamB: "",
                    date: "",
                    startTime: "",
                    endTime: "",
                    captainA: "",
                    captainB: "",
                    venueId: "",
                  });
                }}
              >
                {isEditing ? "Save Changes" : "Add Match"}
              </button>
            </div>
          </div>
        </div>
      )}
      {viewMatchModal && selectedMatch && (
        <div className="security-modal">
          <div
            className="security-modal-content"
            style={{ position: "relative" }}
          >
            <button
              className="close-button"
              type="button"
              onClick={() => setViewMatchModal(false)}
              aria-label="Close"
            >
              &times;
            </button>
            <h2>Match Details</h2>
            <p>
              <strong>Match No:</strong> {selectedMatch.id}
            </p>
            <p>
              <strong>Team A:</strong>{" "}
              {availableTeams.find(
                (t) => String(t.team_id) === String(selectedMatch.teamA),
              )?.team_name || selectedMatch.teamA}
            </p>
            <p>
              <strong>Team B:</strong>{" "}
              {availableTeams.find(
                (t) => String(t.team_id) === String(selectedMatch.teamB),
              )?.team_name || selectedMatch.teamB}
            </p>
            <p>
              <strong>Date:</strong>{" "}
              {formatDate(selectedMatch.date).replace(/-/g, "/")}
            </p>
            <p>
              <strong>Time:</strong> {selectedMatch.startTime} -{" "}
              {selectedMatch.endTime}
            </p>
            <p>
              <strong>Venue:</strong>{" "}
              {(() => {
                const venue = (
                  JSON.parse(localStorage.getItem("venues")) || []
                ).find((v) => String(v.id) === String(selectedMatch.venueId));
                return venue ? venue.name : "—";
              })()}
            </p>
            <p>
              <strong>Captain A:</strong>{" "}
              {availableTeams
                .find((t) => String(t.team_id) === String(selectedMatch.teamA))
                ?.players?.find(
                  (p) => String(p.id) === String(selectedMatch.captainA),
                )?.name || "—"}
            </p>
            <p>
              <strong>Captain B:</strong>{" "}
              {availableTeams
                .find((t) => String(t.team_id) === String(selectedMatch.teamB))
                ?.players?.find(
                  (p) => String(p.id) === String(selectedMatch.captainB),
                )?.name || "—"}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default EditTournament;
