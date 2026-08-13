import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { thunkCreateWishspot } from "../../../store/wishspots";

function ListCards({ list, setFilled, setDisplay, spot }) {
  const dispatch = useDispatch();
  let spots = useSelector((state) => state.spots);

  const handleClick = async () => {
    let data = {
      spotId: spot.id,
      wishlistId: list.id,
    };

    await dispatch(thunkCreateWishspot(data));
    setFilled(true);
    setDisplay(false);
  };
  return (
    <>
      {list.wishspots && Object.values(list.wishspots).length ? (
        <div className={'flex cursor-pointer items-center gap-4 px-5 py-3 hover:bg-gray-50'} onClick={handleClick}>
          <div className={'h-14 w-14 flex-none'}>
            <img
              alt="Wishlist preview"
              className={'h-14 w-14 rounded-xl object-cover'}
              src={`${
                spots[Object.values(list.wishspots)[0].spotId].spot.img1
              }`}
            />
          </div>
          <strong className={'font-semibold'}>{list.name}</strong>
        </div>
      ) : (
        <>
          <div className={'flex cursor-pointer items-center gap-4 px-5 py-3 hover:bg-gray-50'} onClick={handleClick}>
            <div className={'h-14 w-14 flex-none rounded-xl bg-gray-200'}></div>
            <strong className={'font-semibold'}>{list.name}</strong>
          </div>
        </>
      )}
    </>
  );
}

export default ListCards;
