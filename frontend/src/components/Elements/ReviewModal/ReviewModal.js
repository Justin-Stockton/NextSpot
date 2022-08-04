import React from "react";
import classes from "./ReviewModal.module.css";

function ReviewModal({ reviews, setDispaly }) {
  return (
    <div className={classes.background}>
      <div className={classes.reviewsContainer}>
        <div className={classes.xcontainer}>
          <div className={classes.empty}></div>
          <div className={classes.close} onClick={() => setDispaly(false)}>
            X
          </div>
        </div>
        {reviews.map((review, i) => {
          return (
            <div className={classes.reviewContainer}>
              <div className={classes.username}>
                {review.username} <div className={classes.delete}>x</div>
              </div>
              <div className={classes.body}>{review.review}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default ReviewModal;
