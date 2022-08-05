export const GET_USER_BOOKINGS = "userBookings/GET_USER_BOOKINGS";
export const DELETE_USER_BOOKING = "userBookings/DELETE_USER_BOOKING";

const actionGetUserBookings = (bookings) => {
  return {
    type: GET_USER_BOOKINGS,
    bookings,
  };
};
const actionDeleteUserBookings = (bookingId) => {
  return {
    type: DELETE_USER_BOOKING,
    bookingId,
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
export const thunkDeleteUserBookings = (bookingId) => async (dispatch) => {
  const response = await fetch(`/api/bookings/delete`, {
    method: "delete",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(bookingId),
  });

  if (response.ok) {
    dispatch(actionDeleteUserBookings(bookingId));
  }
};

const userBookings = (state = {}, action) => {
  let newState = JSON.parse(JSON.stringify(state));

  switch (action.type) {
    case GET_USER_BOOKINGS: {
      const { bookings } = action.bookings;

      bookings.forEach((booking) => {
        newState[booking.id] = booking;
      });
      return newState;
    }

    case DELETE_USER_BOOKING: {
      const id = action.bookingId;
      delete newState[id];
      return newState;
    }
    default: {
      return state;
    }
  }
};

export default userBookings;
