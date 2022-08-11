import React from "react";
import { useSelector } from "react-redux";
import SpotCard from "../../Elements/SpotCard";
import classes from "./HomePage.module.css";

function HomePage() {
  let spots = useSelector((state) => state.spots);

  return (
    <div>
      <div className={classes.filterBar}>
        <h1 className={classes.buisnessProp}>
          NextSpot is designed for users to plan out their next getaway. Users
          will be able to book trips to destinations that they would like to
          visit and leave reviews of spots.
        </h1>
      </div>
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
