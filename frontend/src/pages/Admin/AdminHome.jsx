import React from 'react';
import { useNavigate } from 'react-router-dom';
import AdminSidebar from '../../components/AdminSidebar.jsx';
// import sealImage from '../../assets/icons/KFUPM Seal White.png';
import bgImage from '../../assets/images/Illustration 1@4x.png';
import '../../stylesheets/AdminHome.css';

const AdminHome = () => {
  const navigate = useNavigate();
  const username = 'john.doe'; // Replace with actual dynamic source later
  const [first, last] = username.split('.');
  const initials = `${first[0]}${last[0]}`.toUpperCase();
  const formattedName = `${first.charAt(0).toUpperCase() + first.slice(1)} ${last.charAt(0).toUpperCase() + last.slice(1)}`;

  return (
    <div className="admin-home">
      <AdminSidebar initials={initials} formattedName={formattedName} />

      <main className="main-content">
        <div className="bg-overlay"></div>
        <header className="topbar">
          <h1>
            Welcome to the Admin Home, <span className="highlighted-name">{formattedName}</span>
          </h1>
        </header>

        <section className="applications">
          <h2>Quick Tools</h2>
          <div className="app-grid">
            <div className="app-item" onClick={() => navigate('/admin/add-tournament')}>Add new tournament</div>
            <div className="app-item" onClick={() => navigate('/admin/add-team')}>Add new team</div>
            <div className="app-item" onClick={() => navigate('/admin/delete-tournament')}>Delete tournament</div>
            <div className="app-item" onClick={() => navigate('/admin/update-score')}>Update match score</div>
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

export default AdminHome;