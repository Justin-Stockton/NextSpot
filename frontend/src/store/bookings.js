export const GET_BOOKINGS = "bookings/GET_BOOKINGS";
export const CREATE_BOOKING = "bookings/CREATE_BOOKING";
const GET_USER_BOOKINGS = "bookings/GET_USER_BOOKINGS";
const UPDATE_BOOKING = "bookings/UPDATE_BOOKING";
const DELETE_BOOKING = "bookings/DELETE_BOOKING";

const actionCreateBooking = (booking) => {
  return {
    type: CREATE_BOOKING,
    booking,
  };
};

const actionGetSpotBookings = (bookings) => {
  return {
    type: GET_BOOKINGS,
    bookings,
  };
};

const actionGetUserBookings = (bookings) => {
  return {
    type: GET_USER_BOOKINGS,
    bookings,
  };
};

const actionUpdateBooking = (booking) => {
  return {
    type: UPDATE_BOOKING,
    booking,
  };
};

const actionDeleteBooking = (bookingData) => {
  return {
    type: DELETE_BOOKING,
    bookingData,
  };
};

export const thunkCreateBooking = (booking) => async (dispatch) => {
  const response = await fetch("/api/bookings/create", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(booking),
  });

  if (response.ok) {
    const booking = await response.json();
    dispatch(actionCreateBooking(booking));
  }
};

export const thunkGetSpotBookings = (spotId) => async (dispatch) => {
  const response = await fetch(`/api/bookings/spot/${spotId}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });
  if (response.ok) {
    const bookings = await response.json();
    if (bookings.errors) {
      return;
    }

    dispatch(actionGetSpotBookings(bookings));
  }
};

export const thunkGetUserBookings = (spotId) => async (dispatch) => {
  const response = await fetch(`/api/bookings/spot/${spotId}`, {
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

export const thunkUpdateBooking = (booking) => async (dispatch) => {
  const response = await fetch("/api/bookings/update", {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(booking),
  });

  if (response.ok) {
    const booking = await response.json();
    dispatch(actionUpdateBooking(booking));
  }
};

export const thunkDeleteBooking = (bookingId) => async (dispatch) => {
  const response = await fetch("/api/booking/delete", {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(bookingId),
  });
  if (response.ok) {
    dispatch(actionDeleteBooking(bookingId));
  }
};

// const bookings = (state = {}, action) => {
//   let newState = JSON.parse(JSON.stringify(state));

//   switch (action.type) {
//     case GET_USER_BOOKINGS: {
//       const { bookings } = action.bookings;

//       bookings.forEach((booking) => {
//         newState.bookings[booking.id] = booking;
//       });

//       return newState;
//     }

//     case CREATE_BOOKING: {
//       const { booking } = action.booking;
//       newState.bookings[booking.id] = booking;
//       return;
//     }

//     case UPDATE_BOOKING: {
//       const { booking } = action.booking;
//       newState.bookings[booking.id] = booking;
//       return newState;
//     }

//     case DELETE_BOOKING: {
//       const { bookingId } = action.bookingId;
//       delete newState.bookings[bookingId];
//       return newState;
//     }

//     default: {
//       return state;
//     }
//   }
// };

// export default bookings;
