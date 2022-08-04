import React from "react";

function ReviewCard({ review }) {
  return (
    <>
      <div>
        <div>{review.username}</div>
        <div>{review.review}</div>
      </div>
    </>
  );
}

export default ReviewCard;
