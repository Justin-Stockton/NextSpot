import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { thunkCreateBooking } from "../../../store/bookings";
import { thunkGetUserBookings } from "../../../store/userBookings";

import classes from "./BookingsForm.module.css";

function BookingForm({ spot }) {
  const history = useHistory();
  const dispatch = useDispatch();
  const user = useSelector((state) => state.session.user);

  const defaultStart = new Date();
  defaultStart.setDate(defaultStart.getDate() + 1);
  const tomorrow = defaultStart.toISOString().split("T")[0];

  const [startDate, setStartDate] = useState(tomorrow);
  const [endDate, setEndDate] = useState("");
  // const [guestCount, setGuestCount] = useState(1);

  const submit = async () => {
    const data = {
      userId: user.id,
      spotId: spot.id,
      spotName: spot.name,
      startDate,
      endDate,
    };
    await dispatch(thunkGetUserBookings(user.id));
    dispatch(thunkCreateBooking(data));
    history.push(`/${user.username}`);
    console.log(data);
  };

  return (
    <div className={classes.mainContainer}>
      <div className={classes.formTop}>
        <div> $ {spot.price} night</div>
        <div> reviews</div>
      </div>
      <div>
        <form>
          <div className={classes.calendars}>
            <div
              className={classes.calendar}
              style={{ borderRight: "1px solid black" }}
            >
              <label>
                Start Date:
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  min={tomorrow}
                  required
                />
              </label>
            </div>
            <div className={classes.calendar}>
              <label>
                End Date:
                <input
                  type="date"
                  onChange={(e) => setEndDate(e.target.value)}
                  min={startDate}
                  required
                />
              </label>
            </div>
          </div>
          <div className={classes.guests}></div>
          <div className={classes.bookingsButton} onClick={submit}>
            Book
          </div>
        </form>
      </div>
    </div>
  );
}

export default BookingForm;
