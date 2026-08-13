import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { thunkGetUserBookings } from "../../../store/userBookings";
import EditBookingForm from "../../forms/EditBookingForm";
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
    <div className={'mx-auto max-w-7xl px-4 py-8 sm:px-8'}>
      <div className={'mb-8 text-3xl font-bold'}>Trips</div>
      <div style={{ display: "flex", flexWrap: "wrap" }}>
        {Object.values(userBookings).length > 0 ? (
          Object.values(userBookings).map((booking, i) => {
            return (
              <div className={'w-full max-w-xl pb-6 sm:pr-6'} key={i}>
                <div className={'rounded-xl border border-gray-200 bg-white p-6 shadow-md'}>
                  <div className={'mb-4 text-xl font-bold'}> {booking.spotName}</div>
                  <div className={'flex justify-between gap-4 border-t border-gray-100 py-3'}>
                    <div>Check in</div>
                    <div>
                      {booking.startDate.split(" ").splice(0, 4).join(" ")}
                    </div>
                  </div>
                  <div className={'flex justify-between gap-4 border-t border-gray-100 py-3'}>
                    <div>Check out</div>
                    <div>
                      {booking.endDate.split(" ").splice(0, 4).join(" ")}
                    </div>
                  </div>
                  <EditBookingForm booking={booking} />
                </div>
              </div>
            );
          })
        ) : (
          <>
            <div className={'flex w-full overflow-hidden rounded-xl border border-gray-200 shadow-md'}>
              <div className={'flex w-full flex-col p-8 md:w-1/3'}>
                <img
                  className={'h-12 w-12'}
                  alt="Hello wave"
                  src="/static/wave.svg"
                />
                <span className={'mt-3 text-xl font-semibold'}>
                  No trips booked...yet!
                </span>
                <span className={'mt-4 text-gray-600'}>
                  Time to dust off your bags and start planning your next
                  adventure
                </span>
                <div
                  onClick={() => history.push("/")}
                  className={'mt-6 inline-flex w-fit cursor-pointer rounded-lg bg-rose-500 px-5 py-3 font-bold text-white hover:bg-rose-600'}
                >
                  Start searching
                </div>
              </div>
              <div className={'hidden w-2/3 md:block'}>
                <img
                  className={'h-full max-h-[22rem] w-full object-cover'}
                  alt="family having a fun trip"
                  src="https://a0.muscache.com/im/pictures/d727f355-3f10-44b5-9750-d1efca2438fc.jpg?im_w=1200"
                />
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
export default UserPage;
