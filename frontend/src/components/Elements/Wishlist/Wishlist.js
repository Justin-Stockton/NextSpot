import React from "react";
import { useSelector } from "react-redux";
import classes from "./Wishlist.module.css";
import { useHistory } from "react-router-dom";

function Wishlist({ list }) {
  const history = useHistory();
  const user = useSelector((state) => state.session.user);
  let wishSpots;
  let spotIDs;
  const spotObj = useSelector((state) => state.spots);

  if (list.wishspots) {
    wishSpots = Object.values(list.wishspots);
    spotIDs = wishSpots.map((spot) => {
      return spot.spotId;
    });
  }

  const handleClick = () => {
    history.push(`/${user.username}/${list.id}`);
  };

  return (
    <div className={classes.mainContainer} onClick={handleClick}>
      {wishSpots && wishSpots.length ? (
        <div className={classes.imgContainer}>
          <>
            <div className={classes.mainImg}>
              <img
                className={classes.mainImg}
                src={`${spotObj[spotIDs[0]].spot.img1}`}
              />
            </div>
            <div className={classes.subImgContainer}>
              <div className={classes.topImg}>
                <img
                  className={classes.topImg}
                  src={`${spotObj[spotIDs[0]].spot.img2}`}
                />
              </div>
              <div className={classes.subImg}>
                <img
                  className={classes.subImg}
                  src={`${spotObj[spotIDs[0]].spot.img3}`}
                />
              </div>
            </div>
          </>
        </div>
      ) : (
        <div className={classes.noSpots}></div>
      )}
      <div className={classes.name}>{list.name}</div>
    </div>
  );
}

export default Wishlist;
