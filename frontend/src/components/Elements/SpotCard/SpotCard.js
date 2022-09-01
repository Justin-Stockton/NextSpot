import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import classes from "./SpotCard.module.css";
import { ReactComponent as HeartSVG } from "./heart.svg";
import { useSelector } from "react-redux";
import Modal from "../Modal/Modal";
import { useClickOutside } from "../../../App";

function SpotCard({ spot }) {
  const imgArray = [spot.img1, spot.img2, spot.img3, spot.img4, spot.img5];
  const [count, setCount] = useState(0);
  const [img, setImg] = useState(imgArray[count]);
  const [filled, setFilled] = useState(false);
  const [display, setDisplay] = useState(false);
  const [formDisplay, setFormDisplay] = useState(false);
  const history = useHistory();
  const user = useSelector((state) => state.session.user);
  const wishlistsObj = useSelector((state) => state.wishlists);

  const handleClick = () => {
    if (!user) {
      history.push("/login");
    }
    if (!filled) {
      setDisplay(true);
    }
  };

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

  const popupRef = useClickOutside(() => {
    setDisplay(false);
    setFormDisplay(false);
  });

  useEffect(() => {
    if (!user) setFilled(false);
    let wishlistArr = Object.values(wishlistsObj);
    let wishlistArrAll = wishlistArr.map((obj) => obj.wishspots);
    let wishlistSpotIds = wishlistArrAll
      .map((obj) => Object.values(obj).map((spots) => spots.spotId))
      .flat();

    if (wishlistSpotIds && wishlistSpotIds.includes(spot.id)) {
      setFilled(true);
    } else {
      setFilled(false);
    }
  }, [wishlistsObj, spot.id]);

  return (
    <>
      <Modal
        innerRef={popupRef}
        display={display}
        setDisplay={setDisplay}
        formDisplay={formDisplay}
        setFormDisplay={setFormDisplay}
        spot={spot}
        setFilled={setFilled}
      />
      <div className={classes.imgSlideShowContainer}>
        <div className={classes.heartContainer}>
          <HeartSVG
            className={classes.heart}
            onClick={handleClick}
            fill={filled ? "#FF385C" : "rgba(0,0,0,.7)"}
          />
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
              <img className={classes.star} src="/static/star.svg" />
              {rating}
            </strong>
          ) : (
            <strong>
              <img className={classes.star} src="/static/star.svg" />
              New
            </strong>
          )}
        </div>
      </div>
    </>
  );
}

export default SpotCard;
