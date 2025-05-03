import './stylesheets/DeleteTournamentButton.css';
import React from 'react';

const DeleteTeamButton = ({ onClick, children = 'Delete Tournament' }) => {
  return (
    <button
      className="delete-team-button"
      type="button"
      onClick={onClick}
    >
      {children}
    </button>
  );
};

export default DeleteTeamButton;
