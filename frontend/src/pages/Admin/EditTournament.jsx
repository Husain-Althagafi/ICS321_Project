import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import AdminSidebar from "../../components/AdminSidebar";
import DeleteTournamentButton from "../../components/DeleteTournamentButton";
import "../../stylesheets/EditTournament.css";
import axios from 'axios'
// Generate round-robin schedule: assign only IDs, teams, and dates; leave captains & venue/time blank
const scheduleRoundRobin = (teams, getDateOptions, tournamentId) => {
  const matches = [];
  const teamIds = []

  teams.forEach(team => {
    teamIds.push(team.team_id);
  });

  let slotIndex = 0;
  // For each unique pair
  for (let i = 0; i < teamIds.length; i++) {
    for (let j = i + 1; j < teamIds.length; j++) {
      // Cycle through dates
      const date = getDateOptions[slotIndex % getDateOptions.length];
      matches.push({
        match_id: `${tournamentId}_${slotIndex + 1}`,
        teama_id: teamIds[i],
        teamb_id: teamIds[j],
        match_date: date,   //should be date
        start_time: "",
        end_time: "",
        venue_id: "",
        captaina_id: "",
        captainb_id: "",
        tournament_id: tournamentId,
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
  const [allMatches, setAllMatches] = useState([]);
  const [venues, setVenues] = useState([])


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
  const [availableTeams, setAvailableTeams] = useState([])
  const [allVenues, setAllVenues] = useState([])

  const [matchDetails, setMatchDetails] = useState({
    match_id: "",
    teama_id: "",
    teamb_id: "",
    match_date: "",
    start_time: "",
    end_time: "",
    captaina_id: "",
    captainb_id: "",
    venue_id: "",
  });
  const isEditing = Boolean(matchDetails.match_id);
  const [listType, setListType] = useState("matches");
  const [isConfirmed, setIsConfirmed] = useState(false);
  // Helper to retrieve a team's player roster
  const getTeamPlayers = (teamId) => {
    if (!teamId || players.length === 0) return [];
    return players.filter(p => String(p.team_id) === String(teamId));
  };


  useEffect(() => {
      //get all venues
      axios.get(`http://localhost:5000/venues`)
      .then((res) => {
        setAllVenues(res.data.data)
      })
      .catch(err => console.error(err))
  }, [])


  useEffect(() => { 
    //get all matches
    axios.get('http://localhost:5000/matches')
    .then(res => {
      setAllMatches(res.data.data.map(match => ({
        ...match,
        // Convert ISO string to Date object
        match_date: match.match_date.split("T")[0],
      })));
    })
    .catch(err => console.error(err));


    //get all matches in a tournament
    axios.get(`http://localhost:5000/tournaments/${tournamentId}/matches`)
    .then(res => {
      setMatches(res.data.data.map(match => ({
        ...match,
        // Convert ISO string to Date object
        match_date: match.match_date.split("T")[0],
      })));
    })
    .catch(err => console.error(err));

    //get all teams in tournament
    axios.get(`http://localhost:5000/tournaments/${tournamentId}/teams`)
    .then((res) => {
      setTeams(res.data.data.teams)
    })
    .catch(err => console.error(err))

    //get all teams
    axios.get(`http://localhost:5000/teams`)
    .then((res) => {
      setAvailableTeams(res.data.data)
    })

    //get tournement
    axios.get(`http://localhost:5000/tournaments/${tournamentId}`)
    .then((res) => {
      const tournamentData = res.data.data[0];
      
      // Convert dates right when setting the tournament state
      setTournament({
        ...tournamentData,
        start_date: tournamentData.start_date.split('T')[0], // "2025-11-10"
        end_date: tournamentData.end_date.split('T')[0]     // "2025-11-20"
      });
      // Populate form fields once tournament data loads
      setTournamentName(tournamentData.name);
      setStartDate(tournamentData.start_date.split('T')[0]);
      setEndDate(tournamentData.end_date.split('T')[0]);
      setNumTeams(tournamentData.num_teams || "");
    })
    .catch(err => {
      console.error(err);
      navigate("/admin/tournaments");
    });

    // // get tournaments
    // axios.get(`http://localhost:5000/tournaments`)
    // .then((res) => {
    //   setTournaments(res.data.data)
    // })
    // .catch(err => console.error(err))

    //get all players in this tournament
    axios.get(`http://localhost:5000/tournaments/${tournamentId}/players`)
    .then((res) => {
      setPlayers(res.data.data)
    })
    .catch(err => console.error(err)) 
  }, [tournamentId, navigate]);

  useEffect(() => {
    setIsConfirmed(matches.length > 0);
  }, [matches]); // Only runs when matches change

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
      String(t.tournament_id) === tournamentId
        ? {
            ...t,
            name: tournamentName,
            start_date: startDate,
            end_date: endDate,
            num_teams: parseInt(numTeams, 10),
            players,
          }
        : t,
    );
    // If you send an axios.patch here, ensure the payload keys are correct:
    // axios.patch(`http://localhost:5000/admin/tournaments/${tournamentId}`, {
    //   name: tournamentName,
    //   start_date: startDate,
    //   end_date: endDate,
    //   num_teams: parseInt(numTeams, 10)
    // })
    // .then(...)
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

    axios.delete(`http://localhost:5000/admin/tournaments/${tournamentId}`)
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
    console.log(dates)
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
  const getAvailableVenues = (newDateStr, newStart, newEnd, editingId) => {

    // If date, start time, or end time is not selected yet, don't perform filtering
    if (!newDateStr || !newStart || !newEnd) {
      return []
    }

    // Convert new match details to comparable formats
    // const newDateFormatted = reverseFormatDate(newDateStr); // Convert dd-mm-yyyy to yyyy-mm-dd
    // const newStartMins = timeToMinutes(newStart);
    // const newEndMins = timeToMinutes(newEnd);

    // Filter venues to exclude those with time conflicts


    const conflictingMatches = allMatches.filter(match => {
      // Skip the current match we're checking
      if (match.match_id === editingId) return false;
      
      // If dates don't match, no conflict
      if (match.match_date !== newDateStr) return false;
      
      // If either match is missing time info, assume no conflict
      if (!match.start_time || !match.end_time || !newStart || !newEnd) return false;
      
      // Convert times to minutes for comparison
      const matchStart = timeToMinutes(match.start_time);
      const matchEnd = timeToMinutes(match.end_time);
      const newStart = timeToMinutes(newStart);
      const newEnd = timeToMinutes(newEnd);
      
      // Check for time overlap
      return (newStart < matchEnd && newEnd > matchStart);
    });

    const bookedVenueIds = conflictingMatches
    .map(match => match.venue_id)
    .filter(venueId => venueId !== null);

  // 3. Return venues that aren't booked
  return allVenues.filter(venue => 
    !bookedVenueIds.includes(venue.venue_id)
  );
}




    //////////
  //   return allVenues.filter((venue) => {

  //     // For reserved venues, check if there's any conflict with existing matches
  //     const venueMatches = allMatches.filter(
  //       (m) =>
  //         String(m.venue_id) === String(venue.match_id) &&
  //         // Skip the match we're currently editing
  //         !(isEditing && m.match_id === editingId),
  //     );

  //     // Check each match for this venue for conflicts
  //     return !venueMatches.some((match) => {
  //       // If not on the same date, no conflict
  //       if (match.match_date !== newDateStr) return false;

  //       // Convert match times to minutes for comparison
  //       const matchStartMins = timeToMinutes(match.start_time);
  //       const matchEndMins = timeToMinutes(match.end_time);

  //       // Check for time overlap
  //       return hasTimeOverlap(
  //         newStart,
  //         newEnd,
  //         matchStartMins,
  //         matchEndMins,
  //       );
  //     });
  //   });
  // };

  // Prepare venues available times per date
  const dateOptions = getDateOptions(startDate, endDate);
  const venuesByDate = {};
  dateOptions.forEach((date) => {
    // For each date, filter venues that are Available
    const avail = allVenues.filter((v) => v.status === "Available");
    venuesByDate[date] = allVenues.map((v) => ({
      id: v.match_id,
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
                    value={tournament.tournament_id}
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
                    value={tournament.name}
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
                    value={tournament.num_teams}
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
                          teams.find(
                            (t) => String(t.team_id) === String(m.teama_id),
                          )?.team_name || m.teama_id;
                        const teamBName =
                          teams.find(
                            (t) => String(t.team_id) === String(m.teamb_id),
                          )?.team_name || m.teamb_id;
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
                              <strong>{teamBName}</strong> ({m.start_time} -{" "}
                              {m.end_time}, {m.match_date.replace(/-/g, "/")})
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
                                  // Pre-fill match details, use m.match_date as is (already in dd-mm-yyyy format)
                                  setMatchDetails({
                                    ...m,
                                    match_date: m.match_date,
                                    captaina_id: m.captaina_id || "",
                                    captainb_id: m.captainb_id || "",
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
                                  teams.length < tournament.num_teams &&
                                  !teams.includes(team.team_id) &&
                                  !isConfirmed
                                ) {
                                  //send axios request to add this team to the tournament
                                  axios.patch(`http://localhost:5000/admin/tournaments/${tournamentId}/teams/${team.team_id}`)
                                  .then((res) => {
                                    setTeams((teams) => [...teams, team]);
                                  })
                                  .catch(err => console.error(err))
                                }
                              }}
                              disabled={
                                teams.length >= tournament.num_teams ||
                                teams.some(t => t.team_id === team.team_id) ||
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
                                  teams.length >= tournament.num_teams ||
                                  teams.some(t => t.team_id === team.team_id) ||
                                  isConfirmed
                                    ? 0.5
                                    : 1,
                                cursor:
                                  teams.length >= tournament.num_teams ||
                                  teams.includes(team.team_id) ||
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

                                  //axios request to remove team from tournament
                                  axios.patch(`http://localhost:5000/admin/tournaments/${tournamentId}/teams/${team.team_id}/remove`)
                                  .then((res) => {
                                    setTeams((prev) =>
                                      prev.filter((t) => t.team_id !== team.team_id),
                                    );
                                  })
                                  .catch(err => console.error(err))
                                  
                                }
                              }}
                              disabled={
                                !teams.some(t => t.team_id === team.team_id)
                                || isConfirmed
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
                                  !teams.some(t => t.team_id === team.team_id) || isConfirmed
                                    ? 0.5
                                    : 1,
                                cursor:
                                  !teams.some(t => t.team_id === team.team_id) || isConfirmed
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
                        // //send request to update match details
                        // axios.patch(`http://localhost:5000/admin/matches/${matchDetails.match_id}`, matchDetails)
                        // .then((res) => {
                        //   const updatedMatches = matches.map((m) =>
                        //     String(m.match_id) === res.data.data.match_id ? res.data.data : m,
                        //   );
                        //   setTournaments(updatedMatches);
                        //   alert("Match details saved.");
                        // })
                        // .catch(err => console.error(err))

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
                        teams.length < tournament.num_teams || isConfirmed
                      }
                      onClick={() => {
                        setMatchDetails({
                          match_id: "",
                          teama_id: "",
                          teamb_id: "",
                          match_date: "",
                          start_time: "",
                          end_time: "",
                          captaina_id: "",
                          captainb_id: "",
                          motm_id : "",
                          scorea: '',
                          scoreb: '',
                          winner_team_id: '',
                          match_completed: '',
                          venueId: "",
                          tournament_id: tournamentId
                        });
                        setShowConfirmModal(true);
                      }}
                      style={{
                        opacity:
                          teams.length < tournament.num_teams || isConfirmed
                            ? 0.5
                            : 1,
                        cursor:
                          teams.length < tournament.num_teams || isConfirmed
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
                    teams,
                    getDateOptions(tournament.start_date, tournament.end_date),
                    tournamentId,
                  );

                  //send request with generated matches to add to db

                
                  axios.post(`http://localhost:5000/admin/tournaments/${tournamentId}/matches`, {
                    matches: generated
                  })
                  .then((res) => {
                    setMatches(generated);
                    setListType("matches");
                  })
                  .catch(err => {
                    console.error(err)
                  });


                  
                  // Persist to localStorage
                  // const selectedTeamIds = teams;
                  // const updated = tournaments.map((t) =>
                  //   String(t.match_id) === tournamentId
                  //     ? {
                  //         ...t,
                  //         teamIds: selectedTeamIds,
                  //         matches: generated,
                  //         lastMatchNumber: generated.length,
                  //       }
                  //     : t,
                  // );
                  // setTournaments(updated);
                  // localStorage.setItem("tournaments", JSON.stringify(updated));
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
                    ? matchDetails.match_id
                    : (() => {
                        const current = tournaments.find(
                          (t) => String(t.match_id) === tournamentId,
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
                value={matchDetails.teama_id}
                onChange={(e) =>
                  setMatchDetails({ ...matchDetails, teama_id: e.target.value })
                }
                disabled={isEditing}
              >
                <option value="">Select Team A</option>
                {teams
                  .filter((team) => team.team_id !== matchDetails.teamb_id)
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
                value={matchDetails.teamb_id}
                onChange={(e) =>
                  setMatchDetails({ ...matchDetails, teamb_id: e.target.value })
                }
                disabled={isEditing}
              >
                <option value="">Select Team B</option>
                {teams
                  .filter((team) => team.team_id !== matchDetails.teama_id)
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
                value={matchDetails.captaina_id}
                onChange={(e) =>
                  setMatchDetails({ ...matchDetails, captaina_id: e.target.value })
                }
                disabled={!matchDetails.teama_id}
              >
                <option value="">Select Captain</option>
                {getTeamPlayers(matchDetails.teama_id)?.map((p) => (
                  <option key={p.player_id} value={p.player_id}>
                    {p.player_name}
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
                value={matchDetails.captainb_id}
                onChange={(e) =>
                  setMatchDetails({ ...matchDetails, captainb_id: e.target.value })
                }
                disabled={!matchDetails.teamb_id}
              >
                <option value="">Select Captain</option>
                {getTeamPlayers(matchDetails.teamb_id)?.map((p) => (
                  <option key={p.player_id} value={p.player_id}>
                    {p.player_name}
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
                backgroundColor: "white",
                color: "black",
                borderRadius: "0.5rem",
                padding: "0.5rem 0.25rem",
                height: "2.5rem",
                border: "1px solid #ccc",
                fontFamily: "Poppins, sans-serif",
              }}

                // style={{
                //   flex: 1,
                //   backgroundColor: "#f0f0f0",
                //   color: "#666",
                //   borderRadius: "0.5rem",
                //   padding: "0.5rem 0.25rem",
                //   height: "2.5rem",
                //   border: "1px solid #ccc",
                //   fontFamily: "Poppins, sans-serif",
                //   // cursor: "not-allowed",
                // }}
                
                value={matchDetails.match_date}
                onChange={(e) => {
                  setMatchDetails({ ...matchDetails, match_date: e.target.value })
                }
                }
                // disabled
              >
                <option value="">Select a Date</option>
                {getDateOptions(tournament.start_date, tournament.end_date).map((date) => (
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
                value={matchDetails.start_time || ""}
                onChange={(e) => {
                  // When start time changes, reset venue selection
                  setMatchDetails({
                    ...matchDetails,
                    start_time: e.target.value,
                    venue_id: "",
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
                value={matchDetails.end_time || ""}
                onChange={(e) => {
                  // When end time changes, reset venue selection
                  setMatchDetails({
                    ...matchDetails,
                    end_time: e.target.value,
                    venue_id: "",
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
                value={matchDetails.venue_id || ""}
                onChange={(e) =>
                  setMatchDetails({ ...matchDetails, venue_id: e.target.value })
                }
                disabled={
                  !matchDetails.match_date ||
                  !matchDetails.start_time ||
                  !matchDetails.end_time ||
                  matchDetails.start_time >= matchDetails.end_time
                }
              >
                <option value="">Select a Venue</option>
                {getAvailableVenues(matchDetails.match_date, matchDetails.start_time, matchDetails.end_time, matchDetails.match_id).map((venue) => (
                  <option key={venue.venue_id} value={venue.venue_id}>
                    {venue.venue_id} ({venue.venue_name})
                  </option>
                ))}
              </select>
            </label>
            <div style={{ marginTop: "1rem" }}>
              <button
                type="button"
                onClick={() => {
                  if (
                    !matchDetails.teama_id ||
                    !matchDetails.teamb_id ||
                    !matchDetails.match_date ||
                    !matchDetails.start_time ||
                    !matchDetails.end_time ||
                    !matchDetails.venue_id
                  ) {
                    alert("All fields are required for the match");
                    return;
                  }
                  if (matchDetails.teama_id === matchDetails.teamb_id) {
                    alert("Team A and Team B must be different");
                    return;
                  }
                  if (matchDetails.end_time <= matchDetails.start_time) {
                    alert("End time must be after start time");
                    return;
                  }
                  // If date is today, ensure start time is after now
                  const [day, month, year] = matchDetails.match_date.split("-");
                  const selectedDate = new Date(`${year}-${month}-${day}`);
                  const today = new Date();
                  const isToday =
                    selectedDate.toDateString() === today.toDateString();
                  if (isToday) {
                    const [sh, sm] = matchDetails.start_time
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
                  if (!matchDetails.captaina_id) {
                    alert("Please select a captain for Team A");
                    return;
                  }
                  if (!matchDetails.captainb_id) {
                    alert("Please select a captain for Team B");
                    return;
                  }
                  // --- End captain validations ---
                  const isNew = !isEditing;
                  const currentTournament = tournaments.find(
                    (t) => String(t.match_id) === tournamentId,
                  );
                  let newNum = matchDetails.match_id;
                  if (isNew) {
                    newNum = (currentTournament?.lastMatchNumber || 0) + 1;
                  }
                  const matchId = isEditing
                    ? matchDetails.match_id
                    : `${tournamentId}_${newNum}`;
                  // Convert dd-mm-yyyy back to yyyy-mm-dd
                  const [d, m, y] = matchDetails.match_date.split("-");
                  const formattedDate = `${y}-${m}-${d}`;
                  const newMatch = {
                    ...matchDetails,
                    match_id: matchId,
                    match_date: formattedDate,
                    venue_id: matchDetails.venue_id,
                  };
                  // Prevent duplicate match (same teams, date, and time)
                  const duplicateMatch = matches.some(
                    (m) =>
                      m.teama_id === newMatch.teama_id &&
                      m.teamb_id === newMatch.teamb_id &&
                      m.match_date === newMatch.match_date &&
                      m.start_time === newMatch.start_time &&
                      m.end_time === newMatch.end_time &&
                      (!isEditing || m.match_id !== matchId), // Skip the current match when editing
                  );
                  if (duplicateMatch) {
                    alert(
                      "This match already exists with the same teams, date, and time.",
                    );
                    return;
                  }

                  matchDetails.tournament_id = tournamentId
                  //send request to update match details
                        axios.patch(`http://localhost:5000/admin/matches/${matchDetails.match_id}`, matchDetails)
                        .then((res) => {
                          const updatedMatches = matches.map((m) =>
                            String(m.match_id) === res.data.data.match_id ? res.data.data : m,
                          );
                          setMatches(updatedMatches);
                          alert("Match details updated.");
                        })
                        .catch(err => console.error(err))
                  
                  const updatedTournaments = tournaments.map((t) => {
                    if (String(t.match_id) !== tournamentId) return t;
                    const updatedMatches = isEditing
                      ? t.matches.map((m) => (m.match_id === matchId ? newMatch : m))
                      : [...(t.matches || []), newMatch];
                    return {
                      ...t,
                      matches: updatedMatches,
                      lastMatchNumber: isNew ? newNum : t.lastMatchNumber,
                    };
                  });
                  
                  setTournaments(updatedTournaments);
                  // setMatches(
                  //   updatedTournaments.find(
                  //     (t) => String(t.match_id) === tournamentId,
                  //   ).matches,
                  // );
                  setShowMatchModal(false);
                  setMatchDetails({
                    match_id: "",
                    teama_id: "",
                    teamb_id: "",
                    match_date: "",
                    start_time: "",
                    end_time: "",
                    captaina_id: "",
                    captainb_id: "",
                    venue_id: "",
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
              <strong>Match No:</strong> {selectedMatch.match_id}
            </p>
            <p>
              <strong>Team A:</strong>{" "}
              {teams.find(
                (t) => String(t.team_id) === String(selectedMatch.teama_id),
              )?.team_name || selectedMatch.teama_id}
            </p>
            <p>
              <strong>Team B:</strong>{" "}
              {teams.find(
                (t) => String(t.team_id) === String(selectedMatch.teamb_id),
              )?.team_name || selectedMatch.teamb_id}
            </p>
            <p>
              <strong>Date:</strong>{" "}
              {formatDate(selectedMatch.match_date).replace(/-/g, "/")}
            </p>
            <p>
              <strong>Time:</strong> {selectedMatch.start_time} -{" "}
              {selectedMatch.end_time}
            </p>
            <p>
              <strong>Venue:</strong>{" "}
              {allVenues.find(
                (v) => String(v.venue_id) === String(selectedMatch.venue_id),
              )?.venue_name || '-'}
            </p>
            <p>
              <strong>Captain A:</strong>{" "}
              {
                players.find(
                  (p) => String(p.player_id) === String(selectedMatch.captaina_id),
                )?.player_name || '-'
              }
            </p>
            <p>
              <strong>Captain B:</strong>{" "}
              {
                players.find(
                  (p) => String(p.player_id) === String(selectedMatch.captainb_id),
                )?.player_name || '-'
              }
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default EditTournament;
