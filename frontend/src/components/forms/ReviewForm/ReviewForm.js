import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import { thunkCreateReview } from "../../../store/reviews";
import classes from "./ReviewForm.module.css";

function ReviewForm({ spotId }) {
  let user = useSelector((state) => state.session.user);
  const history = useHistory();
  const [rating, setRating] = useState(5);
  const [review, setReview] = useState("");
  const [errors, setErrors] = useState([]);
  const dispatch = useDispatch();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!user) {
      history.push("/login");
      return alert("You must be logged in to leave a review");
    }
    setErrors([]);
    if (!review.length) {
      setErrors(["You must provide a description when adding a review."]);
    }
    if (review.length > 1000) {
      setErrors([
        "You must provide a description less than 1000 characters when adding a review.",
      ]);
    }

    const data = {
      userId: user.id,
      username: user.username,
      spotId: spotId,
      rating,
      review,
    };

    if (review.length) {
      dispatch(thunkCreateReview(data));
      setReview("");
      setRating(5);
    }
  };

  return (
    <div className={classes.reviewFormContainer}>
      <form onSubmit={handleSubmit} className={classes.form}>
        <div style={{ display: "flex", justifyContent: "center" }}>
          {errors.map((error, i) => (
            <div className={classes.errors} key={i}>
              {error}
            </div>
          ))}
        </div>
        <div className={classes.ratingContainer}>
          <strong>Let others know how your stay was</strong>
          <div>
            <select
              className={classes.select}
              onChange={(e) => setRating(e.target.value)}
            >
              <option value={5}>5</option>
              <option value={4}>4</option>
              <option value={3}>3</option>
              <option value={2}>2</option>
              <option value={1}>1</option>
            </select>
          </div>
        </div>
        <textarea
          className={classes.ta}
          placeholder="* Write your review"
          value={review}
          onChange={(e) => setReview(e.target.value)}
        />
        <button className={classes.button}>Submit</button>
      </form>
    </div>
  );
}

export default ReviewForm;
