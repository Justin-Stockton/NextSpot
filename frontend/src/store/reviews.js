export const GET_SPOT_REVIEWS = "reviews/GET_SPOT_REVIEWS";

const actionGetSpotReviews = (reviews) => ({
  type: GET_SPOT_REVIEWS,
  reviews,
});

const actionGetReviews = (reviews) => ({
  type: GET_SPOTS,
  reviews,
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
    dispatch(actionGetReviews(reviews));
  }
};
