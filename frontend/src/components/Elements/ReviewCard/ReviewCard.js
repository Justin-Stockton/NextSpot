import React, { useState } from "react";
import classes from "./ReviewCard.module.css";
import ReviewModal from "../ReviewModal";

import { useClickOutside } from "../../../App";

function ReviewCard({ review, reviews, rating }) {
  const [display, setDisplay] = useState(false);

  const modalRef = useClickOutside(() => {
    setDisplay(false);
  });

  return (
    <>
      {display ? (
        <ReviewModal
          innerRef={modalRef}
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
            setDisplay(!display);
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
