export const GET_USER_BOOKINGS = "userBookings/GET_USER_BOOKINGS";

const actionGetUserBookings = (bookings) => {
  return {
    type: GET_USER_BOOKINGS,
    bookings,
  };
};

export const thunkGetUserBookings = (userId) => async (dispatch) => {
  const response = await fetch(`/api/bookings/user/${userId}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (response.ok) {
    const bookings = await response.json();
    dispatch(actionGetUserBookings(bookings));
  }
};

const userBookings = (state = {}, action) => {
  let newState = JSON.parse(JSON.stringify(state));

  switch (action.type) {
    case GET_USER_BOOKINGS: {
      const { bookings } = action.bookings;

      bookings.forEach((booking) => {
        newState[booking.spotId].spot.bookings[booking.id] = booking;
      });
      return newState;
    }
    default: {
      return state;
    }
  }
};

export default userBookings;
