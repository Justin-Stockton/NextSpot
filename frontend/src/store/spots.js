import {
  GET_SPOT_REVIEWS,
  DELETE_REVIEW,
  CREATE_REVIEW,
  UPDATE_REVIEW,
} from "./reviews";

import {
  GET_USER_BOOKINGS,
  CREATE_BOOKING,
  UPDATE_BOOKING,
  DELETE_BOOKING,
} from "./bookings";

const GET_SPOTS = "spots/GET_SPOTS";

const actionGetSpots = (spots) => ({
  type: GET_SPOTS,
  spots,
});

export const thunkGetSpots = () => async (dispatch) => {
  const response = await fetch("/api/spots/", {
    headers: {
      "Content-Type": "application/json",
    },
  });
  if (response.ok) {
    const spots = await response.json();
    if (spots.errors) {
      return;
    }

    dispatch(actionGetSpots(spots));
  }
};

const spots = (state = {}, action) => {
  let newState = JSON.parse(JSON.stringify(state));

  switch (action.type) {
    case GET_SPOTS: {
      const { spots } = action.spots;
      spots.forEach((spot) => {
        newState[spot.id] = { spot };
      });

      return newState;
    }

    case CREATE_BOOKING: {
      const { booking } = action;
      newState[booking.spotId].spot.bookings[booking.id] = booking;
      return newState;
    }

    case GET_SPOT_REVIEWS: {
      const { reviews } = action.reviews;

      reviews.forEach((review) => {
        newState.spots[review.spotId].reviews = { [review.id]: review };
      });
      return newState;
    }

    case CREATE_REVIEW: {
      const { review } = action;
      console.log(newState[review.spotId].spot.reviews);
      console.log((newState[review.spotId].spot.reviews[review.id] = review));
      console.log(newState[review.spotId].spot.reviews);
      return newState;
    }

    case UPDATE_REVIEW: {
      const review = action.review;
      newState[review.spotId].spot.reviews[review.id] = review;
      return newState;
    }

    case DELETE_REVIEW: {
      const { reviewId, spotId } = action.reviewData;
      delete newState[spotId].spot.reviews[reviewId];
      return newState;
    }

    default: {
      return state;
    }
  }
};

export default spots;
