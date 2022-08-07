import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { thunkUpdateBooking } from "../../../store/userBookings";

import classes from "./EditBookingForm.module.css";

function EditBookingForm({ booking, setDisplay, display }) {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.session.user);

  const defaultStart = new Date();
  defaultStart.setDate(defaultStart.getDate() + 1);
  const tomorrow = defaultStart.toISOString().split("T")[0];

  const [startDate, setStartDate] = useState(booking.startDate);
  const [endDate, setEndDate] = useState(booking.endDate);

  const submit = async () => {
    const data = {
      id: booking.id,
      userId: user.id,
      spotId: booking.spotId,
      spotName: booking.spotName,
      startDate,
      endDate,
    };
    dispatch(thunkUpdateBooking(data));
    setDisplay(false);
  };

  if (!display) return null;

  return (
    <div className={classes.mainContainer}>
      <div onClick={() => setDisplay(false)}>x</div>
      <div className={classes.formTop}>
        <div>Edit your stay at {booking.spotName}</div>
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
          <div className={classes.guests}>
            {/* <label>Number of guests:</label>
            <input type="number" min="0" /> */}
          </div>
          <div className={classes.bookingsButton} onClick={submit}>
            Edit
          </div>
        </form>
      </div>
    </div>
  );
}

export default EditBookingForm;
