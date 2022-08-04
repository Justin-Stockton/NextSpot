import React, { useState } from "react";
import classes from "./ReviewCard.module.css";
import ReviewModal from "../ReviewModal";

function ReviewCard({ review, reviews }) {
  const [display, setDisplay] = useState(false);
  return (
    <>
      {display ? (
        <ReviewModal reviews={reviews} setDispaly={setDisplay} />
      ) : null}
      <div className={classes.review}>
        <div className={classes.title}>{review.username}</div>
        <div className={classes.body}>{review.review}</div>
        <div
          className={classes.more}
          onClick={() => {
            display ? setDisplay(false) : setDisplay(true);
            window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
          }}
        >
          Show more {">"}
        </div>
      </div>
    </>
  );
}

export default ReviewCard;
