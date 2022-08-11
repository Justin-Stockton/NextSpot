import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { thunkDeleteReview } from "../../../store/reviews";
import EditReviewForm from "../../forms/EditReviewForm";
import classes from "./ReviewModal.module.css";

function ReviewModal({ reviews, setDispaly, rating }) {
  let user = useSelector((state) => state.session.user);
  const [toggleForm, setToggleForm] = useState(false);
  const dispatch = useDispatch();

  return (
    <>
      {user ? (
        <div className={classes.background}>
          <div className={classes.reviewsContainer}>
            <div className={classes.close}>
              <div>
                <img
                  onClick={() => setDispaly(false)}
                  className={classes.x}
                  src="/static/x.svg"
                  alt="delete"
                />
              </div>
              <div style={{ display: "flex", alignItems: "center" }}>
                <img
                  alt="star"
                  className={classes.star}
                  src="/static/star.svg"
                />
                <span style={{ fontSize: "18px" }}>
                  {rating} · Reviews {reviews.length}
                </span>
              </div>
            </div>

            {reviews.map((review, i) => {
              return (
                <div key={i} className={classes.reviewContainer}>
                  <div className={classes.username}>
                    {review.username}{" "}
                    <span style={{ display: "flex", alignItems: "center" }}>
                      {review.rating}
                      <img
                        className={classes.star}
                        alt="star"
                        src="/static/star.svg"
                      />
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
                          <img
                            className={classes.x}
                            src="/static/trashcan.svg"
                            alt="delete"
                          />
                        </div>
                      ) : null}
                    </span>
                  </div>
                  <div className={classes.body}>{review.review}</div>
                  {user.id === review.userId ? (
                    <>
                      {!toggleForm ? (
                        <div
                          className={classes.edit}
                          onClick={() => setToggleForm(true)}
                        >
                          Edit
                        </div>
                      ) : null}

                      <EditReviewForm
                        setToggleForm={setToggleForm}
                        toggleForm={toggleForm}
                        spotId={review.spotId}
                        currentReview={review}
                      />
                    </>
                  ) : null}
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        <>
          <div className={classes.background}>
            <div className={classes.reviewsContainer}>
              <div className={classes.close}>
                <div>
                  <img
                    onClick={() => setDispaly(false)}
                    className={classes.x}
                    src="/static/x.svg"
                    alt="delete"
                  />
                </div>
                <div style={{ display: "flex", alignItems: "center" }}>
                  <img
                    alt="star"
                    className={classes.star}
                    src="/static/star.svg"
                  />
                  <span style={{ fontSize: "18px" }}>
                    {rating} · Reviews {reviews.length}
                  </span>
                </div>
              </div>
              {reviews.map((review, i) => {
                return (
                  <div key={i} className={classes.reviewContainer}>
                    <div className={classes.username}>
                      {review.username}{" "}
                      <span style={{ display: "flex", alignItems: "center" }}>
                        {review.rating}
                        <img
                          className={classes.star}
                          alt="star"
                          src="/static/star.svg"
                        />
                      </span>
                    </div>
                    <div className={classes.body}>{review.review}</div>{" "}
                  </div>
                );
              })}
            </div>
          </div>
        </>
      )}
    </>
  );
}

export default ReviewModal;
