import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import AdminSidebar from '../../components/AdminSidebar';
import '../../stylesheets/DetailedMatchStats.css';
import goalIcon from '../../assets/icons/goal.png';
import noGoalIcon from '../../assets/icons/no-goal.svg';
import redCardIcon from '../../assets/icons/red_card.png';
import yellowCardIcon from '../../assets/icons/yellow_card.svg';
import goldenBootIcon from '../../assets/icons/golden-boot.png';

const DetailedMatchStats = () => {
  // Helper to format yyyy-mm-dd to dd-mm-yyyy
  const formatDate = (dateString) => {
    if (!dateString) return '';
    const [y, m, d] = dateString.split('-');
    return `${d}-${m}-${y}`;
  };

  const { tournamentId, matchId } = useParams();
  const username = 'john.doe'; // Replace with actual dynamic source later
  const [first, last] = username.split('.');
  const initials = `${first[0]}${last[0]}`.toUpperCase();
  const formattedName = `${first.charAt(0).toUpperCase() + first.slice(1)} ${last.charAt(0).toUpperCase() + last.slice(1)}`;

  const [matches, setMatches] = useState([]);
  const [availableTeams, setAvailableTeams] = useState([]);
  const match = matches.find(m => String(m.id) === matchId) || {};

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem('tournaments')) || [];
    setAvailableTeams(JSON.parse(localStorage.getItem('teams')) || []);
    const tour = stored.find(t => String(t.id) === tournamentId);
    setMatches(tour?.matches || []);
  }, [tournamentId]);

  return (
    <div className="admin-home">
      <AdminSidebar initials={initials} formattedName={formattedName} />

      <main className="main-content">
        <div className="bg-overlay"></div>
        <header className="topbar">
          <h1>
            Match Details
          </h1>
        </header>
        <section className="detailed-matches">
          <div className='detailed-match-stats-header' style={{ textAlign: 'left', width: '100%' }}>
            <h2>Edit Match Stats</h2>
          </div>
          <div className = "team-stats" style={{ display: 'flex', justifyContent: 'center', gap: '2rem', margin: '1rem 0' }}>
              <h1 className="teamA-name">
                {availableTeams.find(t => String(t.team_id) === String(match.teamA))?.team_name || match.teamA}
              </h1>
              <h2>
                {match.scoreA || 0} - {match.scoreB || 0}
              </h2>
              <h1 className="teamB-name">
                {availableTeams.find(t => String(t.team_id) === String(match.teamB))?.team_name || match.teamB}
              </h1>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', gap: '2rem', marginTop: '0rem' }}>
            {/* Left team players */}
            <div className="players-list" style={{ flex: 1, display: 'flex', flexDirection: 'column', height: '40vh' }}>
              <label>Players</label>
                <ul style={{ flexGrow: 1, overflowY: 'auto' }}>
                  {(availableTeams.find(t => String(t.team_id) === String(match.teamA))?.players || []).map((p, idx) => (
                    <li key={idx} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span>
                        {p.name} ({p.position})
                        {p.isSubstitute && <span style={{ color: 'red', fontWeight: 'bold' }}> Sub</span>}
                        {match.captainA === p.id && <span className="captain-status" style={{ marginLeft: '0.5rem' }}>(Captain)</span>}
                      </span>
                      <div style={{ display: 'flex', gap: '1rem' }}>
                        <button type="button" className="btn-motm">
                          <img src={goldenBootIcon} alt="MOTM" style={{ width: '1.5rem', height: '1.5rem' }} />
                        </button>
                        <button type="button" className="btn-goal">
                          <img src={goalIcon} alt="Goal" style={{ width: '1.5rem', height: '1.5rem' }} />
                        </button>
                        <button type="button" className="btn-no-goal">
                          <img src={goalIcon} alt="No Goal" style={{ width: '1.5rem', height: '1.5rem' }} />
                        </button>
                        <button type="button" className="btn-red-card">
                          <img src={redCardIcon} alt="Red Card" style={{ width: '1.5rem', height: '1.5rem' }} />
                        </button>
                        <button type="button" className="btn-yellow-card">
                          <img src={yellowCardIcon} alt="Yellow Card" style={{ width: '1.5rem', height: '1.5rem' }} />
                        </button>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>

            {/* Right team players */}
            <div className="players-list" style={{ flex: 1, display: 'flex', flexDirection: 'column', height: '40vh' }}>
              <label>Players</label>
                <ul style={{ flexGrow: 1, overflowY: 'auto' }}>
                  {(availableTeams.find(t => String(t.team_id) === String(match.teamB))?.players || []).map((p, idx) => (
                    <li key={idx} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span>
                        {p.name} ({p.position})
                        {p.isSubstitute && <span style={{ color: 'red', fontWeight: 'bold' }}> Sub</span>}
                        {match.captainB === p.id && <span className="captain-status" style={{ marginLeft: '0.5rem' }}>(Captain)</span>}
                      </span>
                      <div style={{ display: 'flex', gap: '1rem' }}>
                        <button type="button" className="btn-motm">
                          <img src={goldenBootIcon} alt="MOTM" style={{ width: '1.5rem', height: '1.5rem' }} />
                        </button>
                        <button type="button" className="btn-goal">
                          <img src={goalIcon} alt="Goal" style={{ width: '1.5rem', height: '1.5rem' }} />
                        </button>
                        <button type="button" className="btn-no-goal">
                          <img src={goalIcon} alt="No Goal" style={{ width: '1.5rem', height: '1.5rem' }} />
                        </button>
                        <button type="button" className="btn-red-card">
                          <img src={redCardIcon} alt="Red Card" style={{ width: '1.5rem', height: '1.5rem' }} />
                        </button>
                        <button type="button" className="btn-yellow-card">
                          <img src={yellowCardIcon} alt="Yellow Card" style={{ width: '1.5rem', height: '1.5rem' }} />
                        </button>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default DetailedMatchStats;