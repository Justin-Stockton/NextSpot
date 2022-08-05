import React, { useState } from "react";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import ReviewForm from "../../forms/ReviewForm";

import BookingForm from "../../forms/BookingsForm";
import classes from "./SpotPage.module.css";
import ReviewCard from "../../Elements/ReviewCard";

function SpotPage() {
  const { spotId } = useParams();
  let spot = useSelector((state) => state.spots[spotId].spot);
  let reviews = Object.values(spot.reviews);

  const [display, setDisplay] = useState(false);

  return (
    <div className={classes.mainContainer}>
      <div className={classes.nameHeading}>
        <h1>{spot.name}</h1>
        <div>
          {reviews.length} reviews - {spot.city}, {spot.state}, United States
        </div>
      </div>
      <div className={classes.photos}>Test</div>
      <div className={classes.bottomContainer}>
        <div className={classes.textContainer}></div>
        <div className={classes.formContainer}>
          <BookingForm spot={spot} />
        </div>
      </div>
      <div className={classes.reviewsMainContainer}>
        <div className={classes.reviewsContainer}>
          {reviews.length} {reviews.length === 1 ? "Review" : "Reviews"}
        </div>
        <div className={classes.reviews}>
          {reviews.length > 0 ? (
            <div>
              <ReviewCard
                reviews={reviews}
                review={reviews[reviews.length - 1]}
              />
            </div>
          ) : (
            "Be the first to leave a review!"
          )}
          {reviews.length > 1 ? (
            <div>
              <ReviewCard reviews={reviews} review={reviews[1]} />
            </div>
          ) : null}
        </div>
        {display === true ? (
          <>
            <div>
              <ReviewForm spotId={spot.id} />
            </div>
            <div
              className={classes.addAReview}
              onClick={() => setDisplay(false)}
            >
              Close
            </div>
          </>
        ) : (
          <div className={classes.addAReview} onClick={() => setDisplay(true)}>
            Add a review
          </div>
        )}
      </div>
    </div>
  );
}

export default SpotPage;
