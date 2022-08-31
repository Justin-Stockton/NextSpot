import React, { useState } from "react";
import { useDispatch } from "react-redux";
import classes from "./EditWishlistModal.module.css";
import { thunkUpdateWishlist } from "../../../store/wishlists";

function EditWishlistModal({
  innerRef,
  formDisplay,
  setFormDisplay,
  wishlistId,
  listname,
}) {
  const dispatch = useDispatch();
  const [name, setName] = useState(listname);

  const handleSubmit = (e) => {
    let data = {
      id: wishlistId,
      name,
    };

    dispatch(thunkUpdateWishlist(data));
    setFormDisplay(false);
  };

  return (
    <>
      {formDisplay ? (
        <div className={classes.background}>
          <div ref={innerRef} className={classes.reviewsContainer}>
            <div className={classes.top}>
              <div
                onClick={() => setFormDisplay(false)}
                className={classes.xContainer}
              >
                <img className={classes.x} src="/static/x.svg" />
              </div>
              <strong>Settings</strong>
              <div className={classes.deleteContainer}>
                <strong>Delete</strong>
              </div>
            </div>
            <form onSubmit={handleSubmit}>
              <div className={classes.form}>
                <input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className={classes.input}
                ></input>
                <p className={classes.subText}>50 characters maximum</p>
              </div>
              <div className={classes.buttonContainer}>
                <div className={classes.cancelContainer}>
                  <strong className={classes.cancel}>Cancel</strong>
                </div>
                {name.length > 0 && name.length < 50 ? (
                  <button
                    onClick={handleSubmit}
                    className={classes.createButton}
                  >
                    Save
                  </button>
                ) : (
                  <div className={classes.createButtonDisabled}>Save</div>
                )}
              </div>
            </form>
          </div>
        </div>
      ) : null}
    </>
  );
}

export default EditWishlistModal;
