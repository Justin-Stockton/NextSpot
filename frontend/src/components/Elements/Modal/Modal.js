import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { thunkCreateWishlist } from "../../../store/wishlists";
import ListCards from "../ListCards";
import classes from "./Modal.module.css";

function Modal({
  display,
  setDisplay,
  innerRef,
  formDisplay,
  setFormDisplay,
  setFilled,
  spot,
}) {
  let user = useSelector((state) => state.session.user);
  let listsObj = useSelector((state) => state.wishlists);
  let lists = Object.values(listsObj);
  const [name, setName] = useState("");
  const dispatch = useDispatch();

  const handleSubmit = (e) => {
    let data = {
      userId: user.id,
      name,
    };
    e.preventDefault();
    dispatch(thunkCreateWishlist(data));
    setFormDisplay(false);
    setDisplay(true);
  };

  return (
    <>
      {display ? (
        <div className={classes.background}>
          <div ref={innerRef} className={classes.reviewsContainer}>
            <div className={classes.top}>
              <div
                onClick={() => setDisplay(false)}
                className={classes.xContainer}
              >
                <img className={classes.x} src="static/x.svg" />
              </div>
              <strong>Your Wishlists</strong>
              <div className={classes.filler}></div>
            </div>
            <div
              className={classes.newList}
              onClick={() => {
                setDisplay(false);
                setFormDisplay(true);
              }}
            >
              <div className={classes.addButton}>
                <img className={classes.plus} src="static/plus.svg" />
              </div>
              <strong className={classes.create}>Create new wishlist</strong>
            </div>
            {lists.map((list, i) => {
              return (
                <ListCards
                  key={i}
                  list={list}
                  setFilled={setFilled}
                  setDisplay={setDisplay}
                  spot={spot}
                />
              );
            })}
          </div>
        </div>
      ) : null}
      {formDisplay ? (
        <div className={classes.background}>
          <div ref={innerRef} className={classes.reviewsContainer}>
            <div className={classes.top}>
              <div
                onClick={() => setFormDisplay(false)}
                className={classes.xContainer}
              >
                <img className={classes.x} src="static/x.svg" />
              </div>
              <strong>Name this wishlist</strong>
              <div className={classes.filler}></div>
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
                {name.length > 0 && name.length < 50 ? (
                  <button className={classes.createButton}>Create</button>
                ) : (
                  <div className={classes.createButtonDisabled}> Create</div>
                )}
              </div>
            </form>
          </div>
        </div>
      ) : null}
    </>
  );
}

export default Modal;
