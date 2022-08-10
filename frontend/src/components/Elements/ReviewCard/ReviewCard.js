import React, { useState } from "react";
import classes from "./ReviewCard.module.css";
import ReviewModal from "../ReviewModal";

function ReviewCard({ review, reviews, rating }) {
  const [display, setDisplay] = useState(false);
  return (
    <>
      {display ? (
        <ReviewModal
          rating={rating}
          reviews={reviews}
          setDispaly={setDisplay}
        />
      ) : null}
      <div className={classes.review}>
        <div className={classes.title}>{review.username}</div>
        <div className={classes.body}>{review.review}</div>
        <div
          className={classes.more}
          onClick={() => {
            display ? setDisplay(false) : setDisplay(true);
          }}
        >
          Show more{" "}
          <img
            className={classes.rightArrow}
            alt="arrow right"
            src="/static/rightArrow.svg"
          ></img>
        </div>
      </div>
    </>
  );
}

export default ReviewCard;
