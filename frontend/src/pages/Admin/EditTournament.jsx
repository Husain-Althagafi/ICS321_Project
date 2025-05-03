import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import AdminSidebar from '../../components/AdminSidebar';
import DeleteTournamentButton from '../../components/DeleteTournamentButton';
// import sealImage from '../../assets/icons/KFUPM Seal White.png';
import bgImage from '../../assets/images/Illustration 1@4x.png';
import '../../stylesheets/EditTournament.css';

const EditTournament = () => {
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
  const [newPlayer, setNewPlayer] = useState('');
  const [showPlayerModal, setShowPlayerModal] = useState(false);
  const [playerDetails, setPlayerDetails] = useState({ id: '', name: '', jerseyNumber: '', position: '', isSubstitute: false });
  const [playerError, setPlayerError] = useState('');

  useEffect(() => {
    const storedTournaments = JSON.parse(localStorage.getItem('tournaments')) || [];
    const tournament = storedTournaments.find(t => String(t.id) === tournamentId);
    if (tournament) {
      setTournamentName(tournament.name);
      setStartDate(tournament.startDate);
      setEndDate(tournament.endDate);
      setTournaments(storedTournaments);
      setPlayers(tournament.players || []);
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
                  style={{ backgroundColor: '#f0f0f0', cursor: 'not-allowed' }}
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
                {players.map((p, idx) => (
                  <li key={idx}>
                    {p.name} ({p.position})
                    {p.isSubstitute && <span style={{ color: 'red', fontWeight: "bold" }}>&nbsp;Sub</span>}
                  </li>
                ))}
              </ul>
              <div className="add-player" style={{ flexShrink: 0 }}>
                <button type="button" onClick={() => setShowPlayerModal(true)}>
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
      {showPlayerModal && (
        <div className="security-modal">
          <div className="security-modal-content" style={{ position: 'relative' }}>
            <button
            className='close-button'
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
            <label>Tournament ID
            <input
              type="text"
              placeholder="Tournament ID"
              value={tournamentId}
              disabled
            />
            </label>
            <label>Player ID
            <input
              type="text"
              placeholder="Player ID (e.g. s20xxxxxxx)"
              value={playerDetails.id}
              maxLength={10}
              onChange={e => {
                const value = e.target.value;
                if (value.length <= 10) {
                  setPlayerDetails({ ...playerDetails, id: value });
                }
              }}
            />
            </label>
            
            <label>Player Name
            <input
              type="text"
              placeholder="Player Name"
              value={playerDetails.name}
              onChange={e => setPlayerDetails({ ...playerDetails, name: e.target.value })}
            />
            </label>

            <label>Jersey Number
            <input
              type="number"
              placeholder="Jersey Number"
              min="1"
              value={playerDetails.jerseyNumber}
              onChange={e => {
                const value = e.target.value;
                if (Number(value) >= 1 || value === '') {
                  setPlayerDetails({ ...playerDetails, jerseyNumber: value });
                }
              }}
            />
            </label>

            <label>Player Position: 
              <select
                value={playerDetails.position}
                onChange={e => setPlayerDetails({ ...playerDetails, position: e.target.value })}
              >
                <option value="">Select Position</option>
                <option value="Goalkeeper">Goalkeeper</option>
                <option value="Right Back">Right Back</option>
                <option value="Left Back">Left Back</option>
                <option value="Center Back">Center Back</option>
                <option value="Defensive Midfielder">Defensive Midfielder</option>
                <option value="Central Midfielder">Central Midfielder</option>
                <option value="Attacking Midfielder">Attacking Midfielder</option>
                <option value="Right Winger">Right Winger</option>
                <option value="Left Winger">Left Winger</option>
                <option value="Striker">Striker</option>
                <option value="Second Striker">Second Striker</option>
              </select>
            </label>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', margin: '1rem 0' }}>
            <label style={{margin: "0rem"}}>Substitute: </label>
              <input
                type="checkbox"
                style={{ width: '1rem', margin: "0rem" }}
                checked={playerDetails.isSubstitute}
                onChange={e => setPlayerDetails({ ...playerDetails, isSubstitute: e.target.checked })}
              />
            </div>

            <div style={{ marginTop: '1rem' }}>
              <button
                type="button"
                onClick={() => {
                  if (!/^s20.{7}$/.test(playerDetails.id)) {
                    setPlayerError('Player ID must start with "s20" and be 10 characters long');
                    return;
                  }
                  if (!playerDetails.id.trim() || !playerDetails.name.trim() || !playerDetails.jerseyNumber || !playerDetails.position.trim()) {
                    setPlayerError('All fields are required');
                    return;
                  }
                  setPlayers(prev => [...prev, playerDetails]);
                  setPlayerDetails({ id: '', name: '', jerseyNumber: '', position: '', isSubstitute: false });
                  setPlayerError('');
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
    </div>
  );
};

export default EditTournament;