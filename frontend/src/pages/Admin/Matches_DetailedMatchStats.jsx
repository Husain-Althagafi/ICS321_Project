import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import AdminSidebar from '../../components/AdminSidebar';
import '../../stylesheets/Matches_DetailedMatchStats.css';

const Matches_DetailedMatchStats = () => {
  // Helper to format yyyy-mm-dd to dd-mm-yyyy
  const formatDate = (dateString) => {
    if (!dateString) return '';
    const [y, m, d] = dateString.split('-');
    return `${d}-${m}-${y}`;
  };

  const { tournamentId } = useParams();
  const navigate = useNavigate();
  const username = 'john.doe'; // Replace with actual dynamic source later
  const [first, last] = username.split('.');
  const initials = `${first[0]}${last[0]}`.toUpperCase();
  const formattedName = `${first.charAt(0).toUpperCase() + first.slice(1)} ${last.charAt(0).toUpperCase() + last.slice(1)}`;

  const [matches, setMatches] = useState([]);
  const [availableTeams, setAvailableTeams] = useState([]);

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
            Detailed Match Stats
          </h1>
        </header>

        <section className="match-list">
          <h2>Choose the Match</h2>
          <div className="match-grid scrollable">
            {matches.length > 0 ? (
              matches.map(m => (
                <div key={m.id} className="match-card">
                  <div className="match-card-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <h3 style={{ margin: 0 }}>
                      Match No: <span className="match-name-gradient">{m.id}</span>
                    </h3>
                  </div>
                  <p><strong>Teams:</strong> {
                    (availableTeams.find(t => String(t.team_id) === String(m.teamA))?.team_name || m.teamA)
                  } vs {
                    (availableTeams.find(t => String(t.team_id) === String(m.teamB))?.team_name || m.teamB)
                  }</p>
                  <p><strong>Date:</strong> {formatDate(m.date)}</p>
                  <p><strong>Time:</strong> {m.startTime} - {m.endTime}</p>
                  <button
                    type="button"
                    className="edit-button"
                    onClick={() => navigate(`/admin/detailed-match-stats/${tournamentId}/${m.id}/match-stats`)}
                  >
                    View
                  </button>
                </div>
              ))
            ) : (
              <p style={{ color: 'black' }}>No matches have been registered yet.</p>
            )}
          </div>
        </section>
      </main>
    </div>
  );
};

export default Matches_DetailedMatchStats;