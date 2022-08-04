import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { thunkDeleteReview } from "../../../store/reviews";
import classes from "./ReviewModal.module.css";

function ReviewModal({ reviews, setDispaly }) {
  const user = useSelector((state) => state.session.user);
  const dispatch = useDispatch();
  return (
    <div className={classes.background}>
      <div className={classes.reviewsContainer}>
        <div className={classes.xcontainer}>
          <div className={classes.close} onClick={() => setDispaly(false)}>
            X
          </div>
        </div>
        {reviews.map((review, i) => {
          return (
            <div key={i} className={classes.reviewContainer}>
              <div className={classes.username}>
                {review.username}
                {user.id === review.userId ? (
                  <div
                    className={classes.delete}
                    onClick={() =>
                      dispatch(
                        thunkDeleteReview({
                          reviewId: review.id,
                          spotId: review.spotId,
                        })
                      )
                    }
                  >
                    x
                  </div>
                ) : null}
              </div>
              <div className={classes.body}>{review.review}</div>
              {user.id === review.userId ? (
                <div className={classes.edit}>Edit</div>
              ) : null}
              <form>
                <textarea />
              </form>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default ReviewModal;
