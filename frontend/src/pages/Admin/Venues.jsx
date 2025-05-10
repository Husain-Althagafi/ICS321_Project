import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import AdminSidebar from "../../components/AdminSidebar";
// import sealImage from '../../assets/icons/KFUPM Seal White.png';
import bgImage from "../../assets/images/Illustration 1@4x.png";
import DeleteVenueButton from "../../components/DeleteVenueButton";
import deleteIcon from "../../assets/icons/delete-svgrepo-com.svg";
import "../../stylesheets/Venues.css";
import axios from 'axios'
const Venues = () => {
  const navigate = useNavigate();
  const username = "john.doe"; // Replace with actual dynamic source later
  const [first, last] = username.split(".");
  const initials = `${first[0]}${last[0]}`.toUpperCase();
  const formattedName = `${first.charAt(0).toUpperCase() + first.slice(1)} ${last.charAt(0).toUpperCase() + last.slice(1)}`;

  const [venues, setVenues] = useState([]);
  const [showVenueModal, setShowVenueModal] = useState(false);
  const [newVenue, setNewVenue] = useState({
    name: "",
    capacity: "",
  });
  const [venueError, setVenueError] = useState("");
  const [hoveredVenueId, setHoveredVenueId] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [allMatches, setAllMatches] = useState([])
  const [reservedVenues, setReservedVenues] = useState([])

  

  useEffect(() => {
    const loadVenues = () => {
        //get all venues
        axios.get(`http://localhost:5000/venues`)
        .then((res) => {
          //transform data to fit frontend naming
          setVenues(res.data.data.map(v => ({
            id: v.venue_id,
            name: v.venue_name,
            capacity: v.venue_capacity
          })));
        })
        .catch(err => console.error(err))

        //get all matches
        axios.get(`http://localhost:5000/matches`)
        .then((res) => {
          setAllMatches(res.data.data)
        })
        .catch(err => console.error(err))
    };

    loadVenues();

    window.addEventListener("focus", loadVenues);
    return () => window.removeEventListener("focus", loadVenues);
  }, []);

  //function for finding the reserved venues
  const getReservedVenues = () => {
    // Find all venue_ids that are being used in matches
    const reservedVenueIds = allMatches
      .map(match => match.venue_id)
      .filter(venueId => venueId !== null);
    
    // Get unique venue IDs to avoid duplicates
    const uniqueReservedVenueIds = [...new Set(reservedVenueIds)];
    
    // Get full venue info for reserved venues
    const reservedVenues = venues.filter(venue => 
      uniqueReservedVenueIds.includes(venue.venue_id)
    );
    
    // Add match info to each reserved venue
    return reservedVenues.map(venue => ({
      ...venue,
      allMatches: allMatches.filter(match => match.venue_id === venue.id)
    }));
  };

  useEffect(() => {
    //set reserved venues
    setReservedVenues(getReservedVenues())

    const updatedVenues = venues.map((v) => {
      const matched = allMatches.filter(
        (m) => String(m.venue_id) === String(v.id),
      );
      if (v.status === "Reserved" && matched.length === 0) {
        return { ...v, status: "Available" };
      }
      return v;
    });
    if (JSON.stringify(updatedVenues) !== JSON.stringify(venues)) {
      setVenues(updatedVenues);
    }
  }, [allMatches, venues]);

  // helper to format YYYY-MM-DD to DD-MM-YYYY
  const formatDate = (dateString) => {
    if (!dateString) return "";
    const [year, month, day] = dateString.split("-");
    return `${day}-${month}-${year}`;
  };

  const handleDeleteVenue = (venueId) => {
    //delete by request
    axios.delete(`http://localhost:5000/venues/${venueId}`)
    .then((res) => {
      setVenues(venues.filter(
        (v) => v.id !== res.data.data[0].venue_id,
      ));
    })
    .catch(err => console.error(err))
  };

  return (
    <div className="admin-home">
      <AdminSidebar initials={initials} formattedName={formattedName} />

      <main className="main-content">
        <div className="bg-overlay"></div>
        <header className="topbar">
          <h1>Venues</h1>
        </header>
        <section className="venue-list">
          <div
            className="venues-header"
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <h2>Registered Venues</h2>
            <button
              className="add-venue-button"
              onClick={() => {
                setShowVenueModal(true);
                setIsEditing(false);
                setNewVenue({ name: "", status: "", capacity: "" });
              }}
              style={{
                padding: "0.5rem 1rem",
                fontSize: "1rem",
                cursor: "pointer",
                backgroundColor: "#017941",
                color: "white",
                border: "none",
              }}
            >
              Add New Venue
            </button>
          </div>
          <div className="venue-grid scrollable">
            {venues.length > 0 ? (
              venues.map((venue) => {
                const reservedMatchesForVenue = allMatches.filter(
                  (m) => m.venue_id === venue.id,
                );
                return (
                  <div key={venue.id} className="venue-card">
                    <div
                      className="venue-card-header"
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                      }}
                    >
                      <h3 style={{ margin: 0 }}>
                        Venue Name:{" "}
                        <span className="venue-name-gradient">
                          {venue.name}
                        </span>
                      </h3>
                    </div>
                    <p>
                      <strong>Venue ID:</strong> {venue.id}
                    </p>
                    <p
                      onMouseEnter={() => setHoveredVenueId(venue.id)}
                      onMouseLeave={() => setHoveredVenueId(null)}
                      style={{ position: "relative" }}
                    >
                      <strong>Venue Status:</strong> {venue.status || 'Free'}
                      {hoveredVenueId === venue.id &&
                        reservedVenues.some(reservedVenue => reservedVenue.id === venue.id) &&
                        reservedMatchesForVenue.length > 0 && (
                          <div
                            style={{
                              position: "absolute",
                              top: "100%",
                              left: 0,
                              backgroundColor: "white",
                              border: "1px solid #ccc",
                              borderRadius: "8px",
                              boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
                              padding: "0.5rem",
                              zIndex: 10,
                              color: "black",
                              maxHeight: "150px",
                              overflowY: "auto",
                              whiteSpace: "nowrap",
                            }}
                          >
                            <strong>Reserved Matches:</strong>
                            <ul
                              style={{
                                paddingLeft: "1rem",
                                margin: "0.5rem 0",
                              }}
                            >
                              {reservedMatchesForVenue.map((m) => (
                                <li key={m.id}>
                                  Match {m.id}: {formatDate(m.date)} (
                                  {m.startTime}–{m.endTime})
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                    </p>
                    <p>
                      <strong>Capacity:</strong> {venue.capacity}
                    </p>
                    <div
                      className="delete-button-wrapper"
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "flex-end",
                        gap: "0.5rem",
                      }}
                    >
                      <button
                        className="edit-venue-button"
                        onClick={() => {
                          setNewVenue({ ...venue });
                          setShowVenueModal(true);
                          setIsEditing(true);
                        }}
                        style={{
                          marginLeft: "0.5rem",
                          marginTop: "0.5rem",
                          backgroundColor: "#ffc107",
                          color: "#000",
                          border: "none",
                          cursor: "pointer",
                          width: "24%",
                          height: "2.2rem",
                        }}
                      >
                        Edit
                      </button>
                      <DeleteVenueButton
                        className="delete-venue-button"
                        venueId={venue.id}
                        onClick={() => {
                          const confirmed = window.confirm(
                            "Are you sure you want to delete this venue?",
                          );
                          if (confirmed) handleDeleteVenue(venue.id);
                        }}
                      >
                        <img
                          src={deleteIcon}
                          alt="Delete"
                          className="delete-icon"
                          style={{
                            width: "1.2rem",
                            height: "1.2rem",
                            filter: "invert(1)",
                            objectFit: "contain",
                          }}
                        />
                      </DeleteVenueButton>
                    </div>
                  </div>
                );
              })
            ) : (
              <p style={{ color: "black" }}>
                No venues have been registered yet.
              </p>
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
            <div
              className="security-modal-content"
              style={{ position: "relative" }}
            >
              <button
                className="close-button"
                type="button"
                onClick={() => {
                  setShowVenueModal(false);
                  setIsEditing(false);
                }}
                aria-label="Close"
              >
                &times;
              </button>
              <h2>{isEditing ? "Edit Venue" : "Add New Venue"}</h2>

              <label>
                Venue ID
                <input
                  type="text"
                  value={isEditing ? newVenue.id : ''}
                  disabled
                  style={{
                    backgroundColor: "#e0e0e0",
                    color: "#666",
                    cursor: "not-allowed",
                  }}
                />
              </label>

              <label>
                Venue Name
                <input
                  type="text"
                  placeholder="Venue Name"
                  value={newVenue.name}
                  onChange={(e) =>
                    setNewVenue({ ...newVenue, name: e.target.value })
                  }
                />
              </label>

              <label>
                Audience Capacity
                <input
                  type="number"
                  placeholder="Capacity"
                  min="1"
                  value={newVenue.capacity}
                  onChange={(e) =>
                    setNewVenue({ ...newVenue, capacity: e.target.value })
                  }
                />
              </label>

              <div style={{ marginTop: "1rem" }}>
                <button
                  type="button"
                  onClick={() => {
                    if (!newVenue.name.trim()) {
                      const msg = "Venue name is required.";
                      setVenueError(msg);
                      alert(msg);
                      return;
                    }
                    // if (!newVenue.status.trim()) {
                    //   const msg = "Please select a venue status.";
                    //   setVenueError(msg);
                    //   alert(msg);
                    //   return;
                    // }
                    if (!newVenue.capacity || Number(newVenue.capacity) < 1) {
                      const msg = "Capacity must be a number greater than 0.";
                      setVenueError(msg);
                      alert(msg);
                      return;
                    }
                    const newEntry = {
                      id: isEditing ? newVenue.id : '',
                      ...newVenue,
                    };

                    let updated;
                    //logic for editing venue
                    if (isEditing) {
                      //axios edit call
                      axios.patch(`http://localhost:5000/venues/${newEntry.id}`, {
                        venue_name: newEntry.name,
                        venue_capacity: Number(newEntry.capacity) 
                      })
                      .then((res) => {
                        // Update the specific venue in state
                        setVenues(prevVenues => 
                          prevVenues.map(venue => 
                            venue.id === res.data.data[0].id
                              ? {
                                  id: res.data.data[0].venue_id,
                                  name: res.data.data.venue_name,
                                  capacity: res.data.data.venue_capacity
                                }
                              : venue
                          )
                        );
                        // Reset form and close modal
                        setNewVenue({
                          name: "",
                          status: "Available",
                          capacity: "",
                        });
                        setShowVenueModal(false);
                        setIsEditing(false);
                        
                        alert("Venue updated successfully!");
                      })
                      .catch((err) => console.error(err));
                      
                    } else {
                      //logic for adding new venue
                      updated = [...venues, newEntry];

                      //add new venue
                      axios.post(`http://localhost:5000/venues`, {
                        venue_name: newEntry.name,
                        venue_capacity: Number(newEntry.capacity)
                      })
                      .then((res) => {
                        setVenues(prevVenues => [
                          ...prevVenues, 
                          {
                            id: res.data.data[0].venue_id,
                            name: res.data.data[0].venue_name,
                            capacity: res.data.data[0].venue_capacity,
                            status: "Available" // Default status
                          }
                        ]);
                        setNewVenue({
                          name: "",
                          status: "Available",
                          capacity: "",
                        });
                        setVenueError("");
                        setShowVenueModal(false);
                        setIsEditing(false);                      
                      })
                      .catch(err => console.error(err))
                    }

                    
                  }}
                >
                  {isEditing ? "Save Changes" : "Add"}
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
