import React from "react";
import { useHistory } from "react-router-dom";
import classes from "./SpotCard.module.css";

function SpotCard({ spot }) {
  const history = useHistory();
  return (
    <>
      <div className={classes.imgSlideShowContainer}></div>
      <div
        className={classes.textContainer}
        onClick={() => history.push(`/spots/${spot.id}`)}
      >
        <div>
          <strong>
            {spot.city}, {spot.state}
          </strong>
        </div>
        <div>
          <strong>${spot.price}</strong> night
        </div>
      </div>
    </>
  );
}

export default SpotCard;
