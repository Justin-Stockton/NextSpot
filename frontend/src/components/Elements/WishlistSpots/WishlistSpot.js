import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import { useDispatch } from "react-redux";
import { ReactComponent as HeartSVG } from "./heart.svg";
import { thunkDeleteWishspot } from "../../../store/wishspots";
import Modal from "../Modal";
import { useClickOutside } from "../../../App";

function WishlistSpot({ spot, id, wishlistId }) {
  const history = useHistory();
  const dispatch = useDispatch();

  const spotObj = spot.spot;

  const imgArray = [
    spotObj.img1,
    spotObj.img2,
    spotObj.img3,
    spotObj.img4,
    spotObj.img5,
  ];

  const [count, setCount] = useState(0);
  const [img, setImg] = useState(imgArray[count]);
  const [filled, setFilled] = useState(true);
  const [display, setDisplay] = useState(false);
  const [formDisplay, setFormDisplay] = useState(false);

  const handleNext = () => {
    count < 4 ? setCount(count + 1) : setCount(0);
    setImg(imgArray[count]);
  };

  const handlePrevious = () => {
    count > 0 ? setCount(count - 1) : setCount(4);
    setImg(imgArray[count]);
  };

  let reviews = Object.values(spotObj.reviews);
  let ratings = 0;
  let rating;

  reviews.forEach((review) => {
    ratings += review.rating;
  });

  if ((ratings / reviews.length).toFixed(2).toString().split("")[3] === "0") {
    rating = (ratings / reviews.length).toFixed(1);
  } else {
    rating = (ratings / reviews.length).toFixed(2);
  }

  const handleClick = () => {
    let data = {
      spotId: spotObj.id,
      wishlistId: wishlistId,
    };
    if (filled) dispatch(thunkDeleteWishspot(data));
    if (!filled) setDisplay(true);
    setFilled(false);
  };

  const modalRef = useClickOutside(() => {
    setDisplay(false);
  });
  return (
    <>
      <Modal
        display={display}
        formDisplay={formDisplay}
        setDisplay={setDisplay}
        setFormDisplay={setFormDisplay}
        innerRef={modalRef}
        spot={spotObj}
        setFilled={setFilled}
      />
      <div className={'flex flex-col gap-5 border-b border-gray-200 pb-6 sm:flex-row'}>
        <div className={'group relative h-52 w-full overflow-hidden rounded-xl bg-gray-200 sm:w-2/5'}>
          <div className={'absolute inset-x-3 top-1/2 z-10 flex -translate-y-1/2 justify-between'}>
            <div className={'invisible flex h-8 w-8 cursor-pointer items-center justify-center rounded-full bg-white/90 shadow group-hover:visible'} onClick={handlePrevious}>
              <img
                className={'h-4 w-4'}
                src="/media/leftArrow.svg"
                alt="back"
              />
            </div>
            <div className={'invisible flex h-8 w-8 cursor-pointer items-center justify-center rounded-full bg-white/90 shadow group-hover:visible'} onClick={handleNext}>
              <img
                onClick={handleNext}
                className={'h-4 w-4'}
                src="/media/next.svg"
                alt="next"
              />
            </div>
          </div>

          <img
            onClick={() => history.push(`/spots/${spotObj.id}`)}
            alt="Spot"
            className={'h-full w-full cursor-pointer object-cover'}
            src={imgArray[count]}
          />
        </div>
        <div className={'flex flex-1 flex-col justify-between'}>
          <div className={'flex justify-between gap-3'}>
            <div className={'text-xl font-semibold'}>{spotObj.name}</div>
            <div className={'h-7 w-7 cursor-pointer'} onClick={() => handleClick()}>
              <HeartSVG fill={filled ? "#FF385C" : "rgba(0,0,0,.7)"} />
            </div>
          </div>
          <div className={'flex justify-between gap-3 text-sm'}>
            {rating > 0 ? (
              <>
                <div>
                  <strong>
                    <img
                      className={'mr-1 inline h-3 w-3'}
                      alt="star"
                      src="/media/star.svg"
                    />
                    {rating}
                  </strong>{" "}
                  ({reviews.length} {reviews.length > 1 ? "reviews" : "review"})
                </div>
              </>
            ) : (
              <strong>
                <img
                  alt="star"
                  className={'mr-1 inline h-3 w-3'}
                  src="/media/star.svg"
                />
                New
              </strong>
            )}
            <div>
              <strong>$ {spotObj.price}</strong> night
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default WishlistSpot;
