import "./stylesheets/DeleteTeamButton.css";
import React from "react";

const DeleteTeamButton = ({ onClick, children = "Delete Team" }) => {
  return (
    <button className="delete-team-button" type="button" onClick={onClick}>
      {children}
    </button>
  );
};

export default DeleteTeamButton;
