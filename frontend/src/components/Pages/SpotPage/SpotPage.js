import React, { useState } from "react";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import ReviewForm from "../../forms/ReviewForm";

import BookingForm from "../../forms/BookingsForm";
import ReviewCard from "../../Elements/ReviewCard";
import Oops from "../Oops";

import { useClickOutside } from "../../../App";

function SpotPage() {
  const { spotId } = useParams();

  let spots = useSelector((state) => state.spots);

  const [display, setDisplay] = useState(false);

  const modalRef = useClickOutside(() => {
    setDisplay(false);
  });
  if (!spots[spotId]) return <Oops />;
  let spot = spots[spotId].spot;
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
  return (
    <div className={'mx-auto max-w-6xl px-4 pb-12 sm:px-8'}>
      <div className={'py-5 font-semibold'}>
        <h1>{spot.name}</h1>
        <div>
          {rating > 0 ? rating : "New"}{" "}
          <img alt="star" className={'inline h-3 w-3'} src="/static/star.svg" />{" "}
          <strong>·</strong> {reviews.length} reviews <strong>·</strong>{" "}
          {spot.city}, {spot.state}, United States
        </div>
      </div>
      <div className={'grid h-[24rem] grid-cols-1 gap-2 overflow-hidden rounded-2xl md:grid-cols-2'}>
        <div className={'h-full w-full overflow-hidden'}>
          <img
            className={`${'h-full w-full object-cover'} ${'h-full w-full overflow-hidden'}`}
            src={`${spot.img1}`}
            alt="The house"
          />
        </div>
        <div className={'hidden h-full grid-rows-2 gap-2 md:grid'}>
          <div className={'grid min-h-0 grid-cols-2 gap-2'}>
            <div className={'min-h-0 overflow-hidden'}>
              <img
                className={`${'h-full w-full object-cover'} `}
                src={`${spot.img2}`}
                alt="The house"
              />
            </div>
            <div className={`${'min-h-0 overflow-hidden'} ${'rounded-tr-2xl'}`}>
              <img
                className={`${'h-full w-full object-cover'} ${'rounded-tr-2xl'}`}
                src={`${spot.img3}`}
                alt="The house"
              />
            </div>
          </div>
          <div className={'grid min-h-0 grid-cols-2 gap-2'}>
            <div className={'min-h-0 overflow-hidden'}>
              <img
                className={`${'h-full w-full object-cover'} `}
                src={`${spot.img4}`}
                alt="The house"
              />
            </div>
            <div className={`${'min-h-0 overflow-hidden'} ${'rounded-br-2xl'}`}>
              <img
                className={`${'h-full w-full object-cover'}  ${'rounded-br-2xl'}`}
                src={`${spot.img5}`}
                alt="The house"
              />
            </div>
          </div>
        </div>
      </div>
      <div className={'mt-8 flex flex-col gap-10 border-y border-gray-200 py-8 lg:flex-row'}>
        <div className={'flex-1'}>
          <div className={'border-b border-gray-200 pb-8'}>
            <img
              alt="spot cover"
              className={'mb-4 h-14 w-36'}
              src="/static/spotcover.svg"
            />
            <div>
              Every booking includes free protection from Host cancellations,
              listing inaccuracies, and other issues like trouble checking in.
            </div>
          </div>
          <div className={'border-b border-gray-200 py-8'}>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
            eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim
            ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut
            aliquip ex ea commodo consequat. Duis aute irure dolor in
            reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla
            pariatur. Excepteur sint occaecat cupidatat non proident, sunt in
            culpa qui officia deserunt mollit anim id est laborum.
          </div>
          <div className={'py-8'}>
            <strong className={'text-xl font-semibold'}>What this spot offers</strong>
            <div className={'grid grid-cols-1 gap-6 sm:grid-cols-2'}>
              <div className={'space-y-5 py-5'}>
                <div className={'flex items-center'}>
                  <img
                    alt="amenities"
                    className={'mr-4 h-6 w-6'}
                    src="/static/stay.svg"
                  />
                  <div>Long term stays allowed</div>
                </div>
                <div className={'flex items-center'}>
                  <img
                    alt="amenities"
                    className={'mr-4 h-6 w-6'}
                    src="/static/waterfront.svg"
                  />
                  <div>Waterfront</div>
                </div>
                <div className={'flex items-center'}>
                  <img
                    alt="amenities"
                    className={'mr-4 h-6 w-6'}
                    src="/static/kitchen.svg"
                  />
                  <div>Kitchen</div>
                </div>
                <div className={'flex items-center'}>
                  <img
                    alt="amenities"
                    className={'mr-4 h-6 w-6'}
                    src="/static/wifi.svg"
                  />
                  <div>Wifi</div>
                </div>
                <div className={'flex items-center'}>
                  <img
                    alt="amenities"
                    className={'mr-4 h-6 w-6'}
                    src="/static/workspace.svg"
                  />
                  <div>Dedicated workspace</div>
                </div>
              </div>
              <div className={'space-y-5 py-5'}>
                <div className={'flex items-center'}>
                  <img
                    alt="amenities"
                    className={'mr-4 h-6 w-6'}
                    src="/static/parking.svg"
                  />
                  <div>Free parking on premises</div>
                </div>
                <div className={'flex items-center'}>
                  <img
                    alt="amenities"
                    className={'mr-4 h-6 w-6'}
                    src="/static/tv.svg"
                  />
                  <div>50" HDTV with Roku</div>
                </div>
                <div className={'flex items-center'}>
                  <img
                    alt="amenities"
                    className={'mr-4 h-6 w-6'}
                    src="/static/washer.svg"
                  />
                  <div>Free washer – In unit</div>
                </div>
                <div className={'flex items-center'}>
                  <img
                    alt="amenities"
                    className={'mr-4 h-6 w-6'}
                    src="/static/dryer.svg"
                  />
                  <div>Free dryer – In unit</div>
                </div>
                <div className={'flex items-center'}>
                  <img
                    alt="amenities"
                    className={'mr-4 h-6 w-6'}
                    src="/static/ac.svg"
                  />
                  <div>Central air conditioning</div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className={'w-full lg:sticky lg:top-24 lg:w-[25rem] lg:self-start'}>
          <BookingForm
            rating={rating}
            spot={spot}
            reviewsTotal={reviews.length}
          />
        </div>
      </div>
      <div className={'py-8'}>
        <div className={'text-xl font-semibold'}>
          <div>
            {rating > 0 ? rating : "New"}{" "}
            <img alt="star" className={'inline h-3 w-3'} src="/static/star.svg" />{" "}
            <strong>·</strong> {reviews.length}{" "}
            {reviews.length === 1 ? "Review" : "Reviews"}
          </div>
        </div>
        <div className={'mt-6 flex flex-wrap justify-between gap-6'}>
          {reviews.length > 0 ? (
            <div>
              <ReviewCard
                reviews={reviews}
                review={reviews[reviews.length - 1]}
                rating={rating}
              />
            </div>
          ) : (
            "Be the first to leave a review!"
          )}
          {reviews.length > 1 ? (
            <div>
              <ReviewCard reviews={reviews} review={reviews[0]} />
            </div>
          ) : null}
        </div>
        {display === true ? (
          <>
            <div className={'mt-6'}>
              <ReviewForm
                innerRef={modalRef}
                setDisplay={setDisplay}
                spotId={spot.id}
              />
            </div>
          </>
        ) : (
          <div className={'mt-6'}>
            <div
              className={'inline-flex cursor-pointer rounded-lg bg-rose-500 px-5 py-3 font-bold text-white hover:bg-rose-600'}
              onClick={() => setDisplay(!display)}
            >
              Add a review
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default SpotPage;
