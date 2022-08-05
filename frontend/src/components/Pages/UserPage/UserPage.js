import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { thunkGetUserBookings } from "../../../store/userBookings";
import classes from "./UserPage.module.css";

function UserPage() {
  const user = useSelector((state) => state.session.user);
  const [loaded, setLoaded] = useState(false);
  const dispatch = useDispatch();
  const bookings = useSelector((state) => state.userBookings);

  useEffect(() => {
    (async () => {
      await dispatch(thunkGetUserBookings(user.id));
      setLoaded(true);
    })();
  }, [dispatch, user.id]);

  if (!loaded) {
    return null;
  }

  return (
    <>
      {Object.values(bookings).length > 0 ? (
        Object.values(bookings).map((booking, i) => {
          return (
            <div className={classes.container} key={i}>
              {/* <div> {booking.spotName}</div>
              <div> {booking.guestCount}</div>
              <div> {booking.cost}</div> */}
              <div> {booking.id}</div>
              <div> {booking.startDate}</div>
              <div> {booking.endDate}</div>
              <div>
                <div>TODO UPDATE</div>
                <div>TODO DELETE</div>
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
