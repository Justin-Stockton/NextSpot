import React from "react";
import { useDispatch } from "react-redux";
import { useHistory } from "react-router-dom";
import { thunkDeleteWishlist } from "../../../store/wishlists";
import classes from "./ConfirmDelete.module.css";

function ConfirmDelete({ setDisplay, confirmRef, name, id }) {
  const history = useHistory();
  const dispatch = useDispatch();
  const handleDelete = async (e) => {
    e.preventDefault();
    await dispatch(thunkDeleteWishlist(id));

    history.push("/my-wishlists");
  };
  return (
    <>
      <div ref={confirmRef}>
        <div className={classes.top}>
          <div className={classes.xContainer} onClick={() => setDisplay(false)}>
            <img className={classes.x} src="/static/backArrow.svg" />
          </div>
          <strong>Delete this wishlist?</strong>
          <div className={classes.deleteContainer}></div>
        </div>
        <div className={classes.body}>
          Are you sure you want to delete {name}?
        </div>
        <div className={classes.buttonContainer}>
          <div
            className={classes.cancelContainer}
            onClick={() => setDisplay(false)}
          >
            <strong className={classes.cancel}>Cancel</strong>
          </div>
          <button onClick={handleDelete} className={classes.createButton}>
            Yes, delete
          </button>
        </div>
      </div>
    </>
  );
}

export default ConfirmDelete;
