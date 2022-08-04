import React from "react";
import classes from "./ReviewCard.module.css";

function ReviewCard({ review }) {
  return (
    <>
      <div className={classes.review}>
        <div className={classes.title}>{review.username}</div>
        <div className={classes.body}>{review.review}</div>
        <div className={classes.more}>Show more...</div>
      </div>
    </>
  );
}

export default ReviewCard;
