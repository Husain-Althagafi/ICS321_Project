import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import AdminSidebar from '../../components/AdminSidebar';
// import sealImage from '../../assets/icons/KFUPM Seal White.png';
import bgImage from '../../assets/images/Illustration 1@4x.png';
import '../../stylesheets/EditTeam.css';

const EditTeam = () => {
  const navigate = useNavigate();
  const { teamId } = useParams();
  const username = 'john.doe'; // Replace with actual dynamic source later
  const [first, last] = username.split('.');
  const initials = `${first[0]}${last[0]}`.toUpperCase();
  const formattedName = `${first.charAt(0).toUpperCase() + first.slice(1)} ${last.charAt(0).toUpperCase() + last.slice(1)}`;

  const [teams, setTeams] = useState(() => {
    const stored = localStorage.getItem('teams');
    return stored ? JSON.parse(stored) : [];
  });
  const [teamName, setTeamName] = useState('');
  const [coachName, setCoachName] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    const storedTeams = JSON.parse(localStorage.getItem('teams')) || [];
    const team = storedTeams.find(t => String(t.team_id) === teamId);
    if (team) {
      setTeamName(team.team_name);
      setCoachName(team.coach_name);
      setTeams(storedTeams);
    } else {
      navigate('/admin/teams');
    }
  }, [teamId, navigate]);

  const handleUpdateTeam = (e) => {
    e.preventDefault();
    if (!teamName || !coachName) {
      const msg = 'All fields are required.';
      setErrorMsg(msg);
      setTimeout(() => alert(msg), 0);
      return;
    }
    const updatedTeams = teams.map(t =>
      String(t.team_id) === teamId
        ? { ...t, team_name: teamName, coach_name: coachName }
        : t
    );
    localStorage.setItem('teams', JSON.stringify(updatedTeams));
    navigate('/admin/teams');
  };

  return (
    <div className="admin-home">
      <AdminSidebar initials={initials} formattedName={formattedName} />

      <main className="main-content">
        <div className="bg-overlay"></div>
        <header className="topbar">
          <h1>
            Edit Team
          </h1>
        </header>

        <section className="tournament-form">
          <div className="form-container">
            <h2>Team Details</h2>
            <form onSubmit={handleUpdateTeam} className="form-grid">
              <label>
                Team ID:
                <input
                  type="text"
                  value={teamId}
                  disabled
                  style={{ backgroundColor: '#f0f0f0', cursor: 'not-allowed' }}
                />
              </label>
              <label>
                Team Name:
                <input type="text" value={teamName} onChange={(e) => setTeamName(e.target.value)} required />
              </label>
              <label>
                Coach Name:
                <input type="text" value={coachName} onChange={(e) => setCoachName(e.target.value)} required />
              </label>
              {errorMsg && <p className="form-error">{errorMsg}</p>}
              <button type="submit">Save Changes</button>
            </form>
          </div>
        </section>
        {/* <img 
          src={sealImage} 
          alt="KFUPM Seal" 
          className="vertical-seal" 
        /> */}
      </main>
    </div>
  );
};

export default EditTeam;