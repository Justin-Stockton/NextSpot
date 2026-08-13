import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { thunkUpdateSpotReview } from "../../../store/reviews";

function EditReviewForm({ spotId, currentReview }) {
  let user = useSelector((state) => state.session.user);
  const [rating, setRating] = useState(currentReview.rating);
  const [review, setReview] = useState(currentReview.review);
  const [errors, setErrors] = useState([]);
  const [toggleForm, setToggleForm] = useState(false);
  const dispatch = useDispatch();

  const handleSubmit = async () => {
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
      id: currentReview.id,
      userId: user.id,
      username: user.username,
      spotId: spotId,
      rating,
      review,
    };
    if (review.length && review.length <= 1000) {
      await dispatch(thunkUpdateSpotReview(data));
      setToggleForm(false);
    }
  };
  return (
    <>
      {toggleForm ? (
        <div className={'mt-6 w-full max-w-lg rounded-2xl border border-gray-200 bg-white p-6 shadow-lg'}>
          <form className={'flex flex-col gap-3'}>
            <div style={{ display: "flex", justifyContent: "center" }}>
              {errors.map((error, i) => (
                <div className={'mb-4 rounded-lg bg-rose-50 p-3 text-sm font-semibold text-rose-700'} key={i}>
                  {error}
                </div>
              ))}
            </div>
            <strong>Edit your thoughts</strong>
            <select
              className={'rounded-md border border-gray-300 bg-white p-2'}
              onChange={(e) => setRating(e.target.value)}
            >
              <option value={currentReview.rating}>
                {currentReview.rating}
              </option>
              <option disabled="disabled">----</option>
              <option value={5}>5</option>
              <option value={4}>4</option>
              <option value={3}>3</option>
              <option value={2}>2</option>
              <option value={1}>1</option>
            </select>
            <div
              style={{
                color: "red",
                fontSize: "12px",
                display: "flex",
                justifyContent: "space-between",
              }}
            >
              * Required
            </div>
            <textarea
              className={'h-28 resize-none rounded-lg border border-gray-300 p-3 focus:border-rose-500'}
              value={review}
              onChange={(e) => setReview(e.target.value)}
            />
            <div className={'flex justify-between gap-3'}>
              <div
                className={'inline-flex cursor-pointer items-center justify-center rounded-lg bg-rose-500 px-5 py-3 font-bold text-white hover:bg-rose-600 focus:ring-2 focus:ring-rose-500'}
                onClick={() => {
                  handleSubmit();
                }}
              >
                Edit
              </div>
              <div
                className={'inline-flex cursor-pointer items-center justify-center rounded-lg bg-rose-500 px-5 py-3 font-bold text-white hover:bg-rose-600 focus:ring-2 focus:ring-rose-500'}
                onClick={() => setToggleForm(false)}
              >
                Cancel
              </div>
            </div>
          </form>
        </div>
      ) : (
        <>
          <div className={'inline-flex cursor-pointer rounded-lg bg-rose-500 px-5 py-2 font-bold text-white hover:bg-rose-600'} onClick={() => setToggleForm(true)}>
            Edit
          </div>
        </>
      )}
    </>
  );
}

export default EditReviewForm;
