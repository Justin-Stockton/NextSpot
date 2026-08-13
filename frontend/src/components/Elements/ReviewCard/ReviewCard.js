import React, { useState } from "react";
import ReviewModal from "../ReviewModal";

import { useClickOutside } from "../../../App";

function ReviewCard({ review, reviews, rating }) {
  const [display, setDisplay] = useState(false);

  const modalRef = useClickOutside(() => {
    setDisplay(false);
  });

  return (
    <>
      {display ? (
        <ReviewModal
          innerRef={modalRef}
          rating={rating}
          reviews={reviews}
          setDispaly={setDisplay}
        />
      ) : null}
      <div className={'mb-10 w-full max-w-md'}>
        <div className={'pb-2 text-xl font-semibold'}>{review.username}</div>
        <div className={'max-h-20 overflow-hidden text-lg leading-7'}>{review.review}</div>
        <div
          className={'mt-2 flex w-fit cursor-pointer items-center font-bold underline'}
          onClick={() => {
            setDisplay(!display);
          }}
        >
          Show more{" "}
          <img
            className={'ml-1 h-3 w-3'}
            alt="arrow right"
            src="/static/rightArrow.svg"
          ></img>
        </div>
      </div>
    </>
  );
}

export default ReviewCard;
