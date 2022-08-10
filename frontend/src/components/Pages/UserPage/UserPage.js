import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { thunkGetUserBookings } from "../../../store/userBookings";
import EditBookingForm from "../../forms/EditBookingForm";
import classes from "./UserPage.module.css";
import { useHistory } from "react-router-dom";
function UserPage() {
  const user = useSelector((state) => state.session.user);
  const [loaded, setLoaded] = useState(false);
  const dispatch = useDispatch();
  const userBookings = useSelector((state) => state.userBookings);
  const observer = useSelector((state) => state.spots);
  const history = useHistory();
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
      <div className={classes.noSpots}>Trips</div>
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
        <>
          <div className={classes.noBookingContainer}>
            <div className={classes.subTextContainer}>
              <img
                className={classes.wave}
                alt="Hello wave"
                src="/static/wave.svg"
              />
              <span className={classes.subHeader}>No trips booked...yet!</span>
              <span className={classes.dust}>
                Time to dust off your bags and start planning your next
                adventure
              </span>
              <div
                onClick={() => history.push("/")}
                className={classes.searchButton}
              >
                Start searching
              </div>
            </div>
            <div className={classes.imgContainer}>
              <img
                className={classes.img}
                alt="family having a fun trip"
                src="https://a0.muscache.com/im/pictures/d727f355-3f10-44b5-9750-d1efca2438fc.jpg?im_w=1200"
              />
            </div>
          </div>
        </>
      )}
    </div>
  );
}
export default UserPage;
