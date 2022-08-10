import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { thunkGetUserBookings } from "../../../store/userBookings";
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

  return (
    <div className={classes.container}>
      {Object.values(userBookings).length > 0 ? (
        Object.values(userBookings).map((booking, i) => {
          return (
            <div className={classes.mainContainer} key={i}>
              <div className={classes.infoContainer}>
                <div className={classes.spotName}> {booking.spotName}</div>
                <div className={classes.bookingDates}>
                  <div>Check in</div>
                  <div>
                    {booking.startDate.split(" ").splice(0, 4).join(" ")}
                  </div>
                </div>
                <div className={classes.bookingDates}>
                  <div>Check out</div>
                  <div>{booking.endDate.split(" ").splice(0, 4).join(" ")}</div>
                </div>
                <EditBookingForm booking={booking} />
              </div>
            </div>
          );
        })
      ) : (
        <div className={classes.noSpots}>
          It looks like you havent booked anything yet!
        </div>
      )}
    </div>
  );
}
export default UserPage;
