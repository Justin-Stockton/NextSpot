import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  thunkGetUserBookings,
  thunkDeleteUserBookings,
} from "../../../store/userBookings";
import EditBookingForm from "../../forms/EditBookingForm";
import classes from "./UserPage.module.css";

function UserPage() {
  const user = useSelector((state) => state.session.user);
  const [loaded, setLoaded] = useState(false);
  const dispatch = useDispatch();
  const userBookings = useSelector((state) => state.userBookings);
  const observer = useSelector((state) => state.spots);

  useEffect(() => {
    (async () => {
      await dispatch(thunkGetUserBookings(user.id));
      setLoaded(true);
    })();
  }, [dispatch, user.id, observer]);

  if (!loaded) {
    return null;
  }

  const deleteBooking = (bookingId) => {
    dispatch(thunkDeleteUserBookings(bookingId));
  };

  return (
    <>
      {Object.values(userBookings).length > 0 ? (
        Object.values(userBookings).map((booking, i) => {
          return (
            <div className={classes.container} key={i}>
              {/*
              <div> {booking.guestCount}</div>
            <div> {booking.cost}</div> */}
              <div> {booking.spotName}</div>
              <div> {booking.id}</div>
              <div> {booking.startDate}</div>
              <div> {booking.endDate}</div>
              <div>
                <div>
                  <EditBookingForm booking={booking} />
                </div>
                <div onClick={() => deleteBooking(booking.id)}>TODO DELETE</div>
              </div>
            </div>
          );
        })
      ) : (
        <p>It looks like you havent booked anything yet!</p>
      )}
    </>
  );
}
export default UserPage;
