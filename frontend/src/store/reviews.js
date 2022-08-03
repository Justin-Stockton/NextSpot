export const GET_SPOT_REVIEWS = "reviews/GET_SPOT_REVIEWS";
export const UPDATE_SPOT_REVIEW = "reviews/UPDATE_SPOT_REVIEW";
export const DELETE_REVIEW = "reviews/DELETE_REVIEW";

const actionGetSpotReviews = (reviews) => ({
  type: GET_SPOT_REVIEWS,
  reviews,
});

const actionUpdateReview = (review) => ({
  type: UPDATE_SPOT_REVIEW,
  review,
});

const actionDeleteReview = (reviewId) => ({
  type: DELETE_REVIEW,
  reviewId,
});

export const thunkGetSpotReviews = (spotId) => async (dispatch) => {
  const response = await fetch(`/api/reviews/${spotId}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (response.ok) {
    reviews = await response.json();
    dispatch(actionGetSpotReviews(reviews));
  }
};

export const thunkUpdateSpotReview = (updatedReview) => async (dispatch) => {
  const response = await fetch(`apli/reviews/update`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(updatedReview),
  });

  if (response.ok) {
    review = await response.json();
    dispatch(actionUpdateReview(review));
  }
};

export const thunkDeleteReview = (reviewId) => async (dispatch) => {
  const response = await fetch("/api/reviews/delete", {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ reviewId }),
  });
  if (response.ok) {
    dispatch(actionDeleteReview(reviewId));
  }
};
