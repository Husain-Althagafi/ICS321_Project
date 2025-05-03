import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import AdminSidebar from '../../components/AdminSidebar';
import DeleteTournamentButton from '../../components/DeleteTournamentButton';
// import sealImage from '../../assets/icons/KFUPM Seal White.png';
import bgImage from '../../assets/images/Illustration 1@4x.png';
import '../../stylesheets/EditTournament.css';

const EditTournament = () => {
  // Helper to format yyyy-mm-dd to dd-mm-yyyy
  const formatDate = (dateString) => {
    if (!dateString) return '';
    const [y, m, d] = dateString.split('-');
    return `${d}-${m}-${y}`;
  };
  const navigate = useNavigate();
  const { tournamentId } = useParams();
  const username = 'john.doe'; // Replace with actual dynamic source later
  const [first, last] = username.split('.');
  const initials = `${first[0]}${last[0]}`.toUpperCase();
  const formattedName = `${first.charAt(0).toUpperCase() + first.slice(1)} ${last.charAt(0).toUpperCase() + last.slice(1)}`;

  const [tournaments, setTournaments] = useState(() => {
    const stored = localStorage.getItem('tournaments');
    return stored ? JSON.parse(stored) : [];
  });
  const [tournamentName, setTournamentName] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [players, setPlayers] = useState([]);
  const [matches, setMatches] = useState([]);
  const [newPlayer, setNewPlayer] = useState('');
  const [showPlayerModal, setShowPlayerModal] = useState(false);
  const [playerDetails, setPlayerDetails] = useState({ id: '', name: '', jerseyNumber: '', position: '', isSubstitute: false });
  const [playerError, setPlayerError] = useState('');
  const [showMatchModal, setShowMatchModal] = useState(false);
  const [viewMatchModal, setViewMatchModal] = useState(false);
  const [selectedMatch, setSelectedMatch] = useState(null);
  const [matchDetails, setMatchDetails] = useState({
    id: '',
    teamA: '',
    teamB: '',
    date: '',
    startTime: '',
    endTime: '',
    captainA: '',
    captainB: ''
  });
  const isEditing = Boolean(matchDetails.id);
  const [availableTeams, setAvailableTeams] = useState([]);
  // Helper to retrieve a team's player roster
  const getTeamPlayers = (teamId) => {
    const team = availableTeams.find(t => String(t.team_id) === String(teamId));
    return team?.players || [];
  };

  useEffect(() => {
    const storedTournaments = JSON.parse(localStorage.getItem('tournaments')) || [];
    const allTeams = JSON.parse(localStorage.getItem('teams')) || [];
    setAvailableTeams(allTeams);

    const tournament = storedTournaments.find(t => String(t.id) === tournamentId);
    if (tournament) {
      setTournamentName(tournament.name);
      setStartDate(tournament.startDate);
      setEndDate(tournament.endDate);
      setTournaments(storedTournaments);
      setPlayers(tournament.players || []);
      setMatches(tournament.matches || []);
      // Initialize persistent match counter if missing
      if (tournament.lastMatchNumber == null) {
        const existing = tournament.matches || [];
        const maxSuffix = existing.reduce((max, m) => {
          const parts = m.id.split('_');
          const num = parseInt(parts[1], 10);
          return Math.max(max, isNaN(num) ? 0 : num);
        }, 0);
        tournament.lastMatchNumber = maxSuffix;
        // Update tournaments array and persist
        const updatedAll = storedTournaments.map(t =>
          String(t.id) === tournamentId ? { ...t, lastMatchNumber: maxSuffix } : t
        );
        localStorage.setItem('tournaments', JSON.stringify(updatedAll));
        setTournaments(updatedAll);
      }
    } else {
      navigate('/admin/tournaments');
    }
  }, [tournamentId, navigate]);

  const handleUpdateTeam = (e) => {
    e.preventDefault();
    if (!tournamentName || !startDate || !endDate) {
      const msg = 'All fields are required.';
      setErrorMsg(msg);
      setTimeout(() => alert(msg), 0);
      return;
    }
    const today = new Date().setHours(0, 0, 0, 0);
    const start = new Date(startDate).setHours(0, 0, 0, 0);
    const end = new Date(endDate).setHours(0, 0, 0, 0);

    if (start > end) {
      const msg = 'Start date cannot be after end date.';
      setErrorMsg(msg);
      setTimeout(() => alert(msg), 0);
      return;
    }
    if (start < today || end < today) {
      const msg = 'Start and end dates cannot be in the past.';
      setErrorMsg(msg);
      setTimeout(() => alert(msg), 0);
      return;
    }
    const updatedTournaments = tournaments.map(t =>
      String(t.id) === tournamentId
        ? { ...t, name: tournamentName, startDate, endDate, players }
        : t
    );
    localStorage.setItem('tournaments', JSON.stringify(updatedTournaments));
    navigate('/admin/tournaments');
  };

  const handleAddPlayer = () => {
    if (newPlayer.trim() === '') return;
    setPlayers(prev => [...prev, newPlayer.trim()]);
    setNewPlayer('');
  };

  const handleDeleteTournament = () => {
    const confirmDelete = window.confirm('Are you sure you want to delete this tournament?');
    if (!confirmDelete) return;

    const updatedTournaments = tournaments.filter(t => String(t.id) !== tournamentId);
    localStorage.setItem('tournaments', JSON.stringify(updatedTournaments));
    navigate('/admin/tournaments');
  };

  // Utility function to get date options between start and end
  const getDateOptions = (start, end) => {
    const dates = [];
    if (!start || !end) return dates;
    let current = new Date(start);
    const endDate = new Date(end);
    while (current <= endDate) {
      const day = String(current.getDate()).padStart(2, '0');
      const month = String(current.getMonth() + 1).padStart(2, '0');
      const year = current.getFullYear();
      dates.push(`${day}-${month}-${year}`);
      current.setDate(current.getDate() + 1);
    }
    return dates;
  };

  return (
    <div className="admin-home">
      <AdminSidebar initials={initials} formattedName={formattedName} />

      <main className="main-content">
        <div className="bg-overlay"></div>
        <header className="topbar">
          <h1>
            Edit Tournament
          </h1>
        </header>

        <section className="tournament-form">
          <div className="form-container">
            <h2>Tournament Details</h2>
            <div className="edit-team-content">
            <form onSubmit={handleUpdateTeam} className="form-grid">
              <label>
                Tournament ID:
                <input
                  type="text"
                  value={tournamentId}
                  disabled
                  style={{ backgroundColor: '#f0f0f0', color: '#666', cursor: 'not-allowed' }}
                />
              </label>
              <label>
                Tournament Name:
                <input type="text" value={tournamentName} onChange={(e) => setTournamentName(e.target.value)} required />
              </label>
              <label>
                Start Date:
                <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} required />
              </label>
              <label>
                End Date:
                <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} required />
              </label>
              {errorMsg && <p className="form-error">{errorMsg}</p>}
              <button type="submit">Save Changes</button>
            </form>
            <div className="players-list" style={{ display: 'flex', flexDirection: 'column', height: '40vh' }}>
              <label>Matches</label>
              <ul style={{ flexGrow: 1, overflowY: 'auto' }}>
                {matches.map((m, idx) => {
                  const teamAName = availableTeams.find(t => String(t.team_id) === String(m.teamA))?.team_name || m.teamA;
                  const teamBName = availableTeams.find(t => String(t.team_id) === String(m.teamB))?.team_name || m.teamB;
                  return (
                    <li
                      key={idx}
                      style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
                    >
                      <span>
                        <strong>{teamAName}</strong> vs <strong>{teamBName}</strong> ({m.startTime} - {m.endTime}, {formatDate(m.date)})
                      </span>
                      <div style={{ display: 'flex', gap: '0.25rem' }}>
                        <button
                          type="button"
                          className="btn-view"
                          style={{ fontSize: '0.75rem', padding: '0.25rem 0.5rem', width: '4rem' }}
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
                          style={{ fontSize: '0.75rem', padding: '0.25rem 0.5rem', width: '4rem', backgroundColor: 'orange', color: 'white' }}
                          onClick={() => {
                            // Pre-fill match details, converting stored ISO date to dd-mm-yyyy format
                            setMatchDetails({
                              ...m,
                              date: formatDate(m.date),
                              captainA: m.captainA || '',
                              captainB: m.captainB || ''
                            });
                            setShowMatchModal(true);
                          }}
                        >
                          Edit
                        </button>
                        <button
                          type="button"
                          className="btn-delete"
                          style={{ fontSize: '0.75rem', padding: '0.25rem 0.5rem', width: '4rem', backgroundColor: 'red', color: 'white' }}
                          onClick={() => {
                            if (window.confirm('Are you sure you want to delete this match?')) {
                              const updated = matches.filter((_, i) => i !== idx);
                              setMatches(updated);
                              const updatedTournaments = tournaments.map(t =>
                                String(t.id) === tournamentId ? { ...t, matches: updated } : t
                              );
                              setTournaments(updatedTournaments);
                              localStorage.setItem('tournaments', JSON.stringify(updatedTournaments));
                            }
                          }}
                        >
                          Delete
                        </button>
                      </div>
                    </li>
                  );
                })}
              </ul>
              <div className="add-player" style={{ flexShrink: 0 }}>
                <button
                  type="button"
                  onClick={() => {
                    // Reset match details for a fresh "Add" modal
                    setMatchDetails({
                      id: '',
                      teamA: '',
                      teamB: '',
                      date: '',
                      startTime: '',
                      endTime: '',
                      captainA: '',
                      captainB: ''
                    });
                    setShowMatchModal(true);
                  }}
                >
                  Add Match
                </button>
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
      {showMatchModal && (
        <div className="security-modal">
          <div className="security-modal-content" style={{ position: 'relative' }}>
            <button
              className='close-button'
              type="button"
              onClick={() => setShowMatchModal(false)}
              aria-label="Close"
            >
              &times;
            </button>
            <h2>{isEditing ? 'Edit Match' : 'Add New Match'}</h2>
            <div style={{ display: 'flex', flexDirection: 'column', marginBottom: '1rem' }}>
              <label>Match No:</label>
              <input
                type="text"
                value={
                  isEditing
                    ? matchDetails.id
                    : (() => {
                        const current = tournaments.find(t => String(t.id) === tournamentId);
                        const nextNum = (current?.lastMatchNumber || 0) + 1;
                        return `${tournamentId}_${nextNum}`;
                      })()
                }
                disabled
                style={{ backgroundColor: '#e0e0e0', color: '#666', cursor: 'not-allowed' }}
              />
            </div>
            <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
              Team A:
              <select
                style={{ flex: 1 }}
                value={matchDetails.teamA}
                onChange={e => setMatchDetails({ ...matchDetails, teamA: e.target.value })}
              >
                <option value="">Select Team A</option>
                {availableTeams
                  .filter(team => team.team_id !== matchDetails.teamB)
                  .map((team) => (
                    <option key={team.team_id} value={team.team_id}>
                      {team.team_name}
                    </option>
                  ))}
              </select>
            </label>
            <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
              Team B:
              <select
                style={{ flex: 1 }}
                value={matchDetails.teamB}
                onChange={e => setMatchDetails({ ...matchDetails, teamB: e.target.value })}
              >
                <option value="">Select Team B</option>
                {availableTeams
                  .filter(team => team.team_id !== matchDetails.teamA)
                  .map((team) => (
                    <option key={team.team_id} value={team.team_id}>
                      {team.team_name}
                    </option>
                  ))}
              </select>
            </label>
            <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
              Captain A:
              <select
                style={{ flex: 1 }}
                value={matchDetails.captainA}
                onChange={e => setMatchDetails({ ...matchDetails, captainA: e.target.value })}
              >
                <option value="">Select Captain</option>
                {getTeamPlayers(matchDetails.teamA).map(p => (
                  <option key={p.id} value={p.id}>{p.name}</option>
                ))}
              </select>
            </label>
            <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
              Captain B:
              <select
                style={{ flex: 1 }}
                value={matchDetails.captainB}
                onChange={e => setMatchDetails({ ...matchDetails, captainB: e.target.value })}
              >
                <option value="">Select Captain</option>
                {getTeamPlayers(matchDetails.teamB).map(p => (
                  <option key={p.id} value={p.id}>{p.name}</option>
                ))}
              </select>
            </label>
            <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
              Date:
              <select
                style={{ flex: 1 }}
                value={matchDetails.date}
                onChange={e => setMatchDetails({ ...matchDetails, date: e.target.value })}
              >
                <option value="">Select a Date</option>
                {getDateOptions(startDate, endDate).map(date => (
                  <option key={date} value={date}>{date}</option>
                ))}
              </select>
            </label>

            <div style={{ display: 'flex', flexDirection: 'column', marginBottom: '1rem' }}>
              <label>Start Time:</label>
              <input
                type="time"
                style={{ flex: 1 }}
                value={matchDetails.startTime || ''}
                onChange={e => setMatchDetails({ ...matchDetails, startTime: e.target.value })}
              />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', marginBottom: '1rem' }}>
              <label>End Time:</label>
              <input
                type="time"
                style={{ flex: 1 }}
                value={matchDetails.endTime || ''}
                onChange={e => setMatchDetails({ ...matchDetails, endTime: e.target.value })}
              />
            </div>
            <div style={{ marginTop: '1rem' }}>
              <button
                type="button"
                onClick={() => {
                  if (!matchDetails.teamA || !matchDetails.teamB || !matchDetails.date || !matchDetails.startTime || !matchDetails.endTime) {
                    alert('All fields are required for the match');
                    return;
                  }
                  if (matchDetails.teamA === matchDetails.teamB) {
                    alert('Team A and Team B must be different');
                    return;
                  }
                  if (matchDetails.endTime <= matchDetails.startTime) {
                    alert('End time must be after start time');
                    return;
                  }
                  // If date is today, ensure start time is after now
                  const [day, month, year] = matchDetails.date.split('-');
                  const selectedDate = new Date(`${year}-${month}-${day}`);
                  const today = new Date();
                  const isToday = selectedDate.toDateString() === today.toDateString();
                  if (isToday) {
                    const [sh, sm] = matchDetails.startTime.split(':').map(Number);
                    const matchStart = new Date();
                    matchStart.setHours(sh, sm, 0, 0);
                    if (matchStart <= today) {
                      alert('Start time must be in the future for today\'s matches');
                      return;
                    }
                  }
                  // --- Captain validations ---
                  if (!matchDetails.captainA) {
                    alert('Please select a captain for Team A');
                    return;
                  }
                  if (!matchDetails.captainB) {
                    alert('Please select a captain for Team B');
                    return;
                  }
                  // --- End captain validations ---
                  const isNew = !isEditing;
                  const currentTournament = tournaments.find(t => String(t.id) === tournamentId);
                  let newNum = matchDetails.id;
                  if (isNew) {
                    newNum = ((currentTournament?.lastMatchNumber || 0) + 1);
                  }
                  const matchId = isEditing ? matchDetails.id : `${tournamentId}_${newNum}`;
                  // Convert dd-mm-yyyy back to yyyy-mm-dd
                  const [d, m, y] = matchDetails.date.split('-');
                  const formattedDate = `${y}-${m}-${d}`;
                  const newMatch = {
                    ...matchDetails,
                    id: matchId,
                    date: formattedDate,
                  };
                  const updatedTournaments = tournaments.map(t => {
                    if (String(t.id) !== tournamentId) return t;
                    const updatedMatches = isEditing
                      ? t.matches.map(m => m.id === matchId ? newMatch : m)
                      : [...(t.matches || []), newMatch];
                    return {
                      ...t,
                      matches: updatedMatches,
                      lastMatchNumber: isNew ? newNum : t.lastMatchNumber
                    };
                  });
                  localStorage.setItem('tournaments', JSON.stringify(updatedTournaments));
                  setTournaments(updatedTournaments);
                  setMatches(updatedTournaments.find(t => String(t.id) === tournamentId).matches);
                  setShowMatchModal(false);
                  setMatchDetails({ id: '', teamA: '', teamB: '', date: '', startTime: '', endTime: '', captainA: '', captainB: '' });
                }}
              >
                {isEditing ? 'Save Changes' : 'Add Match'}
              </button>
            </div>
          </div>
        </div>
      )}
      {viewMatchModal && selectedMatch && (
        <div className="security-modal">
          <div className="security-modal-content" style={{ position: 'relative' }}>
            <button
              className='close-button'
              type="button"
              onClick={() => setViewMatchModal(false)}
              aria-label="Close"
            >
              &times;
            </button>
            <h2>Match Details</h2>
            <p><strong>Match No:</strong> {selectedMatch.id}</p>
            <p>
              <strong>Team A:</strong> {
                availableTeams.find(t => String(t.team_id) === String(selectedMatch.teamA))?.team_name || selectedMatch.teamA
              }
            </p>
            <p>
              <strong>Team B:</strong> {
                availableTeams.find(t => String(t.team_id) === String(selectedMatch.teamB))?.team_name || selectedMatch.teamB
              }
            </p>
            <p><strong>Date:</strong> {formatDate(selectedMatch.date)}</p>
            <p><strong>Time:</strong> {selectedMatch.startTime} - {selectedMatch.endTime}</p>
            <p>
              <strong>Captain A:</strong>{' '}
              {availableTeams
                .find(t => String(t.team_id) === String(selectedMatch.teamA))
                ?.players.find(p => String(p.id) === String(selectedMatch.captainA))
                ?.name || '—'}
            </p>
            <p>
              <strong>Captain B:</strong>{' '}
              {availableTeams
                .find(t => String(t.team_id) === String(selectedMatch.teamB))
                ?.players.find(p => String(p.id) === String(selectedMatch.captainB))
                ?.name || '—'}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default EditTournament;