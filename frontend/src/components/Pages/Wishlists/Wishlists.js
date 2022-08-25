import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { thunkGetWishlists } from "../../../store/wishlists";
import classes from "./Wishlists.module.css";

function Wishlists() {
  const dispatch = useDispatch();
  useEffect(async () => {
    await dispatch(thunkGetWishlists(user.id));
  }, [dispatch]);
  const wishlistsObj = useSelector((state) => state.wishlists);
  const user = useSelector((state) => state.session.user);

  const wishlists = Object.values(wishlistsObj);
  return (
    <div>
      <div className={classes.mainContainer}>
        {wishlists.length > 0 ? (
          wishlists.map((list, i) => {
            return list.name;
          })
        ) : (
          <p>No lists yet!</p>
        )}
      </div>
    </div>
  );
}

export default Wishlists;
