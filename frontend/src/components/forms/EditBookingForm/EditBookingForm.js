import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { thunkUpdateBooking } from "../../../store/userBookings";
import { thunkDeleteUserBookings } from "../../../store/userBookings";

import classes from "./EditBookingForm.module.css";

function EditBookingForm({ booking }) {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.session.user);
  const spot = useSelector((state) => state.spots[booking.spotId].spot);

  const deleteBooking = (bookingId) => {
    dispatch(thunkDeleteUserBookings(bookingId));
  };

  const defaultStart = new Date();
  defaultStart.setDate(defaultStart.getDate() + 1);
  const tomorrow = defaultStart.toISOString().split("T")[0];

  const checkin = new Date(booking.startDate);
  checkin.setDate(checkin.getDate());
  const initialCheckin = checkin.toISOString().split("T")[0];

  const checkOut = new Date(booking.endDate);
  checkOut.setDate(checkOut.getDate());
  const initialCheckOut = checkOut.toISOString().split("T")[0];

  const [startDate, setStartDate] = useState(initialCheckin);
  const [endDate, setEndDate] = useState(initialCheckOut);
  const [formDisplay, setFormDisplay] = useState(false);

  let stayLength = (new Date(endDate) - new Date(startDate)) / 1000 / 86400;

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
    setFormDisplay(false);
  };

  return (
    <div>
      {formDisplay ? (
        <div className={classes.mainContainer}>
          <img
            src="/static/x.svg"
            className={classes.x}
            alt="x"
            onClick={() => setFormDisplay(false)}
          />
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
                      onKeyDown={(e) => e.preventDefault()}
                      min={tomorrow}
                      required
                      className={classes.input}
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
                      onKeyDown={(e) => e.preventDefault()}
                      min={startDate}
                      required
                      className={classes.input}
                    />
                  </label>
                </div>
              </div>
              <div className={classes.guests}>
                {stayLength <= 0 ? (
                  <div>Checkout date must come after checkin date</div>
                ) : (
                  `Stay length ${stayLength} nights`
                )}
              </div>
              {stayLength > 0 ? (
                <div className={classes.bookingsButton} onClick={submit}>
                  Edit your stay
                </div>
              ) : null}
              {stayLength > 0 ? (
                <>
                  <div className={classes.disclaimer}>
                    You won't be charged yet
                  </div>
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
      ) : (
        <div className={classes.buttonContainer}>
          <div>
            <div
              className={classes.button}
              onClick={() => setFormDisplay(true)}
            >
              Edit
            </div>
          </div>
          <div
            className={`${classes.button} ${classes.cancel}`}
            onClick={() => deleteBooking(booking.id)}
          >
            Cancel Booking
          </div>
        </div>
      )}
    </div>
  );
}

export default EditBookingForm;
