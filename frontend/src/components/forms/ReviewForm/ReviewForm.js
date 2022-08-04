import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import classes from "./ReviewForm.module.css";
import { thunkCreateReview } from "../../../store/reviews";

function ReviewForm({ spotId }) {
  let user = useSelector((state) => state.session.user);
  const [rating, setRating] = useState(5);
  const [review, setReview] = useState("");
  const dispatch = useDispatch();

  const handleSubmit = (e) => {
    e.preventDefault();
    const data = {
      userId: user.id,
      username: user.username,
      spotId: spotId,
      rating,
      review,
    };
    dispatch(thunkCreateReview(data));
    setReview("");
    setRating(5);
  };
  return (
    <div className={classes.reviewFormContainer}>
      <form onSubmit={handleSubmit} className={classes.form}>
        <textarea onChange={(e) => setReview(e.target.value)} />
        <select onChange={(e) => setRating(e.target.value)}>
          <option value={5}>5</option>
          <option value={4}>4</option>
          <option value={3}>3</option>
          <option value={2}>2</option>
          <option value={1}>1</option>
        </select>
        <button>Submit</button>
      </form>
    </div>
  );
}

export default ReviewForm;
