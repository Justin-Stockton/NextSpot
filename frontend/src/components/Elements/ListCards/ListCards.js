import React from "react";
import { useSelector } from "react-redux";
import classes from "./ListCards.module.css";

function ListCards({ list }) {
  let spotIds = Object.values(list.wishspots)[0].spotId;
  let spots = useSelector((state) => state.spots);
  console.log(spotIds);
  let spotImg = spots[spotIds].spot.img1;
  return (
    <div className={classes.newList}>
      <div className={classes.addButton}>
        <img className={classes.img} src={`${spotImg}`} />
      </div>
      <strong className={classes.create}>{list.name}</strong>
    </div>
  );
}

export default ListCards;
