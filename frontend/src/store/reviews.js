export const CREATE_REVIEW = "reviews/CREATE_REVIEW";
export const GET_SPOT_REVIEWS = "reviews/GET_SPOT_REVIEWS";
export const UPDATE_REVIEW = "reviews/UPDATE_SPOT_REVIEW";
export const DELETE_REVIEW = "reviews/DELETE_REVIEW";

const actionCreateReview = (review) => {
  return {
    type: CREATE_REVIEW,
    review,
  };
};

const actionGetSpotReviews = (reviews) => {
  return {
    type: GET_SPOT_REVIEWS,
    reviews,
  };
};

const actionUpdateReview = (review) => {
  return {
    type: UPDATE_REVIEW,
    review,
  };
};

const actionDeleteReview = (reviewData) => {
  return {
    type: DELETE_REVIEW,
    reviewData,
  };
};

export const thunkCreateReview = (review) => async (dispatch) => {
  const response = await fetch("/api/reviews/create", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(review),
  });

  if (response.ok) {
    const review = await response.json();
    dispatch(actionCreateReview(review));
  }
};

export const thunkGetSpotReviews = (spotId) => async (dispatch) => {
  const response = await fetch(`/api/reviews/${spotId}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (response.ok) {
    const reviews = await response.json();
    dispatch(actionGetSpotReviews(reviews));
  }
};

export const thunkUpdateSpotReview = (updatedReview) => async (dispatch) => {
  const response = await fetch(`/api/reviews/update`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(updatedReview),
  });

  if (response.ok) {
    const review = await response.json();
    dispatch(actionUpdateReview(review));
  }
};

export const thunkDeleteReview = (reviewData) => async (dispatch) => {
  const response = await fetch("/api/reviews/delete", {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(reviewData),
  });
  if (response.ok) {
    dispatch(actionDeleteReview(reviewData));
  }
};
