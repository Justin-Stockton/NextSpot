import React from "react";
import { useSelector } from "react-redux";
import SpotCard from "../../Elements/SpotCard";
import classes from "./HomePage.module.css";

function HomePage() {
  let spots = useSelector((state) => state.spots);

  return (
    <div>
      <div className={classes.filterBar}></div>
      <div className={classes.mainContainer}>
        {Object.values(spots).length > 0 ? (
          Object.values(spots).map((spot, i) => {
            return (
              <div className={classes.container} key={i}>
                <SpotCard spot={spot.spot} />
              </div>
            );
          })
        ) : (
          <p>No spots yet!</p>
        )}
      </div>
    </div>
  );
}

export default HomePage;
