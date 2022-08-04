import React from "react";
import { NavLink } from "react-router-dom";
// import classes from "./SpotCard.module.css";

function SpotCard({ spot }) {
  return (
    <>
      <NavLink to={`/spots/${spot.id}`}>
        <div>
          <div>{spot.name}</div>
          <div>{spot.streetAdress}</div>
          <div>{spot.city}</div>
          <div>{spot.state}</div>
          <div>{spot.zip}</div>
        </div>
      </NavLink>
    </>
  );
}

export default SpotCard;
