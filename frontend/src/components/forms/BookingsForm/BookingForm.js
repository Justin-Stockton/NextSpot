import React, { useState } from "react";

import classes from "./BookingsForm.module.css";

function BookingForm({ spot }) {
  const defaultStart = new Date();
  defaultStart.setDate(defaultStart.getDate() + 1);
  const tomorrow = defaultStart.toISOString().split("T")[0];
  const defaultMin = new Date();
  defaultMin.setDate(defaultMin.getDate() + 3);
  const defaultEnd = defaultMin.toISOString().split("T")[0];
  // let userId = useSelector((state) => state.session.user.id);
  const [startDate, setStartDate] = useState(defaultMin);
  const [endDate, setEndDate] = useState(defaultEnd);

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
                  max={endDate}
                  className="dates"
                  required
                />
              </label>
            </div>
            <div className={classes.calendar}>
              <label>
                End Date:
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  min={tomorrow}
                  className="dates"
                  required
                />
              </label>
            </div>
          </div>
          <div className={classes.bookingsButton}> Book </div>
        </form>
      </div>
    </div>
  );
}

export default BookingForm;
