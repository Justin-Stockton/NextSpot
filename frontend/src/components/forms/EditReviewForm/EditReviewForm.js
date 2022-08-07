import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { thunkUpdateSpotReview } from "../../../store/reviews";
import classes from "./EditReviewForm.module.css";

function EditReviewForm({ toggleForm, setToggleForm, spotId, currentReview }) {
  let user = useSelector((state) => state.session.user);
  const [rating, setRating] = useState(currentReview.rating);
  const [review, setReview] = useState(currentReview.review);
  const dispatch = useDispatch();

  const handleSubmit = () => {
    const data = {
      id: currentReview.id,
      userId: user.id,
      username: user.username,
      spotId: spotId,
      rating,
      review,
    };
    dispatch(thunkUpdateSpotReview(data));
  };
  return (
    <>
      {toggleForm ? (
        <div>
          <form>
            <textarea
              value={review}
              onChange={(e) => setReview(e.target.value)}
            />
            <select onChange={(e) => setRating(e.target.value)}>
              <option value={5}>5</option>
              <option value={4}>4</option>
              <option value={3}>3</option>
              <option value={2}>2</option>
              <option value={1}>1</option>
            </select>
            <div className={classes.buttonContainer}>
              <div
                className={classes.button}
                onClick={() => {
                  setToggleForm(false);
                  handleSubmit();
                }}
              >
                Edit
              </div>
              <div
                className={classes.button}
                onClick={() => setToggleForm(false)}
              >
                Cancel
              </div>
            </div>
          </form>
        </div>
      ) : null}
    </>
  );
}

export default EditReviewForm;
