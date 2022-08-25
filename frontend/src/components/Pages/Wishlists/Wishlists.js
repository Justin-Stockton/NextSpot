import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { thunkGetWishlists } from "../../../store/wishlists";
import classes from "./Wishlists.module.css";
import Wishlist from "../../Elements/Wishlist";
function Wishlists() {
  const dispatch = useDispatch();
  useEffect(async () => {
    await dispatch(thunkGetWishlists(user.id));
  }, [dispatch]);
  const wishlistsObj = useSelector((state) => state.wishlists);
  const user = useSelector((state) => state.session.user);

  const wishlists = Object.values(wishlistsObj);
  return (
    <div className={classes.body}>
      <h1 className={classes.header}>Wishlists</h1>
      <div className={classes.mainContainer}>
        {wishlists.length > 0 ? (
          wishlists.map((list, i) => {
            return <Wishlist key={i} list={list} />;
          })
        ) : (
          <h1 className={classes.header}>No lists yet!</h1>
        )}
      </div>
    </div>
  );
}

export default Wishlists;
