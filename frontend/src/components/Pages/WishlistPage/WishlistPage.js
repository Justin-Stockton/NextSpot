import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory, useParams } from "react-router-dom";
import { thunkGetWishlists } from "../../../store/wishlists";
import classes from "./WishlistPage.module.css";
import { useClickOutside } from "../../../App";
import EditWishlistModal from "../../Elements/EditWishlistModal";

function WishlistPage() {
  const history = useHistory();
  const dispatch = useDispatch();
  const user = useSelector((state) => state.session.user);
  const url = useParams();
  const [formDisplay, setFormDisplay] = useState(false);

  useEffect(async () => {
    await dispatch(thunkGetWishlists(user.id));
  }, [dispatch]);

  const wishlist = useSelector((state) => state.wishlists[url.wishlistId]);

  //   const spots = Object.values(wishlist.wishspots);

  const popupRef = useClickOutside(() => {
    setFormDisplay(false);
  });

  const copy = () => {
    navigator.clipboard.writeText(window.location.href);
  };

  return (
    <>
      {wishlist ? (
        <>
          <div className={classes.mainContainer}>
            <div
              style={{ marginTop: "2%" }}
              className={classes.mainContentContainer}
            >
              <div className={classes.mainContentNav}>
                <div onClick={() => history.push("/my-wishlists")}>
                  <img className={classes.icons} src="/static/backArrow.svg" />
                </div>
                <div className={classes.rightButtonContainer}>
                  <div onClick={copy}>
                    <img className={classes.icons} src="/static/copy.svg" />
                  </div>
                  <div onClick={() => setFormDisplay(true)}>
                    <img className={classes.icons} src="/static/threedot.svg" />
                  </div>
                </div>
              </div>
              <div className={classes.title}>{wishlist.name}</div>
              <div>components</div>
            </div>
            <div className={classes.mapContainer}></div>
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
