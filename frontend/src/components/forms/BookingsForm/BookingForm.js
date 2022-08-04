import React from "react";

import classes from "./BookingsForm.module.css";

function BookingForm({ spot }) {
  //   let userId = useSelector((state) => state.session.user.id);
  //   const [startDate, setStartDate] = useState();
  //   const [endDate, setEndDate] = useState();

  //   const handleSubmit = () => {};
  return (
    <div className={classes.mainContainer}>
      <div className={classes.formTop}>
        <div> $ {spot.price} night</div>
        <div> 2 reviews</div>
      </div>
      <div>
        <form>
          <div>
            <label>CHECK-IN:</label>
            <input type="date" id="start" name="startDate" />
            <label>CHECK-OUT:</label>
            <input type="date" id="start" name="trip-start" />
          </div>
          <button> Book </button>
        </form>
      </div>
    </div>
  );
}

export default BookingForm;
