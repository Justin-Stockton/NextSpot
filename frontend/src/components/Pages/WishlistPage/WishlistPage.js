import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { thunkGetWishlists } from "../../../store/wishlists";
import classes from "./WishlistPage.module.css";

function WishlistPage() {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.session.user);
  const url = useParams();

  const wishlist = useSelector((state) => state.wishlists[url.wishlistId]);

  const spots = Object.values(wishlist.wishspots);
  console.log(spots);

  useEffect(() => {
    dispatch(thunkGetWishlists(user.id));
  }, [dispatch]);

  return (
    <>
      <div className={classes.mainContainer}>
        <div className={classes.mainContentContainer}>
          <div className={classes.mainContentNav}>
            <div>BACK</div>
            <div className={classes.rightButtonContainer}>
              <div>1</div>
              <div>2</div>
            </div>
          </div>
          <div>{wishlist ? wishlist.name : null}</div>
          <div>components</div>
        </div>
        <div className={classes.mapContainer}></div>
      </div>
    </>
  );
}

export default WishlistPage;
