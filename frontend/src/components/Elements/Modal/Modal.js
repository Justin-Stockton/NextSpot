import React from "react";
import { useSelector } from "react-redux";
import ListCards from "../ListCards";
import classes from "./Modal.module.css";

function Modal({ display, setDisplay, innerRef }) {
  let listsObj = useSelector((state) => state.wishlists);
  let lists = Object.values(listsObj);
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
            <div className={classes.newList}>
              <div className={classes.addButton}>
                <img className={classes.plus} src="static/plus.svg" />
              </div>
              <strong className={classes.create}>Create new wishlist</strong>
            </div>
            {lists.map((list, i) => {
              return <ListCards key={i} list={list} />;
            })}
          </div>
        </div>
      ) : null}
    </>
  );
}

export default Modal;
