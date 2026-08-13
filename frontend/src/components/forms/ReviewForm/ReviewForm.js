import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import { thunkCreateReview } from "../../../store/reviews";

function ReviewForm({ spotId, setDisplay, innerRef }) {
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
      setErrors(["You must provide a description when adding a review"]);
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
      setDisplay(false);
    }
  };

  return (
    <div ref={innerRef} className={'mt-6 w-full max-w-lg rounded-2xl border border-gray-200 bg-white p-6 shadow-lg'}>
      <form onSubmit={handleSubmit} className={'flex flex-col gap-3'}>
        <div style={{ display: "flex", justifyContent: "center" }}>
          {errors.map((error, i) => (
            <div className={'mb-4 rounded-lg bg-rose-50 p-3 text-sm font-semibold text-rose-700'} key={i}>
              {error}
            </div>
          ))}
        </div>
        <div className={'flex items-center justify-between gap-4'}>
          <strong>Let others know how your stay was</strong>
          <div>
            <select
              className={'rounded-md border border-gray-300 bg-white p-2'}
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
        <div
          style={{
            color: "red",
            fontSize: "12px",
            display: "flex",
            justifyContent: "space-between",
          }}
        >
          * Required
          <div style={{ color: "red", fontSize: "12px" }}>
            * Rating defaults to 5
          </div>
        </div>
        <textarea
          className={'h-28 resize-none rounded-lg border border-gray-300 p-3 focus:border-rose-500'}
          placeholder="Write your review"
          value={review}
          onChange={(e) => setReview(e.target.value)}
        />
        <button className={'inline-flex cursor-pointer items-center justify-center rounded-lg bg-rose-500 px-5 py-3 font-bold text-white hover:bg-rose-600 focus:ring-2 focus:ring-rose-500'}>Submit</button>
      </form>
    </div>
  );
}

export default ReviewForm;
