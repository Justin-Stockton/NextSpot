import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { thunkCreateBooking } from "../../../store/bookings";
import { thunkGetUserBookings } from "../../../store/userBookings";


function BookingForm({ spot, reviewsTotal, rating }) {
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
  useEffect(() => {
    if (stayLength <= 0) {
      const newEnd = new Date(startDate);
      newEnd.setDate(newEnd.getDate() + 5);

      let newCheckout = newEnd.toISOString().split("T")[0];
      setEndDate(newCheckout);
    }
    return;
  }, [startDate, stayLength]);

  const submit = async () => {
    if (!user) {
      history.push("/login");
      return alert("You must be logged in to reserve a booking");
    }
    const data = {
      userId: user.id,
      spotId: spot.id,
      spotName: spot.name,
      startDate,
      endDate,
    };
    await dispatch(thunkGetUserBookings(user.id));
    dispatch(thunkCreateBooking(data));
    history.push(`/user/${user.username}`);
  };

  return (
    <div className={'w-full max-w-md rounded-2xl border border-gray-200 bg-white p-6 shadow-lg'}>
      <div className={'flex justify-between gap-4'}>
        <div className={'text-xl'}>
          <strong>${spot.price}</strong> night
        </div>
        <div className={'text-sm font-semibold text-gray-500'}>
          {rating > 0 ? (
            <strong style={{ fontSize: "14px" }}>{rating}</strong>
          ) : (
            "New"
          )}{" "}
          <img alt="star" className={'inline h-3 w-3'} src="/media/star.svg" />{" "}
          <strong>·</strong> {reviewsTotal} reviews
        </div>
      </div>
      <div>
        <form>
          <div className={'mt-6 flex overflow-hidden rounded-t-xl border border-gray-400'}>
            <div
              className={'flex flex-1 items-center justify-center p-3'}
              style={{ borderRight: "1px solid #7b7b7b" }}
            >
              <label className={'text-xs font-extrabold'}>
                CHECK-IN
                <input
                  type="date"
                  value={startDate}
                  onKeyDown={(e) => e.preventDefault()}
                  onChange={(e) => setStartDate(e.target.value)}
                  min={tomorrow}
                  required
                  className={'mt-1 w-full border-0 bg-transparent text-sm'}
                />
              </label>
            </div>
            <div className={'flex flex-1 items-center justify-center p-3'}>
              <label className={'text-xs font-extrabold'}>
                CHECKOUT
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  min={initialMin}
                  required
                  className={'mt-1 w-full border-0 bg-transparent text-sm'}
                />
              </label>
            </div>
          </div>
          <div className={'flex h-14 items-center justify-center rounded-b-xl border border-t-0 border-gray-400 text-sm'}>
            {stayLength <= 0 ? (
              <div>Checkout date must come after checkin date</div>
            ) : (
              `Stay length ${stayLength} nights`
            )}
          </div>
          {stayLength > 0 ? (
            <div className={'mt-5 flex min-h-[48px] cursor-pointer items-center justify-center rounded-lg bg-rose-500 font-bold text-white hover:bg-rose-600'} onClick={submit}>
              Reserve
            </div>
          ) : null}
          {stayLength > 0 ? (
            <>
              <div className={'py-4 text-center text-sm'}>You won't be charged yet</div>
              <div>
                <div className={'flex justify-between gap-4 pb-4'}>
                  ${spot.price} x {stayLength} nights
                  <div>
                    ${(spot.price * stayLength).toLocaleString("en-US")}
                  </div>
                </div>
              </div>
              <div className={'flex justify-between gap-4 pb-4'}>
                <div>Service fee</div>
                <div>${200}</div>
              </div>
            </>
          ) : null}
          {stayLength > 0 ? (
            <div className={`${'flex justify-between gap-4 pb-4'} ${'border-t border-gray-200 pt-4'}`}>
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
