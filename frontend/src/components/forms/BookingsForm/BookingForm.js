import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { thunkCreateBooking } from "../../../store/bookings";

import classes from "./BookingsForm.module.css";

function BookingForm({ spot }) {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.session.user);

  const defaultStart = new Date();
  defaultStart.setDate(defaultStart.getDate() + 1);
  const tomorrow = defaultStart.toISOString().split("T")[0];

  const [startDate, setStartDate] = useState(tomorrow);
  const [endDate, setEndDate] = useState("");

  const submit = () => {
    const data = {
      userId: user.id,
      spotId: spot.id,
      startDate,
      endDate,
    };

    dispatch(thunkCreateBooking(data));
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
          <div className={classes.guests}>test</div>
          <div className={classes.bookingsButton} onClick={submit}>
            Book
          </div>
        </form>
      </div>
    </div>
  );
}

export default BookingForm;
