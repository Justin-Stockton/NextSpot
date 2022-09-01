import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import { useDispatch } from "react-redux";
import classes from "./WishlistSpot.module.css";
import { ReactComponent as HeartSVG } from "./heart.svg";
import { thunkDeleteWishspot } from "../../../store/wishspots";
import Modal from "../Modal";
import { useClickOutside } from "../../../App";

function WishlistSpot({ spot, id, wishlistId }) {
  const history = useHistory();
  const dispatch = useDispatch();

  const spotObj = spot.spot;

  const imgArray = [
    spotObj.img1,
    spotObj.img2,
    spotObj.img3,
    spotObj.img4,
    spotObj.img5,
  ];

  const [count, setCount] = useState(0);
  const [img, setImg] = useState(imgArray[count]);
  const [filled, setFilled] = useState(true);
  const [display, setDisplay] = useState(false);
  const [formDisplay, setFormDisplay] = useState(false);

  const handleNext = () => {
    count < 4 ? setCount(count + 1) : setCount(0);
    setImg(imgArray[count]);
  };

  const handlePrevious = () => {
    count > 0 ? setCount(count - 1) : setCount(4);
    setImg(imgArray[count]);
  };

  let reviews = Object.values(spotObj.reviews);
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

  const handleClick = () => {
    let data = {
      spotId: spotObj.id,
      wishlistId: wishlistId,
    };
    if (filled) dispatch(thunkDeleteWishspot(data));
    if (!filled) setDisplay(true);
    setFilled(false);
  };

  const modalRef = useClickOutside(() => {
    setDisplay(false);
  });
  return (
    <>
      <Modal
        display={display}
        formDisplay={formDisplay}
        setDisplay={setDisplay}
        setFormDisplay={setFormDisplay}
        innerRef={modalRef}
        spot={spotObj}
        setFilled={setFilled}
      />
      <div className={classes.spotContainer}>
        <div className={classes.imgSlideShowContainer}>
          <div className={classes.buttonContainer}>
            <div className={classes.previousContainer} onClick={handlePrevious}>
              <img
                className={classes.previous}
                src="/static/leftArrow.svg"
                alt="back"
              />
            </div>
            <div className={classes.nextContainer} onClick={handleNext}>
              <img
                onClick={handleNext}
                className={classes.next}
                src="/static/next.svg"
                alt="next"
              />
            </div>
          </div>

          <img
            onClick={() => history.push(`/spots/${spotObj.id}`)}
            alt="Spot"
            className={classes.img}
            src={imgArray[count]}
          />
        </div>
        <div className={classes.textContainer}>
          <div className={classes.top}>
            <div className={classes.name}>{spotObj.name}</div>
            <div className={classes.heart} onClick={() => handleClick()}>
              <HeartSVG fill={filled ? "#FF385C" : "rgba(0,0,0,.7)"} />
            </div>
          </div>
          <div className={classes.bottomContent}>
            {rating > 0 ? (
              <>
                <div>
                  <strong>
                    <img
                      className={classes.star}
                      alt="star"
                      src="/static/star.svg"
                    />
                    {rating}
                  </strong>{" "}
                  ({reviews.length} {reviews.length > 1 ? "reviews" : "review"})
                </div>
              </>
            ) : (
              <strong>
                <img
                  alt="star"
                  className={classes.star}
                  src="/static/star.svg"
                />
                New
              </strong>
            )}
            <div>
              <strong>$ {spotObj.price}</strong> night
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default WishlistSpot;
