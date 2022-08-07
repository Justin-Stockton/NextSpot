import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { thunkCreateBooking } from "../../../store/bookings";
import { thunkGetUserBookings } from "../../../store/userBookings";

import classes from "./BookingsForm.module.css";

function BookingForm({ spot, reviewsTotal }) {
  const history = useHistory();
  const dispatch = useDispatch();
  const user = useSelector((state) => state.session.user);

  const defaultStart = new Date();
  defaultStart.setDate(defaultStart.getDate() + 1);
  const tomorrow = defaultStart.toISOString().split("T")[0];

  const defaultEnd = new Date();
  defaultEnd.setDate(defaultStart.getDate() + 5);
  const initialEnd = defaultEnd.toISOString().split("T")[0];

  const twoDays = new Date();
  twoDays.setDate(defaultStart.getDate() + 1);
  const initialMin = twoDays.toISOString().split("T")[0];

  const [startDate, setStartDate] = useState(tomorrow);
  const [endDate, setEndDate] = useState(initialEnd);

  let stayLength = (new Date(endDate) - new Date(startDate)) / 1000 / 86400;

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
        <div>
          <strong>${spot.price}</strong> night
        </div>
        <div>{reviewsTotal} reviews</div>
      </div>
      <div>
        <form>
          <div className={classes.calendars}>
            <div
              className={classes.calendar}
              style={{ borderRight: "1px solid #7b7b7b" }}
            >
              <label className={classes.check}>
                CHECK-IN
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
              <label className={classes.check}>
                CHECKOUT
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  min={initialMin}
                  required
                />
              </label>
            </div>
          </div>
          <div className={classes.guests}>
            {stayLength <= 0
              ? "Invalid booking"
              : `Stay length ${stayLength} nights`}
          </div>
          {stayLength > 0 ? (
            <div className={classes.bookingsButton} onClick={submit}>
              Reserve
            </div>
          ) : null}
          {stayLength > 0 ? (
            <>
              <div className={classes.disclaimer}>You won't be charged yet</div>
              <div>
                <div className={classes.priceInfo}>
                  ${spot.price} x {stayLength} nights
                  <div>
                    ${(spot.price * stayLength).toLocaleString("en-US")}
                  </div>
                </div>
              </div>
              <div className={classes.priceInfo}>
                <div>Service fee</div>
                <div>${200}</div>
              </div>
            </>
          ) : null}
          {stayLength > 0 ? (
            <div className={`${classes.priceInfo} ${classes.total}`}>
              <div>
                <strong>Total before taxes</strong>
              </div>
              <div>
                <strong>
                  ${(spot.price * stayLength + 200).toLocaleString("en-US")}
                </strong>
              </div>
            </div>
          ) : null}
        </form>
      </div>
    </div>
  );
}

export default BookingForm;
