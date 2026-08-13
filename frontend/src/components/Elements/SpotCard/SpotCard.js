import React, { useEffect, useRef, useState } from "react";
import { useHistory } from "react-router-dom";
import { ReactComponent as HeartSVG } from "./heart.svg";
import { useSelector } from "react-redux";
import Modal from "../Modal/Modal";
import { useClickOutside } from "../../../App";

function SpotCard({ spot }) {
  const imgArray = [spot.img1, spot.img2, spot.img3, spot.img4, spot.img5];
  const [count, setCount] = useState(0);
  const [filled, setFilled] = useState(false);
  const [display, setDisplay] = useState(false);
  const [formDisplay, setFormDisplay] = useState(false);
  const touchStart = useRef(null);
  const suppressClick = useRef(false);
  const history = useHistory();
  const user = useSelector((state) => state.session.user);
  const wishlistsObj = useSelector((state) => state.wishlists);

  const handleClick = () => {
    if (!user) {
      history.push("/login");
    }
    if (!filled) {
      setDisplay(true);
    }
  };

  let reviews = Object.values(spot.reviews);
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

  const handleNext = () => {
    setCount((current) => (current + 1) % imgArray.length);
  };

  const handlePrevious = () => {
    setCount((current) => (current - 1 + imgArray.length) % imgArray.length);
  };

  const handleTouchStart = ({ touches: [touch] }) => {
    touchStart.current = { x: touch.clientX, y: touch.clientY };
  };

  const handleTouchEnd = ({ changedTouches: [touch] }) => {
    if (!touchStart.current) return;

    const x = touchStart.current.x - touch.clientX;
    const y = touchStart.current.y - touch.clientY;
    touchStart.current = null;

    if (Math.abs(x) < 40 || Math.abs(x) < Math.abs(y)) return;
    suppressClick.current = true;
    setTimeout(() => (suppressClick.current = false), 0);
    x > 0 ? handleNext() : handlePrevious();
  };

  const handleSpotClick = () => {
    if (suppressClick.current) {
      suppressClick.current = false;
      return;
    }
    history.push(`/spots/${spot.id}`);
  };

  const popupRef = useClickOutside(() => {
    setDisplay(false);
    setFormDisplay(false);
  });

  useEffect(() => {
    if (!user) setFilled(false);
    let wishlistArr = Object.values(wishlistsObj);
    let wishlistArrAll = wishlistArr.map((obj) => obj.wishspots);
    let wishlistSpotIds = wishlistArrAll
      .map((obj) => Object.values(obj).map((spots) => spots.spotId))
      .flat();

    if (wishlistSpotIds && wishlistSpotIds.includes(spot.id)) {
      setFilled(true);
    } else {
      setFilled(false);
    }
  }, [wishlistsObj, spot.id, user]);

  return (
    <>
      <Modal
        innerRef={popupRef}
        display={display}
        setDisplay={setDisplay}
        formDisplay={formDisplay}
        setFormDisplay={setFormDisplay}
        spot={spot}
        setFilled={setFilled}
      />
      <div
        aria-label="Spot image gallery"
        className={'group relative h-72 w-full overflow-hidden rounded-2xl bg-gray-200'}
        onTouchEnd={handleTouchEnd}
        onTouchStart={handleTouchStart}
        role="group"
        style={{ touchAction: "pan-y" }}
      >
        <div className={'absolute right-3 top-3 z-10'}>
          <HeartSVG
            className={'h-7 w-7 cursor-pointer drop-shadow'}
            onClick={handleClick}
            fill={filled ? "#FF385C" : "rgba(0,0,0,.7)"}
          />
        </div>
        <button
          aria-label="Next image"
          className={'invisible absolute right-3 top-1/2 z-10 hidden h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 shadow hover:bg-white sm:flex sm:group-hover:visible'}
          onClick={handleNext}
          type="button"
        >
          <img className={'h-4 w-4'} src="/media/next.svg" alt="" />
        </button>
        <button
          aria-label="Previous image"
          className={'invisible absolute left-3 top-1/2 z-10 hidden h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 shadow hover:bg-white sm:flex sm:group-hover:visible'}
          onClick={handlePrevious}
          type="button"
        >
          <img className={'h-4 w-4'} src="/media/leftArrow.svg" alt="" />
        </button>

        <img
          onClick={handleSpotClick}
          alt="Spot"
          className={'h-full w-full cursor-pointer object-cover transition duration-300 group-hover:scale-105'}
          src={imgArray[count]}
        />
      </div>
      <div
        className={'flex cursor-pointer justify-between gap-3 pt-3 text-sm leading-6'}
        style={{ display: "flex", justifyContent: "space-between" }}
      >
        <div onClick={() => history.push(`/spots/${spot.id}`)}>
          <div>
            <div>
              <strong>
                {spot.city}, {spot.state}
              </strong>
            </div>
            <div>
              <strong>${spot.price}</strong> night
            </div>
          </div>
        </div>
        <div>
          {rating > 0 ? (
            <strong>
              <img className={'mr-1 inline h-3 w-3'} src="/media/star.svg" alt="star" />
              {rating}
            </strong>
          ) : (
            <strong>
              <img className={'mr-1 inline h-3 w-3'} src="/media/star.svg" alt="star" />
              New
            </strong>
          )}
        </div>
      </div>
    </>
  );
}

export default SpotCard;
