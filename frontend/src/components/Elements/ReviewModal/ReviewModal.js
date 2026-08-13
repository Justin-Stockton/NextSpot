import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { thunkDeleteReview } from "../../../store/reviews";
import EditReviewForm from "../../forms/EditReviewForm";

function ReviewModal({ reviews, setDispaly, rating, innerRef }) {
  let user = useSelector((state) => state.session.user);
  const dispatch = useDispatch();

  return (
    <>
      {user ? (
        <div className={'fixed inset-0 z-30 flex justify-center bg-gray-900/40 p-4'}>
          <div ref={innerRef} className={'mt-16 max-h-[75vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-white p-6 shadow-2xl'}>
            <div className={'flex min-h-[40px] items-center justify-between text-xl font-bold'}>
              <div>
                <img
                  onClick={() => setDispaly(false)}
                  className={'h-6 w-6 cursor-pointer rounded-full p-1 hover:bg-gray-100'}
                  src="/static/x.svg"
                  alt="delete"
                />
              </div>
              <div style={{ display: "flex", alignItems: "center" }}>
                <img
                  alt="star"
                  className={'mx-1 inline h-4 w-4'}
                  src="/static/star.svg"
                />
                <span style={{ fontSize: "18px" }}>
                  {rating} · Reviews {reviews.length}
                </span>
              </div>
            </div>

            {reviews.map((review, i) => {
              return (
                <div key={i} className={'mt-5 border-b border-gray-200 pb-5'}>
                  <div className={'flex items-center justify-between text-xl font-semibold'}>
                    {review.username}{" "}
                    <span style={{ display: "flex", alignItems: "center" }}>
                      {review.rating}
                      <img
                        className={'mx-1 inline h-4 w-4'}
                        alt="star"
                        src="/static/star.svg"
                      />
                      {user.id === review.userId ? (
                        <div
                          className={'ml-3 flex h-8 w-8 cursor-pointer items-center justify-center rounded-full hover:bg-gray-100'}
                          onClick={() =>
                            dispatch(
                              thunkDeleteReview({
                                reviewId: review.id,
                                spotId: review.spotId,
                              })
                            )
                          }
                        >
                          <img
                            className={'h-6 w-6 cursor-pointer rounded-full p-1 hover:bg-gray-100'}
                            src="/static/trashcan.svg"
                            alt="delete"
                          />
                        </div>
                      ) : null}
                    </span>
                  </div>
                  <div className={'py-4 leading-7'}>{review.review}</div>
                  {user.id === review.userId ? (
                    <>
                      <EditReviewForm
                        spotId={review.spotId}
                        currentReview={review}
                      />
                    </>
                  ) : null}
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        <>
          <div className={'fixed inset-0 z-30 flex justify-center bg-gray-900/40 p-4'}>
            <div className={'mt-16 max-h-[75vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-white p-6 shadow-2xl'}>
              <div className={'flex min-h-[40px] items-center justify-between text-xl font-bold'}>
                <div>
                  <img
                    onClick={() => setDispaly(false)}
                    className={'h-6 w-6 cursor-pointer rounded-full p-1 hover:bg-gray-100'}
                    src="/static/x.svg"
                    alt="delete"
                  />
                </div>
                <div style={{ display: "flex", alignItems: "center" }}>
                  <img
                    alt="star"
                    className={'mx-1 inline h-4 w-4'}
                    src="/static/star.svg"
                  />
                  <span style={{ fontSize: "18px" }}>
                    {rating} · Reviews {reviews.length}
                  </span>
                </div>
              </div>
              {reviews.map((review, i) => {
                return (
                  <div key={i} className={'mt-5 border-b border-gray-200 pb-5'}>
                    <div className={'flex items-center justify-between text-xl font-semibold'}>
                      {review.username}{" "}
                      <span style={{ display: "flex", alignItems: "center" }}>
                        {review.rating}
                        <img
                          className={'mx-1 inline h-4 w-4'}
                          alt="star"
                          src="/static/star.svg"
                        />
                      </span>
                    </div>
                    <div className={'py-4 leading-7'}>{review.review}</div>{" "}
                  </div>
                );
              })}
            </div>
          </div>
        </>
      )}
    </>
  );
}

export default ReviewModal;
