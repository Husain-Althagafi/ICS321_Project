import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AdminSidebar from '../../components/AdminSidebar';
// import sealImage from '../../assets/icons/KFUPM Seal White.png';
import bgImage from '../../assets/images/Illustration 1@4x.png';
import DeleteVenueButton from '../../components/DeleteVenueButton';
import deleteIcon from '../../assets/icons/delete-svgrepo-com.svg';
import '../../stylesheets/Venues.css';

const Venues = () => {
  const navigate = useNavigate();
  const username = 'john.doe'; // Replace with actual dynamic source later
  const [first, last] = username.split('.');
  const initials = `${first[0]}${last[0]}`.toUpperCase();
  const formattedName = `${first.charAt(0).toUpperCase() + first.slice(1)} ${last.charAt(0).toUpperCase() + last.slice(1)}`;

  const [venues, setVenues] = useState([]);
  const [showVenueModal, setShowVenueModal] = useState(false);
  const [newVenue, setNewVenue] = useState({ name: '', status: '', capacity: '' });
  const [venueError, setVenueError] = useState('');

  const [lastVenueNumber, setLastVenueNumber] = useState(() => {
    const storedNum = parseInt(localStorage.getItem('lastVenueId'), 10);
    if (!isNaN(storedNum)) return storedNum;
    const maxId = venues.length ? Math.max(...venues.map(v => v.id || 0)) : 0;
    localStorage.setItem('lastVenueId', maxId);
    return maxId;
  });
  const nextVenueId = lastVenueNumber + 1;

  useEffect(() => {
    const loadVenues = () => {
      const stored = localStorage.getItem('venues');
      if (stored) {
        const parsed = JSON.parse(stored);
        setVenues(parsed);

        // Only update lastVenueId if current is lower than max
        const maxId = parsed.reduce((max, v) => Math.max(max, Number(v.id)), 0);
        const currentLast = lastVenueNumber;
        if (maxId > currentLast) {
          localStorage.setItem('lastVenueId', String(maxId));
          setLastVenueNumber(maxId);
        }
      }
    };

    loadVenues();

    window.addEventListener('focus', loadVenues);
    return () => window.removeEventListener('focus', loadVenues);
  }, []);

  const handleDeleteVenue = (venueId) => {
    const updated = venues.filter(v => String(v.id) !== String(venueId));
    localStorage.setItem('venues', JSON.stringify(updated));
    setVenues(updated);
    // Do not update lastVenueId on delete
  };

  return (
    <div className="admin-home">
      <AdminSidebar initials={initials} formattedName={formattedName} />

      <main className="main-content">
        <div className="bg-overlay"></div>
        <header className="topbar">
          <h1>
            Venues
          </h1>
        </header>
        <section className="venue-list">
          <div className = "venues-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h2>Registered Venues</h2>
            <button
              className="add-venue-button"
              onClick={() => setShowVenueModal(true)}
              style={{
                padding: '0.5rem 1rem',
                fontSize: '1rem',
                cursor: 'pointer',
                backgroundColor: '#017941',
                color: 'white',
                border: 'none'
              }}
            >
              Add New Venue
            </button>
          </div>
          <div className="venue-grid scrollable">
            {venues.length > 0 ? (
              venues.map(venue => (
                <div key={venue.id} className="venue-card">
                  <div className= "venue-card-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <h3 style={{ margin: 0 }}>
                      Venue Name: <span className="venue-name-gradient">{venue.name}</span>
                    </h3>
                  </div>
                  <p><strong>Venue ID:</strong> {venue.id}</p>
                  <p><strong>Venue Status:</strong> {venue.status}</p>
                  <p><strong>Capacity:</strong> {venue.capacity}</p>
                  <div className="delete-button-wrapper">
                    <DeleteVenueButton
                      className="delete-venue-button"
                      venueId={venue.id}
                      onClick={() => {
                        const confirmed = window.confirm('Are you sure you want to delete this venue?');
                        if (confirmed) handleDeleteVenue(venue.id);
                      }}
                    >
                      <img
                        src={deleteIcon}
                        alt="Delete"
                        className="delete-icon"
                        style={{ width: '1.2rem', height: '1.2rem', filter: 'invert(1)', objectFit: 'contain' }}
                      />
                    </DeleteVenueButton>
                  </div>
                </div>
              ))
            ) : (
              <p style={{color: 'black'}}>No venues have been registered yet.</p>
            )}
          </div>
        </section>
        {/* <img 
          src={sealImage} 
          alt="KFUPM Seal" 
          className="vertical-seal" 
        /> */}
        {showVenueModal && (
          <div className="security-modal">
            <div className="security-modal-content" style={{ position: 'relative' }}>
              <button
                className="close-button"
                type="button"
                onClick={() => setShowVenueModal(false)}
                aria-label="Close"
              >
                &times;
              </button>
              <h2>Add New Venue</h2>

              <label>Venue ID
                <input
                  type="text"
                  value={nextVenueId}
                  disabled
                  style={{ backgroundColor: '#e0e0e0', color: '#666', cursor: 'not-allowed' }}
                />
              </label>

              <label>Venue Name
                <input
                  type="text"
                  placeholder="Venue Name"
                  value={newVenue.name}
                  onChange={e => setNewVenue({ ...newVenue, name: e.target.value })}
                />
              </label>

              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
                <label style={{ margin: 0 }}>Venue Status:</label>
                <select
                  value={newVenue.status}
                  onChange={e => setNewVenue({ ...newVenue, status: e.target.value })}
                  style={{ borderRadius: '0.25rem' }}
                >
                  <option value="">Select Status</option>
                  <option value="Available">Available</option>
                  <option value="Reserved">Reserved</option>
                </select>
              </div>

              <label>Audience Capacity
                <input
                  type="number"
                  placeholder="Capacity"
                  min='1'
                  value={newVenue.capacity}
                  onChange={e => setNewVenue({ ...newVenue, capacity: e.target.value })}
                />
              </label>

              <div style={{ marginTop: '1rem' }}>
                <button
                  type="button"
                  onClick={() => {
                    if (!newVenue.name.trim()) {
                      const msg = 'Venue name is required.';
                      setVenueError(msg);
                      alert(msg);
                      return;
                    }
                    if (!newVenue.status.trim()) {
                      const msg = 'Please select a venue status.';
                      setVenueError(msg);
                      alert(msg);
                      return;
                    }
                    if (!newVenue.capacity || Number(newVenue.capacity) < 1) {
                      const msg = 'Capacity must be a number greater than 0.';
                      setVenueError(msg);
                      alert(msg);
                      return;
                    }
                    const newEntry = {
                      id: nextVenueId, // auto-incremented venue_id
                      ...newVenue
                    };
                    const updated = [...venues, newEntry];
                    localStorage.setItem('venues', JSON.stringify(updated));
                    setLastVenueNumber(nextVenueId);
                    localStorage.setItem('lastVenueId', String(nextVenueId));
                    setVenues(updated);
                    setNewVenue({ name: '', status: '', capacity: '' });
                    setVenueError('');
                    setShowVenueModal(false);
                  }}
                >
                  Add
                </button>
                {venueError && <p className="error">{venueError}</p>}
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default Venues;