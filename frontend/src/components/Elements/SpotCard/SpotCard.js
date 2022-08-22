import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import classes from "./SpotCard.module.css";

function SpotCard({ spot }) {
  const imgArray = [spot.img1, spot.img2, spot.img3, spot.img4, spot.img5];
  const [count, setCount] = useState(0);
  const [img, setImg] = useState(imgArray[count]);
  const [filled, setFilled] = useState(false);
  const history = useHistory();
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

  const handleNext = () => {
    count < 4 ? setCount(count + 1) : setCount(0);
    setImg(imgArray[count]);
  };

  const handlePrevious = () => {
    count > 0 ? setCount(count - 1) : setCount(4);
    setImg(imgArray[count]);
  };
  return (
    <>
      <div className={classes.imgSlideShowContainer}>
        <div className={classes.heartContainer}>
          {!filled ? (
            <img
              onClick={() => setFilled(!filled)}
              src="static/heart.svg"
              className={classes.heart}
            />
          ) : (
            <img
              onClick={() => setFilled(!filled)}
              src="static/filledHeart.svg"
              className={classes.heart}
            />
          )}
        </div>
        <div className={classes.nextContainer} onClick={handleNext}>
          <img
            onClick={handleNext}
            className={classes.next}
            src="static/next.svg"
          />
        </div>
        <div className={classes.previousContainer} onClick={handlePrevious}>
          <img className={classes.previous} src="static/leftArrow.svg" />
        </div>

        <img
          onClick={() => history.push(`/spots/${spot.id}`)}
          alt="Spot"
          className={classes.img}
          src={imgArray[count]}
        />
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
