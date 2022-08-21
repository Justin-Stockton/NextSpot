import React from "react";
import { useHistory } from "react-router-dom";
import classes from "./SpotCard.module.css";

function SpotCard({ spot }) {
  const history = useHistory();
  // console.log(spot);
  let reviews = Object.values(spot.reviews);
  let ratings = 0;
  let rating;

  reviews.forEach((review) => {
    ratings += review.rating;
  });

  if ((ratings / reviews.length).toFixed(2).toString().split("")[3] === "0") {
    rating = (ratings / reviews.length).toFixed(1);
  } else {
    rating = (ratings / reviews.length).toFixed(2);
  }
  return (
    <>
      <div
        onClick={() => history.push(`/spots/${spot.id}`)}
        className={classes.imgSlideShowContainer}
      >
        <img alt="Spot exterior" className={classes.img} src={`${spot.img1}`} />
      </div>
      <div
        className={classes.textContainer}
        style={{ display: "flex", justifyContent: "space-between" }}
      >
        <div onClick={() => history.push(`/spots/${spot.id}`)}>
          <div>
            <div>
              <strong>
                {spot.city}, {spot.state}
              </strong>
            </div>
            <div>
              <strong>${spot.price}</strong> night
            </div>
          </div>
        </div>
        <div>
          {rating > 0 ? (
            <strong>
              <img className={classes.star} src="static/star.svg" />
              {rating}
            </strong>
          ) : (
            <strong>
              <img className={classes.star} src="static/star.svg" />
              New
            </strong>
          )}
        </div>
      </div>
    </>
  );
}

export default SpotCard;
