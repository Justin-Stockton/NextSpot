import React, { useState } from "react";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import ReviewForm from "../../forms/ReviewForm";

import BookingForm from "../../forms/BookingsForm";
import classes from "./SpotPage.module.css";
import ReviewCard from "../../Elements/ReviewCard";

function SpotPage() {
  const { spotId } = useParams();
  let spot = useSelector((state) => state.spots[spotId].spot);
  console.log(spot);
  let reviews = Object.values(spot.reviews);

  let ratings = 0;

  reviews.forEach((review) => {
    ratings += review.rating;
  });

  let rating;

  if ((ratings / reviews.length).toFixed(2).toString().split("")[3] === "0") {
    rating = (ratings / reviews.length).toFixed(1);
  } else {
    rating = (ratings / reviews.length).toFixed(2);
  }

  const [display, setDisplay] = useState(false);

  return (
    <div className={classes.mainContainer}>
      <div className={classes.nameHeading}>
        <h1>{spot.name}</h1>
        <div>
          {rating > 0 ? rating : "New"}{" "}
          <img className={classes.star} src="/static/star.svg" />{" "}
          <strong>·</strong> {reviews.length} reviews <strong>·</strong>{" "}
          {spot.city}, {spot.state}, United States
        </div>
      </div>
      <div className={classes.photos}>
        <div className={classes.mainImg}>
          <img
            className={`${classes.img} ${classes.mainImg}`}
            src={`${spot.img1}`}
            alt="The house"
          />
        </div>
        <div className={classes.subimgContainer}>
          <div className={classes.topImgs}>
            <div className={classes.subImg}>
              <img
                className={`${classes.img} `}
                src={`${spot.img2}`}
                alt="The house"
              />
            </div>
            <div className={`${classes.subImg} ${classes.topRight}`}>
              <img
                className={`${classes.img} ${classes.topRight}`}
                src={`${spot.img3}`}
                alt="The house"
              />
            </div>
          </div>
          <div className={classes.bottomImgs}>
            <div className={classes.subImg}>
              <img
                className={`${classes.img} `}
                src={`${spot.img4}`}
                alt="The house"
              />
            </div>
            <div className={`${classes.subImg} ${classes.bottomRight}`}>
              <img
                className={`${classes.img}  ${classes.bottomRight}`}
                src={`${spot.img5}`}
                alt="The house"
              />
            </div>
          </div>
        </div>
      </div>
      <div className={classes.bottomContainer}>
        <div className={`${classes.textContainer}`}>
          <div className={classes.spotCoverContainer}>
            <img className={classes.spotCover} src="/static/spotcover.svg" />
            <div>
              Every booking includes free protection from Host cancellations,
              listing inaccuracies, and other issues like trouble checking in.
            </div>
          </div>
          <div>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
            eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim
            ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut
            aliquip ex ea commodo consequat. Duis aute irure dolor in
            reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla
            pariatur. Excepteur sint occaecat cupidatat non proident, sunt in
            culpa qui officia deserunt mollit anim id est laborum.
          </div>
          <div style={{ borderBottom: "none" }}>
            <strong style={{ fontSize: "22px" }}>What this spot offers</strong>
            <div className={classes.amenitiesContainer}>
              <div className={classes.amenities}>
                <div className={classes.subContainer}>
                  <img
                    className={classes.amenitiesIcons}
                    src="/static/stay.svg"
                  />
                  <div>Long term stays allowed</div>
                </div>
                <div className={classes.subContainer}>
                  <img
                    className={classes.amenitiesIcons}
                    src="/static/waterfront.svg"
                  />
                  <div>Waterfront</div>
                </div>
                <div className={classes.subContainer}>
                  <img
                    className={classes.amenitiesIcons}
                    src="/static/kitchen.svg"
                  />
                  <div>Kitchen</div>
                </div>
                <div className={classes.subContainer}>
                  <img
                    className={classes.amenitiesIcons}
                    src="/static/wifi.svg"
                  />
                  <div>Wifi</div>
                </div>
                <div className={classes.subContainer}>
                  <img
                    className={classes.amenitiesIcons}
                    src="/static/workspace.svg"
                  />
                  <div>Dedicated workspace</div>
                </div>
              </div>
              <div className={classes.amenities}>
                <div className={classes.subContainer}>
                  <img
                    className={classes.amenitiesIcons}
                    src="/static/parking.svg"
                  />
                  <div>Free parking on premises</div>
                </div>
                <div className={classes.subContainer}>
                  <img
                    className={classes.amenitiesIcons}
                    src="/static/tv.svg"
                  />
                  <div>50" HDTV with Roku</div>
                </div>
                <div className={classes.subContainer}>
                  <img
                    className={classes.amenitiesIcons}
                    src="/static/washer.svg"
                  />
                  <div>Free washer – In unit</div>
                </div>
                <div className={classes.subContainer}>
                  <img
                    className={classes.amenitiesIcons}
                    src="/static/dryer.svg"
                  />
                  <div>Free dryer – In unit</div>
                </div>
                <div className={classes.subContainer}>
                  <img
                    className={classes.amenitiesIcons}
                    src="/static/ac.svg"
                  />
                  <div>Central air conditioning</div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className={classes.formContainer}>
          <BookingForm spot={spot} reviewsTotal={reviews.length} />
        </div>
      </div>
      <div className={classes.reviewsMainContainer}>
        <div className={classes.reviewsContainer}>
          <div>
            {rating > 0 ? rating : "New"}{" "}
            <img className={classes.star} src="/static/star.svg" />{" "}
            <strong>·</strong> {reviews.length}{" "}
            {reviews.length === 1 ? "Review" : "Reviews"}
          </div>
        </div>
        <div className={classes.reviews}>
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
            <div>
              <ReviewForm spotId={spot.id} />
            </div>
            <div
              className={classes.addAReview}
              onClick={() => setDisplay(false)}
            >
              Close
            </div>
          </>
        ) : (
          <div className={classes.addAReview} onClick={() => setDisplay(true)}>
            Add a review
          </div>
        )}
      </div>
    </div>
  );
}

export default SpotPage;

// {spot.img1?`style={{backgroundImage:'${spot.img1}'}}`:null}
