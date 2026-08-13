import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import { ReactComponent as HeartSVG } from "./heart.svg";
import { useSelector } from "react-redux";
import Modal from "../Modal/Modal";
import { useClickOutside } from "../../../App";

function SpotCard({ spot }) {
  const imgArray = [spot.img1, spot.img2, spot.img3, spot.img4, spot.img5];
  const [count, setCount] = useState(0);
  const [img, setImg] = useState(imgArray[count]);
  const [filled, setFilled] = useState(false);
  const [display, setDisplay] = useState(false);
  const [formDisplay, setFormDisplay] = useState(false);
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
    count < 4 ? setCount(count + 1) : setCount(0);
    setImg(imgArray[count]);
  };

  const handlePrevious = () => {
    count > 0 ? setCount(count - 1) : setCount(4);
    setImg(imgArray[count]);
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
      <div className={'group relative h-72 w-full overflow-hidden rounded-2xl bg-gray-200'}>
        <div className={'absolute right-3 top-3 z-10'}>
          <HeartSVG
            className={'h-7 w-7 cursor-pointer drop-shadow'}
            onClick={handleClick}
            fill={filled ? "#FF385C" : "rgba(0,0,0,.7)"}
          />
        </div>
        <div className={'invisible absolute right-3 top-1/2 z-10 flex h-8 w-8 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full bg-white/90 shadow group-hover:visible'} onClick={handleNext}>
          <img
            onClick={handleNext}
            className={'h-4 w-4'}
            src="static/next.svg"
            alt="house"
          />
        </div>
        <div className={'invisible absolute left-3 top-1/2 z-10 flex h-8 w-8 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full bg-white/90 shadow group-hover:visible'} onClick={handlePrevious}>
          <img
            className={'h-4 w-4'}
            src="static/leftArrow.svg"
            alt="back arrow"
          />
        </div>

        <img
          onClick={() => history.push(`/spots/${spot.id}`)}
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
              <img className={'mr-1 inline h-3 w-3'} src="/static/star.svg" alt="star" />
              {rating}
            </strong>
          ) : (
            <strong>
              <img className={'mr-1 inline h-3 w-3'} src="/static/star.svg" alt="star" />
              New
            </strong>
          )}
        </div>
      </div>
    </>
  );
}

export default SpotCard;
