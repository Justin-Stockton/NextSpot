import React from "react";
import { useSelector } from "react-redux";
import { useHistory } from "react-router-dom";

function Wishlist({ list }) {
  const history = useHistory();
  const user = useSelector((state) => state.session.user);
  let wishSpots;
  let spotIDs;
  const spotObj = useSelector((state) => state.spots);

  if (list.wishspots) {
    wishSpots = Object.values(list.wishspots);
    spotIDs = wishSpots.map((spot) => {
      return spot.spotId;
    });
  }

  const handleClick = () => {
    history.push(`/${user.username}/${list.id}`);
  };

  return (
    <div className={'min-w-0 cursor-pointer'} onClick={handleClick}>
      {wishSpots && wishSpots.length ? (
        <div className={'flex h-40 gap-1 overflow-hidden rounded-xl bg-gray-200 sm:h-48'}>
          <>
            <div className={'h-full w-2/3 object-cover'}>
              <img
                alt="Wishlist cover"
                className={'h-full w-full object-cover'}
                src={`${spotObj[spotIDs[0]].spot.img1}`}
              />
            </div>
            <div className={'flex w-1/3 flex-col gap-1'}>
              <div className={'h-1/2 w-full object-cover'}>
                <img
                  alt="Wishlist preview"
                  className={'h-full w-full object-cover'}
                  src={`${spotObj[spotIDs[0]].spot.img2}`}
                />
              </div>
              <div className={'h-1/2 w-full object-cover'}>
                <img
                  alt="Wishlist preview"
                  className={'h-full w-full object-cover'}
                  src={`${spotObj[spotIDs[0]].spot.img3}`}
                />
              </div>
            </div>
          </>
        </div>
      ) : (
        <div className={'h-40 w-full rounded-xl bg-gray-200 sm:h-48'}></div>
      )}
      <div className={'py-3 text-xl font-semibold'}>{list.name}</div>
    </div>
  );
}

export default Wishlist;
