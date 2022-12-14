export const GET_BOOKINGS = "bookings/GET_BOOKINGS";
export const CREATE_BOOKING = "bookings/CREATE_BOOKING";

export const DELETE_BOOKING = "bookings/DELETE_BOOKING";

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
