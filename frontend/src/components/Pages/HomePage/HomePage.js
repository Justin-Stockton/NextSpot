import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { thunkGetWishlists } from "../../../store/wishlists";
import SpotCard from "../../Elements/SpotCard";

function HomePage() {
  let spots = useSelector((state) => state.spots);
  let user = useSelector((state) => state.session.user);
  const dispatch = useDispatch();

  if (user) {
    dispatch(thunkGetWishlists(user.id));
  }

  return (
    <div>
      <div className={'mx-auto max-w-7xl px-4 py-6 sm:px-8'}>
        <h1 className={'max-w-3xl text-lg leading-7 text-gray-600'}>
          NextSpot is designed for users to plan out their next getaway. Users
          can book trips to destinations that they would like to visit and leave
          reviews of spots.
        </h1>
      </div>
      <div className={'mx-auto grid max-w-7xl grid-cols-1 gap-x-6 gap-y-10 px-4 pb-12 sm:grid-cols-2 sm:px-8 lg:grid-cols-3 xl:grid-cols-4'}>
        {Object.values(spots).length > 0 ? (
          Object.values(spots).map((spot, i) => {
            return (
              <div className={'min-w-0'} key={i}>
                <SpotCard spot={spot.spot} />
              </div>
            );
          })
        ) : (
          <p>No spots yet!</p>
        )}
      </div>
    </div>
  );
}

export default HomePage;
