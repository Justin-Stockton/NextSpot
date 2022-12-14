import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory, useParams } from "react-router-dom";
import { thunkGetWishlists } from "../../../store/wishlists";
import classes from "./WishlistPage.module.css";
import { useClickOutside } from "../../../App";
import EditWishlistModal from "../../Elements/EditWishlistModal";
import WishlistSpot from "../../Elements/WishlistSpots";

function WishlistPage() {
  const history = useHistory();
  const dispatch = useDispatch();
  const user = useSelector((state) => state.session.user);
  const url = useParams();
  const [formDisplay, setFormDisplay] = useState(false);

  useEffect(() => {
    dispatch(thunkGetWishlists(user.id));
  }, [dispatch, user.id]);

  const wishlist = useSelector((state) => state.wishlists[url.wishlistId]);
  const spots = useSelector((state) => state.spots);

  const popupRef = useClickOutside(() => {
    setFormDisplay(false);
  });

  const copy = () => {
    navigator.clipboard.writeText(window.location.href);
  };
  let lSpots;
  if (wishlist) lSpots = Object.values(wishlist.wishspots);

  return (
    <>
      {wishlist && spots ? (
        <>
          <div className={classes.mainContainer}>
            <div
              style={{ marginTop: "2%" }}
              className={classes.mainContentContainer}
            >
              <div className={classes.mainContentNav}>
                <div onClick={() => history.push("/my-wishlists")}>
                  <img
                    className={classes.icons}
                    alt="back"
                    src="/static/backArrow.svg"
                  />
                </div>
                <div className={classes.rightButtonContainer}>
                  <div onClick={copy}>
                    <img
                      className={classes.icons}
                      alt="copy"
                      src="/static/copy.svg"
                    />
                  </div>
                  <div onClick={() => setFormDisplay(true)}>
                    <img
                      className={classes.icons}
                      alt="menu"
                      src="/static/threedot.svg"
                    />
                  </div>
                </div>
              </div>
              <div className={classes.title}>{wishlist.name}</div>
              <div className={classes.spotsContainer}>
                {lSpots.length > 0 ? (
                  lSpots.map((spot, i) => {
                    return (
                      <div key={i}>
                        <WishlistSpot
                          id={spot.id}
                          spot={spots[spot.spotId]}
                          wishlistId={url.wishlistId}
                        />
                      </div>
                    );
                  })
                ) : (
                  <div>There are no spots in this list</div>
                )}
              </div>
            </div>
            <div className={classes.mapContainer}>
              <img
                className={classes.comingSoon}
                src="/static/coming_soon.png"
              />
            </div>
          </div>
          <EditWishlistModal
            innerRef={popupRef}
            formDisplay={formDisplay}
            setFormDisplay={setFormDisplay}
            wishlistId={url.wishlistId}
            listname={wishlist.name}
          />
        </>
      ) : null}
    </>
  );
}

export default WishlistPage;
